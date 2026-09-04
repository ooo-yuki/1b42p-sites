import * as THREE from 'three';
import { C, box, cyl, sph, mat } from '../palette';

// Кухонный блок (стоит в пристрое справа от дома, x ≈ +5).
// fridge lvl: 0 — ящик-ледник; 1+ — холодильник, растёт и хорошеет
//   (наклейки-фрукты с 3, двойной с 5). +уплотнитель, полки сбоку,
//   банка варенья.
// stove lvl: 0 — костёр с котелком; 1+ — плита; конфорок 1→4,
//   духовка с 2, вытяжка с 4. Огонь — ТРЁХСЛОЙНЫЙ (ядро/язык/ореол,
//   у каждого слоя name='flame', flicker сцены цепляет каждый).
// pan lvl: 0 — пустая стена; 1+ — сковородки на стене (1→5 штук),
//   с 3 — полка с баночками специй, с 5 — золотая сковорода.
// Локальные x витрины: fridge -1.4 / stove 0.2 / pan 1.8 — держать.
export function buildKitchen(levels: { fridge: number; stove: number; pan: number }): THREE.Group {
  const g = new THREE.Group();
  g.add(buildFridge(Math.max(0, Math.min(5, levels.fridge)), -1.4));
  g.add(buildStove(Math.max(0, Math.min(5, levels.stove)), 0.2));
  g.add(buildPans(Math.max(0, Math.min(5, levels.pan)), 1.8));
  return g;
}

// Трёхслойный огонь: ореол + язык + ядро. Геометрия задаёт размер
// (scale трогает сцена во flicker — держать scale=1).
function buildFlame(size: number): THREE.Group {
  const g = new THREE.Group();
  const halo = new THREE.Mesh(
    new THREE.ConeGeometry(size, size * 2.4, 8),
    new THREE.MeshStandardMaterial({
      color: 0xff9a3d, emissive: 0xff6a2a, emissiveIntensity: 1.2,
      roughness: 1, flatShading: true, transparent: true, opacity: 0.85,
    }),
  );
  halo.position.y = size * 1.2;
  halo.name = 'flame';
  const tongue = new THREE.Mesh(
    new THREE.ConeGeometry(size * 0.62, size * 1.8, 8),
    new THREE.MeshStandardMaterial({
      color: C.fire, emissive: C.fireHot, emissiveIntensity: 1.6,
      roughness: 1, flatShading: true,
    }),
  );
  tongue.position.y = size * 1.0;
  tongue.name = 'flame';
  const core = new THREE.Mesh(
    new THREE.ConeGeometry(size * 0.32, size * 1.0, 8),
    new THREE.MeshStandardMaterial({
      color: 0xfff3c4, emissive: 0xffd76a, emissiveIntensity: 2.0,
      roughness: 1, flatShading: true,
    }),
  );
  core.position.y = size * 0.6;
  core.name = 'flame';
  // Искры — ребёнок языка: flicker языка тащит их за собой
  tongue.add(makeSparks(size));
  g.add(halo, tongue, core);
  return g;
}

// Искры: точки над огнём (пульс через масштаб родителя-flame).
function makeSparks(size: number): THREE.Points {
  const n = 14;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * size * 0.5;
    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = Math.random() * size * 1.8;
    pos[i * 3 + 2] = Math.sin(a) * r;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const m = new THREE.PointsMaterial({ color: 0xffd76a, size: 0.05, transparent: true, opacity: 0.9 });
  return new THREE.Points(geo, m);
}

// Угли: красные додекаэдры с горячим emissive.
function buildCoals(n: number, radius: number, y: number): THREE.Group {
  const g = new THREE.Group();
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + (i % 2) * 0.4;
    const coal = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.09 + (i % 3) * 0.03, 0),
      new THREE.MeshStandardMaterial({
        color: 0x5a2a22, emissive: i % 2 ? 0xff4a2a : 0xff7b3d,
        emissiveIntensity: 1.5, roughness: 1, flatShading: true,
      }),
    );
    coal.position.set(Math.cos(a) * radius, y + (i % 2) * 0.05, Math.sin(a) * radius);
    coal.rotation.set(i * 1.3, i * 0.7, 0);
    coal.userData.baseEmissive = 1.5;
    coal.userData.seed = i * 1.7;
    g.add(coal);
  }
  return g;
}

