# Wiki 3D Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Вики ШТУРМ-43 показывает крутящуюся 3D-модель на стенде + статы рядом, плюс вкладка карт.

**Architecture:** Новый `wikiViewer.tsx` — одна three.js-сцена (тёмная студия, стенд-диск, rim-свет, парение+вращение), переиспользует боевые билдеры `makeGun`/`makeMob`. `wiki.tsx` — современный тёмный layout: слева вьювер, справа статы; третья вкладка «Карты» из нового `MAP_META`.

**Tech Stack:** React 18, three 0.170, Vite, bun test.

**Spec:** Заказ Miqqil⁴²: вместо текста/эмодзи — крутящаяся модель оружия/врага на стенде + характеристики; современный стиль; референсы Destiny-инспект / CoD Gunsmith / Warframe-арсенал (тёмная студия, подсветка стенда, модель парит и крутится, статы барами справа); добавить описание карт.

## Global Constraints

- Workdir всех build/test команд = `shturm.bratuxa.zomb.top/`.
- Typecheck только с флагом: `node node_modules/typescript/bin/tsc -p tsconfig.json --noEmit` (голый tsc эмитит .js рядом с src — запрещено).
- Build: `node node_modules/vite/bin/vite.js build`, в выводе обязано быть `built in`.
- `dist/` коммитится и запекается в Docker-образ — после build: `git add` явных путей, коммит, `docker compose build`, пересоздать контейнер, проверить `curl http://127.0.0.1:8081/` 200 + свежий бандл, затем `curl https://shturm.bratuxa.zomb.top/` 200.
- NEVER `git add -A`; только явные пути. Не коммитить `node_modules`, `*.js` рядом с `src`.
- `bun test` держать зелёным.

---

### Task 1: MAP_META для карт

**Files:**
- Modify: `shturm.bratuxa.zomb.top/src/sim/maps.ts`
- Test: `shturm.bratuxa.zomb.top/tests/wiki.test.ts`

