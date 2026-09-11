# London Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Процедурный приватный Лондон 170×170 вместо Szeged: генератор `tools/build-london.py` печёт меш+атлас+солиды в формате szeged-mesh-3, движок/сервер/gate не меняются (кроме deck-флага, имени London и спавна).

**Architecture:** Один детерминированный генератор (seed 42, только PIL+stdlib) собирает город из хелперов (коробка/октаэдр/плоскость) в готовые JSON; текстуры — curated + `tools/london-tex/` (image_generate, иначе процедурки); тесты читают JSON и проверяют геометрию/проходимость.

**Tech Stack:** Python 3 + PIL (bake), Bun + bun:test, TypeScript (движок), Three.js r160.

**Spec:** `docs/superpowers/specs/2026-09-11-london-map-design.md`

## Global Constraints

- Workdir `/root/sites`; ветка master; коммиты только явными путями, префикс `mtt:`; БЕЗ dist (сборка — координатор); БЕЗ `git add -A`.
- Bun: `/root/.bun/bin/bun`; проверки: `bun test tests/london-*.test.ts tests/szeged-*.test.ts` + `bun run typecheck` (tsc --noEmit, 0 ошибок).
- MapId `szeged` внутри НЕ переименовывать (gate/сервер/меню-фильтры untouched); display name → `London`.
- Формат выхода генератора — байт-в-байт схема szeged-mesh-3: `{"format":"szeged-mesh-3","positions":[],"normals":[],"colors":[],"uv":[],"pos_index":[],"nor_index":[],"col_index":[],"atlas":"szeged-atlas.jpg","unresolved":[],"proc":[],"atlas_h":H,"core_rect":[x0,x1,z0,z1],"atlas_tiles":{}}`; uv — пары на угол в координатах атласа (flipY-инверт как в bake: `vv = 1-(ry+(1-v)*h)/H`); солиды `[{x,z,hx,hz,h}]` + опционально `"deck":true`; спавн `tools/szeged-spawn.json {"x","z"}`.
- Атлас: ширина 2048, тайлы ≤512, паддинг 16 + edge-extend 2, JPEG ≤1.5МБ (механизм уже был в bake-szeged.py — скопировать логику, не изобретать).
- Исходники фото Szeged (`tools/szeged-src/`) НЕ использовать; curated (`tools/szeged-curated/`) + процедурки + `tools/london-tex/` (коммитится).
- Приватность: gate/server/меню не трогать (регресс: старые szeged-gate тесты зелёные).

---

### Task 1: Генератор + улицы + дома-коробки + площадь

**Files:**
- Create: `tools/build-london.py`
- Create: `tools/london-tex/.gitkeep` (текстуры — задача 4)
- Modify: никакие
- Test: `tests/london-layout.test.ts`

**Interfaces:**
- Consumes: формат szeged-mesh-3 (см. выше), солиды с deck-флагом (движок уже умеет: `solidHit` пропускает верх, `deck` — проход снизу; `groundAt` — опора).
- Produces: `src/assets/szeged.mesh.json`, `src/assets/szeged.solids.json`, `src/assets/szeged-atlas.jpg`, `tools/szeged-spawn.json`; хелперы `add_box/add_tri` внутри генератора; отчёт `/tmp/london-t1-report.md` (CLI, seed, цифры).

**Layout (детерминирован, seed 42):**
- Поле 170×170 (x,z ∈ [-85,85]); half движок посчитает сам (bbox/2+10 ≈ 95).
- Канал вдоль X: z ∈ [-4,4], вода — синяя плоскость y=-0.5 (бокс 170×8, верх -0.5, tint синий 0.25,0.45,0.75, solid НИЗКИЙ h=0 чтобы не мешал? вода — только меш, без солида; берега — стенки канала h=1 вдоль z=±4).
- Улицы: сетка с шагом ~30м, ширина 6м (узкие переулки 4м — минимум 3 штуки); площадь 40×40 центр (0,-45).
- Дома-коробки: ≥24, ширина 10–16м, глубина 8–12м, высота 9–15м; фасад на дом `mi % 4` из curated (wall1-4), боковые стены — тот же фасад (дом цельный); крыши СКАТНЫЕ (призма, черепица cur-roof) — декор, не deck.
- Брусчатка улиц: плоские плиты y=0 (пока процедурный асфальт; брусчатка — задача 4, замена одной строкой через NEW-тег в коде: `STREET_TILE = PROC_ASPH  # task4: pavement`).

