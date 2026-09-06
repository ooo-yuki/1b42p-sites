const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

// src/levels.ts держим на стираемом синтаксисе, поэтому для запуска
// без сборки достаточно снять аннотации и перевести export в CJS.
const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'levels.ts'), 'utf8');
const js = src
  .replace(/:\s*string(\[\])*/g, '')
  .replace('export const GLYPHS', 'const GLYPHS')
  .replace('export function checkMap', 'function checkMap')
  .replace('export const LEVELS', 'const LEVELS')
  .concat('\nmodule.exports = { GLYPHS, checkMap, LEVELS };\n');
const m = new Module('levels', module);
m._compile(js, path.join(__dirname, '..', 'src', 'levels.js'));
const { checkMap, LEVELS } = m.exports;

const good = ['PKEF', '    '];
assert.deepStrictEqual(checkMap(good), []);
assert.strictEqual(LEVELS.length, 3);
for (const lv of LEVELS) {
  assert.deepStrictEqual(checkMap(lv), []);
}
assert.ok(checkMap(['PE']).length > 0);
assert.ok(checkMap([]).length > 0);
assert.ok(checkMap(['PKEF', 'xx']).length > 0);
