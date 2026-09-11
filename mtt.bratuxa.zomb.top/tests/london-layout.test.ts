import { expect, test } from 'bun:test';
import mesh from '../src/assets/szeged.mesh.json';
import solids from '../src/assets/szeged.solids.json';
test('london: поле 170 и бюджет', () => {
  expect(mesh.format).toBe('szeged-mesh-3');
  const xs = (mesh.positions as number[]).filter((_, i) => i % 3 === 0);
  const zs = (mesh.positions as number[]).filter((_, i) => i % 3 === 2);
  expect(Math.max(...xs) - Math.min(...xs)).toBeLessThanOrEqual(180);
  expect(Math.max(...xs) - Math.min(...xs)).toBeGreaterThan(150);
  expect((solids as unknown[]).length).toBeLessThanOrEqual(2000);
});
