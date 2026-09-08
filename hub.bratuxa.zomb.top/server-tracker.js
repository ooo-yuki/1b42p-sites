// 1Б42П ТРЕКЕР — маяки онлайна + статистика (Node + Postgres). 127.0.0.1:8093
// Проксируется через router.py: https://hub.bratuxa.zomb.top/api/*
const http = require('http');
const { Pool } = require('pg');

const PORT = 8093;
const ONLINE_SEC = 90;
const SITES = ['hub', 'chaev', 'doom', 'evaelph', 'smolgrad', 'miqqil', 'setden', 'svyatoslav', 'denis', 'sasha', 'gtaevv', 'brohacho', '1b42p', 'mtt', 'laiv42', '42vs', 'ai-714ef0', 'pampers', 'shturm', 'skitons', 'tulenko', 'fugo', 'nerenol', 'nerenol-egor', 'bunker42', 'mafia42', 'sasi42io'];
// Магазин sasi42io: цены в коинах
const PRICES = {
  skin_crimson: 5000, skin_ocean: 5000, skin_violet: 5000, skin_gold: 5000,
  buff_speed: 10000, buff_score: 15000, buff_magnet: 20000, shield: 3000,
};
function cleanName(v) {
  const name = String(v == null ? '' : v).trim().replace(/[<>&]/g, '');
  return (!name || name.length > 20) ? null : name;
}
async function walletState(client, site, name) {
  const w = await client.query('SELECT coins FROM sasi_wallet WHERE site=$1 AND name=$2', [site, name]);
  const it = await client.query('SELECT item, qty FROM sasi_items WHERE site=$1 AND name=$2', [site, name]);
  const items = {};
  for (const r of it.rows) items[r.item] = r.qty;
  return { coins: w.rows.length ? Number(w.rows[0].coins) : 0, items };
}
const pool = new Pool({
  host: process.env.PGHOST || '127.0.0.1', database: 'tracker42', user: 'tracker_api',
  password: process.env.TR_DB_PASSWORD || '',
});

