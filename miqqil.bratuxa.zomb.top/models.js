// MIQQIL TANKS — три.js визуал: сцена, свет, техника, эффекты. Никакой игровой логики тут нет.
// Импортирует только 'three' (+examples/jsm/objects/Sky) через importmap. Стиль 42: Мы уже победили 🏆
import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';

// ---------- утилиты геометрии ----------
function box(w, h, d, mat) { return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); }
function cyl(r1, r2, h, mat, seg = 12) { return new THREE.Mesh(new THREE.CylinderGeometry(r1, r2, h, seg), mat); }
function shadowed(o) { o.traverse(m => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; }

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
export function buildRenderer(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = 'game';
  container.appendChild(renderer.domElement);
  return renderer;
}

export function buildScene(renderer, arenaSize) {
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
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
  const S = Math.max(90, arenaSize * 0.28);
  Object.assign(sun.shadow.camera, { left: -S, right: S, top: S, bottom: -S, near: 10, far: 320 });
  scene.add(sun);
  scene.add(sun.target);

  return { scene, camera, sun };
}

export function buildArena(scene, arena) {
  const group = new THREE.Group();
  scene.add(group);
  const disposables = [];
  const gtex = groundTexture();
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(arena.size, arena.size, 1, 1),
    new THREE.MeshStandardMaterial({ map: gtex, roughness: 1, metalness: 0 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true;
  group.add(ground);

  const blockMat = new THREE.MeshStandardMaterial({ color: 0x5a6068, roughness: 0.92, metalness: 0.05 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xf5c518, roughness: 0.35, metalness: 0.7 });
  for (const o of arena.obstacles) {
    const m = box(o.w, o.h, o.d, o.gold ? goldMat : blockMat);
    m.position.set(o.x, o.h / 2, o.z);
    m.rotation.y = o.rotY;
    shadowed(m);
    group.add(m);
  }

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
  function instanced(geo, mat, items, yOff, extraScale = 1) {
    if (!items.length) return;
    const im = new THREE.InstancedMesh(geo, mat, items.length);
    im.castShadow = im.receiveShadow = true;
    items.forEach((d, i) => {
      dummy.position.set(d.x, yOff * d.scale, d.z);
      dummy.rotation.set(0, d.rot, 0);
      dummy.scale.setScalar(d.scale * extraScale);
      dummy.updateMatrix();
      im.setMatrixAt(i, dummy.matrix);
    });
    group.add(im);
    return im;
  }
  instanced(rockGeo, rockMat, byKind.rock, 0.5);
  instanced(bushGeo, bushMat, byKind.bush, 0.6);
  if (byKind.tree.length) {
    const trunks = new THREE.InstancedMesh(treeTrunkGeo, treeTrunkMat, byKind.tree.length);
    const tops = new THREE.InstancedMesh(treeTopGeo, treeTopMat, byKind.tree.length);
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
      group.traverse(o => { if (o.isMesh || o.isInstancedMesh) { o.geometry.dispose(); if (Array.isArray(o.material)) o.material.forEach(m => m.dispose()); else o.material.dispose(); } });
      wallGeo.dispose(); wallMat.dispose();
    },
  };
}

// ---------- техника ----------
const CAMO = {
  t42: [0x4a7c3a, 0x2f5227], pyat: [0x5a4a3a, 0x3a2f22], vihr: [0x3a6a8a, 0x25455c],
  avrora: [0x6a3a5a, 0x452439], yastreb: [0x8a8a9a, 0x5c5c68], player: [0xc79a12, 0x8a6a10],
};
let TRACK_TEX = null;
function trackTex() { if (!TRACK_TEX) TRACK_TEX = trackTexture(); return TRACK_TEX; }

function darkMat() { return new THREE.MeshStandardMaterial({ color: 0x1c1f26, roughness: 0.75, metalness: 0.4 }); }
function glassMat() { return new THREE.MeshPhysicalMaterial({ color: 0x9fd0e8, roughness: 0.05, metalness: 0, transmission: 0.7, transparent: true, opacity: 0.55 }); }

function buildTank(spec, hullMat, isPlayer) {
  const grp = new THREE.Group();
  const dark = darkMat();
  const W = 2.9, L = 4.6, H = 1.0;
  // корпус: нижняя ванна + скошенный лобовой лист + верхняя палуба
  const lower = box(W, H * 0.7, L, hullMat); lower.position.y = H * 0.35;
  const glacis = box(W * 0.96, H * 0.9, 1.3, hullMat);
  glacis.position.set(0, H * 0.75, L / 2 - 0.55); glacis.rotation.x = -0.55;
  const deck = box(W * 0.9, H * 0.5, L * 0.55, hullMat); deck.position.set(0, H * 1.05, -0.3);
  const skirtL = box(0.15, 0.7, L * 0.85, dark); skirtL.position.set(-W / 2 - 0.05, 0.55, 0);
  const skirtR = skirtL.clone(); skirtR.position.x = W / 2 + 0.05;
  grp.add(lower, glacis, deck, skirtL, skirtR);

  // гусеницы
  const trackMat = new THREE.MeshStandardMaterial({ map: trackTex(), color: 0x8c8c8c, roughness: 0.9, metalness: 0.2 });
  const tracks = [];
  for (const sx of [-1, 1]) {
    const belt = box(0.5, 0.85, L + 0.4, trackMat);
    belt.position.set(sx * (W / 2 + 0.32), 0.5, 0);
    grp.add(belt); tracks.push(belt.material.map);
    const nWheels = 5;
    for (let i = 0; i < nWheels; i++) {
      const wh = cyl(0.42, 0.42, 0.42, dark, 14);
      wh.rotation.z = Math.PI / 2;
      wh.position.set(sx * (W / 2 + 0.32), 0.5, -L / 2 + 0.5 + (L - 1) * (i / (nWheels - 1)));
      grp.add(wh);
    }
    const sprocketF = cyl(0.5, 0.5, 0.46, dark, 16); sprocketF.rotation.z = Math.PI / 2;
    sprocketF.position.set(sx * (W / 2 + 0.32), 0.55, L / 2 + 0.1); grp.add(sprocketF);
  }

  // башня
  const tur = new THREE.Group();
  const dome = cyl(0.95, 1.1, 0.75, hullMat, 14); dome.position.y = 0.1;
  const mantlet = box(1.3, 0.5, 0.5, dark); mantlet.position.set(0, 0.05, -0.9);
  const cupola = cyl(0.32, 0.32, 0.3, dark, 10); cupola.position.set(0.4, 0.55, 0.2);
  const hatch = cyl(0.28, 0.28, 0.06, dark, 10); hatch.position.set(-0.35, 0.5, 0.1);
  const barrel = cyl(0.11, 0.14, 3.2, dark, 8); barrel.rotation.x = Math.PI / 2; barrel.position.set(0, 0.02, -2.0);
  const brake = cyl(0.17, 0.17, 0.32, dark, 10); brake.rotation.x = Math.PI / 2; brake.position.set(0, 0.02, -3.5);
  const antenna = cyl(0.02, 0.02, 1.6, dark, 6); antenna.position.set(0.7, 0.9, 0.6);
  tur.add(dome, mantlet, cupola, hatch, barrel, brake, antenna);
  tur.position.y = H * 1.3 + 0.15;
  grp.add(tur);

  // ЗИП-ящик и трос сзади
  const box1 = box(0.9, 0.28, 0.4, dark); box1.position.set(0.7, H * 1.05, -L / 2 + 0.35);
  const drum = cyl(0.22, 0.22, 0.5, dark, 10); drum.rotation.z = Math.PI / 2; drum.position.set(-0.7, H * 1.05, -L / 2 + 0.35);
  grp.add(box1, drum);

  const barrelTip = new THREE.Object3D(); barrelTip.position.set(0, 0.02, -3.68); tur.add(barrelTip);
  shadowed(grp);
  return { grp, tur, barrelTip, trackMaps: tracks, wheelSpin: 0, kind: 'tank' };
}

function buildShip(spec, hullMat, isPlayer) {
  const grp = new THREE.Group();
  const dark = darkMat();
  const L = 8.2, W = 3.2, H = 1.4;
  const mid = box(W, H, L * 0.55, hullMat); mid.position.y = H / 2;
  const bow = cyl(0.05, W * 0.5, L * 0.34, hullMat, 4); // низкополигональный конус как заострённый нос
  bow.rotation.x = Math.PI / 2; bow.rotation.y = Math.PI / 4;
  bow.position.set(0, H / 2, L * 0.44);
  const stern = box(W * 0.85, H * 0.9, L * 0.16, hullMat); stern.position.set(0, H / 2, -L * 0.42);
  grp.add(mid, bow, stern);

  const deckHouse = box(W * 0.55, 1.0, 1.6, hullMat); deckHouse.position.set(0, H + 0.5, -0.4);
  const bridge = box(W * 0.4, 0.5, 0.9, dark); bridge.position.set(0, H + 1.25, -0.4);
  const funnel = cyl(0.35, 0.42, 1.6, dark, 12); funnel.position.set(0, H + 1.7, -1.6); funnel.rotation.z = 0.08;
  const mast = cyl(0.05, 0.05, 2.4, dark, 6); mast.position.set(0, H + 2.4, 0.6);
  const yard = box(1.6, 0.06, 0.06, dark); yard.position.set(0, H + 3.1, 0.6);
  grp.add(deckHouse, bridge, funnel, mast, yard);

  for (const sx of [-1, 1]) {
    const rail = box(0.06, 0.35, L * 0.8, dark);
    rail.position.set(sx * (W / 2 - 0.05), H + 0.18, 0);
    grp.add(rail);
  }

  const tur = new THREE.Group();
  const turBase = cyl(0.7, 0.85, 0.55, hullMat, 12);
  const b1 = cyl(0.1, 0.12, 2.6, dark, 8); b1.rotation.x = Math.PI / 2; b1.position.set(-0.28, 0.05, -1.6);
  const b2 = b1.clone(); b2.position.x = 0.28;
  tur.add(turBase, b1, b2);
  tur.position.set(0, H + 0.3, 2.3);
  grp.add(tur);

  const barrelTip = new THREE.Object3D(); barrelTip.position.set(0, 0.05, -2.9); tur.add(barrelTip);
  shadowed(grp);
  return { grp, tur, barrelTip, wakeAnchor: new THREE.Vector3(0, 0.1, -L / 2), kind: 'ship' };
}

function buildPlane(spec, hullMat, isPlayer) {
  const grp = new THREE.Group();
  const dark = darkMat();
  const fuselage = new THREE.Mesh(new THREE.CapsuleGeometry(0.55, 3.2, 4, 10), hullMat);
  fuselage.rotation.x = Math.PI / 2;
  grp.add(fuselage);

  const wing = box(8.6, 0.22, 1.5, hullMat);
  wing.position.y = 0.15; grp.add(wing);
  const finV = box(0.24, 1.3, 1.1, hullMat); finV.position.set(0, 0.9, 1.9); grp.add(finV);
  const stab = box(2.3, 0.14, 0.7, hullMat); stab.position.set(0, 0.5, 1.85); grp.add(stab);

  const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), glassMat());
  canopy.position.set(0, 0.55, 0.1); grp.add(canopy);

  const gearMat = dark;
  for (const sx of [-1, 1]) {
    const strut = cyl(0.04, 0.04, 0.6, gearMat, 6); strut.position.set(sx * 1.6, -0.55, 0.3); grp.add(strut);
    const wheel = cyl(0.22, 0.22, 0.18, gearMat, 10); wheel.rotation.z = Math.PI / 2; wheel.position.set(sx * 1.6, -0.85, 0.3); grp.add(wheel);
  }

  const propHub = new THREE.Group(); propHub.position.set(0, 0, -1.75);
  const blades = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const bl = box(0.12, 1.1, 0.03, dark); bl.position.y = 0.55; bl.rotation.z = (i / 3) * Math.PI * 2;
    blades.add(bl);
  }
  const spinner = cyl(0.14, 0.05, 0.3, dark, 10); spinner.rotation.x = Math.PI / 2; spinner.position.z = -0.12;
  propHub.add(blades, spinner);
  const blurGeo = new THREE.CircleGeometry(1.1, 20);
  const blurMat = new THREE.MeshBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false });
  const blur = new THREE.Mesh(blurGeo, blurMat); blur.position.z = -0.05; propHub.add(blur);
  grp.add(propHub);

  const barrelTip = new THREE.Object3D(); barrelTip.position.set(0, 0, -2.1); grp.add(barrelTip);
  shadowed(grp);
  return { grp, tur: grp, barrelTip, propHub, blades, blur, kind: 'plane' };
}

