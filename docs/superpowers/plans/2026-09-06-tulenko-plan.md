# Побег тюленьки. План стройки

> **Для помощников:** нужное доп-правило: по задачам через новых помощников
> или шагами в этой же беседе с точками проверки. Шаги со скобками (`- [ ]`).

**Цель:** игра про побег тюленьки из трёх корпусов на адресе тюленьки.

**Устройство:** правила отдельно от экрана, картинки рисуются кодом,
корпуса описаны значками, склейка в одном главном файле.

**Набор:** язык с типами, холст для картинки, звук гудками кодом,
рисование картинок средством с подушкой, проверка правил узлом.

**Замысел:** `docs/superpowers/specs/2026-09-06-tulenko-design.md`

## Общие условия

- Сердец три на всю игру, лучшее время помним под ключом `tulenko_best_v1`.
- Игрок цифр не видит, только простые слова и числа дела.
- Значки карт: `#` стена, `=` решётка, `-` выступ, `K` ключ, `F` рыба,
  `E` выход, `G` охрана, `P` тюленька, ` ` пол, все строки одной длины.
- Каждый шаг чиним тестом: сначала падающий тест, потом правило, потом снова тест.
- Сажаем только своими путями, чужих папок не трогаем.

---

### Задача 1: Каркас и числа баланса

**Файлы:**
- Создать: `tulenko.bratuxa.zomb.top/tsconfig.json`
- Создать: `tulenko.bratuxa.zomb.top/src/config.ts`
- Создать: `tulenko.bratuxa.zomb.top/.gitignore`

**Даёт дальше:** `CFG` с полями `hearts: 3`, `saveKey: 'tulenko_best_v1'`,
`step: 0.016`, скорости и дальности числами.

- [ ] **Шаг 1: написать числа баланса**

```ts
export interface Balance {
  hearts: number; saveKey: string; step: number;
  walk: number; jump: number; gravity: number;
  guardSpeed: number; sight: number; stunSec: number;
}
export const CFG: Balance = {
  hearts: 3, saveKey: 'tulenko_best_v1', step: 0.016,
  walk: 3.2, jump: 7.5, gravity: 22.0,
  guardSpeed: 1.6, sight: 4.5, stunSec: 4.0,
};
```

- [ ] **Шаг 2: каркас сборки**

```json
{
  "compilerOptions": {
    "target": "ES2020", "module": "ES2020", "moduleResolution": "Bundler",
    "strict": true, "outDir": ".", "rootDir": "src"
  },
  "include": ["src/*.ts"]
}
```

`.gitignore`: две строки `node_modules/` и `*.log`.

- [ ] **Шаг 3: проверить сборку**

Выполнить: `node_modules/.bin/tsc -p tsconfig.json --noEmit`
Ждём: выход 0, тишина.

- [ ] **Шаг 4: записать**

```bash
git add tulenko.bratuxa.zomb.top/tsconfig.json tulenko.bratuxa.zomb.top/src/config.ts tulenko.bratuxa.zomb.top/.gitignore
git commit -m "tulenko: каркас и числа баланса"
```

### Задача 2: Карты корпусов с проверкой

**Файлы:**
- Создать: `tulenko.bratuxa.zomb.top/src/levels.ts`
- Создать: `tulenko.bratuxa.zomb.top/tests/levels.test.js`

**Берёт:** ничего. **Даёт:** `LEVELS: string[][]` (три карты),
`checkMap(map: string[]): string[]` (пусто — карта годна).

- [ ] **Шаг 1: падающий тест проверки карт**

```js
import assert from 'node:assert';
import { checkMap, LEVELS } from '../game-src-levels.js';
assert.deepEqual(checkMap(['P E', '###']), []);
assert.equal(LEVELS.length, 3);
assert.ok(checkMap(['PE']).length > 0);
```

- [ ] **Шаг 2: убедиться, что падает**

Выполнить: `timeout 10 node tests/levels.test.js`
Ждём: падение со словами «нет файла».

