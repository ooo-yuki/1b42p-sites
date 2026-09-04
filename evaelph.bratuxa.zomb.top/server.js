// ЭВВГРАД API — аккаунты + города братух (Node + Postgres). 127.0.0.1:8092
// Проксируется через router.py: https://evaelph.bratuxa.zomb.top/api/*
const http = require('http');
const crypto = require('crypto');
const { Pool } = require('pg');

const PORT = 8092;
const pool = new Pool({
  host: '127.0.0.1',
  database: 'evaelph',
  user: 'evaelph_api',
  password: process.env.EVA_DB_PASSWORD || '',
});

function hash(pass, salt) {
  return crypto.scryptSync(pass, salt, 32).toString('hex');
}
function send(res, code, obj) {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
}
function body(req) {
  return new Promise((resolve) => {
    let s = '';
    req.on('data', (c) => { s += c; if (s.length > 200000) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(s || '{}')); } catch (e) { resolve({}); } });
  });
}
function cleanNick(n) {
  return String(n || '').trim().slice(0, 24);
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    if (req.method === 'GET' && url.pathname === '/api/health') {
      await pool.query('SELECT 1');
      return send(res, 200, { ok: true });
    }
    if (req.method === 'POST' && url.pathname === '/api/register') {
      const b = await body(req);
      const nick = cleanNick(b.nick);
      const pass = String(b.password || '');
      if (!/^[A-Za-z0-9а-яА-ЯёЁ_ -]{2,24}$/u.test(nick)) return send(res, 400, { error: 'nick-bad' });
      if (pass.length < 4 || pass.length > 72) return send(res, 400, { error: 'pass-bad' });
      const salt = crypto.randomBytes(16).toString('hex');
      try {
        const r = await pool.query(
          'INSERT INTO users (nick, pass_hash) VALUES ($1, $2) RETURNING id',
          [nick, salt + ':' + hash(pass, salt)]
        );
        const token = crypto.randomBytes(24).toString('hex');
        await pool.query('INSERT INTO sessions (token, user_id) VALUES ($1, $2)', [token, r.rows[0].id]);
        return send(res, 200, { ok: true, token, nick });
      } catch (e) {
        if (e.code === '23505') return send(res, 409, { error: 'nick-taken' });
        throw e;
      }
    }
    if (req.method === 'POST' && url.pathname === '/api/login') {
      const b = await body(req);
      const nick = cleanNick(b.nick);
      const pass = String(b.password || '');
      const r = await pool.query('SELECT id, pass_hash FROM users WHERE nick=$1', [nick]);
      if (!r.rows.length) return send(res, 401, { error: 'no-user' });
      const parts = String(r.rows[0].pass_hash).split(':');
      if (parts.length !== 2 || parts[1] !== hash(pass, parts[0])) return send(res, 401, { error: 'bad-pass' });
      const token = crypto.randomBytes(24).toString('hex');
      await pool.query('INSERT INTO sessions (token, user_id) VALUES ($1, $2)', [token, r.rows[0].id]);
      return send(res, 200, { ok: true, token, nick });
    }
    if (req.method === 'POST' && url.pathname === '/api/logout') {
      const b = await body(req);
      if (b.token) await pool.query('DELETE FROM sessions WHERE token=$1', [String(b.token)]);
      return send(res, 200, { ok: true });
    }
    if (req.method === 'GET' && url.pathname === '/api/me') {
      const token = url.searchParams.get('token') || '';
      const r = await pool.query(
        'SELECT u.nick FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token=$1', [token]
      );
      if (!r.rows.length) return send(res, 401, { error: 'no-auth' });
      return send(res, 200, { ok: true, nick: r.rows[0].nick });
    }
    if (req.method === 'POST' && url.pathname === '/api/save-city') {
      const b = await body(req);
      const token = String(b.token || '');
      const r = await pool.query('SELECT user_id FROM sessions WHERE token=$1', [token]);
      if (!r.rows.length) return send(res, 401, { error: 'no-auth' });
      const uid = r.rows[0].user_id;
      const data = (b.city && typeof b.city === 'object') ? b.city : {};
      await pool.query(
        'INSERT INTO cities (user_id, data, updated_at) VALUES ($1, $2, NOW()) ' +
        'ON CONFLICT (user_id) DO UPDATE SET data=$2, updated_at=NOW()',
        [uid, JSON.stringify(data).slice(0, 200000)]
      );
      return send(res, 200, { ok: true });
    }
    if (req.method === 'GET' && url.pathname === '/api/cities') {
      const r = await pool.query(
        'SELECT u.nick, c.updated_at FROM cities c JOIN users u ON u.id=c.user_id ORDER BY c.updated_at DESC LIMIT 42'
      );
      return send(res, 200, { ok: true, cities: r.rows });
    }
    if (req.method === 'GET' && url.pathname === '/api/city') {
      const nick = cleanNick(url.searchParams.get('nick'));
      const r = await pool.query(
        'SELECT c.data FROM cities c JOIN users u ON u.id=c.user_id WHERE u.nick=$1', [nick]
      );
      if (!r.rows.length) return send(res, 404, { error: 'no-city' });
      return send(res, 200, { ok: true, nick, city: r.rows[0].data });
    }
    return send(res, 404, { error: 'no-route' });
  } catch (e) {
    console.error('api err', e.message);
    return send(res, 500, { error: 'srv' });
  }
});

server.listen(PORT, '127.0.0.1', () => console.log('evaelph-api on ' + PORT));
