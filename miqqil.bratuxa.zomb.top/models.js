// MIQQIL TANKS — три.js визуал: сцена, свет, техника, эффекты. Никакой игровой логики тут нет.
// Импортирует 'three' + examples/jsm/objects/Sky + examples/jsm/utils/BufferGeometryUtils через importmap.
// Стиль 42: Мы уже победили 🏆
//
// Перф-заметка: у всей техники в игре ФИКСИРОВАННЫЕ габариты (не зависят от spec/vid,
// только от типа tank/ship/plane) — поэтому геометрия кэшируется РАЗ НА ВЕСЬ ТИП и потом
// просто переиспользуется многими юнитами. Меняется от юнита к юниту только материал
// (камуфляж по vid/isPlayer). Это позволяет свести ~28 мешей на юнит к ~5 слитым мешам
// без единой видимой разницы в картинке.
import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// ---------- утилиты геометрии ----------
function shadowed(o) { o.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; }

const _bakeObj = new THREE.Object3D();
// Печёт трансформацию прямо в геометрию (как раньше делал mesh.position/rotation),
// чтобы потом слить много таких геометрий в один меш через mergeGeometries.
function bake(geo, p = [0, 0, 0], r = [0, 0, 0]) {
  _bakeObj.position.set(p[0], p[1], p[2]);
  _bakeObj.rotation.set(r[0], r[1], r[2]);
  _bakeObj.scale.set(1, 1, 1);
  _bakeObj.updateMatrix();
  geo.applyMatrix4(_bakeObj.matrix);
  return geo;
}
function mergeAndDispose(geos) {
  if (!geos.length) return new THREE.BufferGeometry();
  const merged = mergeGeometries(geos, false);
  for (const g of geos) g.dispose();
  return merged;
}

// ---------- процедурные текстуры ----------
function camoTexture(baseHex, accentHex) {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  const base = new THREE.Color(baseHex), acc = new THREE.Color(accentHex);
  g.fillStyle = `#${base.getHexString()}`; g.fillRect(0, 0, 256, 256);
  const blob = (col, n, rmin, rmax) => {
    g.fillStyle = col;
    for (let i = 0; i < n; i++) {
      const x = Math.random() * 256, y = Math.random() * 256, r = rmin + Math.random() * (rmax - rmin);
      g.beginPath();
      for (let a = 0; a < 8; a++) {
        const rr = r * (0.6 + Math.random() * 0.6), ang = (a / 8) * Math.PI * 2;
        const px = x + Math.cos(ang) * rr, py = y + Math.sin(ang) * rr;
        a === 0 ? g.moveTo(px, py) : g.lineTo(px, py);
      }
      g.closePath(); g.fill();
    }
  };
  blob(`#${acc.getHexString()}`, 10, 14, 34);
  blob(`#${base.clone().offsetHSL(0, 0, -0.08).getHexString()}`, 14, 8, 18);
  // лёгкий шум/потёртости
  for (let i = 0; i < 1400; i++) {
    const v = Math.random() * 30 - 15;
    g.fillStyle = `rgba(${v > 0 ? 255 : 0},${v > 0 ? 255 : 0},${v > 0 ? 255 : 0},${Math.abs(v) / 90})`;
    g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function trackTexture() {
  const c = document.createElement('canvas'); c.width = 32; c.height = 64;
  const g = c.getContext('2d');
  g.fillStyle = '#141414'; g.fillRect(0, 0, 32, 64);
  g.fillStyle = '#2c2c2c';
  for (let y = 0; y < 64; y += 8) g.fillRect(2, y, 28, 4);
  g.fillStyle = '#050505';
  for (let y = 0; y < 64; y += 8) g.fillRect(14, y, 4, 8);
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1, 6);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function groundTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(256, 256, 40, 256, 256, 380);
  grad.addColorStop(0, '#3a4028'); grad.addColorStop(1, '#262c1c');
  g.fillStyle = grad; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 4000; i++) {
    const s = 2 + Math.random() * 3;
    g.fillStyle = `rgba(${40 + Math.random() * 50 | 0},${55 + Math.random() * 40 | 0},${28 + Math.random() * 24 | 0},.55)`;
    g.fillRect(Math.random() * 512, Math.random() * 512, s, s);
  }
  g.strokeStyle = 'rgba(20,24,14,.35)'; g.lineWidth = 2;
  for (let i = 0; i < 40; i++) {
    g.beginPath(); g.moveTo(Math.random() * 512, Math.random() * 512);
    for (let k = 0; k < 4; k++) g.lineTo(Math.random() * 512, Math.random() * 512);
    g.stroke();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(30, 30);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function smokeSprite() {
  const c = document.createElement('canvas'); c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,0.9)');
  grad.addColorStop(0.4, 'rgba(200,200,200,0.5)');
  grad.addColorStop(1, 'rgba(200,200,200,0)');
  g.fillStyle = grad; g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function sparkSprite() {
  const c = document.createElement('canvas'); c.width = c.height = 32;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255,240,180,1)');
  grad.addColorStop(0.5, 'rgba(255,170,60,0.9)');
  grad.addColorStop(1, 'rgba(255,120,30,0)');
  g.fillStyle = grad; g.fillRect(0, 0, 32, 32);
  return new THREE.CanvasTexture(c);
}

let SMOKE_TEX = null, SPARK_TEX = null;
function texCache() { if (!SMOKE_TEX) SMOKE_TEX = smokeSprite(); if (!SPARK_TEX) SPARK_TEX = sparkSprite(); return { SMOKE_TEX, SPARK_TEX }; }

// ---------- сцена, свет, окружение ----------
export function buildRenderer(container, { pixelRatio = Math.min(devicePixelRatio, 2), antialias = true } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias, powerPreference: 'high-performance' });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(pixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = 'game';
  container.appendChild(renderer.domElement);
  return renderer;
}

