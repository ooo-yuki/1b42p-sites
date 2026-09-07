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
// топ дуэлянтов 1×1: победы в раундах по логину (гости мимо)
db.run(`CREATE TABLE IF NOT EXISTS duel_top (
  login TEXT PRIMARY KEY,
  wins INTEGER NOT NULL DEFAULT 0
)`);

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

// владелец игры (МТТ): логин задаётся env ADMIN_LOGIN, панель статистики только ему
const ADMIN_LOGIN = (process.env.ADMIN_LOGIN ?? '').trim();

async function changePassword(login: string, oldPass: string, newPass: string): Promise<{ ok: boolean; error?: string }> {
  if (String(newPass ?? '').length < 4 || String(newPass ?? '').length > 64) return { ok: false, error: 'passlen' };
  const row = db.query('SELECT phash FROM users WHERE login = ?').get(login) as { phash: string } | null;
  if (!row) return { ok: false, error: 'nouser' };
  const good = await Bun.password.verify(String(oldPass ?? ''), row.phash);
  if (!good) return { ok: false, error: 'badpass' };
  const phash = await Bun.password.hash(newPass);
  db.run('UPDATE users SET phash = ? WHERE login = ?', [phash, login]);
  return { ok: true };
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
  /** полное присутствие: ствол, высота прыжка, счётчик ударов, лежит ли */
  weapon: string;
  py: number;
  atk: number;
  dead: boolean;
  duelHp: number;
  wins: number;
  spawnIdx: number;
  ts: number;
}
interface ChatMsg { nick: string; text: string; t: number }
/** Общий моб комнаты: симулирует владелец (хост), сервер раздаёт всем. */
interface Mob { id: number; kind: string; x: number; z: number; hp: number; dead: boolean; wave: number }
interface Room { id: string; name: string; mode: 'arena' | 'duel' | 'backrooms'; created: number; round: number; lastWinner: string; owner: string; started: boolean; players: Map<string, Member>; pending: Map<string, Member>; chat: ChatMsg[]; mobs: Map<number, Mob>; mobHost: string; }
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
  for (const [sid, m] of room.pending) {
    if (now - m.ts > STALE_MS) room.pending.delete(sid);
  }
  // создатель ушёл — владелец переходит старшему из оставшихся
  if (!room.players.has(room.owner)) {
    const next = [...room.players.keys()][0];
    if (next) room.owner = next;
  }
}

function cleanChar(v: unknown): string {
  return v === 'krysa' ? 'krysa' : 'mtt';
}

function pubList(m: Member): object {
  return { nick: m.nick, login: m.login, char: m.char, x: m.x, z: m.z, hp: m.hp, score: m.score, kills: m.kills, wave: m.wave, weapon: m.weapon, py: m.py, atk: m.atk, dead: m.dead };
}

// только для лобби создателя: sid нужен кнопкам ПРИНЯТЬ/КИК (beat его не отдаёт)
function pubListSid(m: Member): object {
  return { ...pubList(m) as Record<string, unknown>, sid: m.sid };
}

function duelSpawn(i: number): { x: number; z: number; yaw: number } {
  return i % 2 === 1 ? { x: 0, z: -20, yaw: Math.PI } : { x: 0, z: 20, yaw: 0 };
}

