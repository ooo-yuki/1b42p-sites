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
    .replace(/:\s*RoofState(\s*[(),=;{])/g, '$1')
    .replace(/:\s*string\[\](\s*[(),=;{])/g, '$1')
    .replace(/:\s*(string|number|boolean|void)(\s*[(),=;{])/g, '$2')
    .replace(/export function /g, 'function ')
    .replace(/export const /g, 'const ');
}

const src = strip(readTS('../src/endings.ts'));
const js = src + '\nmodule.exports = { tryRoof };\n';
const m = new Module('endings', module);
m._compile(js, path.join(__dirname, '..', 'src', 'endings.js'));
const { tryRoof } = m.exports;

// Шаг 1 брифа дословно (через жгут вместо game-src-endings.js, которого нет в деле):
// import { tryRoof } from '../game-src-endings.js';
// assert.equal(tryRoof({ atRoof: true, night: true, bag: ['спуск'] }), 'win');
// assert.equal(tryRoof({ atRoof: true, night: true, bag: [] }), 'warn');
// assert.equal(tryRoof({ atRoof: true, night: false, bag: ['спуск'] }), 'wait');
assert.equal(tryRoof({ atRoof: true, night: true, bag: ['спуск'] }), 'win');
assert.equal(tryRoof({ atRoof: true, night: true, bag: [] }), 'warn');
assert.equal(tryRoof({ atRoof: true, night: false, bag: ['спуск'] }), 'wait');

// День без спуска — тоже ждать ночи.
assert.equal(tryRoof({ atRoof: true, night: false, bag: [] }), 'wait');

// Не крыша — ждать (не победа, не предупреждение).
assert.equal(tryRoof({ atRoof: false, night: true, bag: ['спуск'] }), 'wait');
assert.equal(tryRoof({ atRoof: false, night: true, bag: [] }), 'wait');

// Спуск среди прочего добра — победа.
assert.equal(tryRoof({ atRoof: true, night: true, bag: ['ложка', 'спуск'] }), 'win');

console.log('endings ok');
