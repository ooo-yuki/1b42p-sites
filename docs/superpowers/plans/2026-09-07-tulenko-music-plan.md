# Звук на Струделе Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Живая музыка Струделя в игре: три темы петлёй с автопереключением день/ночь/тревога, короткие звуки остаются на готовых гудках.

**Architecture:** Движок Струделя лежит в деле ужатым местным файлом и заводится после первого ввода игрока; узоры — строками в `src/songs.ts`; новый раздел `src/music.ts` крутит темы; короткие звуки не трогаем (см. Ruling 1). Без движка — молча назад к гудкам.

**Tech Stack:** TypeScript без сборки (склейка разделов в game.js, без import/export), `@strudel/web@1.3.0` ужатый esbuild в IIFE, Node-пробы `node --test`, безголовое окно для прослушки.

**Spec:** docs/superpowers/specs/2026-09-07-tulenko-music-design.md

## Global Constraints

- Дело /root/sites, ветка master, только свои пути из задачи.
- Пробы: `timeout 10 node <путь>` — зелень; проверка типов: `tsc --ignoreConfig --noEmit --strict <файл>`.
- Узел: /root/.nvm/versions/node/v24.20.0/bin/node.
- Писать по-русски, без иностранных слов в строках игры.
- Чужие папки, службы и бумаги не трогать; новых помощников и проверок не звать.
- Сборка game.js только склейкой разделов без export/import, образец — готовый game.js.
- Движок грузится `index.html` обычным скриптом до `game.js`; сеть движку не нужна (только синты, без банков и `gm_*`).

## Ruling 1 (отступление от бумаги)

Бумага просила короткие звуки узорами. Струдель крутит узор петлёй, а одиночный звук глушит всё через общий `hush` — вместе с музыкой. Поэтому короткие (шаг, подбор, дверь, удар, карцер, победа, поражение) остаются на готовых гудках `blip` из `src/audio.ts`, их не трогаем. Узоры — только темы. Цена ошибки: темы и гудки звучат разным тембром.

## Проверенные связки (пробы чистые, повторять не надо)

- `import { initStrudel } from '@strudel/web'` → esbuild IIFE, ~630К.
- В окне: `boot()` → узор `.play()` → `hush()`, ошибок нет, сеть чистая.
- После `initStrudel()` узоры доступны прямо: `note()`, `sound()`, `stack()`, `hush()`, `setcpm()`.
- Только местные синты: `sawtooth`, `square`, `triangle`, `sine`, шум `white`.
- Украшения: `lpf`, `gain`, `adsr`, `delay`, `room`, `pan`, `vib`, `fast`/`slow`, `scale("A2:minor")`.

---

## Файлы

- Создать: `tulenko.bratuxa.zomb.top/lib/strudel-bundle.js` (движок),
  `scripts/strudel-entry.js` (вход для сборки, образец для перегона),
  `tulenko.bratuxa.zomb.top/src/songs.ts` (узоры),
  `tulenko.bratuxa.zomb.top/src/music.ts` (завод и темы),
  `tulenko.bratuxa.zomb.top/tests/songs.test.js`,
  `tulenko.bratuxa.zomb.top/tests/music.test.js`.
- Изменить: `tulenko.bratuxa.zomb.top/index.html` (скрипт движка),
  `tulenko.bratuxa.zomb.top/src/main2.ts` + `game.js` (завод и переключение).

---

### Task 1: Движок в деле

**Files:**
- Create: `scripts/strudel-entry.js`
- Create: `tulenko.bratuxa.zomb.top/lib/strudel-bundle.js`

**Interfaces:**
- Consumes: `@strudel/web@1.3.0` из npm.
- Produces: `window.TulenkoMusic = { boot(): Promise<boolean>, play(code: string): void, stop(): void }`.

- [ ] **Step 1: Write the entry**

```js
// scripts/strudel-entry.js — вход для сборки движка. Перегон:
// ./node_modules/.bin/esbuild scripts/strudel-entry.js --bundle --format=iife \
//   --global-name=TulenkoMusic --minify \
//   --outfile=tulenko.bratuxa.zomb.top/lib/strudel-bundle.js
import { initStrudel, hush } from '@strudel/web';
export async function boot() { await initStrudel(); return true; }
export function play(code) { (0, eval)(code); }
export function stop() { hush(); }
```

- [ ] **Step 2: Build the bundle**

