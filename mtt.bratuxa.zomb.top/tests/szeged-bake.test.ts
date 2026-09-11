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
