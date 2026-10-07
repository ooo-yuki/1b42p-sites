// Cultivation Toilet API — Bun REST, sqlite, порт 8096.
// Статику в проде отдаёт router.py (vhost), здесь свой файл-сервер нужен только для локальной разработки.
import { Database } from 'bun:sqlite';
import { mkdirSync } from 'node:fs';
import {
  EVENTS,
  ITEMS,
  UPGRADES,
  buildCost,
  canBuild,
  cleanCost,
  expandCost,
  incomeRate,
  dirtyRate,
  newPlayer,
  pull,
  pushLog,
  repairCost,
  score,
  sellPrice,
  startCells,
  tick,
  upgradeCost,
  type Dir,
  type InvItem,
  type Player,
} from './logic';

const PORT = Number(process.env.PORT || 8096);
const DATA_DIR = process.env.DATA_DIR || 'data';
const PULL_COOLDOWN_MS = 1200;
const SESSION_TTL_MS = 30 * 24 * 3600_000;
const MARKET_FEE = 0.05;

mkdirSync(DATA_DIR, { recursive: true });
const db = new Database(`${DATA_DIR}/toilet.db`, { create: true });
db.run('PRAGMA journal_mode = WAL');
db.run(`CREATE TABLE IF NOT EXISTS users (
  login TEXT PRIMARY KEY,
  phash TEXT NOT NULL,
  created INTEGER NOT NULL
)`);
db.run(`CREATE TABLE IF NOT EXISTS players (
  login TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  updated INTEGER NOT NULL
)`);
db.run(`CREATE TABLE IF NOT EXISTS sessions (
  sid TEXT PRIMARY KEY,
  login TEXT NOT NULL,
  ts INTEGER NOT NULL
)`);
db.run(`CREATE TABLE IF NOT EXISTS market (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  seller TEXT NOT NULL,
  item TEXT NOT NULL,
  price INTEGER NOT NULL,
  ts INTEGER NOT NULL
)`);
db.run('CREATE INDEX IF NOT EXISTS market_score ON players(score DESC)');

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
const err = (msg: string, status = 400) => json({ error: msg }, status);

/** Обёртки: в новых типах bun:sqlite у query() два обязательных generic-параметра. */
function row<T>(sql: string, ...params: unknown[]): T | null {
  return db.query(sql).get(...(params as never[])) as T | null;
}
function rows<T>(sql: string, ...params: unknown[]): T[] {
  return db.query(sql).all(...(params as never[])) as T[];
}
function exec(sql: string, ...params: unknown[]): void {
  db.run(sql, ...(params as never[]));
}

// ---------------------------------------------------------------- сессии / игроки
const pullAt = new Map<string, number>();
const loginFails = new Map<string, number[]>();

function cleanNick(v: unknown): string | null {
  const s = String(v ?? '').trim().slice(0, 20);
  return /^[A-Za-z0-9А-Яа-яЁё_\-\s]{2,20}$/.test(s) ? s : null;
}

function newSid(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(24)), (b) => b.toString(16).padStart(2, '0')).join('');
}

function loadPlayer(login: string): Player | null {
  const r = row<{ data: string }>('SELECT data FROM players WHERE login = ?', login);
  if (!r) return null;
  try {
    const p = JSON.parse(r.data) as Player;
    // миграция: старые записи без карты получают стартовые клетки
    if (!Array.isArray(p.cells) || p.cells.length < 2) p.cells = startCells();
    return p;
  } catch {
    return null;
  }
}

function savePlayer(p: Player): void {
  exec(
    'INSERT INTO players(login, data, score, updated) VALUES(?, ?, ?, ?) ON CONFLICT(login) DO UPDATE SET data = excluded.data, score = excluded.score, updated = excluded.updated',
    p.login,
    JSON.stringify(p),
    score(p),
    Date.now(),
  );
}

