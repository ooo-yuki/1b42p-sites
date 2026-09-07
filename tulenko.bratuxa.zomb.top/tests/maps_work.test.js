const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

// Шаг 1 брифа дословно (через жгут вместо game-src-maps-work.js, которого нет в деле):
// import assert from 'node:assert';
// import { WORK_MAP } from '../game-src-maps-work.js';
// import { GATE_MAP } from '../game-src-maps-gate.js';
// assert.ok(WORK_MAP.join('').includes('A'), 'work has bench');
// assert.ok(GATE_MAP.join('').includes('C'), 'gate has checkpoint');

// Жгут: src/maps/work.ts держим на стираемом синтаксисе, поэтому для запуска
// без сборки достаточно снять аннотации и перевести export в CJS.
const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'maps', 'work.ts'), 'utf8');
const js = src
  .replace(/:\s*string\[\]/g, '')
  .replace('export const WORK_MAP', 'const WORK_MAP')
  .concat('\nmodule.exports = { WORK_MAP };\n');
const m = new Module('work', module);
m._compile(js, path.join(__dirname, '..', 'src', 'maps', 'work.js'));
const { WORK_MAP } = m.exports;

assert.ok(WORK_MAP.join('').includes('A'), 'work has bench');
assert.ok(WORK_MAP.join('').includes('J'), 'work has machines');
assert.ok(WORK_MAP.join('').includes('D'), 'work has door');
for (const s of ['P', 'E', 'K', 'F']) {
  assert.ok(WORK_MAP.join('').includes(s), 'work has ' + s);
}
const w = WORK_MAP[0].length;
assert.ok(WORK_MAP.every((r) => r.length === w), 'work rows even');
console.log('maps_work OK');
