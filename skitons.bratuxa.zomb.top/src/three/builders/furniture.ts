import * as THREE from 'three';
import { C, box, cyl, sph, mat } from '../palette';

export interface TablesResult {
  group: THREE.Group;
  // якоря для спрайтов пара + посадочные места гостей
  steamAnchors: THREE.Object3D[];
  seats: THREE.Object3D[];
}

// Стол: круглая столешница + ножка; стулья — табуретки.
// chairs lvl: 0 — 1 стол/2 стула, бедные; 5 — 4 стола, стулья со
// спинками, скатерти, чашки с паром на каждом столе.
export function buildTables(chairsLvl: number): TablesResult {
  const g = new THREE.Group();
  const steamAnchors: THREE.Object3D[] = [];
  const seats: THREE.Object3D[] = [];
  const L = Math.max(0, Math.min(5, chairsLvl));

  const tableCount = [1, 2, 2, 3, 3, 4][L];
  const pos: Array<[number, number]> = [
    [-4.5, 5.5], [4.5, 5.5], [-4.5, 0.5], [4.8, 0.2], [0, 6.2], [-0.5, -3.5],
  ];
  const clothColors = [0xffffff, 0xf6a5b8, 0x9fd8c9, 0xffd9c0, 0xcdeac0, 0xbfe3ff];

  for (let t = 0; t < tableCount; t++) {
    const [px, pz] = pos[t % pos.length];
    const table = new THREE.Group();
    table.position.set(px, 0, pz);

    // Столешница
    const top = cyl(0.85, 0.85, 0.12, C.wood, 0, 0.78, 0, 14);
    table.add(top);
    // Скатерть со 2 уровня
    if (L >= 2) {
      const cloth = cyl(0.88, 0.95, 0.18, clothColors[t % clothColors.length], 0, 0.82, 0, 14);
      table.add(cloth);
    }
    table.add(cyl(0.09, 0.14, 0.75, C.woodDark, 0, 0.38, 0));
    table.add(cyl(0.4, 0.45, 0.08, C.woodDark, 0, 0.04, 0));

    // Чашки: по одной с lvl 1, по две с lvl 4 + пар
    const cups = L >= 4 ? 2 : L >= 1 ? 1 : 0;
    for (let c = 0; c < cups; c++) {
      const cx = c === 0 ? 0.3 : -0.35;
      const cz = c === 0 ? 0.1 : -0.2;
      table.add(cyl(0.11, 0.09, 0.14, 0xffffff, cx, 0.92, cz, 8));
      table.add(cyl(0.12, 0.12, 0.03, C.cocoa, cx, 0.845, cz, 8));
      const anchor = new THREE.Object3D();
      anchor.position.set(cx, 1.05, cz);
      anchor.name = 'steam';
      table.add(anchor);
      steamAnchors.push(anchor);
    }
    // Вазочка с цветком с lvl 3
    if (L >= 3) {
      table.add(cyl(0.07, 0.1, 0.18, C.door, -0.05, 0.93, 0.35, 8));
      table.add(sph(0.09, clothColors[(t + 2) % clothColors.length], -0.05, 1.08, 0.35));
    }

    g.add(table);

    // Стулья вокруг (2 / 3 / 4 по уровню)
    const chairs = L >= 4 ? 4 : L >= 2 ? 3 : 2;
    for (let s = 0; s < chairs; s++) {
      const a = (s / chairs) * Math.PI * 2 + t * 0.5;
      const sx = px + Math.cos(a) * 1.5;
      const sz = pz + Math.sin(a) * 1.5;
      const chair = buildChair(L);
      chair.position.set(sx, 0, sz);
      chair.rotation.y = -a + Math.PI / 2;
      g.add(chair);
      if (s < 2) {
        const seat = new THREE.Object3D();
        seat.position.set(sx, 0, sz);
        seat.rotation.y = Math.atan2(px - sx, pz - sz);
        seat.name = 'seat';
        g.add(seat);
        seats.push(seat);
      }
    }
  }
  return { group: g, steamAnchors, seats };
}

