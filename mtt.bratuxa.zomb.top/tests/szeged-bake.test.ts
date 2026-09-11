import { expect, test } from 'bun:test';
import { statSync } from 'node:fs';
import mesh from '../src/assets/szeged.mesh.json';
import solids from '../src/assets/szeged.solids.json';
test('mesh: индексная схема, силуэт и бюджет', () => {
  expect(mesh.format).toBe('szeged-mesh-2');
  expect(mesh.positions.length % 3).toBe(0);
  expect(mesh.normals.length % 3).toBe(0);
  expect(mesh.colors.length % 3).toBe(0);
  expect(mesh.positions.length / 3).toBeGreaterThan(1000);
  expect(mesh.pos_index.length % 3).toBe(0);
  expect(mesh.pos_index.length).toBe(mesh.nor_index.length);
  expect(mesh.col_index.length).toBe(mesh.pos_index.length / 3);
  expect(mesh.col_index.length).toBeGreaterThan(10000);
  const nv = mesh.positions.length / 3;
  const nn = mesh.normals.length / 3;
  const nc = mesh.colors.length / 3;
  let maxPi = 0; let maxNi = 0; let maxCi = 0;
  for (const i of mesh.pos_index) { if (i > maxPi) maxPi = i; }
  for (const i of mesh.nor_index) { if (i > maxNi) maxNi = i; }
  for (const i of mesh.col_index) { if (i > maxCi) maxCi = i; }
  expect(maxPi).toBeGreaterThanOrEqual(0); expect(maxPi).toBeLessThan(nv);
  expect(maxNi).toBeGreaterThanOrEqual(0); expect(maxNi).toBeLessThan(nn);
  expect(maxCi).toBeGreaterThanOrEqual(0); expect(maxCi).toBeLessThan(nc);
  expect(Math.min(...mesh.pos_index)).toBeGreaterThanOrEqual(0);
  expect(Math.min(...mesh.nor_index)).toBeGreaterThanOrEqual(0);
  expect(Math.min(...mesh.col_index)).toBeGreaterThanOrEqual(0);
  const xs: number[] = []; const zs: number[] = [];
  for (let i = 0; i < mesh.positions.length; i += 3) { xs.push(mesh.positions[i]); zs.push(mesh.positions[i + 2]); }
  // true-scale ядро: до ~350м на большей стороне
  expect(Math.max(...xs) - Math.min(...xs)).toBeLessThanOrEqual(360);
  expect(Math.max(...zs) - Math.min(...zs)).toBeLessThanOrEqual(360);
  expect(Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...zs) - Math.min(...zs))).toBeGreaterThan(150);
  const bytes = statSync(new URL('../src/assets/szeged.mesh.json', import.meta.url)).size;
  expect(bytes).toBeLessThan(2.5 * 1024 * 1024);
});
test('solids: внутри арены, счёт в бюджете', () => {
  expect(solids.length).toBeGreaterThan(10);
  expect(solids.length).toBeLessThanOrEqual(2000);
  for (const s of solids) {
    expect(Math.abs(s.x)).toBeLessThanOrEqual(180);
    expect(Math.abs(s.z)).toBeLessThanOrEqual(180);
    expect(s.hx).toBeGreaterThan(0); expect(s.hz).toBeGreaterThan(0); expect(s.h).toBeGreaterThan(0);
  }
});
