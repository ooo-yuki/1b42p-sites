import * as THREE from 'three';

// Пастельная палитра Skitons Cafe (см. DESIGN.md)
export const C = {
  cream: 0xf7ece1,
  peach: 0xffd9c0,
  mint: 0xcdeac0,
  sky: 0xbfe3ff,
  cocoa: 0x8a6a5a,
  wall: 0xfff6ea,
  roof: 0xf2a9a2,
  roofDark: 0xe08e88,
  wood: 0xd9a066,
  woodDark: 0xb07a4a,
  window: 0xbfe3ff,
  windowLit: 0xffe6a3,
  door: 0x9fd8c9,
  leaf: 0xa8d5a2,
  leafDark: 0x7fb98e,
  trunk: 0x9a7460,
  stone: 0xe8d9c8,
  white: 0xffffff,
  ink: 0x4a3f38,
  fridge: 0xd7ecf5,
  steel: 0xb9c6cf,
  fire: 0xffb347,
  fireHot: 0xff7b54,
  umbrellaA: 0xf6a5b8,
  umbrellaB: 0x9fd8c9,
  awning: 0xf6a5b8,
} as const;

export function mat(
  color: number,
  opts: { rough?: number; metal?: number; emissive?: number; ei?: number } = {},
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: opts.rough ?? 0.9,
    metalness: opts.metal ?? 0,
    flatShading: true,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.ei ?? 1,
  });
}

export function box(
  w: number, h: number, d: number, color: number,
  x = 0, y = 0, z = 0,
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat(color));
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export function cyl(
  rt: number, rb: number, h: number, color: number,
  x = 0, y = 0, z = 0, seg = 10,
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat(color));
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

export function sph(
  r: number, color: number, x = 0, y = 0, z = 0,
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), mat(color));
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}

// Уровни апгрейдов: id -> 0..5. Record<string,number>, чтобы не
// конфликтовать с src/game/balance.ts (кто бы его ни писал).
export type Levels = Record<string, number>;

// Верх чистового пола зала: сплошной цоколь с крышкой заливает низ,
// поэтому вся начинка интерьера и ноги людей внутри стоят на FLOOR_Y.
export const FLOOR_Y = 0.74;

export function lvl(l: Levels | undefined, id: string): number {
  const v = l?.[id] ?? 0;
  return Math.max(0, Math.min(5, Math.floor(v)));
}

// Канон 19 апгрейдов (ветки: comfort 5, staff 3, kitchen 3, menu 5, promo 3)
export const UPGRADE_IDS = [
  'building', 'chairs', 'veranda', 'umbrellas', 'garden',
  'waiter', 'cook', 'cleaner',
  'fridge', 'stove', 'pan',
  'seasonal', 'recipes', 'asian', 'european', 'american',
  'ads', 'flyer', 'music',
] as const;

export function disposeGroup(g: THREE.Object3D): void {
  g.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.geometry?.dispose();
      const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
      const mats = Array.isArray(m) ? m : m ? [m] : [];
      for (const x of mats) {
        const withMap = x as THREE.MeshStandardMaterial;
        withMap.map?.dispose();
        x.dispose();
      }
    }
  });
}

// Уровни в игре хранятся под каноническими id ('comfort-building'),
// а строители читают короткие ('building'). Нормализация принимает оба.
export function shortKeys(levels: Levels): Levels {
  const out: Levels = {};
  for (const [k, v] of Object.entries(levels)) {
    const short = k.includes('-') ? k.split('-').pop()! : k;
    out[short] = Math.max(out[short] ?? 0, v);
    out[k] = v;
  }
  return out;
}
