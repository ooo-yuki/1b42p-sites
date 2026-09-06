# Баланс ШТУРМ-43 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Герой живучее (160 HP), чуть быстрее (4.6/7.8), банки на карте (+50), атаки мобов короче.

**Architecture:** Чистый сим (`player.ts`, `enemies.ts`, новый `pickups.ts`) считает цифры — тесты `bun:test` их фиксируют. `main.tsx` только проводка: пикап в тике, визуал банок, дальности из таблицы. TDD: сначала красный тест, потом код.

**Tech Stack:** TypeScript, bun:test, three.js (визуал банок), vite build.

**Spec:** `docs/superpowers/specs/2026-09-06-shturm-balance-spec.md`

## Global Constraints

- `bun test` зелёный до и после каждого таска.
- `bun run typecheck` чистый перед коммитом.
- `dist/` коммитится (бандл запечён в docker-образ `shturm-43:latest`).
- Коммиты: префикс `shturm:`, одна строка, эмодзи в конце.
- Комменты и UI-тексты по-русски; эмодзи только в тексте.
- В `git add` только свои пути, никогда bare `git add -A`.
- Хуки `window.__shturm` безвредны и остаются в проде.

---

### Task 1: HP и скорость героя

**Files:**
- Modify: `shturm.bratuxa.zomb.top/src/sim/player.ts`
- Modify: `shturm.bratuxa.zomb.top/src/game/store.ts`
- Modify: `shturm.bratuxa.zomb.top/src/main.tsx` (кап дропа `Math.min(100, ...)` → `MAX_HP`; `pushHud` добавить `maxHp: MAX_HP`)
- Test: `shturm.bratuxa.zomb.top/tests/balance.test.ts`

