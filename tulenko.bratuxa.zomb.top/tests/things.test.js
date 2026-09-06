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
    .replace(/:\s*Record<string, (string\[\]|number)>(\s*[=;{])/g, '$2')
    .replace(/:\s*(Sack|string\[\]|number\[\]|boolean\[\]|string|number|boolean|void)(\s*[(),=;{])/g, '$2')
    .replace(/export function /g, 'function ')
    .replace(/export const /g, 'const ');
}

const src = strip(readTS('../src/things.ts'));
const js = src + '\nmodule.exports = { LOOT, RECIPES, FORBIDDEN, TRADER_PRICE, TRADER_PRICES, has, pick, craft, isForbidden, hasForbidden, deal };\n';
const m = new Module('things', module);
m._compile(js, path.join(__dirname, '..', 'src', 'things.js'));
const { LOOT, RECIPES, FORBIDDEN, TRADER_PRICE, TRADER_PRICES, has, pick, craft, isForbidden, hasForbidden, deal } = m.exports;

// Шаг 1 брифа дословно (через жгут вместо game-src-things.js, которого нет в деле):
// import { pick, craft, has } from '../game-src-things.js';
// const s = { bag: [] };
// pick(s, 'ложка'); pick(s, 'тряпка');
// assert.equal(craft(s, 'кляп'), true);
// assert.ok(has(s, 'кляп'));
{
  const s = { bag: [] };
  pick(s, 'ложка'); pick(s, 'тряпка');
  assert.equal(craft(s, 'кляп'), true);
  assert.ok(has(s, 'кляп'));
}

// Находки: тряпка, ложка, верёвка, мыло
assert.deepEqual([...LOOT].sort(), ['верёвка', 'ложка', 'мыло', 'тряпка'].sort());

// Сборка спуска: верёвка плюс мыло
{
  const s = { bag: [] };
  pick(s, 'верёвка'); pick(s, 'мыло');
  assert.equal(craft(s, 'спуск'), true);
  assert.ok(has(s, 'спуск'));
}

// Без нужного в суме сборка не выходит; добро не тратится
{
  const s = { bag: [] };
  assert.equal(craft(s, 'кляп'), false);
  pick(s, 'ложка');
  assert.equal(craft(s, 'кляп'), false);
  assert.ok(has(s, 'ложка'));
  const s2 = { bag: [] };
  pick(s2, 'тряпка');
  assert.equal(craft(s2, 'кляп'), false);
  assert.equal(craft(s2, 'спуск'), false);
  assert.equal(craft(s2, 'ворота'), false);
}

// Сборка ест состав: ложка и тряпка ушли, кляп лёг
{
  const s = { bag: [] };
  pick(s, 'ложка'); pick(s, 'тряпка'); pick(s, 'мыло');
  assert.equal(craft(s, 'кляп'), true);
  assert.ok(has(s, 'кляп'));
  assert.equal(has(s, 'ложка'), false);
  assert.equal(has(s, 'тряпка'), false);
  assert.ok(has(s, 'мыло'));
}

// Запретное помечено для обысков: ложка, кляп, спуск; тряпка/верёвка/мыло чистые
assert.equal(isForbidden('ложка'), true);
assert.equal(isForbidden('кляп'), true);
assert.equal(isForbidden('спуск'), true);
assert.equal(isForbidden('тряпка'), false);
assert.equal(isForbidden('верёвка'), false);
assert.equal(isForbidden('мыло'), false);
{
  const s = { bag: [] };
  assert.equal(hasForbidden(s), false);
  pick(s, 'тряпка');
  assert.equal(hasForbidden(s), false);
  pick(s, 'ложка');
  assert.equal(hasForbidden(s), true);
}

// Шаг 1 брифа Task 3 дословно (импорт через жгут выше):
// import { deal } from '../game-src-things.js';
// const s = { coins: 5, bag: [], night: true };
// assert.equal(deal(s, 'ложка'), true);
// assert.ok(s.coins < 5);
// const d = { coins: 0, bag: [], night: true };
// assert.equal(deal(d, 'ложка'), false);
{
  const s = { coins: 5, bag: [], night: true };
  assert.equal(deal(s, 'ложка'), true);
  assert.ok(s.coins < 5);
  const d = { coins: 0, bag: [], night: true };
  assert.equal(deal(d, 'ложка'), false);
}

// Цены торговца: ложка 2, верёвка 3, мыло 2. Мало монет или день — нет торга.
assert.deepEqual(TRADER_PRICES, { 'ложка': 2, 'верёвка': 3, 'мыло': 2 });
{
  const s = { coins: 5, bag: [], night: true };
  assert.equal(deal(s, 'верёвка'), true);
  assert.equal(s.coins, 2);
  assert.ok(has(s, 'верёвка'));
}
{
  const s = { coins: 5, bag: [], night: true };
  assert.equal(deal(s, 'мыло'), true);
  assert.equal(s.coins, 3);
  assert.ok(has(s, 'мыло'));
}
{
  const s = { coins: 2, bag: [], night: true };
  assert.equal(deal(s, 'верёвка'), false);
  assert.equal(s.coins, 2);
  assert.equal(has(s, 'верёвка'), false);
}
{
  const day = { coins: 5, bag: [], night: false };
  assert.equal(deal(day, 'ложка'), false);
  assert.equal(day.coins, 5);
  const day2 = { coins: 5, bag: [] };
  assert.equal(deal(day2, 'ложка'), false);
}
{
  const s = { coins: 5, bag: [], night: true };
  assert.equal(deal(s, 'кляп'), false);
  assert.equal(s.coins, 5);
}

console.log('things ok');
