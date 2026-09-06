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

let nt = readTS('../src/notes.ts');
nt = nt.replace(/^import .*$/gm, '')
  .replace(/export function /g, 'function ')
  .replace(/export const /g, 'const ');

const js = cfg + '\n' + lv + '\n' + lg + '\n' + nt + '\nmodule.exports = { newRun, hourCase };\n';
const m = new Module('notes', module);
m._compile(js, path.join(__dirname, '..', 'src', 'notes.js'));
const { newRun, hourCase } = m.exports;

// Приказ из task-5-brief дословно.
assert.ok(hourCase(newRun(0)).length > 0);

// Дело по недособранному: нет ключа — «добудь ключ»,
// нет рыбы — «добудь рыбу», всё есть — «уходи в выход».
let s = newRun(0);
assert.equal(hourCase(s), 'добудь ключ');
s.hasKey = true;
assert.equal(hourCase(s), 'добудь рыбу');
s.hasFish = true;
assert.equal(hourCase(s), 'уходи в выход');
