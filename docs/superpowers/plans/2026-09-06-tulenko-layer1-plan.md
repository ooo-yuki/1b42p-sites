# Побег тюленьки. Слой 1: чинка, учёба, тетрадка

> **Для помощников:** нужное доп-правило: по задачам через новых помощников
> или шагами в этой же беседе с точками проверки. Шаги со скобками (`- [ ]`).

**Цель:** убрать четыре беды: малое поле, нет учёбы, неясный верх и перед,
стража в воздухе, — плюс тетрадка с делом часа.

**Устройство:** правим готовое, не ломая правила: вид, учёба, знаки,
пути дозора, тетрадка. Вид остаётся сбоку в этом слое, смена вида сверху —
дело второго слоя.

**Набор:** тот же, что в деле: язык с типами, холст, гудки, картинки точками.

**Замысел:** `docs/superpowers/specs/2026-09-06-tulenko-design.md`

## Общие условия

- Поле на весь экран, края залиты тьмой тюрьмы, кнопки для пальца целы.
- Сердец три, рекорд и маячок не трогаем.
- Каждая правка с проверкой: правило тестом, вид глазами в окне.
- Сажаем только своими путями.

---

### Task 1: Поле на весь экран

**Файлы:**
- Изменить: `tulenko.bratuxa.zomb.top/index.html`
- Изменить: `tulenko.bratuxa.zomb.top/src/main.ts`

**Берёт:** готовую отрисовку 960 на 540. **Даёт:** холст во всю ширину окна
с целой картинкой (`resize()` + масштаб по меньшей стороне, тьма по краям).

- [ ] **Шаг 1: написать подгонку под окно**

```ts
export function fitCanvas(cv: HTMLCanvasElement): number {
  const s = Math.min(window.innerWidth / 960, window.innerHeight / 540);
  cv.style.width = Math.floor(960 * s) + 'px';
  cv.style.height = Math.floor(540 * s) + 'px';
  return s;
}
```

- [ ] **Шаг 2: звать при старте и при смене окна**

```ts
window.addEventListener('resize', () => fitCanvas(cv));
fitCanvas(cv);
```

- [ ] **Шаг 3: смотр в окне**

Раздача рядом, открыть, окно широкое и узкое: поле целое, тьма по краям,
кнопки жмутся.

- [ ] **Шаг 4: записать**

```bash
git add tulenko.bratuxa.zomb.top/index.html tulenko.bratuxa.zomb.top/src/main.ts
git commit -m "tulenko: поле на весь экран"
```

### Task 2: Учёба с тёткой

**Файлы:**
- Создать: `tulenko.bratuxa.zomb.top/src/teach.ts`
- Создать: `tulenko.bratuxa.zomb.top/tests/teach.test.js`
- Изменить: `tulenko.bratuxa.zomb.top/src/main.ts` (показ учёбы)
- Создать: `tulenko.bratuxa.zomb.top/img/face_aunt.png`

**Берёт:** экраны из склейки. **Даёт:** `TEACH: string[]` (шаги учёбы),
`teachStep(S): string | null` (что сказать сейчас), лицо тётки 32 на 32.

- [ ] **Шаг 1: падающий тест шагов учёбы**

```js
import assert from 'node:assert';
import { teachStep, TEACH } from '../game-src-teach.js';
assert.ok(TEACH.length >= 4);
assert.ok(teachStep({ moved: false }).length > 0);
assert.equal(teachStep({ moved: true, key: true, fish: true, exit: true }), null);
```

- [ ] **Шаг 2: убедиться, что падает, потом написать шаги**

Шаги по делу: движение, ключ, рыба, выход, толчок. Каждый шаг гаснет своим
делом. Лицо тётки: крупно, доброе, серо-белое, 32 на 32, глянуть глазами.

- [ ] **Шаг 3: тест проходит, показ в игре, смотр в окне**

Учёба только в первом корпусе, дальше молчит. Лицо рядом с речью.

- [ ] **Шаг 4: записать**

```bash
git add tulenko.bratuxa.zomb.top/src/teach.ts tulenko.bratuxa.zomb.top/tests/teach.test.js tulenko.bratuxa.zomb.top/src/main.ts tulenko.bratuxa.zomb.top/img/face_aunt.png
git commit -m "tulenko: учёба с тёткой"
```

### Task 3: Знаки верха и переда

