const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

// src/sprites.ts держим на стираемом синтаксисе, поэтому для запуска
// без сборки достаточно снять interface/declare и перевести export в CJS.
const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'sprites.ts'), 'utf8');
const js = src
  .replace(/export interface Pic \{[\s\S]*?\n\}/, '')
  .replace(/declare const document: any;/, '')
  .replace(/declare const Image: any;/, '')
  .replace('export const FRAMES', 'const FRAMES')
  .replace('export const TILES', 'const TILES')
  .replace('export function allSources', 'function allSources')
  .replace('export function placeholder', 'function placeholder')
  .replace('export function loadSprites', 'function loadSprites')
  .concat('\nmodule.exports = { FRAMES, TILES, allSources, placeholder, loadSprites };\n');
const m = new Module('sprites', module);
m._compile(js, path.join(__dirname, '..', 'src', 'sprites.js'));
const { FRAMES, TILES, allSources, placeholder, loadSprites } = m.exports;

// Шаг 1 из задания: таблицы кадров.
assert.equal(FRAMES.idle.length, 2);
assert.equal(FRAMES.waddle.length, 4);
assert.equal(FRAMES.guard.length, 2);

// Все кадры и плитки указывают на готовые картинки задачи 7.
const files = fs.readdirSync(path.join(__dirname, '..', 'img'));
for (const s of allSources()) {
  assert.ok(files.indexOf(path.basename(s)) >= 0, 'нет картинки: ' + s);
}
assert.equal(allSources().length, 2 + 4 + 2 + 6);
assert.equal(Object.keys(TILES).length, 6);

// Шаг 2 из задания: битая картинка заменяется квадратом, игра не падает.
(async () => {
  const direct = placeholder('img/nope.png');
  assert.equal(direct.broken, true);
  assert.equal(direct.src, 'img/nope.png');

  const good = (s) => Promise.resolve({ src: s, broken: false, img: {} });
  const ok = await loadSprites(good);
  assert.equal(Object.keys(ok).length, allSources().length);
  assert.equal(ok['img/seal_idle_0.png'].broken, false);

  const flaky = (s) =>
    s.indexOf('guard_1') >= 0 ? Promise.reject(new Error('битая')) : Promise.resolve({ src: s, broken: false, img: {} });
  const mixed = await loadSprites(flaky);
  assert.equal(mixed['img/guard_1.png'].broken, true);
  assert.equal(mixed['img/seal_idle_0.png'].broken, false);

  const syncThrow = (s) => {
    throw new Error('упал сразу');
  };
  const survived = await loadSprites(syncThrow);
  assert.equal(Object.keys(survived).length, allSources().length);
  assert.ok(Object.keys(survived).every((k) => survived[k].broken === true));

  // Загрузка по умолчанию в Node (без DOM Image): ждёт все, не падает.
  const def = await loadSprites();
  assert.equal(Object.keys(def).length, allSources().length);

  assert.ok(typeof loadSprites().then === 'function');
})().then(
  () => {},
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
