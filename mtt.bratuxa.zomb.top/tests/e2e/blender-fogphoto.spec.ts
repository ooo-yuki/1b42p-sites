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
  // градиент, набранный вручную в evaluate (проверка на битые символы в JSX-строке)
  const grad = await page.evaluate(() => {
    const el = document.getElementById('fogOverlay') as HTMLElement | null;
    if (!el) return { exists: false };
    el.style.background = 'radial-gradient(ellipse at center, rgba(22,4,46,0) 16%, rgba(22,4,46,0.55) 42%, rgba(16,3,40,0.96) 72%)';
    return { exists: true, computed: getComputedStyle(el).backgroundImage.slice(0, 60) };
  });
  console.log('DIAG retyped-gradient ' + JSON.stringify(grad));
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'test-results/fog-retyped.jpg', type: 'jpeg', quality: 45 });
  // A/B на месте: оверлей ВКЛ против ВЫКЛ, та же точка — разница пикселей решает спор
  const tree = await page.evaluate(() => {
    const el = document.getElementById('fogOverlay') as HTMLElement | null;
    const cv = document.getElementById('c') as HTMLElement | null;
    const chain = (n: HTMLElement | null): string[] => {
      const out: string[] = [];
      let e: HTMLElement | null = n;
      while (e && out.length < 6) {
        const cs = getComputedStyle(e);
        out.push(`${e.tagName}#${e.id || '-'} z=${cs.zIndex} pos=${cs.position} tr=${cs.transform !== 'none' ? 'Y' : '-'} op=${cs.opacity}`);
        e = e.parentElement;
      }
      return out;
    };
    return { ov: chain(el), cv: chain(cv) };
  });
  console.log('DIAG stacking ' + JSON.stringify(tree));
  await page.evaluate(() => {
    const el = document.getElementById('fogOverlay') as HTMLElement | null;
    if (el) el.style.display = 'none';
  });
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'test-results/fog-off.jpg', type: 'jpeg', quality: 90 });
  const ov = await page.evaluate(() => {
    const el = document.getElementById('fogOverlay') as HTMLElement | null;
    return { exists: !!el, op: el ? getComputedStyle(el).opacity : 'n/a' };
  });
  console.log('DIAG fogAB ' + JSON.stringify(ov));
  console.log('DIAG fogOverlay ' + JSON.stringify(ov));
});
