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

test('szeged safety ground: страховочная земля — box-mapping в асфальт (не белая точка)', () => {
  const m = mesh as unknown as {
    colors: number[]; col_index: number[]; uv: number[];
    atlas_tiles: Record<string, number[]>; atlas_h: number;
  };
  // GROUND_TINT из bake (0.42, 0.4, 0.37) — страховочная плоскость y≈-0.2:
  // была одна белая uv-точка, теперь развёртка по асфальтовому тайлу.
  let gci = -1;
  for (let i = 0; i < m.colors.length; i += 3) {
    if (m.colors[i] === 0.42 && m.colors[i + 1] === 0.4 && m.colors[i + 2] === 0.37) { gci = i / 3; break; }
  }
  expect(gci).toBeGreaterThanOrEqual(0);
  const [rx, ry, w, h] = m.atlas_tiles['zz_asphalt.png']!;
  const W = 2048, H = m.atlas_h;
  const seen = new Set<string>();
  let n = 0;
  for (let t = 0; t < m.col_index.length; t++) {
    if (m.col_index[t] === gci) {
      for (let c = 0; c < 3; c++) {
        const k = t * 3 + c;
        const uu = m.uv[2 * k]!, vv = m.uv[2 * k + 1]!;
        seen.add(`${uu},${vv}`);
        expect(uu).toBeGreaterThanOrEqual(rx / W - 1e-9);
        expect(uu).toBeLessThanOrEqual((rx + w) / W + 1e-9);
        expect(vv).toBeGreaterThanOrEqual(1 - (ry + h) / H - 1e-9);
        expect(vv).toBeLessThanOrEqual(1 - ry / H + 1e-9);
        n++;
      }
    }
  }
  expect(n).toBeGreaterThan(0);
  // развёртка, а не одна точка: box-mapping работает
  expect(seen.size).toBeGreaterThan(1);
});

test('szeged proc tiles: 4 процедурные плитки в меше и в атласе', () => {
  const m = mesh as unknown as { proc: string[]; atlas_tiles: Record<string, number[]> };
  for (const p of ['zz_roof.png', 'zz_plaster_warm.png', 'zz_plaster_cool.png', 'zz_asphalt.png']) {
    expect(m.proc).toContain(p);
    expect(m.atlas_tiles[p], `нет тайла ${p} в атласе`).toBeDefined();
  }
});

test('szeged curated: фасады и черепица владельца в атласе (фото исходника нет)', () => {
  const m = mesh as unknown as { atlas_tiles: Record<string, number[]> };
  for (const p of ['cur-wall1.jpg', 'cur-wall2.jpg', 'cur-wall3.jpg', 'cur-wall4.jpg', 'cur-roof.jpg']) {
    expect(m.atlas_tiles[p], `нет curated-тайла ${p}`).toBeDefined();
  }
  // ни одного исходного material_* фото в атласе быть не должно
  for (const name of Object.keys(m.atlas_tiles)) {
    expect(name.startsWith('material_'), `исходное фото в атласе: ${name}`).toBe(false);
  }
});

test('szeged white fallback: белой плашки почти нет (<2% углов)', () => {
  const m = mesh as unknown as { uv: number[]; atlas_tiles: Record<string, number[]> };
  // белая плашка 8x8 в (2,2): uu≈0.0029; легитимные углы туда не попадают
  // (ближайший тайл начинается дальше), vv белого верха >0.99.
  const corners = m.uv.length / 2;
  let white = 0;
  for (let i = 0; i < m.uv.length; i += 2) {
    if (m.uv[i]! < 0.004 && m.uv[i + 1]! > 0.99) white++;
  }
  expect(white / corners, `белых углов ${white}/${corners}`).toBeLessThan(0.02);
});

test('szeged atlas: тайлы ≤512px, зазоры ≥16px (anti-mip-bleed)', () => {
  const tiles = (mesh as unknown as { atlas_tiles: Record<string, number[]> }).atlas_tiles;
  const rects = Object.values(tiles);
  // curated-атлас худой: белая плашка + 4 процедурки + 5 проверенных фото
  expect(rects.length).toBeGreaterThanOrEqual(8);
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
