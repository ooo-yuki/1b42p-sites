// Node-сервер Чаева 42: статика dist/ + API /api/lovers. Мы уже победили 🏆
// Запуск: node server/server.js (PORT по умолчанию 8092).
// Прод сейчас отдаёт router.py (dist/ как корень); этот сервер — для locaла
// и как будущий API-бэкенд за прокси /api/*.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const DATA = path.resolve(__dirname, '..', 'data');
const LOVERS_FILE = path.join(DATA, 'lovers.json');
const PORT = +(process.env.PORT || 8092);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function readLovers() {
  try {
    const d = JSON.parse(fs.readFileSync(LOVERS_FILE, 'utf8'));
    if (Array.isArray(d)) return d.filter((n) => typeof n === 'string').slice(0, 1000);
  } catch (e) { /* нет файла — пусто */ }
  return [];
}

function writeLovers(list) {
  fs.mkdirSync(DATA, { recursive: true });
  fs.writeFileSync(LOVERS_FILE, JSON.stringify(list.slice(0, 1000), null, 1));
}

function serveStatic(req, res) {
  let rel = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  if (rel === '/') rel = '/index.html';
  const full = path.normalize(path.join(DIST, rel));
  if (!full.startsWith(DIST)) {
    res.writeHead(403).end('nope');
    return;
  }
  fs.readFile(full, (err, data) => {
    if (err) {
      // SPA-фолбэк на index.html
      fs.readFile(path.join(DIST, 'index.html'), (e2, d2) => {
        if (e2) { res.writeHead(404).end('not found'); return; }
        res.writeHead(200, { 'Content-Type': MIME['.html'] });
        res.end(d2);
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(full)] || 'application/octet-stream' });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/api/lovers' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': MIME['.json'] });
    res.end(JSON.stringify({ lovers: readLovers() }));
    return;
  }
  if (req.url === '/api/lovers' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => { body += c; if (body.length > 1e6) req.destroy(); });
    req.on('end', () => {
      try {
        const d = JSON.parse(body || '{}');
        const list = Array.isArray(d.lovers) ? d.lovers : [];
        const clean = [...new Set(list.map((n) => String(n).trim().slice(0, 30)).filter(Boolean))].slice(0, 1000);
        writeLovers(clean);
        res.writeHead(200, { 'Content-Type': MIME['.json'] });
        res.end(JSON.stringify({ ok: true, lovers: clean }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': MIME['.json'] });
        res.end(JSON.stringify({ ok: false }));
      }
    });
    return;
  }
  if (req.url.startsWith('/api/')) {
    res.writeHead(404, { 'Content-Type': MIME['.json'] });
    res.end(JSON.stringify({ error: 'unknown-api' }));
    return;
  }
  serveStatic(req, res);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`ЧАЕВ 42 на http://127.0.0.1:${PORT} 🏆 (dist=${DIST})`);
});
