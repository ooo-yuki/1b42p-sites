export interface Obstacle { x: number; z: number; r: number; h?: number; }
export interface Spawn { x: number; z: number; }
export interface MapDef { size: number; spawns: Spawn[]; obstacles: Obstacle[]; props: Obstacle[]; }
export type MapId = keyof typeof MAPS;

// Пропсы — авторитетный набор, формат (x,z,r,h), h=99 = не перепрыгнуть.
// h: верх препятствия; без h считается бесконечной (старые коллайдеры держат всегда).
export const MAPS = {
  yard: {
    size: 42,
    spawns: [{ x: -18, z: -18 }, { x: 18, z: -18 }, { x: 0, z: 18 }],
    obstacles: [{ x: 0, z: 0, r: 2 }, { x: -8, z: 5, r: 1.5 }] as Obstacle[],
    props: [
      { x: -14, z: -13, r: 2.2, h: 2.6 }, // будка
      { x: 8, z: -6, r: 1.0, h: 1.1 }, // покрышки
      { x: 10.5, z: -4.5, r: 0.9, h: 0.75 }, // покрышки
      { x: -2, z: 14, r: 0.9, h: 0.7 }, // покрышки
      { x: 12, z: 10, r: 1.3, h: 2.15 }, // ящик
      { x: 6, z: 12.5, r: 0.8, h: 1.0 }, // ящик
      { x: -12, z: 2, r: 0.85, h: 1.1 }, // ящик
      { x: 10, z: -2, r: 3.6, h: 99 }, // пруд
    ] as Obstacle[],
  },
  island: {
    size: 60,
    spawns: [{ x: -25, z: 0 }, { x: 25, z: 0 }],
    obstacles: [] as Obstacle[],
    props: [
      // Пальмы r0.5 h99.
      { x: -20, z: -14, r: 0.5, h: 99 },
      { x: 18, z: -16, r: 0.5, h: 99 },
      { x: -16, z: 16, r: 0.5, h: 99 },
      { x: 20, z: 14, r: 0.5, h: 99 },
      { x: 0, z: -22, r: 0.5, h: 99 },
      // Камни h99.
      { x: 8, z: 4, r: 1.2, h: 99 },
      { x: -6, z: -4, r: 0.9, h: 99 },
      { x: 12, z: -8, r: 1.5, h: 99 },
      { x: -12, z: 8, r: 1.1, h: 99 },
      { x: 4, z: 18, r: 0.8, h: 99 },
      { x: -4, z: -18, r: 1.0, h: 99 },
      // Мешки r0.7 h0.85.
      { x: -1.5, z: 4, r: 0.7, h: 0.85 },
      { x: 0, z: 4, r: 0.7, h: 0.85 },
      { x: 1.5, z: 4, r: 0.7, h: 0.85 },
      // Ящики r1.0 h1.1.
      { x: -10, z: 0, r: 1.0, h: 1.1 },
      { x: 14, z: 10, r: 1.0, h: 1.1 },
    ] as Obstacle[],
  },
  neon: {
    size: 50,
    spawns: [{ x: -20, z: 20 }, { x: 20, z: -20 }],
    obstacles: [{ x: 5, z: 5, r: 2 }] as Obstacle[],
    props: [
      // Стойки r0.45 h99.
      { x: -18, z: -18, r: 0.45, h: 99 },
      { x: 18, z: 16, r: 0.45, h: 99 },
      { x: 0, z: 22, r: 0.45, h: 99 },
      // Бочки r0.65 h1.0.
      { x: -12, z: -4, r: 0.65, h: 1.0 },
      { x: -11, z: -3, r: 0.65, h: 1.0 },
      { x: -12.6, z: -2.8, r: 0.65, h: 1.0 },
      { x: 10, z: 12, r: 0.65, h: 1.0 },
      { x: 11, z: 12.5, r: 0.65, h: 1.0 },
      // Контейнер.
      { x: -5, z: 15, r: 1.5, h: 1.5 },
    ] as Obstacle[],
  },
} satisfies Record<string, MapDef>;

export interface MapLore { name: string; look: string; lore: string; }
export const MAP_LORE: Record<MapId, MapLore> = {
  yard: {
    name: 'Двор-42',
    look: 'Закрытый двор 42×42: будка, покрышки, ящики, пруд в центре.',
    lore: 'Первый рубеж ШТУРМа — учебный двор батальона 42. Новобранцы держат круг у пруда, пока чайки Рукрасии кружат над забором.',
  },
  island: {
    name: 'Остров Дениса',
    look: 'Большой остров 60×60: пальмы, камни, мешки, ящики.',
    lore: 'Дальний форпост у воды. Отряд держит песчаный плацдарм, отбивая волны с двух берегов, пока катер с большой земли не пробьётся сквозь туман.',
  },
  neon: {
    name: 'Неон',
    look: 'Ночная площадка 50×50: стойки с неоном, бочки, контейнер.',
    lore: 'Ночной терминал на краю города. Разгрузка идёт под неоном, тени между контейнерами шевелятся: Рукрасия уже внутри периметра.',
  },
};

/** Push-out круглых препятствий: мутирует pos, возвращает true если было столкновение. */
/** Пропс с верхом h ниже высоты игрока y пропускается (перепрыгнул). */
export function resolveCircle(pos: { x: number; z: number; y?: number }, radius: number, map: MapId): boolean {
  const def = MAPS[map];
  const half = def.size / 2;
  const y = pos.y ?? 0;
  let hit = false;
  pos.x = Math.max(-half + radius, Math.min(half - radius, pos.x));
  pos.z = Math.max(-half + radius, Math.min(half - radius, pos.z));
  const all: Obstacle[] = [...def.obstacles, ...def.props];
  for (const o of all) {
    if ((o.h ?? Infinity) < y) continue;
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
