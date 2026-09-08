# Босс на огурце Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Отдельный сайт-леталка: босс всея 42 на огурце уворачивается и собирает очки, общая таблица рекордов по никам.

**Architecture:** Одна страница с игрой на холсте (чистая логика отдельно от отрисовки, крюк `window.__hook` для тестов) + крошечная служба рекордов на Bun с SQLite. Статику отдаёт роутер из папки сайта, `/api/*` проксирует на службу. TDD для логики, живые проверки в браузере и через curl.

**Tech Stack:** HTML + Canvas + JS (без движков), Bun + bun:sqlite, node (тест логики), Docker Compose, Caddy, роутер `router.py`.

**Spec:** `docs/superpowers/specs/2026-09-08-boss-cucumber-flyer-design.md`

## Global Constraints

- Свои файлы только внутри `ogurec.bratuxa.zomb.top/` + свои строки в `infra/compose.apps.yml` и `router.py`; чужие файлы не трогать.
- В `git add` только свои пути, никогда bare `git add -A`.
- Порт службы: `8096` (8091–8095 заняты, проверено через ss 2026-09-08).
- Ник: строка, максимум 20 символов, пустой превращается в `Братуха`.
- Очки на сервер: целое число от 0 до 999999, иначе отказ 400.
- Таблица: лучшие 10 сверху, видна всем; в базе держим лучшие 100.
- Тексты интерфейса по-русски.
- После каждой браузерной проверки свои вкладки закрывать.
- Финиш — только когда страница и таблица отвечают через curl.

---

## File Structure

- `ogurec.bratuxa.zomb.top/index.html` — вся игра: холст, интерфейс, таблица, форма ника. Первый инлайн-`<script>` — чистая логика + `window.__hook`; второй — отрисовка и сеть.
- `ogurec.bratuxa.zomb.top/server.ts` — служба рекордов: SQLite `data/ogurec.db`, `GET /api/scores`, `POST /api/score`.
- `ogurec.bratuxa.zomb.top/package.json` — имя и команда `server` (зависимостей нет, `bun:sqlite` встроен).
- `ogurec.bratuxa.zomb.top/tests/logic.test.js` — тест чистой логики через `window.__hook` (узор sasi42io).
- `infra/compose.apps.yml` — новая служба `ogurec-api` (образ `bat42/ogurec-api:latest`, порт `127.0.0.1:8096:8096`, том `/data:/app/data`).
- `router.py` — в `API_BACKENDS` строка `"ogurec.bratuxa.zomb.top": 8096`.
- `/etc/caddy/Caddyfile` (конфиг хоста, не репо) — добавить `ogurec.bratuxa.zomb.top` в общий список.

---

### Task 1: Чистая логика полёта + красный тест

**Files:**
- Create: `ogurec.bratuxa.zomb.top/index.html`
- Create: `ogurec.bratuxa.zomb.top/tests/logic.test.js`

**Interfaces:**
- Consumes: ничего.
- Produces: `window.__hook = { create, step, circleRect, spawnRow, SCORE_STAR }` — контракт для Task 2 (отрисовка) и Task 3 (тест).

Константы логики (фиксируем здесь, тест и игра используют их же):
`VIEW_W=480, VIEW_H=720, PLAYER_X=90, PLAYER_R=18, SPEED=220, SPAWN_EVERY=1.1, GAP=190, SCORE_STAR=25`.

- [ ] **Step 1: Write the failing test**

`ogurec.bratuxa.zomb.top/tests/logic.test.js` (полный текст, узор sasi42io):

