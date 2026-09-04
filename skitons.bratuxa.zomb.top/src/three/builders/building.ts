import * as THREE from 'three';
import { C, box, cyl, sph, mat } from '../palette';

// Дом + крыша + окна + дверь + вывеска SKITONS.
// lvl 0: лачуга (маленькая, тусклая, без вывески-подсветки)
// lvl 1: +ставни и тёплые окна
// lvl 2: +крыльцо и козырёк
// lvl 3: +второй скат/мансарда (выше крыша + окно), фахверк-балки
// lvl 4: +пристрой сбоку (кухонное крыло)
// lvl 5: двухэтажное здание + кирпичная труба с дымком
// Фундамент: корпус W=7, H=3.4, D=5.6 стоит в origin — камеры завязаны,
// вертикальные позиции корпуса НЕ двигать, цоколь — skirt вокруг низа.
export function buildBuilding(lv: number): THREE.Group {
  const g = new THREE.Group();
  const L = Math.max(0, Math.min(5, lv));
  const shabby = L === 0;

  const wallC = shabby ? 0xe9d5c2 : C.wall;
  const W = 7, H = 3.4, D = 5.6;

  // --- Цоколь-фундамент: каменный skirt + отлив ---
  g.add(box(W + 0.4, 0.7, D + 0.4, C.stone, 0, 0.32, 0));
  g.add(box(W + 0.55, 0.12, D + 0.55, 0xd9c4ae, 0, 0.68, 0));
  // Каменные блоки цоколя (швы): ряд тёмных вставок
  for (let i = 0; i < 7; i++) {
    g.add(box(0.08, 0.5, 0.04, 0xcbb694, -W / 2 + 0.5 + i * 1.0, 0.3, D / 2 + 0.2));
  }

  // --- Корпус ---
  g.add(box(W, H, D, wallC, 0, H / 2, 0));

  // --- Угловые доски-trim ---
  const trimC = shabby ? 0x9a7a68 : C.cocoa;
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as Array<[number, number]>) {
    g.add(box(0.28, H, 0.28, trimC, sx * (W / 2 - 0.05), H / 2, sz * (D / 2 - 0.05)));
    // Декоративные шляпки гвоздей
    g.add(sph(0.045, 0x5a463c, sx * (W / 2 - 0.05), H - 0.4, sz * (D / 2 + 0.1)));
    g.add(sph(0.045, 0x5a463c, sx * (W / 2 - 0.05), 0.9, sz * (D / 2 + 0.1)));
  }
  // Верхний обвязочный брус под крышей
  g.add(box(W + 0.3, 0.22, D + 0.3, trimC, 0, H - 0.11, 0));

  // --- Фахверк-балки (lvl≥3): вертикали + диагонали по фасаду ---
  if (L >= 3) {
    const beamC = C.woodDark;
    for (const bx of [-2.6, -1.3, 1.3, 2.6]) {
      g.add(box(0.18, H - 0.9, 0.1, beamC, bx, H / 2 + 0.1, D / 2 + 0.03));
    }
    g.add(box(W - 0.4, 0.18, 0.1, beamC, 0, H - 0.6, D / 2 + 0.03));
    g.add(box(W - 0.4, 0.18, 0.1, beamC, 0, 1.0, D / 2 + 0.03));
    for (const [bx, rot] of [[-1.95, 0.6], [1.95, -0.6]] as Array<[number, number]>) {
      const diag = box(0.16, 1.9, 0.1, beamC, bx, H / 2 + 0.35, D / 2 + 0.03);
      diag.rotation.z = rot;
      g.add(diag);
    }
  }

  // --- Второй этаж (lvl 5) ---
  if (L >= 5) {
    g.add(box(W * 0.86, 2.2, D * 0.86, 0xfffaf2, 0, H + 1.1, -0.2));
    // Угловой trim второго этажа
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as Array<[number, number]>) {
      g.add(box(0.22, 2.2, 0.22, trimC, sx * (W * 0.43 - 0.05), H + 1.1, -0.2 + sz * (D * 0.43 - 0.05)));
    }
    buildBrickChimney(g, W * 0.28, H, -1.2);
  }

  // --- Крыша: односкатная лачуга -> двускатная призма с lvl 1 ---
  const roofY = L >= 5 ? H + 2.2 : H;
  if (L === 0) {
    const r = box(W + 1, 0.3, D + 1, 0xb9a08e, 0.3, roofY + 0.15, 0);
    r.rotation.z = -0.06;
    g.add(r);
  } else {
    const roofMat = mat(L >= 3 ? C.roofDark : C.roof);
    const shape = new THREE.Shape();
    shape.moveTo(-W / 2 - 0.6, 0);
    shape.lineTo(W / 2 + 0.6, 0);
    shape.lineTo(0, L >= 3 ? 2.4 : 1.7);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: D + 1, bevelEnabled: false });
    const roof = new THREE.Mesh(geo, roofMat);
    roof.position.set(0, roofY, -(D + 1) / 2);
    roof.castShadow = true;
    roof.receiveShadow = true;
    g.add(roof);
    // Коньковая балка
    g.add(box(0.3, 0.22, D + 1.2, trimC, 0, roofY + (L >= 3 ? 2.35 : 1.65), 0));
    // Торцевые доски-причелины
    for (const sx of [-1, 1]) {
      const barge = box(0.14, 0.3, D + 1.1, trimC, sx * (W / 2 + 0.55), roofY + 0.35, 0);
      barge.rotation.z = sx * (L >= 3 ? 0.62 : 0.5);
      g.add(barge);
    }
  }

  // --- Окна: рамы + подоконники + ставни с сердечком ---
  const winCount = [1, 2, 3, 4, 4, 6][L];
  const winMat = new THREE.MeshStandardMaterial({
    color: shabby ? C.window : C.windowLit,
    emissive: shabby ? 0x000000 : 0xffc978,
    emissiveIntensity: shabby ? 0 : 0.55,
    roughness: 0.4, flatShading: true,
  });
  for (let i = 0; i < winCount; i++) {
    const top = L >= 5 && i >= 4;
    const slots = Math.min(winCount, 4);
    const x = top ? (i - 4 - 0.5) * 2.2 : (i - (slots - 1) / 2) * 2.1;
    const y = top ? H + 1.2 : 1.9;
    const z = top ? -0.2 + (D * 0.86) / 2 + 0.02 : D / 2 + 0.02;
    // Рама-короб
    g.add(box(1.2, 1.2, 0.08, C.cocoa, x, y, z - 0.03));
    // Стекло
    const w = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.12), winMat);
    w.position.set(x, y, z + 0.03);
    g.add(w);
    // Переплёт: вертикаль + горизонталь
    g.add(box(0.08, 1.0, 0.14, C.cocoa, x, y, z + 0.03));
    g.add(box(1.0, 0.08, 0.14, C.cocoa, x, y, z + 0.03));
    // Подоконник
    g.add(box(1.4, 0.1, 0.3, 0xf3e2cf, x, y - 0.68, z + 0.1));
    // Козырёк-сандрик над окном
    g.add(box(1.4, 0.1, 0.24, trimC, x, y + 0.68, z + 0.06));
    // Ставни с lvl 1 + сердечко-вырез
    if (L >= 1 && !top) {
      for (const sx of [-1, 1]) {
        g.add(box(0.34, 1.15, 0.07, C.door, x + sx * 0.82, y, D / 2 + 0.03));
        // Планки ставня
        g.add(box(0.34, 0.08, 0.09, trimC, x + sx * 0.82, y + 0.4, D / 2 + 0.03));
        g.add(box(0.34, 0.08, 0.09, trimC, x + sx * 0.82, y - 0.4, D / 2 + 0.03));
        // Сердечко
        const heart = makeHeart(0.09, 0xd96a7f);
        heart.position.set(x + sx * 0.82, y + 0.12, D / 2 + 0.08);
        g.add(heart);
      }
    }
  }
  // Мансардное окошко (lvl≥3, круглое)
  if (L >= 3 && L < 5) {
    const round = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.14, 12), winMat);
    round.rotation.x = Math.PI / 2;
    round.position.set(0, roofY + 1.0, D / 2 - 0.4);
    g.add(round);
    g.add(box(1.1, 0.12, 0.2, trimC, 0, roofY + 0.45, D / 2 - 0.35));
  }

  // --- Дверь: филёнки + окошко + ручка-крендель ---
  const dz = D / 2 + 0.05;
  g.add(box(1.2, 2.2, 0.15, C.door, 0, 1.1, dz));
  // Дверная рама-портал
  g.add(box(0.18, 2.4, 0.2, trimC, -0.69, 1.2, dz));
  g.add(box(0.18, 2.4, 0.2, trimC, 0.69, 1.2, dz));
  g.add(box(1.56, 0.18, 0.2, trimC, 0, 2.42, dz));
  // Филёнки
  g.add(box(0.85, 0.7, 0.05, C.mint, 0, 0.65, dz + 0.07));
  g.add(box(0.85, 0.45, 0.05, C.mint, 0, 1.35, dz + 0.07));
  // Окошко в двери (тёплое)
  const doorWin = new THREE.Mesh(
    new THREE.PlaneGeometry(0.55, 0.4),
    new THREE.MeshStandardMaterial({
      color: 0xffe6a3, emissive: shabby ? 0x000000 : 0xffc978,
      emissiveIntensity: shabby ? 0 : 0.8, roughness: 0.3,
    }),
  );
  doorWin.position.set(0, 1.85, dz + 0.09);
  g.add(doorWin);
  g.add(box(0.65, 0.5, 0.04, trimC, 0, 1.85, dz + 0.06));
  // Ручка-крендель
  const knob = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.055, 0.018, 32, 6),
    mat(0x6a4a3a, { rough: 0.5, metal: 0.4 }),
  );
  knob.position.set(0.4, 1.1, dz + 0.14);
  g.add(knob);
  // Порог
  g.add(box(1.5, 0.12, 0.4, C.stone, 0, 0.06, dz + 0.25));

  // --- Крыльцо с перилами и ковриком + козырёк (lvl≥2) ---
  if (L >= 2) {
    // Ступени
    g.add(box(2.6, 0.16, 0.5, C.stone, 0, 0.08, D / 2 + 1.5));
    g.add(box(2.6, 0.25, 1.4, C.stone, 0, 0.2, D / 2 + 0.8));
    // Перила крыльца с двух сторон
    for (const sx of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        g.add(box(0.09, 0.7, 0.09, trimC, sx * 1.25, 0.65, D / 2 + 0.35 + i * 0.45));
      }
      const rail = box(0.1, 0.09, 1.5, trimC, sx * 1.25, 1.02, D / 2 + 0.8);
      g.add(rail);
    }
    // Коврик у двери (полосатый canvas)
    const rug = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.04, 0.7),
      new THREE.MeshStandardMaterial({ map: stripeTexture('#c96f6a', '#fff6ea'), roughness: 1, flatShading: true }),
    );
    rug.position.set(0, 0.35, D / 2 + 0.8);
    rug.receiveShadow = true;
    g.add(rug);
    // Козырёк с черепичными полосами
    const awn = new THREE.Group();
    for (let i = 0; i < 7; i++) {
      const tile = box(0.42, 0.08, 1.5, i % 2 ? C.roofDark : C.roof, -1.26 + i * 0.42, 2.75, D / 2 + 0.7);
      tile.rotation.x = 0.12;
      awn.add(tile);
    }
    // Волнистый край козырька
    for (let i = 0; i < 7; i++) {
      awn.add(cyl(0.1, 0.1, 0.42, i % 2 ? C.roof : C.roofDark, -1.26 + i * 0.42, 2.62, D / 2 + 1.42, 8));
    }
    g.add(awn);
    g.add(cyl(0.07, 0.07, 2.6, trimC, -1.3, 1.4, D / 2 + 1.3));
    g.add(cyl(0.07, 0.07, 2.6, trimC, 1.3, 1.4, D / 2 + 1.3));
    // Фонарики на столбах крыльца
    for (const sx of [-1, 1]) {
      g.add(box(0.22, 0.28, 0.22, 0x8a6a5a, sx * 1.3, 2.85, D / 2 + 1.3));
      const lamp = sph(0.09, 0xffe6a3, sx * 1.3, 2.85, D / 2 + 1.3);
      lamp.material = new THREE.MeshStandardMaterial({
        color: 0xffe6a3, emissive: 0xffc978, emissiveIntensity: 0.9, roughness: 0.5, flatShading: true,
      });
      g.add(lamp);
    }
  }

  // --- Пристрой-кухня (lvl≥4) ---
  if (L >= 4) {
    g.add(box(2.6, 2.4, 3.4, 0xfdeed9, W / 2 + 1.3, 1.2, -0.6));
    const ar = box(3.2, 0.25, 4, C.roof, W / 2 + 1.3, 2.5, -0.6);
    ar.rotation.z = 0.05;
    g.add(ar);
    // Окошко пристроя
    g.add(box(0.9, 0.9, 0.1, trimC, W / 2 + 1.3, 1.5, 1.12));
    const aw = new THREE.Mesh(
      new THREE.PlaneGeometry(0.7, 0.7),
      new THREE.MeshStandardMaterial({ color: 0xffe6a3, emissive: 0xffc978, emissiveIntensity: 0.5, roughness: 0.4 }),
    );
    aw.position.set(W / 2 + 1.3, 1.5, 1.18);
    g.add(aw);
  }

  // --- Вывеска SKITONS в резной раме ---
  const sign = makeSign(L >= 1);
  sign.position.set(0, L >= 5 ? H - 0.4 : 2.9, D / 2 + 0.14);
  g.add(sign);
  // Резная рама: бруски + уголки-шары + подвесы
  const fw = 3.7, fh = 1.05, fz = D / 2 + 0.1;
  const fy = L >= 5 ? H - 0.4 : 2.9;
  g.add(box(fw, 0.12, 0.08, trimC, 0, fy + fh / 2, fz));
  g.add(box(fw, 0.12, 0.08, trimC, 0, fy - fh / 2, fz));
  g.add(box(0.12, fh, 0.08, trimC, -fw / 2, fy, fz));
  g.add(box(0.12, fh, 0.08, trimC, fw / 2, fy, fz));
  for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as Array<[number, number]>) {
    g.add(sph(0.09, trimC, sx * fw / 2, fy + sy * fh / 2, fz));
  }
  // Цепочки-подвесы к козырьку крыши
  for (const sx of [-1, 1]) {
    g.add(cyl(0.02, 0.02, 0.5, 0x5a463c, sx * 1.4, fy + fh / 2 + 0.28, fz, 6));
  }

  return g;
}

