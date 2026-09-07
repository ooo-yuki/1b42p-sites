import { resolveCircle, type MapId } from './maps';

export interface Medkit { x: number; z: number; taken: boolean; t: number; }

export const MEDKIT_HEAL = 50;
export const MEDKIT_RADIUS = 1.3;
export const MEDKIT_RESPAWN = 25;

// Фикс-точки банок на карту — вдали от спавна и друг от друга.
// resolveCircle при спавне вытолкнет из препятствий и границ, если что.
const SPOTS: Record<MapId, Array<[number, number]>> = {
  yard: [[-11, -16], [14, -14], [0, 16]],
  island: [[-20, 0], [20, 0], [0, -20]],
  neon: [[-15, 15], [15, -15], [0, 0]],
};

export function spawnPickups(map: MapId): Medkit[] {
  return SPOTS[map].map(([x, z]) => {
    const pos = { x, z };
    resolveCircle(pos, 1.0, map);
    return { x: pos.x, z: pos.z, taken: false, t: 0 };
  });
}

/** Тик банок: подбор в радиусе лечит, взятая респаунится. Возвращает суммарный хил. */
export function updatePickups(list: Medkit[], px: number, pz: number, dt: number): number {
  let healed = 0;
  for (const m of list) {
    if (m.taken) {
      m.t -= dt;
      if (m.t <= 0) { m.taken = false; m.t = 0; }
    } else if (Math.hypot(m.x - px, m.z - pz) < MEDKIT_RADIUS) {
      m.taken = true; m.t = MEDKIT_RESPAWN; healed += MEDKIT_HEAL;
    }
  }
  return healed;
}
