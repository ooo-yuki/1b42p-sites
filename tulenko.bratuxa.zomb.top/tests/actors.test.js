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
    .replace(/:\s*StepInput/g, '')
    .replace(/:\s*Seal/g, '')
    .replace(/:\s*Guard/g, '')
    .replace(/:\s*Cook/g, '')
    .replace(/:\s*Boss/g, '')
    .replace(/:\s*Warden/g, '')
    .replace(/grid\?: Grid/g, 'grid')
    .replace(/night\?: boolean/g, 'night')
    .replace(/:\s*Grid/g, '')
    .replace(/:\s*RoomMap/g, '')
    .replace(/:\s*string\[\]\[\]/g, '')
    .replace(/:\s*string\[\]/g, '')
    .replace(/:\s*number/g, '')
    .replace(/:\s*string/g, '')
    .replace(/:\s*boolean/g, '')
    .replace(/:\s*1\s*\|\s*-1/g, '')
    .replace(/:\s*void/g, '')
    .replace(/export function /g, 'function ')
    .replace(/export const /g, 'const ');
}

let cfg = readTS('../src/config.ts');
cfg = cfg.replace(/export interface \w+ \{[^}]*\}/s, '');
cfg = cfg.replace(/:\s*Balance/g, '');
cfg = cfg.replace('export const CFG', 'const CFG');

let gridSrc;
try {
  gridSrc = strip(readTS('../src/grid.ts'));
} catch (e) {
  // grid.ts Task 1 ещё не приземлился: заглушка с той же семантикой
  // loadGrid(map: string[]), wallAt(g, x, y): boolean, стены '#', край — стена.
  gridSrc = `
function loadGrid(map) { return { map, w: map[0].length, h: map.length }; }
function wallAt(g, x, y) {
  const c = Math.floor(x), r = Math.floor(y);
  if (c < 0 || r < 0 || c >= g.w || r >= g.h) return true;
  return g.map[r][c] === '#';
}
`;
}

let actors = strip(readTS('../src/actors.ts'));

const js = cfg + '\n' + gridSrc + '\n' + actors
  + '\nmodule.exports = { newSeal, stepSeal, newGuard, stepGuard, newCook, stepCook, newBoss, stepBoss, newWarden, stepWarden, loadGrid, wallAt, CFG };\n';
const m = new Module('actors', module);
m._compile(js, path.join(__dirname, '..', 'src', 'actors.js'));
const { newSeal, stepSeal, newGuard, stepGuard, newCook, stepCook, newBoss, stepBoss, newWarden, stepWarden, loadGrid, CFG } = m.exports;

// Шаг 1 из приказа: ходьба двигает тюленьку
{
  const s = newSeal(1, 1);
  stepSeal(s, { dx: 1, dy: 0 });
  assert.ok(s.x > 1);
}

// Ходы на четыре стороны
{
  const g = loadGrid(['#####', '#   #', '#   #', '#   #', '#####']);
  const s = newSeal(2, 2);
  stepSeal(s, { dx: 1, dy: 0 }, g);
  assert.ok(s.x > 2 && s.y === 2);
  stepSeal(s, { dx: -1, dy: 0 }, g);
  assert.ok(Math.abs(s.x - 2) < 1e-9);
  stepSeal(s, { dx: 0, dy: 1 }, g);
  assert.ok(s.y > 2);
  stepSeal(s, { dx: 0, dy: -1 }, g);
  assert.ok(Math.abs(s.y - 2) < 1e-9);
}

// Скорость из баланса: один шаг = walk * step
{
  const g = loadGrid(['#####', '#   #', '#   #', '#   #', '#####']);
  const s = newSeal(2, 2);
  stepSeal(s, { dx: 1, dy: 0 }, g);
  assert.ok(Math.abs(s.x - (2 + CFG.walk * CFG.step)) < 1e-9);
}

// Стены держат
{
  const g = loadGrid(['#####', '#   #', '#####']);
  const s = newSeal(1, 1);
  for (let i = 0; i < 100; i++) stepSeal(s, { dx: -1, dy: 0 }, g);
  assert.ok(s.x >= 1);
  for (let i = 0; i < 100; i++) stepSeal(s, { dx: 0, dy: -1 }, g);
  assert.ok(s.y >= 1);
}

// Шум шага: ночь шумит вдвое, стой — тихо
{
  const g = loadGrid(['#####', '#   #', '#   #', '#   #', '#####']);
  const day = newSeal(2, 2);
  stepSeal(day, { dx: 1, dy: 0 }, g);
  const night = newSeal(2, 2);
  stepSeal(night, { dx: 1, dy: 0 }, g, true);
  assert.ok(day.noise > 0);
  assert.equal(night.noise, day.noise * 2);
  stepSeal(day, { dx: 0, dy: 0 }, g);
  assert.equal(day.noise, 0);
}

// Стража: точка, сторона, скорость из баланса, разворот у стены
{
  const g = loadGrid(['#######', '#     #', '#######']);
  const gd = newGuard(1, 1, 1);
  const x0 = gd.x;
  stepGuard(gd, g);
  assert.ok(gd.x > x0);
  assert.ok(Math.abs(gd.x - (x0 + CFG.guardSpeed * CFG.step)) < 1e-9);
  for (let i = 0; i < 500 && gd.dir === 1; i++) stepGuard(gd, g);
  assert.equal(gd.dir, -1);
  for (let i = 0; i < 2000; i++) stepGuard(gd, g);
  assert.ok(gd.x >= 1 && gd.x < 6);
}

// Люди корпусов: повар, бригадир, смотритель — точка, ходят по полу как стража
{
  const c = newCook(5, 5);
  assert.equal(typeof c.x, 'number');
  const b = newBoss(5, 5);
  assert.equal(typeof b.x, 'number');
  const w = newWarden(5, 5);
  assert.equal(typeof w.x, 'number');
}

// Шаг патруля: скорость из баланса, разворот у стены, без конуса взгляда
{
  const g = loadGrid(['#######', '#     #', '#######']);
  for (const [mk, st] of [[newCook, stepCook], [newBoss, stepBoss], [newWarden, stepWarden]]) {
    const a = mk(1, 1, 1);
    const x0 = a.x;
    st(a, g);
    assert.ok(a.x > x0);
    assert.ok(Math.abs(a.x - (x0 + CFG.guardSpeed * CFG.step)) < 1e-9);
    assert.equal(typeof a.sees, 'undefined');
    for (let i = 0; i < 500 && a.dir === 1; i++) st(a, g);
    assert.equal(a.dir, -1);
    for (let i = 0; i < 2000; i++) st(a, g);
    assert.ok(a.x >= 1 && a.x < 6);
  }
}

console.log('actors ok');
