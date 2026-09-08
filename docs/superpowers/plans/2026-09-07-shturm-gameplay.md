# Shturm: прыжки/приседы, коллизии пропсов, графика карт — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Игрок прыгает (Space) и приседает (C/Ctrl + кнопки на таче), ящики/покрышки/камни/стойки/пруд держат (низкие перепрыгиваются), все 3 карты выглядят богаче.

**Architecture:** Физика прыжка/приседа — чистый sim в `src/sim/player.ts` (y/vy/гравитация, скорость приседа). Коллизии — данные `props` + высота `h` в `src/sim/maps.ts`, `resolveCircle` пропускает тех, кто выше `h`. Визуал — merged-геометрии в `src/three/mapsVisual.ts` (1 draw call на материал), ввод — `inputBus` в `src/ui/App.tsx`, применение — `src/main.tsx` + `src/three/cameraRig.ts`.

**Tech Stack:** Three.js 0.170, React 18, TypeScript 5.5, Vite 5, Bun test.

**Spec:** Заказ Miqqil⁴² в чате (3 пули): 1) прыжки и приседания; 2) сквозь коробки/покрышки/etc. не проходить; 3) улучшить графику всех карт, прокачать 3D-модели. Отдельного spec-документа нет — план argues from этих трёх пуль.

## Global Constraints

- Чужие файлы за пределами `shturm.bratuxa.zomb.top/` не трогать.
- Своё коммитить сразу, только свои файлы (`git add shturm.bratuxa.zomb.top/src shturm.bratuxa.zomb.top/dist`).
- `dist/` запечён в docker-образ: после сборки `docker compose build` + пересоздать контейнер `shturm`, проверка — `curl` локально (200) и публично (200) на свежий бандл.
- Тесты: `bun test` (сейчас 67 pass). Типы: `node node_modules/typescript/bin/tsc -p tsconfig.json` ( НЕ `tsc --noEmit` — в tsconfig нет noEmit,plain-прогон эмитит мусорные `.js`: после проверки удалять `find src -name '*.js' -delete` + `rm -f tsconfig.tsbuildinfo`).
- TDD: сначала красный тест, увидеть fail, потом код. Полный сьют после каждого таска.
- Исполнитель видит только свой таск: имена/сигнатуры соседей — в блоках Interfaces.

---

### Task 1: Физика прыжка и приседа ✅ DONE

**Files:**
- Modify: `shturm.bratuxa.zomb.top/src/sim/player.ts`
- Test: `shturm.bratuxa.zomb.top/tests/player.test.ts`

**Interfaces:**
- Produces: `JUMP_V=5.4, GRAV=14, JUMP_COST=6, CROUCH_SPEED=2.3, DODGE_H=0.9`; `PlayerState { y, vy, crouch }`; `InputState { jump?, crouch? }`; `movePlayer` — прыжок только с земли (`y<=0.001`), присед режет скорость до 2.3 и гасит спринт.

- [x] **Step 1: RED — тест прыжка.** В `tests/player.test.ts`: создать игрока, `movePlayer` с `jump:true` → `p.y > 0`; 120 тиков без jump → `p.y === 0`. Run: `bun test tests/player.test.ts`. Expected: FAIL (`p.y` undefined).
- [x] **Step 2: GREEN — вертикаль в `movePlayer`.** Прыжок с земли за стамину (`JUMP_COST`), гравитация, приземление на 0. Run: `bun test tests/player.test.ts`. Expected: PASS.
- [x] **Step 3: RED — присед и дабл-джамп.** Тест: `crouch:true+sprint` → скорость 2.3 и `p.crouch===true`. Тест: повторный `jump:true` в воздухе → `vy` не растёт. Run: FAIL.
- [x] **Step 4: GREEN.** `p.crouch` из входа, `CROUCH_SPEED`, спринт только без приседа; прыжок только при `y<=0.001 && vy<=0.001`. Run full: `bun test`. Expected: PASS, 0 fail.
- [x] **Step 5: Commit.** Отдельного коммита не было — войдёт в общий коммит Task 8.

### Task 2: Коллизии пропсов ✅ DONE

**Files:**
- Modify: `shturm.bratuxa.zomb.top/src/sim/maps.ts`
- Test: `shturm.bratuxa.zomb.top/tests/props.test.ts` (create)

