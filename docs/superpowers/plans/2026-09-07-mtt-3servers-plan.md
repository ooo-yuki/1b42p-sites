# MTT: 3 официальных сервера + загрузка + обход препятствий. Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Загрузочный экран со щитом, вкладка «Сервера» с тремя официальными серверами (PvP / Бесконечный Бэкрумс / Нашествие) с рестартами, враги с обходом препятствий.

**Architecture:** Клиент: engine (`src/game/engine.ts`) — режимы, щит, BFS-пути, сталкеры, скалолазы; App (`src/App.tsx`) — загрузка, таб серверов, смерти/наблюдатель. Сервер (`server.ts`, запечён в docker `bat42/mtt-api`): новые режимы комнат `pvp`/`endless`/`invasion`, килл-фид, официальные комнаты при старте, TTL-рестарт 20/5/10 мин.

**Tech Stack:** Bun + React + TS + three.js; сборка `bun build ./index.html --outdir ./dist`; API пересборка `docker compose -f compose.apps.yml build mtt-api && up -d mtt-api` из `/root/sites/infra`; systemd `mtt-api` НЕ трогать.

**Spec:** Приказ МТТ 2026-09-07 (чат): загрузка со щитом (щит до движения/выстрела); PvP без врагов, рандом-спавн, фраги друг друга, счётчик киллов сверху, смерть → ресаун рандом/меню, рестарт 20 мин; Бэкрумс гигантский, рандом-спавн, 5 неубиваемых быстрых монстров, смерть → наблюдатель/лобби, наблюдатель выбирает цель, не виден и не вмешивается, рестарт 5 мин; Нашествие — толпы врагов-скалолазов, выжить, рестарт 10 мин; враги обходят препятствия кратчайшим путём.

## Global Constraints

- Сборка ТОЛЬКО `bun build ./index.html --outdir ./dist` в `/root/sites/mtt.bratuxa.zomb.top` (сборка `main.tsx` — старьё в проде).
- `dist/` TRACKED: коммитить `src/` + свежий `dist/` (новые хеши, stale-бандлы удалить через `git rm`) одним коммитом.
- `bunx tsc --noEmit -p tsconfig.json` — ноль ошибок перед каждой сборкой.
- Тесты СТРОГО последовательно `--workers=1`, один прогон за раз.
- После правок `server.ts`: `bun build ./server.ts --target bun` (синтаксис), затем пересборка образа + recreate; проверить `ss -tlnp | grep 8095` (держатель — docker-proxy).
- Сейвы святы (`mtt_shop_v1`, `mtt_keys_v1`, `mtt_char`, `mtt_xp_v1`, `mtt_token`) — merge поверх, не сносить.
- Пароли только хешем, `ADMIN_LOGIN` не трогать.
- Никаких клеймов без свежих команд (verification-before-completion).
- Апдейт МТТ: тегать @MeMATT0 + ссылка https://mtt.bratuxa.zomb.top/ в том же сообщении.

---

### Task A1: Загрузочный экран + предзагрузка текстур

**Files:**
- Modify: `src/App.tsx` (состояние `loading: boolean + pct`, оверлей `#loading`, Ehrhardt вокруг `go()`)
- Modify: `src/game/engine.ts` (метод `preload(onPct): Promise<void>` через `THREE.LoadingManager`; метод `setShield(on)`, поле `shieldT`)

**Interfaces:**
- Consumes: существующие `TextureLoader` вызовы (foeTexture, charTexture, buildBackrooms textures).
- Produces: `game.preload(cb)` → резолвится когда все текстуры готовы; `game.shield(): boolean`; движок не даёт урона пока `shieldT>0`.

