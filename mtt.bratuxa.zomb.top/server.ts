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
  /** PvP-фраги (убийства игроков); spec = наблюдатель (не виден, не бьёт) */
  frags: number;
  spec: boolean;
  specTarget: string;
  /** отложенный ресаун от сервера (точка возрождения после смерти в PvP) */
  respawn: { x: number; z: number } | null;
  ts: number;
}
interface ChatMsg { nick: string; text: string; t: number }
/** Общий моб комнаты: симулирует владелец (хост), сервер раздаёт всем. god = неубиваемый (сталкеры Бэкрумса). */
interface Mob { id: number; kind: string; x: number; z: number; hp: number; dead: boolean; wave: number; god: boolean }
interface Room { id: string; name: string; mode: 'arena' | 'duel' | 'backrooms' | 'pvp' | 'endless' | 'invasion'; created: number; /** TTL-рестарт сек (0 = без рестарта) */ ttlSec: number; /** официальная комната батальона — живёт всегда, рестарт сбрасывает игру на месте */ official: boolean; round: number; lastWinner: string; owner: string; started: boolean; players: Map<string, Member>; pending: Map<string, Member>; chat: ChatMsg[]; mobs: Map<number, Mob>; mobHost: string; /** тихий вылет: ключ→когда ушёл (грейс-возврат без заявки) */ gone: Map<string, number>; /** кик = бан: ключ→до когда нельзя */ banned: Map<string, number>; }
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

function memberKey(m: { login: string; nick: string }): string {
  return m.login || ('nick:' + m.nick);
}

function prune(room: Room): void {
  const now = Date.now();
  for (const [sid, m] of room.players) {
    if (now - m.ts > STALE_MS) { room.players.delete(sid); room.gone.set(memberKey(m), now); }
  }
  for (const [sid, m] of room.pending) {
    if (now - m.ts > STALE_MS) room.pending.delete(sid);
  }
  // грейс-метки старше 5 минут не храним
  for (const [k, t] of room.gone) if (now - t > 300000) room.gone.delete(k);
  for (const [k, t] of room.banned) if (now - t > 0) room.banned.delete(k);
  // создатель ушёл — владелец переходит старшему из оставшихся
  // официальные сервера без владельца навсегда (иначе гость станет «создателем»)
  if (!room.official && !room.players.has(room.owner)) {
    const next = [...room.players.keys()][0];
    if (next) room.owner = next;
  }
}

/** Лимит игроков по режиму: PvP-арена 12, Бэкрумс/Нашествие 10, дуэль 2, остальное 8. */
function roomCap(room: Room): number {
  if (room.mode === 'duel') return 2;
  if (room.mode === 'pvp') return 12;
  if (room.mode === 'endless' || room.mode === 'invasion') return 10;
  return 8;
}

/** TTL-рестарт по режиму, сек: PvP 20 мин, Бэкрумс 5 мин, Нашествие 10 мин. */
function ttlFor(mode: Room['mode']): number {
  if (mode === 'pvp') return 1200;
  if (mode === 'endless') return 300;
  if (mode === 'invasion') return 600;
  return 0;
}

/** Секунд до рестарта (0 = без рестарта). */
function restartIn(room: Room): number {
  if (!room.ttlSec) return 0;
  return Math.max(0, Math.round(room.ttlSec - (Date.now() - room.created) / 1000));
}

/** Рестарт игры на месте: новая волна жизни, статистика в ноль, игроки остаются. */
function resetRoom(room: Room): void {
  room.created = Date.now();
  room.round = 1;
  room.lastWinner = '';
  room.mobs.clear();
  room.mobHost = '';
  room.chat = [];
  room.started = true;
  for (const m of room.players.values()) {
    m.hp = 100; m.duelHp = 100; m.score = 0; m.kills = 0; m.wave = 1; m.respawn = null;
    m.frags = 0; m.dead = false; m.atk = 0; m.ts = Date.now();
  }
  for (const m of room.pending.values()) m.ts = Date.now();
}

