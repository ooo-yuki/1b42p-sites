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
    .replace(/:\s*Record<string, string\[\]>(\s*[=;{])/g, '$1')
    .replace(/:\s*(Sack|string\[\]|number\[\]|boolean\[\]|string|number|boolean|void)(\s*[(),=;{])/g, '$2')
    .replace(/export function /g, 'function ')
    .replace(/export const /g, 'const ');
}

const src = strip(readTS('../src/things.ts'));
const js = src + '\nmodule.exports = { LOOT, RECIPES, FORBIDDEN, TRADER_PRICE, has, pick, craft, isForbidden, hasForbidden, deal };\n';
const m = new Module('things', module);
m._compile(js, path.join(__dirname, '..', 'src', 'things.js'));
const { LOOT, RECIPES, FORBIDDEN, TRADER_PRICE, has, pick, craft, isForbidden, hasForbidden, deal } = m.exports;

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

// Торговец ночью берёт монеты за запретное
{
  const s = { bag: [], coins: TRADER_PRICE };
  assert.equal(deal(s, 'мыло', true), false);
  assert.equal(deal(s, 'кляп', false), false);
  assert.equal(s.coins, TRADER_PRICE);
  const poor = { bag: [], coins: 0 };
  assert.equal(deal(poor, 'кляп', true), false);
  assert.equal(has(poor, 'кляп'), false);
  assert.equal(deal(s, 'кляп', true), true);
  assert.ok(has(s, 'кляп'));
  assert.equal(s.coins, 0);
}

console.log('things ok');