```js
'use strict';
// Чистая логика огурца через window.__hook. Запуск: timeout 10 node tests/logic.test.js
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function makeEl() {
  return {
    style: {}, textContent: '', innerHTML: '', width: 480, height: 720,
    addEventListener() {},
    getContext() { return new Proxy({}, { get: (t, p) => () => {} }); },
  };
}
const els = {};
const sandbox = {
  console, Math, JSON, parseInt, isNaN, Infinity, Array, Object,
  localStorage: { getItem: () => null, setItem: () => {} },
  requestAnimationFrame() { return 0; },
  setInterval() { return 0; },
  setTimeout: setTimeout,
  fetch: () => Promise.resolve({}),
  window: null,
  document: { getElementById: (id) => (els[id] || (els[id] = makeEl())) },
};
sandbox.window = { innerWidth: 480, innerHeight: 720, addEventListener() {}, __hook: null };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
assert.ok(scripts.length >= 1, 'inline script not found');
vm.runInContext(scripts[0], sandbox, { filename: 'game-logic.js' });
const __hook = sandbox.window.__hook;
assert.ok(__hook, 'window.__hook missing');

// создание: игрок слева по центру, мир пуст, жив
const st = __hook.create();
assert.strictEqual(st.alive, true);
assert.strictEqual(st.player.x, 90);
assert.strictEqual(st.player.y, 360);
assert.deepStrictEqual(st.walls, []);
assert.deepStrictEqual(st.stars, []);

// шаг: тяга вверх двигает игрока вверх, мир едет влево
const y0 = st.player.y;
__hook.step(st, { up: true, down: false }, 0.5);
assert.ok(st.player.y < y0, 'up moves player up');
assert.ok(st.dist > 0, 'distance grows');

// круг-прямоугольник: касание = удар, даль = мимо
assert.strictEqual(__hook.circleRect(90, 360, 80, 350, 20, 20, 18), true);
assert.strictEqual(__hook.circleRect(90, 100, 80, 350, 20, 20, 18), false);

// звезда +25 к счёту подбора
const st2 = __hook.create();
st2.stars.push({ x: 90, y: 360 });
const got = __hook.step(st2, {}, 0);
assert.strictEqual(got.picked, 25);

// удар о стену убивает полёт
const st3 = __hook.create();
st3.walls.push({ x: 90, y: 360, w: 20, h: 20 });
__hook.step(st3, {}, 0);
assert.strictEqual(st3.alive, false);

console.log('logic.test.js: OK (create, step, circleRect, star=25, death)');
process.exit(0);
```

- [ ] **Step 2: Create minimal index.html with pure logic + hook (test still red until logic matches)**