function buildChair(L: number): THREE.Group {
  const c = new THREE.Group();
  const seatC = L >= 3 ? C.peach : C.wood;
  c.add(box(0.55, 0.1, 0.55, seatC, 0, 0.45, 0));
  const legC = C.woodDark;
  for (const [dx, dz] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) {
    c.add(cyl(0.04, 0.04, 0.45, legC, dx, 0.22, dz, 6));
  }
  // Спинка с lvl 2, мягкая подушка с lvl 5
  if (L >= 2) {
    c.add(box(0.55, 0.6, 0.08, seatC, 0, 0.85, -0.26));
    if (L >= 5) c.add(box(0.45, 0.4, 0.12, C.mint, 0, 0.85, -0.24));
  } else if (L >= 5) {
    c.add(box(0.5, 0.08, 0.5, C.mint, 0, 0.53, 0));
  }
  return c;
}

// Веранда: настил + столбики + навес. Растёт с уровнем:
// 0 — нет; 1 — маленький настил; 2 — +навес; 3 — +перила;
// 4 — +гирлянда (шарики, светятся); 5 — большая, +качели-скамья.
export function buildVeranda(lv: number): THREE.Group {
  const g = new THREE.Group();
  const L = Math.max(0, Math.min(5, lv));
  if (L <= 0) return g;

  const w = 6 + L * 0.8;
  const d = 2 + L * 0.35;
  const z = 2.8 + 0.7 + d / 2; // перед домом (дом D/2=2.8)
  g.add(box(w, 0.18, d, 0xe3c9a8, 0, 0.09, z));

  if (L >= 2) {
    // Навес полосатый
    const awn = new THREE.Group();
    for (let i = 0; i < Math.ceil(w / 0.8); i++) {
      const stripe = box(0.8, 0.08, d + 0.6, i % 2 ? 0xffffff : C.awning, -w / 2 + 0.4 + i * 0.8, 2.5, z);
      stripe.rotation.x = 0.08;
      awn.add(stripe);
    }
    g.add(awn);
    for (const x of [-w / 2 + 0.2, w / 2 - 0.2]) {
      g.add(cyl(0.08, 0.08, 2.5, C.woodDark, x, 1.25, z + d / 2));
    }
  }
  if (L >= 3) {
    // Перила
    for (let i = 0; i <= 8; i++) {
      g.add(box(0.08, 0.5, 0.08, C.woodDark, -w / 2 + (i / 8) * w, 0.45, z + d / 2));
    }
    g.add(box(w, 0.08, 0.1, C.woodDark, 0, 0.72, z + d / 2));
  }
  if (L >= 4) {
    // Гирлянда: шарики с emissive
    const gar = new THREE.Group();
    gar.name = 'garland';
    for (let i = 0; i <= 12; i++) {
      const b = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 8, 6),
        new THREE.MeshStandardMaterial({ color: 0xffe6a3, emissive: 0xffc978, emissiveIntensity: 0.9, roughness: 0.6, flatShading: true }),
      );
      b.position.set(-w / 2 + (i / 12) * w, 2.35 - Math.sin((i / 12) * Math.PI) * 0.35, z + d / 2);
      gar.add(b);
    }
    g.add(gar);
  }
  if (L >= 5) {
    // Скамья-качели
    const sw = new THREE.Group();
    sw.name = 'swing';
    sw.position.set(w / 2 - 1, 0, z);
    sw.add(box(1.4, 0.1, 0.5, C.mint, 0, 0.7, 0));
    sw.add(box(1.4, 0.5, 0.1, C.mint, 0, 1.0, -0.22));
    sw.add(cyl(0.03, 0.03, 1.9, C.cocoa, -0.6, 1.6, 0, 6));
    sw.add(cyl(0.03, 0.03, 1.9, C.cocoa, 0.6, 1.6, 0, 6));
    g.add(sw);
    void mat;
  }
  return g;
}
