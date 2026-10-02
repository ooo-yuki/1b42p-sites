import { test, expect, started } from './fixture';

interface Stats { maxhp: number; dmgMul: number; spd: number }
interface JblDbg { waveCd: number; charmCd: number; waveR: number; wavePush: number; charmR: number }
interface UpgState { hp: number; dmg: number; spd: number; sup: number }

test('🔧 Прокачка реально усиливает всех бойцов (hp/dmg/spd, кд и сила суперов)', async ({ page }) => {
  test.setTimeout(300000);
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
  await page.click('#goBtn');
  await started(page);
  const r = await page.evaluate(() => {
    const m = (window as unknown as { __mtt: {
      give: (n: number) => number;
      buyupg: (id: string, k: string) => boolean;
      upg: (id: string) => UpgState;
      supercd: (id: string) => number;
      stats: () => Stats;
      merap: () => { dmg: number };
      sun: () => { pow: number };
      blast: () => { pow: number };
      jbl: () => JblDbg;
      arbuz: () => { r: number };
      charaSet: (id: string) => string;
      doArbuz: () => boolean;
    } }).__mtt;
    m.give(10000000);
    // ❤️/💪/💨 на текущем бойце
    m.charaSet('mtt');
    const s0 = m.stats();
    m.buyupg('mtt', 'hp');
    m.buyupg('mtt', 'dmg');
    m.buyupg('mtt', 'spd');
    const s1 = m.stats();
    // кд-суперы: один уровень прокачки двигает кд
    const cd: Record<string, [number, number]> = {};
    for (const id of ['mtt', 'krysa', 'shuba', 'chuma', 'gidroxis']) {
      const a = m.supercd(id);
      m.buyupg(id, 'sup');
      cd[id] = [a, m.supercd(id)];
    }
    // сила суперов с фикс-кд: множитель ×1.15 за уровень
    const p0 = { sun: m.sun().pow, blast: m.blast().pow, jbl: m.jbl(), merap: m.merap().dmg };
    m.buyupg('sunstrike', 'sup');
    m.buyupg('utug', 'sup');
    m.buyupg('jbl', 'sup');
    m.buyupg('merap', 'sup');
    const p1 = { sun: m.sun().pow, blast: m.blast().pow, jbl: m.jbl(), merap: m.merap().dmg };
    // воронка: каст уже с прокачкой (радиус каста читает прокачку)
    m.charaSet('arbuz');
    m.buyupg('arbuz', 'sup');
    const cast = m.doArbuz();
    const arbuzR = m.arbuz().r;
    const u = { mtt: m.upg('mtt'), krysa: m.upg('krysa'), shuba: m.upg('shuba'), merap: m.upg('merap'), arbuz: m.upg('arbuz') };
    return { s0, s1, cd, p0, p1, cast, arbuzR, u };
  });
  console.log('DIAG upg audit ' + JSON.stringify(r));
  expect(r.s1.maxhp - r.s0.maxhp, '❤️ +15 maxHP за уровень').toBe(15);
  expect(r.s1.dmgMul - r.s0.dmgMul, '💪 +8% к урону за уровень').toBeCloseTo(0.08, 3);
  expect(r.s1.spd / r.s0.spd, '💨 +6% к скорости за уровень').toBeCloseTo(1.06, 3);
  expect(r.cd.mtt[1], 'МТТ: кд 3с → 2.7с').toBeCloseTo(2.7, 3);
  expect(r.cd.krysa[1], 'Крыса: кд 5с → 4.3с').toBeCloseTo(4.3, 3);
  expect(r.cd.shuba[1], 'Ивангой: кд 30с → 28с').toBeCloseTo(28, 3);
  expect(r.cd.chuma[1], 'Чума: кд 30с → 28с').toBeCloseTo(28, 3);
  expect(r.cd.gidroxis[1], 'Гидроксис: кд 20с → 19с').toBeCloseTo(19, 3);
  expect(r.p0.sun, 'санстрайк: множитель до прокачки').toBe(1);
  expect(r.p1.sun, 'санстрайк: урон ×1.15').toBeCloseTo(1.15, 3);
  expect(r.p1.blast, 'утюг: урон взрыва ×1.15').toBeCloseTo(1.15, 3);
  expect(r.p1.jbl.waveR, 'JBLка: радиус волны 12м → 13.8м').toBeCloseTo(13.8, 2);
  expect(r.p1.jbl.wavePush, 'JBLка: отброс 5м → 5.75м').toBeCloseTo(5.75, 2);
  expect(r.p1.jbl.charmR, 'JBLка: радиус подчинения 5м → 5.75м').toBeCloseTo(5.75, 2);
  expect(r.p1.merap, 'мерап: урон 80 → 92.4').toBeGreaterThan(r.p0.merap);
  expect(r.p1.merap, 'мерап: урон первого уровня').toBeCloseTo(92.4, 1);
  expect(r.cast, 'воронка активировалась').toBe(true);
  expect(r.arbuzR, 'воронка: радиус 5м → 5.75м от прокачки').toBeCloseTo(5.75, 2);
  expect(r.u.mtt.hp, '❤️ записан для МТТ').toBe(1);
  expect(r.u.mtt.dmg, '💪 записан для МТТ').toBe(1);
  expect(r.u.mtt.spd, '💨 записан для МТТ').toBe(1);
  expect(r.u.krysa.sup, 'качается кд-супер Крысы').toBe(1);
  expect(r.u.shuba.sup, 'качается кд-супер Ивангоя').toBe(1);
  expect(r.u.merap.sup, 'прокачка мерапа пишется (раньше терялась)').toBe(1);
  expect(r.u.arbuz.sup, 'прокачка воронки пишется').toBe(1);
});