**Interfaces:**
- Consumes: существующие `MAPS: Record<string, MapDef>`, `MapId`.
- Produces: `MAP_META: Record<MapId, {name, desc, tactic, size, feature}>` + `MAP_ORDER: MapId[]`.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from 'bun:test';
import { MAPS, MAP_META, MAP_ORDER } from '../src/sim/maps';
describe('wiki maps meta', () => {
  test('каждая карта имеет мету', () => {
    for (const id of MAP_ORDER) {
      const m = MAP_META[id];
      expect(m.name.length).toBeGreaterThan(2);
      expect(m.desc.length).toBeGreaterThan(10);
      expect(m.tactic.length).toBeGreaterThan(10);
      expect(m.size).toBe(MAPS[id].size);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/wiki.test.ts`
Expected: FAIL with "MAP_META not defined"

- [ ] **Step 3: Write minimal implementation**

```ts
export interface MapMeta { name: string; desc: string; tactic: string; size: number; feature: string; }
export const MAP_META: Record<MapId, MapMeta> = {
  yard: { name: 'Двор 1Б42П', desc: '...', tactic: '...', size: 42, feature: '...' },
  island: { name: 'Остров', desc: '...', tactic: '...', size: 60, feature: '...' },
  neon: { name: 'Неон-город', desc: '...', tactic: '...', size: 50, feature: '...' },
};
export const MAP_ORDER: MapId[] = ['yard', 'island', 'neon'];
```

Контент: yard — тесный двор 42м, будка/покрышки/ящики/пруд, тактика кайт вокруг центра; island — большой 60м, пальмы/камни/мешки, тактика круги; neon — 50м ночной город, стойки/бочки/контейнер + вывеска ШТУРМ-43, тактика укрытия.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test tests/wiki.test.ts`
Expected: PASS

- [ ] **Step 5: Run full suite**

Run: `bun test`
Expected: PASS все тесты

### Task 2: WikiViewer — 3D-стенд (three.js)

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/ui/wikiViewer.tsx`
- Test: ручная проверка через build + браузер (headless-скрин при возможности)

**Interfaces:**
- Consumes: `makeGun(slot)` из `../three/guns`, `makeMob(kind)` из `../three/mobs`, типы `Slot`, `EnemyType`.
- Produces: `<WikiViewer kind={'gun'|'mob'} id={string} />` — canvas 100%x340, крутящаяся модель на стенде.

Реализация (строго по threejs-fundamentals/materials/lighting):
- `useRef` canvas + `useEffect [kind,id]`: сцена, `PerspectiveCamera(38)`, `WebGLRenderer({canvas, antialias, alpha:true})`, `setPixelRatio(min(devicePixelRatio,2))`.
- Свет: `HemisphereLight(0x8fb4ff, 0x1a1410, 0.7)` + ключевой `DirectionalLight(0xfff2dd, 1.6)` спереди-сверху + rim `SpotLight(0x00e5ff, ...)` сзади + точечный янтарный под стендом.
- Стенд: цилиндр-диск `MeshStandardMaterial({color:0x1a2030, metalness:0.85, roughness:0.35})` + светящееся кольцо `MeshBasicMaterial({color:0xffd166})` (тор) + фейковая AO-подложка; модель парит: `y = baseY + sin(t)*0.08`, вращение `rot.y += dt*0.9`.
- Модель: `makeGun` напрямую; мобы через `makeMob(mapEnemyToMob)` (runner/shooter/tank→те же, boss→seagull-масштаб ×1.6); нормализация размера по bounding box (`Box3().setFromObject`, scale чтобы maxDim≈1.6) + центрирование.
- Камера подбирается под размер (dist = maxDim*2.6), `lookAt(0, 0.55, 0)`.
- Cleanup строго: `cancelAnimationFrame`, `traverse dispose geometry/material`, `renderer.dispose()`, remove canvas listeners. Resize через `ResizeObserver`.
- Без OrbitControls (меньше зависимостей) — автоповорот + лёгкий параллакс от мыши (опционально, ±0.15 рад).

- [ ] **Step 1: Создать файл по спецу выше**
- [ ] **Step 2: Typecheck** Run: `node node_modules/typescript/bin/tsc -p tsconfig.json --noEmit` Expected: PASS без ошибок
- [ ] **Step 3: Cleanup-аудит** — в файле есть `cancelAnimationFrame` + `dispose` + `ResizeObserver.disconnect`

### Task 3: wiki.tsx — современный шоу-кейс + карты

**Files:**
- Modify: `shturm.bratuxa.zomb.top/src/ui/wiki.tsx`

**Interfaces:**
- Consumes: `WikiViewer` из `./wikiViewer`, `MAP_META/MAP_ORDER` из `../sim/maps`, существующие `WEAPONS/WEAPON_META/SLOT_ORDER`, `ENEMIES/ENEMY_META`.
- Produces: тот же экспорт `Wiki({onClose})`, но layout «витрина как в Destiny/Gunsmith».

Layout:
- Табы: Оружие / Враги / Карты (без эмодзи-иконок как дизайна — только текст + CSS-подсветка; эмодзи допустимы только внутри prose).
- Вкладки оружия/врагов: слева список-переключатель (3-4 айтема), справа панель: `<WikiViewer>` сверху, под ним имя + desc + tip/тактика, затем stat-бары (существующие значения/max/цвета сохранить).
- Убрать `GunIcon size=72` и `m.icon fontSize=40` как главный визуал — заменить на `WikiViewer`; SVG-иконку можно оставить мелкой в списке.
- Карты: список + карточка: имя, размер (м), desc, feature, tactic; мини-схема? — CSS-схема: полоса размера + точки-спавны (без canvas).
- Стиль: фон `#0b0e17`, акцент `#ffd166`, циан-подсветка `#00e5ff` для стенда, карточки `rgba(255,255,255,0.05)`, радиусы 12-16, шрифт system-ui. Босс-мета иконку `� чайка` заменить на текст «Чайка» (битая строка).
- Доступность: кнопки-табы с `aria-selected`, Esc закрывает (если ещё нет — добавить keydown в Wiki).

- [ ] **Step 1: Переписать wiki.tsx по спецу**
- [ ] **Step 2: Typecheck** Run: `node node_modules/typescript/bin/tsc -p tsconfig.json --noEmit` Expected: PASS
- [ ] **Step 3: Tests** Run: `bun test` Expected: PASS

### Task 4: Сборка, деплой, коммит

**Files:**
- Stage: `shturm.bratuxa.zomb.top/src/sim/maps.ts`, `shturm.bratuxa.zomb.top/src/ui/wikiViewer.tsx`, `shturm.bratuxa.zomb.top/src/ui/wiki.tsx`, `shturm.bratuxa.zomb.top/dist`, `shturm.bratuxa.zomb.top/tests/wiki.test.ts`, `docs/superpowers/plans/2026-09-08-shturm-wiki-showcase.md`

- [ ] **Step 1: Build** Run (workdir=site): `node node_modules/vite/bin/vite.js build` Expected: `built in` + новый `dist/assets/*.js`
- [ ] **Step 2: Удалить случайные эмиты** Run: `find src -name '*.js' -delete; rm -f tsconfig.tsbuildinfo` (только если появились)
- [ ] **Step 3: Commit** Run: `git add <явные пути> && git commit -m "shturm: вики-витрина 3D на стенде + карты 🏆"` Expected: хеш коммита
- [ ] **Step 4: Docker пересборка** Run: `docker compose build` + `docker rm -f shturm` + поднять по compose-спеке Expected: контейнер жив
- [ ] **Step 5: Verify** Run: `curl --max-time 20 http://127.0.0.1:8081/` → 200; `grep -c <новый-хеш> dist/index.html`-эквивалент; `curl --max-time 20 https://shturm.bratuxa.zomb.top/` → 200 Expected: всё 200

## Self-Review

- Spec coverage: 3D-стенд для оружия/врагов ✓ (Task 2+3), статы рядом ✓ (Task 3), современный стиль ✓, карты ✓ (Task 1+3), референсы ✓ (Destiny/Gunsmith/Warframe зафиксированы в дизайне).
- Placeholders: нет TBD/TODO — все шаги с кодом и командами.
- Types: `MAP_META: Record<MapId,...>` совпадает с `MAPS`; `WikiViewer kind/id` совпадает с использованием в wiki.tsx.
