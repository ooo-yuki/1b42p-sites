# Большая тюрьма Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Шесть корпусов тюрьмы с дверями, восемь путей побега делами в тетрадке, сила, новые люди и вещи — нелинейный сюжет поверх готового дня, работы и сборки.

**Architecture:** Каждый корпус своей картой со своими людьми; двери-переходы с затемнением; пути — данными квестов с честными проверками; правила без экрана с пробами; сборка склейкой как раньше.

**Tech Stack:** TypeScript без сборки (склейка разделов в game.js), Node-пробы `node --test`, картинки 32x32 Python+Pillow по закону scripts/PIXEL_STANDARD.md.

**Spec:** docs/superpowers/specs/2026-09-07-tulenko-world-design.md

## Global Constraints

- Дело /root/sites, ветка master, только свои пути из задачи.
- Пробы: `timeout 10 node <путь>` — зелень; проверка типов: `tsc --ignoreConfig --noEmit --strict <файл>`.
- Узел: /root/.nvm/versions/node/v24.20.0/bin/node.
- Писать по-русски, без иностранных слов в строках игры.
- Чужие папки, службы и бумаги не трогать; новых помощников и проверок не звать.
- Сборка game.js только склейкой разделов без export/import, образец — готовый game.js.

---

## Новые знаки карт

H качалка, O котёл, V фургон, A верстак, C КПП, Z забор, U лаз.
Старые в силе: D дверь, J станок, B кровать, T стол, S душ, R крыша,
P наши, E ворота, K ключ, F рыба, G стража.

## Файлы

- Создать: `src/maps/cells.ts`, `src/maps/kitchen.ts`, `src/maps/yard.ts`,
  `src/maps/wash.ts`, `src/maps/work.ts`, `src/maps/gate.ts` (каждый: MAP +
  знаки + люди корпуса).
- Создать: `src/doors.ts` (переходы), `src/strong.ts` (сила 0–5),
  `src/quests.ts` (8 дел с шагами).
- Изменить: `src/things.ts` (ствол, отрава, чертёж верстака), `src/talk.ts`
  (ветки), `src/levels.ts` (список корпусов), `src/main2.ts` + `game.js`
  (сборка мира, затемнение, тетрадка, сила в лице).
- Пробы рядом с каждым: `tests/maps_cells.test.js`, `tests/maps_kitchen.test.js`,
  `tests/maps_yard.test.js`, `tests/maps_wash.test.js`, `tests/maps_work.test.js`,
  `tests/maps_gate.test.js`, `tests/doors.test.js`, `tests/strong.test.js`,
  `tests/quests.test.js`.
- Картинки: `img/top_h.png, top_o.png, top_v.png, top_a.png, top_c.png,
  top_z.png, top_u.png` + люди `top_cook_0/1.png, top_boss_0/1.png,
  top_warden_0/1.png`, скрипты `scripts/artHD_new.py`.

---

### Task 1: Карты камер и кухни

**Files:**
- Create: `tulenko.bratuxa.zomb.top/src/maps/cells.ts`
- Create: `tulenko.bratuxa.zomb.top/src/maps/kitchen.ts`
- Create: `tulenko.bratuxa.zomb.top/tests/maps_cells.test.js`
- Create: `tulenko.bratuxa.zomb.top/tests/maps_kitchen.test.js`

**Interfaces:**
- Consumes: знаки из шапки плана, `loadGrid` из `../grid.js`.
- Produces: `CELLS_MAP: string[]`, `KITCHEN_MAP: string[]` (ровные ряды,
  знаки из списка, P/E/K/F на месте, проход BFS).

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert';
import { CELLS_MAP } from '../game-src-maps-cells.js';
import { KITCHEN_MAP } from '../game-src-maps-kitchen.js';
for (const [name, m] of [['cells', CELLS_MAP], ['kitchen', KITCHEN_MAP]]) {
  const w = m[0].length;
  assert.ok(m.every(r => r.length === w), name + ' rows even');
  const flat = m.join('');
  for (const s of ['P', 'E', 'K', 'F']) assert.ok(flat.includes(s), name + ' has ' + s);
}
assert.ok(CELLS_MAP.join('').includes('B'), 'cells has beds');
assert.ok(KITCHEN_MAP.join('').includes('O'), 'kitchen has pot');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/maps_cells.test.js`
Expected: FAIL, нет файла.

- [ ] **Step 3: Write minimal implementation**

Карты 30 на 16 по образцу нынешней: камеры — койки B рядами, двери D,
старт P; кухня — котёл O, столы T, дверь D. Ряды ровные, знаки из списка.

- [ ] **Step 4: Run test to verify it passes**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/maps_cells.test.js`
Expected: PASS. Плюс `tsc --ignoreConfig --noEmit --strict` по своим файлам.

