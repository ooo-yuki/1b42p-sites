const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

function readTS(rel) {
  return fs.readFileSync(path.join(__dirname, rel), 'utf8');
}

// Стираемый синтаксис: снять export и аннотации, перевести в CJS.
function strip(src) {
  return src
    .replace(/^import .*$/gm, '')
    .replace(/export const /g, 'const ')
    .replace(/: string\[\]/g, '');
}

function loadMap(tsRel, constName) {
  const js = strip(readTS(tsRel)) + `\nmodule.exports = { ${constName} };\n`;
  const m = new Module(constName, module);
  m._compile(js, path.join(__dirname, tsRel.replace(/\.ts$/, '.js')));
  return m.exports[constName];
}

const WASH_MAP = loadMap('../src/maps/wash.ts', 'WASH_MAP');

// Ряды ровные.
const w = WASH_MAP[0].length;
assert.ok(WASH_MAP.every((r) => r.length === w), 'wash rows even');

// Знаки душа на месте: душевые S, фургон V, дверь D.
const flat = WASH_MAP.join('');
assert.ok(flat.includes('S'), 'wash has shower');
assert.ok(flat.includes('V'), 'wash has van');
assert.ok(flat.includes('D'), 'wash has door');
// Люди и ключи на месте, как в камерах и кухне.
for (const s of ['P', 'E', 'K', 'F']) assert.ok(flat.includes(s), 'wash has ' + s);

// Только свои знаки: старые + новые из замысла.
const allowed = '#=-KFE GPcfpbrtHOVAZCUDJTSR';
for (const ch of flat) assert.ok(allowed.includes(ch), 'wash glyph ok: ' + ch);

// Душевые рядами: хотя бы два ряда с S.
assert.ok(WASH_MAP.filter((r) => r.includes('S')).length >= 2, 'wash shower rows');

// Фургон у стены: рядом с V есть стена #.
const H = WASH_MAP.length;
let vanByWall = false;
WASH_MAP.forEach((r, y) => {
  [...r].forEach((ch, x) => {
    if (ch !== 'V') return;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= H) { vanByWall = true; continue; }
      if (WASH_MAP[ny][nx] === '#') vanByWall = true;
    }
  });
});
assert.ok(vanByWall, 'wash van by wall');

// Проход BFS от старта: E, K, F, V достижимы (стена # держит).
function reached(targets) {
  const sy = WASH_MAP.findIndex((r) => r.includes('P'));
  const sx = WASH_MAP[sy].indexOf('P');
  const seen = new Set([sy * w + sx]);
  const q = [[sx, sy]];
  const found = new Set();
  while (q.length) {
    const [x, y] = q.pop();
    const ch = WASH_MAP[y][x];
    if (targets.includes(ch)) found.add(ch);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= H || seen.has(ny * w + nx)) continue;
      if (WASH_MAP[ny][nx] === '#') continue;
      seen.add(ny * w + nx);
      q.push([nx, ny]);
    }
  }
  return found;
}
for (const s of ['E', 'K', 'F', 'V']) assert.ok(reached(['E', 'K', 'F', 'V']).has(s), 'wash reach ' + s);
