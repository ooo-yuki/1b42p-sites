export interface Obstacle { x: number; z: number; r: number; }
export interface Spawn { x: number; z: number; }
export interface MapDef { size: number; spawns: Spawn[]; obstacles: Obstacle[]; }
export type MapId = keyof typeof MAPS;

export const MAPS = {
  yard: { size: 42, spawns: [{ x: -18, z: -18 }, { x: 18, z: -18 }, { x: 0, z: 18 }], obstacles: [{ x: 0, z: 0, r: 2 }, { x: -8, z: 5, r: 1.5 }] as Obstacle[] },
  island: { size: 60, spawns: [{ x: -25, z: 0 }, { x: 25, z: 0 }], obstacles: [] as Obstacle[] },
  neon: { size: 50, spawns: [{ x: -20, z: 20 }, { x: 20, z: -20 }], obstacles: [{ x: 5, z: 5, r: 2 }] as Obstacle[] },
} satisfies Record<string, MapDef>;

/** Push-out круглых препятствий: мутирует pos, возвращает true если было столкновение. */
export function resolveCircle(pos: { x: number; z: number }, radius: number, map: MapId): boolean {
  const def = MAPS[map];
  const half = def.size / 2;
  let hit = false;
  pos.x = Math.max(-half + radius, Math.min(half - radius, pos.x));
  pos.z = Math.max(-half + radius, Math.min(half - radius, pos.z));
  for (const o of def.obstacles) {
    const dx = pos.x - o.x;
    const dz = pos.z - o.z;
    const d = Math.hypot(dx, dz);
    const min = o.r + radius;
    if (d < min) {
      hit = true;
      if (d > 1e-6) {
        pos.x = o.x + (dx / d) * min;
        pos.z = o.z + (dz / d) * min;
      } else {
        pos.x = o.x + min;
      }
    }
  }
  return hit;
}
