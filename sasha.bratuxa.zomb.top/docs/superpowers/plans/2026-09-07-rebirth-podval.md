# Rebirth: Подвал Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Престиж «Перезапуск матрицы» + растущий пост-ребит пул в «Нейросети в подвале».

**Architecture:** Новое поле `cycles` в сейве (дефолт 0); доход умножается на `1 + 0.5 * cycles`; пост-ребит контент — data-таблицы `PRESTIGE_HARDWARE` и `EVENTS`, движок читает их наряду с базовыми; кнопка ребита видна только при `isVictory`.

**Tech Stack:** TypeScript, React 18, `bun test` (bun:test), bun build.

**Spec:** `docs/superpowers/specs/2026-09-07-rebirth-design.md` (раздел Подвал + общий контракт).

## Global Constraints

- Сейвы не ломать: `cycles` добавляется в `freshSave`/`loadSave` с дефолтом 0, старые сейвы мигрируют молча.
- Баланс числами в таблицах; множитель ядер аддитивный `1 + 0.5 * cycles`.
- Тексты — голос 42; победа/ребит содержат «Мы уже победили».
- Иконки — Lucide; эмодзи в хроме запрещены.
- До ребита функций ровно 5 (клик, железо, обучение, охлаждение, эксплойты) — не режем, не добавляем.

---

### Task 1: Ядра в формулах + миграция сейва

**Files:**
- Modify: `src/podval/formulas.ts`
- Modify: `src/podval/save.ts`
- Test: `src/podval/formulas.test.ts`, `src/podval/save.test.ts`

**Interfaces:**
- Consumes: `incomePerSec(ml, vuln, hall)`, `freshSave()`, `loadSave(raw)`
- Produces: `coreMult(cycles)`, `incomePerSec(ml, vuln, hall, cycles = 0)`, `Save.cycles: number`

- [ ] **Step 1: Красный тест множителя и миграции**

```ts
import { describe, expect, test } from 'bun:test';
import { coreMult } from './formulas';
import { freshSave, loadSave } from './save';

describe('rebirth', () => {
  test('ядра дают +50% аддитивно', () => {
    expect(coreMult(0)).toBe(1);
    expect(coreMult(2)).toBe(2);
  });
  test('старый сейв без cycles мигрирует в 0', () => {
    expect(loadSave({ coins: 5 }).cycles).toBe(0);
    expect(freshSave().cycles).toBe(0);
  });
});
```

- [ ] **Step 2: Запустить, увидеть FAIL (нет `coreMult`, нет `cycles`)**

Run: `bun test src/podval/formulas.test.ts src/podval/save.test.ts`
Expected: FAIL — `coreMult is not defined`, `cycles` undefined

- [ ] **Step 3: Минимальная реализация**

```ts
export function coreMult(cycles: number): number {
  return 1 + 0.5 * Math.max(0, Math.floor(cycles));
}
```

`incomePerSec` принимает `cycles = 0` и умножает итог на `coreMult(cycles)`.
`Save` получает `cycles: number`; `freshSave` ставит `0`; `loadSave` читает
`cycles` числом, иначе `0`.

- [ ] **Step 4: Зелень**

Run: `bun test src/podval/`
Expected: PASS, все тесты

- [ ] **Step 5: Коммит**

```bash
git add sasha.bratuxa.zomb.top/src/podval/formulas.ts sasha.bratuxa.zomb.top/src/podval/save.ts
git commit -m "podval: ядра ребита + миграция сейва"
```

### Task 2: Пост-ребит железо и события (таблицы)

**Files:**
- Modify: `src/podval/formulas.ts`
- Test: `src/podval/formulas.test.ts`

**Interfaces:**
- Consumes: `HardwareTier`, `hardwareCost`, `coreMult`
- Produces: `PRESTIGE_HARDWARE: HardwareTier[]` (2 записи), `EVENTS: GameEvent[]` (4 записи), `eventPick(rng): GameEvent`

```ts
export interface GameEvent {
  id: string; name: string; desc: string;
  incomeMul: number; priceMul: number; drain: number; secs: number;
}
```

- [ ] **Step 1: Красный тест контента**

