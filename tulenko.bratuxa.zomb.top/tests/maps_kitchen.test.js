const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

function loadMap(rel, name) {
  const src = fs.readFileSync(path.join(__dirname, rel), 'utf8');
  const js = src
    .replace(/:\s*string(\[\])*/g, '')
    .replace('export const ' + name, 'const ' + name)
    .concat('\nmodule.exports = { ' + name + ' };\n');
  const m = new Module(name, module);
  m._compile(js, path.join(__dirname, rel.replace(/\.ts$/, '.js')));
  return m.exports[name];
}

const KITCHEN_MAP = loadMap('../src/maps/kitchen.ts', 'KITCHEN_MAP');

// Знаки из шапки плана: новые HOVACZU + старые DJBTSRPEKFG + стройка #- = и мелочь cfpbrt.
const ALLOWED = '#=-KFE GPcfpbrtHOVACZUDJBTSR';

function reach(map, from, want) {
  const h = map.length;
  const w = map[0].length;
  const seen = new Set([from]);
  const q = [from];
  while (q.length) {
    const cur = q.pop();
    const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    for (const d of dirs) {
      const nx = cur[0] + d[0];
      const ny = cur[1] + d[1];
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      const k = nx + ',' + ny;
      if (seen.has(k)) continue;
      if (map[ny][nx] === '#') continue;
      seen.add(k);
      q.push([nx, ny]);
    }
  }
  const fy = map.findIndex((r) => r.includes(want));
  const fx = map[fy].indexOf(want);
  return seen.has(fx + ',' + fy);
}

const w = KITCHEN_MAP[0].length;
assert.strictEqual(KITCHEN_MAP.length, 16, 'kitchen height 16');
assert.strictEqual(w, 30, 'kitchen width 30');
assert.ok(KITCHEN_MAP.every((r) => r.length === w), 'kitchen rows even');
const flat = KITCHEN_MAP.join('');
for (const s of ['P', 'E', 'K', 'F']) assert.ok(flat.includes(s), 'kitchen has ' + s);
assert.ok(flat.includes('O'), 'kitchen has pot');
assert.ok(flat.includes('T'), 'kitchen has tables');
assert.ok(flat.includes('D'), 'kitchen has doors');
for (const ch of flat) assert.ok(ALLOWED.includes(ch), 'kitchen clean sign ' + ch);
const py = KITCHEN_MAP.findIndex((r) => r.includes('P'));
const px = KITCHEN_MAP[py].indexOf('P');
for (const s of ['E', 'K', 'F']) assert.ok(reach(KITCHEN_MAP, [px, py], s), 'kitchen walk to ' + s);
console.log('kitchen ok 30x16');