// Котелок на треноге: корпус + крышка + пузырьки кипения.
function buildPot(scale = 1): THREE.Group {
  const g = new THREE.Group();
  const bodyM = mat(0x4a4a52, { rough: 0.6, metal: 0.5 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.24 * scale, 0.2 * scale, 0.26 * scale, 12), bodyM);
  body.castShadow = true;
  g.add(body);
  // Ободок
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.24 * scale, 0.025 * scale, 6, 14), bodyM);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.13 * scale;
  g.add(rim);
  // Крышка + ручка-набалдашник
  const lid = new THREE.Mesh(new THREE.SphereGeometry(0.22 * scale, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2.4), bodyM);
  lid.position.y = 0.13 * scale;
  g.add(lid);
  g.add(sph(0.045 * scale, C.woodDark, 0, 0.32 * scale, 0));
  // Дужка
  const bail = new THREE.Mesh(new THREE.TorusGeometry(0.26 * scale, 0.02 * scale, 6, 12, Math.PI), bodyM);
  bail.position.y = 0.13 * scale;
  g.add(bail);
  // Пузырьки кипения (белая пенка по ободку)
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    g.add(sph(0.03 * scale, 0xfff6ea, Math.cos(a) * 0.17 * scale, 0.12 * scale, Math.sin(a) * 0.17 * scale));
  }
  // Статичный дымок-пар над котелком
  const steam = new THREE.Mesh(
    new THREE.SphereGeometry(0.12 * scale, 8, 6),
    new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, roughness: 1, flatShading: true }),
  );
  steam.position.y = 0.55 * scale;
  steam.name = 'potSteam';
  g.add(steam);
  return g;
}