- [ ] **Step 5: Commit**

```bash
git add tulenko.bratuxa.zomb.top/src/maps/cells.ts tulenko.bratuxa.zomb.top/src/maps/kitchen.ts tulenko.bratuxa.zomb.top/tests/maps_cells.test.js tulenko.bratuxa.zomb.top/tests/maps_kitchen.test.js
git commit -m "tulenko: карты камер и кухни"
```

### Task 2: Карты двора и душа

**Files:**
- Create: `tulenko.bratuxa.zomb.top/src/maps/yard.ts`
- Create: `tulenko.bratuxa.zomb.top/src/maps/wash.ts`
- Create: `tulenko.bratuxa.zomb.top/tests/maps_yard.test.js`
- Create: `tulenko.bratuxa.zomb.top/tests/maps_wash.test.js`

**Interfaces:**
- Consumes: то же, что Task 1.
- Produces: `YARD_MAP: string[]` (качалка H, забор Z по краю), `WASH_MAP: string[]`
  (душ S, фургон V).

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert';
import { YARD_MAP } from '../game-src-maps-yard.js';
import { WASH_MAP } from '../game-src-maps-wash.js';
assert.ok(YARD_MAP.join('').includes('H'), 'yard has pump');
assert.ok(YARD_MAP.join('').includes('Z'), 'yard has fence');
assert.ok(WASH_MAP.join('').includes('V'), 'wash has van');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/maps_yard.test.js`
Expected: FAIL, нет файла.

- [ ] **Step 3: Write minimal implementation**

Двор: открытое место, качалка H в середине, забор Z полосой с одной стороны,
двери D. Душ: душевые S рядами, фургон V у стены, дверь D.

- [ ] **Step 4: Run test to verify it passes**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/maps_yard.test.js`
Expected: PASS. Плюс tsc по своим файлам.

- [ ] **Step 5: Commit**

```bash
git add tulenko.bratuxa.zomb.top/src/maps/yard.ts tulenko.bratuxa.zomb.top/src/maps/wash.ts tulenko.bratuxa.zomb.top/tests/maps_yard.test.js tulenko.bratuxa.zomb.top/tests/maps_wash.test.js
git commit -m "tulenko: карты двора и душа"
```

### Task 3: Карты работы и ворот

**Files:**
- Create: `tulenko.bratuxa.zomb.top/src/maps/work.ts`
- Create: `tulenko.bratuxa.zomb.top/src/maps/gate.ts`
- Create: `tulenko.bratuxa.zomb.top/tests/maps_work.test.js`
- Create: `tulenko.bratuxa.zomb.top/tests/maps_gate.test.js`

**Interfaces:**
- Consumes: то же, что Task 1.
- Produces: `WORK_MAP: string[]` (станки J, верстак A), `GATE_MAP: string[]`
  (КПП C, ворота E, воля за воротами).

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert';
import { WORK_MAP } from '../game-src-maps-work.js';
import { GATE_MAP } from '../game-src-maps-gate.js';
assert.ok(WORK_MAP.join('').includes('A'), 'work has bench');
assert.ok(GATE_MAP.join('').includes('C'), 'gate has checkpoint');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/maps_work.test.js`
Expected: FAIL, нет файла.

- [ ] **Step 3: Write minimal implementation**

Работа: станки J рядами, верстак A, дверь D. Ворота: КПП C, ворота E,
за воротами полоса воли (пол + дорога), дверь D назад.

- [ ] **Step 4: Run test to verify it passes**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/maps_work.test.js`
Expected: PASS. Плюс tsc по своим файлам.

- [ ] **Step 5: Commit**

```bash
git add tulenko.bratuxa.zomb.top/src/maps/work.ts tulenko.bratuxa.zomb.top/src/maps/gate.ts tulenko.bratuxa.zomb.top/tests/maps_work.test.js tulenko.bratuxa.zomb.top/tests/maps_gate.test.js
git commit -m "tulenko: карты работы и ворот"
```

