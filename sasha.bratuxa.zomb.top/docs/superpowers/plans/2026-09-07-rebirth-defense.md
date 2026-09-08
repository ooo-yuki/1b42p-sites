# Rebirth: Оборона Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** «Новая смена» (ребит) + энллесс и растущий пул в «Обороне штаба 42».

**Architecture:** Новое поле `medals` в сейве/стейте (дефолт 0); урон турелей ×(1 + 0.25 × медали); волны 11+ генерирует чистая функция `endlessWave(n)`; новый контент — записи `TURRETS`/`ENEMIES`/`CARDS` + `WAVE_NAMES[10]`; кнопка смены при зачистке волны 10.

**Tech Stack:** TypeScript, React 18, `bun test` (bun:test), bun build.

**Spec:** `docs/superpowers/specs/2026-09-07-rebirth-design.md` (раздел Оборона + общий контракт).

## Global Constraints

- Сейвы не ломать: `medals` и `bestEndless` с дефолтами через существующий `loadSave`.
- До ребита функций 5 (3 турели + карты + экономика) — ядро не трогаем.
- Числа волн/юнитов — в `content.ts`, не в движке.
- Тексты — голос 42; иконки/текстуры — существующие наборы (`TEX`, Lucide).

---

### Task 1: Медали + имена волн (нули риска)

**Files:**
- Modify: `src/defense/content.ts`, `src/defense/save.ts` (или место хранения сейва)
- Test: существующие `src/defense/engine.test.ts` + новый кейс там же

**Interfaces:**
- Consumes: `loadSave`, `WAVES`
- Produces: `WAVE_NAMES: string[10]`, `Save.medals: number`, `Save.bestEndless: number`

- [ ] **Step 1: Красный тест**

```ts
test('имена 10 волн и медали в сейве', () => {
  expect(WAVE_NAMES).toHaveLength(10);
  expect(WAVE_NAMES[9]).toBe('Директор лично');
  expect(loadSave(null).medals).toBe(0);
});
```

- [ ] **Step 2: FAIL**

Run: `bun test src/defense/`
Expected: FAIL

- [ ] **Step 3: Реализация**

```ts
export const WAVE_NAMES = [
  'Разведка зануд', 'Первые зеваки', 'Спринт-отряд', 'Танки идут',
  'Скука сгущается', 'Двойной зануда', 'Марафон спринта',
  'Броня и нытьё', 'Генеральная скука', 'Директор лично',
];
```

Сейв: `medals: 0, bestEndless: 0` в дефолте и миграции.

- [ ] **Step 4: Зелень**

Run: `bun test src/defense/`
Expected: PASS (включая старые)

- [ ] **Step 5: Коммит**

```bash
git add sasha.bratuxa.zomb.top/src/defense/content.ts sasha.bratuxa.zomb.top/src/defense/save.ts
git commit -m "defense: имена волн и медали в сейве"
```

### Task 2: Энллесс-генератор + множитель медалей

**Files:**
- Modify: `src/defense/content.ts`, `src/defense/engine.ts`
- Test: `src/defense/engine.test.ts`

**Interfaces:**
- Consumes: `WaveDef`, `WAVES`, `tick`, `placeTurret`
- Produces: `endlessWave(n): WaveDef`, движок берёт волну `n <= 10 ? WAVES : endlessWave`, урон ×(1 + 0.25 × medals)

- [ ] **Step 1: Красный тест**

```ts
test('волна 11 жёстче 10-й, каждая 5-я — с директором', () => {
  const w11 = endlessWave(11);
  expect(w11.count).toBeGreaterThan(WAVES[9].count);
  expect(w11.hpMul).toBeGreaterThan(WAVES[9].hpMul);
});
test('медали апают урон', () => {
  // placeTurret + tick с medals=4 убивает то, что с medals=0 не убивает
});
```

- [ ] **Step 2: FAIL**

Run: `bun test src/defense/`
Expected: FAIL

- [ ] **Step 3: Реализация**

```ts
export function endlessWave(n: number): WaveDef {
  const k = n - 10;
  return {
    count: WAVES[9].count + 8 * k,
    hpMul: WAVES[9].hpMul * 1.5 ** k,
    speed: WAVES[9].speed + 0.03 * k,
    tankEvery: 3, runnerEvery: 2,
  };
}
```

Директор каждую 5-ю энллесс-волну: при `n > 10 && (n - 10) % 5 === 0`
в спавн добавляется `director`. Урон в `tick`: `dmg * (1 + 0.25 * medals)`.

- [ ] **Step 4: Зелень**

