const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

function readTS(rel) {
  return fs.readFileSync(path.join(__dirname, rel), 'utf8');
}

// songs.ts без типов: только константы, снимаем export.
let src = readTS('../src/songs.ts');
src = src.replace(/export const /g, 'const ');
const js = src + '\nmodule.exports = { SONG_DAY, SONG_NIGHT, SONG_ALARM, SONG_CPM };\n';
const m = new Module('songs', module);
m._compile(js, path.join(__dirname, '..', 'src', 'songs.js'));
const { SONG_DAY, SONG_NIGHT, SONG_ALARM, SONG_CPM } = m.exports;

// Ядро из брифа Task 2: три узора — строки, только местные синты, темп растёт.
for (const [name, s] of [['day', SONG_DAY], ['night', SONG_NIGHT], ['alarm', SONG_ALARM]]) {
  assert.equal(typeof s, 'string', name + ' is string');
  assert.ok(s.length > 20, name + ' not empty');
  assert.ok(!/bank\(|gm_|samples\(/.test(s), name + ' synths only, no network');
}
assert.ok(SONG_CPM.night < SONG_CPM.day && SONG_CPM.day < SONG_CPM.alarm, 'tempo grows');

console.log('songs ok');