/** Игрок по sid + применение пассивного тика. */
function withPlayer(sid: unknown): { p: Player; save: () => void } | Response {
  const s = String(sid ?? '');
  const sess = row<{ login: string; ts: number }>('SELECT login, ts FROM sessions WHERE sid = ?', s);
  if (!sess) return err('no-session', 401);
  if (Date.now() - sess.ts > SESSION_TTL_MS) {
    exec('DELETE FROM sessions WHERE sid = ?', s);
    return err('session-expired', 401);
  }
  const p = loadPlayer(sess.login);
  if (!p) return err('no-player', 401);
  tick(p, Date.now(), Math.random);
  return { p, save: () => savePlayer(p) };
}

function authed(req: Request): { p: Player; save: () => void } | Response {
  const sid = req.method === 'GET' ? new URL(req.url).searchParams.get('sid') : undefined;
  return withPlayer(sid ?? undefined);
}

function publicState(p: Player) {
  return {
    login: p.login,
    money: Math.floor(p.money),
    dirty: Math.round(p.dirty * 10) / 10,
    hp: Math.round(p.hp * 10) / 10,
    roomLevel: p.roomLevel,
    upg: p.upg,
    cells: p.cells,
    buildCost: buildCost(p.cells.length),
    inv: p.inv.map((i) => ({ ...i, sell: sellPrice(i) })),
    log: p.log.slice(-14).reverse(),
    deaths: p.deaths,
    pulls: p.pulls,
    score: score(p),
    income: Math.round(incomeRate(p) * 100) / 100,
    dirtyRate: Math.round(dirtyRate(p) * 1000) / 1000,
    // цены следующих действий — фронт их только рисует, считает сервер
    upgCost: Object.fromEntries(UPGRADES.map((u) => [u.id, upgradeCost(u.id, p)])),
    expandCost: expandCost(p),
    cleanCost: cleanCost(p),
    repairCost: repairCost(p),
    nextEventIn: Math.max(0, p.nextEvent - Date.now()),
    serverTime: Date.now(),
  };
}

function catalog() {
  return { upgrades: UPGRADES, items: ITEMS, events: EVENTS };
}

