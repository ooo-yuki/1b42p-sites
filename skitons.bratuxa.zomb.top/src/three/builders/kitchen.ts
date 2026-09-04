import * as THREE from 'three';
import { C, box, cyl, sph } from '../palette';

// Кухонный блок (стоит в пристрое справа от дома, x ≈ +5).
// fridge lvl: 0 — ящик-ледник; 1+ — холодильник, растёт и хорошеет
//   (наклейки-фрукты с 3, двойной с 5).
// stove lvl: 0 — костёр с котелком; 1+ — плита; конфорок 1→4,
//   духовка с 2, вытяжка с 4. Огонь — конусы с emissive, flicker по имени 'flame'.
// pan lvl: 0 — пустая стена; 1+ — сковородки на стене (1→5 штук),
//   с 3 — полка с баночками специй, с 5 — золотая сковорода.
export function buildKitchen(levels: { fridge: number; stove: number; pan: number }): THREE.Group {
  const g = new THREE.Group();
  g.add(buildFridge(Math.max(0, Math.min(5, levels.fridge)), -1.4));
  g.add(buildStove(Math.max(0, Math.min(5, levels.stove)), 0.2));
  g.add(buildPans(Math.max(0, Math.min(5, levels.pan)), 1.8));
  return g;
}

function buildFridge(L: number, x: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, 0, 0);
  if (L === 0) {
    // Деревянный ящик-ледник
    g.add(box(1.1, 0.9, 0.9, C.wood, 0, 0.45, 0));
    g.add(box(1.2, 0.1, 1.0, C.woodDark, 0, 0.95, 0));
    return g;
  }
  const tall = L >= 5 ? 2.2 : 1.7;
  const body = box(1.1, tall, 0.95, L >= 3 ? 0xeaf7ff : C.fridge, 0, tall / 2, 0);
  g.add(body);
  // Дверца-шов + ручка
  g.add(box(0.04, tall * 0.8, 0.04, C.steel, 0, tall / 2, 0.49));
  g.add(cyl(0.04, 0.04, 0.4, C.cocoa, 0.35, tall / 2 + 0.2, 0.52, 6));
  // Морозилка-шов со 2
  if (L >= 2) g.add(box(1.0, 0.05, 0.04, C.steel, 0, tall - 0.5, 0.49));
  // Магнитики-фрукты с 3
  if (L >= 3) {
    const fruits = [0xf6a5b8, 0xffb347, 0xa8d5a2, 0xff7b54];
    fruits.slice(0, L + 1).forEach((c, i) => {
      g.add(sph(0.07, c, -0.3 + (i % 2) * 0.55, 0.6 + Math.floor(i / 2) * 0.35, 0.5));
    });
  }
  // Вторая дверца с 5 (широкий side-by-side)
  if (L >= 5) {
    g.add(box(0.9, tall, 0.9, 0xeaf7ff, 1.0, tall / 2, 0));
    g.add(cyl(0.04, 0.04, 0.4, C.cocoa, 0.7, tall / 2 + 0.2, 0.47, 6));
  }
  return g;
}

function buildStove(L: number, x: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, 0, 0);
  if (L === 0) {
    // Костёр: камни + котелок
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      g.add(sph(0.12, C.stone, Math.cos(a) * 0.45, 0.1, Math.sin(a) * 0.45));
    }
    const flame = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 0.55, 8),
      new THREE.MeshStandardMaterial({ color: C.fire, emissive: C.fireHot, emissiveIntensity: 1.4, roughness: 1, flatShading: true }),
    );
    flame.position.y = 0.4;
    flame.name = 'flame';
    g.add(flame);
    g.add(cyl(0.05, 0.05, 1.1, C.woodDark, -0.6, 0.55, 0, 6));
    g.add(sph(0.2, 0x5a5a5a, 0, 0.75, 0));
    return g;
  }
  // Корпус плиты
  g.add(box(1.5, 0.9, 1.0, L >= 3 ? 0xfff6ea : 0xd8dee3, 0, 0.45, 0));
  g.add(box(1.5, 0.08, 1.0, 0x5a5a5a, 0, 0.94, 0));
  // Конфорки: 1→4
  const burners = [1, 2, 2, 3, 4, 4][L];
  const bp: Array<[number, number]> = [[-0.35, -0.2], [0.35, -0.2], [-0.35, 0.25], [0.35, 0.25]];
  for (let i = 0; i < burners; i++) {
    g.add(cyl(0.16, 0.16, 0.04, 0x3a3a3a, bp[i][0], 0.99, bp[i][1], 10));
    if (i < 2) {
      // Кастрюльки на первых двух
      g.add(cyl(0.14, 0.12, 0.16, i ? C.door : C.roof, bp[i][0], 1.1, bp[i][1], 10));
    }
  }
  // Огонь в духовке (видно через окошко)
  const fire = new THREE.Mesh(
    new THREE.ConeGeometry(0.2, 0.5, 8),
    new THREE.MeshStandardMaterial({ color: C.fire, emissive: C.fireHot, emissiveIntensity: 1.6, roughness: 1, flatShading: true }),
  );
  fire.position.set(0, 0.35, 0.51);
  fire.scale.z = 0.4;
  fire.name = 'flame';
  g.add(fire);
  if (L >= 2) {
    // Окошко духовки
    const win = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x554433, emissive: 0xff9a4d, emissiveIntensity: 0.7, roughness: 0.4 }),
    );
    win.position.set(0, 0.35, 0.51);
    g.add(win);
    fire.position.z = 0.45;
  }
  // Вытяжка с 4
  if (L >= 4) {
    g.add(box(1.3, 0.5, 0.9, C.steel, 0, 2.2, 0));
    g.add(cyl(0.15, 0.15, 0.8, C.steel, 0, 2.8, 0, 8));
  }
  // Боковой столик с 5
  if (L >= 5) g.add(box(0.9, 0.85, 0.9, C.wood, 1.25, 0.42, 0));
  return g;
}

function buildPans(L: number, x: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, 0, 0);
  // Доска на стене
  g.add(box(0.12, 1.8, 2.2, C.wood, 0, 1.5, 0));
  const panCols = [0x5a5a5a, 0x5a5a5a, 0x777777, 0x777777, 0x8a8a8a, 0xd9a441];
  for (let i = 0; i < L; i++) {
    const py = 2.1 - i * 0.32;
    const gold = L >= 5 && i === 0;
    const pan = cyl(0.16, 0.16, 0.05, gold ? panCols[5] : panCols[i], 0.12, py, -0.7 + (i % 3) * 0.7, 12);
    pan.rotation.z = Math.PI / 2;
    g.add(pan);
    g.add(cyl(0.03, 0.03, 0.25, C.woodDark, 0.12, py + 0.24, -0.7 + (i % 3) * 0.7, 6));
  }
  // Полка со специями с 3
  if (L >= 3) {
    g.add(box(0.35, 0.06, 1.6, C.woodDark, 0.2, 0.75, 0));
    const spice = [0xf6a5b8, 0xffb347, 0xa8d5a2, 0xd9c0e8];
    spice.slice(0, L).forEach((c, i) => {
      g.add(cyl(0.07, 0.07, 0.14, c, 0.2, 0.85, -0.55 + i * 0.35, 8));
    });
  }
  return g;
}
