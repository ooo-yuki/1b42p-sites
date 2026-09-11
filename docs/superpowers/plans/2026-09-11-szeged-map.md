# Szeged Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Приватная карта Szeged в mtt42 из DAE МТТ, видна и доступна только логину `МТТ`.

**Architecture:** Офлайн-запекание DAE→JSON (меш+солиды) питоном; движок строит карту процедурой `buildSzeged()` как остальные карты; доступ режут 4 точки (меню, create, join, list) с одним источником правды `shared/szeged-gate.ts`.

**Tech Stack:** Python 3 + PIL-free stdlib (bake), TypeScript + three.js 0.160 + React 18 (движок/клиент), Bun (server.ts, тесты), Caddy-статика для dist.

**Spec:** docs/superpowers/specs/2026-09-11-szeged-map-design.md

## Global Constraints

- Gate-литерал строго `'МТТ'` (кириллица, без пробелов) — один источник `shared/szeged-gate.ts`, зеркалирование только как фолбэк с кросс-тестом.
- Чужие файлы за пределами `mtt.bratuxa.zomb.top/` и `docs/` не трогать.
- Коммиты из `/root/sites`, только явные пути (`NEVER git add -A`), префикс `mtt:` + эмодзи в конце.
- `bun` только `/root/.bun/bin/bun`; typecheck только `tsc --noEmit` (скрипт `typecheck`); сборка `bun run build`; тесты `bun test <файл>`.
- Правила боя не менять: только новая карта + гейты, баланс и sim untouched.
- dist/ коммитится (статика с него): после кода — rebuild + живьём curl.

---

## File Structure

- Create `mtt.bratuxa.zomb.top/tools/bake-szeged.py` — парсинг DAE, чистка, масштаб, запекание (ответственность: только конвертация, никакой логики игры).
- Create `mtt.bratuxa.zomb.top/src/assets/szeged.mesh.json` — слитые треугольники `{positions:[], normals:[], colors:[]}` (publish-артефакт скрипта, руками не править).
- Create `mtt.bratuxa.zomb.top/src/assets/szeged.solids.json` — `[{x,z,hx,hz,h}]` (publish-артефакт).
- Create `mtt.bratuxa.zomb.top/shared/szeged-gate.ts` — `SZEGED_LOGIN='МТТ'`, `canSee(login)`, `canCreate(login)`, `canJoin(login)`, `visibleInList(login)` (все четыре — строгое равенство с SZEGED_LOGIN).
- Create `mtt.bratuxa.zomb.top/tests/szeged-bake.test.ts` — валидность артефактов.
- Create `mtt.bratuxa.zomb.top/tests/szeged-gate.test.ts` — гейты: МТТ можно, чужому/анониму/похожему (`мтт`, `МТТ `, `MTT`) нельзя.
- Create `mtt.bratuxa.zomb.top/tests/szeged-engine.test.ts` — headless-сборка карты движком.
- Modify `mtt.bratuxa.zomb.top/src/game/engine.ts` — `MapId += 'szeged'`, `MAPS += {id:'szeged',name:'🗺️ Szeged',desc:'Приватная карта МТТ'}`, `buildSzeged()`, ветка в `buildWorld()`, `preload()` += `szeged: []`.
- Modify `mtt.bratuxa.zomb.top/src/App.tsx` — оба списка `MAPS.map` (строки ~2444 и ~2687): пункт szeged рендерить только если `canSee(meLogin)`; `createRoom`/`joinRoom` для szeged — ранний возврат без fetch, если не `canSee`.
- Modify `mtt.bratuxa.zomb.top/server.ts` — `Room['mode']` += `'szeged'`; `ttlFor` += 1200; create-вайтлист (строка ~471) += szeged; create/join/list вызывают гейты из `shared/szeged-gate.ts` (чужому: create/join → 403 `{error:'forbidden'}`, list → пропуск комнат).

---

### Task 1: Запекание DAE → JSON-артефакты

