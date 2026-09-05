import * as THREE from 'three';
import { C, box, cyl, sph, mat } from '../palette';

// Настоящий дом: главный зал 9x7 (стены x=±4.5, z=±3.5, h=3.6, t=0.25)
// + кухонный пристрой с востока (x 4.5..8.0, z -3.0..0.5, h=2.8).
// lvl 0: лачуга тусклая (apex 2.0, стёкла тёмные, без крыльца/фахверка)
// lvl 1: +тёплые стёкла, ставни, вывеска светится
// lvl 2: +крыльцо с козырьком
// lvl 3: apex 2.6 + круглое чердачное окно + фахверк
// lvl 4: +пристрой-кухня
// lvl 5: +второй этаж (пояс 1.8) + кирпичная труба с дымком
// Именованные группы для разреза сценой: 'cutSouth', 'cutRoofMain',
// 'cutAnnexEast', 'cutRoofAnnex'. Дымок — 'chimneySmoke'.
export function buildBuilding(lv: number): THREE.Group {
  const g = new THREE.Group();
  const L = Math.max(0, Math.min(5, lv));
  const shabby = L === 0;
  const APEX = L >= 3 ? 2.6 : 2.0; // высота конька над верхом стен
  const HX = 4.5, HZ = 3.5, WH = 3.6, T = 0.25;

  const wallC = shabby ? 0xe9d5c2 : C.wall;
  const trimC = shabby ? 0x9a7a68 : C.cocoa;
  const glassMat = new THREE.MeshStandardMaterial({
    color: shabby ? C.window : C.windowLit,
    emissive: shabby ? 0x000000 : 0xffc978,
    emissiveIntensity: shabby ? 0 : 0.55,
    roughness: 0.35, side: THREE.DoubleSide,
  });

  // --- Цоколь: каменный skirt вокруг низа ---
  g.add(box(9.5, 0.7, 7.5, C.stone, 0, 0.32, 0));
  g.add(box(9.65, 0.12, 7.65, 0xd9c4ae, 0, 0.68, 0));

  // --- Пол зала из досок (каждая лежит на цоколе, y 0.02..0.10) ---
  for (let i = 0; i < 15; i++) {
    const tone = i % 3 === 0 ? 0xd9a066 : i % 3 === 1 ? 0xe0b075 : 0xcfa066;
    g.add(box(9.0, 0.08, 0.44, shabby ? 0xb08a6a : tone, 0, 0.06, -3.26 + i * 0.466));
  }

  // --- Стены зала. Южная — с дверным проёмом (x ±0.7, h 2.3) ---
  const cutSouth = new THREE.Group(); cutSouth.name = 'cutSouth';
  const sSegW = 4.75 - 0.7; // 4.05
  cutSouth.add(box(sSegW, WH, T, wallC, -(0.7 + sSegW / 2), WH / 2, HZ));
  cutSouth.add(box(sSegW, WH, T, wallC, 0.7 + sSegW / 2, WH / 2, HZ));
  cutSouth.add(box(1.4, WH - 2.3, T, wallC, 0, 2.3 + (WH - 2.3) / 2, HZ)); // перемычка
  g.add(cutSouth);
  // Северная — глухая
  const nWall = L >= 5 ? WH : WH;
  g.add(box(9.5, nWall, T, wallC, 0, nWall / 2, -HZ));
  // Западная — глухая
  g.add(box(T, WH, 7.0, wallC, -HX, WH / 2, 0));
  // Восточная — с проёмом в пристрой (z -1.9..-0.5, h 2.3)
  const eSegA = 1.725, eSegB = 4.125; // (-3.625..-1.9) и (-0.5..3.625)
  g.add(box(T, WH, eSegA, wallC, HX, WH / 2, -2.7625));
  g.add(box(T, WH, eSegB, wallC, HX, WH / 2, 1.5625));
  g.add(box(T, WH - 2.3, 1.4, wallC, HX, 2.3 + (WH - 2.3) / 2, -1.2)); // перемычка
  // Косяки проёма в пристрой + порог
  g.add(box(0.3, 2.3, 0.12, trimC, HX, 1.15, -1.9));
  g.add(box(0.3, 2.3, 0.12, trimC, HX, 1.15, -0.5));
  g.add(box(0.3, 0.12, 1.52, trimC, HX, 2.36, -1.2));
  g.add(box(0.5, 0.08, 1.5, C.stone, HX, 0.1, -1.2));

  // --- Внутренняя отделка: тёплые обои верх + панели низ + плинтусы ---
  const paperC = shabby ? 0xd9c4b0 : 0xffe9d2;
  const panelC = shabby ? 0x8a6a5a : 0xd9a066;
  const inX = HX - T / 2 - 0.015, inZ = HZ - T / 2 - 0.015;
  for (const sz of [-1, 1]) { // север/юг изнутри
    g.add(box(8.7, 2.4, 0.03, paperC, 0, 2.3, sz * inZ));
    g.add(box(8.7, 1.0, 0.04, panelC, 0, 0.6, sz * inZ));
    g.add(box(8.7, 0.1, 0.06, trimC, 0, 0.15, sz * inZ)); // плинтус
    g.add(box(8.7, 0.08, 0.05, trimC, 0, 1.12, sz * inZ)); // рейка
  }
  for (const sx of [-1, 1]) { // запад/восток изнутри (восток рвём у проёма)
    g.add(box(0.03, 2.4, 6.7, paperC, sx * inX, 2.3, 0));
    if (sx < 0) g.add(box(0.04, 1.0, 6.7, panelC, sx * inX, 0.6, 0));
    else {
      g.add(box(0.04, 1.0, 1.6, panelC, sx * inX, 0.6, -2.75));
      g.add(box(0.04, 1.0, 4.0, panelC, sx * inX, 0.6, 1.6));
    }
    g.add(box(0.06, 0.1, 6.7, trimC, sx * inX, 0.15, 0));
  }

  // --- Потолочные балки (лежат на стенах, y=3.45) ---
  for (let i = 0; i < 5; i++) {
    g.add(box(9.0, 0.18, 0.22, C.woodDark, 0, 3.45, -2.8 + i * 1.4));
  }

  // --- Угловой trim + верхняя обвязка ---
  for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as Array<[number, number]>) {
    g.add(box(0.28, WH, 0.28, trimC, sx * (HX + 0.02), WH / 2, sz * (HZ + 0.02)));
  }
  g.add(box(9.6, 0.2, 7.6, trimC, 0, WH - 0.1, 0));

  // --- Фахверк lvl≥3 (юг + запад) ---
  if (L >= 3) {
    for (const bx of [-3.4, -1.7, 1.7, 3.4]) {
      cutSouth.add(box(0.18, WH - 0.9, 0.1, C.woodDark, bx, WH / 2 + 0.1, HZ + 0.15));
    }
    cutSouth.add(box(8.6, 0.18, 0.1, C.woodDark, 0, WH - 0.6, HZ + 0.15));
    for (const bz of [-2.2, 0, 2.2]) {
      g.add(box(0.1, WH - 0.9, 0.18, C.woodDark, -HX - 0.15, WH / 2 + 0.1, bz));
    }
  }

  // --- Второй этаж lvl5: пояс 1.8 того же пятна + окна ---
  const roofY = L >= 5 ? WH + 1.8 : WH;
  if (L >= 5) {
    g.add(box(9.5, 1.8, 7.25, 0xfffaf2, 0, WH + 0.9, 0));
    for (const [sx, sz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]] as Array<[number, number]>) {
      g.add(box(0.24, 1.8, 0.24, trimC, sx * (HX + 0.02), WH + 0.9, sz * (HZ + 0.02)));
    }
    for (const wx of [-2.6, 0, 2.6]) {
      cutSouth.add(win(wx, WH + 0.9, HZ, 0, glassMat, trimC, false));
      g.add(win(wx, WH + 0.9, -HZ, 0, glassMat, trimC, false));
    }
    buildBrickChimney(g, 2.5, roofY, -1.5);
  }

  // --- Крыша главной: два ската ЛЕЖАТ на стенах, свес 0.6 ---
  // half-span S=5.1 (4.5+0.6). apex 2.0: ang=atan(2/5.1)=0.3737рад(21.41°),
  //   len=sqrt(5.1²+2²)=sqrt(30.01)=5.4781.
  // apex 2.6: ang=atan(2.6/5.1)=0.4715рад(27.01°),
  //   len=sqrt(5.1²+2.6²)=sqrt(32.77)=5.7245.
  // Середина ската (±2.55, roofY+apex/2), центр доски = +0.03 по нормали
  // n=(apex,5.1)/len (вверх-наружу). Конёк-брус лежит на апексе.
  const cutRoof = new THREE.Group(); cutRoof.name = 'cutRoofMain';
  {
    const A = APEX;
    const len = Math.sqrt(5.1 * 5.1 + A * A);
    const ang = Math.atan(A / 5.1);
    const nx = A / len, ny = 5.1 / len; // нормаль +x ската
    const roofMat = mat(shabby ? 0xb9a08e : L >= 3 ? C.roofDark : C.roof);
    const dep = 8.2; // 3.5+0.6 на обе стороны
    for (const s of [1, -1]) {
      const slope = new THREE.Mesh(new THREE.BoxGeometry(len, 0.12, dep), roofMat);
      slope.position.set(s * (2.55 + nx * 0.03), roofY + A / 2 + ny * 0.03, 0);
      slope.rotation.z = -s * ang;
      slope.castShadow = slope.receiveShadow = true;
      cutRoof.add(slope);
      // Лобовая доска ЛЕЖИТ на скате у торца (та же нормаль, z=±(4.1-0.05))
      for (const ez of [-1, 1]) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(len, 0.05, 0.16), mat(trimC));
        b.position.set(s * (2.55 + nx * 0.11), roofY + A / 2 + ny * 0.11, ez * 4.02);
        b.rotation.z = -s * ang;
        b.castShadow = true;
        cutRoof.add(b);
      }
      // Карнизная доска на свесе
      cutRoof.add(box(0.1, 0.16, dep, trimC, s * 5.08, roofY - 0.02, 0));
    }
    // Конёк-брус лежит на апексе (низ касается вершины)
    cutRoof.add(box(0.26, 0.18, dep + 0.1, trimC, 0, roofY + A + 0.06, 0));
    // Фронтоны-треугольники на торцах (x -4.5..4.5, y roofY..roofY+A)
    const tri = new THREE.Shape();
    tri.moveTo(-HX, 0); tri.lineTo(HX, 0); tri.lineTo(0, A); tri.closePath();
    const triGeo = new THREE.ExtrudeGeometry(tri, { depth: T, bevelEnabled: false });
    for (const ez of [-1, 1]) {
      const m = new THREE.Mesh(triGeo, mat(wallC));
      m.position.set(0, roofY, ez * HZ - T / 2);
      m.castShadow = m.receiveShadow = true;
      cutRoof.add(m);
    }
  }
  g.add(cutRoof);

  // --- Окна зала: рама + стекло DoubleSide + переплёт + подоконники с обеих сторон ---
  const southWins = [-2.6, 2.6];
  for (const wx of southWins) {
    cutSouth.add(win(wx, 1.65, HZ, 0, glassMat, trimC, L >= 1 && L < 5));
  }
  const northWins = shabby ? [0] : [-2.2, 2.2];
  for (const wx of northWins) g.add(win(wx, 1.65, -HZ, 0, glassMat, trimC, false));
  const westWins = shabby ? [0] : [-1.5, 1.5];
  for (const wz of westWins) g.add(win(-HX, 1.65, wz, Math.PI / 2, glassMat, trimC, false));
  if (L >= 1) g.add(win(HX, 1.65, 1.8, Math.PI / 2, glassMat, trimC, false));
  // Круглое чердачное окно lvl 3..4 (на южном фронтоне)
  if (L >= 3 && L < 5) {
    const round = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.3, 14), glassMat);
    round.rotation.x = Math.PI / 2;
    round.position.set(0, roofY + 0.9, HZ);
    cutRoof.add(round);
    cutRoof.add(box(1.1, 0.12, 0.34, trimC, 0, roofY + 0.35, HZ));
  }

  // --- Дверь юг: косяки + порог + открытая створка (в cutSouth) ---
  cutSouth.add(box(0.16, 2.4, 0.3, trimC, -0.78, 1.2, HZ));
  cutSouth.add(box(0.16, 2.4, 0.3, trimC, 0.78, 1.2, HZ));
  cutSouth.add(box(1.72, 0.16, 0.3, trimC, 0, 2.44, HZ));
  cutSouth.add(box(1.6, 0.1, 0.5, C.stone, 0, 0.05, HZ + 0.2)); // порог
  {
    const hinge = new THREE.Group();
    hinge.position.set(-0.7, 0, HZ + 0.05);
    hinge.rotation.y = -1.9; // створка распахнута наружу (~109°)
    const leaf = box(1.3, 2.2, 0.08, shabby ? 0x8a9a8a : C.door, 0.65, 1.15, 0);
    hinge.add(leaf);
    hinge.add(box(0.9, 0.6, 0.1, C.mint, 0.65, 0.7, 0));
    const knob = sph(0.06, 0x6a4a3a, 1.15, 1.1, 0.08);
    hinge.add(knob);
    // Окошко в створке
    const dw = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.35), glassMat);
    dw.position.set(0.65, 1.7, 0.05); hinge.add(dw);
    cutSouth.add(hinge);
  }

  // --- Крыльцо lvl≥2: ступени + площадка + козырёк на столбах + коврик ---
  if (L >= 2) {
    cutSouth.add(box(2.6, 0.14, 0.5, C.stone, 0, 0.07, HZ + 1.7));
    cutSouth.add(box(2.6, 0.22, 1.5, C.stone, 0, 0.18, HZ + 0.95));
    for (const sx of [-1, 1]) {
      cutSouth.add(cyl(0.07, 0.07, 2.4, trimC, sx * 1.25, 1.3, HZ + 1.55));
      const lamp = sph(0.09, 0xffe6a3, sx * 1.25, 2.6, HZ + 1.55);
      if (!shabby) lamp.material = new THREE.MeshStandardMaterial({
        color: 0xffe6a3, emissive: 0xffc978, emissiveIntensity: 0.9, roughness: 0.5,
      });
      cutSouth.add(lamp);
    }
    const awn = box(3.0, 0.08, 1.4, L >= 3 ? C.roofDark : C.roof, 0, 2.62, HZ + 1.0);
    awn.rotation.x = 0.1;
    cutSouth.add(awn);
    const rug = new THREE.Mesh(
      new THREE.BoxGeometry(1.1, 0.04, 0.7),
      new THREE.MeshStandardMaterial({ map: stripeTexture('#c96f6a', '#fff6ea'), roughness: 1 }),
    );
    rug.position.set(0, 0.31, HZ + 0.95);
    cutSouth.add(rug);
  }

  // --- Вывеска SKITONS в резной раме (на юге → в cutSouth) ---
  {
    const fy = 2.95, fz = HZ + 0.18;
    const sign = makeSign(!shabby);
    sign.position.set(0, fy, fz + 0.04);
    cutSouth.add(sign);
    cutSouth.add(box(3.7, 0.12, 0.08, trimC, 0, fy + 0.52, fz));
    cutSouth.add(box(3.7, 0.12, 0.08, trimC, 0, fy - 0.52, fz));
    cutSouth.add(box(0.12, 1.0, 0.08, trimC, -1.85, fy, fz));
    cutSouth.add(box(0.12, 1.0, 0.08, trimC, 1.85, fy, fz));
  }

  // --- Пристрой-кухня lvl≥4 (стены h=2.8, t=0.2) ---
  if (L >= 4) {
    const AX0 = 4.5, AX1 = 8.0, AZ0 = -3.0, AZ1 = 0.5, AH = 2.8, AT = 0.2;
    const amx = (AX0 + AX1) / 2, amz = (AZ0 + AZ1) / 2;
    const aC = shabby ? 0xe9d5c2 : 0xfdeed9;
    g.add(box(AX1 - AX0 + AT, AH, AT, aC, amx, AH / 2, AZ0)); // север
    g.add(box(AX1 - AX0 + AT, AH, AT, aC, amx, AH / 2, AZ1)); // юг
    // Пол пристроя из досок
    for (let i = 0; i < 7; i++) {
      g.add(box(3.3, 0.08, 0.44, i % 2 ? 0xe0b075 : 0xd9a066, amx, 0.06, -2.7 + i * 0.47));
    }
    // Внутренняя отделка пристроя
    g.add(box(3.3, 1.6, 0.03, paperC, amx, 1.9, AZ0 + AT / 2 + 0.015));
    g.add(box(3.3, 1.6, 0.03, paperC, amx, 1.9, AZ1 - AT / 2 - 0.015));
    // Восточная стена → разрез
    const cutE = new THREE.Group(); cutE.name = 'cutAnnexEast';
    cutE.add(box(AT, AH, AZ1 - AZ0 + AT, aC, AX1, AH / 2, amz));
    cutE.add(win(AX1, 1.6, -1.25, Math.PI / 2, glassMat, trimC, false));
    g.add(cutE);
    // Односкатная крыша на балках → разрез (уклон к востоку: 3.1 → 2.75)
    const cutRA = new THREE.Group(); cutRA.name = 'cutRoofAnnex';
    for (let i = 0; i < 4; i++) {
      const b = box(4.3, 0.14, 0.16, C.woodDark, amx + 0.25, 2.86, -2.7 + i * 1.05);
      b.rotation.z = -0.081; // уклон atan(0.35/4.3)≈4.65°
      cutRA.add(b);
    }
    const slab = box(4.4, 0.1, 4.3, shabby ? 0xb9a08e : C.roof, amx + 0.25, 3.02, amz);
    slab.rotation.z = -0.081;
    cutRA.add(slab);
    g.add(cutRA);
  }

  return g;
}

