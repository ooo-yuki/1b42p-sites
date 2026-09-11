import { expect, test } from 'bun:test';
import solids from '../src/assets/szeged.solids.json';

type Solid = {
  x: number; z: number; hx: number; hz: number; h: number;
  deck?: boolean; tag?: string;
};
const S = solids as Solid[];
const byTag = (t: string): Solid[] => S.filter((s) => s.tag === t);

// Движок: верх солида — пол, deck — проход снизу (y < h-0.5),
// степ-автоподъём ≤1.1м, ступени 0.5м.
test('london interior: счётчики дверей/балконов/террас/ступеней', () => {
  const doors = byTag('door');
  const balconies = byTag('balcony');
  const terraces = byTag('terrace');
  const steps = byTag('step');
  expect(doors.length).toBeGreaterThanOrEqual(8); // 6 домов + 2 сквозных
  expect(balconies.length).toBeGreaterThanOrEqual(4);
  expect(terraces.length).toBeGreaterThanOrEqual(3);
  expect(steps.length).toBeGreaterThanOrEqual(78); // 4x6 + 3x18
  for (const d of balconies) expect(d.deck).toBe(true);
  for (const d of terraces) expect(d.deck).toBe(true);
  // ступени — кратные 0.5м до 9м (террасы H=9)
  for (const st of steps) {
    expect(st.h % 0.5).toBeLessThan(1e-6);
    expect(st.h).toBeGreaterThanOrEqual(0.5);
    expect(st.h).toBeLessThanOrEqual(9.0);
  }
  expect(Math.min(...steps.map((s) => s.h))).toBe(0.5); // низ всегда с земли
  // перила/парапет — ровно +1м над плитой
  for (const r of byTag('rail')) {
    const deck = balconies.find(
      (d) => Math.abs(d.x - r.x) < 3 && Math.abs(d.z - r.z) < 2.5,
    );
    expect(deck).toBeDefined();
    expect(r.h).toBeCloseTo(deck!.h + 1, 6);
  }
  for (const p of byTag('parapet')) {
    const deck = terraces.find(
      (d) => Math.abs(p.x - d.x) <= d.hx + 1 && Math.abs(p.z - d.z) <= d.hz + 1,
    );
    expect(deck).toBeDefined();
    expect(p.h).toBeCloseTo(deck!.h + 1, 6);
  }
});

// Дверь: BFS 0.5м в окне 40м — путь снаружи внутрь ≤16 шагов (8м);
// обход вокруг дома занял бы ≥20м, т.е. порог доказывает открытый проём.
test('london interior: BFS сквозь каждую дверь', () => {
  const doors = byTag('door');
  const walls = S.filter(
    (s) => s.h >= 0.5 && s.tag !== 'step' && !(s.deck && s.h > 0.5),
  );
  const blocked = (px: number, pz: number): boolean => {
    for (const s of walls) {
      if (Math.abs(px - s.x) <= s.hx + 0.35 && Math.abs(pz - s.z) <= s.hz + 0.35)
        return true;
    }
    return false;
  };
  const bfs = (
    ax: number, az: number, bx: number, bz: number,
  ): number | null => {
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
      // окно 40м вокруг двери: детур вокруг дома внутри, дальний — снаружи
      if (Math.abs(cx - start[0]) * cell > 20 || Math.abs(cz - start[1]) * cell > 20)
        continue;
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
  expect(doors.length).toBeGreaterThan(0);
  for (const d of doors) {
    const alongX = d.hx > d.hz; // все двери на С/Ю стенах
    expect(alongX).toBe(true);
    // ±1.5м: снаружи — зазор между домами (2.7м), внутри — комната;
    // прямой путь 3м, обход вокруг дома ≥20м
    const dist = bfs(d.x, d.z - 1.5, d.x, d.z + 1.5);
    expect(dist).not.toBeNull();
    expect(dist!).toBeLessThanOrEqual(16);
  }
});

// Верх: куски deck одной крыши — связная группа (зазор ~0);
// цепочка опор от нижней ступени (≤0.65м) до группы —
// зазор между rect ≤0.9м, подъём ≤0.65м (ступень 0.5 + запас).
test('london interior: верх балконов и террас достижим ступенями', () => {
  const steps = byTag('step');
  const pieces = [...byTag('balcony'), ...byTag('terrace')];
  expect(pieces.length).toBeGreaterThanOrEqual(7);
  const gap = (
    a: Solid, b: Solid,
  ): number => {
    const dx = Math.max(
      0, Math.max(a.x - a.hx, b.x - b.hx) - Math.min(a.x + a.hx, b.x + b.hx),
    );
    const dz = Math.max(
      0, Math.max(a.z - a.hz, b.z - b.hz) - Math.min(a.z + a.hz, b.z + b.hz),
    );
    return Math.hypot(dx, dz);
  };
  // группы: куски одной палубы (балкон — 1 кусок, терраса — 4 вокруг люка)
  const groups: Solid[][] = [];
  for (const p of pieces) {
    const g = groups.find((g0) => g0.some((q) => gap(p, q) < 0.05));
    if (g) g.push(p);
    else groups.push([p]);
  }
  expect(groups.length).toBeGreaterThanOrEqual(7); // 4 балкона + 3 террасы
  for (const g of groups) {
    const top = g[0].h;
    for (const p of g) expect(p.h).toBeCloseTo(top, 6);
    // верх марша — вровень с плитой (ступень впритык к любому куску)
    const flush = steps.filter(
      (s) => Math.abs(s.h - top) < 1e-6 && g.some((p) => gap(s, p) <= 0.9),
    );
    expect(flush.length).toBeGreaterThan(0);
    // BFS вверх от нижних ступеней по всем ступеням + кускам группы
    const nodes: Array<Solid> = [...steps, ...g];
    const seen = new Set<number>();
    const q: number[] = [];
    nodes.forEach((n, i) => {
      if (n.tag === 'step' && n.h <= 0.65) { seen.add(i); q.push(i); }
    });
    expect(q.length).toBeGreaterThan(0);
    while (q.length > 0) {
      const ci = q.shift()!;
      for (let ni = 0; ni < nodes.length; ni++) {
        if (seen.has(ni)) continue;
        const dh = nodes[ni].h - nodes[ci].h;
        if (dh < -1e-6 || dh > 0.65) continue;
        if (gap(nodes[ci], nodes[ni]) > 0.9) continue;
        seen.add(ni);
        q.push(ni);
      }
    }
    for (let i = nodes.length - g.length; i < nodes.length; i++)
      expect(seen.has(i)).toBe(true);
  }
});