**Files:**
- Create: `mtt.bratuxa.zomb.top/tools/bake-szeged.py`
- Create: `mtt.bratuxa.zomb.top/src/assets/szeged.mesh.json`
- Create: `mtt.bratuxa.zomb.top/src/assets/szeged.solids.json`
- Create: `mtt.bratuxa.zomb.top/tests/szeged-bake.test.ts`

**Interfaces:**
- Consumes: `/tmp/szeged/model.dae` (копия входника — положить рядом как `mtt.bratuxa.zomb.top/tools/szeged-src/model.dae`, в git не коммитить исходник 14 МБ? — НЕТ: исходник тоже коммитить нельзя (тяжёлый), хранить только скрипт + ссылку на архив).
- Produces: `szeged.mesh.json` `{positions:number[], normals:number[], colors:number[]}` (плоский тройками, метры, Y_UP, центр в нуле); `szeged.solids.json` `[{x,z,hx,hz,h}]` (метры).

- [ ] **Step 1: Скопировать входник рядом со скриптом (не в git)**

```bash
mkdir -p /root/sites/mtt.bratuxa.zomb.top/tools/szeged-src && cp /tmp/szeged/model.dae /root/sites/mtt.bratuxa.zomb.top/tools/szeged-src/model.dae && printf 'szeged-src/\n' >> /root/sites/mtt.bratuxa.zomb.top/.gitignore
```

- [ ] **Step 2: Написать тест валидности артефактов**

```ts
// tests/szeged-bake.test.ts
import { expect, test } from 'bun:test';
import mesh from '../src/assets/szeged.mesh.json';
import solids from '../src/assets/szeged.solids.json';
test('mesh: тройки бьются, размер в бюджете', () => {
  expect(mesh.positions.length % 3).toBe(0);
  expect(mesh.positions.length).toBe(mesh.normals.length);
  expect(mesh.positions.length).toBe(mesh.colors.length);
  expect(mesh.positions.length / 3).toBeGreaterThan(1000);
  const xs: number[] = []; const zs: number[] = [];
  for (let i = 0; i < mesh.positions.length; i += 3) { xs.push(mesh.positions[i]); zs.push(mesh.positions[i + 2]); }
  expect(Math.max(...xs) - Math.min(...xs)).toBeLessThanOrEqual(160);
  expect(Math.max(...zs) - Math.min(...zs)).toBeLessThanOrEqual(160);
});
test('solids: внутри арены, счёт в бюджете', () => {
  expect(solids.length).toBeGreaterThan(10);
  expect(solids.length).toBeLessThanOrEqual(1500);
  for (const s of solids) {
    expect(Math.abs(s.x)).toBeLessThanOrEqual(80);
    expect(Math.abs(s.z)).toBeLessThanOrEqual(80);
    expect(s.hx).toBeGreaterThan(0); expect(s.hz).toBeGreaterThan(0); expect(s.h).toBeGreaterThan(0);
  }
});
```

- [ ] **Step 3: Запустить тест, убедиться что падает (файлов ещё нет)**

Run: `export PATH=/root/.bun/bin:$PATH; cd /root/sites/mtt.bratuxa.zomb.top && bun test tests/szeged-bake.test.ts`
Expected: FAIL (cannot find module).

- [ ] **Step 4: Написать `tools/bake-szeged.py`** (stdlib-only, читает `tools/szeged-src/model.dae`, пишет оба JSON):
  - парсить только `<triangles>` (3319 шт): `input` VERTEX/NORMAL/TEXCOORD игнорировать UV, `p`-индексы → тройки;
  - diffuse-цвет материала треугольника → цвет всех его вершин (текстур нет — только цвета);
  - координаты: дюймы→метры (`*0.0254`), Z_UP→Y_UP (`(x,y,z)->(x,z,-y)` — проверить знаком на спавне в Task 3, ось легко перевернуть флагом `--flip-z`);
  - выбросы: отрезать меши, чей центр дальше 3 сигм от медианы центров;
  - масштаб к bbox ≤120 м по большей стороне, центр bbox в (0,0);
  - солиды: пер-меш AABB (в метрах, после всех трансформ) → воксельное слияние на сетке 2 м → отсев коробок с `h<0.3` (мусор) и площадью `<0.09 м²`;
  - round(3) все числа; печать итога `verts=X tris=Y solids=Z size=WxD`.