// Тень следует за игроком узким кадром вместо покрытия всей арены — тот же (даже
// лучший) тексель на меньшей карте теней, без просадки на слабом железе.
const SHADOW_HALF = 46;
export function buildScene(renderer, arenaSize, { shadowMapSize = 1024 } = {}) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 900);

  // небо + окружение (тёплый закатный свет отражается в металле техники)
  const sky = new Sky();
  sky.scale.setScalar(4500);
  const uni = sky.material.uniforms;
  uni.turbidity.value = 3.2; uni.rayleigh.value = 1.6;
  uni.mieCoefficient.value = 0.006; uni.mieDirectionalG.value = 0.82;
  const sunDir = new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(78), THREE.MathUtils.degToRad(-40));
  uni.sunPosition.value.copy(sunDir);
  scene.add(sky);

  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(sky, 0.02).texture;

  scene.fog = new THREE.Fog(0xd9c9a8, 90, 340);

  scene.add(new THREE.HemisphereLight(0xbfd4f2, 0x3a3018, 0.55));
  const sun = new THREE.DirectionalLight(0xffe4b0, 2.1);
  sun.position.copy(sunDir).multiplyScalar(140);
  sun.castShadow = true;
  sun.shadow.mapSize.set(shadowMapSize, shadowMapSize);
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
  const S = SHADOW_HALF;
  Object.assign(sun.shadow.camera, { left: -S, right: S, top: S, bottom: -S, near: 10, far: 320 });
  sun.shadow.camera.updateProjectionMatrix();
  sun.userData.dir = sunDir.clone();
  scene.add(sun);
  scene.add(sun.target);

  return { scene, camera, sun };
}

// Двигает солнце и его цель вслед за игроком, сохраняя угол/дистанцию — держит
// плотную тень теней узкой вокруг боя, а не размазанной на всю арену 400×400.
const _sunFollow = new THREE.Vector3();
export function followSun(sun, x, z) {
  _sunFollow.copy(sun.userData.dir).multiplyScalar(140);
  sun.position.set(x + _sunFollow.x, _sunFollow.y, z + _sunFollow.z);
  sun.target.position.set(x, 0, z);
}