**Interfaces:**
- Produces: `Obstacle { h? }` (верх; по умолчанию Infinity); `MapDef { props: Obstacle[] }`; `resolveCircle(pos: {x,z,y?}, radius, map)` — пропускает препятствия с `h < y`. Данные пропсов VERBATIM (авторитетный набор, верифицирован до сноса):
  yard: `(-14,-13,2.2,2.6) (8,-6,1.0,1.1) (10.5,-4.5,0.9,0.75) (-2,14,0.9,0.7) (12,10,1.3,2.15) (6,12.5,0.8,1.0) (-12,2,0.85,1.1) (10,-2,3.6,99)`;
  island: пальмы `r0.5 h99` `(-20,-14) (18,-16) (-16,16) (20,14) (0,-22)`; камни `h99` `(8,4,1.2) (-6,-4,0.9) (12,-8,1.5) (-12,8,1.1) (4,18,0.8) (-4,-18,1.0)`; мешки `r0.7 h0.85` `(-1.5,4) (0,4) (1.5,4)`; ящики `r1.0 h1.1` `(-10,0) (14,10)`;
  neon: стойки `r0.45 h99` `(-18,-18) (18,16) (0,22)`; бочки `r0.65 h1.0` `(-12,-4) (-11,-3) (-12.6,-2.8) (10,12) (11,12.5)`; контейнер `(-5,15,1.5,1.5)`.
  Формат: `(x,z,r,h)`, h=99 = не перепрыгнуть.

- [x] **Step 1: RED — `tests/props.test.ts`.** 4 теста: ящик держит (push-out на 1.7); покрышки держат на земле (`y:0` → true) и пропускают в прыжке (`y:1.2` → false); пруд держит даже на `y:5`; пальма держит. Run: `bun test tests/props.test.ts`. Expected: 0 pass / 4 fail (пропсов нет).
- [x] **Step 2: GREEN — `props` + `h` в `maps.ts`.** Run: `bun test tests/props.test.ts tests/player.test.ts`. Expected: 8 pass.
- [x] **Step 3: Регрессия аптечки.** Сьют поймал: точка `[-14,-14]` выталкивается будкой за радиус 20 (`tests/pickups.test.ts` FAIL). Fix: точка → `[-11,-16]` в `src/sim/pickups.ts` (код чиним, не тест). Run full: `bun test`. Expected: 67 pass.
- [x] **Step 4: Commit.** Войдёт в общий коммит Task 8.

### Task 3: Ввод, камера, игровой цикл ✅ DONE

**Files:**
- Modify: `shturm.bratuxa.zomb.top/src/ui/App.tsx`, `shturm.bratuxa.zomb.top/src/three/cameraRig.ts`, `shturm.bratuxa.zomb.top/src/main.tsx`, `shturm.bratuxa.zomb.top/src/ui/hud.tsx`

**Interfaces:**
- Consumes: Task 1 (`jump?/crouch?`, `DODGE_H`), Task 2 (`props`, `resolveCircle` с `y`).
- Produces: `inputBus { jump (разовый), crouch (удерживаемый) }`; `CamPose { crouch? }`; `__shturm.dbg() { py, crouch }` для приёмки.

- [x] **Step 1: Ввод (`App.tsx`).** `Space` → `jump=true` + `preventDefault`; `KeyC/Ctrl` → `crouch` hold; `keyup`/`blur` гасят. Тач: кнопка `▲` над огнём, `▼` в левом ряду. Подсказка меню: `Space — прыжок • C — присесть`.
- [x] **Step 2: Камера (`cameraRig.ts`).** `CamPose.crouch?`: 1-е лицо глаз 1.02 (было 1.62), 3-е лицо голова 0.95 (было 1.5). Существующие `tests/camera.test.ts` без `crouch` — поведение по умолчанию, должны остаться зелёными.
- [x] **Step 3: Цикл (`main.tsx`).** `movePlayer(..., { jump: inputBus.jump, crouch: inputBus.crouch })`, `inputBus.jump=false` после тика; мили-промах при `p.y > DODGE_H` (и без отброса танка/босса); `playerRoot.position.y = p.y`, сквош `scale.y=0.72` в приседе; ствол `1.25 + p.y`; камере `colliders: [...obstacles, ...props]` + `crouch`; `dbg { py, crouch }`.
- [x] **Step 4: Подсказка (`hud.tsx`).** Десктоп-хинт: `V 👁 • 1/2/3 🔫 • R ⟳ • Space ⤒ • C ⤓ • Shift ⚡`.
- [x] **Step 5: Run full.** `bun test` → 67 pass. Отдельного коммита не было — войдёт в Task 8.

