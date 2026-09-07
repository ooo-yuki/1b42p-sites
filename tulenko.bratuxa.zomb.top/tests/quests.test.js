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
    .replace(/:\s*(Quest|string\[\]|number\[\]|boolean\[\]|string|number|boolean|void)(\s*[(),=;{])/g, '$2')
    .replace(/export function /g, 'function ')
    .replace(/export const /g, 'const ');
}

const src = strip(readTS('../src/quests.ts'));
const js = src + '\nmodule.exports = { QUESTS, done };\n';
const m = new Module('quests', module);
m._compile(js, path.join(__dirname, '..', 'src', 'quests.js'));
const { QUESTS, done } = m.exports;

// Шаг 1 брифа дословно (импорт через жгут выше, game-src-quests.js нет в деле):
// import { done } from '../game-src-quests.js';
// const s = { bag: ['спуск'], at: 'roof', night: true, power: 0, coins: 0, heat: 0 };
// assert.equal(done(s, 'roof'), true);
// assert.equal(done({ bag: [], at: 'roof', night: true }, 'roof'), false);
{
  const s = { bag: ['спуск'], at: 'roof', night: true, power: 0, coins: 0, heat: 0 };
  assert.equal(done(s, 'roof'), true);
  assert.equal(done({ bag: [], at: 'roof', night: true }, 'roof'), false);
}

// Восемь дел: roof, gate, fence, bribe, guns, tunnel, poison, quiet
assert.equal(QUESTS.length, 8);
assert.deepEqual(
  QUESTS.map((q) => q.id).sort(),
  ['bribe', 'fence', 'gate', 'guns', 'poison', 'quiet', 'roof', 'tunnel'].sort()
);
for (const q of QUESTS) {
  assert.ok(Array.isArray(q.steps) && q.steps.length > 0, q.id);
}

// roof: спуск + крыша + ночь; днём или без спуска — нет
assert.equal(done({ bag: ['спуск'], at: 'roof', night: true }, 'roof'), true);
assert.equal(done({ bag: ['спуск'], at: 'roof', night: false }, 'roof'), false);
assert.equal(done({ bag: ['спуск'], at: 'yard', night: true }, 'roof'), false);

// gate: кляп + ворота + день + розыск 0
assert.equal(done({ bag: ['кляп'], at: 'gate', night: false, heat: 0 }, 'gate'), true);
assert.equal(done({ bag: ['кляп'], at: 'gate', night: true, heat: 0 }, 'gate'), false);
assert.equal(done({ bag: [], at: 'gate', night: false, heat: 0 }, 'gate'), false);
assert.equal(done({ bag: ['кляп'], at: 'gate', night: false, heat: 1 }, 'gate'), false);

// fence: сила 3 + ночь + двор
assert.equal(done({ bag: [], at: 'yard', night: true, power: 3 }, 'fence'), true);
assert.equal(done({ bag: [], at: 'yard', night: true, power: 2 }, 'fence'), false);
assert.equal(done({ bag: [], at: 'yard', night: false, power: 3 }, 'fence'), false);
assert.equal(done({ bag: [], at: 'roof', night: true, power: 3 }, 'fence'), false);

// bribe: 30 монет + начальник
assert.equal(done({ bag: [], at: 'boss', coins: 30 }, 'bribe'), true);
assert.equal(done({ bag: [], at: 'boss', coins: 29 }, 'bribe'), false);
assert.equal(done({ bag: [], at: 'yard', coins: 30 }, 'bribe'), false);

// guns: ствол + сила 2 + ворота
assert.equal(done({ bag: ['ствол'], at: 'gate', power: 2 }, 'guns'), true);
assert.equal(done({ bag: ['ствол'], at: 'gate', power: 1 }, 'guns'), false);
assert.equal(done({ bag: [], at: 'gate', power: 2 }, 'guns'), false);
assert.equal(done({ bag: ['ствол'], at: 'yard', power: 2 }, 'guns'), false);

// tunnel: ложка + ночи копки 3 + камера
assert.equal(done({ bag: ['ложка'], at: 'cell', dug: 3 }, 'tunnel'), true);
assert.equal(done({ bag: ['ложка'], at: 'cell', dug: 2 }, 'tunnel'), false);
assert.equal(done({ bag: [], at: 'cell', dug: 3 }, 'tunnel'), false);
assert.equal(done({ bag: ['ложка'], at: 'yard', dug: 3 }, 'tunnel'), false);

// poison: отрава + договор + кухня
assert.equal(done({ bag: ['отрава'], at: 'kitchen', deal: true }, 'poison'), true);
assert.equal(done({ bag: ['отрава'], at: 'kitchen', deal: false }, 'poison'), false);
assert.equal(done({ bag: [], at: 'kitchen', deal: true }, 'poison'), false);
assert.equal(done({ bag: ['отрава'], at: 'yard', deal: true }, 'poison'), false);

// quiet: ночь + ворота + розыск 0
assert.equal(done({ bag: [], at: 'gate', night: true, heat: 0 }, 'quiet'), true);
assert.equal(done({ bag: [], at: 'gate', night: false, heat: 0 }, 'quiet'), false);
assert.equal(done({ bag: [], at: 'gate', night: true, heat: 1 }, 'quiet'), false);
assert.equal(done({ bag: [], at: 'yard', night: true, heat: 0 }, 'quiet'), false);

// Неизвестное дело — нет
assert.equal(done({ bag: ['спуск'], at: 'roof', night: true }, 'roof2'), false);

console.log('quests ok');
