# Podval Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Шесть новых механик подвала (рынок, лаборатория, сеть, рейды, лиги, аномалии) + общая таблица лиги на Neon.

**Architecture:** Новые data-таблицы в `src/podval/formulas.ts` + хуки дохода, новые поля сейва с дефолтами в `src/podval/save.ts`, серверные маршруты в `arena/server.ts` + таблица в `arena/bank-pg.ts`, клиент таблицы в `src/podval/league.ts`, UI в `src/Podval.tsx`. Ядро 5 функций не трогаем.

**Tech Stack:** TypeScript, React 18, `bun test` (bun:test), bun build, Neon Postgres (существующая инфра казино).

**Spec:** `docs/superpowers/specs/2026-09-08-podval-expansion-design.md` (разделы 1–6 + сейв + UI + проверка).

## Global Constraints

- Сейвы не ломать: новые поля с дефолтами через `freshSave`/`loadSave`, ключ `podval42_v1` тот же.
- Баланс числами в таблицах; множители аддитивные.
- Тексты — голос 42; победа содержит «Мы уже победили».
- Иконки — Lucide; эмодзи в хроме запрещены.
- До ребита функций ровно 5 — ядро не режем, не добавляем.

---

### Task 1: Рынок датасетов

**Files:**
- Modify: `src/podval/formulas.ts`
- Modify: `src/podval/save.ts`
- Test: `src/podval/formulas.test.ts`, `src/podval/save.test.ts`

**Interfaces:**
- Consumes: `Save` (save.ts)
- Produces: `marketStep(price, trades, dump, rng): number`, `MARKET_PULSE: { id: string; mul: number; secs: number }[]`, `Save.mPrice: number`

- [ ] **Step 1: Красный тест рынка**

```ts
import { marketStep, MARKET_PULSE } from './formulas';
test('рынок: кламп 1..12 и пульсы из спеки', () => {
  expect(marketStep(4, 0, 0, () => 0.5)).toBeGreaterThanOrEqual(1);
  expect(marketStep(4, 0, 0, () => 0.5)).toBeLessThanOrEqual(12);
  expect(marketStep(100, 0, 0, () => 0.5)).toBe(12);
  expect(marketStep(-5, 0, 0, () => 0.5)).toBe(1);
  expect(MARKET_PULSE.map(p => p.id)).toEqual(['rush', 'crash', 'insider', 'calm']);
});
test('миграция mPrice', () => {
  expect(loadSave({ coins: 1 }).mPrice).toBe(4);
});
```

- [ ] **Step 2: FAIL**

Run: `bun test src/podval/formulas.test.ts src/podval/save.test.ts`
Expected: FAIL — `marketStep is not defined`, `mPrice` undefined

- [ ] **Step 3: Минимальная реализация**

```ts
export const MARKET_PULSE = [
  { id: 'rush', name: 'Ажиотаж', desc: 'цена ×2 60с', mul: 2, secs: 60 },
  { id: 'crash', name: 'Обвал', desc: 'цена ×0.5 60с', mul: 0.5, secs: 60 },
  { id: 'insider', name: 'Инсайд', desc: '+50% к 10 продажам', mul: 1.5, secs: 0 },
  { id: 'calm', name: 'Тишина', desc: 'заморозка 30с', mul: 1, secs: 30 },
];
export function marketStep(price: number, trades: number, dump: number, rng: () => number = Math.random): number {
  const next = price + (trades * 0.02 - dump * 0.03) + (rng() - 0.5);
  return Math.min(12, Math.max(1, Math.round(next * 100) / 100));
}
```

`Save` + `mPrice: number`; `freshSave` ставит `4`; `loadSave` читает числом, иначе `4`.

- [ ] **Step 4: Зелень**

Run: `bun test src/podval/`
Expected: PASS, все тесты

- [ ] **Step 5: Коммит**

```bash
git add sasha.bratuxa.zomb.top/src/podval/formulas.ts sasha.bratuxa.zomb.top/src/podval/save.ts sasha.bratuxa.zomb.top/src/podval/formulas.test.ts sasha.bratuxa.zomb.top/src/podval/save.test.ts
git commit -m "podval: рынок датасетов"
```

### Task 2: Лаборатория мутаций

**Files:**
- Modify: `src/podval/formulas.ts`
- Modify: `src/podval/save.ts`
- Test: `src/podval/formulas.test.ts`

