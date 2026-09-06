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
    .replace(/:\s*(Shift|Worker|string\[\]|number\[\]|boolean\[\]|string|number|boolean|void)(\s*[(),=;{])/g, '$2')
    .replace(/export function /g, 'function ')
    .replace(/export const /g, 'const ');
}

const src = strip(readTS('../src/work.ts'));
const js = src + '\nmodule.exports = { WORK_START, WORK_END, COINS_PER_SHIFT, BENCH, isWorkHour, isBench, workAt, applyShift };\n';
const m = new Module('work', module);
m._compile(js, path.join(__dirname, '..', 'src', 'work.js'));
const { WORK_START, WORK_END, COINS_PER_SHIFT, BENCH, isWorkHour, isBench, workAt, applyShift } = m.exports;

// Ядро из брифа: у станка в часы работы монеты есть, без станка — ноль
assert.ok(workAt({ atBench: true, hour: 10 }) > 0);
assert.equal(workAt({ atBench: false, hour: 10 }), 0);

// Вне смены — ноль даже у станка
assert.equal(workAt({ atBench: true, hour: 8 }), 0);
assert.equal(workAt({ atBench: true, hour: 18 }), 0);
assert.equal(workAt({ atBench: false, hour: 8 }), 0);

// Границы смены 9–17 совпадают с clock.ts (WORK..SHOWER)
assert.equal(WORK_START, 9);
assert.equal(WORK_END, 17);
assert.ok(workAt({ atBench: true, hour: 9 }) > 0);
assert.equal(workAt({ atBench: true, hour: 17 }), 0);
assert.equal(isWorkHour(10), true);
assert.equal(isWorkHour(8), false);

// Станки — J
assert.equal(BENCH, 'J');
assert.equal(isBench('J'), true);
assert.equal(isBench('B'), false);
assert.equal(isBench('T'), false);

// Смена даёт монету и усталость; без дела — без монет и без усталости
{
  const w = { coins: 0, tired: 0 };
  applyShift(w, { atBench: true, hour: 10 });
  assert.equal(w.coins, COINS_PER_SHIFT);
  assert.equal(w.tired, 1);
  applyShift(w, { atBench: false, hour: 10 });
  assert.equal(w.coins, COINS_PER_SHIFT);
  assert.equal(w.tired, 1);
  applyShift(w, { atBench: true, hour: 20 });
  assert.equal(w.coins, COINS_PER_SHIFT);
  assert.equal(w.tired, 1);
}