/**
 * Проверка TTL. Возвращает 'gone' если комнату удалили (пользовательская истекла),
 * 'reset' если игру перезапустили на месте, 'ok' если всё свежо.
 */
function checkExpiry(room: Room): 'ok' | 'reset' | 'gone' {
  if (!room.ttlSec) return 'ok';
  if (Date.now() - room.created <= room.ttlSec * 1000) return 'ok';
  if (room.official) { resetRoom(room); return 'reset'; }
  if (room.players.size === 0 && room.pending.size === 0) { rooms.delete(room.id); return 'gone'; }
  // пользовательская комната с игроками: рестарт игры, как на официальных
  resetRoom(room);
  room.started = false;
  return 'reset';
}

function randSpawnXZ(): { x: number; z: number } {
  return { x: Math.round((Math.random() * 100 - 50) * 10) / 10, z: Math.round((Math.random() * 100 - 50) * 10) / 10 };
}

/** Три официальных сервера батальона: живут всегда, prune их пересоздаёт. */
const OFFICIAL_DEFS = [
  { id: 'PVP42X', name: '⚔️ PvP-арена', mode: 'pvp' },
  { id: 'END42X', name: '🟨 Бесконечный Бэкрумс', mode: 'endless' },
  { id: 'INV42X', name: '🌊 Нашествие', mode: 'invasion' },
] as const;

function ensureOfficial(): void {
  for (const def of OFFICIAL_DEFS) {
    if (rooms.has(def.id)) continue;
    const mode = def.mode as Room['mode'];
    rooms.set(def.id, {
      id: def.id, name: def.name, mode, created: Date.now(), ttlSec: ttlFor(mode),
      official: true, round: 1, lastWinner: '', owner: '', started: true,
      players: new Map(), pending: new Map(), chat: [], mobs: new Map(),
      mobHost: '', gone: new Map(), banned: new Map(),
    });
  }
}

function cleanChar(v: unknown): string {
  return v === 'krysa' ? 'krysa' : 'mtt';
}