// Окно: рама-короб сквозь стену + стекло DoubleSide + переплёт +
// подоконники с обеих сторон. ry=0 для стен z, PI/2 для стен x.
function win(
  x: number, y: number, z: number, ry: number,
  glass: THREE.Material, trimC: number, shutters: boolean,
): THREE.Group {
  const w = new THREE.Group();
  const frame = box(1.2, 1.2, 0.34, trimC, 0, 0, 0);
  const gl = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.0, 0.08), glass);
  const mullV = box(0.07, 1.0, 0.12, trimC, 0, 0, 0);
  const mullH = box(1.0, 0.07, 0.12, trimC, 0, 0, 0);
  const sillA = box(1.35, 0.08, 0.24, 0xf3e2cf, 0, -0.66, 0.22);
  const sillB = box(1.35, 0.08, 0.24, 0xf3e2cf, 0, -0.66, -0.22);
  const topA = box(1.35, 0.09, 0.2, trimC, 0, 0.66, 0.1);
  w.add(frame, gl, mullV, mullH, sillA, sillB, topA);
  if (shutters) {
    for (const sx of [-1, 1]) {
      w.add(box(0.32, 1.1, 0.06, C.door, sx * 0.8, 0, 0.1));
      const heart = makeHeart(0.09, 0xd96a7f);
      heart.position.set(sx * 0.8, 0.12, 0.14);
      w.add(heart);
    }
  }
  w.position.set(x, y, z);
  w.rotation.y = ry;
  return w;
}