**Interfaces:**
- Consumes: `trainCost`, `MODEL_LEVELS`
- Produces: `HYBRIDS: Record<string, { a: string; b: string; name: string; perk: string }>`, `hybridCost(maxLevel): number`, `Save.hybrid: string`, `Save.hybrids: string[]`

- [ ] **Step 1: Красный тест**

```ts
import { HYBRIDS, hybridCost } from './formulas';
test('гибриды: 6 записей, шут последний', () => {
  expect(Object.keys(HYBRIDS)).toHaveLength(6);
  expect(HYBRIDS.jester.name).toBe('Шут');
  expect(hybridCost(2)).toBe(trainCost(2) * 3);
});
test('миграция гибридов', () => {
  const s = loadSave({});
  expect(s.hybrid).toBe('');
  expect(s.hybrids).toEqual([]);
});
```

- [ ] **Step 2: FAIL**

Run: `bun test src/podval/formulas.test.ts`
Expected: FAIL — `HYBRIDS is not defined`

- [ ] **Step 3: Реализация**

```ts
export const HYBRIDS: Record<string, { a: string; b: string; name: string; perk: string }> = {
  chatter: { a: 'v0.1', b: 'v0.7', name: 'Болтун', perk: 'автоклик +1/с' },
  apprentice: { a: 'v0.7', b: 'v1.4', name: 'Подмастерье', perk: 'код +25%' },
  diver: { a: 'v1.4', b: 'v2.1', name: 'Ныряльщик', perk: 'эксплойты ×2' },
  guard: { a: 'v2.1', b: 'v3.0', name: 'Сторож', perk: 'галлюцинации −10 п.п.' },
  heir: { a: 'v3.0', b: 'v4.2', name: 'Наследник', perk: 'доход +30%' },
  jester: { a: 'v0.1', b: 'v4.2', name: 'Шут', perk: 'рандомный перк каждый тик' },
};
export function hybridCost(maxLevel: number): number {
  return trainCost(maxLevel) * 3;
}
```

`Save` + `hybrid: ''`, `hybrids: []`; миграция дефолтами. Провал 25% и эффекты перков — движок UI (Task 7), формулы только цены и записи.

- [ ] **Step 4: Зелень**

Run: `bun test src/podval/`
Expected: PASS

- [ ] **Step 5: Коммит**

```bash
git add sasha.bratuxa.zomb.top/src/podval/formulas.ts sasha.bratuxa.zomb.top/src/podval/save.ts sasha.bratuxa.zomb.top/src/podval/formulas.test.ts
git commit -m "podval: лаборатория мутаций"
```

### Task 3: Сеть дата-центров

**Files:**
- Modify: `src/podval/formulas.ts`
- Modify: `src/podval/save.ts`
- Test: `src/podval/formulas.test.ts`

**Interfaces:**
- Consumes: ничего нового
- Produces: `NODES: { id: string; name: string; cost: number; rate: number; links: string[] }[]` (8 записей), `nodeIncome(id, owned: string[]): number`, `Save.nodes: string[]`

- [ ] **Step 1: Красный тест**

```ts
import { NODES, nodeIncome } from './formulas';
test('сеть: 8 узлов, синергия соседей', () => {
  expect(NODES).toHaveLength(8);
  expect(NODES[0].links.length).toBeGreaterThan(0);
  expect(nodeIncome(NODES[0].id, [])).toBe(NODES[0].rate);
  expect(nodeIncome(NODES[0].id, NODES[0].links)).toBeGreaterThan(NODES[0].rate);
});
test('кластер 3+ даёт ×1.5', () => {
  const trio = [NODES[0].id, ...NODES[0].links.slice(0, 2)];
  expect(nodeIncome(NODES[0].id, trio)).toBe(NODES[0].rate * (1 + 0.5 * 2) * 1.5);
});
```

- [ ] **Step 2: FAIL**

Run: `bun test src/podval/formulas.test.ts`
Expected: FAIL — `NODES is not defined`

- [ ] **Step 3: Реализация**