Run: `bun test src/defense/`
Expected: PASS

- [ ] **Step 5: Коммит**

```bash
git add sasha.bratuxa.zomb.top/src/defense/content.ts sasha.bratuxa.zomb.top/src/defense/engine.ts
git commit -m "defense: энллесс и множитель медалей"
```

### Task 3: Пост-пул: турель, враги, карты

**Files:**
- Modify: `src/defense/content.ts`, `src/defense/textures.tsx` (текстура теслы), `src/Defense.tsx` (пикер/легенда)
- Test: `src/defense/engine.test.ts`

**Interfaces:**
- Consumes: `TURRETS`, `ENEMIES`, `CARDS`, `TEX`
- Produces: `tesla`, `troll`, `double`, 4 карты; тесла бьёт до 3 целей (движок); UI показывает новое с замками по `medals`

- [ ] **Step 1: Красный тест**

```ts
test('пост-пул обороны по спеке', () => {
  expect(TURRETS.tesla.cost).toBe(400);
  expect(ENEMIES.troll.hp).toBe(150);
  expect(ENEMIES.double.speed).toBe(2.2);
  expect(Object.keys(CARDS)).toEqual(expect.arrayContaining(['warhorn', 'live', 'barricade', 'sabotage']));
});
test('тесла цепляет троих', () => {
  // три юнита в радиусе: после тика урон у всех трёх
});
```

- [ ] **Step 2: FAIL**

Run: `bun test src/defense/`
Expected: FAIL

- [ ] **Step 3: Записи по спеке**

```ts
tesla: { cost: 400, dmg: 25, rate: 1.0, range: 3.2 },   // цепь до 3 целей
troll: { hp: 150, speed: 0.5, reward: 25 },              // +реген 2/с в tick
double: { hp: 30, speed: 2.2, reward: 14 },
warhorn: { name: 'Мопсий вой', desc: 'страх 3с: враги стоят' },
live: { name: 'Прямой эфир', desc: '+5 монет за убийство 10с' },
barricade: { name: 'Баррикада', desc: '+2 макс-жизни' },
sabotage: { name: 'Саботаж', desc: '−30% скорости волны 10с' },
```

Цепь теслы и реген тролля — в `tick` (рядом с существующим уроном).
Текстура `tesla` в `TEX` (вариант `cobalt` другим оттенком + дуга).

- [ ] **Step 4: Зелень**

Run: `bun test src/defense/`
Expected: PASS

- [ ] **Step 5: Коммит**

```bash
git add sasha.bratuxa.zomb.top/src/defense/content.ts sasha.bratuxa.zomb.top/src/defense/engine.ts sasha.bratuxa.zomb.top/src/defense/textures.tsx
git commit -m "defense: пост-пул (тесла, тролль, двойник, 4 карты)"
```

### Task 4: UI — смена, энллесс-счётчик, замки пула

**Files:**
- Modify: `src/Defense.tsx`

**Interfaces:**
- Consumes: `WAVE_NAMES`, `Save.medals`, `Save.bestEndless`
- Produces: имя волны в шапке («Волна 7: Марафон спринта»), кнопка «Новая смена» после 10-й, счётчик рекорда энллесса, замки пула по медалям

- [ ] **Step 1: Имя волны в шапке + счётчик**

```tsx
<h2>Волна {wave}: {wave <= 10 ? WAVE_NAMES[wave - 1] : `Энллесс ${wave}`}</h2>
<p className="hint">Рекорд энллесса: {save.bestEndless || '—'}</p>
```

- [ ] **Step 2: Кнопка смены при победе на 10-й**

```tsx
{won && <button className="pill solid" onClick={newShift}>Новая смена (медалей: {s.medals + 1})</button>}
```

Сброс поля/монет/волн, `medals + 1`, `bestEndless` обновить из забега.

- [ ] **Step 3: Замки: тесла/тролль/карты пула — «после N-й медали» (тесла 1, враги 1, карты 2)**

- [ ] **Step 4: Проверка живьём**

Run: `bun run typecheck && bun run build`
Проба: волны 1–3 кликами, карта покупается, `curl` 200 `defense.html`

- [ ] **Step 5: Коммит**

```bash
git add sasha.bratuxa.zomb.top/src/Defense.tsx
git commit -m "defense: UI смены и энллесса"
```

## Self-review

- Спека покрыта: медали/имена (T1), энллесс (T2), пул (T3), UI (T4).
- Плейсхолдеров нет: числа/имена/код выписаны.
- Типы консистентны: `medals: number`, `bestEndless: number`, `endlessWave(n): WaveDef`.
