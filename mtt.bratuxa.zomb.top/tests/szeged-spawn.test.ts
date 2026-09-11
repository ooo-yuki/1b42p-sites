import { expect, test } from 'bun:test';
import mesh from '../src/assets/szeged.mesh.json';
import solids from '../src/assets/szeged.solids.json';
import spawn from '../tools/szeged-spawn.json';

type Solid = { x: number; z: number; hx: number; hz: number; h: number; deck?: boolean };

/** hitSolid-подобная проверка: круг против AABB как engine solidHit (y=0). */
function blocked(px: number, pz: number, rad = 2.0): boolean {
  const r2 = rad * rad;
  for (const s of (solids as Solid[])) {
    const cx = Math.max(s.x - s.hx, Math.min(px, s.x + s.hx));
    const cz = Math.max(s.z - s.hz, Math.min(pz, s.z + s.hz));
    const dx = px - cx, dz = pz - cz;
    if (dx * dx + dz * dz < r2) return true;
  }
  return false;
}

function arenaHalf(): number {
  const xs: number[] = []; const zs: number[] = [];
  for (let i = 0; i < mesh.positions.length; i += 3) { xs.push(mesh.positions[i]); zs.push(mesh.positions[i + 2]); }
  return Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...zs) - Math.min(...zs)) / 2 + 10;
}

test('london spawn: формат {x,z} из tools/szeged-spawn.json', async () => {
  expect(typeof spawn.x).toBe('number');
  expect(typeof spawn.z).toBe('number');
  expect(Number.isFinite(spawn.x)).toBe(true);
  expect(Number.isFinite(spawn.z)).toBe(true);
  // единый источник: статический импорт совпадает с файлом на диске
  const raw = JSON.parse(await Bun.file(new URL('../tools/szeged-spawn.json', import.meta.url)).text());
  expect({ x: spawn.x, z: spawn.z }).toEqual(raw);
});

test('london spawn: внутри арены, свободен кругом r=2м, у площади', () => {
  const half = arenaHalf();
  expect(Math.abs(spawn.x)).toBeLessThanOrEqual(half);
  expect(Math.abs(spawn.z)).toBeLessThanOrEqual(half);
  expect(blocked(spawn.x, spawn.z, 2.0)).toBe(false);
  // не старый дефолт {x:0,z:22} и не углы ±S (там стены)
  expect([spawn.x, spawn.z]).not.toEqual([0, 22]);
  const S = half - 10;
  for (const [cx, cz] of [[-S, -S], [S, -S], [-S, S], [S, S]] as Array<[number, number]>) {
    expect([spawn.x, spawn.z]).not.toEqual([cx, cz]);
  }
  // baked-точка у площади (0,-45): London-спаун (-2,-47), дистанция до центра ~47м
  expect(Math.hypot(spawn.x, spawn.z)).toBeLessThanOrEqual(60);
});
