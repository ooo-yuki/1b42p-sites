import { expect, test } from 'bun:test';
import mesh from '../src/assets/szeged.mesh.json';
import solids from '../src/assets/szeged.solids.json';

type Solid = {
  x: number; z: number; hx: number; hz: number; h: number;
  deck?: boolean; tag?: string;
};
const S = solids as Solid[];
const byTag = (t: string): Solid[] => S.filter((s) => s.tag === t);

const M = mesh as unknown as {
  proc: string[]; atlas_tiles: Record<string, number[]>;
  uv: number[]; positions: number[];
};

// Зелень R1: деревьев нет (снесены под дома); лавки и фонари на месте.
test('london green: 0 деревьев, 8+ лавок, 10+ фонарей', () => {
  const trunks = byTag('trunk');
  const benches = byTag('bench');
  const lamps = byTag('lamp');
  expect(trunks.length).toBe(0); // R1: деревья снесены, вместо них дома
  expect(benches.length).toBeGreaterThanOrEqual(8);
  expect(lamps.length).toBeGreaterThanOrEqual(10);
  for (const bn of benches) {
    expect(bn.h).toBeGreaterThanOrEqual(0.9); // сиденье+спинка держат
    expect(bn.deck).toBeUndefined();
  }
  for (const l of lamps) {
    expect(l.h).toBeCloseTo(3.6, 6); // столб
    expect(l.hx).toBeCloseTo(0.15, 6);
    // шар: вершина октаэдра над столбом (≥4м) в радиусе 1м
    let top = -Infinity;
    for (let i = 0; i < M.positions.length; i += 3) {
      const x = M.positions[i]!, z = M.positions[i + 2]!;
      if (Math.hypot(x - l.x, z - l.z) > 1.0) continue;
      const y = M.positions[i + 1]!;
      if (y > top) top = y;
    }
    expect(top).toBeGreaterThanOrEqual(4.0);
  }
});

// R1: ambient CC0 реально используются (углы меша семплят их прямоугольники);
// leaf/bark со сносом деревьев вышли из употребления — их отсутствие ок.
test('london green: ambient-тайлы стен/крыши/мостовой в атласе и в деле', () => {
  const amb = ['amb-wall1.jpg', 'amb-wall2.jpg', 'amb-wall3.jpg',
               'amb-roof.jpg', 'amb-pave.jpg'];
  for (const p of amb) {
    expect(M.atlas_tiles[p], `нет тайла ${p} в атласе`).toBeDefined();
  }
  const W = 2048, H = (mesh as unknown as { atlas_h: number }).atlas_h;
  const inRect = (tile: string, uu: number, vv: number): boolean => {
    const [rx, ry, w, h] = M.atlas_tiles[tile]!;
    return uu >= rx / W - 1e-9 && uu <= (rx + w) / W + 1e-9 &&
      vv >= 1 - (ry + h) / H - 1e-9 && vv <= 1 - ry / H + 1e-9;
  };
  const used = new Set<string>();
  for (let i = 0; i < M.uv.length; i += 2) {
    const uu = M.uv[i]!, vv = M.uv[i + 1]!;
    for (const p of amb) {
      if (inRect(p, uu, vv)) { used.add(p); break; }
    }
    if (used.size === amb.length) break;
  }
  expect([...used].sort(), `неиспользуемые ambient-тайлы`).toEqual(
    [...amb].sort(),
  );
});

// Белой плашки почти нет (<2% углов) — новые тинты/тайлы без белого.
test('london green: белый fallback <2%', () => {
  const corners = M.uv.length / 2;
  let white = 0;
  for (let i = 0; i < M.uv.length; i += 2) {
    if (M.uv[i]! < 0.004 && M.uv[i + 1]! > 0.99) white++;
  }
  expect(white / corners, `белых углов ${white}/${corners}`).toBeLessThan(0.02);
});

// Коридор: BFS 2м между 4 углами поля (как CORRIDOR-CHECK в bake).
test('london green: коридор-BFS между углами', () => {
  const walls = S.filter(
    (s) => s.h >= 0.5 && s.tag !== 'step' && !(s.deck && s.h > 0.5),
  );
  const blocked = (px: number, pz: number): boolean => {
    for (const s of walls) {
      if (Math.abs(px - s.x) <= s.hx + 1.0 && Math.abs(pz - s.z) <= s.hz + 1.0)
        return true;
    }
    return false;
  };
  const nearestFree = (qx: number, qz: number): [number, number] | null => {
    if (!blocked(qx, qz)) return [qx, qz];
    for (let r = 2; r < 40; r += 2) {
      for (let dx = -r; dx <= r; dx += 2) {
        for (const dz of [-r, r]) {
          if (!blocked(qx + dx, qz + dz)) return [qx + dx, qz + dz];
        }
      }
      for (let dz = -r + 2; dz < r; dz += 2) {
        for (const dx of [-r, r]) {
          if (!blocked(qx + dx, qz + dz)) return [qx + dx, qz + dz];
        }
      }
    }
    return null;
  };
  const bfs = (ax: number, az: number, bx: number, bz: number): number | null => {
    const cell = 2.0;
    const gx = (v: number): number => Math.round(v / cell);
    const key = (ix: number, iz: number): string => ix + ':' + iz;
    const start: [number, number] = [gx(ax), gx(az)];
    const goal: [number, number] = [gx(bx), gx(bz)];
    const seen = new Set<string>([key(...start)]);
    const dist = new Map<string, number>([[key(...start), 0]]);
    const q: Array<[number, number]> = [start];
    while (q.length > 0) {
      const [cx, cz] = q.shift()!;
      const cd = dist.get(key(cx, cz))!;
      if (cx === goal[0] && cz === goal[1]) return cd;
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
        const nx = cx + dx, nz = cz + dz;
        const k = key(nx, nz);
        if (seen.has(k)) continue;
        if (blocked(nx * cell, nz * cell)) continue;
        seen.add(k);
        dist.set(k, cd + 1);
        q.push([nx, nz]);
      }
    }
    return null;
  };
  const half = 95 - 10;
  const spawns: Array<[number, number]> = [[-half, -half], [half, -half], [-half, half], [half, half]];
  const free = spawns.map(([qx, qz]) => nearestFree(qx, qz));
  for (const f of free) expect(f).not.toBeNull();
  for (let i = 0; i < free.length - 1; i++) {
    const d = bfs(free[i]![0], free[i]![1], free[i + 1]![0], free[i + 1]![1]);
    expect(d, `нет пути ${i}->${i + 1}`).not.toBeNull();
  }
});
