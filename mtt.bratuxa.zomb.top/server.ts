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
  fetch() {
    return Response.json({ error: 'bad' }, { status: 404 });
  },
});

console.log(`mtt-api on :${PORT}`);
