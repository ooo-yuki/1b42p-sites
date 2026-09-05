import * as THREE from 'three';
import { C, box, cyl, sph, mat } from '../palette';

export interface TablesResult {
  group: THREE.Group;
  // якоря для спрайтов пара + посадочные места гостей
  steamAnchors: THREE.Object3D[];
  seats: THREE.Object3D[];
}

// Столы ВНУТРИ зала (зал x∈[-3.5,3.5], z∈[-2.8,2.8]).
// Позиции [[-2.2,1.5],[2.2,1.5],[-2.2,-1.1],[2.2,-1.1]] — НЕ менять.
// Счёт [1,2,2,3,3,4] по lvl chairs, по 2 seats на стол, радиус стульев 1.2.
const POS: Array<[number, number]> = [[-2.2, 1.5], [2.2, 1.5], [-2.2, -1.1], [2.2, -1.1]];
const COUNT = [1, 2, 2, 3, 3, 4];
const CHAIR_R = 1.2;

export function buildTables(chairsLvl: number): TablesResult {
  const g = new THREE.Group();
  const steamAnchors: THREE.Object3D[] = [];
  const seats: THREE.Object3D[] = [];
  const L = Math.max(0, Math.min(5, chairsLvl));
  const n = COUNT[L];
  const clothKinds = ['check', 'dots', 'check', 'dots'] as const;
  const clothColors = [0xffffff, 0xf6a5b8, 0x9fd8c9, 0xffd9c0];
  const flowerCols = [0xf6a5b8, 0xffb347, 0xd9c0e8, 0xff7b54];

  for (let t = 0; t < n; t++) {
    const [px, pz] = POS[t];
    const table = new THREE.Group();
    table.position.set(px, 0, pz);
    table.add(cyl(0.85, 0.85, 0.12, C.wood, 0, 0.78, 0, 14));
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.035, 6, 18), mat(C.woodDark));
    rim.rotation.x = Math.PI / 2;
    rim.position.y = 0.78;
    table.add(rim);
    // Скатерть со 2 уровня: клетка/горох через CanvasTexture + бахрома
    if (L >= 2) {
      const cloth = new THREE.Mesh(
        new THREE.CylinderGeometry(0.88, 0.95, 0.18, 14),
        new THREE.MeshStandardMaterial({
          map: clothTexture(clothKinds[t % 4], clothColors[t % 4]),
          roughness: 1, flatShading: true,
        }),
      );
      cloth.position.y = 0.82;
      cloth.castShadow = true;
      cloth.receiveShadow = true;
      table.add(cloth);
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2;
        table.add(sph(0.035, 0xfff6ea, Math.cos(a) * 0.93, 0.73, Math.sin(a) * 0.93));
      }
    }
    table.add(cyl(0.09, 0.14, 0.75, C.woodDark, 0, 0.38, 0));
    table.add(cyl(0.4, 0.45, 0.08, C.woodDark, 0, 0.04, 0));
    // Чашки: 1 с lvl 1, 2 с lvl 4 (блюдце + чашка + чай + ручка + ложечка + пар)
    const cups = L >= 4 ? 2 : L >= 1 ? 1 : 0;
    for (let c = 0; c < cups; c++) {
      const cx = c === 0 ? 0.3 : -0.35;
      const cz = c === 0 ? 0.1 : -0.2;
      table.add(cyl(0.16, 0.11, 0.03, 0xfff6ea, cx, 0.9, cz, 10));
      table.add(cyl(0.11, 0.09, 0.14, 0xffffff, cx, 0.99, cz, 10));
      table.add(cyl(0.09, 0.09, 0.02, C.cocoa, cx, 1.05, cz, 10));
      const handle = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.015, 6, 10), mat(0xffffff));
      handle.position.set(cx + 0.11, 0.99, cz);
      table.add(handle);
      const spoon = box(0.03, 0.015, 0.22, C.steel, cx + 0.2, 0.9, cz + 0.08);
      spoon.rotation.y = 0.5;
      table.add(spoon);
      table.add(sph(0.03, C.steel, cx + 0.25, 0.9, cz + 0.17));
      const anchor = new THREE.Object3D();
      anchor.position.set(cx, 1.12, cz);
      anchor.name = 'steam';
      table.add(anchor);
      steamAnchors.push(anchor);
    }
    // Вазочка с цветком с lvl 3
    if (L >= 3) {
      const fc = flowerCols[t % 4];
      table.add(cyl(0.07, 0.1, 0.18, C.door, -0.05, 1.0, 0.35, 8));
      table.add(cyl(0.02, 0.02, 0.25, C.leafDark, -0.05, 1.15, 0.35, 6));
      table.add(sph(0.06, fc, -0.05, 1.3, 0.35));
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        table.add(sph(0.035, fc, -0.05 + Math.cos(a) * 0.08, 1.3, 0.35 + Math.sin(a) * 0.08));
      }
      table.add(sph(0.035, 0xfff3c4, -0.05, 1.31, 0.35));
      const leaf = sph(0.045, C.leaf, -0.12, 1.12, 0.35);
      leaf.scale.set(1.4, 0.5, 0.8);
      table.add(leaf);
    }
    g.add(table);
    // По 2 стула на стол, r=1.2; оба — посадочные места лицом к столу
    const base = t * 0.9 + 0.4;
    for (let s = 0; s < 2; s++) {
      const a = base + s * Math.PI;
      const sx = px + Math.cos(a) * CHAIR_R;
      const sz = pz + Math.sin(a) * CHAIR_R;
      const chair = buildChair(L, s);
      chair.position.set(sx, 0, sz);
      chair.rotation.y = Math.atan2(px - sx, pz - sz);
      g.add(chair);
      const seat = new THREE.Object3D();
      seat.position.set(sx, 0, sz);
      seat.rotation.y = Math.atan2(px - sx, pz - sz);
      seat.name = 'seat';
      g.add(seat);
      seats.push(seat);
    }
  }
  return { group: g, steamAnchors, seats };
}

