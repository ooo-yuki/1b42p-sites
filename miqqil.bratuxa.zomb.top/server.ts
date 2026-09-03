// MIQQIL TANKS API — Bun REST + WebSocket-мультиплеер + Neon (Lakebase Postgres). 127.0.0.1:8091
// Проксируется через router.py: https://miqqil.bratuxa.zomb.top/api/* и /api/ws (WS-туннель).
import { neon, Client } from '@neondatabase/serverless';
import { updateRating, getVehicle } from './game-logic.js';
import { makeWorld, addUnit, removeUnit, setInput, stepWorld, unitPublicState, evictWeakestBot, CONSTS } from './sim.js';
import schema from './schema.sql' with { type: 'text' };

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) { console.error('DATABASE_URL missing'); process.exit(1); }
const sql = neon(DATABASE_URL);

const ddl = new Client(DATABASE_URL);
await ddl.connect();
for (const stmt of schema.split(';').map(s => s.trim()).filter(Boolean)) {
  await ddl.query(stmt);
}
await ddl.end();

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

async function userByToken(token: string) {
  if (!token) return null;
  const rows = await sql`SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ${token}`;
  return rows[0] ?? null;
}

async function recordMatch(dbUserId: number, vehicle: string, placement: number, total: number, kills: number) {
  const rows = await sql`SELECT rating FROM users WHERE id = ${dbUserId}`;
  const u = rows[0];
  if (!u) return null;
  const p = Math.max(1, Math.min(total || 8, placement || 8));
  const t = Math.max(2, total || 8);
  const k = Math.max(0, kills || 0);
  const r = updateRating(u.rating, 1000, p, t, k);
  await sql`UPDATE users SET rating = ${r.newRating}, kills = kills + ${k}, matches = matches + 1 WHERE id = ${dbUserId}`;
  await sql`INSERT INTO matches (user_id, vehicle, placement, total, kills, rating_after)
            VALUES (${dbUserId}, ${String(vehicle ?? 't42').slice(0, 16)}, ${p}, ${t}, ${k}, ${r.newRating})`;
  return r;
}

// ============================================================
// ОБЩЕЕ ПОЛЕ БОЯ — один авторитарный мир на весь процесс
// ============================================================
const world = makeWorld((Math.random() * 2 ** 31) | 0);
const sockets = new Set<any>();
const ipCounts = new Map<string, number>();
const pendingDisconnect = new Map<string, { unitId: string; timer: ReturnType<typeof setTimeout> }>();
const GRACE_MS = 10_000;
const IP_LIMIT = 10;
const TICK_HZ = 30;
const BROADCAST_EVERY = 2; // 15 Гц снапшотов

function identityKey(dbUserId: number | null, token: string, nick: string) {
  return dbUserId ? `u:${dbUserId}` : (token ? `t:${token}` : `g:${nick.toLowerCase()}`);
}

async function handleRoundResults(results: any[]) {
  for (const r of results) {
    if (r.isBot || !r.owner || !r.owner.dbUserId) continue;
    try {
      const rr = await recordMatch(r.owner.dbUserId, r.vid, r.place, r.total, r.kills);
      if (!rr) continue;
      for (const ws of sockets) {
        if (ws.data?.dbUserId === r.owner.dbUserId) {
          ws.send(JSON.stringify({ t: 'rating', rating: rr.newRating, delta: rr.delta }));
        }
      }
    } catch (e) {
      console.error('rating err', e);
    }
  }
}

let pendingEvents: any[] = [];
let tickN = 0;
setInterval(() => {
  const events = stepWorld(world, 1 / TICK_HZ);
  if (events.length) pendingEvents.push(...events);
  for (const ev of events) {
    if (ev.t === 'round' && ev.phase === 'results') handleRoundResults(ev.results);
  }
  tickN++;
  if (tickN % BROADCAST_EVERY === 0) broadcastState();
}, 1000 / TICK_HZ);

function broadcastState() {
  if (sockets.size === 0) { pendingEvents = []; return; }
  const payload = JSON.stringify({
    t: 'state',
    time: Date.now(),
    units: [...world.units.values()].map(unitPublicState),
    zone: { x: world.zone.x, z: world.zone.z, r: world.zone.r, phase: world.zone.phase, t: Math.max(0, world.zone.t), active: world.zone.active },
    round: { phase: world.round.phase, timer: Math.max(0, world.round.timer || 0), elapsed: world.round.elapsed || 0, seq: world.round.seq },
    events: pendingEvents,
    online: sockets.size,
  });
  pendingEvents = [];
  for (const ws of sockets) { try { ws.send(payload); } catch {} }
}

function scheduleGraceRemoval(ws: any) {
  const key = ws.data.identityKey;
  const unitId = ws.data.unitId;
  if (!key || !unitId) return;
  const timer = setTimeout(() => {
    removeUnit(world, unitId);
    pendingDisconnect.delete(key);
  }, GRACE_MS);
  pendingDisconnect.set(key, { unitId, timer });
}