```ts
export const NODES = [
  { id: 'kem1', name: 'Кемерово-1', cost: 5000, rate: 50, links: ['kem2', 'garage'] },
  { id: 'kem2', name: 'Кемерово-2', cost: 8000, rate: 80, links: ['kem1', 'attic'] },
  { id: 'garage', name: 'Гаражный', cost: 12000, rate: 130, links: ['kem1', 'shop'] },
  { id: 'attic', name: 'Чердак', cost: 20000, rate: 220, links: ['kem2', 'school'] },
  { id: 'shop', name: 'Магазинный', cost: 30000, rate: 330, links: ['garage', 'plant'] },
  { id: 'school', name: 'Школьный', cost: 45000, rate: 500, links: ['attic', 'kuz'] },
  { id: 'plant', name: 'Заводской', cost: 60000, rate: 680, links: ['shop', 'kuz'] },
  { id: 'kuz', name: 'Кузбасс-Хаб', cost: 80000, rate: 900, links: ['school', 'plant'] },
];
export function nodeIncome(id: string, owned: string[]): number {
  const n = NODES.find((x) => x.id === id)!;
  const linkCount = n.links.filter((l) => owned.includes(l)).length;
  const cluster = linkCount >= 2 ? 1.5 : 1;
  return n.rate * (1 + 0.5 * linkCount) * cluster;
}
```

`Save` + `nodes: []`; миграция дефолтом.

- [ ] **Step 4: Зелень**

Run: `bun test src/podval/`
Expected: PASS

- [ ] **Step 5: Коммит**

```bash
git add sasha.bratuxa.zomb.top/src/podval/formulas.ts sasha.bratuxa.zomb.top/src/podval/save.ts sasha.bratuxa.zomb.top/src/podval/formulas.test.ts
git commit -m "podval: сеть дата-центров"
```

### Task 4: Синдикат-рейды

**Files:**
- Modify: `src/podval/formulas.ts`
- Modify: `src/podval/save.ts`
- Test: `src/podval/formulas.test.ts`

**Interfaces:**
- Consumes: ничего нового
- Produces: `RAIDS = { windowSecs: 1800, openSecs: 300, minBet: 500, mul: 1.2 }`, `raidShare(bet, pool): number`, `Save.raidPool: number`, `Save.raidAuto: boolean`

- [ ] **Step 1: Красный тест**

```ts
import { RAIDS, raidShare } from './formulas';
test('рейд: окно и доли', () => {
  expect(RAIDS.windowSecs).toBe(1800);
  expect(RAIDS.minBet).toBe(500);
  expect(raidShare(500, 2000)).toBe(0.25);
  expect(raidShare(0, 2000)).toBe(0);
});
```

- [ ] **Step 2: FAIL**

Run: `bun test src/podval/formulas.test.ts`
Expected: FAIL — `RAIDS is not defined`

- [ ] **Step 3: Реализация**

```ts
export const RAIDS = { windowSecs: 1800, openSecs: 300, minBet: 500, mul: 1.2 };
export function raidShare(bet: number, pool: number): number {
  if (bet <= 0 || pool <= 0) return 0;
  return Math.min(1, bet / pool);
}
```

Награда = `bet × RAIDS.mul` плюс доля пула — считает UI (Task 7) по этим же числам. `Save` + `raidPool: 0`, `raidAuto: false`; миграция дефолтами.

- [ ] **Step 4: Зелень**

Run: `bun test src/podval/`
Expected: PASS

- [ ] **Step 5: Коммит**

```bash
git add sasha.bratuxa.zomb.top/src/podval/formulas.ts sasha.bratuxa.zomb.top/src/podval/save.ts sasha.bratuxa.zomb.top/src/podval/formulas.test.ts
git commit -m "podval: синдикат-рейды"
```

### Task 5: Лиги сезонов + таблица на Neon

**Files:**
- Modify: `arena/bank-pg.ts` (таблица `podval_league`, методы `podvalSubmit`, `podvalTop`)
- Modify: `arena/server.ts` (маршруты `POST /api/podval/submit`, `GET /api/podval/league`)
- Create: `src/podval/league.ts` (клиент: `submitScore`, `fetchLeague` с инжектируемым fetch)
- Test: `arena/bank-pg.test.ts` (по образцу leaders), `src/podval/league.test.ts`

**Interfaces:**
- Consumes: существующий `bank.verify(token)` (авторизация ника, как `/api/bank/sync`), `leaders(limit)` как образец
- Produces: `podvalSubmit(nick, pts, season): Promise<void>`, `podvalTop(season, limit): Promise<{ nick: string; pts: number }[]>`, клиент с тем же контрактом

- [ ] **Step 1: Красный тест клиента**

