import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { MAPS, type MapId } from '../sim/maps';
import { getTex } from './textures';

const GROUND_COLOR: Record<MapId, number> = { yard: 0x5a6b52, island: 0xc2a35e, neon: 0x0b0e1a };
const WALL_COLOR: Record<MapId, number> = { yard: 0x7a7f87, island: 0x8a6f4d, neon: 0x1a2340 };
const LAMP_COLORS: Record<MapId, number[]> = {
  yard: [0xffd9a0, 0xffd9a0],
  island: [0xffe6b0],
  neon: [0x00f0ff, 0xff00e5, 0x7cff00, 0xff00e5],
};

function box(w: number, h: number, d: number, x: number, y: number, z: number, ry = 0): THREE.BufferGeometry {
  const g = new THREE.BoxGeometry(w, h, d);
  if (ry) g.rotateY(ry);
  g.translate(x, y, z);
  return g;
}

function cyl(
  rt: number, rb: number, h: number, x: number, y: number, z: number,
  seg = 12, rx = 0, rz = 0,
): THREE.BufferGeometry {
  const g = new THREE.CylinderGeometry(rt, rb, h, seg);
  if (rx) g.rotateX(rx);
  if (rz) g.rotateZ(rz);
  g.translate(x, y, z);
  return g;
}

function flat(r: number, x: number, z: number, y = 0.02, seg = 24): THREE.BufferGeometry {
  const g = new THREE.CircleGeometry(r, seg);
  g.rotateX(-Math.PI / 2);
  g.translate(x, y, z);
  return g;
}

function torus(
  r: number, t: number, x: number, y: number, z: number, arc = Math.PI * 2,
): THREE.BufferGeometry {
  const g = new THREE.TorusGeometry(r, t, 10, 22, arc);
  g.rotateX(Math.PI / 2);
  g.translate(x, y, z);
  return g;
}

function rock(r: number, x: number, z: number, seed: number): THREE.BufferGeometry {
  const g = new THREE.DodecahedronGeometry(r, 0);
  g.rotateY(seed * 1.7);
  g.scale(1, 0.7, 0.85 + (seed % 3) * 0.1);
  g.translate(x, r * 0.45, z);
  return g;
}

/** Локальные canvas-текстуры (не из общего кэша getTex): забор, вода, трафарет, неон-текст, тень. */
let fenceTex: THREE.CanvasTexture | null = null;
let waterTex: THREE.CanvasTexture | null = null;
let stencilTex: THREE.CanvasTexture | null = null;
let neonTextTex: THREE.CanvasTexture | null = null;
let shadowTex: THREE.CanvasTexture | null = null;

function getFenceTex(): THREE.CanvasTexture {
  if (fenceTex) return fenceTex;
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, 256, 256);
  // Вертикальные доски с щелями 4px каждые 32px.
  for (let x = 0; x < 256; x += 32) {
    const grad = ctx.createLinearGradient(x, 0, x + 28, 0);
    grad.addColorStop(0, '#6e4520');
    grad.addColorStop(0.5, '#7d5227');
    grad.addColorStop(1, '#5f3a18');
    ctx.fillStyle = grad;
    ctx.fillRect(x, 0, 28, 256);
    ctx.strokeStyle = '#4a2d12';
    ctx.lineWidth = 1;
    for (let y = 8; y < 256; y += 22) {
      ctx.beginPath();
      ctx.moveTo(x + 2, y);
      ctx.bezierCurveTo(x + 10, y + 3, x + 18, y - 3, x + 26, y);
      ctx.stroke();
    }
  }
  fenceTex = new THREE.CanvasTexture(c);
  fenceTex.colorSpace = THREE.SRGBColorSpace;
  fenceTex.wrapS = fenceTex.wrapT = THREE.RepeatWrapping;
  fenceTex.repeat.set(12, 1);
  return fenceTex;
}