- [ ] **Step 5: Прогнать скрипт и тест**

Run: `python3 tools/bake-szeged.py && export PATH=/root/.bun/bin:$PATH; bun test tests/szeged-bake.test.ts`
Expected: PASS, в консоли скрипта `size` ≤120 по каждой стороне.

- [ ] **Step 6: Коммит**

```bash
git -C /root/sites add mtt.bratuxa.zomb.top/tools/bake-szeged.py mtt.bratuxa.zomb.top/src/assets/szeged.mesh.json mtt.bratuxa.zomb.top/src/assets/szeged.solids.json mtt.bratuxa.zomb.top/tests/szeged-bake.test.ts mtt.bratuxa.zomb.top/.gitignore
git -C /root/sites commit -m 'mtt: Szeged запечён из DAE — меш+солиды 🗺️'
```

### Task 2: Общий gate-модуль + тесты

**Files:**
- Create: `mtt.bratuxa.zomb.top/shared/szeged-gate.ts`
- Create: `mtt.bratuxa.zomb.top/tests/szeged-gate.test.ts`

**Interfaces:**
- Consumes: ничего.
- Produces: `SZEGED_LOGIN='МТТ'`; `canSee/canCreate/canJoin/visibleInList(login:string|null|undefined):boolean` — все четыре `return login === SZEGED_LOGIN`. Если vite ИЛИ bun не резолвит импорт — фолбэк: литерал на местах + этот же тест сверяет литералы (см. Step 4 note).

- [ ] **Step 1: Написать тест гейтов**

```ts
// tests/szeged-gate.test.ts
import { expect, test } from 'bun:test';
import { SZEGED_LOGIN, canSee, canCreate, canJoin, visibleInList } from '../shared/szeged-gate';
test('только МТТ', () => {
  expect(SZEGED_LOGIN).toBe('МТТ');
  for (const f of [canSee, canCreate, canJoin, visibleInList]) {
    expect(f('МТТ')).toBe(true);
    expect(f('мтт')).toBe(false);
    expect(f('МТТ ')).toBe(false);
    expect(f('MTT')).toBe(false);
    expect(f('')).toBe(false);
    expect(f(null)).toBe(false);
    expect(f(undefined)).toBe(false);
  }
});
```

- [ ] **Step 2: Запустить, убедиться что падает**

Run: `export PATH=/root/.bun/bin:$PATH; cd /root/sites/mtt.bratuxa.zomb.top && bun test tests/szeged-gate.test.ts`
Expected: FAIL (no module).

- [ ] **Step 3: Написать `shared/szeged-gate.ts`**

```ts
// Единственный источник правды доступа на Szeged. Клиент и сервер.
export const SZEGED_LOGIN = 'МТТ';
function isMtt(login: string | null | undefined): boolean { return login === SZEGED_LOGIN; }
export function canSee(login: string | null | undefined): boolean { return isMtt(login); }
export function canCreate(login: string | null | undefined): boolean { return isMtt(login); }
export function canJoin(login: string | null | undefined): boolean { return isMtt(login); }
export function visibleInList(login: string | null | undefined): boolean { return isMtt(login); }
```

- [ ] **Step 4: Запустить тест**

Run: `export PATH=/root/.bun/bin:$PATH; bun test tests/szeged-gate.test.ts`
Expected: PASS. Note: если `bun run build` или `bun ./server.ts` не резолвят `../shared/szeged-gate` — сказать координатору (фолбэк: литерал + кросс-тест), код задач 3–4 не писать вслепую.

- [ ] **Step 5: Коммит**

