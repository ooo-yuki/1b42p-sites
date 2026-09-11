import { expect, test } from 'bun:test';
import { statSync } from 'node:fs';
import mesh from '../src/assets/szeged.mesh.json';
import solids from '../src/assets/szeged.solids.json';
test('mesh: индексная схема, силуэт и бюджет', () => {
  expect(mesh.format).toBe('szeged-mesh-3');
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
    // кап бокса: гиганты 56×64м замуровывают улицы — нарезка hx,hz<=12м
    expect(s.hx).toBeLessThanOrEqual(12.01);
    expect(s.hz).toBeLessThanOrEqual(12.01);
  }
});
test('solids: улицы проходимы — BFS 2м между 4 спавнами', () => {
  // спавны как в engine buildSzeged: half от bbox меша + 4 угла ядра
  const xs: number[] = []; const zs: number[] = [];
  for (let i = 0; i < mesh.positions.length; i += 3) { xs.push(mesh.positions[i]); zs.push(mesh.positions[i + 2]); }
  const half = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...zs) - Math.min(...zs)) / 2 + 10;
  const S = half - 10;
  const spawns: Array<[number, number]> = [[-S, -S], [S, -S], [-S, S], [S, S]];
  type Solid = { x: number; z: number; hx: number; hz: number; h: number; deck?: boolean };
  const blocked = (px: number, pz: number, rad = 1.0): boolean => {
    for (const s of (solids as Solid[])) {
      if (s.h < 0.5) continue;
      if (Math.abs(px - s.x) <= s.hx + rad && Math.abs(pz - s.z) <= s.hz + rad) return true;
    }
    return false;
  };
  const nearestFree = (qx: number, qz: number): [number, number] | null => {
    if (!blocked(qx, qz)) return [qx, qz];
    for (let r = 2; r < 40; r += 2) {
      for (let dx = -r; dx <= r; dx += 2) {
        for (const dz of [-r, r]) if (!blocked(qx + dx, qz + dz)) return [qx + dx, qz + dz];
      }
      for (let dz = -r + 2; dz < r; dz += 2) {
        for (const dx of [-r, r]) if (!blocked(qx + dx, qz + dz)) return [qx + dx, qz + dz];
      }
    }
    return null;
  };
  const free = spawns.map(([qx, qz]) => nearestFree(qx, qz));
  for (const p of free) expect(p).not.toBeNull();
  // BFS по сетке 2м, 4-связность: путь обязан существовать между соседями
  const bfs = (a: [number, number], b: [number, number]): number | null => {
    const cell = 2.0;
    const gx = (v: number): number => Math.round(v / cell);
    const key = (x: number, z: number): string => x + ':' + z;
    const start = key(gx(a[0]), gx(a[1]));
    const goal = key(gx(b[0]), gx(b[1]));
    const seen = new Set<string>([start]);
    const dist = new Map<string, number>([[start, 0]]);
    const q: Array<[number, number]> = [[gx(a[0]), gx(a[1])]];
    while (q.length > 0) {
      const [cx, cz] = q.shift()!;
      if (key(cx, cz) === goal) return dist.get(key(cx, cz))!;
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as Array<[number, number]>) {
        const nx = cx + dx, nz = cz + dz;
        if (seen.has(key(nx, nz))) continue;
        if (blocked(nx * cell, nz * cell)) continue;
        seen.add(key(nx, nz));
        dist.set(key(nx, nz), dist.get(key(cx, cz))! + 1);
        q.push([nx, nz]);
      }
    }
    return null;
  };
  for (let i = 0; i < free.length - 1; i++) {
    const d = bfs(free[i]!, free[i + 1]!);
    expect(d).not.toBeNull();
  }
});