function getWaterTex(): THREE.CanvasTexture {
  if (waterTex) return waterTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#1e6f9e';
  ctx.fillRect(0, 0, 128, 128);
  ctx.strokeStyle = 'rgba(255,255,255,0.35)';
  ctx.lineWidth = 2;
  for (let y = 8; y < 128; y += 18) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(32, y + 5, 64, y - 5, 96, y);
    ctx.bezierCurveTo(106, y - 2, 118, y + 2, 128, y);
    ctx.stroke();
  }
  waterTex = new THREE.CanvasTexture(c);
  waterTex.colorSpace = THREE.SRGBColorSpace;
  waterTex.wrapS = waterTex.wrapT = THREE.RepeatWrapping;
  waterTex.repeat.set(10, 10);
  return waterTex;
}

/** Трафарет «42» — белый знак на прозрачном фоне, для бортов ящиков. */
function getStencilTex(): THREE.CanvasTexture {
  if (stencilTex) return stencilTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, 128, 128);
  ctx.strokeStyle = 'rgba(240,235,220,0.9)';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 108, 108);
  ctx.fillStyle = 'rgba(240,235,220,0.92)';
  ctx.font = 'bold 64px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('42', 64, 68);
  stencilTex = new THREE.CanvasTexture(c);
  stencilTex.colorSpace = THREE.SRGBColorSpace;
  return stencilTex;
}

/** Неон-текст «ШТУРМ-43 ★ 42 ★» — светящаяся вывеска (map + emissiveMap). */
function getNeonTextTex(): THREE.CanvasTexture {
  if (neonTextTex) return neonTextTex;
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#05060a';
  ctx.fillRect(0, 0, 512, 256);
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 4;
  ctx.strokeRect(12, 12, 488, 232);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#00f0ff';
  ctx.shadowBlur = 24;
  ctx.fillStyle = '#aef7ff';
  ctx.font = 'bold 72px sans-serif';
  ctx.fillText('ШТУРМ-43', 256, 92);
  ctx.shadowColor = '#ff00e5';
  ctx.shadowBlur = 22;
  ctx.fillStyle = '#ffd7f7';
  ctx.font = 'bold 56px sans-serif';
  ctx.fillText('★ 42 ★', 256, 182);
  neonTextTex = new THREE.CanvasTexture(c);
  neonTextTex.colorSpace = THREE.SRGBColorSpace;
  return neonTextTex;
}

/** Тёмное радиальное пятно для AO-подложек под пропсами. */
function getShadowTex(): THREE.CanvasTexture {
  if (shadowTex) return shadowTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 62);
  g.addColorStop(0, 'rgba(0,0,0,0.55)');
  g.addColorStop(0.7, 'rgba(0,0,0,0.28)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  shadowTex = new THREE.CanvasTexture(c);
  return shadowTex;
}

/**
 * Ящик: корпус (wood) + 4 угловые рейки (trim) + трафарет «42» на 2 гранях (stencil).
 * Пушит геометрии в переданные массивы — каждый материал мержится в 1 draw call.
 */
function crate(
  wood: THREE.BufferGeometry[], trim: THREE.BufferGeometry[], stencil: THREE.BufferGeometry[],
  x: number, z: number, s: number, ry = 0, y0 = 0,
): void {
  const body = new THREE.BoxGeometry(s, s, s);
  body.rotateY(ry);
  body.translate(x, y0 + s / 2, z);
  wood.push(body);
  // 4 угловые рейки: крутим смещение на ry вручную (rotateY вокруг origin сдвинул бы планку).
  const h = s / 2;
  const cos = Math.cos(ry);
  const sin = Math.sin(ry);
  for (const [sx, sz] of [[-h, -h], [h, -h], [-h, h], [h, h]] as Array<[number, number]>) {
    const rail = new THREE.BoxGeometry(0.14, s + 0.04, 0.14);
    const dx = sx * cos + sz * sin;
    const dz = -sx * sin + sz * cos;
    rail.translate(x + dx, y0 + s / 2, z + dz);
    trim.push(rail);
  }
  // Трафарет на гранях +z и +x.
  const ts = s * 0.7;
  const p1 = new THREE.PlaneGeometry(ts, ts);
  p1.translate(0, 0, s / 2 + 0.012);
  p1.rotateY(ry);
  p1.translate(x, y0 + s / 2, z);
  stencil.push(p1);
  const p2 = new THREE.PlaneGeometry(ts, ts);
  p2.rotateY(Math.PI / 2);
  p2.translate(s / 2 + 0.012, 0, 0);
  p2.rotateY(ry);
  p2.translate(x, y0 + s / 2, z);
  stencil.push(p2);
}