export function buildVehicle(spec, { isPlayer = false } = {}) {
  const [baseHex, accHex] = isPlayer ? CAMO.player : (CAMO[spec.id] || [0x666666, 0x444444]);
  const tex = camoTexture(baseHex, accHex); tex.repeat.set(2, 2);
  const hullMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.55, metalness: isPlayer ? 0.55 : 0.35, envMapIntensity: 1.1 });
  let unit3d;
  if (spec.type === 'ship') unit3d = buildShip(spec, hullMat, isPlayer);
  else if (spec.type === 'plane') unit3d = buildPlane(spec, hullMat, isPlayer);
  else unit3d = buildTank(spec, hullMat, isPlayer);
  unit3d.grp.userData.traveled = 0;
  return unit3d;
}

export function animateVehicle(unit3d, dt, speed2d) {
  unit3d.grp.userData.traveled += speed2d * dt;
  const t = unit3d.grp.userData.traveled;
  if (unit3d.kind === 'tank' && unit3d.trackMaps) {
    for (const m of unit3d.trackMaps) if (m) m.offset.y = -t * 0.35;
  } else if (unit3d.kind === 'plane') {
    const spin = 18 + speed2d * 1.2;
    unit3d.propHub.rotation.z += spin * dt;
    const blurT = THREE.MathUtils.clamp((speed2d - 2) / 10, 0, 1);
    unit3d.blades.visible = blurT < 0.85;
    unit3d.blur.material.opacity = blurT * 0.55;
  }
}

