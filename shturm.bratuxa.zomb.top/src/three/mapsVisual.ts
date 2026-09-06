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

/** Локальные canvas-текстуры (не из общего кэша getTex): забор с щелями, вода с рябью. */
let fenceTex: THREE.CanvasTexture | null = null;
let waterTex: THREE.CanvasTexture | null = null;

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
  group.userData.localTex = [getFenceTex(), getWaterTex()];

  // Земля — отдельный меш (принимает тени).
  const groundMat = new THREE.MeshStandardMaterial({ color: GROUND_COLOR[map], roughness: 1 });
  if (map === 'island') {
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

  const matWall = new THREE.MeshStandardMaterial({ color: WALL_COLOR[map], roughness: 0.9 });
  const matWood = new THREE.MeshStandardMaterial({ map: getTex('wood'), roughness: 0.8 });
  const matDark = new THREE.MeshStandardMaterial({ color: 0x2a2d33, roughness: 0.7, metalness: 0.3 });
  const matRubber = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.95 });
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
    // Будка в углу.
    const shed: THREE.BufferGeometry[] = [
      box(3.2, 2.4, 2.6, -14, 1.2, -13),
      box(3.8, 0.18, 3.2, -14, 2.55, -13),
    ];
    add(mergedMesh(shed, matWood));
    add(mergedMesh([box(0.9, 1.8, 0.1, -14, 0.95, -11.65)], matDark, false));
    // Покрышки-баррикады: стопки торов.
    const tires: THREE.BufferGeometry[] = [
      torus(0.55, 0.22, 8, 0.24, -6), torus(0.55, 0.22, 8, 0.66, -6), torus(0.55, 0.22, 8, 1.08, -6),
      torus(0.55, 0.22, 10.5, 0.24, -4.5), torus(0.55, 0.22, 10.5, 0.66, -4.5),
      torus(0.55, 0.22, -2, 0.24, 14), torus(0.55, 0.22, -2, 0.66, 14),
    ];
    add(mergedMesh(tires, matRubber));
    // Ящики.
    add(mergedMesh([
      box(1.2, 1.2, 1.2, 12, 0.6, 10), box(0.9, 0.9, 0.9, 12.1, 1.65, 10, 0.3),
      box(1, 1, 1, 6, 0.5, 12.5, 0.15), box(1.1, 1.1, 1.1, -12, 0.55, 2, 0.4),
    ], matWood));
    // Лужи — глянец.
    const puddleMat = new THREE.MeshStandardMaterial({
      color: 0x9fc4d8, roughness: 0.1, metalness: 0.1,
      envMapIntensity: 1.5, transparent: true, opacity: 0.85,
    });
    add(mergedMesh([flat(2.2, -5, -8, 0.07), flat(1.6, 10, -12, 0.07), flat(1.8, -12, 6, 0.07)], puddleMat, false));
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
      emissive: 0x1d3d1d, emissiveIntensity: 0.55,
    });
    add(mergedMesh(crowns, crownMat));
    // Камни-додекаэдры.
    const matStone = new THREE.MeshStandardMaterial({ color: 0x9a938a, roughness: 1 });
    add(mergedMesh([
      rock(1.2, 8, 4, 1), rock(0.9, -6, -4, 2), rock(1.5, 12, -8, 3),
      rock(1.1, -12, 8, 4), rock(0.8, 4, 18, 5), rock(1.0, -4, -18, 6),
    ], matStone));
    // Вода-кольцо по краю с анимацией скролла текстуры.
    const wtex = getWaterTex();
    const waterMat = new THREE.MeshStandardMaterial({
      map: wtex, transparent: true, opacity: 0.8, roughness: 0.25, metalness: 0.1,
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
}
