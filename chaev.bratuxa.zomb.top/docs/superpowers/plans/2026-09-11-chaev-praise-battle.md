# Батл хвалы Чаева Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Страница «Батл хвалы Чаева» на chaev.bratuxa.zomb.top: батл 1 на 1 (60 сек), одиночная хвала, топ в браузере.

**Architecture:** Чистый модуль счёта `src/battle/scoring.ts` (без React, тестируется vitest) + компонент `src/components/PraiseBattle.tsx` (3 вкладки, таймер, localStorage-топ) + одна строка в `src/App.tsx`.

**Tech Stack:** React 18, TypeScript, vitest, localStorage.

**Spec:** `/root/sites/chaev.bratuxa.zomb.top/docs/superpowers/specs/2026-09-11-chaev-praise-battle-design.md`

## Global Constraints

- Словарь хороших слов (~40), повтор: 10/5/2/0.
- Ругань (~20 слов): −15 за каждое, в минус уходить можно (пола нет).
- Батл: 60 секунд, пишут одновременно, побеждает большее число очков.
- Топ хранится в браузере (localStorage).
- Отвечать в треде с тегом [greasger⁴³|игра Чаева], просто по-русски.

---

## Файлы

- Create: `src/battle/scoring.ts` — словари + `scoreText(text): number` + `countHits(text): {good: Record<string,number>, bad: number}`.
- Create: `src/battle/top.ts` — `loadTop(): TopRow[]`, `addToTop(name, score): TopRow[]`, ключ `chaev_praise_top_v1`.
- Create: `tests/battle.test.ts` — vitest-тесты счёта и топа.
- Create: `src/components/PraiseBattle.tsx` — компонент с 3 вкладками.
- Modify: `src/App.tsx` — добавить `<PraiseBattle />` после `<Hype />`.

---

### Task 1: Модуль счёта

**Files:**
- Create: `src/battle/scoring.ts`
- Test: `tests/battle.test.ts` (шаги 1–2 только создают каркас теста, полный тест — в шаге 4)

**Interfaces:**
- Consumes: ничего.
- Produces: `scoreText(text: string): number`, `GOOD_WORDS: string[]`, `BAD_WORDS: string[]` (используют Task 3 и тесты).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from 'vitest';
import { scoreText } from '../src/battle/scoring';