// Стул: сиденье + ножки + перекладины; с lvl 2 — резная спинка
// (стойки + точёные рейки + верхняя планка + медальон сердце/круг).
function buildChair(L: number, variant: number): THREE.Group {
  const c = new THREE.Group();
  const seatC = L >= 3 ? C.peach : C.wood;
  c.add(box(0.55, 0.1, 0.55, seatC, 0, 0.45, 0));
  c.add(box(0.59, 0.05, 0.59, C.woodDark, 0, 0.4, 0));
  for (const [dx, dz] of [[-0.2, -0.2], [0.2, -0.2], [-0.2, 0.2], [0.2, 0.2]]) {
    c.add(cyl(0.04, 0.04, 0.45, C.woodDark, dx, 0.22, dz, 6));
  }
  c.add(box(0.44, 0.05, 0.05, C.woodDark, 0, 0.15, -0.2));
  c.add(box(0.44, 0.05, 0.05, C.woodDark, 0, 0.15, 0.2));
  if (L >= 2) {
    c.add(box(0.07, 0.65, 0.07, seatC, -0.24, 0.82, -0.26));
    c.add(box(0.07, 0.65, 0.07, seatC, 0.24, 0.82, -0.26));
    for (const bx of [-0.12, 0, 0.12]) {
      c.add(cyl(0.03, 0.03, 0.5, seatC, bx, 0.82, -0.26, 6));
      c.add(sph(0.045, C.woodDark, bx, 0.82, -0.26));
    }
    c.add(box(0.55, 0.12, 0.07, seatC, 0, 1.12, -0.26));
    c.add(sph(0.06, seatC, -0.2, 1.18, -0.26));
    c.add(sph(0.06, seatC, 0.2, 1.18, -0.26));
    if (variant % 2 === 0) {
      const heart = makeHeartTiny(0.07, C.door);
      heart.position.set(0, 0.95, -0.22);
      c.add(heart);
    } else {
      c.add(sph(0.07, C.door, 0, 0.95, -0.22));
    }
  }
  if (L >= 4) c.add(box(0.48, 0.07, 0.48, C.mint, 0, 0.53, 0));
  return c;
}