// Кирпичная труба. Дымок — имя 'chimneySmoke'.
function buildBrickChimney(g: THREE.Group, x: number, roofY: number, z: number): void {
  const y0 = roofY + 0.6; // ствол пронзает восточный скат и выходит выше конька
  for (let i = 0; i < 7; i++) {
    const wd = i % 2 ? 0.85 : 0.7;
    g.add(box(wd, 0.28, wd, i % 2 ? 0xb87a6c : 0xc98e7e, x, y0 + i * 0.28, z));
  }
  for (let i = 0; i < 6; i++) {
    g.add(box(0.88, 0.04, 0.88, 0xe8d5c4, x, y0 + 0.16 + i * 0.28, z));
  }
  g.add(box(1.0, 0.14, 1.0, 0x8a6a5a, x, y0 + 7 * 0.28 + 0.1, z));
  const smoke = new THREE.Group();
  smoke.name = 'chimneySmoke';
  for (let i = 0; i < 3; i++) {
    const s = new THREE.Mesh(
      new THREE.SphereGeometry(0.28 + i * 0.1, 8, 6),
      new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.55, roughness: 1 }),
    );
    s.position.set(x, y0 + 7 * 0.28 + 0.6 + i * 0.55, z);
    smoke.add(s);
  }
  g.add(smoke);
}

function makeHeart(size: number, color: number): THREE.Mesh {
  const s = new THREE.Shape();
  s.moveTo(0, -size * 0.6);
  s.bezierCurveTo(-size * 1.2, size * 0.3, -size * 0.6, size * 1.1, 0, size * 0.45);
  s.bezierCurveTo(size * 0.6, size * 1.1, size * 1.2, size * 0.3, 0, -size * 0.6);
  return new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: false }), mat(color, { rough: 0.7 }));
}

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
  ctx.beginPath();
  ctx.roundRect(6, 6, 500, 116, 34);
  ctx.fill();
  ctx.fillStyle = '#fff6ea';
  ctx.font = 'bold 64px system-ui, sans-serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('SKITONS', 256, 68);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 0.85),
    new THREE.MeshStandardMaterial({
      map: tex, roughness: 0.8, emissive: lit ? 0xffd9a0 : 0x000000,
      emissiveIntensity: lit ? 0.25 : 0,
    }),
  );
}