async function roomsApi(req: Request): Promise<Response | null> {
  const u = new URL(req.url);
  const p = u.pathname;
  if (!p.startsWith('/api/rooms') && !p.startsWith('/api/register') && !p.startsWith('/api/login') && !p.startsWith('/api/me') && !p.startsWith('/api/profile') && !p.startsWith('/api/password') && !p.startsWith('/api/admin') && !p.startsWith('/api/stats')) return null;
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
  if (p === '/api/profile' && req.method === 'GET') {
    const login = String(u.searchParams.get('login') ?? '').slice(0, 20);
    if (!login) return Response.json({ error: 'bad' }, { status: 400 });
    try {
      const row = db.query(
        'SELECT COUNT(*) AS games, MAX(score) AS best, COALESCE(SUM(coins),0) AS coins FROM scores WHERE login = ?',
      ).get(login) as { games: number; best: number | null; coins: number };
      return Response.json({ login, games: row.games ?? 0, best: row.best ?? 0, coins: row.coins ?? 0 });
    } catch {
      return Response.json({ login, games: 0, best: 0, coins: 0 });
    }
  }
  // смена пароля: нужен живой токен + старый пароль
  if (p === '/api/password' && req.method === 'POST') {
    let body: Record<string, unknown> = {};
    try { body = await req.json() as Record<string, unknown>; } catch { return Response.json({ error: 'bad' }, { status: 400 }); }
    const login = loginByToken(body.token);
    if (!login) return Response.json({ error: 'nouser' }, { status: 401 });
    const r = await changePassword(login, String(body.old ?? ''), String(body.pass ?? ''));
    if (!r.ok) return Response.json({ error: r.error }, { status: r.error === 'badpass' ? 401 : 400 });
    return Response.json({ ok: true });
  }
  // админ-статистика МТТ: онлайн по комнатам — кто где и что делает
  if (p === '/api/admin/stats' && req.method === 'GET') {
    const login = loginByToken(u.searchParams.get('token'));
    if (!ADMIN_LOGIN || login !== ADMIN_LOGIN) return Response.json({ error: 'forbidden' }, { status: 403 });
    const out: object[] = [];
    let totalPlayers = 0;
    for (const r of rooms.values()) {
      prune(r);
      if (r.players.size === 0 && r.pending.size === 0) continue;
      totalPlayers += r.players.size;
      out.push({
        id: r.id, name: r.name, mode: r.mode, started: r.started, round: r.round,
        players: [...r.players.values()].map((m) => ({
          nick: m.nick, login: m.login, char: m.char, hp: Math.round(m.hp),
          score: m.score, kills: m.kills, wave: m.wave, x: Math.round(m.x), z: Math.round(m.z),
        })),
        pending: [...r.pending.values()].map((m) => ({ nick: m.nick, login: m.login })),
      });
    }
    return Response.json({ rooms: out, totalPlayers, roomCount: out.length });
  }
  // общая статистика игры — видна всем: сколько сыграно, рекорд, онлайн
  if (p === '/api/stats' && req.method === 'GET') {
    try {
      const row = db.query('SELECT COUNT(*) AS games, MAX(score) AS best FROM scores').get() as { games: number; best: number | null };
      let online = 0;
      for (const r of rooms.values()) { prune(r); online += r.players.size; }
      return Response.json({ games: row.games ?? 0, best: row.best ?? 0, online });
    } catch {
      return Response.json({ games: 0, best: 0, online: 0 });
    }
  }

  if (req.method === 'GET' && parts.length === 2) {
    const out: object[] = [];
    for (const r of rooms.values()) {
      prune(r);
      if (r.players.size === 0) { rooms.delete(r.id); continue; }
      out.push({ id: r.id, name: r.name, mode: r.mode, count: r.players.size, started: r.started });
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
    const mode = body.mode === 'duel' ? 'duel' : body.mode === 'backrooms' ? 'backrooms' : 'arena';
    const id = newCode();
    const sid = newSid();
    const sp = duelSpawn(0);
    const room: Room = { id, name, mode, created: Date.now(), round: 1, lastWinner: '', owner: sid, started: false, players: new Map(), pending: new Map(), chat: [], mobs: new Map(), mobHost: '' };
    room.players.set(sid, { sid, nick, login, char: cleanChar(body.char), x: mode === 'duel' ? sp.x : 0, z: mode === 'duel' ? sp.z : 22, yaw: mode === 'duel' ? sp.yaw : 0, hp: 100, score: 0, kills: 0, wave: 1, weapon: 'fists', py: 0, atk: 0, dead: false, duelHp: 100, wins: 0, spawnIdx: 0, ts: Date.now() });
    rooms.set(id, room);
    return Response.json({ id, sid, mode, spawn: mode === 'duel' ? sp : null });
  }

  if (parts.length < 4) return Response.json({ error: 'bad' }, { status: 404 });
  const room = rooms.get(parts[2].toUpperCase());
  if (!room) return Response.json({ error: 'noroom' }, { status: 404 });
  const action = parts[3];

  // войти = оставить заявку: в игру пускает только создатель (approve)
  if (req.method === 'POST' && action === 'join') {
    prune(room);
    const cap = room.mode === 'duel' ? 2 : 8;
    if (room.players.size + room.pending.size >= cap) return Response.json({ error: 'full' }, { status: 403 });
    const nick = cleanNick(body.nick);
    const login = loginByToken(body.token);
    const sid = newSid();
    room.pending.set(sid, { sid, nick, login, char: cleanChar(body.char), x: 0, z: 22, yaw: 0, hp: 100, score: 0, kills: 0, wave: 1, weapon: 'fists', py: 0, atk: 0, dead: false, duelHp: 100, wins: 0, spawnIdx: room.players.size, ts: Date.now() });
    return Response.json({ sid, name: room.name, mode: room.mode, pending: true });
  }

  // состояние лобби для меню: кто внутри, кто просится, запущена ли игра
  if (req.method === 'GET' && action === 'info') {
    const sid = String(u.searchParams.get('sid') ?? '');
    // лобби на связи = присутствие: метку обновляем ДО чистки,
    // иначе создатель протухнет пока ждёт заявку (beat в меню не идёт) —
    // и игроки никогда не увидят друг друга
    const selfP = sid !== '' ? room.players.get(sid) : undefined;
    if (selfP) selfP.ts = Date.now();
    const selfW = sid !== '' ? room.pending.get(sid) : undefined;
    if (selfW) selfW.ts = Date.now();
    prune(room);
    const isOwner = sid !== '' && sid === room.owner;
    const mine = sid !== '' && (room.players.has(sid) || room.pending.has(sid));
    // чужим состав комнаты не показываем — только факт существования
    if (!isOwner && !mine) return Response.json({ name: room.name, mode: room.mode, started: room.started, count: room.players.size });
    const players = [...room.players.values()].filter((m) => m.sid !== sid).map(pubListSid);
    const out: Record<string, unknown> = {
      name: room.name, mode: room.mode, started: room.started,
      owner: isOwner, count: room.players.size, players,
    };
    if (isOwner) out.pending = [...room.pending.values()].map(pubListSid);
    else if (sid !== '') out.accepted = room.players.has(sid);
    if (room.mode === 'duel' && sid !== '') {
      const self = room.players.get(sid);
      if (self) out.spawn = duelSpawn(self.spawnIdx);
    }
    return Response.json(out);
  }

  const sid = String(body.sid ?? '');
  const isOwner = sid !== '' && sid === room.owner;

  // действия создателя: принять / отклонить заявку, кикнуть, стартовать игру
  if (req.method === 'POST' && (action === 'approve' || action === 'deny' || action === 'kick' || action === 'start')) {
    if (!isOwner) return Response.json({ error: 'notowner' }, { status: 403 });
    if (action === 'start') {
      room.started = true;
      return Response.json({ ok: true, started: true });
    }
    const target = String(body.target ?? '');
    if (action === 'approve') {
      const m = room.pending.get(target);
      if (!m) return Response.json({ error: 'noreq' }, { status: 404 });
      const cap = room.mode === 'duel' ? 2 : 8;
      if (room.players.size >= cap) return Response.json({ error: 'full' }, { status: 403 });
      room.pending.delete(target);
      m.spawnIdx = room.players.size;
      const sp = duelSpawn(m.spawnIdx);
      if (room.mode === 'duel') { m.x = sp.x; m.z = sp.z; m.yaw = sp.yaw; }
      m.ts = Date.now();
      room.players.set(target, m);
      return Response.json({ ok: true });
    }
    if (action === 'deny') {
      room.pending.delete(target);
      return Response.json({ ok: true });
    }
    // kick: выгнать игрока (не себя)
    if (target !== sid) room.players.delete(target);
    prune(room);
    if (room.players.size === 0) rooms.delete(room.id);
    return Response.json({ ok: true });
  }

  const me = room.players.get(sid);
  if (!me) {
    // заявитель на связи: обновляем метку — иначе заявка протухнет раньше, чем её примут,
    // и игроки никогда не увидят друг друга
    const w = room.pending.get(sid);
    if (w) { w.ts = Date.now(); return Response.json({ error: 'waiting' }, { status: 403 }); }
    return Response.json({ error: 'nosid' }, { status: 403 });
  }

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
      // победа в раунде — в вечный топ дуэлянтов (только залогиненные)
      if (me.login) {
        db.run('INSERT INTO duel_top (login, wins) VALUES (?, 1) ON CONFLICT(login) DO UPDATE SET wins = wins + 1', [me.login]);
      }
    }
    return Response.json({ foeHp: Math.round(foe.duelHp), wins: me.wins, round: room.round, lastWinner: room.lastWinner });
  }

  // чат комнаты: только свои, текст чистим, храним последние 50
  if (req.method === 'POST' && action === 'chat') {
    const text = String(body.text ?? '').replace(/[\u0000-\u001f]/g, '').trim().slice(0, 200);
    if (!text) return Response.json({ error: 'empty' }, { status: 400 });
    room.chat.push({ nick: me.nick, text, t: Date.now() });
    if (room.chat.length > 50) room.chat.splice(0, room.chat.length - 50);
    me.ts = Date.now();
    return Response.json({ ok: true });
  }

  // общие мобы: хост (владелец) заливает слепок своих мобов, сервер хранит и раздаёт
  if (req.method === 'POST' && action === 'mobpush') {
    if (!isOwner) return Response.json({ error: 'notowner' }, { status: 403 });
    // хост сменился — старая таблица чужая, начинаем чисто
    if (room.mobHost !== sid) { room.mobs.clear(); room.mobHost = sid; }
    const list = Array.isArray(body.mobs) ? (body.mobs as Array<Record<string, unknown>>).slice(0, 60) : [];
    const seen = new Set<number>();
    for (const raw of list) {
      const id = Math.floor(Number(raw.id));
      if (!Number.isFinite(id) || id < 0 || id > 1000000 || seen.has(id)) continue;
      seen.add(id);
      const kind = raw.kind === 'fly' || raw.kind === 'boss' ? String(raw.kind) : 'walk';
      const wave = Math.round(num(raw.wave, 1, 100, 1));
      const cur = room.mobs.get(id);
      // труп не воскресает в той же волне (фраг уже раздали через mobhit)
      if (cur && cur.dead && cur.wave === wave) continue;
      room.mobs.set(id, {
        id, kind,
        x: num(raw.x, -70, 70), z: num(raw.z, -70, 70),
        hp: Math.round(num(raw.hp, 0, 100000)),
        dead: raw.dead === true,
        wave,
      });
    }
    // волна сменилась — чистим мобов прошлой волны, которых хост больше не шлёт
    const waves = [...room.mobs.values()].map((m) => m.wave);
    const top = waves.length > 0 ? Math.max(...waves) : 0;
    for (const [id, m] of room.mobs) {
      if (!seen.has(id) && m.wave < top) room.mobs.delete(id);
    }
    return Response.json({ ok: true, count: room.mobs.size });
  }

  // общий урон по мобу: любой игрок бьёт, сервер считает HP — фраг один на всех
  if (req.method === 'POST' && action === 'mobhit') {
    const mob = room.mobs.get(Math.floor(Number(body.id)));
    if (!mob) return Response.json({ error: 'nomob' }, { status: 404 });
    if (mob.dead) return Response.json({ hp: 0, dead: true, freshKill: false });
    const dmg = Math.round(num(body.dmg, 1, 500, 10));
    mob.hp = Math.max(0, mob.hp - dmg);
    me.ts = Date.now();
    if (mob.hp <= 0) {
      mob.dead = true;
      return Response.json({ hp: 0, dead: true, freshKill: true, kind: mob.kind, wave: mob.wave });
    }
    return Response.json({ hp: mob.hp, dead: false, freshKill: false });
  }

  // пульс: обновить себя, забрать остальных (+ дуэль-блок, + чат)
  if (req.method === 'POST' && action === 'beat') {
    me.char = cleanChar(body.char ?? me.char);
    me.x = num(body.x, -70, 70);
    me.z = num(body.z, -70, 70);
    me.yaw = num(body.yaw, -10, 10);
    me.hp = Math.round(num(body.hp, 0, 10000));
    me.score = Math.round(num(body.score, 0, 100000000));
    me.kills = Math.round(num(body.kills, 0, 1000000));
    me.wave = Math.round(num(body.wave, 1, 100, 1));
    // полное присутствие: ствол строго из оружейки, высота/удары — числа, смерть — флаг
    const w = String(body.weapon ?? '');
    if (w === 'fists' || w === 'bat' || w === 'axe' || w === 'pistol' || w === 'shotgun') me.weapon = w;
    me.py = Math.round(num(body.py, 0, 30) * 10) / 10;
    me.atk = Math.round(num(body.atk, 0, 1000000000));
    me.dead = body.dead === true;
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
          foe: { nick: foe.nick, login: foe.login, char: foe.char, x: foe.x, z: foe.z, hp: Math.round(foe.duelHp), weapon: foe.weapon, py: foe.py, atk: foe.atk, dead: foe.dead },
          myHp: Math.round(me.duelHp),
          myWins: me.wins,
          foeWins: foe.wins,
          spawn: duelSpawn(me.spawnIdx),
        };
      }
    }
    return Response.json({ players: others, count: room.players.size, duel, started: room.started, owner: sid === room.owner, chat: room.chat.slice(-20), mobs: [...room.mobs.values()].slice(0, 60).map((m) => ({ id: m.id, kind: m.kind, x: Math.round(m.x * 10) / 10, z: Math.round(m.z * 10) / 10, hp: m.hp, dead: m.dead, wave: m.wave })) });
  }

  // выйти (из игроков и из заявителей; владелец уходит — комната живёт дальше)
  if (req.method === 'POST' && action === 'leave') {
    room.players.delete(sid);
    room.pending.delete(sid);
    prune(room);
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
    '/api/duel-top': () => {
      const rows = db.query('SELECT login, wins FROM duel_top ORDER BY wins DESC, login ASC LIMIT 10').all();
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