- [ ] **Шаг 3: написать карты и проверку**

```ts
export const GLYPHS = '#=-KFE GP';
export function checkMap(map: string[]): string[] {
  const bad: string[] = [];
  if (map.length === 0) return ['пустая карта'];
  const w = map[0].length;
  const flat = map.join('');
  if (!map.every((r) => r.length === w)) bad.push('строки разной длины');
  for (const must of ['P', 'E', 'K', 'F']) {
    if (!flat.includes(must)) bad.push('нет знака ' + must);
  }
  for (const ch of flat) {
    if (!('#=-KFE GP'.includes(ch))) bad.push('чужой знак ' + ch);
  }
  return [...new Set(bad)];
}
export const LEVELS: string[][] = [ [/* корпус 1 */], [/* корпус 2 */], [/* корпус 3 */] ];
```

Карты чертит строитель по месту: первый корпус учит ходьбе и ключу,
второй — прыжкам и рыбе, третий — охране и загадке с решёткой. Каждая карта
прямоугольная и содержит `P`, `E`, `K`, `F`.

- [ ] **Шаг 4: тест проходит**

Выполнить: `timeout 10 node tests/levels.test.js`
Ждём: тишина, выход 0.

- [ ] **Шаг 5: записать**

```bash
git add tulenko.bratuxa.zomb.top/src/levels.ts tulenko.bratuxa.zomb.top/tests/levels.test.js
git commit -m "tulenko: карты корпусов с проверкой"
```

### Задача 3: Ходьба и прыжки

**Файлы:**
- Создать: `tulenko.bratuxa.zomb.top/src/logic.ts` (начало: состояние и шаг)
- Создать: `tulenko.bratuxa.zomb.top/tests/walk.test.js`

**Берёт:** `LEVELS` из задачи 2. **Даёт:** `newRun()`, `step(S, input)`,
`S.seal = { x, y, vx, vy, onGround }`.

- [ ] **Шаг 1: падающий тест ходьбы**

```js
import assert from 'node:assert';
import { newRun, step } from '../game-src-logic.js';
const s = newRun(0);
const x0 = s.seal.x;
step(s, { left: false, right: true, jump: false });
assert.ok(s.seal.x > x0);
```

- [ ] **Шаг 2: убедиться, что падает, потом написать шаг**

Тяга вниз каждый шаг: `vy -= gravity * dt`, пол и выступы держат,
прыжок только с опоры. Стены не пропускают по значкам карты.

- [ ] **Шаг 3: тест проходит, записать**

```bash
git add tulenko.bratuxa.zomb.top/src/logic.ts tulenko.bratuxa.zomb.top/tests/walk.test.js
git commit -m "tulenko: ходьба и прыжки"
```

### Задача 4: Зрение охраны и поимка

**Файлы:**
- Изменить: `src/logic.ts` (дозор, конус, поимка)
- Создать: `tests/guard.test.js`

**Берёт:** состояние из задачи 3. **Даёт:** `S.guards[]` с полями
`x, y, dir, stun`, поле `S.hearts`, `S.caught: boolean`.

- [ ] **Шаг 1: падающий тест поимки**

```js
import assert from 'node:assert';
import { newRun, step, putSeal } from '../game-src-logic.js';
const s = newRun(0);
putSeal(s, s.guards[0].x + 1, s.guards[0].y);
step(s, {});
assert.equal(s.hearts, 2);
assert.equal(s.caught, true);
```

- [ ] **Шаг 2: убедиться, что падает, потом написать дозор**

Охрана ходит туда-сюда до стены, смотрит конусом вперёд на дальность
из чисел баланса, стены закрывают взгляд. Поимка: минус сердце и возврат
тюленьки к началу корпуса.

- [ ] **Шаг 3: тест проходит, записать**

```bash
git add tulenko.bratuxa.zomb.top/src/logic.ts tulenko.bratuxa.zomb.top/tests/guard.test.js
git commit -m "tulenko: зрение охраны и поимка"
```

### Задача 5: Толчки и оглушение

