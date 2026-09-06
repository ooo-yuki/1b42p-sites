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
    .replace(/export interface \w+ \{[\s\S]*?^\}/gm, '')
    .replace(/:\s*(SearchState|string\[\]|number\[\]|boolean\[\]|string|number|boolean|void)(\s*[\),=;{])/g, '$2')
    .replace(/:\s*\{[^}]*\}/g, '')
    .replace(/export function /g, 'function ')
    .replace(/export const /g, 'const ');
}

let sc = strip(readTS('../src/search.ts'));

const js = sc + '\nmodule.exports = { isForbidden, search, leaveSolitary };\n';
const m = new Module('search', module);
m._compile(js, path.join(__dirname, '..', 'src', 'search.js'));
const { isForbidden, search, leaveSolitary } = m.exports;

// Бриф дословно: обыск находит запретное в суме
{
  const s = { bag: ['ложка'] };
  assert.deepEqual(search(s), ['ложка']);
}

// Чистая сума: ничего не найдено, карцера нет
{
  const s = { bag: ['тряпка'] };
  assert.deepEqual(search(s), []);
  assert.equal(s.solitary, undefined);
}

// Нашёл — карцер до утра: розыск три, вещи отобраны
{
  const s = { bag: ['ложка', 'тряпка'], heat: 0, seal: { x: 5, y: 5 }, cell: { x: 1.5, y: 1.5 }, solitary: false };
  const found = search(s);
  assert.deepEqual(found, ['ложка']);
  assert.equal(s.solitary, true);
  assert.equal(s.heat, 3);
  assert.deepEqual(s.bag, []);
  assert.equal(s.seal.x, 1.5);
  assert.equal(s.seal.y, 1.5);
}

// Сборка тоже запретна: кляп и спуск обыск берёт
{
  assert.equal(isForbidden('кляп'), true);
  assert.equal(isForbidden('спуск'), true);
  assert.equal(isForbidden('тряпка'), false);
  const s = { bag: ['кляп'] };
  assert.deepEqual(search(s), ['кляп']);
  assert.equal(s.solitary, true);
}

// Пустая сума и порча: молчит, не падает
assert.deepEqual(search({ bag: [] }), []);
assert.deepEqual(search(null), []);
assert.deepEqual(search(undefined), []);

// Утро отпускает из карцера
{
  const s = { bag: [], solitary: true };
  leaveSolitary(s);
  assert.equal(s.solitary, false);
}

console.log('search ok');
