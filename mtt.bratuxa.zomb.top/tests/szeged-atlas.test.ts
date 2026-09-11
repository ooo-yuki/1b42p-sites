import { expect, test } from 'bun:test';
import { existsSync, statSync } from 'node:fs';
import mesh from '../src/assets/szeged.mesh.json';

const ATLAS = new URL('../src/assets/szeged-atlas.jpg', import.meta.url);

test('szeged atlas: файл существует и не пуст', () => {
  expect(existsSync(ATLAS), 'нет src/assets/szeged-atlas.jpg — запусти tools/bake-szeged.py').toBe(true);
  const bytes = statSync(ATLAS).size;
  expect(bytes).toBeGreaterThan(10 * 1024);
  expect(bytes).toBeLessThan(1.5 * 1024 * 1024);
});

test('szeged mesh-3: uv.length == verts (пары на угол)', () => {
  expect(mesh.format).toBe('szeged-mesh-3');
  const corners = (mesh.pos_index as number[]).length;
  const uvPairs = (mesh.uv as number[]).length / 2;
  expect((mesh.uv as number[]).length % 2).toBe(0);
  expect(uvPairs).toBe(corners);
  expect(uvPairs).toBeGreaterThan(10000);
});

test('szeged unresolved: меньше 10, список в ошибке', () => {
  const un = mesh.unresolved as string[];
  expect(Array.isArray(un)).toBe(true);
  expect(un.length, `unresolved textures: ${JSON.stringify(un)}`).toBeLessThan(10);
});

test('szeged atlas: тайлы ≤512px, зазоры ≥16px (anti-mip-bleed)', () => {
  const tiles = (mesh as unknown as { atlas_tiles: Record<string, number[]> }).atlas_tiles;
  const rects = Object.values(tiles);
  expect(rects.length).toBeGreaterThan(10);
  for (const r of rects) {
    expect(r[2]).toBeLessThanOrEqual(512);
    expect(r[3]).toBeLessThanOrEqual(512);
  }
  let minGap = Infinity;
  for (let i = 0; i < rects.length; i++) {
    const [ax, ay, aw, ah] = [rects[i]![0]!, rects[i]![1]!, rects[i]![2]!, rects[i]![3]!];
    for (let j = i + 1; j < rects.length; j++) {
      const [bx, by, bw, bh] = [rects[j]![0]!, rects[j]![1]!, rects[j]![2]!, rects[j]![3]!];
      const dx = Math.max(ax - (bx + bw), bx - (ax + aw), 0);
      const dy = Math.max(ay - (by + bh), by - (ay + ah), 0);
      const gap = dx === 0 ? dy : dy === 0 ? dx : Math.hypot(dx, dy);
      if (gap < minGap) minGap = gap;
    }
  }
  expect(minGap).toBeGreaterThanOrEqual(16);
});