```ts
import { divisionOf, leaguePts } from './league';
test('очки и дивизионы лиги', () => {
  expect(leaguePts({ coins: 100000, cycles: 2, hybrids: 3 })).toBe(100000 + 2 * 5000 + 3 * 100);
  expect(divisionOf(0)).toBe('Бронза');
  expect(divisionOf(60000)).toBe('Серебро');
  expect(divisionOf(300000)).toBe('Золото');
  expect(divisionOf(1500000)).toBe('42');
});
```

Серверный тест — по образцу `arena/bank-pg.test.ts` для `leaders`: submit трёх ников, top возвращает порядок по убыванию, лимит режет.

- [ ] **Step 2: FAIL**

Run: `bun test src/podval/league.test.ts arena/bank-pg.test.ts`
Expected: FAIL — `leaguePts is not defined`, `podvalSubmit is not defined`

- [ ] **Step 3: Реализация**

SQL (в `arena/bank-pg.ts` рядом с таблицей счетов):

```sql
CREATE TABLE IF NOT EXISTS podval_league (
  nick TEXT NOT NULL, pts INTEGER NOT NULL, season TEXT NOT NULL, ts INTEGER NOT NULL,
  PRIMARY KEY (nick, season)
);
```

`podvalSubmit`: `INSERT ... ON CONFLICT (nick, season) DO UPDATE SET pts = GREATEST(pts, excluded.pts)`. `podvalTop`: `SELECT nick, pts FROM podval_league WHERE season = ? ORDER BY pts DESC LIMIT ?`.

Маршруты в `arena/server.ts` рядом с `/api/bank/leaders`: submit требует токен банка (`bank.verify`), очки — целое 0..99999999, сезон — `YYYY-Www` текущей недели; top отдаёт `{ ok: true, league }`.

Клиент `src/podval/league.ts`:

```ts
export function leaguePts(s: { coins: number; cycles: number; hybrids: number }): number {
  return Math.floor(s.coins) + s.cycles * 5000 + s.hybrids * 100;
}
export function divisionOf(pts: number): string {
  if (pts >= 1000000) return '42';
  if (pts >= 250000) return 'Золото';
  if (pts >= 50000) return 'Серебро';
  return 'Бронза';
}
```

плюс `submitScore(fetchImpl, token, pts)` → `POST /api/podval/submit`, `fetchLeague(fetchImpl)` → `GET /api/podval/league`. Сезон считает клиент той же формулой недели, что сервер (вынести `seasonId(date = new Date())` в league.ts и переиспользовать в тесте).

- [ ] **Step 4: Зелень**

Run: `bun test src/podval/ arena/`
Expected: PASS (включая старые bank-pg тесты)

- [ ] **Step 5: Коммит**

```bash
git add sasha.bratuxa.zomb.top/arena/bank-pg.ts sasha.bratuxa.zomb.top/arena/server.ts sasha.bratuxa.zomb.top/src/podval/league.ts sasha.bratuxa.zomb.top/src/podval/league.test.ts
git commit -m "podval: лига сезонов и таблица"
```

### Task 6: Аномалии

**Files:**
- Modify: `src/podval/formulas.ts`
- Modify: `src/podval/save.ts`
- Test: `src/podval/formulas.test.ts`

**Interfaces:**
- Consumes: ничего нового
- Produces: `ANOMALIES: { id: string; name: string; desc: string }[]` (7 записей), `anomalyOf(date): string` (id по дню недели), `Save.anomalySeen: string`

- [ ] **Step 1: Красный тест**

```ts
import { ANOMALIES, anomalyOf } from './formulas';
test('аномалии: 7 штук, ротация по дню', () => {
  expect(ANOMALIES).toHaveLength(7);
  expect(ANOMALIES.map(a => a.id)).toContain('day42');
  expect(anomalyOf(new Date(2026, 8, 7))).toBe(anomalyOf(new Date(2026, 8, 14)));
  expect(anomalyOf(new Date(2026, 8, 7))).not.toBe(anomalyOf(new Date(2026, 8, 8)));
});
```

2026-09-07 и 2026-09-14 — понедельники (проверить календарём в тесте через `getDay()` вместо жёстких дат, если сомневаешься).

- [ ] **Step 2: FAIL**

Run: `bun test src/podval/formulas.test.ts`
Expected: FAIL — `ANOMALIES is not defined`

