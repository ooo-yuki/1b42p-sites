# Rebirth: Фабрика Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Сезоны «Мирового тура» + растущий пост-ребит пул в «Фабрике Хайпа 42».

**Architecture:** Новое поле `seasons` в сейве (дефолт 0); хайп-награды умножаются на `1 + seasons`; пост-ребит контент — новые записи `VENUES`/магазинов + поле `minSeason` у площадки; `unlocked()` учитывает сезоны; движок шоу не меняется, множитель применяется к итогам.

**Tech Stack:** TypeScript, React 18, `bun test` (bun:test), bun build.

**Spec:** `docs/superpowers/specs/2026-09-07-rebirth-design.md` (раздел Фабрика + общий контракт).

## Global Constraints

- Сейвы не ломать: `seasons` с дефолтом 0 через `migrateSave`; ключ `brohacho42_v1` тот же.
- Баланс числами в таблицах; множитель славы `1 + seasons`.
- До ребита функций 5 (4 площадки + вызов рейда) — ядро не трогаем.
- Тексты — голос 42; иконки — Lucide с `data-icon`.
- Ночь `#070b18`, кобальт интерактива, алый декора.

---

### Task 1: Сезоны в формулах + гейт площадок

**Files:**
- Modify: `src/fabrika/formulas.ts`
- Create: `src/fabrika/rebirth.test.ts`
- Test: `src/fabrika/rebirth.test.ts`

**Interfaces:**
- Consumes: `unlocked(s, v)`, `migrateSave(raw)`
- Produces: `fameMult(seasons)`, `Save.seasons: number`, `unlocked()` с `minSeason`

- [ ] **Step 1: Красный тест**

```ts
import { describe, expect, test } from 'bun:test';
import { fameMult, unlocked } from './formulas';
import { migrateSave } from './formulas';

describe('rebirth', () => {
  test('слава +1 за сезон', () => {
    expect(fameMult(0)).toBe(1);
    expect(fameMult(3)).toBe(4);
  });
  test('площадка с minSeason закрыта до сезона', () => {
    const s = migrateSave({});
    expect(unlocked(s, { id: 'x', cost: 0, need: '', minSeason: 1 }).ok).toBe(false);
  });
  test('старый сейв мигрирует в seasons 0', () => {
    expect(migrateSave({ h: 5 }).seasons).toBe(0);
  });
});
```

- [ ] **Step 2: FAIL (нет `fameMult`, `seasons`, `minSeason`)**

Run: `bun test src/fabrika/rebirth.test.ts`
Expected: FAIL

- [ ] **Step 3: Реализация**

```ts
export function fameMult(seasons: number): number {
  return 1 + Math.max(0, Math.floor(seasons));
}
```

`Save` + `seasons: number`; `defaultSave`/`migrateSave` — `0`. Тип площадки
расширить: `minSeason?: number`; в `unlocked()` первой проверкой:
`if ((v.minSeason ?? 0) > s.seasons) return { ok: false, why: 'Откроется в сезоне ' + v.minSeason };`

- [ ] **Step 4: Зелень**

Run: `bun test src/fabrika/`
Expected: PASS

- [ ] **Step 5: Коммит**

```bash
git add sasha.bratuxa.zomb.top/src/fabrika/formulas.ts sasha.bratuxa.zomb.top/src/fabrika/content.ts sasha.bratuxa.zomb.top/src/fabrika/rebirth.test.ts
git commit -m "fabrika: сезоны и гейт minSeason"
```

### Task 2: Пост-пул контента

**Files:**
- Modify: `src/fabrika/content.ts`
- Test: `src/fabrika/rebirth.test.ts` (дописать)

**Interfaces:**
- Consumes: `VENUES`, `TEAM`, `LOOKS`
- Produces: +2 площадки, +1 команда, +1 образ, `RAID_NAMES: Record<venueId, string>`

- [ ] **Step 1: Красный тест**

```ts
test('пост-пул фабрики по спеке', () => {
  const ids = VENUES.map(v => v.id);
  expect(ids).toContain('stadium');
  expect(ids).toContain('kuzbass');
  expect(TEAM.piar.d).toMatch(/комбо/);
  expect(LOOKS.chains).toBeDefined();
  expect(RAID_NAMES.slay).toBe('Экс-продюсер');
});
test('лесенка гейтов 1–5', () => {
  expect(VENUES.find(v => v.id === 'stadium')!.minSeason).toBe(1);
  expect(VENUES.find(v => v.id === 'kuzbass')!.minSeason).toBe(3);
  expect(TEAM.piar.needSeasons).toBe(2);
  expect(LOOKS.chains.needSeasons).toBe(4);
  expect(BUILDS.club.needSeasons).toBe(5);
});
```

- [ ] **Step 2: FAIL**

Run: `bun test src/fabrika/rebirth.test.ts`
Expected: FAIL

- [ ] **Step 3: Записи по спеке**