// Скатерть: клетка или горох.
function clothTexture(kind: 'check' | 'dots', base: number): THREE.CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width = 128; cv.height = 128;
  const ctx = cv.getContext('2d')!;
  ctx.fillStyle = '#' + base.toString(16).padStart(6, '0');
  ctx.fillRect(0, 0, 128, 128);
  if (kind === 'check') {
    ctx.strokeStyle = 'rgba(138,106,90,0.55)';
    ctx.lineWidth = 4;
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo((i * 128) / 4, 0); ctx.lineTo((i * 128) / 4, 128); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, (i * 128) / 4); ctx.lineTo(128, (i * 128) / 4); ctx.stroke();
    }
  } else {
    ctx.fillStyle = 'rgba(138,106,90,0.6)';
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        ctx.beginPath();
        ctx.arc(16 + x * 32 + (y % 2) * 16, 16 + y * 32, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeHeartTiny(size: number, color: number): THREE.Mesh {
  const s = new THREE.Shape();
  s.moveTo(0, -size * 0.6);
  s.bezierCurveTo(-size * 1.2, size * 0.3, -size * 0.6, size * 1.1, 0, size * 0.45);
  s.bezierCurveTo(size * 0.6, size * 1.1, size * 1.2, size * 0.3, 0, -size * 0.6);
  return new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: false }), mat(color, { rough: 0.7 }));
}

