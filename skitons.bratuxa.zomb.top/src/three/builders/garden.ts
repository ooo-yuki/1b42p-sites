import * as THREE from 'three';
import { C, box, cyl, sph, mat } from '../palette';

// Двор: дорожка + клумбы. garden lvl:
// 0 — голая земля; 1 — дорожка; 2 — +1 клумба; 3 — +2 клумбы и кусты;
// 4 — +фонтанчик; 5 — +цветочная арка, скворечник, лейка.
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

  // Фонтанчик с 4 — детализированный: чаша, струя, брызги
  if (L >= 4) {
    const f = new THREE.Group();
    f.position.set(7.5, 0, 7.5);
    // нижняя чаша с ободком
    f.add(cyl(0.9, 1.0, 0.4, C.stone, 0, 0.2, 0, 12));
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.09, 8, 20), mat(C.stone));
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.42;
    rim.castShadow = true;
    f.add(rim);
    // вода в чаше
    const water = new THREE.Mesh(
      new THREE.CircleGeometry(0.8, 16),
      new THREE.MeshStandardMaterial({ color: C.window, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.9 }),
    );
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.42;
    f.add(water);
    // ножка + верхняя чаша
    f.add(cyl(0.12, 0.18, 0.9, C.stone, 0, 0.7, 0, 8));
    f.add(cyl(0.4, 0.3, 0.15, C.stone, 0, 1.15, 0, 10));
    const water2 = new THREE.Mesh(
      new THREE.CircleGeometry(0.32, 12),
      new THREE.MeshStandardMaterial({ color: C.window, roughness: 0.15, transparent: true, opacity: 0.9 }),
    );
    water2.rotation.x = -Math.PI / 2;
    water2.position.y = 1.24;
    f.add(water2);
    // прозрачная струя-цилиндр
    const jet = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.12, 0.7, 8),
      new THREE.MeshStandardMaterial({ color: 0xbfe3ff, roughness: 0.1, transparent: true, opacity: 0.55 }),
    );
    jet.position.y = 1.6;
    jet.name = 'fountainJet';
    f.add(jet);
    const crown = sph(0.14, C.window, 0, 1.98, 0);
    crown.name = 'fountainJet';
    f.add(crown);
    // брызги-точки вокруг
    const splashGeo = new THREE.BufferGeometry();
    const pts: number[] = [];
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const r = 0.35 + (i % 3) * 0.15;
      pts.push(Math.cos(a) * r, 1.1 + (i % 4) * 0.12, Math.sin(a) * r);
    }
    splashGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const splash = new THREE.Points(splashGeo, new THREE.PointsMaterial({ color: 0xdff2ff, size: 0.07, transparent: true, opacity: 0.9 }));
    splash.name = 'fountainSplash';
    f.add(splash);
    g.add(f);
  }

  // Цветочная арка с 5 — увитая цветами
  if (L >= 5) {
    for (const x of [-1.2, 1.2]) {
      g.add(cyl(0.09, 0.11, 2.6, C.woodDark, x, 1.3, 12.5, 8));
    }
    g.add(box(2.7, 0.18, 0.3, C.woodDark, 0, 2.65, 12.5));
    // вьющаяся лоза: спираль из мелких листьев по столбам
    for (const x of [-1.2, 1.2]) {
      for (let i = 0; i < 8; i++) {
        const a = i * 1.2 + (x > 0 ? 1 : 0);
        g.add(sph(0.09, i % 2 ? C.leafDark : C.leaf, x + Math.cos(a) * 0.16, 0.5 + i * 0.26, 12.5 + Math.sin(a) * 0.16));
      }
    }
    for (let i = 0; i < 11; i++) {
      g.add(sph(0.13, flowerCols[i % flowerCols.length], -1.15 + i * 0.23, 2.78 + Math.sin(i * 1.4) * 0.08, 12.5));
      if (i % 2 === 0) g.add(sph(0.07, C.leafDark, -1.15 + i * 0.23, 2.62, 12.55));
    }
    // Скворечник на столбе рядом с аркой
    const bh = new THREE.Group();
    bh.position.set(2.1, 0, 12.2);
    bh.add(cyl(0.06, 0.07, 1.8, C.woodDark, 0, 0.9, 0, 6));
    bh.add(box(0.5, 0.45, 0.45, C.wood, 0, 2.0, 0));
    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.3, 4), mat(C.roof));
    roof.position.y = 2.37;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    bh.add(roof);
    const hole = new THREE.Mesh(new THREE.CircleGeometry(0.09, 10), new THREE.MeshBasicMaterial({ color: 0x4a3f38 }));
    hole.position.set(0, 2.02, 0.23);
    bh.add(hole);
    bh.add(cyl(0.02, 0.02, 0.25, C.woodDark, 0, 1.85, 0.28, 5));
    g.add(bh);
    // Лейка у клумбы
    const wc = new THREE.Group();
    wc.position.set(-3.4, 0, 7.2);
    wc.rotation.y = 0.6;
    wc.add(cyl(0.22, 0.26, 0.4, 0x9fd8c9, 0, 0.2, 0, 10));
    const spout = cyl(0.04, 0.06, 0.6, 0x9fd8c9, 0.35, 0.3, 0, 6);
    spout.rotation.z = -1.0;
    wc.add(spout);
    const rose = cyl(0.1, 0.07, 0.08, 0x7fb98e, 0.6, 0.18, 0, 8);
    wc.add(rose);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.03, 6, 12, Math.PI), mat(C.cocoa));
    handle.position.set(-0.22, 0.3, 0);
    handle.rotation.z = Math.PI / 2;
    wc.add(handle);
    g.add(wc);
  }
  return g;
}

// Зонтики над столиками. umbrellas lvl:
// 0 — нет; каждый уровень +1 зонтик (1→4), с 3 — полосатые,
// с 5 — гирлянда-лампочки по краю (пульс через userData.pulse).
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
    // Гирлянда-лампочки по краю с 5
    if (L >= 5) {
      for (let b = 0; b < 8; b++) {
        const a = (b / 8) * Math.PI * 2;
        const bm = new THREE.MeshStandardMaterial({ color: 0xffe6a3, emissive: 0xffc978, emissiveIntensity: 1, roughness: 0.6, flatShading: true });
        bm.userData.pulse = true;
        bm.userData.base = 1;
        bm.userData.seed = b * 0.8 + i;
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 5), bm);
        bulb.position.set(Math.cos(a) * 1.45, 2.42, Math.sin(a) * 1.45);
        u.add(bulb);
      }
    }
    g.add(u);
  }
  return g;
}
