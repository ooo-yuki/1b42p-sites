export type Slot = 'pistol' | 'auto' | 'shotgun';
export const WEAPONS = {
  pistol: { dmg: 25, mag: 12, reserve: 120, interval: 0.35, spread: 0.5, reload: 1.1, pellets: 1, range: 60 },
  auto: { dmg: 16, mag: 30, reserve: 210, interval: 0.11, spread: 1.8, reload: 1.8, pellets: 1, range: 80 },
  shotgun: { dmg: 12, mag: 6, reserve: 42, interval: 0.9, spread: 5, reload: 2.4, pellets: 6, range: 25 },
};
export function fireShot(slot: Slot, dist: number, seed: number) {
  const w = WEAPONS[slot];
  const pellets = Array.from({ length: w.pellets }, (_, i) => ({ dmg: dist > 15 && slot === 'shotgun' ? w.dmg * 0.5 : w.dmg, idx: i }));
  return { pellets };
}
