import { test, expect } from './fixture';

// Временный кадр box-shadow тумана (удалить после проверки).
test('blender fog boxshot', async ({ page }) => {
  test.setTimeout(240000);
  await page.addInitScript(() => localStorage.setItem('mtt_dev', '1'));
  await page.goto('/');
  await expect(page).toHaveTitle(/42 LIVE/);
  await page.click('#guestBtn');
  await page.click('#nav-maps');
  await page.evaluate(() => (document.querySelector('#map-blender') as HTMLButtonElement).click());
  await page.click('#nav-play');
  await page.click('#goBtn');
  await expect(page.locator('#fps')).toBeVisible({ timeout: 30000 });
  await page.waitForFunction(
    () => (window as unknown as { __mtt: { solids: () => unknown[] } }).__mtt.solids().length > 100,
    null,
    { timeout: 180000, polling: 2000 },
  );
  await page.waitForTimeout(8000);
  type C = { teleport: (x: number, z: number) => unknown };
  await page.evaluate(() => (window as unknown as { __mtt: C }).__mtt.teleport(-19, 66));
  await page.waitForTimeout(3000);
  await page.setViewportSize({ width: 640, height: 360 });
  await page.waitForTimeout(1500);
  const pre = await page.evaluate(() => {
    const el = document.getElementById('fogOverlay') as HTMLElement | null;
    const m = window as unknown as { __mtt: {
      flagFog: () => { built: boolean; cells: number; cam: number };
      pos: () => { x: number; z: number };
    } };
    const p = m.__mtt.pos();
    return { op: el ? getComputedStyle(el).opacity : 'n/a', cam: m.__mtt.flagFog(), x: Math.round(p.x * 10) / 10, z: Math.round(p.z * 10) / 10 };
  });
  console.log('DIAG pre-shot ' + JSON.stringify(pre));
  await page.screenshot({ path: 'test-results/fog-box.jpg', type: 'jpeg', quality: 45 });
  const dbg = await page.evaluate(() => {
    const el = document.getElementById('fogOverlay') as HTMLElement | null;
    const m = window as unknown as { __mtt: {
      flagFog: () => { built: boolean; cells: number; cam: number };
      pos: () => { x: number; z: number };
    } };
    return {
      op: el ? getComputedStyle(el).opacity : 'n/a',
      sh: el ? getComputedStyle(el).boxShadow.slice(0, 60) : 'n/a',
      fog: m.__mtt.flagFog(),
      px: m.__mtt.pos(),
    };
  });
  console.log('DIAG fogstate ' + JSON.stringify(dbg));
  // свип размера блюра: 20 / 60 / 150 — что красит?
  for (const [tag, blur] of [['s20', 20], ['s60', 60], ['s150', 150]] as Array<[string, number]>) {
    await page.evaluate((b) => {
      const el = document.getElementById('fogOverlay') as HTMLElement | null;
      if (el) (el as HTMLElement).style.boxShadow = `inset 0 0 ${b}px 40px rgba(22,4,46,0.96)`;
    }, blur);
    await page.waitForTimeout(800);
    await page.screenshot({ path: `test-results/fog-sweep-${tag}.jpg`, type: 'jpeg', quality: 45 });
  }
  console.log('DIAG sweep done');
  await page.evaluate(() => {
    const el = document.getElementById('fogOverlay') as HTMLElement | null;
    if (el) el.style.display = 'none';
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'test-results/fog-boxoff.jpg', type: 'jpeg', quality: 45 });
  console.log('DIAG fog box shots saved');
});
