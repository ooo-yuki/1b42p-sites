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

function cleanLogin(v: unknown): string | null {
  const s = String(v ?? '').trim();
  return /^[A-Za-z0-9_]{3,16}$/.test(s) ? s : null;
}

// ---- аккаунты: логин+пароль (хеш через Bun.password, сессии — токены) ----
db.run(`CREATE TABLE IF NOT EXISTS users (
  login TEXT PRIMARY KEY,
  phash TEXT NOT NULL,
  created INTEGER NOT NULL
)`);
try { db.run('ALTER TABLE scores ADD COLUMN login TEXT DEFAULT ""'); } catch { /* уже есть */ }

async function registerUser(login: string, pass: string): Promise<{ ok: boolean; error?: string; token?: string }> {
  if (String(pass ?? '').length < 4 || String(pass ?? '').length > 64) return { ok: false, error: 'passlen' };
  const row = db.query('SELECT login FROM users WHERE login = ?').get(login) as { login: string } | null;
  if (row) return { ok: false, error: 'taken' };
  const phash = await Bun.password.hash(pass);
  const token = newSid();
  db.run('INSERT INTO users (login, phash, created) VALUES (?, ?, ?)', [login, phash, Date.now()]);
  db.run('CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, login TEXT NOT NULL, ts INTEGER NOT NULL)');
  db.run('INSERT INTO sessions (token, login, ts) VALUES (?, ?, ?)', [token, login, Date.now()]);
  return { ok: true, token };
}

async function loginUser(login: string, pass: string): Promise<{ ok: boolean; error?: string; token?: string }> {
  const row = db.query('SELECT phash FROM users WHERE login = ?').get(login) as { phash: string } | null;
  if (!row) return { ok: false, error: 'nouser' };
  const good = await Bun.password.verify(pass, row.phash);
  if (!good) return { ok: false, error: 'badpass' };
  const token = newSid();
  db.run('CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, login TEXT NOT NULL, ts INTEGER NOT NULL)');
  db.run('INSERT INTO sessions (token, login, ts) VALUES (?, ?, ?)', [token, login, Date.now()]);
  return { ok: true, token };
}

function loginByToken(token: unknown): string {
  if (typeof token !== 'string' || !token) return '';
  try {
    const row = db.query('SELECT login FROM sessions WHERE token = ?').get(token) as { login: string } | null;
    return row?.login ?? '';
  } catch {
    return '';
  }
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
  login: string;
  char: string;
  x: number;
  z: number;
  yaw: number;
  hp: number;
  score: number;
  kills: number;
  wave: number;
  duelHp: number;
  wins: number;
  spawnIdx: number;
  ts: number;
}
interface Room { id: string; name: string; mode: 'arena' | 'duel'; created: number; round: number; lastWinner: string; players: Map<string, Member>; }
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

function cleanChar(v: unknown): string {
  return v === 'krysa' ? 'krysa' : 'mtt';
}

function pubList(m: Member): object {
  return { nick: m.nick, login: m.login, char: m.char, x: m.x, z: m.z, hp: m.hp, score: m.score, kills: m.kills, wave: m.wave };
}

function duelSpawn(i: number): { x: number; z: number; yaw: number } {
  return i % 2 === 1 ? { x: 0, z: -20, yaw: Math.PI } : { x: 0, z: 20, yaw: 0 };
}

