# Побег тюленьки. Слой 2: шаги стройки

> **Для помощников:** нужное доп-правило: по задачам через новых помощников
> или шагами в этой же беседе с точками проверки. Шаги со скобками (`- [ ]`).

**Цель:** верх, день, нить, работа с вещами, кара. Старый бок режем сразу.

**Устройство:** новый движок частями с честными границами, правила без экрана.

**Набор:** тот же.

**Замысел:** `docs/superpowers/specs/2026-09-06-tulenko-layer2-design.md`

## Общие условия

- Значки карт прежние плюс `D` дверь, `J` станок, `B` кровать, `T` стол,
  `S` душ, `R` крыша.
- Розыск от нуля до трёх, сердец три, монеты с нуля.
- Каждый шаг чиним тестом: сначала падающий, потом правило.
- Сажаем только своими путями, старый бок стираем в задаче склейки.

---

### Task 1: Поле и вид сверху

**Файлы:**
- Создать: `tulenko.bratuxa.zomb.top/src/grid.ts`
- Создать: `tulenko.bratuxa.zomb.top/src/paint.ts` (начало: пол, стены, тьма)
- Создать: `tulenko.bratuxa.zomb.top/tests/grid.test.js`

**Берёт:** карты значками. **Даёт:** `loadGrid(map)`, `wallAt(x,y): boolean`,
`roomColor(ch): string`, `paintFloor(ctx, G)`.

- [ ] **Шаг 1: падающий тест поля**

```js
import assert from 'node:assert';
import { loadGrid, wallAt } from '../game-src-grid.js';
const g = loadGrid(['#####', '#P E#', '#####']);
assert.equal(wallAt(g, 0, 0), true);
assert.equal(wallAt(g, 2, 1), false);
```

- [ ] **Шаг 2: убедиться, что падает, потом написать поле**

Клетки значками, стены держат, цвет комнаты по знаку, тьма за стенами.

- [ ] **Шаг 3: тест проходит, записать**

```bash
git add tulenko.bratuxa.zomb.top/src/grid.ts tulenko.bratuxa.zomb.top/src/paint.ts tulenko.bratuxa.zomb.top/tests/grid.test.js
git commit -m "tulenko: поле и вид сверху"
```

### Task 2: Ходьба сверху

**Файлы:**
- Создать: `tulenko.bratuxa.zomb.top/src/actors.ts`
- Создать: `tulenko.bratuxa.zomb.top/tests/actors.test.js`

**Берёт:** `grid.ts`. **Даёт:** `actors.newSeal()`, `actors.step(S, input)`,
ходы на четыре стороны, шум шага.

- [ ] **Шаг 1: падающий тест ходьбы**

```js
import assert from 'node:assert';
import { newSeal, stepSeal } from '../game-src-actors.js';
const s = newSeal(1, 1);
stepSeal(s, { dx: 1, dy: 0 });
assert.ok(s.x > 1);
```

- [ ] **Шаг 2: убедиться, что падает, потом написать ходьбу**

Скорость из баланса, стены держат, ночь шумит вдвое.

- [ ] **Шаг 3: тест проходит, записать**

```bash
git add tulenko.bratuxa.zomb.top/src/actors.ts tulenko.bratuxa.zomb.top/tests/actors.test.js
git commit -m "tulenko: ходьба сверху"
```

### Task 3: Стража, взгляд, розыск

**Файлы:**
- Создать: `tulenko.bratuxa.zomb.top/src/vision.ts`
- Создать: `tulenko.bratuxa.zomb.top/tests/vision.test.js`

**Берёт:** `grid.ts`, `actors.ts`. **Даёт:** `sees(g, x, y, dir): boolean`,
`heatUp(S)`, `toSolitary(S)`.

- [ ] **Шаг 1: падающий тест взгляда**

```js
import assert from 'node:assert';
import { sees } from '../game-src-vision.js';
assert.equal(sees(null, 0, 0, 1), false);
```

- [ ] **Шаг 2: убедиться, что падает, потом написать взгляд**

Конус вперёд на дальность из баланса, стены закрывают. Поимка: розыск
плюс один и возврат в камеру. Три розыска — карцер до утра.

- [ ] **Шаг 3: тест проходит, записать**

```bash
git add tulenko.bratuxa.zomb.top/src/vision.ts tulenko.bratuxa.zomb.top/tests/vision.test.js
git commit -m "tulenko: стража и розыск"
```

### Task 4: Часы и распорядок

