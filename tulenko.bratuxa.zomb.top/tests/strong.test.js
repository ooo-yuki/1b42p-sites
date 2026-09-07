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
    .replace(/:\s*\{[^}]*\}/g, '')
    .replace(/:\s*(number|boolean|string|void)(\s*[(),=;{])/g, '$2')
    .replace(/export function /g, 'function ')
    .replace(/export const /g, 'const ');
}

const src = strip(readTS('../src/strong.ts'));
const js = src + '\nmodule.exports = { pump, need };\n';
const m = new Module('strong', module);
m._compile(js, path.join(__dirname, '..', 'src', 'strong.js'));
const { pump, need } = m.exports;

// Ядро из брифа
assert.equal(pump({ power: 0, pumpedDay: 0, day: 1 }), 1);
assert.equal(need({ power: 3 }, 3), true);
assert.equal(need({ power: 2 }, 3), false);

// Потолок 5
assert.equal(pump({ power: 5, pumpedDay: 0, day: 1 }), 5);
assert.equal(pump({ power: 4, pumpedDay: 0, day: 2 }), 5);

// Один раз в день: повторный pump в тот же день не растёт
assert.equal(pump({ power: 1, pumpedDay: 1, day: 1 }), 1);

// need на границах
assert.equal(need({ power: 0 }, 0), true);
assert.equal(need({ power: 5 }, 5), true);
assert.equal(need({ power: 4 }, 5), false);

console.log('strong.test.js: OK');