- [ ] **Step 1: RED-тест.** В `tests/e2e/mtt.spec.ts` добавить тест «загрузка: оверлей виден до старта, щит держит урон»:
```ts
test('загрузка: щит держит первый удар', async ({ page }) => {
  await page.click('#guestBtn');
  await page.click('#goBtn');
  await expect(page.locator('#loading')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('#loading')).toBeHidden({ timeout: 30000 });
  const hp0 = await page.evaluate(() => (window as unknown as { __mtt: { hp: () => number } }).__mtt.hp());
  await page.evaluate(() => (window as unknown as { __mtt: { hurt: (n: number) => void } }).__mtt.hurt(30));
  const hp1 = await page.evaluate(() => (window as unknown as { __mtt: { hp: () => number } }).__mtt.hp());
  expect(hp1).toBe(hp0);
});
```
- [ ] **Step 2: Run, watch fail.** `bunx playwright test tests/e2e/mtt.spec.ts --workers=1 -g "щит держит первый удар"` → FAIL (`#loading` нет).
- [ ] **Step 3: Engine — preload + shield.** В `engine.ts`: поле `private shieldT = 0`; `setShield(s:boolean){this.shieldT = s ? 1e9 : 0;}`; `shield(){return this.shieldT>0}`; в `hurtPlayer`-пути (урон игроку, строка ~3421: `this.hp -= ...`) в начало добавить `if (this.shieldT > 0) return;`; сброс щита при движении/атаке: в `attack()` и в блоке движения (где `this.moving` выставляется) добавить `if (this.shieldT > 0) this.shieldT = 0;`. Метод `async preload(onPct:(p:number)=>void)`: создать `THREE.LoadingManager`, прогнать через него `TextureLoader` для `vrag1Url, vrag2Url, bossUrl, charMttUrl, charKrysaUrl, brFloorUrl, brCeilUrl, travaUrl` (имена импортов — сверить с верхом engine.ts), `onPct(loaded/total)` в `onProgress`, резолв в `onLoad`.
- [ ] **Step 4: App — оверлей и Ehrhardt.** Состояние `const [loading, setLoading] = useState<{show:boolean;pct:number}>({show:false,pct:0})`; в `go()`: `setLoading({show:true,pct:0}); setMenu(false); await gameRef.current?.preload((p)=>setLoading({show:true,pct:p})); gameRef.current?.setShield(true); setLoading({show:false,pct:100});` затем существующий `setTimeout(...g.start(), 50)`. Рендер: `{loading.show && !menu && (<div id="loading"><div>ЗАГРУЗКА {loading.pct}%</div><div id="loadbar"><div id="loadfill" style={{width: loading.pct+'%'}} /></div></div>)}`. Хук `shield` в `__mtt` НЕ нужен (тест идёт через `hurt`/`hp`).
- [ ] **Step 5: GREEN.** tsc → build → сверить хеш `curl -s https://mtt.bratuxa.zomb.top/ | grep -o 'index-[a-z0-9]*\.js'` с `dist/index.html` → тест зелёный.
- [ ] **Step 6: Commit.** `git add src/App.tsx src/game/engine.ts tests/e2e/mtt.spec.ts dist/index.html dist/index-<хеш>.js` + `git rm` stale-бандлов; коммит `mtt: загрузка текстур + щит спавна`.

### Task B1: Обход препятствий (BFS-пути у врагов)

**Files:**
- Modify: `src/game/engine.ts` (поля `path: Array<{x:number;z:number}>`, `repathT`; методы `findPath(tx,tz): Array<{x:number;z:number}>`, применение в блоке погони ~3412-3417)

**Interfaces:**
- Consumes: `hitSolid(x,z,rad,y)`, `clampArena`, `Enemy.speed`, `dt` кадра (кламп 0.05).
- Produces: враг идёт по вейпоинтам; прямой рывок если виден (луч без `hitSolid` каждые 1м); иначе BFS.