export function buildArena(scene, arena) {
  const group = new THREE.Group();
  scene.add(group);
  const gtex = groundTexture();
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(arena.size, arena.size, 1, 1),
    new THREE.MeshStandardMaterial({ map: gtex, roughness: 1, metalness: 0 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
  group.add(ground);

  // Препятствия слиты в максимум 2 меша (обычный камень / золотой) вместо
  // одного draw call на каждое — их 26 на арену, коллизии считает sim.js отдельно.
  const blockMat = new THREE.MeshStandardMaterial({ color: 0x5a6068, roughness: 0.92, metalness: 0.05 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf5c518, roughness: 0.35, metalness: 0.7 });
  const normalGeos = [], goldGeos = [];
  for (const o of arena.obstacles) {
    const geo = bake(new THREE.BoxGeometry(o.w, o.h, o.d), [o.x, o.h / 2, o.z], [0, o.rotY, 0]);
    (o.gold ? goldGeos : normalGeos).push(geo);
  }
  const obstacleMeshes = [];
  if (normalGeos.length) { const m = new THREE.Mesh(mergeAndDispose(normalGeos), blockMat); m.castShadow = m.receiveShadow = true; group.add(m); obstacleMeshes.push(m); }
  if (goldGeos.length) { const m = new THREE.Mesh(mergeAndDispose(goldGeos), goldMat); m.castShadow = m.receiveShadow = true; group.add(m); obstacleMeshes.push(m); }

  const rockGeo = new THREE.DodecahedronGeometry(1, 0);
  const rockMat = new THREE.MeshStandardMaterial({ color: 0x555a52, roughness: 1 });
  const bushGeo = new THREE.IcosahedronGeometry(1, 0);
  const bushMat = new THREE.MeshStandardMaterial({ color: 0x39492a, roughness: 1 });
  const treeTrunkGeo = new THREE.CylinderGeometry(0.15, 0.22, 1.6, 6);
  const treeTrunkMat = new THREE.MeshStandardMaterial({ color: 0x4a3625, roughness: 1 });
  const treeTopGeo = new THREE.ConeGeometry(1.1, 2.6, 7);
  const treeTopMat = new THREE.MeshStandardMaterial({ color: 0x2d4a24, roughness: 1 });
  const byKind = { rock: [], bush: [], tree: [] };
  for (const d of arena.decor) byKind[d.kind]?.push(d);
  const dummy = new THREE.Object3D();
  function instanced(geo, mat, items, yOff, { cast = true } = {}) {
    if (!items.length) return null;
    const im = new THREE.InstancedMesh(geo, mat, items.length);
    im.castShadow = cast; im.receiveShadow = true;
    items.forEach((d, i) => {
      dummy.position.set(d.x, yOff * d.scale, d.z);
      dummy.rotation.set(0, d.rot, 0);
      dummy.scale.setScalar(d.scale);
      dummy.updateMatrix();
      im.setMatrixAt(i, dummy.matrix);
    });
    group.add(im);
    return im;
  }
  // Мелкий декор (камни/кусты) не отбрасывает тень — их много и они мелкие,
  // разница в картинке незаметна, а проход теней становится дешевле.
  instanced(rockGeo, rockMat, byKind.rock, 0.5, { cast: false });
  instanced(bushGeo, bushMat, byKind.bush, 0.6, { cast: false });
  let trunks = null, tops = null;
  if (byKind.tree.length) {
    trunks = new THREE.InstancedMesh(treeTrunkGeo, treeTrunkMat, byKind.tree.length);
    tops = new THREE.InstancedMesh(treeTopGeo, treeTopMat, byKind.tree.length);
    trunks.castShadow = tops.castShadow = true; tops.receiveShadow = true;
    byKind.tree.forEach((d, i) => {
      dummy.position.set(d.x, 0.8 * d.scale, d.z); dummy.rotation.set(0, d.rot, 0); dummy.scale.setScalar(d.scale);
      dummy.updateMatrix(); trunks.setMatrixAt(i, dummy.matrix);
      dummy.position.set(d.x, 2.1 * d.scale, d.z); dummy.updateMatrix(); tops.setMatrixAt(i, dummy.matrix);
    });
    group.add(trunks, tops);
  }

  // зона — полупрозрачная стена с бегущими полосами
  const wallGeo = new THREE.CylinderGeometry(1, 1, 26, 64, 1, true);
  const wallMat = new THREE.ShaderMaterial({
    transparent: true, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: `varying vec2 vUv; uniform float uTime;
      void main(){
        float stripe = smoothstep(0.0,0.5,abs(fract((vUv.x*10.0)-uTime*0.6)-0.5)*2.0);
        float edge = smoothstep(0.0,0.15,vUv.y)*smoothstep(1.0,0.85,vUv.y);
        vec3 col = mix(vec3(1.0,0.25,0.2), vec3(1.0,0.55,0.2), stripe);
        gl_FragColor = vec4(col, (0.16 + stripe*0.22) * edge);
      }`,
  });
  const zoneMesh = new THREE.Mesh(wallGeo, wallMat);
  zoneMesh.position.y = 13;
  scene.add(zoneMesh);

  return {
    group, zoneMesh,
    updateZone(zone, dt) { wallMat.uniforms.uTime.value += dt; zoneMesh.scale.set(zone.r, 1, zone.r); zoneMesh.position.set(zone.x, 13, zone.z); },
    dispose() {
      scene.remove(group, zoneMesh);
      for (const m of obstacleMeshes) m.geometry.dispose();
      blockMat.dispose(); goldMat.dispose();
      ground.geometry.dispose(); ground.material.map.dispose(); ground.material.dispose();
      rockGeo.dispose(); rockMat.dispose(); bushGeo.dispose(); bushMat.dispose();
      treeTrunkGeo.dispose(); treeTrunkMat.dispose(); treeTopGeo.dispose(); treeTopMat.dispose();
      wallGeo.dispose(); wallMat.dispose();
    },
  };
}

// ---------- техника: геометрия кэшируется на весь тип (габариты не зависят от vid) ----------
const CAMO = {
  t42: [0x4a7c3a, 0x2f5227], pyat: [0x5a4a3a, 0x3a2f22], vihr: [0x3a6a8a, 0x25455c],
  avrora: [0x6a3a5a, 0x452439], yastreb: [0x8a8a9a, 0x5c5c68], player: [0xc79a12, 0x8a6a10],
};
let TRACK_TEX = null;
function trackTex() { if (!TRACK_TEX) TRACK_TEX = trackTexture(); return TRACK_TEX; }

let DARK_MAT = null;
function darkMat() { if (!DARK_MAT) DARK_MAT = new THREE.MeshStandardMaterial({ color: 0x1c1f26, roughness: 0.75, metalness: 0.4 }); return DARK_MAT; }
let GLASS_MAT = null;
function glassMat() {
  // Раньше — MeshPhysicalMaterial{transmission:.7}: физически честное стекло, но
  // включает отдельный transmission-проход рендера ВСЕЙ сцены на каждый кадр с
  // самолётом в бою. Обычная полупрозрачность + envMap даёт похожий блик почти бесплатно.
  if (!GLASS_MAT) GLASS_MAT = new THREE.MeshStandardMaterial({ color: 0x9fd0e8, roughness: 0.08, metalness: 0.2, transparent: true, opacity: 0.45, envMapIntensity: 1.4 });
  return GLASS_MAT;
}
let WRECK_DARK_MAT = null;
function wreckDarkMat() { if (!WRECK_DARK_MAT) WRECK_DARK_MAT = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 1, metalness: 0 }); return WRECK_DARK_MAT; }
let WRECK_GLASS_MAT = null;
function wreckGlassMat() { if (!WRECK_GLASS_MAT) WRECK_GLASS_MAT = new THREE.MeshStandardMaterial({ color: 0x2a2f33, roughness: 0.6, transparent: true, opacity: 0.5 }); return WRECK_GLASS_MAT; }

