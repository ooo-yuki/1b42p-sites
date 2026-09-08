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
process.exit(0);
