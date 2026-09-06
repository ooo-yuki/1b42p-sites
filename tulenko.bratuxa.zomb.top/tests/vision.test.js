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
    .replace(/:\s*(Guard|RunState|SealPt|Balance|string\[\]|number\[\]|boolean\[\]|string|number|boolean|void)(\s*[\),=;{])/g, '$2')
    .replace(/export function /g, 'function ')
    .replace(/export const /g, 'const ');
}

let cfg = strip(readTS('../src/config.ts'));
let vs = strip(readTS('../src/vision.ts'));

const js = cfg + '\n' + vs + '\nmodule.exports = { sees, heatUp, toSolitary, catchSeal };\n';
const m = new Module('vision', module);
m._compile(js, path.join(__dirname, '..', 'src', 'vision.js'));
const { sees, heatUp, toSolitary, catchSeal } = m.exports;

// Бриф: взгляд на пустоте слеп
assert.equal(sees(null, 0, 0, 1), false);

// Конус вперёд: цель по курсу видна, за спиной — нет
const g = { x: 1.5, y: 1.5, dir: 1 };
assert.equal(sees(g, 3.5, 1.5, 1), true);
assert.equal(sees(g, 3.5, 1.5, -1), false);

// Дальность из баланса: дальше sight — тьма
assert.equal(sees(g, 1.5 + 4.5 + 1, 1.5, 1), false);

// Стены закрывают: стена между стражей и целью
const wg = { x: 1.5, y: 1.5, dir: 1, map: ['#####', '#P#E#', '#####'] };
assert.equal(sees(wg, 3.5, 1.5, 1), false);
// Без стены по той же линии — видно
const og = { x: 1.5, y: 1.5, dir: 1, map: ['#####', '#P E#', '#####'] };
assert.equal(sees(og, 3.5, 1.5, 1), true);

// Поимка: розыск плюс один и возврат в камеру
let S = { wanted: 0, seal: { x: 5, y: 5 }, cell: { x: 1.5, y: 1.5 }, solitary: false };
heatUp(S);
assert.equal(S.wanted, 1);
catchSeal(S);
assert.equal(S.wanted, 2);
assert.equal(S.seal.x, 1.5);
assert.equal(S.seal.y, 1.5);

// Три розыска — карцер до утра, вещи отобраны
S = { wanted: 2, seal: { x: 5, y: 5 }, cell: { x: 1.5, y: 1.5 }, solitary: false, items: ['spoon'] };
heatUp(S);
assert.equal(S.wanted, 3);
assert.equal(S.solitary, true);
assert.deepEqual(S.items, []);
toSolitary(S);
assert.equal(S.solitary, true);
assert.equal(S.seal.x, 1.5);

console.log('vision ok');