async function roomsApi(req: Request): Promise<Response | null> {
  const u = new URL(req.url);
  const p = u.pathname;
  if (!p.startsWith('/api/rooms') && !p.startsWith('/api/register') && !p.startsWith('/api/login') && !p.startsWith('/api/me')) return null;
  const parts = p.split('/').filter(Boolean); // ['api','rooms', id?, action?]

  // ---- аккаунты ----
  if (p === '/api/register' && req.method === 'POST') {
    let body: Record<string, unknown> = {};
    try { body = await req.json() as Record<string, unknown>; } catch { return Response.json({ error: 'bad' }, { status: 400 }); }
    const login = cleanLogin(body.login);
    if (!login) return Response.json({ error: 'badlogin' }, { status: 400 });
    const r = await registerUser(login, String(body.pass ?? ''));
    if (!r.ok) return Response.json({ error: r.error }, { status: r.error === 'taken' ? 409 : 400 });
    return Response.json({ token: r.token, login });
  }
  if (p === '/api/login' && req.method === 'POST') {
    let body: Record<string, unknown> = {};
    try { body = await req.json() as Record<string, unknown>; } catch { return Response.json({ error: 'bad' }, { status: 400 }); }
    const login = cleanLogin(body.login);
    if (!login) return Response.json({ error: 'badlogin' }, { status: 400 });
    const r = await loginUser(login, String(body.pass ?? ''));
    if (!r.ok) return Response.json({ error: r.error }, { status: 401 });
    return Response.json({ token: r.token, login });
  }
  if (p === '/api/me' && req.method === 'GET') {
    const login = loginByToken(u.searchParams.get('token'));
    if (!login) return Response.json({ error: 'nouser' }, { status: 401 });
    return Response.json({ login });
  }

  if (req.method === 'GET' && parts.length === 2) {
    const out: object[] = [];
    for (const r of rooms.values()) {
      prune(r);
      if (r.players.size === 0) { rooms.delete(r.id); continue; }
      out.push({ id: r.id, name: r.name, mode: r.mode, count: r.players.size });
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
    const login = loginByToken(body.token);
    const name = String(body.name ?? '').slice(0, 24).trim() || `Комната ${nick}`;
    const mode = body.mode === 'duel' ? 'duel' : 'arena';
    const id = newCode();
    const sid = newSid();
    const sp = duelSpawn(0);
    const room: Room = { id, name, mode, created: Date.now(), round: 1, lastWinner: '', players: new Map() };
    room.players.set(sid, { sid, nick, login, char: cleanChar(body.char), x: mode === 'duel' ? sp.x : 0, z: mode === 'duel' ? sp.z : 22, yaw: mode === 'duel' ? sp.yaw : 0, hp: 100, score: 0, kills: 0, wave: 1, duelHp: 100, wins: 0, spawnIdx: 0, ts: Date.now() });
    rooms.set(id, room);
    return Response.json({ id, sid, mode, spawn: mode === 'duel' ? sp : null });
  }

  if (parts.length < 4) return Response.json({ error: 'bad' }, { status: 404 });
  const room = rooms.get(parts[2].toUpperCase());
  if (!room) return Response.json({ error: 'noroom' }, { status: 404 });
  const action = parts[3];

  // войти (дуэль — строго 1 на 1)
  if (req.method === 'POST' && action === 'join') {
    prune(room);
    const cap = room.mode === 'duel' ? 2 : 8;
    if (room.players.size >= cap) return Response.json({ error: 'full' }, { status: 403 });
    const nick = cleanNick(body.nick);
    const login = loginByToken(body.token);
    const sid = newSid();
    const idx = room.players.size;
    const sp = duelSpawn(idx);
    room.players.set(sid, { sid, nick, login, char: cleanChar(body.char), x: room.mode === 'duel' ? sp.x : 0, z: room.mode === 'duel' ? sp.z : 22, yaw: room.mode === 'duel' ? sp.yaw : 0, hp: 100, score: 0, kills: 0, wave: 1, duelHp: 100, wins: 0, spawnIdx: idx, ts: Date.now() });
    return Response.json({ sid, name: room.name, mode: room.mode, spawn: room.mode === 'duel' ? sp : null });
  }

  const sid = String(body.sid ?? '');
  const me = room.players.get(sid);
  if (!me) return Response.json({ error: 'nosid' }, { status: 403 });

  // удар по дуэлянту: урон ставит сервер, победу и новый раунд — тоже он
  if (req.method === 'POST' && action === 'hit') {
    if (room.mode !== 'duel' || room.players.size < 2) return Response.json({ error: 'noduel' }, { status: 403 });
    const foe = [...room.players.values()].find((m) => m.sid !== sid);
    if (!foe) return Response.json({ error: 'nofoe' }, { status: 404 });
    const dmg = Math.round(num(body.dmg, 5, 80, 10));
    foe.duelHp = Math.max(0, foe.duelHp - dmg);
    me.ts = Date.now();
    if (foe.duelHp <= 0) {
      me.wins++;
      room.round++;
      room.lastWinner = me.nick;
      for (const m of room.players.values()) m.duelHp = 100;
    }
    return Response.json({ foeHp: Math.round(foe.duelHp), wins: me.wins, round: room.round, lastWinner: room.lastWinner });
  }

  // пульс: обновить себя, забрать остальных (+ дуэль-блок)
  if (req.method === 'POST' && action === 'beat') {
    me.char = cleanChar(body.char ?? me.char);
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
    let duel: object = { active: false };
    if (room.mode === 'duel' && room.players.size >= 2) {
      const foe = [...room.players.values()].find((m) => m.sid !== sid);
      if (foe) {
        duel = {
          active: true,
          round: room.round,
          lastWinner: room.lastWinner,
          foe: { nick: foe.nick, login: foe.login, char: foe.char, x: foe.x, z: foe.z, hp: Math.round(foe.duelHp) },
          myHp: Math.round(me.duelHp),
          myWins: me.wins,
          foeWins: foe.wins,
          spawn: duelSpawn(me.spawnIdx),
        };
      }
    }
    return Response.json({ players: others, count: room.players.size, duel });
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
        const login = loginByToken((body as Record<string, unknown>).token);
        db.run('INSERT INTO scores (nick, score, coins, ts, login) VALUES (?, ?, ?, ?, ?)', [
          cleanNick(body.nick), score, coins, Date.now(), login,
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