**Файлы:**
- Создать: `tulenko.bratuxa.zomb.top/src/clock.ts`
- Создать: `tulenko.bratuxa.zomb.top/tests/clock.test.js`

**Берёт:** ничего. **Даёт:** `tick(S, dt)`, `hourCase(S): string`,
расписание: подъём, поверка, еда, работа, душ, поверка, отбой.

- [ ] **Шаг 1: падающий тест часов**

```js
import assert from 'node:assert';
import { newDay, tick, hourCase } from '../game-src-clock.js';
const d = newDay();
tick(d, 3600);
assert.ok(hourCase(d).length > 0);
```

- [ ] **Шаг 2: убедиться, что падает, потом написать часы**

Нет на поверке — розыск вверх. Нет на работе — без монет. Отбой гасит свет.

- [ ] **Шаг 3: тест проходит, записать**

```bash
git add tulenko.bratuxa.zomb.top/src/clock.ts tulenko.bratuxa.zomb.top/tests/clock.test.js
git commit -m "tulenko: часы и распорядок"
```

### Task 5: Работа и монеты

**Файлы:**
- Создать: `tulenko.bratuxa.zomb.top/src/work.ts`
- Создать: `tulenko.bratuxa.zomb.top/tests/work.test.js`

**Берёт:** `clock.ts`. **Даёт:** `workAt(S): number` (монет за смену),
усталость, станки `J`.

- [ ] **Шаг 1: падающий тест работы**

```js
import assert from 'node:assert';
import { workAt } from '../game-src-work.js';
assert.ok(workAt({ atBench: true, hour: 10 }) > 0);
assert.equal(workAt({ atBench: false, hour: 10 }), 0);
```

- [ ] **Шаг 2: убедиться, что падает, потом написать работу**

Смена у станка в часы работы даёт монеты и усталость. Вне часов — ноль.

- [ ] **Шаг 3: тест проходит, записать**

```bash
git add tulenko.bratuxa.zomb.top/src/work.ts tulenko.bratuxa.zomb.top/tests/work.test.js
git commit -m "tulenko: работа и монеты"
```

### Task 6: Вещи и сборка

**Файлы:**
- Создать: `tulenko.bratuxa.zomb.top/src/things.ts`
- Создать: `tulenko.bratuxa.zomb.top/tests/things.test.js`

**Берёт:** ничего. **Даёт:** `pick(S, id)`, `craft(S, id): boolean`,
вещи: тряпка, ложка, верёвка, мыло; сборка: кляп, спуск; торговец.

- [ ] **Шаг 1: падающий тест сборки**

```js
import assert from 'node:assert';
import { pick, craft, has } from '../game-src-things.js';
const s = { bag: [] };
pick(s, 'ложка'); pick(s, 'тряпка');
assert.equal(craft(s, 'кляп'), true);
assert.ok(has(s, 'кляп'));
```

- [ ] **Шаг 2: убедиться, что падает, потом написать вещи**

Без нужного в суме сборка не выходит. Запретное помечено для обысков.

- [ ] **Шаг 3: тест проходит, записать**

```bash
git add tulenko.bratuxa.zomb.top/src/things.ts tulenko.bratuxa.zomb.top/tests/things.test.js
git commit -m "tulenko: вещи и сборка"
```

### Task 7: Разговоры и нить

**Файлы:**
- Создать: `tulenko.bratuxa.zomb.top/src/talk.ts`
- Создать: `tulenko.bratuxa.zomb.top/tests/talk.test.js`
- Создать: `tulenko.bratuxa.zomb.top/img/face_wisp.png`

**Берёт:** флаги памяти. **Даёт:** `talkFor(S): lines[]`,
`say(S, id)` ставит флаг, лицо духа 32 на 32.

- [ ] **Шаг 1: падающий тест разговора**

```js
import assert from 'node:assert';
import { talkFor, say } from '../game-src-talk.js';
const s = { flags: {} };
assert.ok(talkFor(s).length > 0);
say(s, 'm1');
assert.equal(s.flags.m1, true);
```

- [ ] **Шаг 2: убедиться, что падает, потом написать нить**

Три узла на день: утро, обед, вечер. Лицо духа рядом с речью, глянуть
глазами. Концов две: крыша (нужен спуск) и ворота (нужен кляп).

- [ ] **Шаг 3: тест проходит, записать**

