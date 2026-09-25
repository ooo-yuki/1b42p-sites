import { test, expect } from './fixture';

// Временный поиск твёрдой земли в фиолетовой зоне (удалить после проверки).
test('blender purple ground probe', async ({ page }) => {
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
  type C = {
    teleport: (x: number, z: number) => unknown;
    ground: (x: number, z: number) => number;
    pos: () => { x: number; z: number; py: number };
  };
  const pts: Array<[number, number]> = [[-19, 66], [-40, 60], [0, 70], [-19, 40], [10, 60], [-50, 70], [-30, 80], [0, 50]];
  for (const [x, z] of pts) {
    await page.evaluate(([a, b]) => (window as unknown as { __mtt: C }).__mtt.teleport(a, b), [x, z]);
    await page.waitForTimeout(2500);
    const s = await page.evaluate(([a, b]) => {
      const m = window as unknown as { __mtt: C };
      const p = m.__mtt.pos();
      return { g: m.__mtt.ground(a, b), py: Math.round(p.py * 10) / 10 };
    }, [x, z]);
    console.log(`DIAG groundprobe (${x},${z}) ground=${s.g} py=${s.py}`);
  }
});