// ---------- эффекты ----------
export function spawnMuzzleFlash(scene, pos, dir) {
  const { SPARK_TEX } = texCache();
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: SPARK_TEX, color: 0xffcc66, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  spr.position.copy(pos).addScaledVector(dir, 0.4);
  spr.scale.setScalar(1.6);
  scene.add(spr);
  const light = new THREE.PointLight(0xffaa33, 22, 22);
  light.position.copy(pos);
  scene.add(light);
  let life = 0.09;
  return {
    step(dt) { life -= dt; spr.material.opacity = Math.max(0, life / 0.09); light.intensity = Math.max(0, life / 0.09) * 22; return life > 0; },
    dispose() { scene.remove(spr, light); spr.material.dispose(); },
  };
}

export function spawnTracer(scene, from, to) {
  const dir = new THREE.Vector3().subVectors(to, from);
  const len = Math.max(0.01, dir.length());
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, len, 6, 1, true),
    new THREE.MeshBasicMaterial({ color: 0xfff0a0, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
  mesh.position.copy(from).addScaledVector(dir, 0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
  scene.add(mesh);
  let life = 0.14;
  return {
    step(dt) { life -= dt; mesh.material.opacity = Math.max(0, life * 7); return life > 0; },
    dispose() { scene.remove(mesh); mesh.geometry.dispose(); mesh.material.dispose(); },
  };
}

export function spawnHitSpark(scene, pos) {
  const { SPARK_TEX } = texCache();
  const n = 8;
  const positions = new Float32Array(n * 3);
  const vel = [];
  for (let i = 0; i < n; i++) {
    positions[i * 3] = pos.x; positions[i * 3 + 1] = pos.y; positions[i * 3 + 2] = pos.z;
    const a = Math.random() * Math.PI * 2, s = 3 + Math.random() * 4;
    vel.push(new THREE.Vector3(Math.cos(a) * s, 2 + Math.random() * 3, Math.sin(a) * s));
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ map: SPARK_TEX, size: 0.6, color: 0xffcc55, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true }));
  scene.add(pts);
  let life = 0.5;
  return {
    step(dt) {
      life -= dt;
      const arr = geo.attributes.position.array;
      for (let i = 0; i < n; i++) {
        arr[i * 3] += vel[i].x * dt; arr[i * 3 + 1] += vel[i].y * dt; arr[i * 3 + 2] += vel[i].z * dt;
        vel[i].y -= 9 * dt;
      }
      geo.attributes.position.needsUpdate = true;
      pts.material.opacity = Math.max(0, life * 2);
      return life > 0;
    },
    dispose() { scene.remove(pts); geo.dispose(); pts.material.dispose(); },
  };
}