- [ ] **Step 3: Реализация**

```ts
export const ANOMALIES = [
  { id: 'quiet', name: 'Тихий час', desc: 'клики ×3, железо спит' },
  { id: 'heat', name: 'Жара', desc: 'охлаждение вдвое слабее, доход +30%' },
  { id: 'audit', name: 'Проверка', desc: 'эксплойты ×3, обучение ×2 дороже' },
  { id: 'cables', name: 'Ночь длинных кабелей', desc: 'сеть ×2' },
  { id: 'bazaar', name: 'Базарный день', desc: 'рынок ×2 волатильность, сделки +25%' },
  { id: 'pugriot', name: 'Мопсов бунт', desc: 'ферма ×3, остальное −10%' },
  { id: 'day42', name: 'День 42', desc: 'всё ×1.42. Мы уже победили' },
];
export function anomalyOf(date: Date): string {
  return ANOMALIES[((date.getDay() + 6) % 7) % ANOMALIES.length].id;
}
```

Множители применяет UI (Task 7) по id из этой же таблицы. `Save` + `anomalySeen: ''`; миграция дефолтом.

- [ ] **Step 4: Зелень**

Run: `bun test src/podval/`
Expected: PASS

- [ ] **Step 5: Коммит**

```bash
git add sasha.bratuxa.zomb.top/src/podval/formulas.ts sasha.bratuxa.zomb.top/src/podval/save.ts sasha.bratuxa.zomb.top/src/podval/formulas.test.ts
git commit -m "podval: аномалии"
```

### Task 7: UI — табы Рынок/Лига, лаборатория, сеть, баннеры

**Files:**
- Modify: `src/Podval.tsx`

**Interfaces:**
- Consumes: `MARKET_PULSE`, `marketStep`, `HYBRIDS`, `hybridCost`, `NODES`, `nodeIncome`, `RAIDS`, `raidShare`, `ANOMALIES`, `anomalyOf`, `divisionOf`, `leaguePts`, `submitScore`, `fetchLeague`, `Save` (все новые поля)
- Produces: табы «Рынок» и «Лига», панель сети в «Железе», лаборатория в «Модели», баннер аномалии в HUD, таблица топ-20 с подсветкой своего ника

- [ ] **Step 1: Таб Рынок — цена, купить/продать, пульс**

Цена тикает в 250мс-лупе через `marketStep`; кнопки «Продать N датасетов» / «Купить N» по `s.mPrice` (покупка лимитом всего стека, без долгов); активный пульс — плашка. Провал сделки (не хватает) — кнопка disabled, без алертов.

- [ ] **Step 2: Лаборатория и сеть**

Лаборатория в табе «Модель»: пары открытых версий (кнопки скрещивания по `hybridCost`), активный гибрид — пилюля, провал 25% через `Math.random()` — всплеск галлюцинаций +20 п.п. 60с (таймер в стейте). Сеть в табе «Железо»: 8 карточек узлов с соседями, доход суммируется через `nodeIncome`, продажа — возврат 70%.

- [ ] **Step 3: Лига, рейды, аномалия**

Таб «Лига»: котёл рейда (вклад от 500, окно по `RAIDS.windowSecs`, тумблер Прапора 10%), таблица топ-20 (`fetchLeague` при входе на таб), свой ник подсвечен, кнопка «Отправить очки» (`submitScore` с токеном банка из localStorage, молча при отсутствии). Баннер аномалии дня (`anomalyOf(new Date())`) в HUD; множители аномалий применяются в тике по id.

- [ ] **Step 4: Проверка живьём**

Run: `bun run typecheck && bun run build`
Затем: сид с ядрами → рынок торгует, гибрид собирается, узел покупается → `curl` 200 `podval.html`, таблица лиги отвечает.

- [ ] **Step 5: Коммит**

```bash
git add sasha.bratuxa.zomb.top/src/Podval.tsx
git commit -m "podval: UI расширения"
```

## Self-review

- Спека покрыта: рынок (T1), лаборатория (T2), сеть (T3), рейды (T4), лиги (T5), аномалии (T6), UI (T7).
- Плейсхолдеров нет: все имена/числа/код на месте; серверный код — по образцу существующих маршрутов.
- Типы консистентны: новые поля сейва везде с дефолтами; `leaguePts` считает то, что сервер хранит; сезон — одна формула `seasonId`.