function buildFridge(L: number, x: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, 0, 0);
  if (L === 0) {
    // Деревянный ящик-ледник
    g.add(box(1.1, 0.9, 0.9, C.wood, 0, 0.45, 0));
    g.add(box(1.2, 0.1, 1.0, C.woodDark, 0, 0.95, 0));
    g.add(box(0.5, 0.3, 0.06, C.cocoa, 0, 0.5, 0.46));
    return g;
  }
  const tall = L >= 5 ? 2.2 : 1.7;
  const bodyC = L >= 3 ? 0xeaf7ff : C.fridge;
  const body = box(1.1, tall, 0.95, bodyC, 0, tall / 2, 0);
  g.add(body);
  // Уплотнитель дверцы: тёмная рамка по периметру
  const sealC = 0x6a767e;
  const sz = 0.49;
  g.add(box(1.0, 0.06, 0.03, sealC, 0, tall - 0.06, sz));
  g.add(box(1.0, 0.06, 0.03, sealC, 0, 0.06, sz));
  g.add(box(0.06, tall, 0.03, sealC, -0.5, tall / 2, sz));
  g.add(box(0.06, tall, 0.03, sealC, 0.5, tall / 2, sz));
  // Дверца-шов + ручка
  g.add(box(0.04, tall * 0.8, 0.04, C.steel, 0, tall / 2, sz + 0.01));
  g.add(cyl(0.04, 0.04, 0.4, C.cocoa, 0.35, tall / 2 + 0.2, 0.53, 6));
  // Морозилка-шов со 2
  if (L >= 2) g.add(box(1.0, 0.05, 0.04, C.steel, 0, tall - 0.5, sz + 0.01));
  // Магнитики-фрукты с 3
  if (L >= 3) {
    const fruits = [0xf6a5b8, 0xffb347, 0xa8d5a2, 0xff7b54];
    fruits.slice(0, L + 1).forEach((c, i) => {
      g.add(sph(0.07, c, -0.3 + (i % 2) * 0.55, 0.6 + Math.floor(i / 2) * 0.35, 0.52));
    });
  }
  // Полки сбоку (справа): две доски + баночки
  if (L >= 2) {
    g.add(box(0.5, 0.06, 0.9, C.woodDark, 0.82, 0.7, 0));
    g.add(box(0.5, 0.06, 0.9, C.woodDark, 0.82, 1.15, 0));
    const jars = [0xf6a5b8, 0xffb347, 0xa8d5a2];
    jars.forEach((c, i) => {
      g.add(cyl(0.08, 0.08, 0.16, c, 0.82, 0.81, -0.28 + i * 0.28, 8));
      g.add(cyl(0.085, 0.085, 0.04, C.cocoa, 0.82, 0.91, -0.28 + i * 0.28, 8));
    });
  }
  // Банка варенья на полке / на холодильнике
  const jamY = L >= 2 ? 1.26 : tall + 0.12;
  const jamX = L >= 2 ? 0.82 : 0;
  const jam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 0.2, 10),
    new THREE.MeshStandardMaterial({ color: 0xd94a5a, roughness: 0.2, flatShading: true }),
  );
  jam.position.set(jamX, jamY, 0.2);
  g.add(jam);
  g.add(cyl(0.11, 0.11, 0.05, 0xf3e2cf, jamX, jamY + 0.12, 0.2, 10));
  g.add(box(0.12, 0.08, 0.02, 0xfff6ea, jamX, jamY, 0.31));
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
    // Костёр: камни + угли + трёхслойный огонь + котелок на треноге
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      g.add(sph(0.12, C.stone, Math.cos(a) * 0.45, 0.1, Math.sin(a) * 0.45));
    }
    g.add(buildCoals(6, 0.22, 0.12));
    const flame = buildFlame(0.22);
    flame.position.y = 0.15;
    g.add(flame);
    // Поленья
    for (const [rx, rz, rot] of [[-0.3, 0.1, 0.5], [0.3, -0.1, -0.5]] as Array<[number, number, number]>) {
      const log = cyl(0.06, 0.06, 0.8, C.trunk, rx, 0.2, rz, 6);
      log.rotation.z = Math.PI / 2.3;
      log.rotation.y = rot;
      g.add(log);
    }
    // Тренога + котелок
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2;
      const leg = cyl(0.04, 0.04, 1.4, C.woodDark, Math.cos(a) * 0.4, 0.7, Math.sin(a) * 0.4, 6);
      leg.rotation.z = -Math.cos(a) * 0.3;
      leg.rotation.x = Math.sin(a) * 0.3;
      g.add(leg);
    }
    const pot = buildPot(1);
    pot.position.y = 0.85;
    g.add(pot);
    return g;
  }
  // Корпус плиты
  g.add(box(1.5, 0.9, 1.0, L >= 3 ? 0xfff6ea : 0xd8dee3, 0, 0.45, 0));
  g.add(box(1.5, 0.08, 1.0, 0x5a5a5a, 0, 0.94, 0));
  // Ножки
  for (const [dx, dz] of [[-0.65, -0.4], [0.65, -0.4], [-0.65, 0.4], [0.65, 0.4]] as Array<[number, number]>) {
    g.add(cyl(0.05, 0.05, 0.12, 0x3a3a3a, dx, 0.06, dz, 6));
  }
  // Конфорки: 1→4 + решётки
  const burners = [1, 2, 2, 3, 4, 4][L];
  const bp: Array<[number, number]> = [[-0.35, -0.2], [0.35, -0.2], [-0.35, 0.25], [0.35, 0.25]];
  for (let i = 0; i < burners; i++) {
    g.add(cyl(0.16, 0.16, 0.04, 0x3a3a3a, bp[i][0], 0.99, bp[i][1], 10));
    // Решётка конфорки: крест из прутьев
    g.add(box(0.34, 0.03, 0.05, 0x2a2a2a, bp[i][0], 1.02, bp[i][1]));
    g.add(box(0.05, 0.03, 0.34, 0x2a2a2a, bp[i][0], 1.02, bp[i][1]));
    if (i < 2) {
      // Кастрюльки на первых двух
      g.add(cyl(0.14, 0.12, 0.16, i ? C.door : C.roof, bp[i][0], 1.12, bp[i][1], 10));
      g.add(sph(0.03, C.cocoa, bp[i][0], 1.22, bp[i][1]));
    }
  }
  // Ручки-регуляторы на передней панели
  const knobs = Math.min(4, burners);
  for (let i = 0; i < knobs; i++) {
    const kx = -0.45 + i * 0.3;
    const k = cyl(0.05, 0.05, 0.08, 0x8a6a5a, kx, 0.72, 0.52, 8);
    k.rotation.x = Math.PI / 2;
    g.add(k);
    // Риска-индикатор
    g.add(box(0.02, 0.05, 0.02, 0xff4a2a, kx, 0.76, 0.55));
  }
  // Огонь в духовке (трёхслойный, видно через окошко)
  const fire = buildFlame(0.16);
  fire.position.set(0, 0.12, 0.4);
  fire.scale.z = 0.5;
  g.add(fire);
  if (L >= 2) {
    // Окошко духовки
    const win = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x554433, emissive: 0xff9a4d, emissiveIntensity: 0.7, roughness: 0.4 }),
    );
    win.position.set(0, 0.35, 0.51);
    g.add(win);
    // Ручка духовки + полотенце на ней
    g.add(cyl(0.035, 0.035, 1.1, C.steel, 0, 0.62, 0.56, 8));
    const towel = new THREE.Mesh(
      new THREE.BoxGeometry(0.3, 0.45, 0.04),
      new THREE.MeshStandardMaterial({ map: towelTexture(), roughness: 1, flatShading: true }),
    );
    towel.position.set(0.3, 0.38, 0.56);
    g.add(towel);
  }
  // Вытяжка с 4: купол + труба + фильтр-решётка
  if (L >= 4) {
    g.add(box(1.3, 0.5, 0.9, C.steel, 0, 2.2, 0));
    g.add(box(1.1, 0.1, 0.7, 0x9aa8b2, 0, 1.94, 0));
    // Фильтр: рамка + 5 ламелей
    g.add(box(0.9, 0.04, 0.5, 0x7a8892, 0, 1.9, 0));
    for (let i = 0; i < 5; i++) {
      g.add(box(0.06, 0.05, 0.5, 0x5a6670, -0.32 + i * 0.16, 1.9, 0));
    }
    g.add(cyl(0.15, 0.15, 0.8, C.steel, 0, 2.8, 0, 8));
    g.add(cyl(0.18, 0.18, 0.08, 0x7a8892, 0, 3.2, 0, 8));
  }
  // Боковой столик с 5 + котелок с пузырьками
  if (L >= 5) {
    g.add(box(0.9, 0.85, 0.9, C.wood, 1.25, 0.42, 0));
    const pot = buildPot(0.9);
    pot.position.set(1.25, 1.0, 0);
    g.add(pot);
  }
  return g;
}

