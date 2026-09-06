# Графика AAA ШТУРМ-43 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Небо с солнцем и облаками, инстансинг-трава с ветром, процедурный грунт/камень, свет на карту, пруд — 60 FPS.

**Architecture:** Два новых focused-модуля (`three/sky.ts`, `three/grass.ts`) + расширение painters в `three/textures.ts` и визуала в `three/mapsVisual.ts`; проводка только через существующие `applyMapMood`/`step`/`lowDetail` в `main.tsx`. TDD там, где сим/цифры; визуал — юнит-asserts на структуру + eyeball-скрины.

**Tech Stack:** TypeScript, three.js (InstancedMesh, onBeforeCompile, ShaderMaterial), bun:test, vite.

**Spec:** `docs/superpowers/specs/2026-09-06-shturm-graphics-design.md`

## Global Constraints

- `bun test` зелёный до и после каждого таска.
- `bun run typecheck` чистый перед коммитом.
- `dist/` коммитится (бандл запечён в docker-образ `shturm-43:latest`).
- Коммиты: префикс `shturm:`, одна строка, эмодзи в конце.
- Комменты и UI-тексты по-русски; эмодзи только в тексте.
- В `git add` только свои пути, никогда bare `git add -A`.
- Чужие пути/процессы не трогать; браузерные пробы — флаги `--use-gl=angle --use-angle=swiftshader --in-process-gpu`, стенд `python3 -m http.server 8901`.
- Хуки `window.__shturm` безвредны и остаются в проде.
- Перф-рамки: трава ≤2 draw calls/карта, тени от травы ВЫКЛ, bloom только neon.

---

### Task 1: Небо, солнце, облака + настроение

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/three/sky.ts`
- Modify: `shturm.bratuxa.zomb.top/src/main.tsx` (создать `skyRig` раз при boot рядом с `initScene`; `applyMapMood` — параметры купола + `exposure` + `sun.position/color` из mood; `step` — `skyRig.tick(dt)`)
- Test: `shturm.bratuxa.zomb.top/tests/sky.test.ts`

**Interfaces:**
- Consumes: `MapId` из `src/sim/maps.ts`.
- Produces: `SKY_MOODS: Record<MapId, SkyMood>`, `makeSky(): SkyRig { mesh, mat, setMood(m), tick(dt) }` (импортирует Task 5 косвенно через `main.tsx`).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from 'bun:test';
import { makeSky, SKY_MOODS } from '../src/three/sky';
describe('небо', () => {
  test('муд на 3 карты', () => {
    expect(Object.keys(SKY_MOODS).sort()).toEqual(['island', 'neon', 'yard']);
    expect(SKY_MOODS.neon.exposure).toBeCloseTo(0.95, 6);
  });
  test('купол BackSide + юниформы ставятся', () => {
    const sky = makeSky();
    expect((sky.mesh.material as THREE.Material).side).toBe(THREE.BackSide);
    sky.setMood(SKY_MOODS.yard);
    expect(sky.mat.uniforms.topColor.value.getHex()).toBe(0x3a7bd5);
  });
});
```

(Импорт `* as THREE from 'three'` в начале файла.)

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/sky.test.ts`
Expected: FAIL with "Cannot find module '../src/three/sky'".

- [ ] **Step 3: Write minimal implementation** (`src/three/sky.ts`)

```ts
import * as THREE from 'three';
import type { MapId } from '../sim/maps';

export interface SkyMood { top: number; horizon: number; sun: number; sunDir: THREE.Vector3; exposure: number; cloudTint: number; }

export const SKY_MOODS: Record<MapId, SkyMood> = {
  yard: { top: 0x3a7bd5, horizon: 0xbfe3f0, sun: 0xfff3d6, sunDir: new THREE.Vector3(0.45, 0.75, 0.5).normalize(), exposure: 1.0, cloudTint: 0xffffff },
  island: { top: 0x2f6fd0, horizon: 0xcfeaf2, sun: 0xfff6da, sunDir: new THREE.Vector3(-0.3, 0.8, 0.4).normalize(), exposure: 1.05, cloudTint: 0xffffff },
  neon: { top: 0x120a2e, horizon: 0xff7a3c, sun: 0xff9a5c, sunDir: new THREE.Vector3(0.2, 0.18, -0.6).normalize(), exposure: 0.95, cloudTint: 0xc9a0ff },
};