```bash
git -C /root/sites add mtt.bratuxa.zomb.top/shared/szeged-gate.ts mtt.bratuxa.zomb.top/tests/szeged-gate.test.ts
git -C /root/sites commit -m 'mtt: общий gate Szeged — только МТТ 🗺️'
```

### Task 3: Движок — buildSzeged + MapId + preload

**Files:**
- Modify: `mtt.bratuxa.zomb.top/src/game/engine.ts` (MapId строка ~87, MAPS ~90, buildWorld ~2463, preload ~1157)
- Create: `mtt.bratuxa.zomb.top/tests/szeged-engine.test.ts`

**Interfaces:**
- Consumes: `src/assets/szeged.mesh.json`, `src/assets/szeged.solids.json` (импорт JSON как в vite: `import mesh from '../assets/szeged.mesh.json'` — проверить резолв; если vite ругается — грузить через `fetch` в buildSzeged async? НЕТ: buildWorld синхронен — значит только статический импорт; при проблеме резолва — координатору, не выдумывать лоадер).
- Produces: `buildSzeged()` строит меши (vertexColors, shadows как в buildDuel) + пушит солиды + ставит 4 спавна по углам через `hitSolid`-проверку.

- [ ] **Step 1: Написать engine-тест**

```ts
// tests/szeged-engine.test.ts
import { expect, test } from 'bun:test';
import { MAPS } from '../src/game/engine';
test('szeged в меню', () => {
  const m = MAPS.find((x) => x.id === 'szeged');
  expect(m).toBeDefined();
  expect(m!.name).toContain('Szeged');
});
```

Headless-сборка мира требует three + DOM — тяжело; полный `new Game('szeged')` в bun упадёт без canvas. Поэтому дополнительно: тест солидов уже покрыт в Task 1; здесь — только MAPS-запись + `buildWorld` содержит ветку (проверяется ревьюером по диффу, не рантаймом).

- [ ] **Step 2: Запустить, убедиться что падает**

Run: `export PATH=/root/.bun/bin:$PATH; cd /root/sites/mtt.bratuxa.zomb.top && bun test tests/szeged-engine.test.ts`
Expected: FAIL (`MAPS.find(...)` undefined). Note: импорт engine.ts тянет three + ассеты-картинки — если bun подавится импортами картинок, тест свести к чтению исходника? НЕТ костылей: сначала попробовать, о проблеме — координатору.

- [ ] **Step 3: Минимальная реализация в engine.ts**
  - `MapId` += `| 'szeged'`; `MAPS` += `{ id: 'szeged', name: '🗺️ Szeged', desc: 'Приватная карта МТТ' }`;
  - `buildSzeged()`: BufferGeometry из mesh.json (setAttribute position/normal/color, `MeshStandardMaterial({vertexColors:true, roughness:.9})`, castShadow/receiveShadow как в buildDuel), солиды из solids.json → `this.solids.push({x,z,hx,hz,h})`, спавны `[[±40,±40]]` с `hitSolid`-проверкой по образцу `buildWorld` строк 2452–2460;
  - `buildWorld()` += `if (this.map === 'szeged') { this.buildSzeged(); return; }`;
  - `preload()` += `szeged: []`, враги по умолчанию как duel (ничего не делать — дефолтная ветка уже дуэльная).

- [ ] **Step 4: typecheck + тесты**

Run: `export PATH=/root/.bun/bin:$PATH; bun run typecheck && bun test tests/szeged-engine.test.ts tests/szeged-bake.test.ts tests/szeged-gate.test.ts`
Expected: typecheck clean, все PASS.

- [ ] **Step 5: Коммит**

```bash
git -C /root/sites add mtt.bratuxa.zomb.top/src/game/engine.ts mtt.bratuxa.zomb.top/tests/szeged-engine.test.ts
git -C /root/sites commit -m 'mtt: движок строит Szeged 🗺️'
```

### Task 4: Клиент — меню только для МТТ

**Files:**
- Modify: `mtt.bratuxa.zomb.top/src/App.tsx` (списки ~2444 и ~2687, `createRoom` ~1217, `joinRoom` — найти рядом)

