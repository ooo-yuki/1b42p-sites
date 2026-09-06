const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

function readTS(rel) {
  return fs.readFileSync(path.join(__dirname, rel), 'utf8');
}

let cfg = readTS('../src/config.ts');
cfg = cfg.replace(/export interface \w+ \{[^}]*\}/s, '');
cfg = cfg.replace(/:\s*Balance/g, '');
cfg = cfg.replace('export const CFG', 'const CFG');

let lv = readTS('../src/levels.ts');
lv = lv.replace(/:\s*string(\[\])*/g, '')
  .replace('export const GLYPHS', 'const GLYPHS')
  .replace('export function checkMap', 'function checkMap')
  .replace('export const LEVELS', 'const LEVELS');

let lg = readTS('../src/logic.ts');
lg = lg.replace(/^import .*$/gm, '')
  .replace(/export function /g, 'function ')
  .replace(/export const /g, 'const ');

const js = cfg + '\n' + lv + '\n' + lg + '\nmodule.exports = { newRun, step, giveAll, killAll };\n';
const m = new Module('logic', module);
m._compile(js, path.join(__dirname, '..', 'src', 'logic.js'));
const { newRun, step, giveAll, killAll } = m.exports;

let s = newRun(0);
step(s, {});
assert.equal(s.won, false);
s = newRun(0);
giveAll(s);
killAll(s);
assert.equal(s.dead, true);
