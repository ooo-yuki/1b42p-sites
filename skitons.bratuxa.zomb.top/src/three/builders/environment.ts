import * as THREE from 'three';
import { C, box, cyl, sph, mat } from '../palette';

// Статика мира: земля, дорожка, клумбы, деревья, облака, птицы,
// бабочки, забор, фонари, грибы, пень.
export interface Environment {
  group: THREE.Group;
  update: (t: number) => void;
  lamps: THREE.PointLight[];
  glints: THREE.Sprite[];
}

function pulse(m: THREE.Material, seed = 0): void {
  m.userData.pulse = true;
  m.userData.base = (m as THREE.MeshStandardMaterial).emissiveIntensity ?? 1;
  m.userData.seed = seed;
}

// Мягкий радиальный блик для ламп (аддитивный спрайт)
function makeGlowTexture(): THREE.Texture {
  const cv = document.createElement('canvas');
  cv.width = 64; cv.height = 64;
  const ctx = cv.getContext('2d')!;
  const gr = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  gr.addColorStop(0, 'rgba(255,240,210,1)');
  gr.addColorStop(0.4, 'rgba(255,215,150,0.5)');
  gr.addColorStop(1, 'rgba(255,200,120,0)');
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(cv);
}

export function buildEnvironment(): Environment {
  const g = new THREE.Group();

  // Земля — большой кремовый диск + зелёная лужайка
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(30, 40),
    mat(0xead9c2, { rough: 1 }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  g.add(ground);
  const lawn = new THREE.Mesh(
    new THREE.CircleGeometry(13, 32),
    mat(0xcdeac0, { rough: 1 }),
  );
  lawn.rotation.x = -Math.PI / 2;
  lawn.position.y = 0.01;
  lawn.receiveShadow = true;
  g.add(lawn);

  // Дорога (серая лента + пунктир) — за края земли
  g.add(box(64, 0.04, 3.2, 0xcfc4b8, 0, 0.02, 14.5));
  for (let i = -15; i <= 15; i += 2) {
    g.add(box(0.9, 0.05, 0.15, 0xfff6ea, i * 2, 0.03, 14.5));
  }

  // Мощёная дорожка: крыльцо (z≈4.3) → калитка (z=12) → дорога
  const pebbleCols = [0xe8d9c8, 0xefe0cc, 0xdccbb4];
  for (let i = 0; i < 14; i++) {
    const z = 4.6 + i * 0.76;
    const x = Math.sin(i * 0.8) * 0.3;
    const w = 0.7 + (i % 3) * 0.1;
    const stone = new THREE.Mesh(
      new THREE.CylinderGeometry(w / 2, w / 2 + 0.04, 0.09, 7),
      mat(pebbleCols[i % pebbleCols.length]),
    );
    stone.position.set(x, 0.05, z);
    stone.rotation.y = i * 0.4;
    stone.castShadow = true;
    stone.receiveShadow = true;
    g.add(stone);
  }

  // Клумбы с тюльпанами и маргаритками вдоль дорожки
  const bedCols = [0xf6a5b8, 0xffb347, 0xffffff, 0xe85454];
  for (const side of [-1, 1]) {
    const bx = side * 2.1;
    g.add(cyl(0.85, 0.95, 0.3, 0xb07a4a, bx, 0.15, 10.2, 10));
    g.add(cyl(0.75, 0.75, 0.08, 0x7fb98e, bx, 0.33, 10.2, 10));
    for (let f = 0; f < 6; f++) {
      const a = (f / 6) * Math.PI * 2 + side;
      const fx = bx + Math.cos(a) * 0.45;
      const fz = 10.2 + Math.sin(a) * 0.35;
      g.add(cyl(0.025, 0.025, 0.35, C.leafDark, fx, 0.45, fz, 5));
      if (f % 2 === 0) {
        // тюльпан: чашечка-конус
        const cup = new THREE.Mesh(
          new THREE.ConeGeometry(0.09, 0.18, 7),
          mat(bedCols[f % bedCols.length]),
        );
        cup.position.set(fx, 0.68, fz);
        cup.castShadow = true;
        g.add(cup);
      } else {
        // маргаритка: белые лепестки + жёлтая серединка
        for (let p = 0; p < 5; p++) {
          const pa = (p / 5) * Math.PI * 2;
          const petal = sph(0.045, 0xffffff, fx + Math.cos(pa) * 0.07, 0.64, fz + Math.sin(pa) * 0.07);
          petal.castShadow = false;
          g.add(petal);
        }
        g.add(sph(0.05, 0xffd166, fx, 0.66, fz));
      }
    }
  }

  // Стриженые кусты-шары + изгородь-кубы
  const ballSpots: Array<[number, number, number]> = [
    [-3.2, 8.6, 0.45], [3.2, 8.6, 0.5], [-3.6, 5.4, 0.38], [3.8, 5.2, 0.42],
  ];
  for (const [x, z, r] of ballSpots) {
    const b = sph(r, C.leaf, x, r * 0.9, z);
    b.scale.y = 0.92;
    g.add(b);
    g.add(sph(r * 0.45, C.leafDark, x + r * 0.5, r * 0.6, z + r * 0.3));
  }
  for (const side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
      g.add(box(0.9, 0.7, 0.9, i % 2 ? C.leafDark : C.leaf, side * 8.6, 0.35, -4 + i * 1.1));
    }
  }

  // Деревья по периметру (декоративные)
  const treePos: Array<[number, number, number]> = [
    [-10, -4, 1], [13.5, -6.5, 1.3], [-8, 6, 0.9], [9, 9, 1.1], [-12, 2, 1.2], [12, 4, 0.8],
  ];
  for (const [x, z, s] of treePos) {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);
    tree.add(cyl(0.18 * s, 0.24 * s, 1.4 * s, C.trunk, 0, 0.7 * s, 0, 7));
    tree.add(sph(0.9 * s, C.leaf, 0, 1.9 * s, 0));
    tree.add(sph(0.6 * s, C.leafDark, 0.55 * s, 1.5 * s, 0.3 * s));
    tree.add(sph(0.5 * s, C.leaf, -0.5 * s, 1.6 * s, -0.2 * s));
    g.add(tree);
  }

  // 3 яблони с яблоками
  const appleTrees: Array<[number, number]> = [[-7.5, -1.5], [0.5, -9.5], [-5.5, -7]];
  for (const [x, z] of appleTrees) {
    const t = new THREE.Group();
    t.position.set(x, 0, z);
    t.add(cyl(0.22, 0.3, 1.8, C.trunk, 0, 0.9, 0, 7));
    t.add(sph(1.15, C.leaf, 0, 2.5, 0));
    t.add(sph(0.7, C.leafDark, 0.7, 2.1, 0.4));
    t.add(sph(0.65, C.leaf, -0.65, 2.2, -0.3));
    for (let a = 0; a < 7; a++) {
      const aa = (a / 7) * Math.PI * 2;
      const ax = Math.cos(aa) * 0.95;
      const az = Math.sin(aa) * 0.8;
      const apple = sph(0.11, 0xe85454, ax, 2.3 + Math.sin(aa * 2) * 0.35, az);
      apple.castShadow = false;
      t.add(apple);
    }
    g.add(t);
  }

  // Облака — 5 шт разной формы, плывут
  const clouds = new THREE.Group();
  clouds.name = 'clouds';
  const cloudDefs: Array<{ p: [number, number, number]; puffs: Array<[number, number, number]> }> = [
    { p: [-8, 12, -8], puffs: [[0, 1, 0], [0.9, 0.7, 0.1], [-0.9, 0.75, -0.1]] },
    { p: [6, 14, -10], puffs: [[0, 1.2, 0], [1.1, 0.8, 0], [-1.1, 0.85, 0], [0.3, 0.6, 0.5]] },
    { p: [0, 11, 8], puffs: [[0, 0.9, 0], [0.8, 0.6, 0]] },
    { p: [-13, 13, 3], puffs: [[0, 0.8, 0], [0.7, 0.55, 0.1], [-0.7, 0.6, 0], [1.3, 0.45, -0.1]] },
    { p: [12, 12.5, 5], puffs: [[0, 1, 0], [-0.8, 0.65, 0.2], [0.9, 0.5, -0.2]] },
  ];
  for (const def of cloudDefs) {
    const cl = new THREE.Group();
    cl.position.set(...def.p);
    const cm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, flatShading: true });
    for (const [ox, s, oz] of def.puffs) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(s, 10, 8), cm);
      puff.position.set(ox, 0, oz);
      puff.scale.y = 0.6;
      cl.add(puff);
    }
    clouds.add(cl);
  }
  g.add(clouds);

  // Птицы — 2 галочки-треугольника, машут крыльями в update
  const birds: THREE.Group[] = [];
  const birdMat = new THREE.MeshBasicMaterial({ color: 0x4a3f38, side: THREE.DoubleSide });
  for (let i = 0; i < 2; i++) {
    const b = new THREE.Group();
    const wingGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.45, 0.12, 0),
      new THREE.Vector3(0.1, -0.08, 0),
    ]);
    const wl = new THREE.Mesh(wingGeo, birdMat);
    const wr = new THREE.Mesh(wingGeo, birdMat);
    wr.scale.x = -1;
    b.add(wl, wr);
    b.position.set(-6 + i * 9, 10.5 + i, -6 - i * 2);
    b.userData = { seed: i * 2.4, wl, wr };
    birds.push(b);
    g.add(b);
  }

  // Бабочки — 4 шт, угловатый маршрут, взмах крыльев в update
  const butterflies: THREE.Group[] = [];
  const bfCols = [0xf6a5b8, 0xffb347, 0x9fd8c9, 0xd9c0e8];
  for (let i = 0; i < 4; i++) {
    const bf = new THREE.Group();
    const wm = new THREE.MeshBasicMaterial({ color: bfCols[i], side: THREE.DoubleSide });
    const wingGeo = new THREE.PlaneGeometry(0.16, 0.12);
    const wl = new THREE.Mesh(wingGeo, wm);
    wl.position.x = -0.08;
    const wr = new THREE.Mesh(wingGeo, wm);
    wr.position.x = 0.08;
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.16, 5),
      new THREE.MeshBasicMaterial({ color: 0x4a3f38 }),
    );
    body.rotation.x = Math.PI / 2;
    bf.add(wl, wr, body);
    bf.position.set(-3 + i * 2, 1.2 + (i % 2) * 0.4, 7 + (i % 3));
    bf.userData = { seed: i * 1.9, cx: bf.position.x, cy: bf.position.y, cz: bf.position.z, wl, wr };
    butterflies.push(bf);
    g.add(bf);
  }

  // Грибы у забора
  const mushSpots: Array<[number, number]> = [[-10.9, -3], [10.9, 2.2], [-10.9, 5.5], [11, -5]];
  for (const [x, z] of mushSpots) {
    g.add(cyl(0.06, 0.08, 0.22, 0xfff6ea, x, 0.11, z, 6));
    const cap = new THREE.Mesh(
      new THREE.SphereGeometry(0.13, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2),
      mat(0xe85454),
    );
    cap.position.set(x, 0.2, z);
    cap.castShadow = true;
    g.add(cap);
    g.add(sph(0.03, 0xffffff, x + 0.06, 0.26, z + 0.03));
  }

  // Пень с кольцами
  const stump = new THREE.Group();
  stump.position.set(9.8, 0, -5.5);
  stump.add(cyl(0.45, 0.5, 0.5, C.trunk, 0, 0.25, 0, 10));
  for (let r = 1; r <= 3; r++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(r * 0.11, 0.012, 5, 18),
      new THREE.MeshStandardMaterial({ color: 0xd9a066, roughness: 1 }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.51;
    stump.add(ring);
  }
  g.add(stump);

  // Забор по бокам
  for (const side of [-1, 1]) {
    for (let i = 0; i < 7; i++) {
      g.add(box(0.14, 0.9, 0.14, 0xffffff, side * 11.5, 0.45, -6 + i * 2));
    }
    g.add(box(0.08, 0.12, 13, 0xffffff, side * 11.5, 0.75, 0));
  }

  // Передний забор (z=12) с разрывом-калиткой |x|<1.4 + столбы и арка
  for (const sgn of [-1, 1]) {
    for (let x = 1.6; x <= 11.4; x += 1.65) {
      g.add(box(0.14, 0.9, 0.14, 0xffffff, sgn * x, 0.45, 12));
    }
    g.add(box(9.9, 0.12, 0.08, 0xffffff, sgn * 6.55, 0.75, 12));
  }
  for (const sx of [-1.35, 1.35]) {
    g.add(cyl(0.11, 0.13, 1.5, C.cocoa, sx, 0.75, 12, 8));
    g.add(sph(0.16, C.cocoa, sx, 1.58, 12));
  }
  const arch = box(3.0, 0.14, 0.14, C.cocoa, 0, 2.15, 12);
  g.add(arch);

  // Фонари (светятся, пульс — в сцене через userData.pulse) + блики-спрайты
  const lamps: THREE.PointLight[] = [];
  const glints: THREE.Sprite[] = [];
  const glowTex = makeGlowTexture();
  for (const [x, z] of [[-3.5, 7.5], [3.5, 7.5]] as Array<[number, number]>) {
    g.add(cyl(0.07, 0.09, 2.4, C.cocoa, x, 1.2, z, 8));
    const lampMat = new THREE.MeshStandardMaterial({ color: 0xffe6a3, emissive: 0xffc978, emissiveIntensity: 1.1, roughness: 0.5, flatShading: true });
    pulse(lampMat, x);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), lampMat);
    lamp.position.set(x, 2.55, z);
    g.add(lamp);
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.2, 8), mat(C.cocoa));
    cap.position.set(x, 2.78, z);
    g.add(cap);
    const pl = new THREE.PointLight(0xffc978, 6, 9, 2);
    pl.position.set(x, 2.55, z);
    pl.userData.base = 6;
    g.add(pl);
    lamps.push(pl);
    const gm = new THREE.SpriteMaterial({ map: glowTex, color: 0xffd9a0, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false });
    gm.userData.base = 0.5;
    const glint = new THREE.Sprite(gm);
    glint.scale.set(1.5, 1.5, 1);
    glint.position.set(x, 2.55, z);
    g.add(glint);
    glints.push(glint);
  }

  return {
    group: g,
    lamps,
    glints,
    update: (t: number) => {
      clouds.children.forEach((cl, i) => {
        cl.position.x += Math.sin(t * 0.05 + i) * 0.002 + 0.002;
        if (cl.position.x > 16) cl.position.x = -16;
      });
      // Птицы: дрейф + взмах крыльев-галочек
      for (const b of birds) {
        const s = b.userData.seed as number;
        b.position.x += 0.008;
        if (b.position.x > 16) b.position.x = -16;
        b.position.y += Math.sin(t * 1.3 + s) * 0.002;
        const flap = Math.sin(t * 6 + s) * 0.5;
        (b.userData.wl as THREE.Object3D).rotation.z = flap;
        (b.userData.wr as THREE.Object3D).rotation.z = -flap;
      }
      // Бабочки: угловатый маршрут + взмах
      for (const bf of butterflies) {
        const s = bf.userData.seed as number;
        const cx = bf.userData.cx as number;
        const cy = bf.userData.cy as number;
        const cz = bf.userData.cz as number;
        bf.position.set(
          cx + Math.sin(t * 0.7 + s) * 1.2 + Math.sin(t * 2.3 + s) * 0.25,
          cy + Math.abs(Math.sin(t * 1.1 + s)) * 0.5,
          cz + Math.cos(t * 0.5 + s) * 1.0 + Math.cos(t * 1.9 + s) * 0.25,
        );
        bf.rotation.y = Math.atan2(Math.cos(t * 0.7 + s), -Math.sin(t * 0.5 + s));
        const flap = Math.sin(t * 18 + s) * 0.9;
        (bf.userData.wl as THREE.Object3D).rotation.y = flap;
        (bf.userData.wr as THREE.Object3D).rotation.y = -flap;
      }
    },
  };
}