// Веранда-терраса снаружи (перед домом): настил + столбики + навес.
// 0 — нет; 1 — настил; 2 — +навес; 3 — +перила-балясины;
// 4 — +гирлянда; 5 — +ковёр-дорожка и качели на цепях (имя 'swing').
export function buildVeranda(lv: number): THREE.Group {
  const g = new THREE.Group();
  const L = Math.max(0, Math.min(5, lv));
  if (L <= 0) return g;

  const w = 6 + L * 0.8;
  const d = 2 + L * 0.35;
  const z = 2.8 + 0.7 + d / 2; // перед домом (дом D/2=2.8)
  // Настил из досок: 5 продольных планок с зазорами
  for (let i = 0; i < 5; i++) {
    const pz = z - d / 2 + (i + 0.5) * (d / 5);
    g.add(box(w, 0.18, d / 5 - 0.06, i % 2 ? 0xe3c9a8 : 0xdcbf9a, 0, 0.09, pz));
  }
  // Обвязка настила
  g.add(box(w + 0.2, 0.2, 0.14, C.woodDark, 0, 0.1, z - d / 2));
  g.add(box(w + 0.2, 0.2, 0.14, C.woodDark, 0, 0.1, z + d / 2));
  // Ступенька входа
  g.add(box(1.6, 0.12, 0.5, C.stone, 0, 0.06, z + d / 2 + 0.3));

  if (L >= 2) {
    // Навес полосатый
    const awn = new THREE.Group();
    for (let i = 0; i < Math.ceil(w / 0.8); i++) {
      const stripe = box(0.8, 0.08, d + 0.6, i % 2 ? 0xffffff : C.awning, -w / 2 + 0.4 + i * 0.8, 2.5, z);
      stripe.rotation.x = 0.08;
      awn.add(stripe);
    }
    // Фестончатый край навеса
    for (let i = 0; i < Math.ceil(w / 0.4); i++) {
      awn.add(sph(0.09, i % 2 ? 0xffffff : C.awning, -w / 2 + 0.2 + i * 0.4, 2.42, z + (d + 0.6) / 2));
    }
    g.add(awn);
    for (const x of [-w / 2 + 0.2, w / 2 - 0.2]) {
      g.add(cyl(0.08, 0.08, 2.5, C.woodDark, x, 1.25, z + d / 2));
      // Капитель столбика
      g.add(box(0.24, 0.12, 0.24, C.woodDark, x, 2.45, z + d / 2));
    }
  }
  if (L >= 3) {
    // Перила с балясинами: поручень + точёные столбики + нижняя планка
    g.add(box(w, 0.1, 0.12, C.woodDark, 0, 0.72, z + d / 2));
    g.add(box(w, 0.08, 0.08, C.woodDark, 0, 0.22, z + d / 2));
    const n = Math.floor(w / 0.5);
    for (let i = 0; i <= n; i++) {
      const bx = -w / 2 + (i / n) * w;
      // Балясина: ножка + утолщение-«ваза» + шейка
      g.add(cyl(0.035, 0.035, 0.2, C.cocoa, bx, 0.32, z + d / 2, 6));
      g.add(sph(0.06, C.cocoa, bx, 0.45, z + d / 2));
      g.add(cyl(0.03, 0.03, 0.12, C.cocoa, bx, 0.56, z + d / 2, 6));
    }
    // Боковые перила
    for (const sx of [-1, 1]) {
      g.add(box(0.12, 0.1, d, C.woodDark, sx * w / 2, 0.72, z));
      const m = Math.floor(d / 0.5);
      for (let i = 0; i <= m; i++) {
        g.add(cyl(0.035, 0.035, 0.5, C.cocoa, sx * w / 2, 0.47, z - d / 2 + (i / Math.max(1, m)) * d, 6));
      }
    }
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
    // Провод гирлянды
    for (let i = 0; i < 12; i++) {
      const x0 = -w / 2 + (i / 12) * w;
      const x1 = -w / 2 + ((i + 1) / 12) * w;
      const wire = cyl(0.015, 0.015, Math.abs(x1 - x0) + 0.05, 0x5a463c, (x0 + x1) / 2, 2.38, z + d / 2, 4);
      wire.rotation.z = Math.PI / 2;
      gar.add(wire);
    }
    g.add(gar);
  }
  if (L >= 5) {
    // Ковёр-дорожка по настилу
    const runner = new THREE.Mesh(
      new THREE.BoxGeometry(w - 2.5, 0.04, 0.9),
      new THREE.MeshStandardMaterial({ map: runnerTexture(), roughness: 1, flatShading: true }),
    );
    runner.position.set(-0.5, 0.2, z);
    runner.receiveShadow = true;
    g.add(runner);
    // Качели на цепях: рама + цепи + скамья (имя 'swing' сохранить)
    const sw = new THREE.Group();
    sw.name = 'swing';
    sw.position.set(w / 2 - 1, 0, z);
    // А-образная рама
    for (const sx of [-0.8, 0.8]) {
      const legA = cyl(0.06, 0.06, 2.6, C.woodDark, sx, 1.3, 0.35, 6);
      legA.rotation.x = 0.18;
      sw.add(legA);
      const legB = cyl(0.06, 0.06, 2.6, C.woodDark, sx, 1.3, -0.35, 6);
      legB.rotation.x = -0.18;
      sw.add(legB);
    }
    sw.add(cyl(0.06, 0.06, 1.8, C.woodDark, 0, 2.5, 0, 6));
    // Цепи: звенья-торы
    for (const sx of [-0.6, 0.6]) {
      for (let i = 0; i < 8; i++) {
        const link = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.015, 6, 8), mat(C.steel, { metal: 0.6, rough: 0.4 }));
        link.position.set(sx, 2.3 - i * 0.19, 0);
        link.rotation.y = (i % 2) * Math.PI / 2;
        sw.add(link);
      }
    }
    // Скамья: сиденье + спинка + подушки
    sw.add(box(1.4, 0.1, 0.5, C.mint, 0, 0.7, 0));
    sw.add(box(1.4, 0.5, 0.1, C.mint, 0, 1.0, -0.22));
    sw.add(box(0.5, 0.3, 0.12, C.peach, -0.35, 0.9, -0.15));
    sw.add(box(0.5, 0.3, 0.12, C.peach, 0.35, 0.9, -0.15));
    // Подлокотники
    for (const sx of [-0.7, 0.7]) {
      sw.add(box(0.08, 0.08, 0.5, C.woodDark, sx, 0.95, 0));
    }
    g.add(sw);
  }
  return g;
}

// Дорожка: бордюр + ромбы.
function runnerTexture(): THREE.CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width = 256; cv.height = 64;
  const ctx = cv.getContext('2d')!;
  ctx.fillStyle = '#f6a5b8';
  ctx.fillRect(0, 0, 256, 64);
  ctx.fillStyle = '#fff6ea';
  ctx.fillRect(0, 0, 256, 8);
  ctx.fillRect(0, 56, 256, 8);
  ctx.fillStyle = '#9fd8c9';
  for (let i = 0; i < 4; i++) {
    const x = 32 + i * 64;
    ctx.beginPath();
    ctx.moveTo(x, 14); ctx.lineTo(x + 20, 32); ctx.lineTo(x, 50); ctx.lineTo(x - 20, 32);
    ctx.closePath(); ctx.fill();
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