// ---------------------------------------------------------------- роутер API
async function api(req: Request, path: string): Promise<Response> {
  let body: Record<string, unknown> = {};
  if (req.method === 'POST') {
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return err('bad-json');
    }
  }

  if (path === '/api/catalog') return json(catalog());

  // ---- вход / регистрация
  if (path === '/api/register' || path === '/api/login') {
    const nick = cleanNick(body.nick);
    if (!nick) return err('bad-nick');
    const pass = String(body.pass ?? '');
    if (pass.length < 4 || pass.length > 60) return err('bad-pass');
    const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'local';
    const now = Date.now();
    const fails = (loginFails.get(ip) || []).filter((t) => now - t < 60_000);
    if (fails.length >= 12) return err('too-many', 429);
    loginFails.set(ip, fails);

    if (path === '/api/register') {
      if (row('SELECT 1 FROM users WHERE login = ?', nick)) return err('taken', 409);
      const phash = await Bun.password.hash(pass);
      const p = newPlayer(nick, now);
      exec('INSERT INTO users(login, phash, created) VALUES(?, ?, ?)', nick, phash, now);
      savePlayer(p);
    } else {
      const u = row<{ phash: string }>('SELECT phash FROM users WHERE login = ?', nick);
      if (!u) {
        fails.push(now);
        loginFails.set(ip, fails);
        return err('no-such-user', 404);
      }
      if (!(await Bun.password.verify(pass, u.phash))) {
        fails.push(now);
        loginFails.set(ip, fails);
        return err('bad-pass', 401);
      }
    }
    const sid = newSid();
    exec('INSERT INTO sessions(sid, login, ts) VALUES(?, ?, ?)', sid, nick, now);
    exec('DELETE FROM sessions WHERE ts < ?', now - SESSION_TTL_MS);
    const p = loadPlayer(nick)!;
    return json({ sid, state: publicState(p), catalog: catalog() });
  }

  // ---- состояние мира
  if (path === '/api/state') {
    const r = authed(req);
    if (r instanceof Response) return r;
    r.save();
    return json({ state: publicState(r.p), catalog: catalog(), online: onlineCount() });
  }

  // ---- смыв унитаза
  if (path === '/api/pull' && req.method === 'POST') {
    const r = withPlayer(body.sid);
    if (r instanceof Response) return r;
    const now = Date.now();
    const last = pullAt.get(r.p.login) || 0;
    if (now - last < PULL_COOLDOWN_MS) return err('cooldown', 429);
    pullAt.set(r.p.login, now);
    if (pullAt.size > 5000) {
      for (const [k, t] of pullAt) if (now - t > 60_000) pullAt.delete(k);
    }
    const result = pull(r.p, Math.random, now);
    r.save();
    return json({ result, state: publicState(r.p) });
  }

  // ---- апгрейд / расширение / починка
  if (path === '/api/upgrade' && req.method === 'POST') {
    const r = withPlayer(body.sid);
    if (r instanceof Response) return r;
    const id = String(body.id ?? '');
    const cost = upgradeCost(id, r.p);
    if (cost === null) return err('no-upgrade');
    if (r.p.money < cost) return err('no-money', 402);
    r.p.money -= cost;
    r.p.upg[id] = (r.p.upg[id] || 0) + 1;
    r.save();
    return json({ ok: true, state: publicState(r.p) });
  }

  if (path === '/api/expand' && req.method === 'POST') {
    const r = withPlayer(body.sid);
    if (r instanceof Response) return r;
    const cost = expandCost(r.p);
    if (r.p.money < cost) return err('no-money', 402);
    r.p.money -= cost;
    r.p.roomLevel += 1;
    r.p.dirty = Math.max(0, r.p.dirty - 5);
    r.save();
    return json({ ok: true, state: publicState(r.p) });
  }

  // ---- стройка новой клетки карты (2×2 м)
  if (path === '/api/build' && req.method === 'POST') {
    const r = withPlayer(body.sid);
    if (r instanceof Response) return r;
    const dir = String(body.dir ?? '') as Dir;
    const fx = Math.round(Number(body.fx));
    const fz = Math.round(Number(body.fz));
    if (!Number.isFinite(fx) || !Number.isFinite(fz)) return err('bad-cell');
    const check = canBuild(r.p.cells, fx, fz, dir);
    if (!check.ok) return err('blocked');
    const cost = buildCost(r.p.cells.length);
    if (r.p.money < cost) return err('no-money', 402);
    r.p.money -= cost;
    r.p.cells.push({ x: check.x as number, z: check.z as number, kind: 'room' });
    pushLog(r.p, 'sys', `Построена клетка [${check.x}, ${check.z}]`, Date.now());
    r.save();
    return json({ ok: true, state: publicState(r.p) });
  }

  if (path === '/api/fix' && req.method === 'POST') {
    const r = withPlayer(body.sid);
    if (r instanceof Response) return r;
    const what = String(body.what ?? '');
    if (what === 'clean') {
      const cost = cleanCost(r.p);
      if (r.p.dirty <= 0) return err('already-clean');
      if (r.p.money < cost) return err('no-money', 402);
      r.p.money -= cost;
      r.p.dirty = 0;
    } else if (what === 'repair') {
      const cost = repairCost(r.p);
      if (r.p.hp >= 100) return err('already-fine');
      if (r.p.money < cost) return err('no-money', 402);
      r.p.money -= cost;
      r.p.hp = 100;
    } else {
      return err('bad-fix');
    }
    r.save();
    return json({ ok: true, state: publicState(r.p) });
  }

  // ---- торговая площадка
  if (path === '/api/market') {
    const r = authed(req);
    if (r instanceof Response) return r;
    r.save();
    const lots = rows<{ id: number; seller: string; item: string; price: number; ts: number }>(
      'SELECT id, seller, item, price, ts FROM market ORDER BY id DESC LIMIT 60',
    );
    return json({
      lots: lots.map((l) => {
        const item = JSON.parse(l.item) as InvItem;
        return { ...l, item: { ...item, sell: sellPrice(item) } };
      }),
      inv: r.p.inv.map((i) => ({ ...i, sell: sellPrice(i) })),
      fee: MARKET_FEE,
    });
  }

  if (path === '/api/market/sell' && req.method === 'POST') {
    const r = withPlayer(body.sid);
    if (r instanceof Response) return r;
    const idx = Number(body.idx);
    const price = Math.round(Number(body.price));
    const item = r.p.inv[idx];
    if (!item) return err('no-item');
    if (!(price >= 1 && price <= 1_000_000)) return err('bad-price');
    r.p.inv.splice(idx, 1);
    r.save();
    exec('INSERT INTO market(seller, item, price, ts) VALUES(?, ?, ?, ?)', r.p.login, JSON.stringify(item), price, Date.now());
    return json({ ok: true, state: publicState(r.p) });
  }

  if (path === '/api/market/buy' && req.method === 'POST') {
    const r = withPlayer(body.sid);
    if (r instanceof Response) return r;
    const lotId = Number(body.lot);
    const lot = row<{ id: number; seller: string; item: string; price: number }>(
      'SELECT id, seller, item, price FROM market WHERE id = ?',
      lotId,
    );
    if (!lot) return err('gone', 404);
    if (lot.seller === r.p.login) return err('own-lot');
    if (r.p.money < lot.price) return err('no-money', 402);
    if (r.p.inv.length >= 40) return err('inv-full', 402);
    const seller = loadPlayer(lot.seller);
    if (!seller) return err('seller-gone', 500);
    r.p.money -= lot.price;
    r.p.inv.push(JSON.parse(lot.item) as InvItem);
    seller.money += Math.round(lot.price * (1 - MARKET_FEE));
    savePlayer(seller);
    exec('DELETE FROM market WHERE id = ?', lotId);
    r.save();
    return json({ ok: true, state: publicState(r.p) });
  }

  // ---- рейтинг и онлайн
  if (path === '/api/rating') {
    const top = rows<{ login: string; score: number; data: string }>(
      'SELECT login, score, data FROM players ORDER BY score DESC LIMIT 50',
    );
    return json({
      top: top.map((e) => {
        const p = JSON.parse(e.data) as Player;
        const levels = Object.values(p.upg).reduce((a, b) => a + b, 0);
        return { login: e.login, score: e.score, roomLevel: p.roomLevel, levels, deaths: p.deaths };
      }),
      online: onlineCount(),
    });
  }

  if (path === '/api/logout' && req.method === 'POST') {
    exec('DELETE FROM sessions WHERE sid = ?', String(body.sid ?? ''));
    return json({ ok: true });
  }

  return err('not-found', 404);
}

