import { expect, test } from 'bun:test';
import mesh from '../src/assets/szeged.mesh.json';

// Земля покрывает ядро: сетка 10м по bbox ядра (mesh.core_rect, baked-метры),
// под каждой точкой — лицо с up-нормалью в пределах 2м (3D дистанция
// точка-треугольник). Дыры = скайбокс сквозь землю; страховочная плоскость
// bake (y≈-0.2) держит гарантию даже там, где в исходнике пустоты.

const P = mesh.positions as number[];
const N = mesh.normals as number[];
const PI = mesh.pos_index as number[];
const NI = mesh.nor_index as number[];
const CI = mesh.col_index as number[];
const [x0, x1, z0, z1] = mesh.core_rect as [number, number, number, number];

type Tri = {
  ax: number; ay: number; az: number;
  bx: number; by: number; bz: number;
  cx: number; cy: number; cz: number;
  minx: number; maxx: number; miny: number; maxy: number; minz: number; maxz: number;
};

function buildUpTris(): Tri[] {
  const out: Tri[] = [];
  const n = CI.length;
  for (let t = 0; t < n; t++) {
    let up = true;
    for (let c = 0; c < 3; c++) {
      if (N[NI[t * 3 + c] * 3 + 1]! < 0.7) { up = false; break; }
    }
    if (!up) continue;
    const v = (c: number): [number, number, number] => {
      const p = PI[t * 3 + c]! * 3;
      return [P[p]!, P[p + 1]!, P[p + 2]!];
    };
    const [ax, ay, az] = v(0); const [bx, by, bz] = v(1); const [cx, cy, cz] = v(2);
    out.push({
      ax, ay, az, bx, by, bz, cx, cy, cz,
      minx: Math.min(ax, bx, cx), maxx: Math.max(ax, bx, cx),
      miny: Math.min(ay, by, cy), maxy: Math.max(ay, by, cy),
      minz: Math.min(az, bz, cz), maxz: Math.max(az, bz, cz),
    });
  }
  return out;
}

// squared distance point->triangle (Ericson, Real-Time Collision Detection)
function ptTriDist2(px: number, py: number, pz: number, t: Tri): number {
  const abx = t.bx - t.ax, aby = t.by - t.ay, abz = t.bz - t.az;
  const acx = t.cx - t.ax, acy = t.cy - t.ay, acz = t.cz - t.az;
  const apx = px - t.ax, apy = py - t.ay, apz = pz - t.az;
  const d1 = abx * apx + aby * apy + abz * apz;
  const d2 = acx * apx + acy * apy + acz * apz;
  if (d1 <= 0 && d2 <= 0) return apx * apx + apy * apy + apz * apz;
  const bpx = px - t.bx, bpy = py - t.by, bpz = pz - t.bz;
  const d3 = abx * bpx + aby * bpy + abz * bpz;
  const d4 = acx * bpx + acy * bpy + acz * bpz;
  if (d3 >= 0 && d4 <= d3) return bpx * bpx + bpy * bpy + bpz * bpz;
  const vc = d1 * d4 - d3 * d2;
  if (vc <= 0 && d1 >= 0 && d3 <= 0) {
    const v = d1 / (d1 - d3);
    const qx = t.ax + abx * v - px, qy = t.ay + aby * v - py, qz = t.az + abz * v - pz;
    return qx * qx + qy * qy + qz * qz;
  }
  const cpx = px - t.cx, cpy = py - t.cy, cpz = pz - t.cz;
  const d5 = abx * cpx + aby * cpy + abz * cpz;
  const d6 = acx * cpx + acy * cpy + acz * cpz;
  if (d6 >= 0 && d5 <= d6) return cpx * cpx + cpy * cpy + cpz * cpz;
  const vb = d5 * d2 - d1 * d6;
  if (vb <= 0 && d2 >= 0 && d6 <= 0) {
    const w = d2 / (d2 - d6);
    const qx = t.ax + acx * w - px, qy = t.ay + acy * w - py, qz = t.az + acz * w - pz;
    return qx * qx + qy * qy + qz * qz;
  }
  const va = d3 * d6 - d5 * d4;
  if (va <= 0 && (d4 - d3) >= 0 && (d5 - d6) >= 0) {
    const w = (d4 - d3) / ((d4 - d3) + (d5 - d6));
    const ex = t.bx + (t.cx - t.bx) * w - px;
    const ey = t.by + (t.cy - t.by) * w - py;
    const ez = t.bz + (t.cz - t.bz) * w - pz;
    return ex * ex + ey * ey + ez * ez;
  }
  const denom = 1 / (va + vb + vc);
  const vv = vb * denom, ww = vc * denom;
  const qx = t.ax + abx * vv + acx * ww - px;
  const qy = t.ay + aby * vv + acy * ww - py;
  const qz = t.az + abz * vv + acz * ww - pz;
  return qx * qx + qy * qy + qz * qz;
}

test('szeged core_rect: окно ядра вшито в меш', () => {
  expect(Array.isArray(mesh.core_rect)).toBe(true);
  expect(x1 - x0).toBeGreaterThan(250);
  expect(z1 - z0).toBeGreaterThan(250);
});

test('szeged ground: сетка 10м по ядру — под каждой точкой up-лицо в пределах 2м', () => {
  const tris = buildUpTris();
  expect(tris.length).toBeGreaterThan(1000);
  const pts: Array<[number, number]> = [];
  for (let gx = x0; gx <= x1 + 1e-9; gx += 10) {
    for (let gz = z0; gz <= z1 + 1e-9; gz += 10) {
      pts.push([+gx.toFixed(3), +gz.toFixed(3)]);
    }
  }
  expect(pts.length).toBeGreaterThan(500);
  const missing: string[] = [];
  for (const [px, pz] of pts) {
    let ok = false;
    for (const t of tris) {
      if (px < t.minx - 2 || px > t.maxx + 2) continue;
      if (pz < t.minz - 2 || pz > t.maxz + 2) continue;
      if (t.miny > 2 || t.maxy < -2) continue;
      if (ptTriDist2(px, 0, pz, t) <= 4) { ok = true; break; }
    }
    if (!ok) missing.push(`${px},${pz}`);
  }
  expect(missing.length, `дыры в земле (${missing.length}): ${missing.slice(0, 8).join(' | ')}`).toBe(0);
}, 60000);