// Кирпичная труба: чередующиеся выступы + колпак. Дымок — имя 'chimneySmoke'.
function buildBrickChimney(g: THREE.Group, x: number, baseH: number, z: number): void {
  const brickA = 0xc98e7e;
  const brickB = 0xb87a6c;
  const y0 = baseH + 1.7;
  for (let i = 0; i < 6; i++) {
    const w = i % 2 ? 0.85 : 0.7;
    g.add(box(w, 0.28, w, i % 2 ? brickB : brickA, x, y0 + i * 0.28, z));
  }
  // Швы раствора
  for (let i = 0; i < 5; i++) {
    g.add(box(0.88, 0.04, 0.88, 0xe8d5c4, x, y0 + 0.16 + i * 0.28, z));
  }
  // Колпак
  g.add(box(1.0, 0.14, 1.0, 0x8a6a5a, x, y0 + 6 * 0.28 + 0.1, z));
  g.add(box(0.5, 0.2, 0.5, 0x5a463c, x, y0 + 6 * 0.28 + 0.25, z));
  const chimney = box(0.7, 0.4, 0.7, brickA, x, y0 - 0.2, z);
  chimney.name = 'chimney';
  g.add(chimney);
  const smoke = new THREE.Group();
  smoke.name = 'chimneySmoke';
  for (let i = 0; i < 3; i++) {
    const s = new THREE.Mesh(
      new THREE.SphereGeometry(0.28 + i * 0.1, 8, 6),
      new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, roughness: 1, flatShading: true }),
    );
    s.position.set(x, y0 + 6 * 0.28 + 0.6 + i * 0.55, z);
    smoke.add(s);
  }
  g.add(smoke);
}

