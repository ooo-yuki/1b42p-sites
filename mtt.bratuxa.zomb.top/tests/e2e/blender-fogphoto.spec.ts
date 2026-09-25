import { test, expect } from './fixture';

// Временный фотоотчёт DOM-тумана (удалить после проверки).
test('blender fog photo', async ({ page }) => {
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
  await page.screenshot({ path: 'test-results/fog-dom.jpg', type: 'jpeg', quality: 45 });
  const ov = await page.evaluate(() => {
    const el = document.getElementById('fogOverlay');
    if (!el) return { exists: false };
    const r = el.getBoundingClientRect();
    const cx = Math.floor(window.innerWidth / 2), by = Math.floor(window.innerHeight * 0.95);
    const topAtBottom = document.elementFromPoint(cx, by);
    return {
      exists: true, inline: (el as HTMLElement).style.opacity, computed: getComputedStyle(el).opacity,
      rect: { x: r.x, y: r.y, w: r.width, h: r.height },
      topAtBottom: topAtBottom ? ((topAtBottom as HTMLElement).id || topAtBottom.tagName) : 'none',
      bg: getComputedStyle(el).backgroundImage.slice(0, 80),
    };
  });
  console.log('DIAG fogOverlay ' + JSON.stringify(ov));
});