**Файлы:**
- Изменить: `src/logic.ts` (толчок)
- Создать: `tests/shove.test.js`

**Берёт:** `S.guards[]` из задачи 4. **Даёт:** действие толчка в вводе
`{ shove: boolean }`, поле `guard.stun` в секундах.

- [ ] **Шаг 1: падающий тест толчка**

```js
import assert from 'node:assert';
import { newRun, step, putSeal } from '../game-src-logic.js';
const s = newRun(0);
putSeal(s, s.guards[0].x + 0.6, s.guards[0].y);
step(s, { shove: true });
assert.ok(s.guards[0].stun > 0);
```

- [ ] **Шаг 2: убедиться, что падает, потом написать толчок**

Толчок рядом и лицом к страже ставит оглушение на секунды из баланса.
Оглушённая стража стоит и не видит. Повторный толчок в спину не нужен.

- [ ] **Шаг 3: тест проходит, записать**

```bash
git add tulenko.bratuxa.zomb.top/src/logic.ts tulenko.bratuxa.zomb.top/tests/shove.test.js
git commit -m "tulenko: толчки и оглушение"
```

### Задача 6: Подбор, выход, победа и поражение

**Файлы:**
- Изменить: `src/logic.ts` (подбор и концы)
- Создать: `tests/goal.test.js`

**Берёт:** всё из задач 3–5. **Даёт:** `S.hasKey, S.hasFish, S.won, S.dead`.

- [ ] **Шаг 1: падающие тесты концов**

```js
import assert from 'node:assert';
import { newRun, step, giveAll, killAll } from '../game-src-logic.js';
let s = newRun(0);
step(s, {});
assert.equal(s.won, false);
s = newRun(0);
giveAll(s);
killAll(s);
assert.equal(s.dead, true);
```

- [ ] **Шаг 2: убедиться, что падает, потом написать концы**

Ключ и рыба подбираются рядом. Выход закрыт без обоих, открыт с обоими.
Победа в корпусе — следующий, победа в третьем — конец игры.
Ноль сердец — поражение.

- [ ] **Шаг 3: тесты проходят, записать**

```bash
git add tulenko.bratuxa.zomb.top/src/logic.ts tulenko.bratuxa.zomb.top/tests/goal.test.js
git commit -m "tulenko: подбор, выход, победа и поражение"
```

### Задача 7: Картинки, рисованные кодом

**Файлы:**
- Создать: `scripts/gen_tulenko.py` (не в дело игры, рядом)
- Создать: `tulenko.bratuxa.zomb.top/img/*.png` (14 штук)

**Берёт:** ничего. **Даёт:** картинки 16 на 16 с прозрачным дном:
`seal_idle_0/1`, `seal_waddle_0/1/2/3`, `guard_0/1`,
`tile_floor/wall/bars/key/fish/exit`.

- [ ] **Шаг 1: написать рисовальщик точками**

Средство с подушкой, поле 16 на 16, серая с белым тюленька, синяя стража,
жёлтый ключ, серая рыба, зелёный выход. Каждый кадр из строк знаков,
знак — цвет из таблицы. Без чужих картинок.

- [ ] **Шаг 2: прогнать и проверить открытием**

Выполнить: `python3 scripts/gen_tulenko.py`
Ждём: `ALL_OK`, каждая картинка открывается, размер 16 на 16, есть прозрачность.

- [ ] **Шаг 3: глянуть один кадр глазами и записать**

```bash
git add tulenko.bratuxa.zomb.top/img scripts/gen_tulenko.py
git commit -m "tulenko: картинки тюленьки и тюрьмы"
```

### Задача 8: Загрузка картинок и таблицы кадров

**Файлы:**
- Создать: `src/sprites.ts`
- Создать: `tests/sprites.test.js`

**Берёт:** картинки из задачи 7. **Даёт:** `loadSprites(): Promise<Pic>`,
`FRAMES = { idle: [...], waddle: [...], guard: [...] }`.

