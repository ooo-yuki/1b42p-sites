// Мир из GLB-ассетов: cell.glb (пол/стены/потолок/лампа) + toilet.glb (унитаз).
// Стены между клетками — проёмы; при постройке глухая стена обваливается (визуально, без физики).
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import type { Cell } from './api';
import { DRAW_FAR, type Gfx } from './settings';

export const CELL = 2; // клетка 2×2 м
export const WALL_H = 3;
const DOOR_W = 1.3; // проём между клетками
const DOOR_H = 2.2;
const FRAG_COLS = 5; // нарезка стены для обвала
const FRAG_ROWS = 6;
const COLLAPSE_DUR = 1.1; // секунд на анимацию обвала

export interface Toilet {
  group: THREE.Group;
  box: { x0: number; z0: number; x1: number; z1: number }; // AABB для коллизии ног
  anim: number; // 0..1 — прогресс смыва
}

export interface World {
  scene: THREE.Scene;
  root: THREE.Group;
  toilet: Toilet | null;
  spawn: THREE.Vector3;
  load(): Promise<void>;
  rebuild(cells: Cell[]): void;
  hasCell(x: number, z: number): boolean;
  update(dt: number): void;
  applyGfx(g: Gfx): void;
}

type Side = 'n' | 's' | 'e' | 'w';
const DIRECTIONS: { dir: Side; dx: number; dz: number }[] = [
  { dir: 'n', dx: 0, dz: -1 },
  { dir: 's', dx: 0, dz: 1 },
  { dir: 'e', dx: 1, dz: 0 },
  { dir: 'w', dx: -1, dz: 0 },
];

// ---------------------------------------------------------------- геометрия стен
/** Разбор плоской стены: оси плоскости, границы, UV углов. */
interface WallPlane {
  nAxis: 0 | 1 | 2;
  hAxis: 0 | 1 | 2;
  vAxis: 0 | 1 | 2;
  h0: number;
  h1: number;
  v0: number;
  v1: number;
  planePos: number;
  uvs: [THREE.Vector2, THREE.Vector2, THREE.Vector2, THREE.Vector2]; // (h0,v0) (h1,v0) (h0,v1) (h1,v1)
  uvs1: [THREE.Vector2, THREE.Vector2, THREE.Vector2, THREE.Vector2]; // TEXCOORD_1 (карты в GLB на канале 1)
  normal: THREE.Vector3;
}

function analyzePlane(geom: THREE.BufferGeometry): WallPlane {
  const pos = geom.getAttribute('position') as THREE.BufferAttribute;
  const uv = geom.getAttribute('uv') as THREE.BufferAttribute | undefined;
  const uv1 = geom.getAttribute('uv1') as THREE.BufferAttribute | undefined;
  const nor = geom.getAttribute('normal') as THREE.BufferAttribute | undefined;
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < pos.count; i++) {
    const c = [pos.getX(i), pos.getY(i), pos.getZ(i)];
    for (let a = 0; a < 3; a++) {
      min[a] = Math.min(min[a], c[a]);
      max[a] = Math.max(max[a], c[a]);
    }
  }
  const size = [max[0] - min[0], max[1] - min[1], max[2] - min[2]];
  const nAxis = (size.indexOf(Math.min(...size)) as 0 | 1 | 2);
  const rest = ([0, 1, 2] as const).filter((a) => a !== nAxis);
  const vAxis = size[rest[0]] > size[rest[1]] ? rest[0] : rest[1];
  const hAxis = vAxis === rest[0] ? rest[1] : rest[0];
  const get = (i: number, a: number) => (a === 0 ? pos.getX(i) : a === 1 ? pos.getY(i) : pos.getZ(i));
  const h0 = min[hAxis];
  const h1 = max[hAxis];
  const v0 = min[vAxis];
  const v1 = max[vAxis];
  let planePos = 0;
  for (let i = 0; i < pos.count; i++) planePos += get(i, nAxis);
  planePos /= pos.count;
  const cornerOf = (attr: THREE.BufferAttribute | undefined, hMin: boolean, vMin: boolean): THREE.Vector2 => {
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < pos.count; i++) {
      const h = get(i, hAxis);
      const v = get(i, vAxis);
      const d = (hMin ? h - h0 : h1 - h) + (vMin ? v - v0 : v1 - v);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    return attr ? new THREE.Vector2(attr.getX(best), attr.getY(best)) : new THREE.Vector2(hMin ? 0 : 1, vMin ? 0 : 1);
  };
  const corner = (hMin: boolean, vMin: boolean) => cornerOf(uv, hMin, vMin);
  const normal = nor
    ? new THREE.Vector3(nor.getX(0), nor.getY(0), nor.getZ(0)).normalize()
    : new THREE.Vector3(0, 1, 0);
  return {
    nAxis, hAxis, vAxis, h0, h1, v0, v1, planePos,
    uvs: [corner(true, true), corner(false, true), corner(true, false), corner(false, false)],
    uvs1: [cornerOf(uv1, true, true), cornerOf(uv1, false, true), cornerOf(uv1, true, false), cornerOf(uv1, false, false)],
    normal,
  };
}