```ts
test('пост-пул: 2 железа и 4 события с числами из спеки', () => {
  expect(PRESTIGE_HARDWARE.map(h => h.id)).toEqual(['quantum', 'kuzbass']);
  expect(PRESTIGE_HARDWARE[0].rate).toBe(600);
  expect(EVENTS.map(e => e.id)).toEqual(['blackout', 'zavoz', 'pug', 'night']);
  expect(EVENTS[0].incomeMul).toBe(0.5);
});
```

- [ ] **Step 2: FAIL (нет таблиц)**

Run: `bun test src/podval/formulas.test.ts`
Expected: FAIL

- [ ] **Step 3: Таблицы по спеке**

```ts
export const PRESTIGE_HARDWARE: HardwareTier[] = [
  { id: 'quantum', name: 'Квантовый чайник', desc: 'Шумит в суперпозиции', base: 40000, growth: 2.0, rate: 600 },
  { id: 'kuzbass', name: 'Дата-ЦОД «Кузбасс»', desc: 'Гудит на весь регион', base: 250000, growth: 2.1, rate: 3500 },
];
export const EVENTS: GameEvent[] = [
  { id: 'blackout', name: 'Отрубили свет', desc: '−50% дохода 30с', incomeMul: 0.5, priceMul: 1, drain: 0, secs: 30 },
  { id: 'zavoz', name: 'Завоз с барахолки', desc: '−30% цен 60с', incomeMul: 1, priceMul: 0.7, drain: 0, secs: 60 },
  { id: 'pug', name: 'Мопс погрыз кабель', desc: '−10% датасетов сразу', incomeMul: 1, priceMul: 1, drain: 0.1, secs: 0 },
  { id: 'night', name: 'Ночной тариф', desc: '+50% дохода 60с', incomeMul: 1.5, priceMul: 1, drain: 0, secs: 60 },
];
export function eventPick(rng: () => number = Math.random): GameEvent {
  return EVENTS[Math.floor(rng() * EVENTS.length)];
}
```

- [ ] **Step 4: Зелень**

Run: `bun test src/podval/`
Expected: PASS

- [ ] **Step 5: Коммит**

```bash
git add sasha.bratuxa.zomb.top/src/podval/formulas.ts
git commit -m "podval: пост-ребит железо и события"
```

### Task 3: UI — кнопка ребита, витрина пула, плашка событий

**Files:**
- Modify: `src/Podval.tsx`

**Interfaces:**
- Consumes: `isVictory`, `coreMult`, `PRESTIGE_HARDWARE`, `EVENTS`, `Save.cycles`
- Produces: кнопка «Перезапустить матрицу» (только при победе), счётчик ядер, ряды пула (замок по `cycles`), плашка активного события

- [ ] **Step 1: Кнопка ребита: при `isVictory` видна; клик — сброс всего кроме `cycles + 1`, сейв цел**

```tsx
{isVictory(s.model, s.coins) && (
  <button className="pill solid" onClick={rebirth}>
    Перезапустить матрицу (ядер: {s.cycles} → {s.cycles + 1})
  </button>
)}
```

```ts
const rebirth = () => setS((p) => ({ ...freshSave(), cycles: p.cycles + 1 }));
```

- [ ] **Step 2: Ряды пула с замками (`needCycles`: чайник 1, события 1, ЦОД 2, разгон 2, ферма 3, бред 3)**

Ряд рисуется всегда; если `s.cycles < need` — замок «Откроется после N-го ребита».

- [ ] **Step 3: События: тик `setInterval` 150с ± 60с, только при `cycles >= 1`; плашка с обратным отсчётом; `drain` режет датасеты сразу**

- [ ] **Step 4: Проверка живьём**

Run: `bun run typecheck && bun run build`
Затем проба: сид победы → кнопка видна → клик → `cycles: 1`, ресурсы нули → `curl` 200 `podval.html`

- [ ] **Step 5: Коммит**

```bash
git add sasha.bratuxa.zomb.top/src/Podval.tsx
git commit -m "podval: UI ребита и пост-пула"
```

## Self-review

- Спека покрыта: ядра (T1), таблицы (T2), UI (T3).
- Плейсхолдеров нет: все имена/числа/код на месте.
- Типы консистентны: `cycles: number` везде; `GameEvent` определён до использования.
