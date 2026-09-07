const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

function readTS(rel) {
  return fs.readFileSync(path.join(__dirname, rel), 'utf8');
}

function strip(src) {
  return src
    .replace(/^import .*$/gm, '')
    .replace(/export interface \w+ \{[^}]*\}/gs, '')
    .replace(/:\s*(Door|Walker|string|number|boolean|void)(\[\])?(\s*[(),=;{])/g, '$3')
    .replace(/export function /g, 'function ')
    .replace(/export const /g, 'const ');
}

const src = strip(readTS('../src/doors.ts'));
const js = src + '\nmodule.exports = { DOORS, pass };\n';
const m = new Module('doors', module);
m._compile(js, path.join(__dirname, '..', 'src', 'doors.js'));
const { DOORS, pass } = m.exports;

// Ядро из брифа: дверей туда-обратно не меньше десяти, проход — булево
assert.ok(DOORS.length >= 10, 'doors both ways');
const s = { map: 'cells', x: 0, y: 0, fade: 0 };
assert.equal(typeof pass(s, 0), 'boolean');

// Каждая дверь имеет обратную между той же парой корпусов
for (const d of DOORS) {
  const back = DOORS.some((r) => r.from === d.to && r.to === d.from);
  assert.ok(back, 'нет обратной двери ' + d.from + '->' + d.to);
}

// Затемнение 0→1→0: первый проход уводит в соседний корпус и готов,
// второй гасит затемнение
{
  const w = { map: DOORS[0].from, x: 0, y: 0, fade: 0 };
  const ready = pass(w, 0);
  assert.equal(ready, true);
  assert.equal(w.map, DOORS[0].to);
  assert.equal(w.x, DOORS[0].tx);
  assert.equal(w.y, DOORS[0].ty);
  assert.equal(w.fade, 1);
  assert.equal(pass(w, 0), false);
  assert.equal(w.fade, 0);
}

// Чужая дверь — отказать молча, без смены карты
{
  const w = { map: 'cells', x: 1, y: 2, fade: 0 };
  assert.equal(pass(w, -1), false);
  assert.equal(pass(w, 999), false);
  assert.equal(w.map, 'cells');
  assert.equal(w.fade, 0);
}