function send(res, code, obj) {
  res.writeHead(code, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(obj));
}
function body(req) {
  return new Promise((resolve) => {
    let s = '';
    req.on('data', (c) => { s += c; if (s.length > 4096) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(s || '{}')); } catch (e) { resolve({}); } });
  });
}
async function snapshot() {
  try {
    const on = await pool.query(
      "SELECT site, COUNT(*) c FROM track_sessions WHERE last_seen > NOW() - INTERVAL '90 seconds' GROUP BY site"
    );
    const per = {};
    let total = 0;
    for (const r of on.rows) { per[r.site] = Number(r.c); total += Number(r.c); }
    await pool.query('INSERT INTO track_history (ts, per_site, total) VALUES (date_trunc($1, NOW()), $2, $3) ON CONFLICT (ts) DO UPDATE SET per_site=$2, total=GREATEST(track_history.total, $3)', ['minute', JSON.stringify(per), total]);
    await pool.query("DELETE FROM track_history WHERE ts < NOW() - INTERVAL '30 days'");
  } catch (e) { console.error('snap err', e.message); }
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'OPTIONS') return send(res, 204, {});
    const url = new URL(req.url, 'http://x');
    if (req.method === 'GET' && url.pathname === '/api/health') {
      await pool.query('SELECT 1');
      return send(res, 200, { ok: true });
    }
    if (req.method === 'POST' && url.pathname === '/api/track') {
      const b = await body(req);
      const site = SITES.includes(b.site) ? b.site : null;
      const sid = /^[0-9a-f]{32}$/.test(String(b.sid || '')) ? String(b.sid) : null;
      if (!site || !sid) return send(res, 400, { error: 'bad' });
      // Боты с этого сервака (пробы, health-чеки) в онлайн не пишутся:
      // первый IP цепочки XFF — тот, кого увидел Caddy. Отвечаем 200,
      // чтобы никого не ронять, но сессию не создаём.
      const xff = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
      const sock = (req.socket && req.socket.remoteAddress) || '';
      const ip = xff || sock;
      const SELF = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1', '45.90.98.113', '2a0e:97c0:3e3:3aa::122']);
      if (SELF.has(ip)) return send(res, 200, { ok: true });
      await pool.query(
        'INSERT INTO track_sessions (sid, site) VALUES ($1, $2) ' +
        'ON CONFLICT (sid) DO UPDATE SET site=$2, last_seen=NOW()',
        [sid, site]
      );
      return send(res, 200, { ok: true });
    }
    if (req.method === 'GET' && url.pathname === '/api/stats') {
      const on = await pool.query(
        "SELECT site, COUNT(*) c FROM track_sessions WHERE last_seen > NOW() - INTERVAL '90 seconds' GROUP BY site"
      );
      const online = {};
      let onlineTotal = 0;
      for (const r of on.rows) { online[r.site] = Number(r.c); onlineTotal += Number(r.c); }
      const tot = await pool.query('SELECT COUNT(*) c FROM track_sessions');
      const per = await pool.query('SELECT site, COUNT(*) c FROM track_sessions GROUP BY site ORDER BY 2 DESC');
      const mx = await pool.query('SELECT total, ts FROM track_history ORDER BY total DESC, ts DESC LIMIT 1');
      const hist = await pool.query("SELECT ts, per_site, total FROM track_history WHERE ts > NOW() - INTERVAL '24 hours' ORDER BY ts");
      return send(res, 200, {
        ok: true,
        online, onlineTotal,
        everTotal: Number(tot.rows[0].c),
        everPerSite: per.rows.map((r) => ({ site: r.site, n: Number(r.c) })),
        maxOnline: mx.rows.length ? Number(mx.rows[0].total) : onlineTotal,
        maxAt: mx.rows.length ? mx.rows[0].ts : null,
        history: hist.rows,
      });
    }
    if (req.method === 'POST' && url.pathname === '/api/record') {
      const b = await body(req);
      const site = SITES.includes(b.site) ? b.site : 'sasi42io';
      const name = cleanName(b.name);
      const score = Number(b.score);
      if (!name) return send(res, 400, { error: 'bad-name' });
      if (!Number.isInteger(score) || score < 0 || score > 9999999) return send(res, 400, { error: 'bad-score' });
      const cur = await pool.query('SELECT score FROM sasi_records WHERE site=$1 AND name=$2', [site, name]);
      let best, newBest;
      if (!cur.rows.length) {
        await pool.query('INSERT INTO sasi_records (site, name, score) VALUES ($1, $2, $3)', [site, name, score]);
        best = score; newBest = true;
      } else if (score > cur.rows[0].score) {
        await pool.query('UPDATE sasi_records SET score=$3, created_at=NOW() WHERE site=$1 AND name=$2', [site, name, score]);
        best = score; newBest = true;
      } else {
        best = cur.rows[0].score; newBest = false;
      }
      const earn = Math.floor(score / 3);
      if (earn > 0) {
        await pool.query(
          'INSERT INTO sasi_wallet (site, name, coins) VALUES ($1, $2, $3) ' +
          'ON CONFLICT (site, name) DO UPDATE SET coins = sasi_wallet.coins + EXCLUDED.coins',
          [site, name, earn]
        );
      } else {
        await pool.query(
          'INSERT INTO sasi_wallet (site, name, coins) VALUES ($1, $2, 0) ON CONFLICT (site, name) DO NOTHING',
          [site, name]
        );
      }
      const st = await walletState(pool, site, name);
      return send(res, 200, { ok: true, best, coins: st.coins, newBest });
    }
    if (req.method === 'GET' && url.pathname === '/api/records') {
      const site = SITES.includes(url.searchParams.get('site')) ? url.searchParams.get('site') : 'sasi42io';
      let limit = parseInt(url.searchParams.get('limit') || '10', 10);
      if (!Number.isFinite(limit)) limit = 10;
      limit = Math.max(1, Math.min(20, limit));
      const r = await pool.query(
        'SELECT name, score, created_at FROM sasi_records WHERE site=$1 ORDER BY score DESC, created_at ASC LIMIT $2',
        [site, limit]
      );
      return send(res, 200, { ok: true, records: r.rows });
    }
    if (req.method === 'GET' && url.pathname === '/api/wallet') {
      const q = url.searchParams;
      const site = SITES.includes(q.get('site')) ? q.get('site') : 'sasi42io';
      const name = cleanName(q.get('name'));
      if (!name) return send(res, 400, { error: 'bad-name' });
      const st = await walletState(pool, site, name);
      return send(res, 200, { ok: true, coins: st.coins, items: st.items });
    }
    if (req.method === 'POST' && url.pathname === '/api/shop/buy') {
      const b = await body(req);
      const site = SITES.includes(b.site) ? b.site : 'sasi42io';
      const name = cleanName(b.name);
      const item = String(b.item || '');
      if (!name) return send(res, 400, { error: 'bad-name' });
      if (!Object.prototype.hasOwnProperty.call(PRICES, item)) return send(res, 400, { error: 'bad-item' });
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const w = await client.query('SELECT coins FROM sasi_wallet WHERE site=$1 AND name=$2 FOR UPDATE', [site, name]);
        const coins = w.rows.length ? Number(w.rows[0].coins) : 0;
        const it = await client.query('SELECT qty FROM sasi_items WHERE site=$1 AND name=$2 AND item=$3', [site, name, item]);
        const qty = it.rows.length ? it.rows[0].qty : 0;
        if (item !== 'shield' && qty > 0) {
          await client.query('COMMIT');
          const st = await walletState(pool, site, name);
          return send(res, 200, { ok: true, coins: st.coins, items: st.items, owned: true });
        }
        const price = PRICES[item];
        if (coins < price) {
          await client.query('ROLLBACK');
          const st = await walletState(pool, site, name);
          return send(res, 400, { error: 'no-funds', coins: st.coins, items: st.items });
        }
        if (!w.rows.length) {
          await client.query('INSERT INTO sasi_wallet (site, name, coins) VALUES ($1, $2, $3)', [site, name, coins - price]);
        } else {
          await client.query('UPDATE sasi_wallet SET coins = coins - $3 WHERE site=$1 AND name=$2', [site, name, price]);
        }
        if (item === 'shield') {
          await client.query(
            'INSERT INTO sasi_items (site, name, item, qty) VALUES ($1, $2, $3, 1) ' +
            'ON CONFLICT (site, name, item) DO UPDATE SET qty = sasi_items.qty + 1',
            [site, name, item]
          );
        } else {
          await client.query(
            'INSERT INTO sasi_items (site, name, item, qty) VALUES ($1, $2, $3, 1) ' +
            'ON CONFLICT (site, name, item) DO UPDATE SET qty = 1',
            [site, name, item]
          );
        }
        await client.query('COMMIT');
        const st = await walletState(pool, site, name);
        return send(res, 200, { ok: true, coins: st.coins, items: st.items });
      } catch (e) {
        try { await client.query('ROLLBACK'); } catch (_) {}
        throw e;
      } finally {
        client.release();
      }
    }
    if (req.method === 'POST' && url.pathname === '/api/shop/consume') {
      const b = await body(req);
      const site = SITES.includes(b.site) ? b.site : 'sasi42io';
      const name = cleanName(b.name);
      const item = String(b.item == null || b.item === '' ? 'shield' : b.item);
      if (!name) return send(res, 400, { error: 'bad-name' });
      if (!Object.prototype.hasOwnProperty.call(PRICES, item)) return send(res, 400, { error: 'bad-item' });
      const r = await pool.query(
        'UPDATE sasi_items SET qty = GREATEST(qty - 1, 0) WHERE site=$1 AND name=$2 AND item=$3 RETURNING qty',
        [site, name, item]
      );
      const qty = r.rows.length ? r.rows[0].qty : 0;
      return send(res, 200, { ok: true, item, qty });
    }
    return send(res, 404, { error: 'no-route' });
  } catch (e) {
    console.error('api err', e.message);
    return send(res, 500, { error: 'srv' });
  }
});

server.listen(PORT, '127.0.0.1', () => console.log('tracker-api on ' + PORT));
setInterval(snapshot, 60000);
snapshot();