async function handleJoin(ws: any, msg: any) {
  let nick = String(msg?.nick ?? '').trim().slice(0, 16) || 'Братуха';
  let vid = String(msg?.veh ?? 't42');
  try { getVehicle(vid); } catch { vid = 't42'; }
  const token = String(msg?.token ?? '');
  let dbUserId: number | null = null;
  if (token) {
    try { const u = await userByToken(token); if (u) { dbUserId = u.id; nick = u.nick; } } catch {}
  }
  const key = identityKey(dbUserId, token, nick);
  const pending = pendingDisconnect.get(key);
  let unitId: string;
  if (pending && world.units.has(pending.unitId)) {
    clearTimeout(pending.timer);
    pendingDisconnect.delete(key);
    unitId = pending.unitId;
    const u = world.units.get(unitId)!;
    u.connected = true;
  } else {
    unitId = crypto.randomUUID();
    if (world.units.size >= CONSTS.SQUAD) evictWeakestBot(world);
    addUnit(world, { id: unitId, nick, vid, owner: dbUserId ? { dbUserId } : null });
  }
  ws.data.unitId = unitId;
  ws.data.token = token;
  ws.data.nick = nick;
  ws.data.dbUserId = dbUserId;
  ws.data.identityKey = key;
  ws.send(JSON.stringify({ t: 'welcome', id: unitId, seed: world.arena.seed, arenaSize: world.arena.size }));
}

function handleWsMessage(ws: any, msg: any) {
  if (!msg || typeof msg !== 'object') return;
  if (msg.t === 'join') { handleJoin(ws, msg); return; }
  if (msg.t === 'input') {
    if (!ws.data.unitId) return;
    setInput(world, ws.data.unitId, { dx: msg.dx, dz: msg.dz, aimYaw: msg.aimYaw, fire: msg.fire });
    return;
  }
  if (msg.t === 'ping') { ws.send(JSON.stringify({ t: 'pong', ts: msg.ts })); return; }
}

// ============================================================
// HTTP + WS сервер
// ============================================================
const server = Bun.serve({
  port: 8091,
  hostname: '127.0.0.1',
  async fetch(req, srv) {
    const url = new URL(req.url);

    if (url.pathname === '/api/ws' || url.pathname === '/ws') {
      const fwd = req.headers.get('x-forwarded-for');
      const ip = (fwd ? fwd.split(',')[0].trim() : null) || srv.requestIP(req)?.address || 'unknown';
      const count = ipCounts.get(ip) || 0;
      if (count >= IP_LIMIT) return new Response('too many connections', { status: 429 });
      const ok = srv.upgrade(req, { data: { ip, unitId: null } });
      return ok ? undefined : new Response('upgrade failed', { status: 400 });
    }

    const path = url.pathname.replace(/^\/api/, '') || '/';
    try {
      if (path === '/health') return json({ ok: true, game: 'miqqil-tanks', online: sockets.size, motto: 'Мы уже победили 🏆' });

      if (path === '/register' && req.method === 'POST') {
        const { nick, password } = (await req.json()) as { nick?: string; password?: string };
        const clean = String(nick ?? '').trim().slice(0, 16);
        if (!clean || !password || String(password).length < 3) return json({ error: 'nick+password>=3' }, 400);
        const hash = await Bun.password.hash(String(password));
        try {
          const rows = await sql`INSERT INTO users (nick, pass_hash) VALUES (${clean}, ${hash}) RETURNING id, nick, rating`;
          const token = crypto.randomUUID().replaceAll('-', '');
          await sql`INSERT INTO sessions (token, user_id) VALUES (${token}, ${rows[0].id})`;
          return json({ token, nick: rows[0].nick, rating: rows[0].rating });
        } catch {
          return json({ error: 'nick-taken' }, 409);
        }
      }

      if (path === '/login' && req.method === 'POST') {
        const { nick, password } = (await req.json()) as { nick?: string; password?: string };
        const clean = String(nick ?? '').trim().slice(0, 16);
        const rows = await sql`SELECT * FROM users WHERE nick = ${clean}`;
        const u = rows[0];
        if (!u || !(await Bun.password.verify(String(password ?? ''), u.pass_hash))) {
          return json({ error: 'bad-auth' }, 401);
        }
        const token = crypto.randomUUID().replaceAll('-', '');
        await sql`INSERT INTO sessions (token, user_id) VALUES (${token}, ${u.id})`;
        return json({ token, nick: u.nick, rating: u.rating });
      }

      if (path === '/match' && req.method === 'POST') {
        // офлайн-фоллбек: клиент без WS сам считает исход локального боя и шлёт сюда.
        const { token, vehicle, placement, total, kills } = (await req.json()) as {
          token?: string; vehicle?: string; placement?: number; total?: number; kills?: number;
        };
        const u = await userByToken(String(token ?? ''));
        if (!u) return json({ error: 'bad-token' }, 401);
        const r = await recordMatch(u.id, String(vehicle ?? 't42'), Number(placement) || 8, Number(total) || 8, Number(kills) || 0);
        if (!r) return json({ error: 'db-down' }, 503);
        return json({ rating: r.newRating, delta: r.delta });
      }

      if (path === '/leaderboard') {
        const top = await sql`SELECT nick, rating, kills, matches FROM users ORDER BY rating DESC LIMIT 10`;
        return json({ top });
      }

      return json({ error: 'not-found' }, 404);
    } catch (e) {
      console.error('api err', path, e);
      return json({ error: 'db-down' }, 503);
    }
  },
  websocket: {
    open(ws) {
      sockets.add(ws);
      ipCounts.set(ws.data.ip, (ipCounts.get(ws.data.ip) || 0) + 1);
    },
    message(ws, raw) {
      let msg: any;
      try { msg = JSON.parse(String(raw)); } catch { return; }
      handleWsMessage(ws, msg);
    },
    close(ws) {
      sockets.delete(ws);
      ipCounts.set(ws.data.ip, Math.max(0, (ipCounts.get(ws.data.ip) || 1) - 1));
      if (ws.data.unitId) scheduleGraceRemoval(ws);
    },
  },
});

console.log(`MIQQIL API on ${server.hostname}:${server.port} 🏆`);
