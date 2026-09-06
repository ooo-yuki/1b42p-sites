const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

function readTS(rel) {
  return fs.readFileSync(path.join(__dirname, rel), 'utf8');
}

let ck = readTS('../src/clock.ts');
ck = ck.replace(/export interface \w+ \{[^}]*\}/s, '');
ck = ck.replace(/: Day/g, '')
  .replace(/: number/g, '')
  .replace(/: string/g, '')
  .replace(/: boolean/g, '')
  .replace(/: void/g, '');
ck = ck.replace(/export const /g, 'const ')
  .replace(/export function /g, 'function ');

const js = ck + '\nmodule.exports = { newDay, tick, hourCase, applyMuster, applyWork, isNight };\n';
const m = new Module('clock', module);
m._compile(js, path.join(__dirname, '..', 'src', 'clock.js'));
const { newDay, tick, hourCase, applyMuster, applyWork, isNight } = m.exports;

// Ядро из брифа: день идёт, дело часа названо
const d = newDay();
tick(d, 3600);
assert.ok(hourCase(d).length > 0);

// Распорядок по часам: подъём, поверка, еда, работа, душ, поверка, отбой
function at(h) {
  const s = newDay();
  s.t = h * 3600;
  tick(s, 0);
  return hourCase(s);
}
assert.equal(at(2), 'ночь');
assert.equal(at(6.5), 'подъём');
assert.equal(at(7.5), 'поверка');
assert.equal(at(8.5), 'еда');
assert.equal(at(10), 'работа');
assert.equal(at(17.5), 'душ');
assert.equal(at(18.5), 'поверка');
assert.equal(at(20), 'вечер');
assert.equal(at(22.5), 'отбой');

// Нет на поверке — розыск вверх; был — без кары
{
  const s = newDay();
  applyMuster(s, false);
  assert.equal(s.heat, 1);
  applyMuster(s, true);
  assert.equal(s.heat, 1);
  applyMuster(s, false);
  applyMuster(s, false);
  assert.equal(s.heat, 3);
  applyMuster(s, false);
  assert.equal(s.heat, 3);
}

// Нет на работе — без монет; был — монеты есть
{
  const s = newDay();
  applyWork(s, false);
  assert.equal(s.coins, 0);
  applyWork(s, true);
  assert.ok(s.coins > 0);
}

// Отбой гасит свет, подъём зажигает
{
  const s = newDay();
  s.t = 21 * 3600;
  tick(s, 3600);
  assert.equal(s.lights, false);
  assert.equal(isNight(s), true);
  assert.equal(hourCase(s), 'отбой');
  s.t = 6 * 3600;
  tick(s, 0);
  assert.equal(s.lights, true);
  assert.equal(isNight(s), false);
}

// Сутки переходят в следующий день
{
  const s = newDay();
  tick(s, 86400);
  assert.equal(s.day, 2);
  assert.equal(s.t, 0);
}
