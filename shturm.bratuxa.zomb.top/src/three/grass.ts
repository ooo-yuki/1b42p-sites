import * as THREE from 'three';
import { MAPS, type MapId } from '../sim/maps';

export const GRASS_HIGH = 22000;
export const GRASS_LOW = 7000;
export const GRASS_HIGH_NEON = 12000;
export const GRASS_LOW_NEON = 4000;

const GRASS_TINT: Record<MapId, [number, number]> = {
  yard: [0x4a7a33, 0x6a9a3f], island: [0x7a8a3f, 0xa8a052], neon: [0x1d3a2a, 0x2a6a4a],
};

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function bladeTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 128;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, 128, 128);
  // Градиент — опционально: в headless-стабе canvas (bun test) его нет, красим плоским.
  const g = (ctx as unknown as { createLinearGradient?: (...a: number[]) => CanvasGradient }).createLinearGradient?.(0, 128, 0, 0);
  if (g) {
    g.addColorStop(0, '#3d5c22'); g.addColorStop(1, '#8fbf4d');
    ctx.strokeStyle = g;
  } else {
    ctx.strokeStyle = '#5c7a30';
  }
  ctx.lineWidth = 5; ctx.lineCap = 'round';
  for (let i = 0; i < 9; i++) {
    const x = 8 + i * 13 + Math.random() * 5;
    ctx.beginPath(); ctx.moveTo(x, 128);
    ctx.quadraticCurveTo(x + (Math.random() * 16 - 8), 64, x + (Math.random() * 24 - 12), 8 + Math.random() * 20);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export interface GrassRig { mesh: THREE.InstancedMesh; setLow(low: boolean): void; tick(dt: number): void; dispose(): void; }

export function buildGrass(map: MapId, seed: number): GrassRig {
  const def = MAPS[map];
  const high = map === 'neon' ? GRASS_HIGH_NEON : GRASS_HIGH;
  const low = map === 'neon' ? GRASS_LOW_NEON : GRASS_LOW;
  // Куст: 2 скрещенных квада.
  const quad = new THREE.PlaneGeometry(0.9, 0.55);
  quad.translate(0, 0.275, 0);
  const quad2 = quad.clone();
  quad2.rotateY(Math.PI / 2);
  const geo = mergeTwo(quad, quad2);
  const mat = new THREE.MeshLambertMaterial({ map: bladeTexture(), alphaTest: 0.45, side: THREE.DoubleSide });
  const [c1, c2] = GRASS_TINT[map];
  mat.color.set(c1).lerp(new THREE.Color(c2), 0.5);
  if (map === 'neon') { mat.emissive.set(0x0a2a1a); mat.emissiveIntensity = 0.4; }
  const uTime = { value: 0 };
  // Аннотация типа — strict требует явного типа параметра (в брифе опущен).
  mat.onBeforeCompile = (sh: THREE.WebGLProgramParametersWithUniforms) => {
    sh.uniforms.uTime = uTime;
    sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
      float swayH = pow(clamp(position.y / 0.55, 0.0, 1.0), 2.0);
      vec4 iwpos = instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0);
      transformed.x += swayH * (0.12 * sin(uTime * 1.6 + iwpos.x * 0.5 + iwpos.z * 0.3) + 0.05 * sin(uTime * 3.7 + iwpos.z * 0.8));`);
  };
  mat.customProgramCacheKey = () => 'shturm-grass-wind';
  const mesh = new THREE.InstancedMesh(geo, mat, high);
  mesh.frustumCulled = false;
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  const rng = mulberry32(seed);
  const dummy = new THREE.Object3D();
  const order: number[] = [];
  let placed = 0;
  let guard = 0;
  while (placed < high && guard++ < high * 30) {
    const x = (rng() - 0.5) * (def.size - 2);
    const z = (rng() - 0.5) * (def.size - 2);
    if (def.obstacles.some((o) => Math.hypot(x - o.x, z - o.z) < o.r + 2)) continue;
    if (def.spawns.some((s) => Math.hypot(x - s.x, z - s.z) < 3)) continue;
    if (map === 'yard' && Math.hypot(x - 10, z + 2) < 5) continue; // пруд Task 4
    dummy.position.set(x, 0, z);
    dummy.rotation.y = rng() * Math.PI;
    const s = 0.7 + rng() * 0.7;
    dummy.scale.set(s, s * (0.8 + rng() * 0.5), s);
    dummy.updateMatrix();
    mesh.setMatrixAt(placed, dummy.matrix);
    order.push(placed);
    placed++;
  }
  // Перемешать: setLow срезает равномерно по всей карте.
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const a = order[i]; order[i] = order[j]; order[j] = a;
    const ma = new THREE.Matrix4(); const mb = new THREE.Matrix4();
    mesh.getMatrixAt(a, ma); mesh.getMatrixAt(order[i], mb);
    mesh.setMatrixAt(a, mb); mesh.setMatrixAt(order[i], ma);
  }
  mesh.instanceMatrix.needsUpdate = true;
  return {
    mesh,
    setLow: (l: boolean) => { mesh.count = l ? low : high; },
    tick: (dt: number) => { uTime.value += dt; },
    // Старый риг снимается со сцены в startGame — без dispose утекает GPU-память.
    dispose: () => {
      mesh.dispose(); // InstancedMesh: шлёт dispose-ивент, освобождает instanceMatrix/instanceColor GL-буферы.
      mesh.geometry.dispose();
      const m = mesh.material as THREE.MeshLambertMaterial;
      if (m.map) m.map.dispose();
      m.dispose();
    },
  };
}

function mergeTwo(a: THREE.BufferGeometry, b: THREE.BufferGeometry): THREE.BufferGeometry {
  // Склейка двух квадов без новой зависимости: ручной merge позиций/нормалей/uv/индексов.
  const geos = [a, b];
  let vCount = 0; let iCount = 0;
  for (const g of geos) { vCount += g.attributes.position.count; iCount += g.index!.count; }
  const pos = new Float32Array(vCount * 3); const nor = new Float32Array(vCount * 3);
  const uv = new Float32Array(vCount * 2); const idx = new Uint16Array(iCount);
  let vo = 0; let io = 0;
  for (const g of geos) {
    pos.set(g.attributes.position.array as Float32Array, vo * 3);
    nor.set(g.attributes.normal.array as Float32Array, vo * 3);
    uv.set(g.attributes.uv.array as Float32Array, vo * 2);
    const gi = g.index!.array as Uint16Array;
    for (let i = 0; i < gi.length; i++) idx[io + i] = gi[i] + vo;
    vo += g.attributes.position.count; io += gi.length;
    g.dispose();
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  out.setIndex(new THREE.BufferAttribute(idx, 1));
  return out;
}
