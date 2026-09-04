import * as THREE from 'three';
import { C, box, cyl, sph } from '../palette';

// Двор: дорожка + клумбы. garden lvl:
// 0 — голая земля; 1 — дорожка; 2 — +1 клумба; 3 — +2 клумбы и кусты;
// 4 — +фонтанчик; 5 — +цветочная арка.
export function buildGarden(lv: number): THREE.Group {
  const g = new THREE.Group();
  const L = Math.max(0, Math.min(5, lv));
  if (L <= 0) return g;

  // Дорожка от дороги к крыльцу
  for (let i = 0; i < 5; i++) {
    g.add(box(1.1, 0.08, 0.8, i % 2 ? 0xefe0cc : C.stone, 0.4 * (i % 2 ? 1 : -1) * 0.2, 0.04, 8.5 + i * 0.95));
  }

  // Клумбы
  const beds: Array<[number, number]> = [[-4.5, 8], [4.8, 8], [-5.2, 4.5], [5.4, 4.2]];
  const nBeds = [0, 0, 1, 2, 3, 4][L];
  const flowerCols = [0xf6a5b8, 0xffb347, 0xd9c0e8, 0xff7b54, 0xffffff];
  for (let b = 0; b < nBeds; b++) {
    const [bx, bz] = beds[b % beds.length];
    g.add(cyl(1.0, 1.1, 0.35, 0xb07a4a, bx, 0.17, bz, 10));
    g.add(cyl(0.9, 0.9, 0.1, 0x7fb98e, bx, 0.38, bz, 10));
    for (let f = 0; f < 3 + b; f++) {
      const a = (f / (3 + b)) * Math.PI * 2 + b;
      g.add(cyl(0.03, 0.03, 0.35, C.leafDark, bx + Math.cos(a) * 0.5, 0.5, bz + Math.sin(a) * 0.5, 5));
      g.add(sph(0.11, flowerCols[(f + b) % flowerCols.length], bx + Math.cos(a) * 0.5, 0.72, bz + Math.sin(a) * 0.5));
    }
  }

  // Кусты с 3
  if (L >= 3) {
    for (const [bx, bz] of [[-2.8, 9.5], [3.4, 9.8]]) {
      g.add(sph(0.5, C.leaf, bx, 0.45, bz));
      g.add(sph(0.35, C.leafDark, bx + 0.4, 0.35, bz + 0.2));
    }
  }

  // Фонтанчик с 4
  if (L >= 4) {
    const f = new THREE.Group();
    f.position.set(7.5, 0, 7.5);
    f.add(cyl(0.9, 1.0, 0.4, C.stone, 0, 0.2, 0, 12));
    f.add(cyl(0.75, 0.75, 0.1, C.window, 0, 0.42, 0, 12));
    f.add(cyl(0.12, 0.18, 0.9, C.stone, 0, 0.7, 0, 8));
    f.add(cyl(0.4, 0.3, 0.15, C.stone, 0, 1.15, 0, 10));
    const jet = sph(0.18, C.window, 0, 1.35, 0);
    jet.name = 'fountainJet';
    f.add(jet);
    g.add(f);
  }

  // Цветочная арка с 5
  if (L >= 5) {
    for (const x of [-1.2, 1.2]) {
      g.add(cyl(0.09, 0.11, 2.6, C.woodDark, x, 1.3, 12.5, 8));
    }
    g.add(box(2.7, 0.18, 0.3, C.woodDark, 0, 2.65, 12.5));
    for (let i = 0; i < 7; i++) {
      g.add(sph(0.14, flowerCols[i % flowerCols.length], -1.1 + i * 0.37, 2.8, 12.5));
    }
  }
  return g;
}

// Зонтики над столиками. umbrellas lvl:
// 0 — нет; каждый уровень +1 зонтик (1→4), с 3 — полосатые,
// с 5 — гирлянда-лампочки по краю.
export function buildUmbrellas(lv: number, tablePos: Array<[number, number]>): THREE.Group {
  const g = new THREE.Group();
  const L = Math.max(0, Math.min(5, lv));
  const n = Math.min(L >= 5 ? 4 : L, tablePos.length);
  const cols = [C.umbrellaA, C.umbrellaB, 0xffd9c0, 0xbfe3ff];
  for (let i = 0; i < n; i++) {
    const [px, pz] = tablePos[i % tablePos.length];
    const u = new THREE.Group();
    u.position.set(px + 0.9, 0, pz - 0.6);
    u.add(cyl(0.06, 0.06, 2.6, C.woodDark, 0, 1.3, 0, 8));
    const striped = L >= 3;
    if (!striped) {
      const cone = new THREE.Mesh(
        new THREE.ConeGeometry(1.5, 0.7, 10),
        new THREE.MeshStandardMaterial({ color: cols[i % cols.length], roughness: 0.9, flatShading: true }),
      );
      cone.position.y = 2.7;
      cone.castShadow = true;
      u.add(cone);
    } else {
      for (let s = 0; s < 8; s++) {
        const seg = new THREE.Mesh(
          new THREE.ConeGeometry(1.5, 0.7, 1, 1, false, (s / 8) * Math.PI * 2, Math.PI / 4),
          new THREE.MeshStandardMaterial({ color: s % 2 ? 0xffffff : cols[i % cols.length], roughness: 0.9, flatShading: true, side: THREE.DoubleSide }),
        );
        seg.position.y = 2.7;
        seg.castShadow = true;
        u.add(seg);
      }
    }
    u.add(sph(0.09, C.cocoa, 0, 3.1, 0));
    // Лампочки по краю с 5
    if (L >= 5) {
      for (let b = 0; b < 8; b++) {
        const a = (b / 8) * Math.PI * 2;
        const bulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.06, 6, 5),
          new THREE.MeshStandardMaterial({ color: 0xffe6a3, emissive: 0xffc978, emissiveIntensity: 1, roughness: 0.6, flatShading: true }),
        );
        bulb.position.set(Math.cos(a) * 1.45, 2.42, Math.sin(a) * 1.45);
        u.add(bulb);
      }
    }
    g.add(u);
  }
  return g;
}