// Полотенце: вафельная клетка.
function towelTexture(): THREE.CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width = 64; cv.height = 64;
  const ctx = cv.getContext('2d')!;
  ctx.fillStyle = '#fff6ea';
  ctx.fillRect(0, 0, 64, 64);
  ctx.strokeStyle = '#9fd8c9';
  ctx.lineWidth = 3;
  for (let i = 0; i <= 4; i++) {
    ctx.beginPath(); ctx.moveTo((i * 64) / 4, 0); ctx.lineTo((i * 64) / 4, 64); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, (i * 64) / 4); ctx.lineTo(64, (i * 64) / 4); ctx.stroke();
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildPans(L: number, x: number): THREE.Group {
  const g = new THREE.Group();
  g.position.set(x, 0, 0);
  // Доска на стене + крючки
  g.add(box(0.12, 1.8, 2.2, C.wood, 0, 1.5, 0));
  g.add(box(0.14, 0.1, 2.2, C.woodDark, 0, 2.42, 0));
  const panCols = [0x5a5a5a, 0x5a5a5a, 0x777777, 0x777777, 0x8a8a8a, 0xd9a441];
  for (let i = 0; i < L; i++) {
    const py = 2.1 - i * 0.32;
    const pz = -0.7 + (i % 3) * 0.7;
    const gold = L >= 5 && i === 0;
    g.add(sph(0.035, C.cocoa, 0.1, py + 0.3, pz));
    const pan = cyl(0.16, 0.16, 0.05, gold ? panCols[5] : panCols[i], 0.12, py, pz, 12);
    pan.rotation.z = Math.PI / 2;
    g.add(pan);
    // Внутренность сковороды (блик)
    const inner = cyl(0.12, 0.12, 0.055, gold ? 0xf3d27a : 0x3a3a3a, 0.12, py, pz, 12);
    inner.rotation.z = Math.PI / 2;
    g.add(inner);
    g.add(cyl(0.03, 0.03, 0.25, C.woodDark, 0.12, py + 0.24, pz, 6));
  }
  // Полка со специями с 3
  if (L >= 3) {
    g.add(box(0.35, 0.06, 1.6, C.woodDark, 0.2, 0.75, 0));
    g.add(box(0.35, 0.25, 0.06, C.woodDark, 0.2, 0.6, -0.8));
    g.add(box(0.35, 0.25, 0.06, C.woodDark, 0.2, 0.6, 0.8));
    const spice = [0xf6a5b8, 0xffb347, 0xa8d5a2, 0xd9c0e8];
    spice.slice(0, L).forEach((c, i) => {
      g.add(cyl(0.07, 0.07, 0.14, c, 0.2, 0.85, -0.55 + i * 0.35, 8));
      g.add(cyl(0.075, 0.075, 0.03, C.cocoa, 0.2, 0.93, -0.55 + i * 0.35, 8));
    });
  }
  return g;
}