- [ ] **Шаг 1: падающий тест таблиц**

```js
import assert from 'node:assert';
import { FRAMES } from '../game-src-sprites.js';
assert.equal(FRAMES.idle.length, 2);
assert.equal(FRAMES.waddle.length, 4);
assert.equal(FRAMES.guard.length, 2);
```

- [ ] **Шаг 2: убедиться, что падает, потом написать загрузку**

Загрузка ждёт все картинки, битая картинка заменяется рисованным
квадратом, игра не падает.

- [ ] **Шаг 3: тест проходит, записать**

```bash
git add tulenko.bratuxa.zomb.top/src/sprites.ts tulenko.bratuxa.zomb.top/tests/sprites.test.js
git commit -m "tulenko: загрузка картинок и кадры"
```

### Задача 9: Звук гудками

**Файлы:**
- Создать: `src/audio.ts`

**Берёт:** ничего. **Даёт:** `blip(kind)` для шага, подбора, удара,
победы, поражения. Без звука — молча идёт дальше.

- [ ] **Шаг 1: написать гудки**

Гудок через качание звука кодом, высота и длина свои на каждый случай.
Первый вызов после кнопки игрока, иначе браузер молчит.

- [ ] **Шаг 2: проверить ушами в сборке**

Слушаем в готовой игре, все пять случаев гудят.

- [ ] **Шаг 3: записать**

```bash
git add tulenko.bratuxa.zomb.top/src/audio.ts
git commit -m "tulenko: звук гудками"
```

### Задача 10: Склейка, страница, рекорд

**Файлы:**
- Создать: `src/main.ts`, `src/save.ts`
- Создать: `tulenko.bratuxa.zomb.top/index.html`
- Создать: `tulenko.bratuxa.zomb.top/game.js` (сборка из исходников)

**Берёт:** всё из задач 1–9. **Даёт:** рабочую игру.

- [ ] **Шаг 1: написать склейку**

Цикл по стенным часам, сторож для вкладок без кадров тем же шагом.
Ввод: стрелки и палец. Отрисовка: поле, тюленька кадрами по движению,
стража кадрами, сердца, время. Экраны: начало, победа, поражение, заново.
Рекорд: чтение бережное, запись лучшего.

- [ ] **Шаг 2: написать страницу**

Поле 960 на 540, кнопки для пальца, ссылка назад в общий дом полным
адресом, маячок учёта каждые 30 секунд, надписи простые.

- [ ] **Шаг 3: собрать и проверить**

Выполнить сборку в `game.js`, проверку в узле, отдать рядом и спросить
страницу и все картинки, все отвечают 200.

- [ ] **Шаг 4: записать**

```bash
git add tulenko.bratuxa.zomb.top/src/main.ts tulenko.bratuxa.zomb.top/src/save.ts tulenko.bratuxa.zomb.top/index.html tulenko.bratuxa.zomb.top/game.js
git commit -m "tulenko: склейка, страница, рекорд"
```

### Задача 11: Сдача на адрес

**Файлы:** свои пути из задач выше, плюс карточка в общем доме и учёт.

- [ ] **Шаг 1: страница и картинки живы рядом**
- [ ] **Шаг 2: адрес покрыт бумагой, служба живёт заново**
- [ ] **Шаг 3: строгий спрос адреса без слепого пропуска**
- [ ] **Шаг 4: карточка, учёт, запись с хешем**

## Самопроверка плана

- Замысел покрыт: три корпуса — задача 2; скрытность — 4; прыжки — 3;
  толчки — 5; загадка с ключом, ключ и рыба — 6; сердца 3 — 1 и 6;
  рекорд — 10; вид сбоку — 10; картинки с кадрами — 7 и 8; звук — 9.
- Пустых мест нет, каждый шаг с делом и приказом.
- Имена одни и те же во всех задачах: `newRun`, `step`, `putSeal`,
  `giveAll`, `killAll`, `LEVELS`, `checkMap`, `FRAMES`, `loadSprites`,
  `blip`, `CFG`.