Run: `timeout 120 ./node_modules/.bin/esbuild scripts/strudel-entry.js --bundle --format=iife --global-name=TulenkoMusic --minify --outfile=tulenko.bratuxa.zomb.top/lib/strudel-bundle.js`
Expected: файл ~600–700К, без ошибок.

- [ ] **Step 3: Probe boot/play/stop in headless window**

Страница грузит `lib/strudel-bundle.js`, зовёт `boot()`, играет
`note('<c3 e3 g3 a3>').sound('sawtooth').play()`, ждёт 3с, зовёт `stop()`.
Ждём: ошибок нет, упавших запросов нет.

- [ ] **Step 4: Commit**

```bash
git add scripts/strudel-entry.js tulenko.bratuxa.zomb.top/lib/strudel-bundle.js
git commit -m "tulenko: движок звука в деле"
```

### Task 2: Узоры тем

**Files:**
- Create: `tulenko.bratuxa.zomb.top/src/songs.ts`
- Create: `tulenko.bratuxa.zomb.top/tests/songs.test.js`

**Interfaces:**
- Consumes: ничего.
- Produces: `SONG_DAY: string`, `SONG_NIGHT: string`, `SONG_ALARM: string`,
  `SONG_CPM: { day: number; night: number; alarm: number }`.

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert';
import { SONG_DAY, SONG_NIGHT, SONG_ALARM, SONG_CPM } from '../game-src-songs.js';
for (const [name, s] of [['day', SONG_DAY], ['night', SONG_NIGHT], ['alarm', SONG_ALARM]]) {
  assert.equal(typeof s, 'string', name + ' is string');
  assert.ok(s.length > 20, name + ' not empty');
  assert.ok(!/bank\(|gm_|samples\(/.test(s), name + ' synths only, no network');
}
assert.ok(SONG_CPM.night < SONG_CPM.day && SONG_CPM.day < SONG_CPM.alarm, 'tempo grows');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/songs.test.js`
Expected: FAIL, нет файла.

- [ ] **Step 3: Write minimal implementation**

```ts
export const SONG_CPM = { day: 34, night: 24, alarm: 46 };
export const SONG_DAY =
  "stack(note('<[a2 a2] [d3 d3] [e3 e3] [a2 a2]>').sound('sawtooth').lpf(1200).vib(4).gain(.5)," +
  "note('<[a4 c5 e5 a5] [d5 f5 a5 d6] [e5 g5 b5 e6] [a4 c5 e5 a5]>*2').sound('square').lpf(2500).gain(.22).delay(.3).room(.4)," +
  "note('c2*4').sound('sine').gain(.7)," +
  "sound('white*8').decay(.04).gain(.25)).play()";
export const SONG_NIGHT =
  "stack(note('[a3 ~ e4 ~] [~ d4 ~ c4]').sound('triangle').delay(.5).room(.8).gain(.4)," +
  "note('a1*2').sound('sine').gain(.5)).play()";
export const SONG_ALARM =
  "stack(note('[a2 a2 a2 a2]*4').sound('sawtooth').lpf(2000).gain(.5)," +
  "sound('white*16').decay(.03).gain(.3)).play()";
```

Строки править на слух в Task 5; строй держать: только синты, без `bank`/`gm_`/`samples`.

- [ ] **Step 4: Run test to verify it passes**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/songs.test.js`
Expected: PASS. Плюс tsc по своим файлам.

- [ ] **Step 5: Commit**

```bash
git add tulenko.bratuxa.zomb.top/src/songs.ts tulenko.bratuxa.zomb.top/tests/songs.test.js
git commit -m "tulenko: узоры тем"
```

### Task 3: Завод и темы

**Files:**
- Create: `tulenko.bratuxa.zomb.top/src/music.ts`
- Create: `tulenko.bratuxa.zomb.top/tests/music.test.js`

**Interfaces:**
- Consumes: `SONG_DAY/SONG_NIGHT/SONG_ALARM/SONG_CPM` из `songs.ts`,
  `window.TulenkoMusic` из Task 1.
- Produces: `bootMusic(): void`, `music(kind: 'day'|'night'|'alarm'): void`.
  Без движка — молча ничего (гудки уже есть в `audio.ts`, их не трогаем).

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert';
import { bootMusic, music } from '../game-src-music.js';
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/music.test.js`
Expected: FAIL, нет файла.

- [ ] **Step 3: Write minimal implementation**

```ts
import { SONG_DAY, SONG_NIGHT, SONG_ALARM, SONG_CPM } from "./songs.js";
type Kind = "day" | "night" | "alarm";
let ready = false;
let current: Kind | "" = "";
function engine(): { boot(): Promise<unknown>; play(code: string): void; stop(): void } | null {
  try {
    const w = window as unknown as { TulenkoMusic?: { boot(): Promise<unknown>; play(code: string): void; stop(): void } };
    return w.TulenkoMusic ?? null;
  } catch {
    return null;
  }
}
export function bootMusic(): void {
  try {
    const e = engine();
    if (!e) return;
    void e.boot().then(() => { ready = true; if (current) music(current as Kind); }).catch(() => {});
  } catch {
    // без звука — молча дальше
  }
}
export function music(kind: Kind): void {
  current = kind;
  try {
    const e = engine();
    if (!e || !ready) return;
    e.stop();
    const code = kind === "day" ? SONG_DAY : kind === "night" ? SONG_NIGHT : SONG_ALARM;
    e.play("setcpm(" + (kind === "day" ? SONG_CPM.day : kind === "night" ? SONG_CPM.night : SONG_CPM.alarm) + ");" + code);
  } catch {
    // без звука — молча дальше
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/music.test.js`
Expected: PASS. Плюс tsc по своим файлам.

- [ ] **Step 5: Commit**

```bash
git add tulenko.bratuxa.zomb.top/src/music.ts tulenko.bratuxa.zomb.top/tests/music.test.js
git commit -m "tulenko: завод и темы"
```

### Task 4: Вшить в игру

**Files:**
- Modify: `tulenko.bratuxa.zomb.top/index.html`
- Modify: `tulenko.bratuxa.zomb.top/src/main2.ts`
- Modify: `tulenko.bratuxa.zomb.top/game.js`

**Interfaces:**
- Consumes: `bootMusic/music` из Task 3, готовые `isNight` и розыск из игры.
- Produces: движок грузится до игры; завод на первом вводе; тема сама
  (тревога при розыске выше нуля, иначе ночь/день по часам).

- [ ] **Step 1: Wire and assemble**

`index.html`: скрипт `lib/strudel-bundle.js` до `game.js`. `main2.ts`:
завод на первом вводе рядом с первым `blip`, выбор темы рядом с тиком
часов (розыск выше нуля — тревога). `game.js` пересобрать склейкой.

- [ ] **Step 2: Check**

`node --check game.js`, `timeout 60 node --test tests/*.test.js` — всё
зелёное. Крючок знает `music`/`bootMusic`.

- [ ] **Step 3: Commit**

```bash
git add tulenko.bratuxa.zomb.top/index.html tulenko.bratuxa.zomb.top/src/main2.ts tulenko.bratuxa.zomb.top/game.js
git commit -m "tulenko: музыка в игре"
```

### Task 5: Записи судье

**Files:** без файлов кода, звукозаписи.

- [ ] **Step 1: Record three themes**

В безголовом окне завести движок, сыграть каждую тему по 15 секунд,
писать выход захватом и сложить в `/root/shots/music_day.ogg`,
`music_night.ogg`, `music_alarm.ogg`. Ошибок и сети — ноль.

- [ ] **Step 2: Fix by ear once**

Если тема фальшивит или пустая — поправить строку в `src/songs.ts`,
прогнать пробы, перезаписать, записать отдельным коммитом.

### Task 6: Смотр и сдача

**Files:** без файлов, проверка.

- [ ] **Step 1: Window review**

Страница без ошибок, тема дня звучит, ночью переключается,
при розыске — тревога, дверь и победа с гудками поверх.

- [ ] **Step 2: Live check**

Страница 200, сборка 200, движок 200. Итог — три записи человеку,
судья — человек.

## Самопроверка плана

- Замысел покрыт: движок — 1; узоры — 2; завод — 3; вшив — 4;
  записи — 5; сдача — 6. Кнопки нет (приказ). Тишина — Task 3 (молча).
- Имена одни: `TulenkoMusic.boot/play/stop`, `SONG_DAY/NIGHT/ALARM`,
  `SONG_CPM`, `bootMusic/music`.
- Волны: 1–3 рядом (файлы не пересекаются), 4 следом, 5–6 следом.
- Ruling 1 зафиксирован выше: короткие на гудках, не трогаем.
