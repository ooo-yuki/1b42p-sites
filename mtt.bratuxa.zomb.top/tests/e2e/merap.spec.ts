import { test, expect, started } from './fixture';

interface MerapDbg {
  cd: number;
  win: number;
  aim: number;
  laser: number;
  marks: number;
  target: string | null;
  blocked: boolean;
  dmg: number;
}
interface Foe { id: number; kind: string; x: number; z: number; hp: number; dead: boolean }

interface WallOut {
  noFoe: boolean;
  go: boolean;
  marks: number;
  aimMax: number;
  laserMax: number;
  blockedSeen: boolean;
  blockedFrames: number;
  openFrames: number;
  reacts: number;
  hpThen: number;
  hpNow: number;
  scanMaxMs: number;
  scans: number;
  iters: number;
  iterMaxMs: number;
  tSleepMax: number;
  tStandMax: number;
  tMerapMax: number;
  offFound: boolean;
  d: MerapDbg | null;
}

test('💜 Лорд Мерап: мифик в ростере, кд всегда 60с, урон 80→142', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
  await page.click('#nav-fighter');
  await expect(page.locator('#char-merap')).toBeVisible();
  await expect(page.locator('#rarity-merap')).toContainText('Мифический');
  await expect(page.locator('#locked-merap')).toHaveCount(1);
  await expect(page.locator('#pick-merap')).toBeDisabled();
  await expect(page.locator('#abilities-merap')).toContainText(/фиолетовый/i);
  const r = await page.evaluate(() => {
    const m = (window as unknown as { __mtt: {
      merap: () => { dmg: number };
      supercd: (id: string) => number;
      give: (n: number) => number;
      buyupg: (id: string, k: string) => boolean;
      upg: (id: string) => { sup: number };
    } }).__mtt;
    const base = { cd: m.supercd('merap'), dmg: m.merap().dmg };
    m.give(2000000);
    let bought = 0;
    for (let i = 0; i < 5; i++) if (m.buyupg('merap', 'sup')) bought++;
    return { ...base, bought, sup: m.upg('merap').sup, cdMax: m.supercd('merap'), dmgMax: m.merap().dmg };
  });
  console.log('DIAG merap cfg ' + JSON.stringify(r));
  expect(r.cd, 'кд без прокачки').toBe(60);
  expect(r.dmg, 'урон на первом уровне').toBe(80);
  expect(r.bought, 'супер прокачан 5 раз').toBe(5);
  expect(r.sup).toBe(5);
  expect(r.cdMax, 'прокачка не двигает кд').toBe(60);
  expect(r.dmgMax, 'урон на максимуме').toBe(142);
});