```bash
git add tulenko.bratuxa.zomb.top/src/talk.ts tulenko.bratuxa.zomb.top/tests/talk.test.js tulenko.bratuxa.zomb.top/img/face_wisp.png
git commit -m "tulenko: разговоры и нить"
```

### Task 8: Обыски и карцер

**Файлы:**
- Создать: `tulenko.bratuxa.zomb.top/src/search.ts`
- Создать: `tulenko.bratuxa.zomb.top/tests/search.test.js`

**Берёт:** `things.ts`, `clock.ts`. **Даёт:** `search(S): found[]`,
карцер до утра с отбором вещей.

- [ ] **Шаг 1: падающий тест обыска**

```js
import assert from 'node:assert';
import { search } from '../game-src-search.js';
const s = { bag: ['ложка'] };
assert.deepEqual(search(s), ['ложка']);
```

- [ ] **Шаг 2: убедиться, что падает, потом написать обыск**

Обыск в камере находит запретное, уводит в карцер, вещи отобраны.

- [ ] **Шаг 3: тест проходит, записать**

```bash
git add tulenko.bratuxa.zomb.top/src/search.ts tulenko.bratuxa.zomb.top/tests/search.test.js
git commit -m "tulenko: обыски и карцер"
```

### Task 9: Картинки сверху

**Файлы:**
- Изменить: `scripts/gen_tulenko.py` (дописать верх)
- Создать: `tulenko.bratuxa.zomb.top/img/top_*.png` (тюленька 4 стороны,
  страж 2 кадра, пол, стена, дверь, кровать, стол, душ, станок, крыша)

**Берёт:** готовый рисовальщик. **Даёт:** вид сверху блочный, наши
серо-белые, стража синяя.

- [ ] **Шаг 1: дописать рисовальщик и прогнать**

Выполнить: `python3 scripts/gen_tulenko.py`
Ждём: `ALL_OK`, каждая открывается, 16 на 16, прозрачность есть.

- [ ] **Шаг 2: глянуть глазами все новые и записать**

```bash
git add scripts/gen_tulenko.py tulenko.bratuxa.zomb.top/img/top_seal_up.png tulenko.bratuxa.zomb.top/img/top_seal_down.png tulenko.bratuxa.zomb.top/img/top_seal_left.png tulenko.bratuxa.zomb.top/img/top_seal_right.png tulenko.bratuxa.zomb.top/img/top_guard_0.png tulenko.bratuxa.zomb.top/img/top_guard_1.png tulenko.bratuxa.zomb.top/img/top_floor.png tulenko.bratuxa.zomb.top/img/top_wall.png tulenko.bratuxa.zomb.top/img/top_door.png tulenko.bratuxa.zomb.top/img/top_bed.png tulenko.bratuxa.zomb.top/img/top_table.png tulenko.bratuxa.zomb.top/img/top_shower.png tulenko.bratuxa.zomb.top/img/top_bench.png tulenko.bratuxa.zomb.top/img/top_roof.png
git commit -m "tulenko: картинки сверху"
```

### Task 10: Склейка, срезать бок, сдача

**Файлы:**
- Создать: `tulenko.bratuxa.zomb.top/src/main2.ts`
- Создать: `tulenko.bratuxa.zomb.top/game.js` (заново из нового)
- Удалить: старые `src/main.ts`, `src/logic.ts`, side-картинки

**Берёт:** всё из задач 1–9. **Даёт:** новый верх вживую.

- [ ] **Шаг 1: склеить и срезать бок**
- [ ] **Шаг 2: сборка, проверка узла, все тесты зелёные**
- [ ] **Шаг 3: смотр в окне: день целиком через крючок, разговор с лицом,
  карцер глазами**
- [ ] **Шаг 4: строгий спрос адреса и запись**

```bash
git add tulenko.bratuxa.zomb.top/src/main2.ts tulenko.bratuxa.zomb.top/game.js
git rm tulenko.bratuxa.zomb.top/src/main.ts tulenko.bratuxa.zomb.top/src/logic.ts
git commit -m "tulenko: верх вместо бока"
```

## Самопроверка плана

- Решённое покрыто: верх — 1, 2, 9; день — 4; нить — 7; работа и вещи — 5, 6;
  кара — 3, 8; срез бока — 10.
- Имена одни: `loadGrid`, `wallAt`, `newSeal`, `stepSeal`, `sees`, `heatUp`,
  `toSolitary`, `tick`, `hourCase`, `workAt`, `pick`, `craft`, `has`,
  `talkFor`, `say`, `search`.
- Пустых мест нет.
