'use strict';
// Task 2: тест чистой логики sasi42io через window.__hook.
// Headless: стабы document/window/localStorage/requestAnimationFrame,
// грузим РЕАЛЬНЫЙ инлайн-скрипт из index.html, в конце process.exit(0)
// (игра крутит requestAnimationFrame — без exit node висит).
// Запуск: timeout 10 node tests/logic.test.js (ждём exit 0).
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// --- стабы ---
function makeEl() {
  return {
    style: {},
    textContent: '',
    innerHTML: '',
    width: 800,
    height: 600,
    addEventListener() {},
    getContext() {
      return new Proxy({}, { get: (t, p) => (p === 'canvas' ? {} : () => {}) });
    },
  };
}
const els = {};
const sandbox = {
  console,
  Math,
  JSON,
  parseInt,
  isNaN,
  Infinity,
  Array: Array,
  Object: Object,
  Uint8Array: Uint8Array,
  crypto: { getRandomValues: (a) => a },
  localStorage: { getItem: () => null, setItem: () => {} },
  requestAnimationFrame() { return 0; }, // НЕ запускаем игровой цикл
  setInterval() { return 0; },
  setTimeout: setTimeout,
  fetch: () => Promise.resolve({}),
  window: null,
  document: { getElementById: (id) => (els[id] || (els[id] = makeEl())) },
};
sandbox.window = {
  innerWidth: 800,
  innerHeight: 600,
  addEventListener() {},
  __hook: null,
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

// --- грузим реальный игровой скрипт (первый инлайн <script>) ---
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
assert.ok(scripts.length >= 1, 'inline script not found');
vm.runInContext(scripts[0], sandbox, { filename: 'game-inline.js' });
const __hook = sandbox.window.__hook;
assert.ok(__hook, 'window.__hook missing');

// --- очки еды: банан 5, связка 25, торнадо 70 (через spawnFood веса 70/25/5) ---
assert.strictEqual(__hook.spawnFood(0.0).pts, 5);
assert.strictEqual(__hook.spawnFood(0.69).pts, 5);
assert.strictEqual(__hook.spawnFood(0.70).pts, 25);
assert.strictEqual(__hook.spawnFood(0.94).pts, 25);
assert.strictEqual(__hook.spawnFood(0.95).pts, 70);
assert.strictEqual(__hook.spawnFood(0.99).pts, 70);
assert.strictEqual(__hook.eatFood(0, 5, 1), 5); // банан
assert.strictEqual(__hook.eatFood(0, 25, 1), 25); // связка
assert.strictEqual(__hook.eatFood(0, 70, 1), 70); // торнадо

// --- бустер x2: очки удваиваются (банан со звездой даёт 10) ---
assert.strictEqual(__hook.eatFood(0, 5, 2), 10);

// --- столкновение головой с телом = смерть ---
assert.strictEqual(__hook.collide(100, 100, 100, 100, 12), true); // голова в теле
assert.strictEqual(__hook.collide(100, 100, 105, 100, 12), true); // рядом — задевает
assert.strictEqual(__hook.collide(0, 0, 500, 500, 12), false); // далеко — мимо

// --- stepBot: возвращает угол, охотник идёт на слабого игрока ---
const W = 3000, H = 3000;
const a0 = __hook.stepBot(
  { x: 1500, y: 1500, angle: Math.PI, score: 50, kind: 'normal' },
  [{ x: 100, y: 100 }],
  { x: 2000, y: 2000, score: 10 },
  W, H
);
assert.ok(Number.isFinite(a0), 'stepBot must return finite angle');
const hunterWeak = __hook.stepBot(
  { x: 1500, y: 1500, angle: 0, score: 50, kind: 'hunter' },
  [{ x: 100, y: 100 }],
  { x: 1600, y: 1500, score: 10 }, // игрок слабее — цель: восток (0 рад)
  W, H
);
assert.ok(Math.abs(hunterWeak - 0) < 0.13, 'hunter chases weaker player, got ' + hunterWeak);

console.log('logic.test.js: OK (5/25/70, x2=10, collide, stepBot)');

// --- __hook API: направление + пауза ---
assert.ok(__hook.getDir().x === 1 && __hook.getDir().y === 0, 'дефолт: восток'); // getDir отдаёт живой объект — сравниваем поля, не ссылки
const d1 = __hook.setDir(3, 4);
assert.ok(Math.abs(d1.x - 0.6) < 1e-9 && Math.abs(d1.y - 0.8) < 1e-9, 'setDir normalizes');
assert.ok(__hook.getDir().x === d1.x && __hook.getDir().y === d1.y, 'getDir отдаёт текущий вектор');
const d0 = __hook.setDir(0, 0); // ноль игнорируем — направление не меняется
assert.ok(d0.x === d1.x && d0.y === d1.y, 'ноль не меняет направление');

assert.strictEqual(__hook.isPaused(), false); // дефолт: не на паузе
assert.strictEqual(__hook.setPaused(true), true);
assert.strictEqual(__hook.isPaused(), true);
assert.strictEqual(__hook.togglePause(), false); // сняли
assert.strictEqual(__hook.isPaused(), false);
assert.strictEqual(__hook.togglePause(), true); // поставили
assert.strictEqual(__hook.setPaused(false), false); // сброс для остальных тестов

// --- фриз мира паузой: tickTimers не тикает, frame не двигает змейку ---
const tickTimers = sandbox.tickTimers;
assert.strictEqual(typeof tickTimers, 'function', 'tickTimers must be reachable');
__hook.setPaused(true);
const frozen = { star: 1, starT: 5, bolt: 1, boltT: 5 };
tickTimers(frozen, 60);
assert.strictEqual(frozen.starT, 5, 'paused: starT frozen');
assert.strictEqual(frozen.boltT, 5, 'paused: boltT frozen');
__hook.setPaused(false);
tickTimers(frozen, 60);
assert.ok(frozen.starT < 5 && frozen.boltT < 5, 'unpaused: timers tick');
assert.ok(
  html.includes('if (!alive || isPaused()) { last = t; return; }'),
  'frame must freeze world on pause and refresh last (no dt jump after resume)'
);

console.log('logic.test.js: OK hook API (setDir/getDir/setPaused/togglePause/isPaused, pause freeze)');
process.exit(0);