- [ ] **Step 1: Скелет генератора с хелперами и пустым выходом**

```python
# tools/build-london.py: add_box(cx, cy, cz, sx, sy, sz, tile, tint, uvscale) кладёт 12 tris (2 на грань) с нормалями наружу и planar-UV по доминантной оси (как _box_uv: 1 тайл/sv метров, sv с пропорцией фото); add_tri(p1, p2, p3, tile, tint, uvscale) — один треугольник; солиды — add_solid(x, z, hx, hz, h, deck=False).
```

- [ ] **Step 2: Тест layout (падает — файлов нет)**

```typescript
import { expect, test } from 'bun:test';
import mesh from '../src/assets/szeged.mesh.json';
import solids from '../src/assets/szeged.solids.json';
test('london: поле 170 и бюджет', () => {
  expect(mesh.format).toBe('szeged-mesh-3');
  const xs = (mesh.positions as number[]).filter((_, i) => i % 3 === 0);
  const zs = (mesh.positions as number[]).filter((_, i) => i % 3 === 2);
  expect(Math.max(...xs) - Math.min(...xs)).toBeLessThanOrEqual(180);
  expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(150);
  expect((solids as unknown[]).length).toBeLessThanOrEqual(2000);
});
```

Run: `export PATH=/root/.bun/bin:$PATH; bun test tests/london-layout.test.ts`
Expected: FAIL (модуль не найден).

- [ ] **Step 3: Генератор целиком (улицы, канал, площадь, ≥24 домов)**

Реализовать хелперы + layout + атлас (curated + процедурки: скопировать `_proc_tile/_proc_pick/box_uv/packing` логику из `tools/bake-szeged.py`, curated-загрузку оттуда же) + солиды (стены домов цельными боксами! двери — задача 2) + спавн `tools/szeged-spawn.json` (свободная точка у площади, алгоритм из bake `recommended_spawn`) + print-учёт.

Run: `python3 tools/build-london.py --seed 42`
Expected: меш/солиды/атлас/спавн созданы, коридор-примитив: скрипт сам проверяет BFS? Нет — только печать bbox/солидов.

- [ ] **Step 4: Тесты зелёные**

Run: `export PATH=/root/.bun/bin:$PATH; bun test tests/london-layout.test.ts tests/szeged-gate.test.ts`
Expected: PASS.

- [ ] **Step 5: Коммит**

```bash
git add tools/build-london.py tools/london-tex/.gitkeep src/assets/szeged.mesh.json src/assets/szeged.solids.json src/assets/szeged-atlas.jpg tools/szeged-spawn.json tests/london-layout.test.ts
git commit -m 'mtt: London-1 — генератор, улицы, канал, дома-коробки 🇬🇧'
```

Отчёт: `/tmp/london-t1-report.md` (CLI, bbox, солиды, спавн, сомнения). Сюда вернуть: DONE + коммит + проверки одной строкой + сомнения. Ревью не запускать, суб-агентов не диспатчить.

---

### Task 2: Интерьеры + лестницы + балконы + террасы

**Files:**
- Modify: `tools/build-london.py` (комнаты, ступени, deck)
- Test: `tests/london-interior.test.ts`

**Interfaces:**
- Consumes: хелперы и layout задачи 1 (читать её отчёт `/tmp/london-t1-report.md`).
- Produces: обновлённые JSON; отчёт `/tmp/london-t2-report.md`.

**Требования:**
- ≥6 домов с интерьером: стены комнаты из боксов С РАЗРЫВОМ 2м (дверь); внутри пол (плос
...[truncated 6154 chars]