describe('счёт хвалы', () => {
  it('легенда легенда легенда → 10+5+2=17', () => {
    expect(scoreText('легенда легенда легенда')).toBe(17);
  });
  it('оскорбление даёт −15', () => {
    expect(scoreText('легенда дурак')).toBe(-5);
  });
  it('в минус уходить можно', () => {
    expect(scoreText('дурак дурак')).toBe(-30);
  });
  it('новое хорошее слово всегда 10', () => {
    expect(scoreText('легенда лучший добрый')).toBe(30);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/battle.test.ts`
Expected: FAIL with "Failed to resolve import ../src/battle/scoring"

- [ ] **Step 3: Write minimal implementation**

```ts
export const GOOD_WORDS: string[] = [
  'легенда', 'лучший', 'лучшая', 'добрый', 'щедрый', 'умный', 'красивый',
  'великий', 'могучий', 'честный', 'смелый', 'храбрый', 'мудрый', 'талант',
  'гений', 'герой', 'титан', 'мастер', 'профи', 'красавчик', 'красавец',
  'молодец', 'уважаю', 'обожаю', 'восхищаюсь', 'горжусь', 'верю', 'поддерживаю',
  'сила', 'мощь', 'честь', 'слава', 'победа', 'чемпион', 'король', 'богатырь',
  'атлет', 'добряк', 'душка', 'солнце',
];

export const BAD_WORDS: string[] = [
  'дурак', 'лох', 'тупой', 'идиот', 'дебил', 'кретин', 'урод',
  'ничтожество', 'слабак', 'трус', 'жадный', 'злой', 'глупый', 'бездарь',
  'позор', 'отстой', 'дно', 'мудак', 'придурок', 'балбес',
];

const GOOD_POINTS = [10, 5, 2, 0];

function wordsOf(text: string): string[] {
  return text.toLowerCase().replace(/[^а-яёa-z\s]/gi, ' ').split(/\s+/).filter(Boolean);
}

export function scoreText(text: string): number {
  const ws = wordsOf(text);
  const seen = new Map<string, number>();
  let score = 0;
  for (const w of ws) {
    if (GOOD_WORDS.includes(w)) {
      const n = seen.get(w) ?? 0;
      score += GOOD_POINTS[Math.min(n, GOOD_POINTS.length - 1)] ?? 0;
      seen.set(w, n + 1);
    } else if (BAD_WORDS.includes(w)) {
      score -= 15;
    }
  }
  return score;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/battle.test.ts`
Expected: PASS (4 passed)

- [ ] **Step 5: Commit**

```bash
git add src/battle/scoring.ts tests/battle.test.ts
git commit -m "feat(chaev): скоринг хвалы 10/5/2/0 и ругань −15"
```

---

### Task 2: Топ в браузере

**Files:**
- Create: `src/battle/top.ts`
- Test: `tests/battle.test.ts` (append)

**Interfaces:**
- Consumes: ничего.
- Produces: `loadTop(): TopRow[]`, `addToTop(name: string, score: number): TopRow[]` (использует Task 3).

- [ ] **Step 1: Write the failing test (append to tests/battle.test.ts)**

```ts
import { addToTop, loadTop } from '../src/battle/top';

describe('топ хвалы', () => {
  it('копит очки по имени и сортирует вниз', () => {
    localStorage.clear();
    addToTop('Брат1', 30);
    addToTop('Брат2', 50);
    addToTop('Брат1', 10);
    expect(loadTop()).toEqual([
      { name: 'Брат2', score: 50 },
      { name: 'Брат1', score: 40 },
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/battle.test.ts`
Expected: FAIL with "Failed to resolve import ../src/battle/top"

- [ ] **Step 3: Write minimal implementation (`src/battle/top.ts`)**

```ts
export interface TopRow { name: string; score: number; }

const KEY = 'chaev_praise_top_v1';

export function loadTop(): TopRow[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as TopRow[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function addToTop(name: string, score: number): TopRow[] {
  const rows = loadTop();
  const nick = name.trim().slice(0, 16) || 'Безымянный';
  const ex = rows.find((r) => r.name === nick);
  if (ex) ex.score += score;
  else rows.push({ name: nick, score });
  rows.sort((a, b) => b.score - a.score);
  const top = rows.slice(0, 20);
  try { localStorage.setItem(KEY, JSON.stringify(top)); } catch { /* приватный режим */ }
  return top;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/battle.test.ts`
Expected: PASS (5 passed)

- [ ] **Step 5: Commit**

```bash
git add src/battle/top.ts tests/battle.test.ts
git commit -m "feat(chaev): топ хвалы в localStorage"
```

---

### Task 3: Компонент с 3 вкладками

**Files:**
- Create: `src/components/PraiseBattle.tsx`
- Modify: `src/App.tsx` (одна строка импорта + одна строка `<PraiseBattle />` после `<Hype />`)

**Interfaces:**
- Consumes: `scoreText` из Task 1, `loadTop`/`addToTop` из Task 2.
- Produces: компонент по умолчанию `PraiseBattle` (рендерит App).

- [ ] **Step 1: Write the component (`src/components/PraiseBattle.tsx`)**

Требования к компоненту (проверяются вручную в браузере, шаг 3):
- Вкладки: «⚔️ Батл 1 на 1» | «🌟 Хвалить» | «🏆 Топ».
- Батл: два текстовых поля (Игрок 1, Игрок 2) + кнопка «Погнали 60 сек». Тикает обратный отсчёт. Счёт считается живьём через `scoreText`. По истечении — победитель + кнопка «Ещё раз».
- Одиночная: поле имени + поле хвалы + кнопка «В топ!». Считает `scoreText`, кладёт через `addToTop`, показывает набранные очки.
- Топ: список `loadTop()` (имя — очки), обновляется при открытии вкладки.
- Стиль: инлайн-стили, тёмный фон как у сайта, крупные кнопки для телефона.

- [ ] **Step 2: Wire into App (`src/App.tsx`)**

```tsx
import PraiseBattle from './components/PraiseBattle';
// ... после <Hype />:
<PraiseBattle />
```

- [ ] **Step 3: Manual browser check**

Run: `npm run dev`, открыть страницу, проверить: батл 60 сек заканчивается победой большего счёта; одиночная кладёт в топ; топ переживает перезагрузку. Ошибок в консоли нет.

- [ ] **Step 4: Build + full tests**

Run: `npx vitest run` then `npm run build`
Expected: все тесты PASS, сборка без ошибок.

- [ ] **Step 5: Commit**

```bash
git add src/components/PraiseBattle.tsx src/App.tsx
git commit -m "feat(chaev): батл хвалы 1 на 1 + одиночная + топ"
```