// Материал камуфляжа (живой + притемнённый вариант для обломков) кэшируется по
// vid|player — одна текстура/материал на всю сессию вместо новой на каждый спавн.
const hullMatCache = new Map();
function hullMats(vid, isPlayer) {
  const key = (isPlayer ? 'player' : vid);
  let m = hullMatCache.get(key);
  if (m) return m;
  const [baseHex, accHex] = isPlayer ? CAMO.player : (CAMO[vid] || [0x666666, 0x444444]);
  const tex = camoTexture(baseHex, accHex); tex.repeat.set(2, 2);
  const live = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, metalness: isPlayer ? 0.55 : 0.35, envMapIntensity: 1.1 });
  const wreck = new THREE.MeshStandardMaterial({ map: tex, color: 0x2a2a2a, roughness: 1, metalness: 0 });
  m = { live, wreck };
  hullMatCache.set(key, m);
  return m;
}

// Геометрия — общая на ВЕСЬ тип техники, строится один раз при первом обращении.
let TANK_GEO = null;
function tankGeometry() {
  if (TANK_GEO) return TANK_GEO;
  const W = 2.9, L = 4.6, H = 1.0;
  const hull = [], dark = [], track = [], turHull = [], turDark = [];

  hull.push(bake(new THREE.BoxGeometry(W, H * 0.7, L), [0, H * 0.35, 0]));
  hull.push(bake(new THREE.BoxGeometry(W * 0.96, H * 0.9, 1.3), [0, H * 0.75, L / 2 - 0.55], [-0.55, 0, 0]));
  hull.push(bake(new THREE.BoxGeometry(W * 0.9, H * 0.5, L * 0.55), [0, H * 1.05, -0.3]));

  for (const sx of [-1, 1]) {
    dark.push(bake(new THREE.BoxGeometry(0.15, 0.7, L * 0.85), [sx * (W / 2 + 0.05), 0.55, 0]));
    track.push(bake(new THREE.BoxGeometry(0.5, 0.85, L + 0.4), [sx * (W / 2 + 0.32), 0.5, 0]));
    const nWheels = 5;
    for (let i = 0; i < nWheels; i++) {
      dark.push(bake(new THREE.CylinderGeometry(0.42, 0.42, 0.42, 14),
        [sx * (W / 2 + 0.32), 0.5, -L / 2 + 0.5 + (L - 1) * (i / (nWheels - 1))], [0, 0, Math.PI / 2]));
    }
    dark.push(bake(new THREE.CylinderGeometry(0.5, 0.5, 0.46, 16), [sx * (W / 2 + 0.32), 0.55, L / 2 + 0.1], [0, 0, Math.PI / 2]));
  }
  dark.push(bake(new THREE.BoxGeometry(0.9, 0.28, 0.4), [0.7, H * 1.05, -L / 2 + 0.35]));
  dark.push(bake(new THREE.CylinderGeometry(0.22, 0.22, 0.5, 10), [-0.7, H * 1.05, -L / 2 + 0.35], [0, 0, Math.PI / 2]));

  turHull.push(bake(new THREE.CylinderGeometry(0.95, 1.1, 0.75, 14), [0, 0.1, 0]));
  turDark.push(bake(new THREE.BoxGeometry(1.3, 0.5, 0.5), [0, 0.05, -0.9]));
  turDark.push(bake(new THREE.CylinderGeometry(0.32, 0.32, 0.3, 10), [0.4, 0.55, 0.2]));
  turDark.push(bake(new THREE.CylinderGeometry(0.28, 0.28, 0.06, 10), [-0.35, 0.5, 0.1]));
  turDark.push(bake(new THREE.CylinderGeometry(0.11, 0.14, 3.2, 8), [0, 0.02, -2.0], [Math.PI / 2, 0, 0]));
  turDark.push(bake(new THREE.CylinderGeometry(0.17, 0.17, 0.32, 10), [0, 0.02, -3.5], [Math.PI / 2, 0, 0]));
  turDark.push(bake(new THREE.CylinderGeometry(0.02, 0.02, 1.6, 6), [0.7, 0.9, 0.6]));

  TANK_GEO = {
    hull: mergeAndDispose(hull), dark: mergeAndDispose(dark), track: mergeAndDispose(track),
    turHull: mergeAndDispose(turHull), turDark: mergeAndDispose(turDark),
    turY: H * 1.3 + 0.15, barrelTip: [0, 0.02, -3.68],
  };
  return TANK_GEO;
}