// Сердечко: плоская экструзия для ставней.
function makeHeart(size: number, color: number): THREE.Mesh {
  const s = new THREE.Shape();
  s.moveTo(0, -size * 0.6);
  s.bezierCurveTo(-size * 1.2, size * 0.3, -size * 0.6, size * 1.1, 0, size * 0.45);
  s.bezierCurveTo(size * 0.6, size * 1.1, size * 1.2, size * 0.3, 0, -size * 0.6);
  const m = new THREE.Mesh(
    new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: false }),
    mat(color, { rough: 0.7 }),
  );
  return m;
}

// Полосатый canvas для коврика.
function stripeTexture(a: string, b: string): THREE.CanvasTexture {
  const cv = document.createElement('canvas');
  cv.width = 128; cv.height = 64;
  const ctx = cv.getContext('2d')!;
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 ? a : b;
    ctx.fillRect(0, (i * 64) / 8, 128, 64 / 8 + 1);
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeSign(lit: boolean): THREE.Mesh {
  const cv = document.createElement('canvas');
  cv.width = 512; cv.height = 128;
  const ctx = cv.getContext('2d')!;
  ctx.fillStyle = lit ? '#8a6a5a' : '#a08a78';
  const r = 34;
  ctx.beginPath();
  ctx.roundRect(6, 6, 500, 116, r);
  ctx.fill();
  ctx.fillStyle = '#fff6ea';
  ctx.font = 'bold 64px system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SKITONS', 256, 68);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 0.85),
    new THREE.MeshStandardMaterial({
      map: tex, roughness: 0.8, flatShading: true,
      emissive: lit ? 0xffd9a0 : 0x000000, emissiveIntensity: lit ? 0.25 : 0,
    }),
  );
  return m;
}
