const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

// src/teach.ts держим на стираемом синтаксисе: снимаем export в CJS.
let src = fs.readFileSync(path.join(__dirname, '..', 'src', 'teach.ts'), 'utf8');
src = src
  .replace(/^import .*$/gm, '')
  .replace(/export const /g, 'const ')
  .replace(/export function /g, 'function ')
  .concat('\nmodule.exports = { TEACH, teachStep };\n');
const m = new Module('teach', module);
m._compile(src, path.join(__dirname, '..', 'src', 'teach.js'));
const { teachStep, TEACH } = m.exports;

// Приказ из task-2-brief дословно.
assert.ok(TEACH.length >= 4);
assert.ok(teachStep({ moved: false }).length > 0);
assert.equal(teachStep({ moved: true, key: true, fish: true, exit: true }), null);