let SHIP_GEO = null;
function shipGeometry() {
  if (SHIP_GEO) return SHIP_GEO;
  const L = 8.2, W = 3.2, H = 1.4;
  const hull = [], dark = [], turHull = [], turDark = [];

  hull.push(bake(new THREE.BoxGeometry(W, H, L * 0.55), [0, H / 2, 0]));
  const bow = new THREE.CylinderGeometry(0.05, W * 0.5, L * 0.34, 4);
  hull.push(bake(bow, [0, H / 2, L * 0.44], [Math.PI / 2, Math.PI / 4, 0]));
  hull.push(bake(new THREE.BoxGeometry(W * 0.85, H * 0.9, L * 0.16), [0, H / 2, -L * 0.42]));
  hull.push(bake(new THREE.BoxGeometry(W * 0.55, 1.0, 1.6), [0, H + 0.5, -0.4]));

  dark.push(bake(new THREE.BoxGeometry(W * 0.4, 0.5, 0.9), [0, H + 1.25, -0.4]));
  dark.push(bake(new THREE.CylinderGeometry(0.35, 0.42, 1.6, 12), [0, H + 1.7, -1.6], [0, 0, 0.08]));
  dark.push(bake(new THREE.CylinderGeometry(0.05, 0.05, 2.4, 6), [0, H + 2.4, 0.6]));
  dark.push(bake(new THREE.BoxGeometry(1.6, 0.06, 0.06), [0, H + 3.1, 0.6]));
  for (const sx of [-1, 1]) dark.push(bake(new THREE.BoxGeometry(0.06, 0.35, L * 0.8), [sx * (W / 2 - 0.05), H + 0.18, 0]));

  turHull.push(bake(new THREE.CylinderGeometry(0.7, 0.85, 0.55, 12)));
  turDark.push(bake(new THREE.CylinderGeometry(0.1, 0.12, 2.6, 8), [-0.28, 0.05, -1.6], [Math.PI / 2, 0, 0]));
  turDark.push(bake(new THREE.CylinderGeometry(0.1, 0.12, 2.6, 8), [0.28, 0.05, -1.6], [Math.PI / 2, 0, 0]));

  SHIP_GEO = {
    hull: mergeAndDispose(hull), dark: mergeAndDispose(dark),
    turHull: mergeAndDispose(turHull), turDark: mergeAndDispose(turDark),
    turY: H + 0.3, barrelTip: [0, 0.05, -2.9], wakeAnchor: [0, 0.1, -L / 2],
  };
  return SHIP_GEO;
}

let PLANE_GEO = null;
function planeGeometry() {
  if (PLANE_GEO) return PLANE_GEO;
  const hull = [], dark = [], prop = [];

  const fuselage = new THREE.CapsuleGeometry(0.55, 3.2, 4, 10);
  hull.push(bake(fuselage, [0, 0, 0], [Math.PI / 2, 0, 0]));
  hull.push(bake(new THREE.BoxGeometry(8.6, 0.22, 1.5), [0, 0.15, 0]));
  hull.push(bake(new THREE.BoxGeometry(0.24, 1.3, 1.1), [0, 0.9, 1.9]));
  hull.push(bake(new THREE.BoxGeometry(2.3, 0.14, 0.7), [0, 0.5, 1.85]));

  for (const sx of [-1, 1]) {
    dark.push(bake(new THREE.CylinderGeometry(0.04, 0.04, 0.6, 6), [sx * 1.6, -0.55, 0.3]));
    dark.push(bake(new THREE.CylinderGeometry(0.22, 0.22, 0.18, 10), [sx * 1.6, -0.85, 0.3], [0, 0, Math.PI / 2]));
  }

  for (let i = 0; i < 3; i++) {
    const bl = new THREE.BoxGeometry(0.12, 1.1, 0.03);
    prop.push(bake(bl, [0, 0.55, 0], [0, 0, (i / 3) * Math.PI * 2]));
  }
  prop.push(bake(new THREE.CylinderGeometry(0.14, 0.05, 0.3, 10), [0, 0, -0.12], [Math.PI / 2, 0, 0]));

  PLANE_GEO = {
    hull: mergeAndDispose(hull), dark: mergeAndDispose(dark), prop: mergeAndDispose(prop),
    canopy: new THREE.SphereGeometry(0.45, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55),
    blur: new THREE.CircleGeometry(1.1, 20),
    barrelTip: [0, 0, -2.1],
  };
  return PLANE_GEO;
}