### Task 4: Графика карт и пропсы ✅ DONE (код; визуальная приёмка — Task 7)

**Files:**
- Modify: `shturm.bratuxa.zomb.top/src/three/mapsVisual.ts`

**Interfaces:**
- Consumes: Task 2 (координаты пропсов — визуал обязан стоять там же).
- Produces: хелперы `getStencilTex/getNeonTextTex/getShadowTex/crate/sandbag/aoDisc`; материалы `matSteel/matTrim/matStencil/matAO`; световые лужи у фонарей (все карты).

- [x] **Step 1: Хелперы и материалы.** Трафарет «42», неон-текст «ШТУРМ-43 ★ 42 ★», тёмное пятно; `crate()` (корпус+4 рейки+трафарет на 2 гранях); `sandbag()` (капсула лёжа); `aoDisc()`.
- [x] **Step 2: Двор.** Шины → +ступица+стальной обод; ящики → рейки+трафарет (4 шт, верхний на нижнем); будка → рама двери + светящееся окно; AO-пятна под всем.
- [x] **Step 3: Остров.** Мешки (3 колонны × 2+1) у `(0,4)`; 2 ящика с трафаретом; AO под камнями/пальмами/ящиками.
- [x] **Step 4: Неон.** Бочки (корпус+2 обруча+крышка, ржавые/бирюзовые); контейнер (корпус+приоткрытая крышка+колёса); текст-вывеска 6×3 перед центральным щитом (ловит bloom); AO.
- [x] **Step 5: Фонари (все карты).** Аддитивные световые лужи по цвету лампы (`renderOrder=2`).
- [x] **Step 6: Dispose.** Новые текстуры в `localTex` + сброс синглтонов.
- [x] **Step 7: Fix по скриншоту.** Мешки вышли чёрными (тёмная `fabric`-map множит цвет) → `matSand` без map, чистый `0xa89468`.
- [x] **Step 8: Run.** `tsc -p tsconfig.json` чисто (js-мусор подтереть), `bun test` 67 pass, `vite build` ок.

### Task 5: Типы, тесты, сборка ✅ DONE

- [x] **Step 1:** `node node_modules/typescript/bin/tsc -p tsconfig.json` — чисто.
- [x] **Step 2:** Подтереть эмитт: `find src -name '*.js' -delete; rm -f tsconfig.tsbuildinfo`.
- [x] **Step 3:** `bun test` → 67 pass / 0 fail.
- [x] **Step 4:** `vite build` → ок.

### Task 6: Браузерная приёмка двора и острова ✅ DONE

Стенд: `python3 -c "ThreadingHTTPServer..."` на `8099`, `agent-browser`, десктоп `1280×800`.

- [x] **Step 1: Прыжок.** `start('yard')` + `keydown Space` → `dbg().py = 0.94` в воздухе. Скрин `shturm-jump-yard.png` — сцена живая, шины у пруда.
- [x] **Step 2: Присед.** `keydown KeyC` → `dbg().crouch = true`.
- [x] **Step 3: Коллизия.** `tp(12,9)` (внутрь ящика) → тик вытолкнул ровно на dist 1.7. Скрин `shturm-crates.png` — рейки и «42» на месте, глитчей нет.
- [x] **Step 4: Остров.** `start('island')`, `tp(0,7)` — скрин: мешки (тогда чёрные → см. Task 4 Step 7), ящик с «42», пальмы, вода. Багов геометрии нет.
- [x] **Step 5: Ошибки страницы.** Проверить `agent-browser errors` — должно быть пусто (выполнить в Task 7 заодно).

### Task 7: Браузерная приёмка неона и фикса мешков ⬜ TODO

