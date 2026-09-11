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

test('szeged v-flip: v_raw=0 семплит НИЗ тайла (GL-инверт внутри тайла)', () => {
  // bake кладёт vv = 1-(ry+(1-v_raw)*h)/H: SketchUp пишет TEXCOORD
  // в GL-соглашении (v=0 = НИЗ картинки), а PIL-тайл лежит сверху вниз
  // (row 0 = верх). Без (1-v_raw) все текстуры перевёрнуты вверх ногами.
  const vv = (ry: number, h: number, H: number, v_raw: number) =>
    1 - (ry + (1 - v_raw) * h) / H;
  const ry = 100, h = 200, H = 2000;
  // v_raw=0 → низ тайла в PIL (ry+h) → низ в GL: vv = 1-(ry+h)/H
  expect(vv(ry, h, H, 0)).toBeCloseTo(1 - (ry + h) / H, 12);
  // v_raw=1 → верх тайла: vv = 1-ry/H
  expect(vv(ry, h, H, 1)).toBeCloseTo(1 - ry / H, 12);
  // середина тайла неподвижна при инверте
  expect(vv(ry, h, H, 0.5)).toBeCloseTo(1 - (ry + h / 2) / H, 12);
});

test('szeged white fallback: земля без текстуры — одна uv-точка (инверт не трогает)', () => {
  const m = mesh as unknown as { colors: number[]; col_index: number[]; uv: number[] };
  // GROUND_TINT из bake (0.42, 0.4, 0.37), round(3) — только страховочная земля
  let gci = -1;
  for (let i = 0; i < m.colors.length; i += 3) {
    if (m.colors[i] === 0.42 && m.colors[i + 1] === 0.4 && m.colors[i + 2] === 0.37) { gci = i / 3; break; }
  }
  expect(gci).toBeGreaterThanOrEqual(0);
  const seen = new Set<string>();
  for (let t = 0; t < m.col_index.length; t++) {
    if (m.col_index[t] === gci) {
      for (let c = 0; c < 3; c++) {
        const k = t * 3 + c;
        seen.add(`${m.uv[2 * k]},${m.uv[2 * k + 1]}`);
      }
    }
  }
  expect(seen.size).toBeGreaterThan(0);
  expect(seen.size).toBe(1);
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