function buildTank(hullM, darkM, isPlayer) {
  const g = tankGeometry();
  const grp = new THREE.Group();
  const trackTexInst = trackTex().clone(); // клон текстуры — своя offset-анимация на юнит
  trackTexInst.wrapS = trackTexInst.wrapT = THREE.RepeatWrapping;
  const trackM = new THREE.MeshStandardMaterial({ map: trackTexInst, color: 0x8c8c8c, roughness: 0.9, metalness: 0.2 });

  const hullMesh = new THREE.Mesh(g.hull, hullM.live);
  const darkMesh = new THREE.Mesh(g.dark, darkM);
  const trackMesh = new THREE.Mesh(g.track, trackM);
  grp.add(hullMesh, darkMesh, trackMesh);

  const tur = new THREE.Group();
  const turHullMesh = new THREE.Mesh(g.turHull, hullM.live);
  const turDarkMesh = new THREE.Mesh(g.turDark, darkM);
  tur.add(turHullMesh, turDarkMesh);
  tur.position.y = g.turY;
  const barrelTip = new THREE.Object3D(); barrelTip.position.set(...g.barrelTip); tur.add(barrelTip);
  grp.add(tur);

  shadowed(grp);
  return {
    grp, tur, barrelTip, trackTex: trackTexInst, kind: 'tank',
    wreckPairs: [
      [hullMesh, hullM.live, hullM.wreck], [turHullMesh, hullM.live, hullM.wreck],
      [darkMesh, darkM, wreckDarkMat()], [turDarkMesh, darkM, wreckDarkMat()], [trackMesh, trackM, wreckDarkMat()],
    ],
    disposeInstance() { trackTexInst.dispose(); trackM.dispose(); },
  };
}

function buildShip(hullM, darkM, isPlayer) {
  const g = shipGeometry();
  const grp = new THREE.Group();
  const hullMesh = new THREE.Mesh(g.hull, hullM.live);
  const darkMesh = new THREE.Mesh(g.dark, darkM);
  grp.add(hullMesh, darkMesh);

  const tur = new THREE.Group();
  const turHullMesh = new THREE.Mesh(g.turHull, hullM.live);
  const turDarkMesh = new THREE.Mesh(g.turDark, darkM);
  tur.add(turHullMesh, turDarkMesh);
  tur.position.set(0, g.turY, 2.3);
  const barrelTip = new THREE.Object3D(); barrelTip.position.set(...g.barrelTip); tur.add(barrelTip);
  grp.add(tur);

  shadowed(grp);
  return {
    grp, tur, barrelTip, kind: 'ship', wakeAnchor: new THREE.Vector3(...g.wakeAnchor),
    wreckPairs: [[hullMesh, hullM.live, hullM.wreck], [turHullMesh, hullM.live, hullM.wreck], [darkMesh, darkM, wreckDarkMat()], [turDarkMesh, darkM, wreckDarkMat()]],
    disposeInstance() {},
  };
}

function buildPlane(hullM, darkM, isPlayer) {
  const g = planeGeometry();
  const grp = new THREE.Group();
  const hullMesh = new THREE.Mesh(g.hull, hullM.live);
  const darkMesh = new THREE.Mesh(g.dark, darkM);
  grp.add(hullMesh, darkMesh);

  const canopyMesh = new THREE.Mesh(g.canopy, glassMat());
  canopyMesh.position.set(0, 0.55, 0.1);
  grp.add(canopyMesh);

  const propHub = new THREE.Group(); propHub.position.set(0, 0, -1.75);
  const propMesh = new THREE.Mesh(g.prop, darkM);
  const blurMat = new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
  const blur = new THREE.Mesh(g.blur, blurMat); blur.position.z = -0.05;
  propHub.add(propMesh, blur);
  grp.add(propHub);

  const barrelTip = new THREE.Object3D(); barrelTip.position.set(...g.barrelTip); grp.add(barrelTip);
  shadowed(grp);
  return {
    grp, tur: grp, barrelTip, propHub, blades: propMesh, blur, kind: 'plane',
    wreckPairs: [[hullMesh, hullM.live, hullM.wreck], [darkMesh, darkM, wreckDarkMat()], [propMesh, darkM, wreckDarkMat()], [canopyMesh, glassMat(), wreckGlassMat()]],
    disposeInstance() { blurMat.dispose(); },
  };
}

export function buildVehicle(spec, { isPlayer = false } = {}) {
  const hullM = hullMats(spec.id, isPlayer);
  const darkM = darkMat();
  let unit3d;
  if (spec.type === 'ship') unit3d = buildShip(hullM, darkM, isPlayer);
  else if (spec.type === 'plane') unit3d = buildPlane(hullM, darkM, isPlayer);
  else unit3d = buildTank(hullM, darkM, isPlayer);
  unit3d.grp.userData.traveled = 0;
  return unit3d;
}

