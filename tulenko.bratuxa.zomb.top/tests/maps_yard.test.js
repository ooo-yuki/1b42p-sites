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

const YARD_MAP = loadMap('../src/maps/yard.ts', 'YARD_MAP');

// Ряды ровные.
const w = YARD_MAP[0].length;
assert.ok(YARD_MAP.every((r) => r.length === w), 'yard rows even');

// Знаки двора на месте: качалка H, забор Z, дверь D.
const flat = YARD_MAP.join('');
assert.ok(flat.includes('H'), 'yard has pump');
assert.ok(flat.includes('Z'), 'yard has fence');
assert.ok(flat.includes('D'), 'yard has door');
// Люди и ключи на месте, как в камерах и кухне.
for (const s of ['P', 'E', 'K', 'F']) assert.ok(flat.includes(s), 'yard has ' + s);

// Только свои знаки: старые + новые из замысла.
const allowed = '#=-KFE GPcfpbrtHOVAZCUDJTSR';
for (const ch of flat) assert.ok(allowed.includes(ch), 'yard glyph ok: ' + ch);

// Забор полосой с одной стороны: есть ряд с длинной полосой Z.
assert.ok(YARD_MAP.some((r) => r.split('Z').length - 1 >= 10), 'yard fence strip');

// Качалка в середине, не у края.
let hx = -1, hy = -1;
YARD_MAP.forEach((r, y) => { const x = r.indexOf('H'); if (x >= 0) { hx = x; hy = y; } });
assert.ok(hx > 1 && hx < w - 2 && hy > 1 && hy < YARD_MAP.length - 2, 'yard pump inside');

// Проход BFS от старта: E, K, F, H достижимы (стена # и забор Z держат).
function reached(targets) {
  const H = YARD_MAP.length, W = w;
  const sy = YARD_MAP.findIndex((r) => r.includes('P'));
  const sx = YARD_MAP[sy].indexOf('P');
  const seen = new Set([sy * W + sx]);
  const q = [[sx, sy]];
  const found = new Set();
  while (q.length) {
    const [x, y] = q.pop();
    const ch = YARD_MAP[y][x];
    if (targets.includes(ch)) found.add(ch);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= W || ny >= H || seen.has(ny * W + nx)) continue;
      const c = YARD_MAP[ny][nx];
      if (c === '#' || c === 'Z') continue;
      seen.add(ny * W + nx);
      q.push([nx, ny]);
    }
  }
  return found;
}
for (const s of ['E', 'K', 'F', 'H']) assert.ok(reached(['E', 'K', 'F', 'H']).has(s), 'yard reach ' + s);