**Файлы:**
- Изменить: `tulenko.bratuxa.zomb.top/src/main.ts` (тени, стрелка, глаза)
- Изменить: `tulenko.bratuxa.zomb.top/img/tile_exit.png` (стрелка на выходе)

**Берёт:** кадры тюленьки и стражи. **Даёт:** тень-овал под ногами каждого,
стрелка на выходе, глаза смотрят в сторону хода и взгляда.

- [ ] **Шаг 1: тени и стрелка**

Овал под ногами рисуется раньше ног. Выход со стрелкой вбок. Глаза точкой
со сдвигом в сторону `dir`.

- [ ] **Шаг 2: смотр в окне**

Глазами: видно, кто куда идёт и смотрит, выход манит стрелкой.

- [ ] **Шаг 3: записать**

```bash
git add tulenko.bratuxa.zomb.top/src/main.ts tulenko.bratuxa.zomb.top/img/tile_exit.png
git commit -m "tulenko: знаки верха и переда"
```

### Task 4: Стража по полу

**Файлы:**
- Изменить: `tulenko.bratuxa.zomb.top/src/logic.ts` (привязка путей к полу)
- Изменить: `tulenko.bratuxa.zomb.top/tests/guard.test.js` (случай висячего пути)

**Берёт:** дозор из правил. **Даёт:** точки пути только на полу, проверка
падающим тестом.

- [ ] **Шаг 1: падающий тест висячего пути**

```js
import assert from 'node:assert';
import { newRun, groundPatrol } from '../game-src-logic.js';
const s = newRun(0);
for (const g of s.guards) assert.equal(groundPatrol(s, g), true);
```

- [ ] **Шаг 2: убедиться, что падает, потом привязать к полу**

При рождении и при шаге точка стражи опускается на ближний пол под ней.
Нет пола — точка не ставится, стража стоит.

- [ ] **Шаг 3: тест проходит, смотр в окне**

Глазами: никто не висит.

- [ ] **Шаг 4: записать**

```bash
git add tulenko.bratuxa.zomb.top/src/logic.ts tulenko.bratuxa.zomb.top/tests/guard.test.js
git commit -m "tulenko: стража по полу"
```

### Task 5: Тетрадка с делом часа

**Файлы:**
- Создать: `tulenko.bratuxa.zomb.top/src/notes.ts`
- Создать: `tulenko.bratuxa.zomb.top/tests/notes.test.js`
- Изменить: `tulenko.bratuxa.zomb.top/src/main.ts` (полоса и тетрадка)

**Берёт:** состояние корпусов. **Даёт:** `hourCase(S): string` (дело часа),
тетрадка на пружине со списком: ключ, рыба, выход.

- [ ] **Шаг 1: падающий тест дела часа**

```js
import assert from 'node:assert';
import { hourCase } from '../game-src-notes.js';
import { newRun } from '../game-src-logic.js';
assert.ok(hourCase(newRun(0)).length > 0);
```

- [ ] **Шаг 2: убедиться, что падает, потом написать дело часа**

Дело по недособранному: нет ключа — «добудь ключ», нет рыбы — «добудь рыбу»,
всё есть — «уходи в выход». Тетрадка отмечает взятое.

- [ ] **Шаг 3: тест проходит, смотр в окне**

Полоса времени вверху, тетрадка открывается кнопкой.

- [ ] **Шаг 4: записать**

```bash
git add tulenko.bratuxa.zomb.top/src/notes.ts tulenko.bratuxa.zomb.top/tests/notes.test.js tulenko.bratuxa.zomb.top/src/main.ts
git commit -m "tulenko: тетрадка с делом часа"
```

### Task 6: Сдача слоя

**Файлы:** свои пути из задач выше.

- [ ] **Шаг 1: все тесты зелёные, сборка и проверка узла**
- [ ] **Шаг 2: смотр в окне: широкое и узкое окно, учёба от начала до конца,
  стража на полу, тетрадка**
- [ ] **Шаг 3: строгий спрос адреса: страница, сборка, картинки 200**

## Самопроверка плана

- Четыре беды покрыты: поле — 1; учёба — 2; верх и перед — 3;
  стража в воздухе — 4; тетрадка — 5.
- Имена одни везде: `fitCanvas`, `TEACH`, `teachStep`, `groundPatrol`,
  `hourCase`. Новое не врёт старому: сердца, рекорд, маячок не тронуты.
- Пустых мест нет, каждый шаг с делом.
