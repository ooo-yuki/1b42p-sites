# Побег тюленьки. Слой 3: шаги стройки

> **Для помощников:** нужное доп-правило: по задачам через новых помощников
> или шагами в этой же беседе с точками проверки. Шаги со скобками (`- [ ]`).

**Цель:** концовки крыши и ворот вживую, торговец ночью, второй круг вида.

**Устройство:** новое в своих частях, правила без экрана.

**Набор:** тот же.

**Замысел:** `docs/superpowers/specs/2026-09-06-tulenko-layer3-design.md`

## Общие условия

- Каждый шаг чиним тестом: сначала падающий, потом правило.
- Сажаем только своими путями.

---

### Task 1: Концовка крыши

**Файлы:**
- Создать: `tulenko.bratuxa.zomb.top/src/endings.ts` (начало: крыша)
- Создать: `tulenko.bratuxa.zomb.top/tests/endings.test.js`

**Берёт:** `things.ts` (спуск), `clock.ts` (ночь). **Даёт:** `tryRoof(S)`.

- [ ] **Шаг 1: падающий тест крыши**

```js
import assert from 'node:assert';
import { tryRoof } from '../game-src-endings.js';
assert.equal(tryRoof({ atRoof: true, night: true, bag: ['спуск'] }), 'win');
assert.equal(tryRoof({ atRoof: true, night: true, bag: [] }), 'warn');
assert.equal(tryRoof({ atRoof: true, night: false, bag: ['спуск'] }), 'wait');
```

- [ ] **Шаг 2: убедиться, что падает, потом написать крышу**

Ночь, клетка крыши, спуск в суме — победа. Нет спуска — предупреждение.
День — ждать ночи.

- [ ] **Шаг 3: тест проходит, записать**

```bash
git add tulenko.bratuxa.zomb.top/src/endings.ts tulenko.bratuxa.zomb.top/tests/endings.test.js
git commit -m "tulenko: концовка крыши"
```

### Task 2: Концовка ворот

**Файлы:**
- Изменить: `tulenko.bratuxa.zomb.top/src/endings.ts` (ворота)
- Изменить: `tulenko.bratuxa.zomb.top/tests/endings.test.js` (случаи ворот)

**Берёт:** `things.ts` (кляп), розыск. **Даёт:** `tryGate(S)`.

- [ ] **Шаг 1: падающий тест ворот**

```js
import assert from 'node:assert';
import { tryGate } from '../game-src-endings.js';
assert.equal(tryGate({ atGate: true, day: true, bag: ['кляп'], heat: 0 }), 'win');
assert.equal(tryGate({ atGate: true, day: true, bag: ['кляп'], heat: 2 }), 'deny');
assert.equal(tryGate({ atGate: true, day: true, bag: [], heat: 0 }), 'deny');
```

- [ ] **Шаг 2: убедиться, что падает, потом написать ворота**

День, ворота, кляп, розыск ноль — победа. Иначе отказ молча.

- [ ] **Шаг 3: тест проходит, записать**

```bash
git add tulenko.bratuxa.zomb.top/src/endings.ts tulenko.bratuxa.zomb.top/tests/endings.test.js
git commit -m "tulenko: концовка ворот"
```

### Task 3: Торговец ночью

**Файлы:**
- Изменить: `tulenko.bratuxa.zomb.top/src/things.ts` (торговец)
- Изменить: `tulenko.bratuxa.zomb.top/tests/things.test.js` (случаи торга)

**Берёт:** `clock.ts` (ночь), монеты. **Даёт:** `deal(S, id): boolean`.

- [ ] **Шаг 1: падающий тест торга**

```js
import assert from 'node:assert';
import { deal } from '../game-src-things.js';
const s = { coins: 5, bag: [], night: true };
assert.equal(deal(s, 'ложка'), true);
assert.ok(s.coins < 5);
const d = { coins: 0, bag: [], night: true };
assert.equal(deal(d, 'ложка'), false);
```

- [ ] **Шаг 2: убедиться, что падает, потом написать торг**

Ночь, цены: ложка 2, верёвка 3, мыло 2. Мало монет или день — нет торга.

- [ ] **Шаг 3: тест проходит, записать**

```bash
git add tulenko.bratuxa.zomb.top/src/things.ts tulenko.bratuxa.zomb.top/tests/things.test.js
git commit -m "tulenko: торговец ночью"
```

### Task 4: Второй круг вида

**Файлы:**
- Изменить: `scripts/gen_tulenko.py` (чистые строки, ровный станок)
- Изменить: `tulenko.bratuxa.zomb.top/img/top_shower.png`
- Изменить: `tulenko.bratuxa.zomb.top/img/top_seal_right.png`
- Изменить: `tulenko.bratuxa.zomb.top/img/top_bench.png`

**Берёт:** готовый рисовальщик. **Даёт:** чистые 16 знаков в каждой строке,
ровный край станка.

- [ ] **Шаг 1: вычистить строки и прогнать**

Выполнить: `python3 scripts/gen_tulenko.py`
Ждём: `ALL_OK`, все открываются, 16 на 16, прозрачность есть.

- [ ] **Шаг 2: общий смотр всех верховых глазами и записать**

```bash
git add scripts/gen_tulenko.py tulenko.bratuxa.zomb.top/img/top_shower.png tulenko.bratuxa.zomb.top/img/top_seal_right.png tulenko.bratuxa.zomb.top/img/top_bench.png
git commit -m "tulenko: второй круг вида"
```

### Task 5: Склейка и сдача слоя

**Файлы:**
- Изменить: `tulenko.bratuxa.zomb.top/src/main2.ts` (концовки, торговец)
- Изменить: `tulenko.bratuxa.zomb.top/game.js` (заново)
- Изменить: `tulenko.bratuxa.zomb.top/index.html` (строка помощи про торг)

**Берёт:** всё из задач 1–4. **Даёт:** слой вживую.

- [ ] **Шаг 1: склеить, собрать, проверить**
- [ ] **Шаг 2: смотр в окне: день с концовкой через крючок, торговец глазами**
- [ ] **Шаг 3: строгий спрос адреса и запись**

```bash
git add tulenko.bratuxa.zomb.top/src/main2.ts tulenko.bratuxa.zomb.top/game.js tulenko.bratuxa.zomb.top/index.html
git commit -m "tulenko: слой 3 вживую"
```

### Task 6: Экран во всю страницу

**Файлы:**
- Изменить: `tulenko.bratuxa.zomb.top/index.html` (края, поля)
- Изменить: `tulenko.bratuxa.zomb.top/src/main2.ts` (размер во всё окно)

**Берёт:** подгонку из слоя 1. **Даёт:** поле во всё окно без полей вокруг,
края залиты игрой, кнопки поверх.

- [ ] **Шаг 1: залить окно игрой**

Холст тянется во всё окно с обрезкой краёв (не целой картинкой, а вширь),
страница без отступов, тьма только игровая.

- [ ] **Шаг 2: смотр в окне широко и узко, записать**

```bash
git add tulenko.bratuxa.zomb.top/index.html tulenko.bratuxa.zomb.top/src/main2.ts
git commit -m "tulenko: экран во всю страницу"
```

## Самопроверка плана

- Решённое покрыто: крыша — 1; ворота — 2; торговец — 3; вид — 4; сдача — 5;
  экран — 6.
- Имена одни: `tryRoof`, `tryGate`, `deal`.
- Пустых мест нет.