function onlineCount(): number {
  const r = row<{ n: number }>('SELECT COUNT(*) AS n FROM players WHERE updated > ?', Date.now() - 5 * 60_000);
  return r ? r.n : 0;
}

// ---------------------------------------------------------------- раздача статики (только локально)
const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

async function serveStatic(path: string): Promise<Response> {
  const rel = path === '/' ? 'index.html' : path.replace(/^\/+/, '');
  if (rel.includes('..')) return err('bad-path', 400);
  // локально отдаём собранный dist (в нём index.html ссылается на бандл); корень проекта — запасной вариант
  for (const dir of ['dist', '.']) {
    const file = Bun.file(dir === '.' ? rel : `${dir}/${rel}`);
    if (await file.exists()) {
      const ext = rel.slice(rel.lastIndexOf('.'));
      return new Response(file, { headers: { 'Content-Type': MIME[ext] || 'application/octet-stream' } });
    }
  }
  return err('not-found', 404);
}

Bun.serve({
  port: PORT,
  async fetch(req) {
    const path = new URL(req.url).pathname;
    if (path === '/health') return json({ ok: true });
    if (path === '/api/online') return json({ online: onlineCount() });
    if (path.startsWith('/api/')) {
      try {
        return await api(req, path);
      } catch (e) {
        console.error('api error', path, e);
        return err('server-error', 500);
      }
    }
    if (process.env.STATIC_OFF === '1') return err('not-found', 404);
    return serveStatic(path);
  },
});

console.log(`cultivationtoilet api on :${PORT}`);