const VERT = `varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const FRAG = `
varying vec3 vDir;
uniform vec3 topColor; uniform vec3 horizonColor; uniform vec3 sunDir; uniform vec3 sunColor; uniform vec3 cloudTint; uniform float cloudT;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){ vec2 i = floor(p); vec2 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
float fbm(vec2 p){ float v = 0.0; float a = 0.5; for (int i = 0; i < 4; i++){ v += a * vnoise(p); p *= 2.03; a *= 0.5; } return v; }
void main(){
  vec3 d = normalize(vDir);
  float h = clamp(d.y, 0.0, 1.0);
  vec3 col = mix(horizonColor, topColor, pow(h, 0.6));
  float s = max(dot(d, normalize(sunDir)), 0.0);
  col += sunColor * (pow(s, 800.0) * 1.2 + pow(s, 8.0) * 0.12);
  if (d.y > 0.02) {
    vec2 cuv = d.xz / (d.y + 0.15);
    float cl = fbm(cuv * 1.4 + vec2(cloudT * 0.008, 0.0));
    float cover = smoothstep(0.52, 0.72, cl);
    vec3 cloudCol = mix(vec3(1.0), cloudTint, 0.35) * (0.75 + 0.45 * pow(s, 3.0));
    col = mix(col, cloudCol, cover * smoothstep(0.02, 0.2, d.y) * 0.85);
  }
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

export interface SkyRig { mesh: THREE.Mesh; mat: THREE.ShaderMaterial; setMood(m: SkyMood): void; tick(dt: number): void; }

export function makeSky(): SkyRig {
  const mat = new THREE.ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG, side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: {
      topColor: { value: new THREE.Color(0x3a7bd5) }, horizonColor: { value: new THREE.Color(0xbfe3f0) },
      sunDir: { value: new THREE.Vector3(0.45, 0.75, 0.5).normalize() }, sunColor: { value: new THREE.Color(0xfff3d6) },
      cloudTint: { value: new THREE.Color(0xffffff) }, cloudT: { value: 0 },
    },
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(280, 16, 12), mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = -10;
  return {
    mesh, mat,
    setMood(m: SkyMood) {
      (mat.uniforms.topColor.value as THREE.Color).set(m.top);
      (mat.uniforms.horizonColor.value as THREE.Color).set(m.horizon);
      (mat.uniforms.sunColor.value as THREE.Color).set(m.sun);
      (mat.uniforms.cloudTint.value as THREE.Color).set(m.cloudTint);
      (mat.uniforms.sunDir.value as THREE.Vector3).copy(m.sunDir);
    },
    tick(dt: number) { (mat.uniforms.cloudT.value as number) += dt; },
  };
}
```

Проводка в `main.tsx`: после `const { scene, camera, renderer } = initScene(canvas);` добавить `const skyRig = makeSky(); scene.add(skyRig.mesh);` (+ импорт). В `applyMapMood(map)`: первой строкой `const mood = {...}[map]` уже есть — добавить `skyRig.setMood(SKY_MOODS[map]); renderer.toneMappingExposure = SKY_MOODS[map].exposure;` и солнцу `sun.position.copy(SKY_MOODS[map].sunDir).multiplyScalar(120)` — найти `sun` через `scene.traverse` рядом с существующей настройкой `DirectionalLight` (не плодить второй источник). `scene.background` больше не трогать (купол вместо заливки; `scene.fog` оставить). В `step`: `skyRig.tick(dt)` рядом с `tracers.update(dt)`.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test`
Expected: PASS полностью (старые тоже).

- [ ] **Step 5: Commit**

```bash
git add shturm.bratuxa.zomb.top/src/three/sky.ts shturm.bratuxa.zomb.top/src/main.tsx shturm.bratuxa.zomb.top/tests/sky.test.ts
git commit -m "shturm: небо-купол, солнце и облака 🏆"
```

---

### Task 2: Трава инстансингом с ветром

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/three/grass.ts`
- Modify: `shturm.bratuxa.zomb.top/src/main.tsx` (`grassRig` на карту в `startGame` рядом с `mapGroup`; `tick`/`step` — `grassRig.tick(dt)`; `lowDetail`-переключатель — `grassRig.setLow(true)`)
- Test: `shturm.bratuxa.zomb.top/tests/grass.test.ts`

**Interfaces:**
- Consumes: `MAPS`, `MapId` из `src/sim/maps.ts`; `resolveCircle` НЕ нужен (своя проверка кругов).
- Produces: `buildGrass(map, seed): GrassRig { mesh, setLow(low), tick(dt) }`, `GRASS_HIGH/GRASS_LOW` (+NEON).

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { buildGrass, GRASS_HIGH } from '../src/three/grass';
import { MAPS } from '../src/sim/maps';
describe('трава', () => {
  test('хай-каунт и все кусты в bounds + вне препятствий', () => {
    const g = buildGrass('yard', 42);
    expect(g.mesh.count).toBe(GRASS_HIGH);
    const m = new THREE.Matrix4(); const v = new THREE.Vector3();
    for (let i = 0; i < g.mesh.count; i += 50) {
      g.mesh.getMatrixAt(i, m); v.setFromMatrixPosition(m);
      expect(Math.abs(v.x)).toBeLessThan(20);
      expect(Math.abs(v.z)).toBeLessThan(20);
      for (const o of MAPS.yard.obstacles) expect(Math.hypot(v.x - o.x, v.z - o.z)).toBeGreaterThan(o.r + 1.5);
    }
  });
  test('setLow режет count', () => {
    const g = buildGrass('yard', 42);
    g.setLow(true);
    expect(g.mesh.count).toBeLessThan(GRASS_HIGH);
    g.setLow(false);
    expect(g.mesh.count).toBe(GRASS_HIGH);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/grass.test.ts`
Expected: FAIL with "Cannot find module '../src/three/grass'".

- [ ] **Step 3: Write minimal implementation** (`src/three/grass.ts`)

```ts
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
  const g = ctx.createLinearGradient(0, 128, 0, 0);
  g.addColorStop(0, '#3d5c22'); g.addColorStop(1, '#8fbf4d');
  ctx.strokeStyle = g; ctx.lineWidth = 5; ctx.lineCap = 'round';
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

export interface GrassRig { mesh: THREE.InstancedMesh; setLow(low: boolean): void; tick(dt: number): void; }

export function buildGrass(map: MapId, seed: number): GrassRig {
  const def = MAPS[map];
  const half = def.size / 2;
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
  mat.onBeforeCompile = (sh) => {
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
    const a = order[i]; order[i] = order[j]; order[j] = i;
    const ma = new THREE.Matrix4(); const mb = new THREE.Matrix4();
    mesh.getMatrixAt(a, ma); mesh.getMatrixAt(order[i], mb);
    mesh.setMatrixAt(a, mb); mesh.setMatrixAt(order[i], ma);
  }
  mesh.instanceMatrix.needsUpdate = true;
  return {
    mesh,
    setLow: (l: boolean) => { mesh.count = l ? low : high; },
    tick: (dt: number) => { uTime.value += dt; },
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
```

Проводка в `main.tsx`: `let grassRig` рядом с `mapGroup`; в `startGame` после `rebuildMedkitVisuals()` — удалить старый (`scene.remove`), `grassRig = buildGrass(mapId, seed карты)` (сид: добавить `sim.seed` — в `startGame` взять из `makeWave`? Нет: ввести `const seed = (Date.now() % 2147483647)` в `startGame`, сохранить в `sim.seed`, отдать в `buildGrass` и (позже) в `Sim.makeWorld`? НЕ трогать `Sim.makeWorld` — сид мира не из этого. Просто локальный сид травы: `sim.seed ??= (Math.random() * 2 ** 31) | 0` при старте игры, сброс в `startGame`). В `step`: `grassRig.tick(dt)` рядом с `tracers.update(dt)`. В lowDetail-переключатель (`if (lowT > 2 && !lowDetail)`): добавить `grassRig.setLow(true)`.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test`
Expected: PASS полностью.

- [ ] **Step 5: Commit**

```bash
git add shturm.bratuxa.zomb.top/src/three/grass.ts shturm.bratuxa.zomb.top/src/main.tsx shturm.bratuxa.zomb.top/tests/grass.test.ts
git commit -m "shturm: трава инстансингом с ветром 🏆"
```

---

### Task 3: Грунт, камень, материалы

**Files:**
- Modify: `shturm.bratuxa.zomb.top/src/three/textures.ts` (два painter: `grassGround`, `stone`; расширить `TexKind`)
- Modify: `shturm.bratuxa.zomb.top/src/three/mapsVisual.ts` (двор-грунт, `matWall`/`matStone` на камень, palm emissive 0.25, дерево roughness 0.65)
- Test: `shturm.bratuxa.zomb.top/tests/textures.test.ts` (дописать блок; стаб canvas — только размеры/кэш/wrap, без пикселей)

**Interfaces:**
- Consumes: `getTex`/`TexKind` (существуют).
- Produces: `getTex('grassGround')` 512, `getTex('stone')` 256 (использует Task 5 косвенно через билд).

- [ ] **Step 1: Write the failing test** (дописать в `tests/textures.test.ts`)

```ts
import * as THREE from 'three';
import { getTex } from '../src/three/textures';
test('grassGround 512 и stone 256, кэш по kind', () => {
  const g = getTex('grassGround');
  expect(g.image.width).toBe(512);
  expect(g.wrapS).toBe(THREE.RepeatWrapping);
  const s = getTex('stone');
  expect(s.image.width).toBe(256);
  expect(getTex('stone')).toBe(s);
});
```

(Проверить существующие импорты файла — сейчас там только `bun:test` + `getTex`; строки импорта выше обязательны, без «если».)

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/textures.test.ts`
Expected: FAIL (нет `'grassGround'` в `TexKind` — TS-ошибка или undefined painter).

- [ ] **Step 3: Write minimal implementation**

В `TexKind` добавить `| 'grassGround' | 'stone'`. Painters:

```ts
grassGround: (ctx, n) => {
  noise(ctx, n, '#55702f', '#48642a');
  const greens = ['#5d7f36', '#425e26', '#68893d'];
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = greens[(Math.random() * greens.length) | 0];
    ctx.fillRect(Math.random() * n, Math.random() * n, 2 + Math.random() * 3, 2 + Math.random() * 3);
  }
  ctx.fillStyle = 'rgba(107,90,58,0.5)'; // проплешины
  for (let i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.ellipse(Math.random() * n, Math.random() * n, 10 + Math.random() * 26, 8 + Math.random() * 18, Math.random() * 3, 0, 7);
    ctx.fill();
  }
},
stone: (ctx, n) => {
  noise(ctx, n, '#8a8f96', '#7a7f87');
  ctx.strokeStyle = 'rgba(40,42,48,0.55)';
  ctx.lineWidth = 2;
  for (let y = 0; y <= n; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(n, y); ctx.stroke(); }
  for (let y = 0; y < n; y += 32) for (let x = ((y / 32) % 2) * 32; x <= n; x += 64) {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 32); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(30,32,38,0.35)';
  for (let i = 0; i < 24; i++) ctx.fillRect(Math.random() * n, Math.random() * n, 2 + Math.random() * 4, 6 + Math.random() * 18);
},
```

В `getTex(kind, size = 256)`: размер по kind — `const n = kind === 'grassGround' ? 512 : size;` (кэш-ключ оставить `kind`; вызовы с другим `size` для тех же kind в коде уже зафиксированы: sand 256/repeat правится снаружи).

В `mapsVisual.ts`: двор — `groundMat.map = getTex('grassGround'); groundMat.map.repeat.set(14, 14); groundMat.color.set(0xffffff);` (рядом с island/neon ветками — добавить `if (map === 'yard')` ветку ПЕРВОЙ). `matWall` всех карт: `map: getTex('stone')` + оставить `color: WALL_COLOR[map]` (камень тонируется). `matStone` острова: `map: getTex('stone')`, `color.set(0xcfc9bd)`. `matWood` roughness `0.8` → `0.65`. Пальмы: `emissiveIntensity: 0.55` → `0.25`.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test`
Expected: PASS полностью.

- [ ] **Step 5: Commit**

```bash
git add shturm.bratuxa.zomb.top/src/three/textures.ts shturm.bratuxa.zomb.top/src/three/mapsVisual.ts shturm.bratuxa.zomb.top/tests/textures.test.ts
git commit -m "shturm: грунт и камень процедурно 🏆"
```

---

### Task 4: Вода — пруд двора + полировка

**Files:**
- Modify: `shturm.bratuxa.zomb.top/src/three/mapsVisual.ts` (пруд yard + island-кольцо)
- Test: asset через существующий сьют (структурный assert ниже — новый файл НЕ создаём, YAGNI)

**Interfaces:**
- Consumes: `getWaterTex()` (существует в том же файле), `MAPS`/`MapId`.
- Produces: меш с `name === 'pond'` на yard;owsky.

- [ ] **Step 1: Write the failing test** (дописать в `tests/grass.test.ts`? Нет — вода не трава. Создать `tests/water.test.ts`)

```ts
import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { buildMapVisual } from '../src/three/mapsVisual';
describe('вода', () => {
  test('пруд во дворе с именем', () => {
    const g = buildMapVisual('yard');
    let found: THREE.Object3D | null = null;
    g.traverse((o) => { if (o.name === 'pond') found = o; });
    expect(found).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun test tests/water.test.ts`
Expected: FAIL with "expected null not to be null".

- [ ] **Step 3: Write minimal implementation**

В yard-ветку `buildMapVisual`, после луж (`puddleMat` блок):

```ts
// Пруд: свой инстанс текстуры (оффсет независим от кольца острова) + блик.
const pondTex = getWaterTex().clone();
pondTex.needsUpdate = true;
pondTex.repeat.set(4, 4);
const pondMat = new THREE.MeshStandardMaterial({
  map: pondTex, transparent: true, opacity: 0.9, roughness: 0.12, metalness: 0.1, envMapIntensity: 2.0,
});
const pond = new THREE.Mesh(new THREE.CircleGeometry(4, 36), pondMat);
pond.rotation.x = -Math.PI / 2;
pond.position.set(10, 0.06, -2);
pond.name = 'pond';
pond.onBeforeRender = () => { pondTex.offset.x = (performance.now() / 9000) % 1; };
group.add(pond);
```

Island-кольцо: `opacity: 0.8` → `0.9`, добавить `envMapIntensity: 1.2`, `roughness: 0.25` → `0.15`.

- [ ] **Step 4: Run test to verify it passes**

Run: `bun test`
Expected: PASS полностью.

- [ ] **Step 5: Commit**

```bash
git add shturm.bratuxa.zomb.top/src/three/mapsVisual.ts shturm.bratuxa.zomb.top/tests/water.test.ts
git commit -m "shturm: пруд во дворе и вода 🏆"
```

---

### Task 5: Верификация AAA и деплой

**Files:** Пробы в `/tmp` (не коммитятся). Коммит: `dist/` после `bun run build`.

- [ ] **Step 1: Полный сьют и типы**

Run: `bun test` (ожидаю 55+ pass, 0 fail), `bun run typecheck` (чисто).

- [ ] **Step 2: Билд**

Run: `bun run build`. Имена бандлов узнать: `ls dist/assets/`, `grep -o 'assets/index-[A-Za-z0-9]*\.js' dist/index.html`.

- [ ] **Step 3: Браузер-приёмка AAA** — файл `/tmp/shturm_graphics.js`, запуск `node /tmp/shturm_graphics.js`:

```js
const { chromium } = require('/root/shotbot/node_modules/playwright-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch({ executablePath: '/usr/local/bin/chromium',
    args: ['--no-sandbox', '--no-proxy-server', '--use-gl=angle', '--use-angle=swiftshader', '--in-process-gpu'] });
  const page = await browser.newPage({ viewport: { width: 800, height: 450 } });
  let pageerror = '';
  page.on('pageerror', (e) => { pageerror += String(e).slice(0, 160) + '|'; });
  await page.goto('http://127.0.0.1:8901/', { waitUntil: 'load', timeout: 90000 });
  await page.waitForFunction(() => window.__shturm, null, { timeout: 90000 });
  const S = (fn, ...a) => page.evaluate(fn, ...a);
  const base = await S(() => ({ draw: window.__shturm.draw(), dbg: window.__shturm.dbg() }));
  console.log('BASE draw', JSON.stringify(base.draw));
  for (const map of ['yard', 'island', 'neon']) {
    await S((m) => window.__shturm.start(m, 'veteran'), map);
    await sleep(2500);
    await S(() => window.__shturm.god(true));
    const d = await S(() => ({ draw: window.__shturm.draw(), fps: window.__shturm.dbg().fps }));
    console.log(`PASS ${map}`, JSON.stringify(d.draw), 'fps~' + Math.round(d.fps));
    await S(() => window.__shturm.view('third'));
    await sleep(400);
    await page.screenshot({ path: `/root/shots/shturm-aaa-${map}-third.png`, timeout: 120000 });
    await S(() => window.__shturm.view('first'));
    await sleep(400);
    await page.screenshot({ path: `/root/shots/shturm-aaa-${map}-first.png`, timeout: 120000 });
  }
  console.log('pageerror: ' + (pageerror || 'none'));
  await browser.close();
})();
```

Стенд: `dist/` через `python3 -m http.server 8901` (background, погасить после). Ожидаю: calls ≤120 (было ~75-88; +трава 1-2, +купол 1, +пруд 1), triangles ≤250к, `pageerror: none`. Скрины 6 шт глянуть глазами: небо+солнце+облака, трава у ног, грунт не плоский, пруд блестит.

- [ ] **Step 4: Коммит dist** (имена из вывода Step 2)

```bash
git add shturm.bratuxa.zomb.top/dist/index.html shturm.bratuxa.zomb.top/dist/assets/<имя-из-step2>.js
git rm -q --cached shturm.bratuxa.zomb.top/dist/assets/<старое-имя>.js
git commit -m "shturm: билд графики AAA 🏆"
```

- [ ] **Step 5: Деплой**

```bash
docker compose build && (docker compose up -d --force-recreate || (docker rm -f shturm && docker compose up -d))
curl -s https://shturm.bratuxa.zomb.top/ | grep -o 'assets/index-[A-Za-z0-9]*\.js'
```

Ожидаю: новый хэш в проде, HTTP 200. Только после этого — «готово».

---

## Self-Review

1. **Покрытие спека:** небо §1 → Task 1; трава §2 → Task 2; грунт/камень/материалы §3 → Task 3; свет §4 → Task 1 (exposure/sun в `applyMapMood`); вода §5 → Task 4; верификация → Task 5. Вне скоупа из спека не запланировано. Пробелов нет.
2. **Плейсхолдеры:** числовые литералы — только значения из спека; `<имя>` в Task 5 Step 4 резолвится предыдущим шагом (ls+grep) — как в прошлом плане, рабочий приём.
3. **Консистентность типов:** `SkyMood/SKY_MOODS/makeSky/SkyRig`, `buildGrass/GrassRig/GRASS_*`, `getTex('grassGround'|'stone')`, меш `'pond'` — имена едины между тасками; `applyMapMood`/`step`/`lowDetail`/`startGame` существуют в `main.tsx`; `sim.seed` вводится в Task 2 (поле `seed: 0` в объект `sim` + установка в `startGame`: `sim.seed = (Math.random() * 2 ** 31) | 0`).
