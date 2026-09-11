import { expect, test } from 'bun:test';
import mesh from '../src/assets/szeged.mesh.json';
import solids from '../src/assets/szeged.solids.json';

type Solid = {
  x: number; z: number; hx: number; hz: number; h: number;
  deck?: boolean; tag?: string;
};
const S = solids as Solid[];
const byTag = (t: string): Solid[] => S.filter((s) => s.tag === t);

const BRIDGE_XS = [-50, 0, 50];

// Движок: deck h=1.2 проходим снизу (y < h-0.5), верх — опора;
// колонны парапетов (h=2.2) — стены. Те же дефы, что в london-interior.
const walls = S.filter(
  (s) => s.h >= 0.5 && s.tag !== 'step' && !(s.deck && s.h > 0.5),
);

test('london bridge: 3 deck-палубы h=1.2 + парапеты +1м', () => {
  const bridges = byTag('bridge');
  expect(bridges.length).toBe(3);
  for (const bx of BRIDGE_XS) {
    const d = bridges.find((s) => Math.abs(s.x - bx) < 0.01);
    expect(d).toBeDefined();
    expect(d!.deck).toBe(true);
    expect(d!.h).toBeCloseTo(1.2, 6);
    expect(d!.hx).toBeCloseTo(3.0, 6); // ширина 6м
    expect(d!.hz).toBeGreaterThanOrEqual(4.3); // канал z±4 + берега
    expect(Math.abs(d!.z)).toBeLessThan(0.01);
    // ступени-подходы 0.5/1.0 с обеих сторон, впритык к палубе
    for (const sgn of [1, -1]) {
      for (const [zc, top] of [[sgn * 5.5, 0.5], [sgn * 4.9, 1.0]] as const) {
        const st = S.find(
          (s) => s.tag === 'step' && Math.abs(s.x - bx) < 0.01 &&
            Math.abs(s.z - zc) < 0.01 && Math.abs(s.h - top) < 1e-6,
        );
        expect(st).toBeDefined();
      }
    }
    // парапеты: ровно +1м над палубой, ≥4 сегмента у каждого моста
    const pars = byTag('parapet').filter(
      (p) => Math.abs(p.h - 2.2) < 1e-6 && Math.abs(p.x - bx) < 3.5 &&
        Math.abs(p.z) < 7,
    );
    expect(pars.length).toBeGreaterThanOrEqual(4);
    for (const p of pars) expect(p.h).toBeCloseTo(d!.h + 1, 6);
  }
});

test('london tower: Биг-Бен 8x8x30 + циферблат + шпиль + 2 башенки', () => {
  const towers = byTag('tower');
  expect(towers.length).toBe(1);
  const t = towers[0];
  expect(t.hx).toBeCloseTo(4.0, 6);
  expect(t.hz).toBeCloseTo(4.0, 6);
  expect(t.h).toBeCloseTo(30.0, 6);
  // циферблат-процедурка в атласе
  const m = mesh as {
    proc: string[]; atlas_tiles: Record<string, number[]>;
    positions: number[];
  };
  expect(m.proc).toContain('zz_clock.png');
  expect(m.atlas_tiles['zz_clock.png']).toBeDefined();
  // шпиль: вершина меша над башней ≥35м
  let top = -Infinity;
  for (let i = 0; i < m.positions.length; i += 3) {
    const x = m.positions[i], y = m.positions[i + 1], z = m.positions[i + 2];
    if (Math.abs(x - t.x) <= 5 && Math.abs(z - t.z) <= 5 && y > top) top = y;
  }
  expect(top).toBeGreaterThanOrEqual(35);
  // 2 башенки 5x5x18
  const turrets = byTag('turret');
  expect(turrets.length).toBe(2);
  for (const u of turrets) {
    expect(u.hx).toBeCloseTo(2.5, 6);
    expect(u.hz).toBeCloseTo(2.5, 6);
    expect(u.h).toBeCloseTo(18.0, 6);
  }
});

test('london arches: ≥5 порталов (2 столба + перекладина h≥4)', () => {
  const pillars = byTag('arch');
  const tops = byTag('archtop');
  expect(tops.length).toBeGreaterThanOrEqual(5);
  expect(pillars.length).toBe(tops.length * 2);
  for (const p of pillars) {
    expect(p.deck).toBeUndefined();
    expect(p.h).toBeGreaterThanOrEqual(4);
  }
  for (const t of tops) {
    expect(t.deck).toBe(true); // проход снизу
    expect(t.h).toBeGreaterThanOrEqual(4);
    // два столба рядом: |dx|≤3.5, |dz|≤1.5
    const pair = pillars.filter(
      (p) => Math.abs(p.x - t.x) <= 3.5 && Math.abs(p.z - t.z) <= 1.5,
    );
    expect(pair.length).toBe(2);
  }
});