### Task 4: Двери с затемнением

**Files:**
- Create: `tulenko.bratuxa.zomb.top/src/doors.ts`
- Create: `tulenko.bratuxa.zomb.top/tests/doors.test.js`

**Interfaces:**
- Consumes: имена корпусов: cells, kitchen, yard, wash, work, gate.
- Produces: `DOORS: {from, x, y, to, tx, ty}[]`, `pass(S, id): boolean`
  (затемнение выставляет `S.fade` 0→1→0, переход по готовности).

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert';
import { DOORS, pass } from '../game-src-doors.js';
assert.ok(DOORS.length >= 10, 'doors both ways');
const s = { map: 'cells', x: 0, y: 0, fade: 0 };
assert.equal(typeof pass(s, 0), 'boolean');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/doors.test.js`
Expected: FAIL, нет файла.

- [ ] **Step 3: Write minimal implementation**

Список дверей туда-обратно между соседними корпусами. `pass` ставит
затемнение и возвращает готовность перехода.

- [ ] **Step 4: Run test to verify it passes**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/doors.test.js`
Expected: PASS. Плюс tsc по своим файлам.

- [ ] **Step 5: Commit**

```bash
git add tulenko.bratuxa.zomb.top/src/doors.ts tulenko.bratuxa.zomb.top/tests/doors.test.js
git commit -m "tulenko: двери с затемнением"
```

### Task 5: Сила

**Files:**
- Create: `tulenko.bratuxa.zomb.top/src/strong.ts`
- Create: `tulenko.bratuxa.zomb.top/tests/strong.test.js`