**Interfaces:**
- Consumes: ничего нового.
- Produces: `MAX_HP = 160`, `WALK_SPEED = 4.6`, `SPRINT_SPEED = 7.8` из `src/sim/player.ts` (импортируют Task 4 и store).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from 'bun:test';
import { createPlayer, movePlayer, MAX_HP, WALK_SPEED, SPRINT_SPEED } from '../src/sim/player';
describe('баланс: герой', () => {
  test('HP 160, минимум 4 удара танка (40)', () => {
    expect(MAX_HP).toBe(160);
    expect(createPlayer().hp).toBe(160);
    expect(Math.floor(MAX_HP / 40)).toBeGreaterThanOrEqual(4);
  });
  test('шаг 4.6 / спринт 7.8', () => {
    expect(WALK_SPEED).toBeCloseTo(4.6, 6);
    expect(SPRINT_SPEED).toBeCloseTo(7.8, 6);
    const p = createPlayer();
    movePlayer(p, { fwd: 1, strafe: 0, sprint: false, dt: 1 }, 1);
    expect(Math.hypot(p.vx, p.vz)).toBeCloseTo(4.6, 6);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/balance.test.ts`
Expected: FAIL with "Cannot find module '../src/sim/player' export MAX_HP" (импорта нет — красное).

- [ ] **Step 3: Write minimal implementation**

```ts
export const MAX_HP = 160;
export const WALK_SPEED = 4.6;
export const SPRINT_SPEED = 7.8;
export interface PlayerState { x: number; z: number; vx: number; vz: number; hp: number; stamina: number; yaw: number; }
export interface InputState { fwd: number; strafe: number; sprint: boolean; dt: number; }
export function createPlayer(): PlayerState { return { x: 0, z: 0, vx: 0, vz: 0, hp: MAX_HP, stamina: 43, yaw: 0 }; }
```

В `movePlayer` заменить `const speed = wantSprint ? 7 : 4;` на `const speed = wantSprint ? SPRINT_SPEED : WALK_SPEED;`.

В `src/game/store.ts`: `import { MAX_HP } from '../sim/player';`, initial `hp: MAX_HP, maxHp: MAX_HP`.

В `src/main.tsx`: импорт `MAX_HP`; `p.hp = Math.min(MAX_HP, p.hp + 25)`; в `pushHud` добавить `maxHp: MAX_HP`.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test`
Expected: PASS, весь сьют зелёный (старый `player.test.ts` тоже: спринт 7.8 > 4.5).

- [ ] **Step 5: Commit**

```bash
git add shturm.bratuxa.zomb.top/src/sim/player.ts shturm.bratuxa.zomb.top/src/game/store.ts shturm.bratuxa.zomb.top/src/main.tsx shturm.bratuxa.zomb.top/tests/balance.test.ts
git commit -m "shturm: HP 160 и скорость 4.6/7.8 🏆"
```

---

### Task 2: Дальности атак мобов в таблицу

**Files:**
- Modify: `shturm.bratuxa.zomb.top/src/sim/enemies.ts`
- Modify: `shturm.bratuxa.zomb.top/src/main.tsx` (`d < 25` → таблица; `reach` → таблица)
- Test: `shturm.bratuxa.zomb.top/tests/balance.test.ts` (дописать блок)

**Interfaces:**
- Consumes: ничего.
- Produces: `ATTACK_RANGE = { shooter: 18, melee: 1.3, tank: 2.5, boss: 3.0 }` из `src/sim/enemies.ts` (импортирует Task 4).

- [ ] **Step 1: Write the failing test** (дописать в `tests/balance.test.ts`)

```ts
import { ATTACK_RANGE } from '../src/sim/enemies';
describe('баланс: дальности', () => {
  test('шутер и мили урезаны', () => {
    expect(ATTACK_RANGE.shooter).toBe(18);
    expect(ATTACK_RANGE.melee).toBe(1.3);
    expect(ATTACK_RANGE.tank).toBe(2.5);
    expect(ATTACK_RANGE.boss).toBe(3.0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/balance.test.ts`
Expected: FAIL, нет экспорта `ATTACK_RANGE`.

- [ ] **Step 3: Write minimal implementation**

В `src/sim/enemies.ts` добавить:

```ts
export const ATTACK_RANGE = { shooter: 18, melee: 1.3, tank: 2.5, boss: 3.0 };
```

В `src/main.tsx`: импорт `ATTACK_RANGE`; `if (d < 25 && e.cd <= 0)` → `if (d < ATTACK_RANGE.shooter && e.cd <= 0)`; `const reach = e.type === 'tank' ? 3 : e.type === 'boss' ? 3.5 : 1.6;` → `const reach = e.type === 'tank' ? ATTACK_RANGE.tank : e.type === 'boss' ? ATTACK_RANGE.boss : ATTACK_RANGE.melee;`.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test`
Expected: PASS полностью.

- [ ] **Step 5: Commit**

```bash
git add shturm.bratuxa.zomb.top/src/sim/enemies.ts shturm.bratuxa.zomb.top/src/main.tsx shturm.bratuxa.zomb.top/tests/balance.test.ts
git commit -m "shturm: дальности мобов в таблицу 🏆"
```

---

### Task 3: Банки — чистый сим + тесты

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/sim/pickups.ts`
- Test: `shturm.bratuxa.zomb.top/tests/pickups.test.ts`

**Interfaces:**
- Consumes: `MAPS`, `resolveCircle`, `MapId` из `src/sim/maps.ts`.
- Produces: `Medkit { x, z, taken, t }`, `MEDKIT_HEAL = 50`, `MEDKIT_RADIUS = 1.3`, `MEDKIT_RESPAWN = 25`, `spawnPickups(map: MapId): Medkit[]`, `updatePickups(list, px, pz, dt): number` (возвращает суммарный хил за тик; использует Task 4).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from 'bun:test';
import { spawnPickups, updatePickups, MEDKIT_HEAL, MEDKIT_RESPAWN } from '../src/sim/pickups';
describe('банки', () => {
  test('3 банки на карту, вне препятствий (yard)', () => {
    const list = spawnPickups('yard');
    expect(list.length).toBe(3);
    for (const m of list) {
      expect(Math.hypot(m.x, m.z)).toBeLessThan(20);
      expect(Math.hypot(m.x - 0, m.z - 0)).toBeGreaterThan(2.5);
    }
  });
  test('подбор хилит 1 раз + респаун 25с', () => {
    const list = spawnPickups('yard');
    const m = list[0];
    expect(updatePickups(list, m.x, m.z, 0.016)).toBe(MEDKIT_HEAL);
    expect(m.taken).toBe(true);
    expect(updatePickups(list, m.x, m.z, 0.016)).toBe(0);
    expect(updatePickups(list, m.x + 99, m.z, MEDKIT_RESPAWN)).toBe(0);
    expect(m.taken).toBe(false);
    expect(updatePickups(list, m.x, m.z, 0.016)).toBe(MEDKIT_HEAL);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/pickups.test.ts`
Expected: FAIL with "Cannot find module '../src/sim/pickups'".

- [ ] **Step 3: Write minimal implementation** (`src/sim/pickups.ts`)

```ts
import { resolveCircle, type MapId } from './maps';
export interface Medkit { x: number; z: number; taken: boolean; t: number; }
export const MEDKIT_HEAL = 50;
export const MEDKIT_RADIUS = 1.3;
export const MEDKIT_RESPAWN = 25;
const SPOTS: Record<MapId, Array<[number, number]>> = {
  yard: [[-14, -14], [14, -14], [0, 16]],
  island: [[-20, 0], [20, 0], [0, -20]],
  neon: [[-15, 15], [15, -15], [0, 0]],
};
export function spawnPickups(map: MapId): Medkit[] {
  return SPOTS[map].map(([x, z]) => {
    const pos = { x, z };
    resolveCircle(pos, 1.0, map);
    return { x: pos.x, z: pos.z, taken: false, t: 0 };
  });
}
export function updatePickups(list: Medkit[], px: number, pz: number, dt: number): number {
  let healed = 0;
  for (const m of list) {
    if (m.taken) {
      m.t -= dt;
      if (m.t <= 0) { m.taken = false; m.t = 0; }
    } else if (Math.hypot(m.x - px, m.z - pz) < MEDKIT_RADIUS) {
      m.taken = true; m.t = MEDKIT_RESPAWN; healed += MEDKIT_HEAL;
    }
  }
  return healed;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test`
Expected: PASS полностью.

- [ ] **Step 5: Commit**

```bash
git add shturm.bratuxa.zomb.top/src/sim/pickups.ts shturm.bratuxa.zomb.top/tests/pickups.test.ts
git commit -m "shturm: банки-аптечки в симе 🏆"
```

---

### Task 4: Проводка банок в игру (тик + визуал + хуки)

**Files:**
- Modify: `shturm.bratuxa.zomb.top/src/main.tsx`

**Interfaces:**
- Consumes: `MAX_HP` (Task 1), `spawnPickups`, `updatePickups`, `Medkit` (Task 3).
- Produces: банки в кадре и в тике; `meds` в `__shturm.dbg()` для приёмки Task 5.

- [ ] **Step 1: Импорт и состояние сима**

```ts
import { spawnPickups, updatePickups, type Medkit } from './sim/pickups';
```

В объект `sim` добавить поле `pickups: [] as Medkit[],` (после `enemies`).

- [ ] **Step 2: Спавн в `startGame` и визуал**

После `scene.add(mapGroup);` в `startGame` добавить:

```ts
sim.pickups = spawnPickups(mapId);
rebuildMedkitVisuals();
```

Модульный визуал (рядом с `mapGroup`, общие геометрия/материалы — без аллокаций на банку):

```ts
const medGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const medBoxMat = new THREE.MeshStandardMaterial({ color: 0x0a7a3a, emissive: 0x00c853, emissiveIntensity: 0.7, roughness: 0.4 });
const medCrossMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5, roughness: 0.4 });
let medkitGroup: THREE.Group | null = null;
function rebuildMedkitVisuals() {
  if (medkitGroup) scene.remove(medkitGroup);
  medkitGroup = new THREE.Group();
  sim.pickups.forEach((m, i) => {
    const g = new THREE.Group();
    g.position.set(m.x, 0.6, m.z);
    g.userData.i = i;
    const box = new THREE.Mesh(medGeo, medBoxMat);
    g.add(box);
    for (const s of [1, -1]) {
      const h = new THREE.Mesh(medGeo, medCrossMat);
      h.scale.set(0.6, 0.2, 0.1); h.position.z = 0.26 * s; g.add(h);
      const v = new THREE.Mesh(medGeo, medCrossMat);
      v.scale.set(0.2, 0.6, 0.1); v.position.z = 0.26 * s; g.add(v);
    }
    medkitGroup!.add(g);
  });
  scene.add(medkitGroup);
}
```

- [ ] **Step 3: Пикап в тике** (после `resolveCircle(p, 0.4, mapId);` в `tick`)

```ts
const healed = updatePickups(sim.pickups, p.x, p.z, dt);
if (healed > 0) {
  p.hp = Math.min(MAX_HP, p.hp + healed);
  pushHud(`Аптечка +${healed} 🏥`);
}
```

- [ ] **Step 4: Анимация в кадре** (в `step`, рядом с `tracers.update(dt)`)

```ts
if (medkitGroup) {
  const t = now / 1000;
  medkitGroup.children.forEach((g) => {
    const m = sim.pickups[g.userData.i];
    g.visible = !m.taken;
    g.position.y = 0.6 + Math.sin(t * 2 + g.userData.i) * 0.12;
    g.rotation.y += dt * 1.2;
  });
}
```

- [ ] **Step 5: Счётчик в `dbg`** (для приёмки Task 5)

В объект `__shturm` в поле `dbg` добавить `meds: sim.pickups.filter((m) => !m.taken).length`.

- [ ] **Step 6: Проверка**

Run: `bun test` — PASS; `bun run typecheck` — чисто; `bun run build` — ок.

- [ ] **Step 7: Commit**

```bash
git add shturm.bratuxa.zomb.top/src/main.tsx
git commit -m "shturm: банки в бою — тик и визуал 🏆"
```

---

### Task 5: Финальная верификация и деплой

**Files:** Пробы в `/tmp` (не коммитятся). Коммит: `dist/` после `bun run build`.

- [ ] **Step 1: Полный сьют и типы**

Run: `bun test` (ожидаю 50+ pass, 0 fail), `bun run typecheck` (чисто).

- [ ] **Step 2: Билд**

Run: `bun run build`. Ожидаю `dist/assets/index-<hash>.js`, `dist/index.html` ссылается на него.

- [ ] **Step 3: Браузер-приёмка** (стенд: `python3 -m http.server`, playwright-core, `executablePath: '/usr/local/bin/chromium'`, флаги `--use-gl=angle --use-angle=swiftshader --in-process-gpu`)

  - `start('yard','veteran')` + `god(true)` + `fire(true)`: страница без `pageerror`.
  - Камера-регрессия: `setYaw` 0/90/180/−90 → `roll` 0 везде (старый фикс не сломан).
  - Банка: `meds` 3 → `tp(-14,-14)` → `meds` 2 и сообщение «Аптечка +50»; скрин `shturm-medkit.png` глянуть глазами (зелёный крест, герой рядом).
  - Шутер-дальность: `wave(2)` пережить 20 с на месте с `god(false)`? Нет — оставить god, дальность покрыта юнит-тестом Task 2. В браузере только отсутствие регрессий.
  - Скрин 3-го лица и 1-го лица для eyeball-финала.

- [ ] **Step 4: Коммит dist**

```bash
git add shturm.bratuxa.zomb.top/dist/index.html shturm.bratuxa.zomb.top/dist/assets/<новый>.js
git rm -q --cached shturm.bratuxa.zomb.top/dist/assets/<старый>.js
git commit -m "shturm: билд баланса 🏆"
```

- [ ] **Step 5: Деплой**

```bash
docker compose build && docker rm -f shturm; docker compose up -d
curl -s https://shturm.bratuxa.zomb.top/ | grep -o 'assets/index-[A-Za-z0-9]*\.js'
```

Ожидаю: новый хэш бандла в проде, HTTP 200. Только после этого — «готово».

---

## Self-Review

1. **Покрытие спека:** п.1 (HP) → Task 1; п.2 (скорость) → Task 1; п.3 (банки) → Task 3 (сим) + Task 4 (бой); п.4 (дальности) → Task 2; верификация → Task 5. Пробелов нет.
2. **Плейсхолдеры:** числовые литералы только там, где значение определено задачей выше (`MAX_HP` в кап дропа Task 1; `ATTACK_RANGE` в Task 2; константы банок в Task 3). «TBD/TODO» нет.
3. **Консистентность типов:** `Medkit`/`spawnPickups`/`updatePickups` одинаковы в Task 3 и Task 4; `MAX_HP`/`ATTACK_RANGE` — в Task 1/2 и Task 4; `meds` добавляется в существующий `dbg`. `step(now)` и `dt` в Task 4 существуют в `main.tsx`.
