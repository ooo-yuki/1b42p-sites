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

/** Визитка ствола для HUD-инвентаря и Вики. Иконка — ключ SVG из ui/gunIcons. */
export interface WeaponMeta {
  name: string;
  short: string;
  key: string;
  desc: string;
  tip: string;
}
export const WEAPON_META: Record<Slot, WeaponMeta> = {
  pistol: {
    name: 'ПМ-42 «Верный»',
    short: 'ПМ',
    key: '1',
    desc: 'Точный середнячок. Лучший урон с выстрела, быстрая перезарядка.',
    tip: 'Добивай подранков, экономь автомат.',
  },
  auto: {
    name: 'АК-42 «Штурм»',
    short: 'АК',
    key: '2',
    desc: 'Основной ствол: 30 в магазине, поливай очередями на средней дистанции.',
    tip: 'Держи 12м от стрелков, не давай окружить.',
  },
  shotgun: {
    name: 'Дробь-42 «Буррито»',
    short: 'ДР',
    key: '3',
    desc: '6 дробин в лицо: сносит раннеров в упор, дальше 15м — горох.',
    tip: 'Подпускай вплотную, один выстрел — один труп.',
  },
};
export const SLOT_ORDER: Slot[] = ['pistol', 'auto', 'shotgun'];