**Interfaces:**
- Consumes: ничего.
- Produces: `pump(S): number` (+1 в день, потолок 5), `need(S, n): boolean`.

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert';
import { pump, need } from '../game-src-strong.js';
const s = { power: 0, pumpedDay: 0 };
assert.equal(pump({ power: 0, pumpedDay: 0, day: 1 }), 1);
assert.equal(need({ power: 3 }, 3), true);
assert.equal(need({ power: 2 }, 3), false);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/strong.test.js`
Expected: FAIL, нет файла.

- [ ] **Step 3: Write minimal implementation**

```ts
export function pump(S: { power: number; pumpedDay: number; day: number }): number {
  if (S.pumpedDay === S.day) return S.power;
  S.pumpedDay = S.day;
  S.power = Math.min(5, S.power + 1);
  return S.power;
}
export function need(S: { power: number }, n: number): boolean {
  return S.power >= n;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/strong.test.js`
Expected: PASS. Плюс tsc по своим файлам.

- [ ] **Step 5: Commit**

```bash
git add tulenko.bratuxa.zomb.top/src/strong.ts tulenko.bratuxa.zomb.top/tests/strong.test.js
git commit -m "tulenko: сила"
```

### Task 6: Новые вещи и чертежи

**Files:**
- Modify: `tulenko.bratuxa.zomb.top/src/things.ts`
- Modify: `tulenko.bratuxa.zomb.top/tests/things.test.js`

**Interfaces:**
- Consumes: готовые `pick/craft/has/deal`.
- Produces: находки `ружьё-детали`, `трава-отрава`, чертёж `ствол`
  (детали + верстак), чертёж `отрава` (трава + котёл), цена лапы
  `BRIBE = 30`.

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert';
import { pick, craft } from '../game-src-things.js';
const s = { bag: [], bench: true };
pick(s, 'ружьё-детали');
assert.equal(craft(s, 'ствол'), true);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/things.test.js`
Expected: FAIL, чертежа нет.

- [ ] **Step 3: Write minimal implementation**

Добавить находки и два чертежа рядом с готовыми, цену лапы числом.

- [ ] **Step 4: Run test to verify it passes**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/things.test.js`
Expected: PASS. Плюс tsc по своим файлам.

- [ ] **Step 5: Commit**

```bash
git add tulenko.bratuxa.zomb.top/src/things.ts tulenko.bratuxa.zomb.top/tests/things.test.js
git commit -m "tulenko: вещи путей"
```

### Task 7: Дела путей

**Files:**
- Create: `tulenko.bratuxa.zomb.top/src/quests.ts`
- Create: `tulenko.bratuxa.zomb.top/tests/quests.test.js`

**Interfaces:**
- Consumes: имена вещей Task 6 (`ствол`, `отрава`, `BRIBE`), `need` Task 5.
- Produces: `QUESTS: {id, steps}[]` (8 дел), `done(S, id): boolean`
  (все шаги честно сошлись: вещь/место/время/сила/монеты).

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert';
import { done } from '../game-src-quests.js';
const s = { bag: ['спуск'], at: 'roof', night: true, power: 0, coins: 0, heat: 0 };
assert.equal(done(s, 'roof'), true);
assert.equal(done({ bag: [], at: 'roof', night: true }, 'roof'), false);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/quests.test.js`
Expected: FAIL, нет файла.

- [ ] **Step 3: Write minimal implementation**

Восемь дел: roof, gate, fence (сила 3 + ночь + двор), bribe (30 монет +
начальник), guns (ствол + сила 2 + ворота), tunnel (ложка + ночи копки 3 +
камера), poison (отрава + договор + кухня), quiet (ночь + ворота + розыск 0).

- [ ] **Step 4: Run test to verify it passes**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/quests.test.js`
Expected: PASS. Плюс tsc по своим файлам.

- [ ] **Step 5: Commit**

```bash
git add tulenko.bratuxa.zomb.top/src/quests.ts tulenko.bratuxa.zomb.top/tests/quests.test.js
git commit -m "tulenko: дела путей"
```

### Task 8: Разговоры ветвятся

**Files:**
- Modify: `tulenko.bratuxa.zomb.top/src/talk.ts`
- Modify: `tulenko.bratuxa.zomb.top/tests/talk.test.js`

**Interfaces:**
- Consumes: узлы Task 7 (`QUESTS`), готовые `talkFor/say`.
- Produces: ветки повара, бригадира, начальника, торговца, сокамерников:
  помощь открывает шаг, грубость даёт розыск.

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert';
import { say } from '../game-src-talk.js';
const s = { heat: 0, opened: [] };
say(s, 'cook_help');
assert.ok(s.opened.includes('poison'));
```

- [ ] **Step 2: Run test to verify it fails**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/talk.test.js`
Expected: FAIL, ветки нет.

- [ ] **Step 3: Write minimal implementation**

Новые узлы рядом с готовыми m1/n1/e1, лицо у всех строк.

- [ ] **Step 4: Run test to verify it passes**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/talk.test.js`
Expected: PASS. Плюс tsc по своим файлам.

- [ ] **Step 5: Commit**

```bash
git add tulenko.bratuxa.zomb.top/src/talk.ts tulenko.bratuxa.zomb.top/tests/talk.test.js
git commit -m "tulenko: разговоры ветвятся"
```

### Task 9: Люди корпусов

**Files:**
- Modify: `tulenko.bratuxa.zomb.top/src/actors.ts`
- Modify: `tulenko.bratuxa.zomb.top/tests/actors.test.js`

**Interfaces:**
- Consumes: готовые `newSeal/stepSeal`, карты Task 1–3.
- Produces: `newCook/newBoss/newWarden` + шаг патруля, ходят по полу,
  взгляд только у стражи.

- [ ] **Step 1: Write the failing test**

```js
import assert from 'node:assert';
import { newCook } from '../game-src-actors.js';
const c = newCook(5, 5);
assert.equal(typeof c.x, 'number');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/actors.test.js`
Expected: FAIL, нет повара.

- [ ] **Step 3: Write minimal implementation**

Трое новых ходоков рядом со стражей, без конуса взгляда.

- [ ] **Step 4: Run test to verify it passes**

Run: `timeout 10 node tulenko.bratuxa.zomb.top/tests/actors.test.js`
Expected: PASS. Плюс tsc по своим файлам.

- [ ] **Step 5: Commit**

```bash
git add tulenko.bratuxa.zomb.top/src/actors.ts tulenko.bratuxa.zomb.top/tests/actors.test.js
git commit -m "tulenko: люди корпусов"
```

### Task 10: Картинки корпусов

**Files:**
- Create: `scripts/artHD_new.py`
- Create: `tulenko.bratuxa.zomb.top/img/top_h.png`
- Create: `tulenko.bratuxa.zomb.top/img/top_o.png`
- Create: `tulenko.bratuxa.zomb.top/img/top_v.png`
- Create: `tulenko.bratuxa.zomb.top/img/top_a.png`
- Create: `tulenko.bratuxa.zomb.top/img/top_c.png`
- Create: `tulenko.bratuxa.zomb.top/img/top_z.png`
- Create: `tulenko.bratuxa.zomb.top/img/top_u.png`
- Create: `tulenko.bratuxa.zomb.top/img/top_cook_0.png`
- Create: `tulenko.bratuxa.zomb.top/img/top_cook_1.png`
- Create: `tulenko.bratuxa.zomb.top/img/top_boss_0.png`
- Create: `tulenko.bratuxa.zomb.top/img/top_boss_1.png`
- Create: `tulenko.bratuxa.zomb.top/img/top_warden_0.png`
- Create: `tulenko.bratuxa.zomb.top/img/top_warden_1.png`

**Interfaces:**
- Consumes: закон `scripts/PIXEL_STANDARD.md`, знаки из шапки плана.
- Produces: 14 картинок 32x32 (7 клеток + 6 людей + скрипт).

- [ ] **Step 1: Draw and check**

Выполнить: `python3 scripts/artHD_new.py`
Ждём: все 14 открываются, 32x32, прозрачность где надо, смотр глазами.

- [ ] **Step 2: Commit**

```bash
git add scripts/artHD_new.py tulenko.bratuxa.zomb.top/img/top_h.png tulenko.bratuxa.zomb.top/img/top_o.png tulenko.bratuxa.zomb.top/img/top_v.png tulenko.bratuxa.zomb.top/img/top_a.png tulenko.bratuxa.zomb.top/img/top_c.png tulenko.bratuxa.zomb.top/img/top_z.png tulenko.bratuxa.zomb.top/img/top_u.png tulenko.bratuxa.zomb.top/img/top_cook_0.png tulenko.bratuxa.zomb.top/img/top_cook_1.png tulenko.bratuxa.zomb.top/img/top_boss_0.png tulenko.bratuxa.zomb.top/img/top_boss_1.png tulenko.bratuxa.zomb.top/img/top_warden_0.png tulenko.bratuxa.zomb.top/img/top_warden_1.png
git commit -m "tulenko: картинки корпусов"
```

### Task 11: Сборка мира

**Files:**
- Modify: `tulenko.bratuxa.zomb.top/src/levels.ts`
- Modify: `tulenko.bratuxa.zomb.top/src/main2.ts`
- Modify: `tulenko.bratuxa.zomb.top/game.js`
- Modify: `tulenko.bratuxa.zomb.top/index.html`

**Interfaces:**
- Consumes: всё из Task 1–10.
- Produces: мир из 6 корпусов с переходами, тетрадка с делами, сила в лице.

- [ ] **Step 1: Assemble and check**

Собрать game.js склейкой разделов без export. Проверки:
`node --check game.js`, `timeout 60 node --test tests/*.test.js` — всё зелёное,
крючок знает 8 дел.

- [ ] **Step 2: Commit**

```bash
git add tulenko.bratuxa.zomb.top/src/levels.ts tulenko.bratuxa.zomb.top/src/main2.ts tulenko.bratuxa.zomb.top/game.js tulenko.bratuxa.zomb.top/index.html
git commit -m "tulenko: мир из корпусов вживую"
```

### Task 12: Смотр и сдача

**Files:** без файлов, проверка.

- [ ] **Step 1: Window review**

Смотр в окне по корпусам: старт в камерах, переход с затемнением, дело
в тетрадке, путь доводится до победы через крючок.

- [ ] **Step 2: Live check**

Страница 200, сборка 200, картинки корпусов 200. Итог словами
«вот чем мы всё ещё хуже аналогов».

## Самопроверка плана

- Замысел покрыт: корпуса — 1, 2, 3; двери — 4; сила — 5; вещи — 6;
  дела — 7; разговоры — 8; люди — 9; картинки — 10; сборка — 11; сдача — 12.
- Имена одни: `CELLS_MAP/KITCHEN_MAP/YARD_MAP/WASH_MAP/WORK_MAP/GATE_MAP`,
  `DOORS/pass`, `pump/need`, `QUESTS/done`, `BRIBE`.
- Волны: 1–6 рядом (файлы не пересекаются), 7–10 рядом, 11–12 следом.