**Interfaces:**
- Consumes: `canSee` из `shared/szeged-gate.ts`; свой логин — из уже загруженного `/api/me` (строка ~882, `loginByToken` клиента — переиспользовать существующее состояние, нового fetch не делать).
- Produces: чужой не видит пункт, не может создать/войти даже прямым вызовом.

- [ ] **Step 1: Найти имя переменной с логином** (рядом со строкой 882 — `authed` используется в строке ~2863). Зафиксировать имя и использовать его.
- [ ] **Step 2: Внести правки**: оба `MAPS.map` → `MAPS.filter((m) => m.id !== 'szeged' || canSee(myLogin)).map(...)`; в `createRoom` и `joinRoom` — ранний `return` при szeged-режиме без `canSee`.
- [ ] **Step 3: typecheck**

Run: `export PATH=/root/.bun/bin:$PATH; cd /root/sites/mtt.bratuxa.zomb.top && bun run typecheck`
Expected: clean.

- [ ] **Step 4: Коммит**

```bash
git -C /root/sites add mtt.bratuxa.zomb.top/src/App.tsx
git -C /root/sites commit -m 'mtt: Szeged в меню только для МТТ 🗺️'
```

### Task 5: Сервер — авторитетные гейты + rebuild + живьём

**Files:**
- Modify: `mtt.bratuxa.zomb.top/server.ts` (Room mode ~152, ttlFor ~208, create-вайтлист ~471, join ~501, list ~440)
- Modify (rebuild): `mtt.bratuxa.zomb.top/dist/*` (выход `bun run build`, коммитить только изменившиеся файлы поименно)

**Interfaces:**
- Consumes: `canCreate/canJoin/visibleInList` из `shared/szeged-gate.ts`.
- Produces: create/join чужого → 403 `{error:'forbidden'}`; list скрывает szeged-комнаты от чужих; `miqqil-api`-подобный рестарт НЕ нужен (mtt-сервер — какой юнит? выяснить: `systemctl list-units | grep -i mtt` или спросить координатора; без рестарта правки server.ts не подхватятся).

- [ ] **Step 1: Внести правки**: `Room['mode']` += `'szeged'`; `ttlFor` += `if (mode === 'szeged') return 1200;`; create-вайтлист += `rawMode === 'szeged' ? 'szeged'`; перед созданием: `if (mode === 'szeged' && !canCreate(login)) → 403`; join: `if (room.mode === 'szeged' && !canJoin(loginByToken(token))) → 403`; list: `if (r.mode === 'szeged' && !visibleInList(loginOfRequester)) continue;` (логин запросившего — из `u.searchParams.get('token')`, как в `/api/admin/stats` строке ~409).
- [ ] **Step 2: typecheck + все тесты**

Run: `export PATH=/root/.bun/bin:$PATH; cd /root/sites/mtt.bratuxa.zomb.top && bun run typecheck && bun test`
Expected: clean, 0 fail (47+ новых).

- [ ] **Step 3: Rebuild dist**

Run: `export PATH=/root/.bun/bin:$PATH; bun run build`
Expected: exit 0, `git status --short` показывает только dist-артефакты + уже закоммиченное.

- [ ] **Step 4: Коммит кода + dist поименно** (каждый dist-файл отдельным путём, `git add` без `-A`)

```bash
git -C /root/sites add mtt.bratuxa.zomb.top/server.ts && git -C /root/sites status --short -- mtt.bratuxa.zomb.top/dist/ | head -n 20
```

 dist-файлы добавить поименно по выводу выше, затем `git commit -m 'mtt: Szeged под замком — только МТТ 🗺️'`.

- [ ] **Step 5: Живая проверка**

Run: `curl -s --max-time 20 -o /dev/null -w 'игра:%{http_code}\n' https://mtt.bratuxa.zomb.top/`
Expected: `игра:200`. Рестарт серверного юнита — через координатора (сказать какой юнит и что нужен рестарт для server.ts).
