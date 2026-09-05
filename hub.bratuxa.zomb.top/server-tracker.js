// 1Б42П ТРЕКЕР — маяки онлайна + статистика (Node + Postgres). 127.0.0.1:8093
// Проксируется через router.py: https://hub.bratuxa.zomb.top/api/*
const http = require('http');
const { Pool } = require('pg');

const PORT = 8093;
const ONLINE_SEC = 90;
const SITES = ['hub', 'chaev', 'doom', 'evaelph', 'smolgrad', 'miqqil', 'setden', 'svyatoslav', 'denis', 'sasha', 'gtaevv', 'brohacho', '1b42p', 'mtt'];
const pool = new Pool({
  host: '127.0.0.1', database: 'tracker42', user: 'tracker_api',
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
    return send(res, 404, { error: 'no-route' });
  } catch (e) {
    console.error('api err', e.message);
    return send(res, 500, { error: 'srv' });
  }
});

server.listen(PORT, '127.0.0.1', () => console.log('tracker-api on ' + PORT));
setInterval(snapshot, 60000);
snapshot();