export function spawnExplosion(scene, pos) {
  const { SMOKE_TEX } = texCache();
  const fireball = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 12),
    new THREE.MeshBasicMaterial({ color: 0xff6622, transparent: true, opacity: 0.95 }));
  fireball.position.copy(pos);
  const light = new THREE.PointLight(0xff5522, 55, 40);
  light.position.copy(pos);
  const smoke = new THREE.Sprite(new THREE.SpriteMaterial({ map: SMOKE_TEX, color: 0x333333, transparent: true, opacity: 0.8, depthWrite: false }));
  smoke.position.copy(pos).add(new THREE.Vector3(0, 0.5, 0));
  smoke.scale.setScalar(2);
  scene.add(fireball, light, smoke);
  let life = 1.1, t = 0;
  return {
    step(dt) {
      t += dt; life -= dt;
      fireball.scale.setScalar(1 + t * 3.2);
      fireball.material.opacity = Math.max(0, life * 0.9);
      light.intensity = Math.max(0, life * 50);
      smoke.position.y += dt * 1.4;
      smoke.scale.addScalar(dt * 3);
      smoke.material.opacity = Math.max(0, life * 0.6);
      return life > 0;
    },
    dispose() { scene.remove(fireball, light, smoke); fireball.geometry.dispose(); fireball.material.dispose(); smoke.material.dispose(); },
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

export function markWreck(unit3d) {
  unit3d.grp.traverse(o => {
    if (o.isMesh && o.material && o.material.color) {
      o.material = o.material.clone();
      o.material.color.multiplyScalar(0.28);
      o.material.roughness = 1; o.material.metalness = 0;
    }
  });
  const { SMOKE_TEX } = texCache();
  const smoke = new THREE.Sprite(new THREE.SpriteMaterial({ map: SMOKE_TEX, color: 0x222222, transparent: true, opacity: 0.55, depthWrite: false }));
  smoke.position.set(0, 2.2, 0); smoke.scale.setScalar(2.2);
  unit3d.grp.add(smoke);
  let t = 0, life = 14;
  return {
    step(dt) { t += dt; life -= dt; smoke.position.y += dt * 0.5; smoke.material.opacity = Math.max(0, (0.5 + Math.sin(t * 2) * 0.1) * Math.min(1, life)); return life > 0; },
    dispose() { unit3d.grp.remove(smoke); smoke.material.dispose(); },
  };
}