test('💜 Лорд Мерап: окно 10с → наведение 5с → луч 2с, цель ранена', async ({ page }) => {
  test.setTimeout(300000);
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
  await page.click('#goBtn');
  await started(page);
  const out = await page.evaluate(async () => {
    const m = (window as unknown as { __mtt: {
      merap: () => MerapDbg;
      doMerap: () => boolean;
      charaSet: (id: string) => string;
      spawnKind: (kind: string) => number;
      foes: () => Foe[];
      solidAt: (x: number, z: number, y: number, r?: number) => boolean;
      teleport: (x: number, z: number, yaw?: number) => void;
      merapLos: (x: number, y: number, z: number) => boolean;
      devgod: (on: boolean) => void;
    } }).__mtt;
    m.charaSet('merap');
    m.devgod(true);
    m.spawnKind('walk');
    await new Promise((r) => setTimeout(r, 500));
    const all = (): Foe[] => m.foes();
    const hpById = (id: number): number => {
      const f = all().find((x) => x.id === id);
      return f ? f.hp : 0;
    };
    const OFFS: Array<[number, number]> = [[0, 8], [0, -8], [8, 0], [-8, 0], [0, 12], [12, 0], [0, -12], [-12, 0], [0, 16], [16, 0]];
    // встать в 8–16м от пешей цели, смотреть на неё; берём точку с ЧИСТЫМ обзором,
    // иначе луч упирается в стену и урона не будет (за стеной — это отдельный тест)
    const placeAt = (f: Foe, requireLos: boolean): number => {
      let placed = 0;
      for (const [ox, oz] of OFFS) {
        const px = f.x + ox, pz = f.z + oz;
        if (m.solidAt(px, pz, 0) || m.solidAt(px, pz, 1.7)) continue;
        m.teleport(px, pz, Math.atan2(ox, oz));
        if (m.merapLos(f.x, 1.0, f.z)) return 2;
        placed = 1;
        if (!requireLos) return 1;
      }
      return placed;
    };
    const walk = (): Foe[] => all().filter((x) => !x.dead && x.kind === 'walk');
    const pickFoe = (): number => {
      const foes = walk();
      for (const f of foes) if (placeAt(f, true) === 2) return f.id;
      if (foes.length) placeAt(foes[0], false);
      return foes.length ? foes[0].id : -1;
    };
    let foeId = pickFoe();
    const aimAt = (): boolean => {
      let f = all().find((x) => x.id === foeId && !x.dead);
      if (!f) { foeId = pickFoe(); f = all().find((x) => x.id === foeId && !x.dead); }
      if (!f) return false;
      if (placeAt(f, true) === 2) return true;
      return placeAt(f, false) > 0;
    };
    aimAt();
    const go = m.doMerap();
    let marks = 0, aimMax = 0, laserMax = 0, fx = false, blockedFrames = 0;
    let ids: number[] = [], hpThen = 0, hpNow = 0;
    const t0 = performance.now();
    let d: MerapDbg = m.merap();
    // стагнации страницы не роняют тест: выходы по игровому времени, кап по стене щедрый
    while (performance.now() - t0 < 45000) {
      aimAt();
      d = m.merap();
      marks = Math.max(marks, d.marks);
      aimMax = Math.max(aimMax, d.aim);
      if (d.laser > 0) {
        laserMax = Math.max(laserMax, d.laser);
        if (d.blocked) blockedFrames++;
        if (!ids.length) {
          ids = all().filter((f) => !f.dead).map((f) => f.id);
          hpThen = ids.reduce((s, id) => s + hpById(id), 0);
        }
      }
      const fxEl = document.getElementById('merapFx');
      fx = fx || !!fxEl?.classList.contains('on');
      if (laserMax > 0 && d.laser === 0) break;
      if (laserMax === 0 && d.win === 0 && performance.now() - t0 > 4000) break;
      await new Promise((r) => setTimeout(r, 200));
    }
    if (ids.length) hpNow = ids.reduce((s, id) => s + hpById(id), 0);
    return { go, marks, aimMax, laserMax, fx, hpThen, hpNow, blockedFrames, ids: ids.length, d };
  });
  console.log('DIAG merap run ' + JSON.stringify(out));
  expect(out.go, 'супер активировался').toBe(true);
  expect(out.marks, 'окружности-цели нарисовались').toBeGreaterThan(0);
  expect(out.aimMax, 'наведение копилось почти до 5с').toBeGreaterThanOrEqual(4.4);
  expect(out.laserMax, 'луч выстрелил').toBeGreaterThan(0);
  expect(out.fx, 'фиолетовый экран включался').toBe(true);
  expect(out.ids, 'была запертая цель').toBeGreaterThan(0);
  expect(out.hpNow, 'урон по цели нанесён').toBeLessThan(out.hpThen - 10);
  expect(out.d.win, 'окно закрылось').toBe(0);
  expect(out.d.laser, 'луч кончился').toBe(0);
  expect(out.d.cd, 'кд пошёл с 60с').toBeGreaterThan(45);
  await expect(page.locator('#hudRow2')).toContainText('💜');
});