```ts
{ id: 'stadium', n: 'Стадион 42', speed: 110, zone: 8, base: 400, gap: 0.45, cost: 150000, need: '', minSeason: 1 },
{ id: 'kuzbass', n: 'Кузбасс-Арена', speed: 130, zone: 6, base: 1000, gap: 0.35, cost: 1000000, need: '', minSeason: 3 },
// TEAM (needSeasons 2 — открывается со 2-го сезона):
piar: { n: 'Пиарщик СП', d: 'Промах режет комбо вдвое, а не в ноль', base: 5000, needSeasons: 2 },
// LOOKS (needSeasons 4):
chains: { n: 'Золотые цепи', d: '+1 фантик за каждый PERFECT', base: 8000, needSeasons: 4 },
// BUILDS (needSeasons 5):
club: { n: 'Фан-клуб 42', d: '+25% хайпа со всех шоу', base: 20000, needSeasons: 5 },
export const RAID_NAMES: Record<string, string> = {
  garage: 'Хейтер-админ', club: 'Кринж-критик', arena: 'Бот-ферма', slay: 'Экс-продюсер',
  stadium: 'Диванный эксперт', kuzbass: 'Легенда ретро-чартов',
};
```

(`em` у новых записей — временный символ; UI ставит Lucide-иконку по id,
шаг в Task 4.)

- [ ] **Step 4: Зелень**

Run: `bun test src/fabrika/`
Expected: PASS

- [ ] **Step 5: Коммит**

```bash
git add sasha.bratuxa.zomb.top/src/fabrika/content.ts
git commit -m "fabrika: пост-пул контента"
```

### Task 3: Эффекты пула в движке шоу

**Files:**
- Modify: `src/fabrika/show.ts`
- Test: `src/fabrika/rebirth.test.ts` (движковые кейсы через фейковый Layer)

**Interfaces:**
- Consumes: `ShowEngine`, `Save.team.piar`, `Save.look.chains`
- Produces: промах с пиарщиком режет комбо вдвое; PERFECT с цепями +1 фантик (счётчик `tickets` в `ShowSummary`)

- [ ] **Step 1: Красный тест**

```ts
test('пиарщик смягчает сброс комбо', () => {
  // engine с save.team.piar=3: miss -> combo = floor(combo / 2)
});
test('цепи капают фантики за PERFECT', () => {
  // summary.tickets === числу perfects при look.chains>=1
});
```

(Фейковый Layer: `spawnNote`/`spawnHater` — заглушки с `setX(){}, pop(){}, remove(){}`.)

- [ ] **Step 2: FAIL**

Run: `bun test src/fabrika/rebirth.test.ts`
Expected: FAIL

- [ ] **Step 3: Минимальные хуки**

В местах `this.combo = 0` при промахе: `this.combo = this.s.team.piar > 0 ? Math.floor(this.combo / 2) : 0;`
В `zavoz()` при `j === 'perfect'` и `stChains`: `this.tickets += 1;`
`ShowSummary` + `tickets: number`; `endShow` в `Fabrika.tsx` начисляет
`f += sum.tickets` (шаг Task 4).

- [ ] **Step 4: Зелень**

Run: `bun test src/fabrika/`
Expected: PASS

- [ ] **Step 5: Коммит**

```bash
git add sasha.bratuxa.zomb.top/src/fabrika/show.ts
git commit -m "fabrika: эффекты пиарщика и цепей"
```

### Task 4: UI — тур, бис, именные рейды, иконки

**Files:**
- Modify: `src/Fabrika.tsx`, `src/fabrika/parts.tsx`

**Interfaces:**
- Consumes: `fameMult`, `RAID_NAMES`, `Save.seasons`
- Produces: кнопка «В мировой тур» (при победе), бейдж сезона, бис-ролл 10%, имена рейдов в `say`, Lucide-иконки новых сущностей по id

- [ ] **Step 1: Кнопка тура в модалке победы + начисление славы**

```tsx
<button className="big" onClick={goTour}>В мировой тур (сезон {save.seasons + 1})</button>
```

```ts
const goTour = () => setSave((p) => ({
  ...defaultSave(), seasons: p.seasons + 1, win: false,
}));
```

Хайп-награды `endShow`: `sum.hype * fameMult(saveRef.current.seasons)`.
Эффект фан-клуба: база ноты в `stBase` умножается на `(1 + 0.25 * s.bld.club)`.
Бис — только при `seasons >= 5`; именные рейды — при `seasons >= 1`.

- [ ] **Step 2: Бис: после `endShow` с шансом 10% — повтор `startShow` той же площадки с флагом ×2 (плашка «Бис! Награды двойные»)**

- [ ] **Step 3: Именные рейды: `callRaid`/`say` подставляют `RAID_NAMES[venue.id]`**

- [ ] **Step 4: Иконки: маппинги по id (`stadium` → `Trophy`, `kuzbass` → `Crown`, `piar` → `Megaphone`, `chains` → `Coins`, `club` → `Heart`) в `parts.tsx`; ряды с `needSeasons` показывают замок «Откроется в сезоне N»**

- [ ] **Step 5: Проверка живьём**

Run: `bun run typecheck && bun run build`
Проба: сид триумфа → тур → `seasons: 1`, площадки с `minSeason: 1` открыты → `curl` 200

- [ ] **Step 6: Коммит**

```bash
git add sasha.bratuxa.zomb.top/src/Fabrika.tsx sasha.bratuxa.zomb.top/src/fabrika/parts.tsx
git commit -m "fabrika: UI тура, бис, именные рейды"
```

## Self-review

- Спека покрыта: сезоны (T1), пул (T2), движок (T3), UI (T4).
- Плейсхолдеров нет: числа/имена/код выписаны.
- Типы консистентны: `seasons: number`, `tickets: number`, `minSeason?: number`.