// Освобождает то немногое, что действительно принадлежит только этому экземпляру
// (клон текстуры гусениц, материал блюра пропеллера). Общая геометрия/камуфляж/
// dark-материал — кэш на всю сессию, их не трогаем.
export function disposeVehicle(unit3d) { unit3d.disposeInstance?.(); }

export function animateVehicle(unit3d, dt, speed2d) {
  unit3d.grp.userData.traveled += speed2d * dt;
  const t = unit3d.grp.userData.traveled;
  if (unit3d.kind === 'tank' && unit3d.trackTex) {
    unit3d.trackTex.offset.y = -t * 0.35;
  } else if (unit3d.kind === 'plane') {
    const spin = 18 + speed2d * 1.2;
    unit3d.propHub.rotation.z += spin * dt;
    const blurT = THREE.MathUtils.clamp((speed2d - 2) / 10, 0, 1);
    unit3d.blades.visible = blurT < 0.85;
    unit3d.blur.material.opacity = blurT * 0.55;
  }
}

// ---------- обломки: перекраска ссылками на материалы, без клонирования на смерть ----------
export const WRECK_HOLD = 8;
export function markWreck(unit3d) {
  for (const [mesh, , wreck] of unit3d.wreckPairs) mesh.material = wreck;
  if (unit3d.kind === 'plane') { unit3d.blur.material.opacity = 0; unit3d.blades.visible = true; }
  const { SMOKE_TEX } = texCache();
  const smoke = new THREE.Sprite(new THREE.SpriteMaterial({ map: SMOKE_TEX, color: 0x222222, transparent: true, opacity: 0.55, depthWrite: false }));
  smoke.position.set(0, 2.2, 0); smoke.scale.setScalar(2.2);
  unit3d.grp.add(smoke);
  let t = 0, life = WRECK_HOLD;
  return {
    step(dt) { t += dt; life -= dt; smoke.position.y += dt * 0.5; smoke.material.opacity = Math.max(0, (0.5 + Math.sin(t * 2) * 0.1) * Math.min(1, life)); return life > 0; },
    dispose() { unit3d.grp.remove(smoke); smoke.material.dispose(); },
  };
}
export function unwreck(unit3d) {
  for (const [mesh, live] of unit3d.wreckPairs) mesh.material = live;
}

// ---------- эффекты: пулы вместо аллокаций на каждый выстрел/взрыв ----------
const scenePools = new WeakMap();
// Эффект-заглушка: сцена не поднялась (упал boot3D) — не роняем игру на каждый
// выстрел, просто молча пропускаем визуал. Игра при этом уже показала ERR 3D.
const NULL_FX = { step() { return false; }, dispose() {} };
function poolsFor(scene) {
  if (!scene || (typeof scene !== 'object' && typeof scene !== 'function')) {
    if (!poolsFor.warned) { poolsFor.warned = true; console.warn('[tanks] effects: нет сцены — эффекты пропущены'); }
    return null;
  }
  let p = scenePools.get(scene);
  if (!p) {
    p = { tracers: [], flashes: [], sparks: [], booms: [], muzzleLight: null, boomLight: null };
    scenePools.set(scene, p);
  }
  return p;
}
function acquire(list, max, factory) {
  for (const it of list) if (!it.active) { it.active = true; return it; }
  if (list.length < max) { const it = factory(); it.active = true; list.push(it); return it; }
  // предел исчерпан — молча переиспользуем самый старый активный
  const it = list[0]; it.active = true; return it;
}

export function spawnMuzzleFlash(scene, pos, dir) {
  const { SPARK_TEX } = texCache();
  const pools = poolsFor(scene);
  if (!pools) return NULL_FX;
  if (!pools.muzzleLight) { pools.muzzleLight = new THREE.PointLight(0xffaa33, 0, 22); scene.add(pools.muzzleLight); }
  const it = acquire(pools.flashes, 16, () => {
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: SPARK_TEX, color: 0xffcc66, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    scene.add(spr);
    return { spr, active: false };
  });
  it.spr.visible = true;
  it.spr.position.copy(pos).addScaledVector(dir, 0.4);
  it.spr.scale.setScalar(1.6);
  it.life = 0.09;
  const light = pools.muzzleLight;
  light.position.copy(pos);
  light.intensity = 22;
  return {
    step(dt) {
      it.life -= dt;
      it.spr.material.opacity = Math.max(0, it.life / 0.09);
      light.intensity = Math.max(light.intensity - dt * 22 / 0.09, 0);
      return it.life > 0;
    },
    dispose() { it.active = false; it.spr.visible = false; },
  };
}