/** Мешок с песком — капсула лёжа. Без map: тёмная fabric-map множила цвет в черноту. */
function sandbag(x: number, y: number, z: number, ry = 0): THREE.BufferGeometry {
  const g = new THREE.CapsuleGeometry(0.28, 0.7, 4, 10);
  g.rotateZ(Math.PI / 2);
  if (ry) g.rotateY(ry);
  g.translate(x, y, z);
  return g;
}

/** AO-подложка: круг с радиальной тенью. */
function aoDisc(x: number, z: number, r: number, y = 0.06): THREE.BufferGeometry {
  const g = new THREE.CircleGeometry(r, 20);
  g.rotateX(-Math.PI / 2);
  g.translate(x, y, z);
  return g;
}

function mergedMesh(
  parts: THREE.BufferGeometry[],
  mat: THREE.Material,
  shadows = true,
): THREE.Mesh | null {
  if (!parts.length) return null;
  const merged = mergeGeometries(parts);
  parts.forEach((p) => p.dispose());
  const mesh = new THREE.Mesh(merged, mat);
  mesh.castShadow = shadows;
  mesh.receiveShadow = true;
  return mesh;
}

/** Статика карты: узнаваемые объекты + неон-фонари. Возвращает группу для dispose. */
export function buildMapVisual(map: MapId): THREE.Group {
  const def = MAPS[map];
  const half = def.size / 2;
  const group = new THREE.Group();
  group.name = `map-${map}`;
  group.userData.localTex = [getFenceTex(), getWaterTex(), getStencilTex(), getNeonTextTex(), getShadowTex()];

  // Земля — отдельный меш (принимает тени).
  const groundMat = new THREE.MeshStandardMaterial({ color: GROUND_COLOR[map], roughness: 1 });
  if (map === 'yard') {
    groundMat.map = getTex('grassGround');
    groundMat.map.repeat.set(14, 14);
    groundMat.color.set(0xffffff);
  } else if (map === 'island') {
    const sand = getTex('sand');
    sand.repeat.set(10, 10);
    groundMat.map = sand;
    groundMat.color.set(0xffffff);
  } else if (map === 'neon') {
    const asphalt = getTex('asphalt');
    asphalt.repeat.set(6, 6);
    groundMat.map = asphalt;
    groundMat.color.set(0xffffff);
    groundMat.roughness = 0.4; // мокрый асфальт
    groundMat.metalness = 0.2;
    groundMat.envMapIntensity = 0.8;
  }
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(def.size, def.size), groundMat);
  ground.rotation.x = -Math.PI / 2;
  // Базовый грунт scene.ts (90×90 на y=0) перекрывал бы землю карты — поднимаем чуть выше.
  ground.position.y = 0.05;
  ground.receiveShadow = true;
  group.add(ground);

  const matWall = new THREE.MeshStandardMaterial({ map: getTex('stone'), color: WALL_COLOR[map], roughness: 0.9 });
  const matWood = new THREE.MeshStandardMaterial({ map: getTex('wood'), roughness: 0.65 });
  const matDark = new THREE.MeshStandardMaterial({ color: 0x2a2d33, roughness: 0.7, metalness: 0.3 });
  const matRubber = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.95 });
  // Новые материалы Task 4.
  const matSteel = new THREE.MeshStandardMaterial({ color: 0x8a93a0, roughness: 0.35, metalness: 0.9 });
  const matTrim = new THREE.MeshStandardMaterial({ color: 0x4a3520, roughness: 0.8 });
  const matStencil = new THREE.MeshStandardMaterial({
    map: getStencilTex(), transparent: true, alphaTest: 0.3,
    side: THREE.DoubleSide, roughness: 0.8,
  });
  const matAO = new THREE.MeshBasicMaterial({ map: getShadowTex(), transparent: true, depthWrite: false });
  const matSand = new THREE.MeshStandardMaterial({ color: 0xa89468, roughness: 1 });
  const add = (m: THREE.Mesh | null) => { if (m) group.add(m); };

  // Круги коллизий из sim — визуальные столбики, как раньше (проходимость не меняем).
  const obstacleGeos = def.obstacles.map((o) => cyl(o.r, o.r * 1.1, 2.5, o.x, 1.25, o.z));

  if (map === 'yard') {
    // Забор-доски с щелями по периметру (alphaTest-текстура) + столбы.
    const fenceMat = new THREE.MeshStandardMaterial({
      map: getFenceTex(), transparent: true, alphaTest: 0.5,
      side: THREE.DoubleSide, roughness: 0.85,
    });
    const fence: THREE.BufferGeometry[] = [
      box(def.size + 2, 2.2, 0.15, 0, 1.1, -half - 0.5),
      box(def.size + 2, 2.2, 0.15, 0, 1.1, half + 0.5),
      box(0.15, 2.2, def.size + 2, -half - 0.5, 1.1, 0),
      box(0.15, 2.2, def.size + 2, half + 0.5, 1.1, 0),
    ];
    add(mergedMesh(fence, fenceMat));
    const posts: THREE.BufferGeometry[] = [];
    for (let x = -half; x <= half + 0.01; x += 3) {
      posts.push(cyl(0.09, 0.12, 2.6, x, 1.3, -half - 0.5, 8));
      posts.push(cyl(0.09, 0.12, 2.6, x, 1.3, half + 0.5, 8));
      posts.push(cyl(0.09, 0.12, 2.6, -half - 0.5, 1.3, x, 8));
      posts.push(cyl(0.09, 0.12, 2.6, half + 0.5, 1.3, x, 8));
    }
    add(mergedMesh(posts, matWood));
    // Будка в углу (-14,-13): корпус + крыша + дверь с рамой + светящееся окно.
    const shed: THREE.BufferGeometry[] = [
      box(3.2, 2.4, 2.6, -14, 1.2, -13),
      box(3.8, 0.18, 3.2, -14, 2.55, -13),
    ];
    add(mergedMesh(shed, matWood));
    add(mergedMesh([box(0.9, 1.8, 0.1, -14, 0.95, -11.65)], matDark, false));
    // Рама двери: 2 стойки + перекладина.
    add(mergedMesh([
      box(0.12, 1.9, 0.12, -14.51, 0.95, -11.63),
      box(0.12, 1.9, 0.12, -13.49, 0.95, -11.63),
      box(1.14, 0.12, 0.12, -14, 1.92, -11.63),
    ], matTrim, false));
    // Светящееся окно будки (тёплый свет внутри).
    const winMat = new THREE.MeshStandardMaterial({
      color: 0x2a2018, emissive: 0xffc873, emissiveIntensity: 1.8, roughness: 0.4,
    });
    const win = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.7), winMat);
    win.position.set(-12.9, 1.5, -11.69);
    group.add(win);
    // Покрышки-баррикады в точках коллайдеров: шины + ступица + стальной обод.
    const tireSpots: Array<[number, number, number]> = [[8, -6, 3], [10.5, -4.5, 2], [-2, 14, 2]];
    const tires: THREE.BufferGeometry[] = [];
    const hubs: THREE.BufferGeometry[] = [];
    const rims: THREE.BufferGeometry[] = [];
    for (const [tx, tz, n] of tireSpots) {
      for (let i = 0; i < n; i++) {
        const y = 0.24 + i * 0.42;
        tires.push(torus(0.55, 0.22, tx, y, tz));
        hubs.push(cyl(0.22, 0.22, 0.4, tx, y, tz, 12));
        rims.push(torus(0.32, 0.06, tx, y, tz));
      }
    }
    add(mergedMesh(tires, matRubber));
    add(mergedMesh(hubs, matDark));
    add(mergedMesh(rims, matSteel));
    // Ящики с рейками и трафаретом: (12,10) — верхний на нижнем, (6,12.5), (-12,2).
    const crateWood: THREE.BufferGeometry[] = [];
    const crateTrim: THREE.BufferGeometry[] = [];
    const crateStencil: THREE.BufferGeometry[] = [];
    crate(crateWood, crateTrim, crateStencil, 12, 10, 1.2, 0);
    crate(crateWood, crateTrim, crateStencil, 12.1, 10, 0.9, 0.3, 1.2);
    crate(crateWood, crateTrim, crateStencil, 6, 12.5, 1.0, 0.15);
    crate(crateWood, crateTrim, crateStencil, -12, 2, 1.1, 0.4);
    add(mergedMesh(crateWood, matWood));
    add(mergedMesh(crateTrim, matTrim));
    add(mergedMesh(crateStencil, matStencil, false));
    // AO-пятна под шинами, ящиками, будкой.
    add(mergedMesh([
      aoDisc(8, -6, 1.4), aoDisc(10.5, -4.5, 1.2), aoDisc(-2, 14, 1.2),
      aoDisc(12, 10, 1.6), aoDisc(6, 12.5, 1.2), aoDisc(-12, 2, 1.2),
      aoDisc(-14, -13, 2.6),
    ], matAO, false));
    // Лужи — глянец.
    const puddleMat = new THREE.MeshStandardMaterial({
      color: 0x9fc4d8, roughness: 0.1, metalness: 0.1,
      envMapIntensity: 1.5, transparent: true, opacity: 0.85,
    });
    add(mergedMesh([flat(2.2, -5, -8, 0.07), flat(1.6, 10, -12, 0.07), flat(1.8, -12, 6, 0.07)], puddleMat, false));
    // Пруд: свой инстанс текстуры (оффсет независим от кольца острова) + блик.
    const pondTex = getWaterTex().clone();
    pondTex.needsUpdate = true;
    pondTex.repeat.set(4, 4);
    (group.userData.localTex as THREE.Texture[]).push(pondTex);
    const pondMat = new THREE.MeshStandardMaterial({
      map: pondTex, transparent: true, opacity: 0.9, roughness: 0.12, metalness: 0.1, envMapIntensity: 2.0,
    });
    const pond = new THREE.Mesh(new THREE.CircleGeometry(4, 36), pondMat);
    pond.rotation.x = -Math.PI / 2;
    pond.position.set(10, 0.06, -2);
    pond.name = 'pond';
    pond.onBeforeRender = () => { pondTex.offset.x = (performance.now() / 9000) % 1; };
    group.add(pond);
    add(mergedMesh(obstacleGeos, matWood));
  } else if (map === 'island') {
    add(mergedMesh([
      box(def.size + 2, 3, 1, 0, 1.5, -half - 0.5),
      box(def.size + 2, 3, 1, 0, 1.5, half + 0.5),
      box(1, 3, def.size + 2, -half - 0.5, 1.5, 0),
      box(1, 3, def.size + 2, half + 0.5, 1.5, 0),
      ...obstacleGeos,
    ], matWall));
    // Пальмы: наклонный ствол + 6 плоскостей кроны.
    const palms: Array<[number, number]> = [[-20, -14], [18, -16], [-16, 16], [20, 14], [0, -22]];
    const trunks: THREE.BufferGeometry[] = [];
    const crowns: THREE.BufferGeometry[] = [];
    for (const [px, pz] of palms) {
      trunks.push(cyl(0.18, 0.3, 4.4, px, 2.1, pz, 8, 0, 0.07));
      const topX = px - Math.sin(0.07) * 2.2;
      for (let i = 0; i < 6; i++) {
        const leaf = new THREE.PlaneGeometry(2.8, 1.3, 1, 1);
        leaf.rotateX(-Math.PI / 2 + 0.5);
        leaf.rotateY((i / 6) * Math.PI * 2);
        leaf.translate(topX, 4.35, pz);
        crowns.push(leaf);
      }
      // Кокосы — пара шаров у кроны.
      trunks.push(cyl(0.16, 0.16, 0.32, topX + 0.25, 4.05, pz, 8));
    }
    add(mergedMesh(trunks, matWood));
    const crownMat = new THREE.MeshStandardMaterial({
      map: getTex('palm'), side: THREE.DoubleSide, roughness: 0.9,
      emissive: 0x1d3d1d, emissiveIntensity: 0.25,
    });
    add(mergedMesh(crowns, crownMat));
    // Камни-додекаэдры (координаты = коллайдеры Task 2).
    const rocks: Array<[number, number, number, number]> = [
      [1.2, 8, 4, 1], [0.9, -6, -4, 2], [1.5, 12, -8, 3],
      [1.1, -12, 8, 4], [0.8, 4, 18, 5], [1.0, -4, -18, 6],
    ];
    const matStone = new THREE.MeshStandardMaterial({ map: getTex('stone'), color: 0xcfc9bd, roughness: 1 });
    add(mergedMesh(rocks.map(([r, x, z, s]) => rock(r, x, z, s)), matStone));
    // Мешки: 3 колонны × (2 внизу + 1 сверху) у (0,4) — точки коллайдеров (-1.5/0/1.5, 4).
    const bags: THREE.BufferGeometry[] = [];
    for (const cx of [-1.5, 0, 1.5]) {
      bags.push(sandbag(cx - 0.35, 0.28, 4, 0.2));
      bags.push(sandbag(cx + 0.35, 0.28, 4, -0.3));
      bags.push(sandbag(cx, 0.8, 4, 0.9));
    }
    add(mergedMesh(bags, matSand));
    // 2 ящика с трафаретом: (-10,0), (14,10).
    const iWood: THREE.BufferGeometry[] = [];
    const iTrim: THREE.BufferGeometry[] = [];
    const iStencil: THREE.BufferGeometry[] = [];
    crate(iWood, iTrim, iStencil, -10, 0, 1.1, 0.2);
    crate(iWood, iTrim, iStencil, 14, 10, 1.1, -0.35);
    add(mergedMesh(iWood, matWood));
    add(mergedMesh(iTrim, matTrim));
    add(mergedMesh(iStencil, matStencil, false));
    // AO под камнями, пальмами, мешками, ящиками.
    const aoParts: THREE.BufferGeometry[] = [
      ...rocks.map(([r, x, z]) => aoDisc(x, z, r * 1.4)),
      ...palms.map(([x, z]) => aoDisc(x, z, 1.0)),
      aoDisc(-1.5, 4, 1.1), aoDisc(0, 4, 1.1), aoDisc(1.5, 4, 1.1),
      aoDisc(-10, 0, 1.4), aoDisc(14, 10, 1.4),
    ];
    add(mergedMesh(aoParts, matAO, false));
    // Вода-кольцо по краю с анимацией скролла текстуры.
    const wtex = getWaterTex();
    const waterMat = new THREE.MeshStandardMaterial({
      map: wtex, transparent: true, opacity: 0.9, roughness: 0.15, metalness: 0.1, envMapIntensity: 1.2,
    });
    const ring = new THREE.RingGeometry(half - 4, half + 16, 48, 1);
    ring.rotateX(-Math.PI / 2);
    const water = new THREE.Mesh(ring, waterMat);
    water.position.y = 0.09;
    water.onBeforeRender = () => { wtex.offset.x = (performance.now() / 12000) % 1; };
    group.add(water);
  } else {
    // neon
    add(mergedMesh([
      box(def.size + 2, 3, 1, 0, 1.5, -half - 0.5),
      box(def.size + 2, 3, 1, 0, 1.5, half + 0.5),
      box(1, 3, def.size + 2, -half - 0.5, 1.5, 0),
      box(1, 3, def.size + 2, half + 0.5, 1.5, 0),
      ...obstacleGeos,
    ], matWall));
    // Трубы вдоль стен (rust-металл).
    const matPipe = new THREE.MeshStandardMaterial({ map: getTex('rust'), metalness: 0.85, roughness: 0.5, envMapIntensity: 0.9 });
    add(mergedMesh([
      cyl(0.25, 0.25, 40, 0, 1.2, -half + 0.4, 12, 0, Math.PI / 2),
      cyl(0.18, 0.18, 40, 0, 2.0, -half + 0.4, 10, 0, Math.PI / 2),
      cyl(0.25, 0.25, 40, -half + 0.4, 2.0, 0, 12, Math.PI / 2, 0),
      cyl(0.18, 0.18, 40, half - 0.4, 1.4, 0, 10, Math.PI / 2, 0),
    ], matPipe));
    // Билборды-вывески: стойки + светящиеся boards.
    add(mergedMesh([
      cyl(0.15, 0.2, 5, -18, 2.5, -18, 8),
      cyl(0.15, 0.2, 5, 18, 2.5, 16, 8),
      cyl(0.15, 0.2, 5, 0, 2.5, 22, 8),
    ], matDark));
    const signTex = getTex('sign');
    const boardMat = new THREE.MeshStandardMaterial({
      map: signTex, emissive: 0xffffff, emissiveMap: signTex,
      emissiveIntensity: 1.2, color: 0x222222, roughness: 0.5,
    });
    const boards: THREE.BufferGeometry[] = [
      box(5, 2.5, 0.3, -18, 6, -18, Math.PI / 4),
      box(5, 2.5, 0.3, 18, 6, 16, -Math.PI / 3),
      box(6, 3, 0.3, 0, 6.5, 22, Math.PI),
    ];
    add(mergedMesh(boards, boardMat, false));
    // Текст-вывеска 6×3 «ШТУРМ-43 ★ 42 ★» перед центральным щитом — ловит bloom.
    const neonTex = getNeonTextTex();
    const neonSignMat = new THREE.MeshStandardMaterial({
      map: neonTex, emissive: 0xffffff, emissiveMap: neonTex,
      emissiveIntensity: 1.1, color: 0x111111, roughness: 0.5,
      side: THREE.DoubleSide,
    });
    const neonSign = new THREE.Mesh(new THREE.PlaneGeometry(6, 3), neonSignMat);
    neonSign.position.set(0, 6.5, 21.7);
    neonSign.rotation.y = Math.PI;
    group.add(neonSign);
    // Бочки в точках коллайдеров: корпус + 2 обруча + крышка, ржавые/бирюзовые через одну.
    const barrels: Array<[number, number]> = [[-12, -4], [-11, -3], [-12.6, -2.8], [10, 12], [11, 12.5]];
    const rustBodies: THREE.BufferGeometry[] = [];
    const tealBodies: THREE.BufferGeometry[] = [];
    const hoops: THREE.BufferGeometry[] = [];
    const lids: THREE.BufferGeometry[] = [];
    barrels.forEach(([bx, bz], i) => {
      const body = cyl(0.4, 0.4, 0.9, bx, 0.45, bz, 14);
      ((i % 2 === 0) ? rustBodies : tealBodies).push(body);
      const h1 = new THREE.TorusGeometry(0.41, 0.03, 8, 20);
      h1.rotateX(Math.PI / 2);
      h1.translate(bx, 0.25, bz);
      hoops.push(h1);
      const h2 = new THREE.TorusGeometry(0.41, 0.03, 8, 20);
      h2.rotateX(Math.PI / 2);
      h2.translate(bx, 0.7, bz);
      hoops.push(h2);
      lids.push(cyl(0.42, 0.42, 0.06, bx, 0.93, bz, 14));
    });
    const matRust = new THREE.MeshStandardMaterial({ map: getTex('rust'), roughness: 0.6, metalness: 0.4 });
    const matTeal = new THREE.MeshStandardMaterial({ color: 0x1fa8a8, roughness: 0.45, metalness: 0.6 });
    add(mergedMesh(rustBodies, matRust));
    add(mergedMesh(tealBodies, matTeal));
    add(mergedMesh(hoops, matDark));
    add(mergedMesh(lids, matSteel));
    // Контейнер (-5,15): корпус + приоткрытая крышка + колёса.
    add(mergedMesh([box(3, 1.5, 1.6, -5, 0.75, 15, 0.2)], matTeal));
    const lidGeo = new THREE.BoxGeometry(3, 0.1, 1.6);
    lidGeo.rotateX(-0.3);
    lidGeo.rotateY(0.2);
    lidGeo.translate(-5, 1.62, 15);
    add(mergedMesh([lidGeo], matSteel, false));
    const wheels: THREE.BufferGeometry[] = [];
    for (const [wx, wz] of [[-6.2, 14.4], [-3.8, 14.4], [-6.2, 15.6], [-3.8, 15.6]] as Array<[number, number]>) {
      wheels.push(cyl(0.25, 0.25, 0.2, wx, 0.25, wz, 12, Math.PI / 2, 0));
    }
    add(mergedMesh(wheels, matDark));
    // AO под бочками, контейнером, стойками.
    add(mergedMesh([
      ...barrels.map(([bx, bz]) => aoDisc(bx, bz, 0.9)),
      aoDisc(-5, 15, 2.4),
      aoDisc(-18, -18, 0.8), aoDisc(18, 16, 0.8), aoDisc(0, 22, 0.8),
    ], matAO, false));
    // Голограммы — аддитивные плоскости, парят (bob через onBeforeRender).
    const holoCols = [0x00f0ff, 0xff00e5, 0x7cff00];
    const holoPos: Array<[number, number, number, number]> = [
      [5, 3.5, 5, 0.6], [-6, 3.2, -4, 2.2], [0, 4, 12, Math.PI],
    ];
    holoPos.forEach(([hx, hy, hz, ry], i) => {
      const hm = new THREE.MeshStandardMaterial({
        color: holoCols[i], transparent: true, opacity: 0.25,
        blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false,
        emissive: holoCols[i], emissiveIntensity: 1.6,
      });
      const h = new THREE.Mesh(new THREE.PlaneGeometry(3, 2), hm);
      h.position.set(hx, hy, hz);
      h.rotation.y = ry;
      h.onBeforeRender = () => {
        h.position.y = hy + Math.sin(performance.now() / 900 + i * 2) * 0.25;
      };
      group.add(h);
    });
  }

  // Фонари: стойка merged + PointLight без теней.
  const colors = LAMP_COLORS[map];
  const lampPos: THREE.Vector3[] = colors.map((_, i) => {
    const a = (i / colors.length) * Math.PI * 2 + Math.PI / 4;
    const r = half - 4;
    return new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r);
  });
  const poleGeos = lampPos.map((p) => cyl(0.12, 0.16, 4.5, p.x, 2.25, p.z, 8));
  const poleMerged = mergeGeometries(poleGeos);
  poleGeos.forEach((p) => p.dispose());
  group.add(new THREE.Mesh(poleMerged, new THREE.MeshStandardMaterial({ color: 0x222831, roughness: 0.6, metalness: 0.6 })));

  lampPos.forEach((p, i) => {
    const color = colors[i % colors.length];
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 12, 8),
      new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 2.5 }),
    );
    bulb.position.set(p.x, 4.6, p.z);
    group.add(bulb);
    const light = new THREE.PointLight(color, map === 'neon' ? 60 : 25, map === 'neon' ? 35 : 22, 1.8);
    light.position.set(p.x, 4.6, p.z);
    group.add(light);
  });
  // Световые лужи у фонарей: аддитив по цвету лампы, поверх AO (renderOrder=2).
  const poolsByColor = new Map<number, THREE.BufferGeometry[]>();
  lampPos.forEach((p, i) => {
    const color = colors[i % colors.length];
    if (!poolsByColor.has(color)) poolsByColor.set(color, []);
    poolsByColor.get(color)!.push(flat(3, p.x, p.z, 0.08));
  });
  for (const [color, parts] of poolsByColor) {
    const poolMat = new THREE.MeshBasicMaterial({
      color, transparent: true, opacity: 0.28,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const pool = mergedMesh(parts, poolMat, false);
    if (pool) {
      pool.renderOrder = 2;
      group.add(pool);
    }
  }

  return group;
}

/** Удалить визуал карты из сцены с освобождением геометрий. */
export function disposeMapVisual(scene: THREE.Scene, group: THREE.Group): void {
  scene.remove(group);
  group.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      const m = o.material as THREE.Material | THREE.Material[];
      if (Array.isArray(m)) m.forEach((x) => x.dispose());
      else m.dispose();
    }
  });
  for (const t of (group.userData.localTex as THREE.Texture[] | undefined) ?? []) t.dispose();
  fenceTex = null;
  waterTex = null;
  stencilTex = null;
  neonTextTex = null;
  shadowTex = null;
}