Каркас `ogurec.bratuxa.zomb.top/index.html`: разметка (canvas#game, hud#score, #top с #toplist, #death с #nick и #saveBtn, #overScore) + первый `<script>` с чистой логикой:

```js
'use strict';
/* ===== огурец: чистая логика (тестируется через window.__hook) ===== */
var VIEW_W = 480, VIEW_H = 720, PLAYER_X = 90, PLAYER_R = 18;
var SPEED = 220, SPAWN_EVERY = 1.1, GAP = 190, SCORE_STAR = 25;
function create() {
  return { alive: true, dist: 0, picked: 0, spawnT: 0, player: { x: PLAYER_X, y: VIEW_H / 2 }, walls: [], stars: [] };
}
function circleRect(cx, cy, rx, ry, rw, rh, r) {
  var nx = Math.max(rx, Math.min(cx, rx + rw));
  var ny = Math.max(ry, Math.min(cy, ry + rh));
  var dx = cx - nx, dy = cy - ny;
  return dx * dx + dy * dy <= r * r;
}
function spawnRow(st, rnd) {
  var gy = GAP + rnd() * (VIEW_H - GAP * 2 - 120);
  st.walls.push({ x: VIEW_W, y: 0, w: 34, h: Math.round(gy - GAP / 2) });
  st.walls.push({ x: VIEW_W, y: Math.round(gy + GAP / 2), w: 34, h: VIEW_H });
  if (rnd() < 0.7) st.stars.push({ x: VIEW_W + 60, y: Math.round(gy) });
}
function step(st, input, dt) {
  var res = { picked: 0, dead: false };
  if (!st.alive) return res;
  if (input && input.up) st.player.y = Math.max(PLAYER_R, st.player.y - 320 * dt);
  if (input && input.down) st.player.y = Math.min(VIEW_H - PLAYER_R, st.player.y + 320 * dt);
  st.dist += SPEED * dt;
  st.spawnT += dt;
  var i, w, s;
  for (i = 0; i < st.walls.length; i++) { st.walls[i].x -= SPEED * dt; }
  for (i = 0; i < st.stars.length; i++) { st.stars[i].x -= SPEED * dt; }
  st.walls = st.walls.filter(function (w) { return w.x + w.w > 0; });
  st.stars = st.stars.filter(function (s) { return s.x > -20; });
  for (i = 0; i < st.stars.length; i++) {
    s = st.stars[i];
    var dx = st.player.x - s.x, dy = st.player.y - s.y;
    if (dx * dx + dy * dy <= (PLAYER_R + 10) * (PLAYER_R + 10)) {
      st.stars.splice(i, 1); i--;
      st.picked += SCORE_STAR; res.picked += SCORE_STAR;
    }
  }
  for (i = 0; i < st.walls.length; i++) {
    w = st.walls[i];
    if (circleRect(st.player.x, st.player.y, w.x, w.y, w.w, w.h, PLAYER_R)) {
      st.alive = false; res.dead = true; break;
    }
  }
  return res;
}
function scoreOf(st) { return Math.floor(st.dist / 50) + st.picked; }
window.__hook = { create: create, step: step, circleRect: circleRect, spawnRow: spawnRow, scoreOf: scoreOf, SCORE_STAR: SCORE_STAR };
```

- [ ] **Step 3: Run test to verify it fails-then-passes**

Run: `cd /root/sites/ogurec.bratuxa.zomb.top && timeout 10 node tests/logic.test.js`
Expected: PASS with `logic.test.js: OK (create, step, circleRect, star=25, death)`. Если FAIL — чинить логику, не тест.

- [ ] **Step 4: Commit**

```bash
git add ogurec.bratuxa.zomb.top/index.html ogurec.bratuxa.zomb.top/tests/logic.test.js
git commit -m "ogurec: чистая логика полёта + красный-зелёный тест 🥒"
```

### Task 2: Отрисовка, управление, таблица и форма ника

**Files:**
- Modify: `ogurec.bratuxa.zomb.top/index.html` (второй инлайн-`<script>`, стили, разметка таблицы)

**Interfaces:**
- Consumes: `window.__hook` из Task 1 (имена `create/step/scoreOf` — не переименовывать).
- Produces: играбельная страница; `GET /api/scores` и `POST /api/score` вызовы для Task 3.

- [ ] **Step 1: Add render + controls + records UI**

Второй `<script>`: цикл `requestAnimationFrame`, рисует огурец (зелёный скруглённый корпус + босс-кружок сверху), стены-вилky, звёзды; управление — стрелки/WASD вверх-вниз + тяга пальцем; смерть — карточка с очками, поле ника, кнопка сохранить:

```js
function loadTop() {
  return fetch('/api/scores').then(function (r) { return r.json(); }).then(function (d) {
    var box = document.getElementById('toplist');
    box.innerHTML = (d.scores || []).map(function (s, i) {
      return '<div>' + (i + 1) + '. ' + escapeHtml(s.nick) + ' — <b>' + s.score + '</b></div>';
    }).join('') || '<div>пока пусто — лети первым!</div>';
  }).catch(function () {
    document.getElementById('toplist').innerHTML = '<div>таблица пока недоступна</div>';
  });
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}
document.getElementById('saveBtn').addEventListener('click', function () {
  var nick = document.getElementById('nick').value;
  fetch('/api/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nick: nick, score: lastScore })
  }).then(loadTop);
});
```

- [ ] **Step 2: Browser-check the page**

Run: `cd /root/sites/ogurec.bratuxa.zomb.top && python3 -m http.server 8906` (фоном — после проверки убить), затем через browser-инструмент: открыть страницу, `page_info`, нажать старт, пролететь, увидеть смерть и форму ника. Снимки: комп + телефон. После — свои вкладки закрыть, сервер 8906 убить.

- [ ] **Step 3: Commit**

```bash
git add ogurec.bratuxa.zomb.top/index.html
git commit -m "ogurec: отрисовка, управление, таблица и форма 🥒"
```

### Task 3: Служба рекордов

**Files:**
- Create: `ogurec.bratuxa.zomb.top/server.ts`
- Create: `ogurec.bratuxa.zomb.top/package.json`

**Interfaces:**
- Consumes: ничего.
- Produces: `GET /api/scores → {scores:[{nick,score,ts}]}` топ-10; `POST /api/score {nick,score} → {ok:true}`; база `data/ogurec.db`, таблица `scores(nick,score,ts)`.

- [ ] **Step 1: Write the server**

`ogurec.bratuxa.zomb.top/server.ts` (полный текст):

```ts
import { Database } from 'bun:sqlite';

const PORT = 8096;
const db = new Database('data/ogurec.db', { create: true });
db.run(`CREATE TABLE IF NOT EXISTS scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nick TEXT NOT NULL,
  score INTEGER NOT NULL,
  ts INTEGER NOT NULL
)`);

function cleanNick(v: unknown): string {
  const s = String(v ?? '').slice(0, 20).trim();
  return s || 'Братуха';
}

function cleanScore(v: unknown): number | null {
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isInteger(n) || n < 0 || n > 999999) return null;
  return n;
}

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    if (req.method === 'GET' && url.pathname === '/api/scores') {
      const rows = db.query('SELECT nick, score, ts FROM scores ORDER BY score DESC, ts ASC LIMIT 10').all();
      return Response.json({ scores: rows });
    }
    if (req.method === 'POST' && url.pathname === '/api/score') {
      let body: { nick?: unknown; score?: unknown };
      try { body = await req.json(); } catch { return Response.json({ error: 'badjson' }, { status: 400 }); }
      const nick = cleanNick(body.nick);
      const score = cleanScore(body.score);
      if (score === null) return Response.json({ error: 'badscore' }, { status: 400 });
      db.run('INSERT INTO scores (nick, score, ts) VALUES (?, ?, ?)', [nick, score, Date.now()]);
      db.run('DELETE FROM scores WHERE id NOT IN (SELECT id FROM scores ORDER BY score DESC, ts ASC LIMIT 100)');
      return Response.json({ ok: true });
    }
    return Response.json({ error: 'notfound' }, { status: 404 });
  },
});

console.log('ogurec-api on :' + server.port);
```

