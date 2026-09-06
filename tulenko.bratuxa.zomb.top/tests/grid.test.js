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
    .replace(/export function /g, 'function ')
    .replace(/export const /g, 'const ')
    .replace(/: RoomMap/g, '')
    .replace(/: Grid/g, '')
    .replace(/: Ctx/g, '')
    .replace(/: string(\[\])*/g, '')
    .replace(/: number/g, '')
    .replace(/: boolean/g, '');
}

const grid = strip(readTS('../src/grid.ts'));
const paint = strip(readTS('../src/paint.ts'));
const js = grid + '\n' + paint + '\nmodule.exports = { loadGrid, wallAt, roomColor, paintFloor, TILE, DARK };\n';
const m = new Module('grid', module);
m._compile(js, path.join(__dirname, '..', 'src', 'grid.js'));
const { loadGrid, wallAt, roomColor, paintFloor, TILE, DARK } = m.exports;

// Шаг 1 из задания: поле держит стены.
const g = loadGrid(['#####', '#P E#', '#####']);
assert.equal(wallAt(g, 0, 0), true);
assert.equal(wallAt(g, 2, 1), false);
// Край держит: за полем тоже стена.
assert.equal(wallAt(g, -1, 1), true);
assert.equal(wallAt(g, 5, 1), true);

// Цвет комнаты по знаку, пол по умолчанию серый.
assert.equal(typeof roomColor('B'), 'string');
assert.notEqual(roomColor('B'), roomColor('T'));
assert.notEqual(roomColor('J'), roomColor('S'));
assert.equal(roomColor(' '), roomColor('P'));

// Вид сверху: пол красит, стены белые, тьма вокруг.
function fakeCtx() {
  const calls = [];
  let style = '';
  return {
    calls,
    set fillStyle(v) { style = v; },
    get fillStyle() { return style; },
    fillRect(x, y, w, h) { calls.push({ style, x, y, w, h }); },
  };
}
const ctx = fakeCtx();
paintFloor(ctx, g);
const styles = ctx.calls.map((c) => c.style);
assert.ok(styles.includes(DARK), 'тьма вокруг поля');
assert.ok(styles.includes('#ffffff'), 'стены белые');
assert.ok(styles.includes(roomColor(' ')), 'пол красит');
assert.equal(ctx.calls[0].style, DARK, 'первым делом тьма');
assert.ok(ctx.calls.length > g.w * g.h, 'стенам нужна обводка');

console.log('grid ok: ' + ctx.calls.length + ' мазков, TILE=' + TILE);