- [ ] **Step 1: RED-тест.** Тест «враг огибает стену, а не толкается в неё»:
```ts
test('враг огибает стену', async ({ page }) => {
  await page.click('#guestBtn');
  await page.click('#goBtn');
  await page.waitForTimeout(800);
  const d0 = await page.evaluate(() => {
    const m = (window as unknown as { __mtt: {
      teleport:(x:number,z:number,yaw?:number)=>void; spawnKind:(k:'walk')=>number;
      foes:()=>Array<{x:number;z:number}>; pos:()=>{x:number;z:number} } }).__mtt;
    m.teleport(-30, 0, Math.PI / 2);
    m.spawnKind('walk');
    return true;
  });
  expect(d0).toBe(true);
  let closer = false;
  for (let i = 0; i < 40; i++) {
    await page.waitForTimeout(500);
    const r = await page.evaluate(() => {
      const m = (window as unknown as { __mtt: { foes:()=>Array<{x:number;z:number}>; pos:()=>{x:number;z:number} } }).__mtt;
      const f = m.foes(); const p = m.pos();
      if (f.length === 0) return -1;
      return Math.min(...f.map((e) => Math.hypot(e.x - p.x, e.z - p.z)));
    });
    if (r >= 0 && r < 12) { closer = true; break; }
  }
  expect(closer).toBe(true);
});
```
(Карта arena: стена между точками есть по построению города; тест ловит застревание.)
- [ ] **Step 2: Run, watch fail** (таймаут 40×500мс, враг стоит у стены).
- [ ] **Step 3: Implement.** В `Enemy` добавить `path: Array<{x:number;z:number}>; repathT: number` (инициализация в `spawnEnemy` и в создании сетевых кукол `path: [], repathT: Math.random()/2`). Метод:
```ts
private findPath(fx:number, fz:number, tx:number, tz:number): Array<{x:number;z:number}> {
  const CELL = 2, R = Math.ceil(this.half / CELL);
  const gx = (v:number) => Math.max(-R, Math.min(R, Math.round(v / CELL)));
  const key = (ix:number, iz:number) => ix * 4096 + iz;
  const sx = gx(fx), sz = gx(fz), tx2 = gx(tx), tz2 = gx(tz);
  const prev = new Map<number, number>();
  const seen = new Set<number>([key(sx, sz)]);
  const q: Array<[number, number]> = [[sx, sz]];
  const tkey = key(tx2, tz2);
  while (q.length > 0) {
    const [cx, cz] = q.shift()!;
    if (key(cx, cz) === tkey) break;
    const nb = [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
    for (const [ox, oz] of nb) {
      const nx = cx + ox, nz = cz + oz;
      if (Math.abs(nx) > R || Math.abs(nz) > R) continue;
      const k = key(nx, nz);
      if (seen.has(k)) continue;
      if (this.hitSolid(nx * CELL, nz * CELL, 0.9, 0)) continue;
      seen.add(k); prev.set(k, key(cx, cz)); q.push([nx, nz]);
    }
  }
  if (!prev.has(tkey) && tkey !== key(sx, sz)) return [];
  const cells: Array<[number, number]> = [];
  let c = tkey;
  while (c !== key(sx, sz)) { cells.push([Math.floor(c / 4096), c % 4096]); const p = prev.get(c); if (p === undefined) break; c = p; }
  // NOTE: key() при отрицательных координатах: ix*4096+iz и Math.floor/% — восстановить ix=Math.floor(c/4096), iz=c-ix*4096
  return cells.reverse().slice(1).map(([ix, iz]) => ({ x: ix * CELL, z: iz * CELL }));
}
```
Хранить `repath: Array<{x:number;z:number}>` на враге + `repathT`. В блоке погони (строки ~3412-3417) заменить прямой шаг на: `e.repathT -= dt;` если путь пуст или таймер вышел — проверить прямую видимость (шаг 1м от врага к игроку, `hitSolid` с `eyH`; виден → `e.path=[]`, идти прямо как сейчас); иначе `e.path = this.findPath(...)`, `e.repathT = 0.5 + Math.random()*0.3`; идти к `e.path[0]`, при дистанции <1.2 — `shift()`. Летуны (`fly`) и куклы (`net`) — БЕЗ путей (старое поведение).
- [ ] **Step 4: GREEN** (tsc → build → хеш → тест).
- [ ] **Step 5: Commit** `mtt: враги обходят стены (BFS-пути)`.

