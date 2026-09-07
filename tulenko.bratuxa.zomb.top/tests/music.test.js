const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

function readTS(rel) {
  return fs.readFileSync(path.join(__dirname, rel), 'utf8');
}

// src/songs.ts — только константы, снимаем export
let songsBody = readTS('../src/songs.ts');
songsBody = songsBody.replace(/export const /g, 'const ');

// src/music.ts держим на стираемом синтаксисе, поэтому для запуска
// без сборки достаточно снять аннотации и перевести export в CJS.
// SONG_* уже объявлены выше из songsBody, import выкидываем.
let ms = readTS('../src/music.ts');
ms = ms
  .replace(/import \{[^}]*\} from ["']\.\/songs\.js["'];?/, '')
  .replace(/type Kind = [^;]*;/, '')
  .replace(/let current: Kind \| "" = "";/, 'let current = "";')
  .replace('function engine(): { boot(): Promise<unknown>; play(code: string): void; stop(): void } | null {', 'function engine() {')
  .replace('const w = window as unknown as { TulenkoMusic?: { boot(): Promise<unknown>; play(code: string): void; stop(): void } };', 'const w = window;')
  .replace(/export function bootMusic\(\): void \{/, 'function bootMusic() {')
  .replace(/export function music\(kind: Kind\): void \{/, 'function music(kind) {')
  .replace(/music\(current as Kind\)/, 'music(current)');

const js = songsBody + '\n' + ms +
  '\nmodule.exports = { bootMusic, music, SONG_DAY, SONG_NIGHT, SONG_ALARM, SONG_CPM };\n';
const m = new Module('music', module);
m._compile(js, path.join(__dirname, '..', 'src', 'music.js'));
const { bootMusic, music } = m.exports;

(async () => {
  // Заглушка движка из брифа
  globalThis.window = { TulenkoMusic: { boot: async () => true, played: [], play(c) { this.played.push(c); }, stop() {} } };
  bootMusic();
  await new Promise(r => setTimeout(r, 50));
  music('day');
  assert.ok(globalThis.window.TulenkoMusic.played.length > 0, 'day plays');
  music('night');
  assert.ok(globalThis.window.TulenkoMusic.played.length > 1, 'night switches');
  delete globalThis.window;
  music('alarm');
  assert.ok(true, 'no engine, no throw');
})().catch((e) => { console.error(e); process.exit(1); });
