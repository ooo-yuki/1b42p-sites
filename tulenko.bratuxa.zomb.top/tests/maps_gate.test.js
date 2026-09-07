const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

// Шаг 1 брифа дословно (через жгут вместо game-src-maps-gate.js, которого нет в деле):
// import assert from 'node:assert';
// import { WORK_MAP } from '../game-src-maps-work.js';
// import { GATE_MAP } from '../game-src-maps-gate.js';
// assert.ok(WORK_MAP.join('').includes('A'), 'work has bench');
// assert.ok(GATE_MAP.join('').includes('C'), 'gate has checkpoint');

// Жгут: src/maps/gate.ts держим на стираемом синтаксисе, поэтому для запуска
// без сборки достаточно снять аннотации и перевести export в CJS.
const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'maps', 'gate.ts'), 'utf8');
const js = src
  .replace(/:\s*string\[\]/g, '')
  .replace('export const GATE_MAP', 'const GATE_MAP')
  .concat('\nmodule.exports = { GATE_MAP };\n');
const m = new Module('gate', module);
m._compile(js, path.join(__dirname, '..', 'src', 'maps', 'gate.js'));
const { GATE_MAP } = m.exports;

assert.ok(GATE_MAP.join('').includes('C'), 'gate has checkpoint');
assert.ok(GATE_MAP.join('').includes('E'), 'gate has gates');
assert.ok(GATE_MAP.join('').includes('D'), 'gate has door back');
const w = GATE_MAP[0].length;
assert.ok(GATE_MAP.every((r) => r.length === w), 'gate rows even');
console.log('maps_gate OK');