`ogurec.bratuxa.zomb.top/package.json`:

```json
{
  "name": "ogurec-api",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "server": "bun ./server.ts"
  }
}
```

- [ ] **Step 2: Run locally and verify with curl**

```bash
cd /root/sites/ogurec.bratuxa.zomb.top && mkdir -p data && (bun ./server.ts &>/tmp/ogurec-api.log & echo $! > /tmp/ogurec-api.pid) && sleep 2
curl -s -X POST http://127.0.0.1:8096/api/score -H 'Content-Type: application/json' -d '{"nick":"Тест","score":250}'
curl -s http://127.0.0.1:8096/api/scores
curl -s -X POST http://127.0.0.1:8096/api/score -H 'Content-Type: application/json' -d '{"nick":"Жулик","score":-5}' -w ' %{http_code}\n'
kill $(cat /tmp/ogurec-api.pid)
```

Expected: первый POST `{"ok":true}`; GET содержит `Тест` с 250; третий POST `{"error":"badscore"}` с кодом 400.

- [ ] **Step 3: Commit**

```bash
git add ogurec.bratuxa.zomb.top/server.ts ogurec.bratuxa.zomb.top/package.json
git commit -m "ogurec: служба рекордов на 8096 🥒"
```

### Task 4: Проводка — compose, роутер, Caddy, запуск