// Под мостом: BFS 0.5м вдоль канала (z=0) ±10м — палуба проходима снизу,
// столбы/парапеты/берега путь не затыкают.
test('london bridge: BFS под каждым мостом', () => {
  const blocked = (px: number, pz: number): boolean => {
    for (const s of walls) {
      if (Math.abs(px - s.x) <= s.hx + 0.35 && Math.abs(pz - s.z) <= s.hz + 0.35)
        return true;
    }
    return false;
  };
  const bfs = (ax: number, az: number, bx: number, bz: number): number | null => {
    const cell = 0.5;
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
      if (cd > 120) continue;
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
  for (const bx of BRIDGE_XS) {
    const dist = bfs(bx - 10, 0, bx + 10, 0);
    expect(dist).not.toBeNull();
    expect(dist!).toBeLessThanOrEqual(60); // прямо 40 шагов + обход
  }
});

// Через мост: цепочка опор юг→палуба→север (зазор ≤0.9м, подъём ≤0.65м),
// концы на свободной земле.
test('london bridge: через каждый мост — ступени на палубу с обеих сторон', () => {
  const gap = (a: Solid, b: Solid): number => {
    const dx = Math.max(
      0, Math.max(a.x - a.hx, b.x - b.hx) - Math.min(a.x + a.hx, b.x + b.hx),
    );
    const dz = Math.max(
      0, Math.max(a.z - a.hz, b.z - b.hz) - Math.min(a.z + a.hz, b.z + b.hz),
    );
    return Math.hypot(dx, dz);
  };
  const free = (px: number, pz: number): boolean => {
    for (const s of walls) {
      if (Math.abs(px - s.x) <= s.hx + 0.35 && Math.abs(pz - s.z) <= s.hz + 0.35)
        return false;
    }
    return true;
  };
  for (const bx of BRIDGE_XS) {
    const deck = byTag('bridge').find((s) => Math.abs(s.x - bx) < 0.01)!;
    expect(deck).toBeDefined();
    // цепочка опор: земля(0) → 0.5 → 1.0 → палуба → 1.0 → 0.5 → земля
    const chain: Array<{ h: number; z: number }> = [
      { h: 0.5, z: -5.5 }, { h: 1.0, z: -4.9 },
    ];
    let prev: Solid | null = null;
    const sup = (h: number, z: number): Solid => {
      const s = S.find(
        (c) => Math.abs(c.x - bx) < 0.01 && Math.abs(c.z - z) < 0.01 &&
          Math.abs(c.h - h) < 1e-6,
      )!;
      expect(s).toBeDefined();
      return s;
    };
    for (const { h, z } of chain) {
      const s = sup(h, z);
      if (prev) {
        expect(gap(prev, s)).toBeLessThanOrEqual(0.9);
        expect(s.h - prev.h).toBeLessThanOrEqual(0.65);
      } else {
        expect(s.h).toBeLessThanOrEqual(0.65); // с земли
      }
      prev = s;
    }
    expect(gap(prev!, deck)).toBeLessThanOrEqual(0.9);
    expect(deck.h - prev!.h).toBeLessThanOrEqual(0.65);
    expect(deck.h - prev!.h).toBeGreaterThan(0);
    // симметрия севера: та же цепочка зеркально
    const n1 = sup(1.0, 4.9), n0 = sup(0.5, 5.5);
    expect(gap(deck, n1)).toBeLessThanOrEqual(0.9);
    expect(gap(n1, n0)).toBeLessThanOrEqual(0.9);
    expect(n1.h - deck.h).toBeLessThanOrEqual(0);
    // подходы с земли свободны
    expect(free(bx, -8)).toBe(true);
    expect(free(bx, 8)).toBe(true);
  }
});

// Сквозь каждую арку: BFS 0.5м вдоль переулка ±5м от перекладины.
test('london bridge: BFS сквозь каждую арку', () => {
  const blocked = (px: number, pz: number): boolean => {
    for (const s of walls) {
      if (Math.abs(px - s.x) <= s.hx + 0.35 && Math.abs(pz - s.z) <= s.hz + 0.35)
        return true;
    }
    return false;
  };
  const bfs = (ax: number, az: number, bx: number, bz: number): number | null => {
    const cell = 0.5;
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
      if (cd > 60) continue;
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
  const tops = byTag('archtop');
  expect(tops.length).toBeGreaterThan(0);
  for (const t of tops) {
    const dist = bfs(t.x, t.z - 5, t.x, t.z + 5);
    expect(dist).not.toBeNull();
    expect(dist!).toBeLessThanOrEqual(30); // прямо 20 шагов + запас
  }
});
