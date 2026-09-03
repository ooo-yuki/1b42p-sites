// MIQQIL TANKS API — Bun REST + Neon (Lakebase Postgres). 127.0.0.1:8091
// Проксируется через router.py: https://miqqil.bratuxa.zomb.top/api/*
import { neon, Client } from '@neondatabase/serverless';
import { updateRating } from './game-logic.js';
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

const server = Bun.serve({
  port: 8091,
  hostname: '127.0.0.1',
  async fetch(req) {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/api/, '') || '/';
    try {
      if (path === '/health') return json({ ok: true, game: 'miqqil-tanks', motto: 'Мы уже победили 🏆' });

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
        const { token, vehicle, placement, total, kills } = (await req.json()) as {
          token?: string; vehicle?: string; placement?: number; total?: number; kills?: number;
        };
        const u = await userByToken(String(token ?? ''));
        if (!u) return json({ error: 'bad-token' }, 401);
        const p = Math.max(1, Math.min(Number(total) || 8, Number(placement) || 8));
        const t = Math.max(2, Number(total) || 8);
        const k = Math.max(0, Number(kills) || 0);
        const r = updateRating(u.rating, 1000, p, t, k);
        await sql`UPDATE users SET rating = ${r.newRating}, kills = kills + ${k}, matches = matches + 1 WHERE id = ${u.id}`;
        await sql`INSERT INTO matches (user_id, vehicle, placement, total, kills, rating_after)
                  VALUES (${u.id}, ${String(vehicle ?? 't42').slice(0, 16)}, ${p}, ${t}, ${k}, ${r.newRating})`;
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
});

console.log(`MIQQIL API on ${server.hostname}:${server.port} 🏆`);
