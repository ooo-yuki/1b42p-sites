import { Database } from 'bun:sqlite';

const PORT = 8095;
const db = new Database('data/mtt.db', { create: true });
db.run(`CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nick TEXT NOT NULL,
  score INTEGER NOT NULL,
  coins INTEGER NOT NULL,
  ts INTEGER NOT NULL
)`);

function cleanNick(v: unknown): string {
  const s = String(v ?? '').slice(0, 20).trim();
  return s || 'Братуха';
}

function num(v: unknown, lo: number, hi: number, fb = 0): number {
  const n = Number(v);
  if (!Number.isFinite(n)) return fb;
  return Math.max(lo, Math.min(hi, n));
}

// ---- комнаты: лобби + присутствие (позиции шлёт клиент, сервер раздаёт) ----
interface Member {
  sid: string;
  nick: string;
  x: number;
  z: number;
  yaw: number;
  hp: number;
  score: number;
  kills: number;
  wave: number;
  ts: number;
}
interface Room { id: string; name: string; created: number; players: Map<string, Member>; }
const rooms = new Map<string, Room>();
const STALE_MS = 12000;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function newSid(): string {
  const h = '0123456789abcdef';
  let s = '';
  for (let i = 0; i < 32; i++) s += h[Math.floor(Math.random() * 16)];
  return s;
}

function newCode(): string {
  let c = '';
  for (let i = 0; i < 6; i++) c += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  return rooms.has(c) ? newCode() : c;
}

function prune(room: Room): void {
  const now = Date.now();
  for (const [sid, m] of room.players) {
    if (now - m.ts > STALE_MS) room.players.delete(sid);
  }
}

function pubList(m: Member): object {
  return { nick: m.nick, x: m.x, z: m.z, hp: m.hp, score: m.score, kills: m.kills, wave: m.wave };
}

async function roomsApi(req: Request): Promise<Response | null> {
  const u = new URL(req.url);
  const p = u.pathname;
  if (!p.startsWith('/api/rooms')) return null;
  const parts = p.split('/').filter(Boolean); // ['api','rooms', id?, action?]

  if (req.method === 'GET' && parts.length === 2) {
    const out: object[] = [];
    for (const r of rooms.values()) {
      prune(r);
      if (r.players.size === 0) { rooms.delete(r.id); continue; }
      out.push({ id: r.id, name: r.name, count: r.players.size });
    }
    return Response.json(out);
  }

  let body: Record<string, unknown> = {};
  if (req.method === 'POST') {
    try { body = await req.json() as Record<string, unknown>; }
    catch { return Response.json({ error: 'bad' }, { status: 400 }); }
  }

  // создать комнату
  if (req.method === 'POST' && parts.length === 2) {
    const nick = cleanNick(body.nick);
    const name = String(body.name ?? '').slice(0, 24).trim() || `Комната ${nick}`;
    const id = newCode();
    const sid = newSid();
    const room: Room = { id, name, created: Date.now(), players: new Map() };
    room.players.set(sid, { sid, nick, x: 0, z: 22, yaw: 0, hp: 100, score: 0, kills: 0, wave: 1, ts: Date.now() });
    rooms.set(id, room);
    return Response.json({ id, sid });
  }

  if (parts.length < 4) return Response.json({ error: 'bad' }, { status: 404 });
  const room = rooms.get(parts[2].toUpperCase());
  if (!room) return Response.json({ error: 'noroom' }, { status: 404 });
  const action = parts[3];

  // войти
  if (req.method === 'POST' && action === 'join') {
    prune(room);
    if (room.players.size >= 8) return Response.json({ error: 'full' }, { status: 403 });
    const nick = cleanNick(body.nick);
    const sid = newSid();
    room.players.set(sid, { sid, nick, x: 0, z: 22, yaw: 0, hp: 100, score: 0, kills: 0, wave: 1, ts: Date.now() });
    return Response.json({ sid, name: room.name });
  }

  const sid = String(body.sid ?? '');
  const me = room.players.get(sid);
  if (!me) return Response.json({ error: 'nosid' }, { status: 403 });

  // пульс: обновить себя, забрать остальных
  if (req.method === 'POST' && action === 'beat') {
    me.x = num(body.x, -60, 60);
    me.z = num(body.z, -60, 60);
    me.yaw = num(body.yaw, -10, 10);
    me.hp = Math.round(num(body.hp, 0, 10000));
    me.score = Math.round(num(body.score, 0, 100000000));
    me.kills = Math.round(num(body.kills, 0, 1000000));
    me.wave = Math.round(num(body.wave, 1, 100, 1));
    me.ts = Date.now();
    prune(room);
    const others: object[] = [];
    for (const m of room.players.values()) {
      if (m.sid !== sid) others.push(pubList(m));
    }
    return Response.json({ players: others, count: room.players.size });
  }

  // выйти
  if (req.method === 'POST' && action === 'leave') {
    room.players.delete(sid);
    if (room.players.size === 0) rooms.delete(room.id);
    return Response.json({ ok: true });
  }

  return Response.json({ error: 'bad' }, { status: 404 });
}

Bun.serve({
  port: PORT,
  routes: {
    '/api/scores': () => {
      const rows = db.query('SELECT nick, score, coins FROM scores ORDER BY score DESC LIMIT 10').all();
      return Response.json(rows);
    },
    '/api/score': {
      POST: async (req) => {
        let body: { nick?: unknown; score?: unknown; coins?: unknown };
        try {
          body = await req.json();
        } catch {
          return Response.json({ error: 'bad' }, { status: 400 });
        }
        const score = Math.floor(Number(body.score));
        const coins = Math.floor(Number(body.coins));
        if (!Number.isFinite(score) || !Number.isFinite(coins) || score < 0 || coins < 0 || score > 100000000) {
          return Response.json({ error: 'bad' }, { status: 400 });
        }
        db.run('INSERT INTO scores (nick, score, coins, ts) VALUES (?, ?, ?, ?)', [
          cleanNick(body.nick), score, coins, Date.now(),
        ]);
        return Response.json({ ok: true });
      },
    },
  },
  fetch(req) {
    return roomsApi(req).then((r) => r ?? Response.json({ error: 'bad' }, { status: 404 }));
  },
});

console.log(`mtt-api on :${PORT}`);
