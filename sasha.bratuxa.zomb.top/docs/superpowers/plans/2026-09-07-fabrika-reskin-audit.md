# Fabrika reskin + full audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Фабрика Хайпа живёт в мире Саши ⁴² (кобальт/алый/серебро, пилюли, Lucide), все страницы проверены скринами, богатые сейвы не ломают вёрстку, баги найдены и починены.

**Architecture:** Токены фабрики переводятся на палитру Саши (интерактив — кобальт, акценты/уровни — алый, ночь/панели — #070b18/#0d1428); движок (content/formulas/show/save/audio) не трогается, сейв-ключ тот же; хром на shadcn-семантике (Tabs+Card+Badge+Button, ToggleGroup не нужен), иконки Lucide с data-icon.

**Tech Stack:** React 18, gsap 3.12 (только победа-поп с cleanup), lucide-react, shadcn-компоненты Саши, bun build, playwright-пробы.

**Spec:** DESIGN.md (ночь #070b18, без золота, без вложенных карточек, без эмодзи вместо иконок, пилюли 999px, tabular-nums), PRODUCT.md (фантики святы, сейвы не ломать, «Мы уже победили»), surface brief minigames (Operate, зал автоматов, новая игра = запись в реестре).

## Global Constraints

- Сейв-ключ `brohacho42_v1` и форма Save не меняются; мёрж через migrateSave.
- Баланс движка (скорости, зоны, цены ×3, WIN_GOAL 420000) не меняется.
- Золото выведено из палитры; исключение только dataviz-цвета различий.
- Эмодзи в хроме запрещены (Lucide); игровые ноты/хейтеры — Lucide-иконки (Ticket/Skull/Angry).
- Пилюли 999px; цифры — tabular-nums; focus-visible; reduced-motion глушит всё.
- Проверка живьём: curl 200 + DOM-дамп; скрины врут — DOM правит.
- Коммит и пуш в `origin master` после задачи.

---

### Task 1: TDD — тест реестра фабрики

**Files:**
- Modify: `src/minigames/registry.test.ts`
- Test: `src/minigames/registry.test.ts`

**Interfaces:**
- Consumes: `listGames()` из `src/minigames/registry.ts`
- Produces: падающий→зелёный тест на запись fabrika (offline, боевая, href fabrika.html)

- [ ] **Step 1: Прочитать текущий тест и дописать кейс фабрики**

```ts
it('фабрика зарегистрирована как боевая офлайн-игра', () => {
  const g = getGame('fabrika');
  expect(g).toBeDefined();
  expect(g!.href).toBe('fabrika.html');
  expect(g!.mode).toBe('offline');
  expect(g!.test).toBe(false);
});
```

- [ ] **Step 2: Запустить и увидеть зелень (запись уже есть — тест фиксирует контракт)**

Run: `bun test src/minigames/registry.test.ts`
Expected: PASS, 8 тестов

- [ ] **Step 3: Коммит теста**

```bash
git add sasha.bratuxa.zomb.top/src/minigames/registry.test.ts
git commit -m "sasha42: тест реестра фабрики"
```

### Task 2: Рескин fabrika.css в мир Саши

**Files:**
- Modify: `src/fabrika.css`

**Interfaces:**
- Consumes: токены DESIGN.md (#0060AA, #E31E25, #808080, #FFFFFF, #070b18, #0d1428)
- Produces: `--gold→--blue` интерактив, `--pink→--red` уровни, ночь Саши, скролл-фикс, selection/focus/scrollbar

- [ ] **Step 1: Заменить токены и все употребления (золото→кобальт, розовый→алый, фон/панель/текст — ночь Саши)**
- [ ] **Step 2: Убрать вложенные карточки (venue-row/shop-item — плоские ряды с разделителями)**
- [ ] **Step 3: Дописать browser surfaces (selection, focus-visible, scrollbar, tabular-nums)**
- [ ] **Step 4: typecheck + build, curl 200**

### Task 3: Хром на Lucide + shadcn-семантика

**Files:**
- Modify: `src/Fabrika.tsx`, `src/fabrika/parts.tsx`, `src/fabrika/ShowStage.tsx`

**Interfaces:**
- Consumes: `@/components/ui/*` (tabs? tunnel: свои кнопки с data-slot), `lucide-react`
- Produces: табы/пилюли/кнопки/магазин/площадки без эмодзи; ноты Ticket, рейд Skull, хейтер Angry; gsap-поп с cleanup

- [ ] **Step 1: parts.tsx — иконки ресурсов/площадок/товаров (Flame, Ticket, Users, Zap, Warehouse, Tent, Trophy, Mic, Shirt, Sparkles, Dumbbell...)**
- [ ] **Step 2: Fabrika.tsx — Tabs-семантика (TabsList/TabsTrigger с data-state), Dialog-семантика победы, gsap cleanup**
- [ ] **Step 3: ShowStage.tsx — ноты/хейтеры Lucide, aria-labels, тексты без эмодзи в хроме**
- [ ] **Step 4: typecheck + build**

### Task 4: Пробы богатых сейвов + скрины всех страниц

**Files:**
- Create: `probes/fabrika-rich.mjs` (throwaway, удалить после)

**Interfaces:**
- Consumes: живые `fabrika.html`, `minigames.html` через playwright
- Produces: скрины desktop+mobile: фабрика (4 таба, шоу, победа), мини-игры, главная, игра, казино, стата, арена, подвал, терминал, оборона, dvd, тапочек

- [ ] **Step 1: Сиды localStorage (fresh / mid / rich-max / win) через addInitScript до goto**
- [ ] **Step 2: click→settle→read по табам и ЗАВОЗ; DOM-дампы; скрины последними**
- [ ] **Step 3: Разобрать дефекты, завести баги в Task 5**

### Task 5: Багфикс-батч

- [ ] **Step 1: Починить найденное одним батчем**
- [ ] **Step 2: Переснять только упавшие виды (макс. 1 круг)**
- [ ] **Step 3: typecheck + build + тесты**

### Task 6: Финиш

- [ ] **Step 1: requesting-code-review проход вручную (статскан, типчек, саморевью)**
- [ ] **Step 2: Коммит + пуш, честные цифры (wc -l, тесты, скрины)**