**Files:**
- Modify: `infra/compose.apps.yml` (служба `ogurec-api`)
- Modify: `router.py` (строка в `API_BACKENDS`)
- Host config (не репо): `/etc/caddy/Caddyfile` — добавить хост в общий список

**Interfaces:**
- Consumes: Task 3 (служба слушает 8096).
- Produces: `https://ogurec.bratuxa.zomb.top/` отдаёт игру, `/api/scores` отвечает через роутер.

- [ ] **Step 1: Compose service**

Добавить в `infra/compose.apps.yml` рядом с `mtt-api`:

```yaml
  ogurec-api:
    build:
      context: ../ogurec.bratuxa.zomb.top
      dockerfile: ../infra/docker/bun.Dockerfile
    image: bat42/ogurec-api:latest
    restart: unless-stopped
    command: ["bun", "run", "server.ts"]
    volumes:
      - /data:/app/data
    ports: ["127.0.0.1:8096:8096"]
```

- [ ] **Step 2: Router backend**

В `router.py`, словарь `API_BACKENDS`, добавить пару (сохранить порядок портов):

```python
"ogurec.bratuxa.zomb.top": 8096,
```

Статика отдельно не нужна: роутер отдаёт папку сайта по имени хоста сам.

- [ ] **Step 3: Caddy host + reload**

В `/etc/caddy/Caddyfile` дописать `ogurec.bratuxa.zomb.top` в общий список хостов через запятую, затем:

```bash
caddy reload --config /etc/caddy/Caddyfile
```

- [ ] **Step 4: Build, restart, verify**

```bash
cd /root/sites/infra && docker compose -f compose.apps.yml up -d --build ogurec-api
docker compose -f compose.apps.yml restart chaev-router
sleep 3
curl -k -H "Host: ogurec.bratuxa.zomb.top" https://127.0.0.1/ -o /dev/null -w "site:%{http_code}\n"
curl -k -H "Host: ogurec.bratuxa.zomb.top" https://127.0.0.1/api/scores -w "\napi:%{http_code}\n"
```

Expected: `site:200`, `api:200` с телом `{"scores":[...]}`.

- [ ] **Step 5: Commit wiring**

```bash
git add infra/compose.apps.yml router.py
git commit -m "ogurec: проводка api:8096 + compose-служба 🥒"
```

### Task 5: Сквозная проверка и финиш

- [ ] **Step 1: Full flight in browser**

Через browser-инструмент на живой странице: старт → полёт 10 секунд → смерть → ввод ника → сохранить → таблица показывает ник. Снимки комп + телефон. Вкладки закрыть.

- [ ] **Step 2: Public curl**

```bash
curl -s https://ogurec.bratuxa.zomb.top/ -o /dev/null -w "site:%{http_code}\n"
curl -s https://ogurec.bratuxa.zomb.top/api/scores
```

Expected: `site:200`, тело таблицы с нашим ником.

- [ ] **Step 3: Secret scan**

```bash
git diff HEAD~5 -- ogurec.bratuxa.zomb.top/ | grep -iE 'password|secret|token|key' || echo CLEAN
```

Expected: `CLEAN`.

- [ ] **Step 4: Final commit of leftovers (only own paths)**

```bash
git status --short | head -n 20
git add ogurec.bratuxa.zomb.top/
git commit -m "ogurec: финиш сквозной проверки 🥒" || echo NOTHING-TO-COMMIT
```

## Self-Review

- Покрытие спеки: устройство — Task 1+4; полёт и очки — Task 1+2; таблица общая — Task 3+4; проверка и запуск — Task 2+5. Пробелов нет.
- Заглушек нет: все шаги с настоящим кодом и командами; «потом разберёмся» отсутствует.
- Имена一致: `create/step/circleRect/spawnRow/scoreOf/SCORE_STAR` в тесте, логике и отрисовке одни и те же; `/api/scores` и `/api/score` в клиенте и сервере совпадают; порт `8096` в сервере, compose и роутере один.