test('💜 Лорд Мерап: за стеной луч не наносит урона', async ({ page }) => {
  // щедрый кап: на сервере бывают многосекундные стагнации страницы (софт-рендер)
  test.setTimeout(300000);
  const tBoot = Date.now();
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
  await page.click('#goBtn');
  const tGo = Date.now();
  await started(page);
  const tReady = Date.now();
  const out = await page.evaluate<WallOut, unknown>(async () => {
    const m = (window as unknown as { __mtt: {
      merap: () => MerapDbg;
      doMerap: () => boolean;
      merapLos: (x: number, y: number, z: number) => boolean;
      charaSet: (id: string) => string;
      spawnKind: (kind: string) => number;
      foes: () => Foe[];
      solidAt: (x: number, z: number, y: number, r?: number) => boolean;
      teleport: (x: number, z: number, yaw?: number) => void;
      devgod: (on: boolean) => void;
    } }).__mtt;
    const res: WallOut = {
      noFoe: false, go: false, marks: 0, aimMax: 0, laserMax: 0,
      blockedSeen: false, blockedFrames: 0, openFrames: 0, reacts: 0, hpThen: 0, hpNow: 0,
      scanMaxMs: 0, scans: 0, iters: 0, iterMaxMs: 0, tSleepMax: 0, tStandMax: 0, tMerapMax: 0, offFound: false, d: null,
    };
    m.charaSet('merap');
    m.devgod(true);
    m.spawnKind('walk');
    await new Promise((r) => setTimeout(r, 500));
    const walk = (): Foe[] => m.foes().filter((f) => !f.dead && f.kind === 'walk');
    const hpById = (id: number): number => {
      const f = m.foes().find((x) => x.id === id);
      return f ? f.hp : 0;
    };
    // ищем точку, из которой цель ЗА СТЕНОЙ; тень должна держаться и когда цель сдвинется.
    // полный скан дорогой (сотни вызовов LOS) — режем по бюджету, иначе главный поток занят
    // и игровые часы стоят (окно/наведение не идут)
    const PROBES: Array<[number, number]> = [[0, 0], [1.4, 0], [-1.4, 0], [0, 1.4], [0, -1.4]];
    let off: [number, number] | null = null;
    let lastScan = -1e9;
    let budget = 2000;
    const scan = (f: Foe): boolean => {
      const t0s = performance.now();
      res.scans++;
      let loose = false;
      let stop = false;
      for (let r = 6; r <= 44 && !stop; r += 3) {
        for (let k = 0; k < 16 && !stop; k++) {
          if (performance.now() - t0s > budget) { stop = true; break; }
          const a = (k / 16) * Math.PI * 2;
          const px = f.x + Math.cos(a) * r, pz = f.z + Math.sin(a) * r;
          if (m.solidAt(px, pz, 0) || m.solidAt(px, pz, 1.7)) continue;
          m.teleport(px, pz, Math.atan2(px - f.x, pz - f.z));
          if (m.merapLos(f.x, 1.0, f.z)) continue;
          // тень есть — широкая (держится при сдвиге цели ±1.4м) предпочтительнее
          off = [px - f.x, pz - f.z];
          if (PROBES.every(([dx, dz]) => !m.merapLos(f.x + dx, 1.0, f.z + dz))) stop = true;
          else loose = true;
        }
      }
      const ms = performance.now() - t0s;
      if (ms > res.scanMaxMs) res.scanMaxMs = ms;
      lastScan = performance.now();
      return loose || !!off;
    };
    // тени нет: просто встать свободно напротив цели — наведение должно идти в любом случае
    const freeNear = (f: Foe): void => {
      for (const r of [7, 10, 14, 20]) {
        for (let k = 0; k < 8; k++) {
          const a = (k / 8) * Math.PI * 2;
          const px = f.x + Math.cos(a) * r, pz = f.z + Math.sin(a) * r;
          if (m.solidAt(px, pz, 0) || m.solidAt(px, pz, 1.7)) continue;
          m.teleport(px, pz, Math.atan2(px - f.x, pz - f.z));
          return;
        }
      }
    };
    // дешёвая перестановка вслед за целью с тем же смещением; тень спала — скан по таймеру
    const stand = (f: Foe): void => {
      if (!off) {
        freeNear(f);
        if (performance.now() - lastScan >= 1500) scan(f);
        return;
      }
      const px = f.x + off[0], pz = f.z + off[1];
      if (!m.solidAt(px, pz, 0) && !m.solidAt(px, pz, 1.7)) {
        m.teleport(px, pz, Math.atan2(px - f.x, pz - f.z));
        if (!m.merapLos(f.x, 1.0, f.z)) return; // тень держится
      }
      if (performance.now() - lastScan >= 400) scan(f);
    };
    const first = walk()[0];
    if (!first) { res.noFoe = true; return res; }
    scan(first);
    budget = 150; // в бою скан короткий: блокировка главного потока убивает игровые часы
    res.go = m.doMerap();
    const idsAt = (): number[] => m.foes().filter((x) => !x.dead).map((x) => x.id);
    const t0 = performance.now();
    let d: MerapDbg = m.merap();
    // длинные кадры/ГЦ страницы не должны съедать тест: кап по стене щедрый,
    // выходы — по игровому времени (окно истекло / луч кончился)
    while (performance.now() - t0 < 90000) {
      const tIter = performance.now();
      const tm0 = performance.now();
      d = m.merap();
      const tm = performance.now() - tm0;
      if (tm > res.tMerapMax) res.tMerapMax = tm;
      res.iters++;
      const f = walk()[0];
      const ts0 = performance.now();
      if (f) {
        if (d.laser > 0) {
          // тень держится — стоим; спала — переставляемся (скан не чаще 400мс)
          if (!d.blocked) { res.reacts++; stand(f); }
        } else {
          stand(f);
        }
      }
      const ts = performance.now() - ts0;
      if (ts > res.tStandMax) res.tStandMax = ts;
      res.marks = Math.max(res.marks, d.marks);
      res.aimMax = Math.max(res.aimMax, d.aim);
      if (d.laser > 0) {
        res.laserMax = Math.max(res.laserMax, d.laser);
        if (d.blocked) { res.blockedSeen = true; res.blockedFrames++; } else res.openFrames++;
        if (!res.hpThen) {
          const ids = idsAt();
          res.hpThen = ids.reduce((s, id) => s + hpById(id), 0) || 1;
          res.hpNow = res.hpThen;
        } else {
          res.hpNow = idsAt().reduce((s, id) => s + hpById(id), 0);
        }
      }
      if (res.laserMax > 0 && d.laser === 0) break;
      if (res.laserMax === 0 && d.win === 0 && performance.now() - t0 > 4000) break;
      const tsl0 = performance.now();
      await new Promise((r) => setTimeout(r, 100));
      const tsl = performance.now() - tsl0;
      if (tsl > res.tSleepMax) res.tSleepMax = tsl;
      const im = performance.now() - tIter;
      if (im > res.iterMaxMs) res.iterMaxMs = im;
    }
    if (res.hpThen) res.hpNow = idsAt().reduce((s, id) => s + hpById(id), 0);
    res.offFound = !!off;
    res.d = d;
    return res;
  });
  console.log('DIAG merap wall ' + JSON.stringify(out));
  console.log('DIAG wall stages ' + JSON.stringify({ go: tGo - tBoot, ready: tReady - tGo, eval: Date.now() - tReady }));
  expect(out.noFoe, 'цель есть').toBe(false);
  expect(out.go, 'супер активировался').toBe(true);
  expect(out.aimMax, 'наведение шло сквозь стену').toBeGreaterThanOrEqual(4.4);
  expect(out.laserMax, 'луч выстрелил').toBeGreaterThan(0);
  expect(out.blockedSeen, 'луч упёрся в стену').toBe(true);
  // за стеной урона почти нет: полный выстрел — 80
  expect(out.hpThen - out.hpNow, 'урон за стеной заглушен').toBeLessThan(30);
});