### Task C1: Сервер — режимы pvp/endless/invasion, килл-фид, официальные комнаты, TTL

**Files:**
- Modify: `server.ts` (тип `Room.mode` + TTL; `pvpHit`; `frags`; официальные комнаты; prune TTL)

**Interfaces:**
- Consumes: существующие `rooms`, `prune`, `beat` (`pubList` + `frags`), `Member` (+`frags:number`, `spec:boolean`).
- Produces: `POST /api/rooms/:id/pvphit {sid,target,dmg}` → `{foeHp,dead,frags}`; `beat` отдаёт `scoreboard:[{nick,kills}]` в pvp; комнаты `PVP-ARENA/BACKROOMS-ENDLESS/INVASION` живут всегда.

- [ ] **Step 1: RED-проверка (curl).** `curl -s -X POST 127.0.0.1:8095/api/rooms -d '{"nick":"T","mode":"pvp"}'` → сейчас `mode` схлопнется в `arena`. Зафиксировать: ответа с `"mode":"pvp"` нет.
- [ ] **Step 2: Implement.** `Room.mode` → `'arena'|'duel'|'backrooms'|'pvp'|'endless'|'invasion'`; cap: pvp 12, endless 10, invasion 10; TTL: `pvp:1200, endless:300, invasion:600` сек (`room.created`, `room.ttlSec`); в `prune` и в листинге: истёкшие комнаты удалять (`rooms.delete`), счётчик `restartIn = ttlSec - (now-created)/1000` отдавать в `info` и списке. Официальные: при старте `ensureOfficial()` создаёт 3 комнаты с фикс-кодами `PVP365/ENDLES/BRG666`... коды — 6 символов из `CODE_CHARS`: `PVP42X`, `END42X`, `INV42X` (имена «⚔️ PvP-арена», «🟨 Бесконечный Бэкрумс», «🌊 Нашествие»); вызывать в `Bun.serve` старте и в каждом `prune` (нет комнаты — пересоздать). `Member`: `+ frags: number; spec: boolean`. `POST pvphit`: только `pvp`; цель — другой игрок; `dmg=clamp(5,80)`; `foe.hp-=dmg` (обычные hp, не duelHp); смерть → `me.frags++`, `foe.hp=100`, `foe.dead=false`, респаун-координаты рандом (отдаём `{rx,rz}`); ответ `{foeHp, dead, frags, rx, rz}`. `beat`: в `others` добавить `frags`; в pvp добавить `scoreboard` (топ по `frags`: `[{nick,frags}]`, не более 12).
- [ ] **Step 3: Проверка.** `bun build ./server.ts --target bun` (exit 0) → curl-сценарий: create pvp → join → approve → start → pvphit до смерти → `frags:1`, `dead:true`, `rx/rz` в пределах арены → leave → комната осталась (официальную не удалять пока есть игроки; TTL дотянуть нельзя — проверить `restartIn` убывает).
- [ ] **Step 4: Commit СЕРВЕРА отдельно** `mtt-api: режимы pvp/endless/invasion + килл-фид + TTL` (без dist!).

### Task C2: Клиент PvP (без мобов, фраги, табло, ресаун)

**Files:** `src/game/engine.ts` (режим `pvp`: `enemiesOn=false`, `randomSpawn()`, хит по игрокам? — НЕТ: урон считают клиенты через `pvphit`, движок только прицел), `src/App.tsx` (табло `#scoreboard`, смерть → `#pvpDead` с кнопками).

- [ ] Step 1: e2e «pvp: два клиента, фраг в табло» (раннер vs страница через `pvphit`, табло содержит ник).
- [ ] Step 2: fail. Step 3: engine: при `mapChoice`/комнате pvp — `enemiesOn=false`; `randomSpawn()`: 24 попытки как в контракт
...[truncated 7373 chars]