**Files:** нет (только скрины в `/root/shots/`).

**Interfaces:**
- Consumes: Task 4 (свежий `dist` уже собран).

- [ ] **Step 1: Поднять стенд.** Run: `python3 -c "from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler as H; ThreadingHTTPServer(('127.0.0.1', 8099), H).serve_forever()"` (background, workdir `dist`). Check: `curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:8099/` → `200`. Внимание: `agent-browser` виснет на второй сессии — работать в ОДНОЙ сессии (`close --all` перед стартом при глюках).
- [ ] **Step 2: Неон.** Один `open` с `?v=<новое>`, `start('neon','veteran')`, `tp(0,18)` + `setYaw(Math.PI)` → скрин вывески «ШТУРМ-43»; `tp(-9,-4)` + `setYaw(Math.PI/2)` → скрин бочек. Ожидается: текст читается, bloom светится, обручи/крышки на месте, бочки держат (подойти — отталкивает).
- [ ] **Step 3: Мешки.** `start('island')`, `tp(0,7)`, `setYaw(0)` → скрин. Ожидается: песочный цвет (не чёрный), 2 накатки, прыжок через них (`Space` → пройти сквозь верх).
- [ ] **Step 4: Ошибки.** Run: `agent-browser errors`. Expected: пусто. Скриншоты показать пользователю.
- [ ] **Step 5: Убить стенд.** `fuser -k 8099/tcp`, `agent-browser close --all`.

### Task 8: Коммит ⬜ TODO

- [ ] **Step 1: Проверить diff.** Run: `git status --short shturm.bratuxa.zomb.top/` + `git diff --stat`. Expected: только свои файлы (`src/`, `dist/`, `tests/`); чужих правок нет (если sibling-агенты трогали те же файлы — сверить, не затёрто ли).
- [ ] **Step 2: Коммит.**
```bash
git add shturm.bratuxa.zomb.top/src shturm.bratuxa.zomb.top/dist shturm.bratuxa.zomb.top/tests
git commit -m "shturm: прыжки/приседы, коллизии пропсов, графика карт 🏆"
```

### Task 9: Деплой ⬜ TODO

- [ ] **Step 1: Образ.** Run: `docker compose build` в `shturm.bratuxa.zomb.top/`. Expected: `Image shturm-43:latest Built`.
- [ ] **Step 2: Контейнер.** Run: `docker rm -f shturm`, затем `docker run -d --name shturm --restart unless-stopped -p 127.0.0.1:8081:80 shturm-43:latest` (НЕ `compose up -d` одной командой со слипом — исполнитель команд режет такие вызовы; по шагам).
- [ ] **Step 3: Проверка.** Run: `curl -s -o /dev/null -w 'local:%{http_code}' http://127.0.0.1:8081/` → `local:200`; `curl -s -o /dev/null -w 'public:%{http_code}' https://shturm.bratuxa.zomb.top/` → `public:200`; бандл в `curl -s http://127.0.0.1:8081/ | grep -o 'assets/index-[A-Za-z0-9]*\.js'` совпадает со свежим из `dist/`.
- [ ] **Step 4: Доложить.** Что вошло, тесты/сборка/браузер/курл фактами, скрины неона.

## Self-Review

1. **Spec coverage:** пуля 1 (прыжки/приседы) → Tasks 1, 3, 6; пуля 2 (коллизии) → Tasks 2, 3 (камера тоже знает пропсы), 6; пуля 3 (графика) → Tasks 4, 7. Все три пули покрыты. Gap: «прокачать 3D-модели» мобов (runner/tank) — в план не вошло сознательно: модели мобов уже детализированы, упор сделан на карты/пропсы; мобы — кандидат на следующий план.
2. **Placeholder scan:** нет TBD/TODO в коде шагов (TODO-чекбоксы — только невыполненные таски 7–9, это трекинг, не плейсхолдеры); все команды и пути точные; код-тесты приведены целиком там, где пишут код.
3. **Type consistency:** `Obstacle.h?`, `resolveCircle(pos: {x,z,y?})`, `CamPose.crouch?`, `inputBus.jump/crouch`, `dbg().py/crouch` — имена одинаковые во всех тасках; `DODGE_H` из `sim/player`, не из `enemies`.