function pubList(m: Member): object {
  return { nick: m.nick, login: m.login, char: m.char, x: m.x, z: m.z, hp: m.hp, score: m.score, kills: m.kills, frags: m.frags, spec: m.spec, wave: m.wave, weapon: m.weapon, py: m.py, atk: m.atk, dead: m.dead };
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
    ensureOfficial();
    const out: object[] = [];
    for (const r of rooms.values()) {
      prune(r);
      if (checkExpiry(r) === 'gone') continue;
      if (r.players.size === 0 && r.pending.size === 0 && !r.official) { rooms.delete(r.id); continue; }
      out.push({ id: r.id, name: r.name, mode: r.mode, count: r.players.size, started: r.started, official: r.official, restartIn: restartIn(r) });
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
    const rawMode = String(body.mode ?? 'arena');
    const mode: Room['mode'] = rawMode === 'duel' ? 'duel' : rawMode === 'backrooms' ? 'backrooms' : rawMode === 'pvp' ? 'pvp' : rawMode === 'endless' ? 'endless' : rawMode === 'invasion' ? 'invasion' : 'arena';
    const id = newCode();
    const sid = newSid();
    const sp = duelSpawn(0);
    const pvpSp = mode === 'pvp' || mode === 'endless' || mode === 'invasion' ? randSpawnXZ() : { x: 0, z: 22 };
    const room: Room = { id, name, mode, created: Date.now(), ttlSec: ttlFor(mode), official: false, round: 1, lastWinner: '', owner: sid, started: false, players: new Map(), pending: new Map(), chat: [], mobs: new Map(), mobHost: '', gone: new Map(), banned: new Map() };
    room.players.set(sid, { sid, nick, login, char: cleanChar(body.char), x: mode === 'duel' ? sp.x : pvpSp.x, z: mode === 'duel' ? sp.z : pvpSp.z, yaw: mode === 'duel' ? sp.yaw : 0, hp: 100, score: 0, kills: 0, wave: 1, weapon: 'fists', py: 0, atk: 0, dead: false, duelHp: 100, wins: 0, spawnIdx: 0, frags: 0, spec: false, specTarget: '', respawn: null, ts: Date.now() });
    rooms.set(id, room);
    return Response.json({ id, sid, mode, spawn: mode === 'duel' ? sp : null, restartIn: restartIn(room) });
  }

  if (parts.length < 4) return Response.json({ error: 'bad' }, { status: 404 });
  const room = rooms.get(parts[2].toUpperCase());
  if (!room) return Response.json({ error: 'noroom' }, { status: 404 });
  const action = parts[3];

  // войти = оставить заявку: в игру пускает только создатель (approve)
  // официальные сервера пускают сразу без заявки (started всегда)
  if (req.method === 'POST' && action === 'join') {
    prune(room);
    if (checkExpiry(room) === 'gone') return Response.json({ error: 'noroom' }, { status: 404 });
    const cap = roomCap(room);
    if (room.players.size + room.pending.size >= cap) return Response.json({ error: 'full' }, { status: 403 });
    const nick = cleanNick(body.nick);
    const login = loginByToken(body.token);
    const key = login || ('nick:' + nick);
    if ((room.banned.get(key) ?? 0) > Date.now()) return Response.json({ error: 'banned' }, { status: 403 });
    const sid = newSid();
    const wantSpec = body.spec === true && (room.mode === 'endless' || room.mode === 'pvp' || room.mode === 'invasion');
    const sp = room.mode === 'pvp' || room.mode === 'endless' || room.mode === 'invasion' ? randSpawnXZ() : { x: 0, z: 22 };
    const member = { sid, nick, login, char: cleanChar(body.char), x: sp.x, z: sp.z, yaw: 0, hp: 100, score: 0, kills: 0, wave: 1, weapon: 'fists', py: 0, atk: 0, dead: false, duelHp: 100, wins: 0, spawnIdx: room.players.size, frags: 0, spec: wantSpec, specTarget: '', respawn: null, ts: Date.now() };
    // грейс-возврат: свой тихо вылетел <2мин назад, место свободно — сразу в игру без заявки
    const leftAt = room.gone.get(key) ?? 0;
    const taken = [...room.players.values()].some((m) => memberKey(m) === key);
    if (leftAt > 0 && Date.now() - leftAt < 120000 && !taken && room.players.size < cap) {
      room.gone.delete(key);
      room.pending.delete(sid);
      room.players.set(sid, member);
      return Response.json({ sid, name: room.name, mode: room.mode, pending: false });
    }
    // официальные сервера: сразу в игру, без заявки
    if (room.official) {
      room.players.set(sid, member);
      return Response.json({ sid, name: room.name, mode: room.mode, pending: false, official: true });
    }
    room.pending.set(sid, member);
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
    if (checkExpiry(room) === 'gone') return Response.json({ error: 'noroom' }, { status: 404 });
    const isOwner = sid !== '' && sid === room.owner;
    const mine = sid !== '' && (room.players.has(sid) || room.pending.has(sid));
    // чужим состав комнаты не показываем — только факт существования
    if (!isOwner && !mine) return Response.json({ name: room.name, mode: room.mode, started: room.started, count: room.players.size, official: room.official, restartIn: restartIn(room) });
    const players = [...room.players.values()].filter((m) => m.sid !== sid).map(pubListSid);
    const out: Record<string, unknown> = {
      name: room.name, mode: room.mode, started: room.started, official: room.official, restartIn: restartIn(room),
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
      const cap = roomCap(room);
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
    // kick: выгнать игрока (не себя) + бан на 10 минут от возврата
    if (target !== sid) {
      const out = room.players.get(target);
      if (out) {
        const key = memberKey(out);
        room.banned.set(key, Date.now() + 600000);
        room.gone.delete(key);
      }
      room.players.delete(target);
    }
    prune(room);
    if (room.players.size === 0 && !room.official) rooms.delete(room.id);
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

  // удар по игроку в PvP: урон ставит сервер, фраг и ресаун — тоже он
  // цель — fid бойца из последнего beat (или sid); жертве кладём точку возрождения в очередь
  if (req.method === 'POST' && action === 'pvphit') {
    if (room.mode !== 'pvp') return Response.json({ error: 'nopvp' }, { status: 403 });
    if (me.spec) return Response.json({ error: 'spec' }, { status: 403 });
    const fighters = [...room.players.values()].filter((m) => !m.spec);
    const targetRaw = body.target as string | number;
    const foe = typeof targetRaw === 'number'
      ? fighters[Math.floor(targetRaw)]
      : room.players.get(String(targetRaw ?? ''));
    if (!foe || foe.sid === sid) return Response.json({ error: 'nofoe' }, { status: 404 });
    if (foe.spec) return Response.json({ error: 'specfoe' }, { status: 403 });
    // по трупу не бьём — фраг уже раздали, ждём ресауна
    if (foe.dead) return Response.json({ error: 'deadfoe' }, { status: 403 });
    const dmg = Math.round(num(body.dmg, 5, 80, 10));
    foe.hp = Math.max(0, foe.hp - dmg);
    me.ts = Date.now();
    if (foe.hp <= 0) {
      me.frags++;
      const sp = randSpawnXZ();
      // жертва лежит трупом, пока её пульс не заберёт точку возрождения (ревайв — там же)
      foe.hp = 0;
      foe.dead = true;
      foe.x = sp.x; foe.z = sp.z;
      foe.respawn = { x: sp.x, z: sp.z };
      return Response.json({ foeHp: 0, dead: true, freshKill: true, frags: me.frags, rx: sp.x, rz: sp.z });
    }
    return Response.json({ foeHp: Math.round(foe.hp), dead: false, freshKill: false, frags: me.frags });
  }

  // наблюдатель: выбрать цель (endless/pvp/invasion); наблюдатель не виден и не бьёт
  if (req.method === 'POST' && action === 'watch') {
    if (room.mode !== 'endless' && room.mode !== 'pvp' && room.mode !== 'invasion') return Response.json({ error: 'nowatch' }, { status: 403 });
    const target = String(body.target ?? '');
    if (target !== '' && !room.players.has(target)) return Response.json({ error: 'nofoe' }, { status: 404 });
    me.spec = true;
    me.specTarget = target;
    me.ts = Date.now();
    const targets = [...room.players.values()].filter((m) => !m.spec && m.sid !== sid).map((m) => ({ sid: m.sid, nick: m.nick, hp: Math.round(m.hp), dead: m.dead }));
    return Response.json({ ok: true, spec: true, targets });
  }

  // вернуться в бой из наблюдателя (ресаун в случайной точке)
  if (req.method === 'POST' && action === 'play') {
    const sp = randSpawnXZ();
    me.spec = false;
    me.specTarget = '';
    me.hp = 100;
    me.dead = false;
    me.x = sp.x; me.z = sp.z;
    me.ts = Date.now();
    return Response.json({ ok: true, rx: sp.x, rz: sp.z });
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
  // официальные моб-режимы: пушит назначенный хост (первый боец), остальные мимо
  if (req.method === 'POST' && action === 'mobpush') {
    if (room.official && (room.mode === 'endless' || room.mode === 'invasion') && !me.spec) {
      const cur = room.mobHost !== '' ? room.players.get(room.mobHost) : undefined;
      if (!cur || cur.spec) {
        const first = [...room.players.values()].find((m) => !m.spec);
        room.mobHost = first ? first.sid : '';
      }
      if (room.mobHost !== sid) return Response.json({ error: 'notmobhost' }, { status: 403 });
    } else if (!isOwner) return Response.json({ error: 'notowner' }, { status: 403 });
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
        god: raw.god === true,
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
  // god-мобы (сталкеры Бэкрумса) неубиваемы: урон гаснет
  if (req.method === 'POST' && action === 'mobhit') {
    const mob = room.mobs.get(Math.floor(Number(body.id)));
    if (!mob) return Response.json({ error: 'nomob' }, { status: 404 });
    if (mob.dead) return Response.json({ hp: 0, dead: true, freshKill: false });
    if (mob.god) return Response.json({ hp: mob.hp, dead: false, freshKill: false, god: true });
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
    // PvP: hp ставит только сервер через pvphit (иначе жертва затёрла бы урон своим старым значением)
    if (room.mode !== 'pvp') me.hp = Math.round(num(body.hp, 0, 10000));
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
    checkExpiry(room);
    // официальные моб-режимы: хост мобов — первый боец (детерминированно, без флэппинга)
    if (room.official && (room.mode === 'endless' || room.mode === 'invasion')) {
      const cur = room.mobHost !== '' ? room.players.get(room.mobHost) : undefined;
      if (!cur || cur.spec) {
        const first = [...room.players.values()].find((m) => !m.spec);
        room.mobHost = first ? first.sid : '';
      }
    }
    const amMobHost = room.mobHost !== '' && room.mobHost === sid;
    const fighters = [...room.players.values()].filter((m) => !m.spec);
    const others: object[] = [];
    fighters.forEach((m, fid) => {
      // наблюдателей не видит никто; наблюдатель видит всех бойцов
      if (m.sid !== sid) others.push({ ...(pubList(m) as Record<string, unknown>), fid });
    });
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
    // PvP-табло: кто больше настрелял
    let scoreboard: object[] = [];
    if (room.mode === 'pvp') {
      scoreboard = [...room.players.values()]
        .filter((m) => !m.spec)
        .sort((a, b) => b.frags - a.frags)
        .slice(0, 12)
        .map((m) => ({ nick: m.nick, frags: m.frags }));
    }
    // наблюдателю — список целей; бойцу — его флаг spec (мог стать наблюдателем с другого клиента)
    const specView = me.spec
      ? { spec: true, target: me.specTarget, targets: [...room.players.values()].filter((m) => !m.spec && m.sid !== sid).map((m) => ({ sid: m.sid, nick: m.nick, hp: Math.round(m.hp), dead: m.dead })) }
      : { spec: false };
    // очередь ресауна: жертва PvP забирает точку возрождения (одноразово) —
    // hp слепка шлём ДО ревайва, чтобы клиент увидел смерть и показал экран
    const myHpSnap = Math.round(me.hp);
    const respawn = me.respawn;
    me.respawn = null;
    if (respawn) { me.hp = 100; me.dead = false; }
    return Response.json({ players: others, count: room.players.size, duel, scoreboard, specView, respawn, myHp: myHpSnap, mobHost: amMobHost, started: room.started, official: room.official, restartIn: restartIn(room), myFrags: me.frags, owner: sid === room.owner, t: Date.now(), chat: room.chat.slice(-20), mobs: [...room.mobs.values()].slice(0, 60).map((m) => ({ id: m.id, kind: m.kind, x: Math.round(m.x * 10) / 10, z: Math.round(m.z * 10) / 10, hp: m.hp, dead: m.dead, wave: m.wave, god: m.god })) });
  }

  // выйти (из игроков и из заявителей; владелец уходит — комната живёт дальше)
  // официальные сервера не удаляются никогда
  if (req.method === 'POST' && action === 'leave') {
    const out = room.players.get(sid);
    if (out) room.gone.set(memberKey(out), Date.now());
    room.players.delete(sid);
    room.pending.delete(sid);
    prune(room);
    if (room.players.size === 0 && !room.official) rooms.delete(room.id);
    return Response.json({ ok: true });
  }

  return Response.json({ error: 'bad' }, { status: 404 });
}

ensureOfficial();

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