function uvAt(p: WallPlane, h: number, v: number, alt = false): THREE.Vector2 {
  const su = p.h1 === p.h0 ? 0 : (h - p.h0) / (p.h1 - p.h0);
  const sv = p.v1 === p.v0 ? 0 : (v - p.v0) / (p.v1 - p.v0);
  const [a, b, c, d] = alt ? p.uvs1 : p.uvs;
  return new THREE.Vector2(
    THREE.MathUtils.lerp(THREE.MathUtils.lerp(a.x, b.x, su), THREE.MathUtils.lerp(c.x, d.x, su), sv),
    THREE.MathUtils.lerp(THREE.MathUtils.lerp(a.y, b.y, su), THREE.MathUtils.lerp(c.y, d.y, su), sv),
  );
}

/** Прямоугольники (в осях плоскости) → геометрия. center: координаты относительно центра прямоугольника. */
function rectGeom(p: WallPlane, rects: { h0: number; h1: number; v0: number; v1: number }[], center = false): THREE.BufferGeometry {
  const positions: number[] = [];
  const uvs: number[] = [];
  const uvs1: number[] = [];
  const normals: number[] = [];
  for (const r of rects) {
    const cn = center ? p.planePos : 0;
    const ch = center ? (r.h0 + r.h1) / 2 : 0;
    const cv = center ? (r.v0 + r.v1) / 2 : 0;
    const put = (h: number, v: number) => {
      const pt = [0, 0, 0];
      pt[p.nAxis] = p.planePos - cn;
      pt[p.hAxis] = h - ch;
      pt[p.vAxis] = v - cv;
      positions.push(pt[0], pt[1], pt[2]);
      const uv = uvAt(p, h, v);
      uvs.push(uv.x, uv.y);
      const uv1 = uvAt(p, h, v, true);
      uvs1.push(uv1.x, uv1.y);
      normals.push(p.normal.x, p.normal.y, p.normal.z);
    };
    // четыре угла: (h0,v0) (h1,v0) (h1,v1) (h0,v1) → два треугольника
    put(r.h0, r.v0);
    put(r.h1, r.v0);
    put(r.h1, r.v1);
    put(r.h0, r.v0);
    put(r.h1, r.v1);
    put(r.h0, r.v1);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  g.setAttribute('uv1', new THREE.Float32BufferAttribute(uvs1, 2));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  g.userData.shared = true;
  return g;
}

function doorRects(p: WallPlane): { h0: number; h1: number; v0: number; v1: number }[] {
  const d = DOOR_W / 2;
  return [
    { h0: p.h0, h1: -d, v0: p.v0, v1: p.v1 },
    { h0: d, h1: p.h1, v0: p.v0, v1: p.v1 },
    { h0: -d, h1: d, v0: p.v0 + DOOR_H, v1: p.v1 },
  ];
}

function fragRects(p: WallPlane): { h0: number; h1: number; v0: number; v1: number }[] {
  const rects: { h0: number; h1: number; v0: number; v1: number }[] = [];
  const w = (p.h1 - p.h0) / FRAG_COLS;
  const hgt = (p.v1 - p.v0) / FRAG_ROWS;
  for (let c = 0; c < FRAG_COLS; c++) {
    for (let r = 0; r < FRAG_ROWS; r++) {
      rects.push({ h0: p.h0 + c * w, h1: p.h0 + (c + 1) * w, v0: p.v0 + r * hgt, v1: p.v0 + (r + 1) * hgt });
    }
  }
  return rects;
}

// ---------------------------------------------------------------- обвал
interface Collapse {
  group: THREE.Group;
  mat: THREE.MeshStandardMaterial;
  t: number;
  parts: { mesh: THREE.Mesh; p0: THREE.Vector3; v: THREE.Vector3; axis: THREE.Vector3; speed: number }[];
}

// ---------------------------------------------------------------- шаблоны из GLB
interface Part {
  geo: THREE.BufferGeometry;
  mat: THREE.Material | THREE.Material[];
}
interface Templates {
  floor: Part;
  ceil: Part;
  lamp: Part[];
  lampY: number;
  wall: Record<Side, Part>;
  doorGeo: Record<Side, THREE.BufferGeometry>;
  fragGeo: Record<Side, THREE.BufferGeometry[]>;
  fragCenter: Record<Side, THREE.Vector3[]>;
  toilet: THREE.Object3D;
  toiletBox: THREE.Box3;
}

const CELL_NODES: Record<string, string> = { floor: 'Plane', ceil: 'Plane.007', lamp: 'Sphere' };
const WALL_NODES: Record<Side, string> = { n: 'Plane.001', s: 'Plane.006', e: 'Plane.002', w: 'Plane.004' };

export function createWorld(): World {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0e13);
  scene.fog = new THREE.Fog(0x0a0e13, 6, 26);

  const root = new THREE.Group();
  scene.add(root);

  const ambient = new THREE.AmbientLight(0xaebccb, 1.1);
  const hemi = new THREE.HemisphereLight(0x8fa6bd, 0x14181d, 0.7);
  scene.add(ambient, hemi);

  // состояние настроек графики (применяется после загрузки GLB)
  let gfxCur: Gfx | null = null;
  let lightLevel = 2;
  const cellLights: THREE.PointLight[] = [];
  const allTextures = new Set<THREE.Texture>();
  const allMats = new Set<THREE.MeshStandardMaterial>();

  const markMat = new THREE.MeshBasicMaterial({ color: 0x5ad6c0, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
  const markGeo = new THREE.RingGeometry(0.4, 0.55, 32);
  markGeo.userData.shared = true;

  let T: Templates | null = null;
  let loadPromise: Promise<void> | null = null;
  let toilet: Toilet | null = null;
  let spawn = new THREE.Vector3(0, 1.6, 2);
  let cells: Cell[] = [];
  const collapses: Collapse[] = [];

  const world: World = {
    scene,
    root,
    get toilet() { return toilet; },
    get spawn() { return spawn; },
    hasCell(x, z) { return cells.some((c) => c.x === x && c.z === z); },

    load() {
      if (!loadPromise) loadPromise = doLoad();
      return loadPromise;
    },

    update(dt: number): void {
      for (let i = collapses.length - 1; i >= 0; i--) {
        const c = collapses[i];
        c.t += dt;
        const k = Math.min(1, c.t / COLLAPSE_DUR);
        c.mat.opacity = k < 0.4 ? 1 : 1 - (k - 0.4) / 0.6;
        for (let j = 0; j < c.parts.length; j++) {
          const p = c.parts[j];
          const t = c.t;
          p.mesh.position.set(
            p.p0.x + p.v.x * t,
            p.p0.y + p.v.y * t - 5 * t * t,
            p.p0.z + p.v.z * t,
          );
          p.mesh.quaternion.setFromAxisAngle(p.axis, p.speed * t);
        }
        if (k >= 1) {
          root.remove(c.group);
          c.mat.dispose();
          collapses.splice(i, 1);
        }
      }
    },

    applyGfx(g: Gfx): void {
      gfxCur = g;
      if (!T) return; // GLB ещё не загружен — применим в doLoad()
      applyTex(g.tex);
      applyRefl(g.refl);
      lightLevel = g.light;
      applyLight();
      applyFog(g.draw);
    },

    rebuild(next) {
      if (!T) return; // карта ещё не загружена — соберётся после load()
      const prevSet = new Set(cells.map((c) => c.x + ',' + c.z));
      cells = next.map((c) => ({ ...c }));
      toilet = null;
      while (root.children.length) {
        const c = root.children.pop()!;
        c.traverse((o) => {
          const m = o as THREE.Mesh;
          if (m.geometry && !m.geometry.userData.shared) m.geometry.dispose();
        });
      }
      cellLights.length = 0;

      for (const cell of cells) {
        const cx = cell.x * CELL;
        const cz = cell.z * CELL;

        const floor = new THREE.Mesh(T.floor.geo, T.floor.mat);
        floor.position.set(cx, 0, cz);
        root.add(floor);

        const ceil = new THREE.Mesh(T.ceil.geo, T.ceil.mat);
        ceil.position.set(cx, 0, cz);
        root.add(ceil);

        for (const d of DIRECTIONS) {
          if (world.hasCell(cell.x + d.dx, cell.z + d.dz)) continue; // сосед — стену не рисуем (обвал её и так убирает)
          const geo = T.wall[d.dir].geo;
          const w = new THREE.Mesh(geo, T.wall[d.dir].mat);
          w.position.set(cx, 0, cz);
          root.add(w);
        }

        for (const part of T.lamp) {
          const lamp = new THREE.Mesh(part.geo, part.mat);
          lamp.position.set(cx, 0, cz);
          root.add(lamp);
        }
        const light = new THREE.PointLight(0xfff0cf, 7, 7, 2);
        light.position.set(cx, T.lampY, cz);
        root.add(light);
        cellLights.push(light);

        if (cell.kind === 'toilet') {
          toilet = placeToilet(T, cx, cz);
          root.add(toilet.group);
        }
        if (cell.kind === 'spawn') {
          spawn = new THREE.Vector3(cx, 1.6, cz);
          const mark = new THREE.Mesh(markGeo, markMat);
          mark.rotation.x = -Math.PI / 2;
          mark.position.set(cx, 0.02, cz);
          root.add(mark);
        }
      }

      // обвал: границы, где раньше была глухая стена, а теперь проём (клетку построили сейчас)
      for (const cell of cells) {
        for (const d of DIRECTIONS) {
          const nx = cell.x + d.dx;
          const nz = cell.z + d.dz;
          if (!world.hasCell(nx, nz)) continue;
          const cellBefore = prevSet.has(cell.x + ',' + cell.z);
          const nbBefore = prevSet.has(nx + ',' + nz);
          if (cellBefore && nbBefore) continue; // проём был и раньше
          const old = cellBefore ? cell : nbBefore ? { x: nx, z: nz } : null;
          if (!old) continue; // обе клетки новые — это стартовая загрузка, не постройка
          const other = old === cell ? { x: nx, z: nz } : cell;
          const dir: Side = other.z < old.z ? 'n' : other.z > old.z ? 's' : other.x > old.x ? 'e' : 'w';
          spawnCollapse(T, old.x * CELL, old.z * CELL, dir);
        }
      }
      applyLight(); // новые лампы — применяем текущий уровень света
    },
  } as World;

  function spawnCollapse(t: Templates, cx: number, cz: number, side: Side): void {
    const src = t.wall[side].mat;
    const mat = (Array.isArray(src) ? src[0] : src).clone() as THREE.MeshStandardMaterial;
    mat.transparent = true;
    mat.opacity = 1;
    mat.side = THREE.DoubleSide;
    const group = new THREE.Group();
    group.position.set(cx, 0, cz);
    const rand = () => Math.random() - 0.5;
    const parts: Collapse['parts'] = t.fragGeo[side].map((g, i) => {
      const mesh = new THREE.Mesh(g, mat);
      mesh.position.copy(t.fragCenter[side][i]);
      group.add(mesh);
      const alongX = side === 'n' || side === 's';
      const v = new THREE.Vector3(
        alongX ? rand() * 1.2 : rand() * 2.6, // вдоль стены или в её плоскости
        0.5 + Math.random() * 1.1,
        alongX ? rand() * 2.6 : rand() * 1.2,
      );
      const axis = new THREE.Vector3(rand(), rand(), rand()).normalize();
      if (axis.lengthSq() < 0.01) axis.set(0, 1, 0);
      return { mesh, p0: mesh.position.clone(), v, axis, speed: 4 + Math.random() * 7 };
    });
    root.add(group);
    collapses.push({ group, mat, t: 0, parts });
  }

  function placeToilet(t: Templates, cx: number, cz: number): Toilet {
    const group = t.toilet.clone() as THREE.Group;
    group.updateMatrixWorld(true);
    const b = t.toiletBox;
    // спиной (бачком в +z) к южной стене клетки, игрок подходит с -z
    const z = cz + CELL / 2 - 0.04 - b.max.z;
    group.position.set(cx, -b.min.y, z);
    return {
      group,
      box: { x0: cx + b.min.x, z0: z + b.min.z, x1: cx + b.max.x, z1: z + b.max.z },
      anim: 0,
    };
  }

  async function doLoad(): Promise<void> {
    const loader = new GLTFLoader();
    const gltf = (url: string) =>
      new Promise<{ scene: THREE.Group }>((res, rej) => loader.load(url, res, undefined, rej));
    const [cell, toiletGltf] = await Promise.all([gltf('assets/cell.glb'), gltf('assets/toilet.glb')]);
    cell.scene.updateMatrixWorld(true);
    toiletGltf.scene.updateMatrixWorld(true);

    // GLTFLoader вырезает точки из имён (Plane.007 → Plane007) — ищем по нормализованному имени
    const norm = (s: string) => s.replace(/[\s.]/g, '');
    const byNorm = new Map<string, THREE.Object3D>();
    cell.scene.traverse((o) => {
      const k = norm(o.name);
      if (!byNorm.has(k)) byNorm.set(k, o);
    });
    const getObj = (name: string): THREE.Object3D => {
      const o = byNorm.get(norm(name));
      if (!o) throw new Error('в cell.glb нет объекта «' + name + '»; есть: ' + [...byNorm.keys()].join(', '));
      return o;
    };
    const bake = (m: THREE.Mesh) => {
      const g = m.geometry.clone();
      g.applyMatrix4(m.matrixWorld);
      g.computeBoundingBox();
      g.userData.shared = true;
      return g;
    };
    const partsOf = (o: THREE.Object3D): Part[] => {
      const parts: Part[] = [];
      o.traverse((x) => {
        const m = x as THREE.Mesh;
        if (m.isMesh) parts.push({ geo: bake(m), mat: m.material });
      });
      if (!parts.length) throw new Error('объект «' + o.name + '» в cell.glb без мешей');
      return parts;
    };

    // единая подготовка материалов: видны с двух сторон (плоскости), чёткая фильтрация
    const materials = new Set<THREE.Material>();
    for (const src of [cell.scene, toiletGltf.scene]) {
      src.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) for (const mm of Array.isArray(m.material) ? m.material : [m.material]) materials.add(mm);
      });
    }
    for (const mm of materials) {
      const s = mm as THREE.MeshStandardMaterial;
      s.side = THREE.DoubleSide;
      for (const tex of [s.map, s.normalMap, s.roughnessMap, s.metalnessMap, s.emissiveMap]) if (tex) tex.anisotropy = 8;
      allMats.add(s);
      for (const tex of [s.map, s.normalMap, s.roughnessMap, s.metalnessMap, s.emissiveMap]) if (tex) allTextures.add(tex);
    }

    const wall = {} as Templates['wall'];
    const doorGeo = {} as Templates['doorGeo'];
    const fragGeo = {} as Templates['fragGeo'];
    const fragCenter = {} as Templates['fragCenter'];
    for (const side of ['n', 's', 'e', 'w'] as const) {
      const parts = partsOf(getObj(WALL_NODES[side]));
      if (parts.length !== 1) throw new Error('стена «' + WALL_NODES[side] + '» состоит из ' + parts.length + ' примитивов — нужен один');
      const { geo, mat } = parts[0];
      const plane = analyzePlane(geo);
      wall[side] = { geo, mat };
      doorGeo[side] = rectGeom(plane, doorRects(plane));
      const rects = fragRects(plane);
      fragGeo[side] = [];
      fragCenter[side] = [];
      for (const r of rects) {
        fragGeo[side].push(rectGeom(plane, [r], true));
        const c = [0, 0, 0];
        c[plane.nAxis] = plane.planePos;
        c[plane.hAxis] = (r.h0 + r.h1) / 2;
        c[plane.vAxis] = (r.v0 + r.v1) / 2;
        fragCenter[side].push(new THREE.Vector3(c[0], c[1], c[2]));
      }
    }

    const floor = partsOf(getObj(CELL_NODES.floor))[0];
    const ceil = partsOf(getObj(CELL_NODES.ceil))[0];
    const lampParts = partsOf(getObj(CELL_NODES.lamp));
    const lampBox = new THREE.Box3();
    for (const p of lampParts) lampBox.union(p.geo.boundingBox!);
    const lampY = (lampBox.min.y + lampBox.max.y) / 2;

    const toiletObj = toiletGltf.scene.getObjectByName('toilet') || toiletGltf.scene.children[0];
    if (!toiletObj) throw new Error('в toilet.glb нет унитаза');
    toiletObj.updateMatrixWorld(true);
    const toiletBox = new THREE.Box3().setFromObject(toiletObj);

    T = {
      floor,
      ceil,
      lamp: lampParts,
      lampY,
      wall,
      doorGeo,
      fragGeo,
      fragCenter,
      toilet: toiletObj,
      toiletBox,
    };
    if (gfxCur) world.applyGfx(gfxCur); // настройки выставляли до загрузки GLB
  }

  // ---------------------------------------------------------------- настройки графики
  function downscale(img: HTMLImageElement | HTMLCanvasElement | ImageBitmap, size: number): HTMLCanvasElement {
    const w = (img as HTMLImageElement).width;
    const h = (img as HTMLImageElement).height;
    const k = Math.min(1, size / Math.max(w, h));
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w * k));
    c.height = Math.max(1, Math.round(h * k));
    c.getContext('2d')!.drawImage(img as CanvasImageSource, 0, 0, c.width, c.height);
    return c;
  }

  function applyTex(level: number): void {
    const target = [512, 1024, 0][level] || 0;
    const aniso = [1, 4, 8][level] || 8;
    for (const t of allTextures) {
      if (t.userData._origImg === undefined) t.userData._origImg = t.image;
      const orig = t.userData._origImg;
      if (!orig || !orig.width) continue;
      let img: HTMLImageElement | HTMLCanvasElement = orig;
      if (target && (orig.width > target || orig.height > target)) {
        const cache: Record<number, HTMLCanvasElement> = t.userData._scaled || (t.userData._scaled = {});
        if (!cache[target]) cache[target] = downscale(orig, target);
        img = cache[target];
      }
      if (t.image !== img) {
        t.image = img;
        t.needsUpdate = true;
      }
      t.anisotropy = aniso;
    }
  }

  function applyRefl(level: number): void {
    const on = level > 0;
    for (const m of allMats) {
      if (m.userData._origPBR === undefined) {
        m.userData._origPBR = { r: m.roughness, mm: m.metalness, rmap: m.roughnessMap, mmap: m.metalnessMap };
      }
      const o = m.userData._origPBR;
      if (on) {
        m.roughness = o.r;
        m.metalness = o.mm;
        m.roughnessMap = o.rmap;
        m.metalnessMap = o.mmap;
      } else {
        m.roughness = 1;
        m.metalness = 0;
        m.roughnessMap = null;
        m.metalnessMap = null;
      }
    }
  }

  function applyLight(): void {
    ambient.intensity = [1.9, 1.45, 1.1][lightLevel] ?? 1.1;
    hemi.intensity = [0, 0.85, 0.7][lightLevel] ?? 0.7;
    for (const l of cellLights) l.visible = lightLevel === 2;
  }

  function applyFog(draw: number): void {
    if (scene.fog) (scene.fog as THREE.Fog).far = DRAW_FAR[draw] ?? 26;
  }

  // временная отладка: что лежит в корне сцены
  (world as unknown as { debugInfo: () => unknown }).debugInfo = () =>
    root.children.map((o, i) => {
      const info: Record<string, unknown> = { i, type: o.type, pos: (o as THREE.Mesh).position?.toArray?.()?.map((v: number) => +v.toFixed(2)) };
      const mats: string[] = [];
      const uvs: string[] = [];
      const boxes: string[] = [];
      o.traverse((m) => {
        const mesh = m as THREE.Mesh;
        if (!mesh.isMesh) return;
        for (const mm of Array.isArray(mesh.material) ? mesh.material : [mesh.material]) {
          const s = mm as THREE.MeshStandardMaterial;
          mats.push((mm.name || '?') + (s.map ? '' : ' NOMAP'));
        }
        mesh.geometry.computeBoundingBox();
        const bb = mesh.geometry.boundingBox!;
        boxes.push(`box[${bb.min.toArray().map((v) => v.toFixed(1))}..${bb.max.toArray().map((v) => v.toFixed(1))}]`);
        const uv = mesh.geometry.getAttribute('uv') as THREE.BufferAttribute | undefined;
        if (uv) {
          let u0 = 9, u1 = -9, v0 = 9, v1 = -9;
          for (let k = 0; k < uv.count; k++) {
            u0 = Math.min(u0, uv.getX(k)); u1 = Math.max(u1, uv.getX(k));
            v0 = Math.min(v0, uv.getY(k)); v1 = Math.max(v1, uv.getY(k));
          }
          uvs.push(`uv[${u0.toFixed(2)}..${u1.toFixed(2)},${v0.toFixed(2)}..${v1.toFixed(2)}]`);
        } else uvs.push('NO_UV');
      });
      info.mats = mats;
      info.uvs = uvs;
      info.boxes = boxes;
      return info;
    });

  // временная отладка: показывать только меши с материалом, содержащим sub ('' — всё показать)
  (world as unknown as { debugFilter: (sub: string) => number }).debugFilter = (sub: string) => {
    let hidden = 0;
    root.traverse((m) => {
      const mesh = m as THREE.Mesh;
      if (!mesh.isMesh) return;
      const names = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map((mm) => mm.name || '').join(',');
      const show = !sub || names.includes(sub);
      mesh.visible = show;
      if (!show) hidden++;
    });
    return hidden;
  };

  // временная отладка: луч из точки по направлению — что первый пересекаемый меш и на каком расстоянии
  (world as unknown as { debugRay: (p: number[], d: number[]) => unknown }).debugRay = (p, d) => {
    const ray = new THREE.Raycaster(new THREE.Vector3(...p), new THREE.Vector3(...d).normalize(), 0, 100);
    const hits = ray.intersectObjects(root.children, true);
    return hits.slice(0, 3).map((h) => {
      const mesh = h.object as THREE.Mesh;
      return {
        dist: +h.distance.toFixed(3),
        point: h.point.toArray().map((v) => +v.toFixed(3)),
        mat: Array.isArray(mesh.material) ? mesh.material.map((m) => m.name).join('|') : mesh.material?.name,
      };
    });
  };

  return world;
}