export function spawnTracer(scene, from, to) {
  const pools = poolsFor(scene);
  if (!pools) return NULL_FX;
  const dir = new THREE.Vector3().subVectors(to, from);
  const len = Math.max(0.01, dir.length());
  const it = acquire(pools.tracers, 24, () => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1, 6, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xfff0a0, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
    scene.add(mesh);
    return { mesh, active: false };
  });
  it.mesh.visible = true;
  it.mesh.scale.set(1, len, 1);
  it.mesh.position.copy(from).addScaledVector(dir, 0.5);
  it.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  it.life = 0.14;
  return {
    step(dt) { it.life -= dt; it.mesh.material.opacity = Math.max(0, it.life * 7); return it.life > 0; },
    dispose() { it.active = false; it.mesh.visible = false; },
  };
}

export function spawnHitSpark(scene, pos) {
  const { SPARK_TEX } = texCache();
  const pools = poolsFor(scene);
  if (!pools) return NULL_FX;
  const n = 8;
  const it = acquire(pools.sparks, 12, () => {
    const positions = new Float32Array(n * 3);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ map: SPARK_TEX, size: 0.6, color: 0xffcc55, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }));
    scene.add(pts);
    return { pts, geo, vel: Array.from({ length: n }, () => new THREE.Vector3()), active: false };
  });
  it.pts.visible = true;
  const arr = it.geo.attributes.position.array;
  for (let i = 0; i < n; i++) {
    arr[i * 3] = pos.x; arr[i * 3 + 1] = pos.y; arr[i * 3 + 2] = pos.z;
    const a = Math.random() * Math.PI * 2, s = 3 + Math.random() * 4;
    it.vel[i].set(Math.cos(a) * s, 2 + Math.random() * 3, Math.sin(a) * s);
  }
  it.geo.attributes.position.needsUpdate = true;
  it.life = 0.5;
  return {
    step(dt) {
      it.life -= dt;
      const arr = it.geo.attributes.position.array;
      for (let i = 0; i < n; i++) {
        arr[i * 3] += it.vel[i].x * dt; arr[i * 3 + 1] += it.vel[i].y * dt; arr[i * 3 + 2] += it.vel[i].z * dt;
        it.vel[i].y -= 9 * dt;
      }
      it.geo.attributes.position.needsUpdate = true;
      it.pts.material.opacity = Math.max(0, it.life * 2);
      return it.life > 0;
    },
    dispose() { it.active = false; it.pts.visible = false; },
  };
}

export function spawnExplosion(scene, pos) {
  const { SMOKE_TEX } = texCache();
  const pools = poolsFor(scene);
  if (!pools) return NULL_FX;
  if (!pools.boomLight) { pools.boomLight = new THREE.PointLight(0xff5522, 0, 40); scene.add(pools.boomLight); }
  const it = acquire(pools.booms, 10, () => {
    const fireball = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 12), new THREE.MeshBasicMaterial({ color: 0xff6622, transparent: true, opacity: 0.95 }));
    const smoke = new THREE.Sprite(new THREE.SpriteMaterial({ map: SMOKE_TEX, color: 0x333333, transparent: true, opacity: 0.8, depthWrite: false }));
    scene.add(fireball, smoke);
    return { fireball, smoke, active: false };
  });
  it.fireball.visible = it.smoke.visible = true;
  it.fireball.position.copy(pos);
  it.fireball.scale.setScalar(1);
  it.fireball.material.opacity = 0.95;
  it.smoke.position.copy(pos).add(new THREE.Vector3(0, 0.5, 0));
  it.smoke.scale.setScalar(2);
  it.smoke.material.opacity = 0.8;
  it.life = 1.1; it.t = 0;
  const light = pools.boomLight;
  light.position.copy(pos);
  light.intensity = 55;
  return {
    step(dt) {
      it.t += dt; it.life -= dt;
      it.fireball.scale.setScalar(1 + it.t * 3.2);
      it.fireball.material.opacity = Math.max(0, it.life * 0.9);
      light.intensity = Math.max(0, it.life * 50);
      it.smoke.position.y += dt * 1.4;
      it.smoke.scale.addScalar(dt * 3);
      it.smoke.material.opacity = Math.max(0, it.life * 0.6);
      return it.life > 0;
    },
    dispose() { it.active = false; it.fireball.visible = it.smoke.visible = false; },
  };
}

export function spawnDust(scene, pos) {
  const { SMOKE_TEX } = texCache();
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: SMOKE_TEX, color: 0x9a8a68, transparent: true, opacity: 0.35, depthWrite: false }));
  spr.position.copy(pos); spr.scale.setScalar(0.8 + Math.random() * 0.6);
  scene.add(spr);
  let life = 0.7;
  return {
    step(dt) { life -= dt; spr.position.y += dt * 0.4; spr.scale.addScalar(dt * 1.2); spr.material.opacity = Math.max(0, life * 0.5); return life > 0; },
    dispose() { scene.remove(spr); spr.material.dispose(); },
  };
}
