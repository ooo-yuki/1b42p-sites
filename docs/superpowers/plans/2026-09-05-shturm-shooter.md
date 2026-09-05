# ШТУРМ-43 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Собрать сингл-шутер ШТУРМ-43 (шуба-боец, 3 карты, 3 ствола, волны+босс-чайка) на новом поддомене.

**Architecture:** `src/sim` — чистая TS-логика без DOM (единый источник правды, TDD через bun test); `src/three` — только рендер снапшота sim; `src/ui` — React HUD. Физика 60 Гц фикс-степ, рендер отдельно.

**Tech Stack:** bun + vite + react + typescript + three@0.170.0, GLB шубы (4 клипа, 26 нод, 72 канала), dist/ как корень сайта.

**Spec:** `/root/sites/docs/superpowers/specs/2026-09-05-shturm-shooter-design.md`

## Global Constraints

- Правила боя живут только в `src/sim` — three/ui не считают урон/спавн.
- PBR MeshStandardMaterial, ACESFilmicToneMapping, pixelRatio<=2 (моб<=1.5).
- 42+ FPS, ≤120 draw calls, тени 1024 моб / 2048 деск.
- Коммиты: префикс `shturm:`, эмодзи в конце, UI-тексты по-русски, мотто `Мы уже победили 🏆`.
- Проверка в браузере обязательна (harness-chrome :9222), иначе 0/10.

---

### Task 1: Скаффолд сайта

**Files:**
- Create: `shturm.bratuxa.zomb.top/package.json`
- Create: `shturm.bratuxa.zomb.top/vite.config.ts`
- Create: `shturm.bratuxa.zomb.top/tsconfig.json`
- Create: `shturm.bratuxa.zomb.top/index.html`
- Create: `shturm.bratuxa.zomb.top/src/main.tsx`
- Create: `shturm.bratuxa.zomb.top/public/models/*.glb` (копии 4 шт из 1b42p)

**Interfaces:**
- Consumes: ничего.
- Produces: `npm scripts dev/build/test`, `src/main.tsx -> renders <App/>`, `public/models/*.glb доступны как /models/*.glb`.

- [ ] **Step 1: Проверить bun и создать папку**

```bash
which bun || ls ~/.bun/bin/bun || ls /root/.bun/bin/bun
mkdir -p /root/sites/shturm.bratuxa.zomb.top/public/models
cp /root/sites/1b42p.bratuxa.zomb.top/models/*.glb /root/sites/shturm.bratuxa.zomb.top/public/models/
ls -lh /root/sites/shturm.bratuxa.zomb.top/public/models/
```

- [ ] **Step 2: package.json минимальный**

```json
{
  "name": "shturm-43",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": { "dev": "vite", "build": "vite build", "test": "bun test" },
  "dependencies": { "react": "^18.3.1", "react-dom": "^18.3.1", "three": "^0.170.0" },
  "devDependencies": { "@vitejs/plugin-react": "^4.3.0", "typescript": "^5.5.0", "vite": "^5.4.0" }
}
```

- [ ] **Step 3: vite.config + tsconfig + index.html + main.tsx**

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({ plugins: [react()], build: { outDir: 'dist' } });
```

```html
<!-- index.html -->
<!doctype html><html lang="ru"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>ШТУРМ-43 — Мы уже победили 🏆</title></head>
<body><div id="root"></div><canvas id="game"></canvas>
<script type="module" src="/src/main.tsx"></script></body></html>
```

```tsx
// src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
createRoot(document.getElementById('root')!).render(<div>ШТУРМ-43 загружается… 🏆</div>);
```

- [ ] **Step 4: Установка и билд-проверка**

```bash
cd /root/sites/shturm.bratuxa.zomb.top
~/.bun/bin/bun install || bun install
~/.bun/bin/bun run build || bun run build
ls dist/index.html
```

- [ ] **Step 5: Commit**

```bash
git add shturm.bratuxa.zomb.top docs/superpowers/plans/2026-09-05-shturm-shooter.md
git commit -m "shturm: скаффолд vite+react+ts+three, модели шубы 🏆"
```

### Task 2: Sim ядро — математика + игрок

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/sim/math.ts`
- Create: `shturm.bratuxa.zomb.top/src/sim/player.ts`
- Test: `shturm.bratuxa.zomb.top/tests/player.test.ts`

**Interfaces:**
- Consumes: ничего.
- Produces: `movePlayer(p: PlayerState, input: InputState, dt: number): void`, `PlayerState{x,z,vx,vz,hp,stamina,yaw}`, фиксированный степ 1/60.

- [ ] **Step 1: Failing test движение+стамина**

```ts
// tests/player.test.ts
import { describe, expect, test } from 'bun:test';
import { createPlayer, movePlayer } from '../src/sim/player';
describe('player', () => {
  test('бег быстрее ходьбы и жрёт стамину', () => {
    const p = createPlayer();
    movePlayer(p, { fwd: 1, strafe: 0, sprint: true, dt: 1 }, 1);
    expect(p.stamina).toBeLessThan(43);
    expect(Math.hypot(p.vx, p.vz)).toBeGreaterThan(4.5);
  });
});
```

- [ ] **Step 2: Run, увидеть FAIL**

```bash
cd /root/sites/shturm.bratuxa.zomb.top && bun test tests/player.test.ts
```
Expected: FAIL `Cannot find module '../src/sim/player'`.

- [ ] **Step 3: Минимальная реализация**

```ts
// src/sim/player.ts
export interface PlayerState { x: number; z: number; vx: number; vz: number; hp: number; stamina: number; yaw: number; }
export interface InputState { fwd: number; strafe: number; sprint: boolean; dt: number; }
export function createPlayer(): PlayerState { return { x: 0, z: 0, vx: 0, vz: 0, hp: 100, stamina: 43, yaw: 0 }; }
export function movePlayer(p: PlayerState, inp: InputState, dt: number) {
  const wantSprint = inp.sprint && p.stamina > 1 && inp.fwd !== 0;
  const speed = wantSprint ? 7 : 4;
  if (wantSprint) p.stamina = Math.max(0, p.stamina - 10 * dt);
  else p.stamina = Math.min(43, p.stamina + 12 * dt);
  const len = Math.hypot(inp.fwd, inp.strafe) || 1;
  p.vx = (inp.strafe / len) * speed; p.vz = (-inp.fwd / len) * speed;
  p.x += p.vx * dt; p.z += p.vz * dt;
}
```

- [ ] **Step 4: PASS**

```bash
cd /root/sites/shturm.bratuxa.zomb.top && bun test
```
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add shturm.bratuxa.zomb.top/src/sim/player.ts shturm.bratuxa.zomb.top/tests/player.test.ts
git commit -m "shturm: sim игрок ходьба/бег/стамина 43 🏃"
```

### Task 3: Оружие — хитскан 3 ствола

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/sim/weapons.ts`
- Test: `shturm.bratuxa.zomb.top/tests/weapons.test.ts`

**Interfaces:**
- Consumes: `PlayerState` из Task 2.
- Produces: `WEAPONS: Record<Slot, Stats>`, `fire(sim, slot, now): ShotResult`, `reload()`.

- [ ] **Step 1: Failing test дробовик веер**

```ts
import { describe, expect, test } from 'bun:test';
import { WEAPONS, fireShot } from '../src/sim/weapons';
describe('weapons', () => {
  test('дробовик даёт 6 дробин', () => {
    expect(WEAPONS.shotgun.pellets).toBe(6);
    const r = fireShot('shotgun', 10, 0);
    expect(r.pellets.length).toBe(6);
  });
});
```

- [ ] **Step 2: Run FAIL**

```bash
cd /root/sites/shturm.bratuxa.zomb.top && bun test tests/weapons.test.ts
```

- [ ] **Step 3: Реализация ТТХ из спека**

```ts
// src/sim/weapons.ts
export type Slot = 'pistol' | 'auto' | 'shotgun';
export const WEAPONS = {
  pistol: { dmg: 25, mag: 12, reserve: 120, interval: 0.35, spread: 0.5, reload: 1.1, pellets: 1, range: 60 },
  auto: { dmg: 16, mag: 30, reserve: 210, interval: 0.11, spread: 1.8, reload: 1.8, pellets: 1, range: 80 },
  shotgun: { dmg: 12, mag: 6, reserve: 42, interval: 0.9, spread: 5, reload: 2.4, pellets: 6, range: 25 },
};
export function fireShot(slot: Slot, dist: number, seed: number) {
  const w = WEAPONS[slot];
  const pellets = Array.from({ length: w.pellets }, (_, i) => ({ dmg: dist > 15 && slot === 'shotgun' ? w.dmg * 0.5 : w.dmg, idx: i }));
  return { pellets };
}
```

- [ ] **Step 4: PASS + commit**

```bash
cd /root/sites/shturm.bratuxa.zomb.top && bun test
git add shturm.bratuxa.zomb.top/src/sim/weapons.ts shturm.bratuxa.zomb.top/tests/weapons.test.ts
git commit -m "shturm: sim 3 ствола хитскан 🔫"
```

### Task 4: Мобы + волны + автобаланс

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/sim/enemies.ts`
- Create: `shturm.bratuxa.zomb.top/src/sim/waves.ts`
- Create: `shturm.bratuxa.zomb.top/src/sim/autobalance.ts`
- Test: `shturm.bratuxa.zomb.top/tests/waves.test.ts`

**Interfaces:**
- Consumes: `WEAPONS` Task 3.
- Produces: `ENEMIES{runner,shooter,tank,boss}`, `makeWave(n): Spawn[]`, `autobalance(stats): mult`.

- [ ] **Step 1: Failing test волна 7 = босс**

```ts
import { describe, expect, test } from 'bun:test';
import { makeWave } from '../src/sim/waves';
describe('waves', () => {
  test('7-я волна содержит босса', () => { expect(makeWave(7).some(s => s.type === 'boss')).toBe(true); });
  test('1-я волна дешёвая', () => { expect(makeWave(1).length).toBeLessThan(12); });
});
```

- [ ] **Step 2: Run FAIL, Step 3: реализация**

```ts
// src/sim/enemies.ts
export const ENEMIES = {
  runner: { hp: 40, speed: 5.0, dmg: 10, cost: 1 },
  shooter: { hp: 50, speed: 3.2, dmg: 8, cost: 2 },
  tank: { hp: 200, speed: 2.0, dmg: 20, cost: 4 },
  boss: { hp: 1200, speed: 3.0, dmg: 25, cost: 99 },
};
// src/sim/waves.ts
import { ENEMIES } from './enemies';
export interface Spawn { type: keyof typeof ENEMIES; }
const BUDGET = [0, 10, 14, 18, 24, 30, 36];
export function makeWave(n: number): Spawn[] {
  if (n >= 7) return [{ type: 'boss' }, { type: 'runner' }, { type: 'runner' }, { type: 'shooter' }];
  let b = BUDGET[n] ?? 10; const out: Spawn[] = [];
  while (b >= 4 && out.length < 20) { out.push({ type: 'tank' }); b -= 4; }
  while (b >= 2) { out.push({ type: 'shooter' }); b -= 2; }
  while (b >= 1) { out.push({ type: 'runner' }); b -= 1; }
  return out;
}
// src/sim/autobalance.ts
export function autobalance(deaths: number, accuracy: number): number {
  if (deaths >= 2) return 0.85;
  if (deaths === 0 && accuracy > 0.4) return 1.15;
  return 1.0;
}
```

- [ ] **Step 4: PASS**

```bash
cd /root/sites/shturm.bratuxa.zomb.top && bun test
```

- [ ] **Step 5: Commit**

```bash
git add shturm.bratuxa.zomb.top/src/sim/enemies.ts shturm.bratuxa.zomb.top/src/sim/waves.ts shturm.bratuxa.zomb.top/src/sim/autobalance.ts shturm.bratuxa.zomb.top/tests/waves.test.ts
git commit -m "shturm: sim мобы волны автобаланс 🐛"
```

### Task 5: Three сцена + камеры 1/3

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/three/scene.ts`
- Create: `shturm.bratuxa.zomb.top/src/three/cameraRig.ts`

**Interfaces:**
- Consumes: снапшот sim `{player:{x,z,yaw,hp}}`.
- Produces: `initScene(canvas): {scene,camera,renderer}`, `setView('first'|'third')`, `updateCamera(snap)`.

- [ ] **Step 1: Сцена с hemi+dir+туман (код из threejs-lighting скилла)**

```ts
import * as THREE from 'three';
export function initScene(canvas: HTMLCanvasElement) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);
  scene.fog = new THREE.Fog(0x87ceeb, 20, 90);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 300);
  scene.add(new THREE.HemisphereLight(0x87ceeb, 0x8b4513, 0.6));
  const sun = new THREE.DirectionalLight(0xffffcc, 1.5);
  sun.position.set(20, 30, 10); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -25; sun.shadow.camera.right = 25;
  sun.shadow.camera.top = 25; sun.shadow.camera.bottom = -25;
  scene.add(sun);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), new THREE.MeshStandardMaterial({ color: 0x6a8f5f, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  return { scene, camera, renderer };
}
```

- [ ] **Step 2: Риг 1/3 лицо + проверка в браузере**

```ts
let view: 'first' | 'third' = 'third';
export function setView(v: 'first' | 'third') { view = v; }
export function updateCamera(camera: THREE.PerspectiveCamera, p: { x: number; z: number; yaw: number }) {
  if (view === 'first') camera.position.set(p.x, 1.62, p.z);
  else camera.position.set(p.x + Math.sin(p.yaw) * 2.2 + 0.8, 2.4, p.z + Math.cos(p.yaw) * 2.2);
  camera.rotation.set(0, p.yaw, 0);
}
window.addEventListener('keydown', e => { if (e.code === 'KeyV') setView(view === 'first' ? 'third' : 'first'); });
```

- [ ] **Step 3: Commit**

```bash
git add shturm.bratuxa.zomb.top/src/three/scene.ts shturm.bratuxa.zomb.top/src/three/cameraRig.ts
git commit -m "shturm: three сцена свет камеры V-1/3 🎥"
```

### Task 6: Шуба GLB + Mixer

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/three/shuba.ts`

**Interfaces:**
- Consumes: `initScene` Task 5.
- Produces: `loadShuba(scene): Promise<Shuba>`, `Shuba.update(speed, firing, dead, dt)`.

- [ ] **Step 1: Лоадер 4 GLB, бленд walk/run, аддитив attack**

```ts
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
export async function loadShuba(scene: THREE.Scene) {
  const loader = new GLTFLoader();
  const [walk, run, atk, dead] = await Promise.all(
    ['Walking', 'Running', 'Attack', 'Dead'].map(n =>
      loader.loadAsync(`/models/Meshy_AI_shuba_biped_Animation_${n}_withSkin.glb`))
  );
  const model = walk.scene; scene.add(model);
  model.traverse(o => { if ((o as THREE.Mesh).isMesh) { o.castShadow = true; } });
  const mixer = new THREE.AnimationMixer(model);
  const walkA = mixer.clipAction(walk.animations[0]);
  const runA = mixer.clipAction(run.animations[0]);
  const atkClip = atk.animations[0].clone();
  THREE.AnimationUtils.makeClipAdditive(atkClip);
  const atkA = mixer.clipAction(atkClip);
  const deadA = mixer.clipAction(dead.animations[0]);
  deadA.loop = THREE.LoopOnce; deadA.clampWhenFinished = true;
  walkA.play(); runA.play();
  return {
    model, mixer,
    update(speed: number, firing: boolean, deadFlag: boolean, dt: number) {
      const t = THREE.MathUtils.clamp((speed - 1) / 4, 0, 1);
      walkA.setEffectiveWeight(1 - t); runA.setEffectiveWeight(t);
      if (firing) { atkA.reset().setEffectiveWeight(1).play(); }
      else atkA.fadeOut(0.15);
      if (deadFlag) { deadA.play(); }
      mixer.update(dt);
    }
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add shturm.bratuxa.zomb.top/src/three/shuba.ts
git commit -m "shturm: шуба GLB миксер walk/run/attack/dead 🧥"
```

### Task 7: Стволы/мобы/эффекты процедурно + пулы

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/three/guns.ts`
- Create: `shturm.bratuxa.zomb.top/src/three/mobs.ts`
- Create: `shturm.bratuxa.zomb.top/src/three/effects.ts`

- [ ] **Step 1: guns.ts — 3 бокса-ствола, аттач к руке**

```ts
import * as THREE from 'three';
export function makeGun(slot: 'pistol' | 'auto' | 'shotgun') {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4, metalness: 0.8 });
  const wood = new THREE.MeshStandardMaterial({ color: 0x7a4a21, roughness: 0.8 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.12, slot === 'shotgun' ? 0.9 : 0.6), mat);
  body.castShadow = true; g.add(body);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.18, 0.08), wood);
  grip.position.set(0, -0.14, 0.15); g.add(grip);
  return g;
}
```

- [ ] **Step 2: mobs.ts + effects.ts пулы (трейсеры/гильзы)**

```ts
// effects.ts — пул трейсеров 43 шт
import * as THREE from 'three';
export function makeTracerPool(scene: THREE.Scene, n = 43) {
  const pool: THREE.Line[] = [];
  for (let i = 0; i < n; i++) {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0, -5)]);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0 }));
    scene.add(line); pool.push(line);
  }
  let k = 0;
  return { fire(from: THREE.Vector3, dir: THREE.Vector3) { const l = pool[k++ % pool.length]; l.position.copy(from); l.lookAt(from.clone().add(dir)); (l.material as THREE.Material & { opacity: number }).opacity = 1; } };
}
```

- [ ] **Step 3: Commit**

```bash
git add shturm.bratuxa.zomb.top/src/three/guns.ts shturm.bratuxa.zomb.top/src/three/mobs.ts shturm.bratuxa.zomb.top/src/three/effects.ts
git commit -m "shturm: процедурные стволы мобы трейсеры 🔫"
```

### Task 8: 3 карты визуал + коллизии

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/sim/maps.ts`
- Create: `shturm.bratuxa.zomb.top/src/three/mapsVisual.ts`

- [ ] **Step 1: maps.ts данные (spawn-точки, препятствия)**

```ts
export interface Obstacle { x: number; z: number; r: number; }
export const MAPS = {
  yard: { size: 42, spawns: [{ x: -18, z: -18 }, { x: 18, z: -18 }, { x: 0, z: 18 }], obstacles: [{ x: 0, z: 0, r: 2 }, { x: -8, z: 5, r: 1.5 }] as Obstacle[] },
  island: { size: 60, spawns: [{ x: -25, z: 0 }, { x: 25, z: 0 }], obstacles: [] as Obstacle[] },
  neon: { size: 50, spawns: [{ x: -20, z: 20 }, { x: 20, z: -20 }], obstacles: [{ x: 5, z: 5, r: 2 }] as Obstacle[] },
};
```

- [ ] **Step 2: mapsVisual.ts merged статика + неон-фонари, Commit**

```bash
git add shturm.bratuxa.zomb.top/src/sim/maps.ts shturm.bratuxa.zomb.top/src/three/mapsVisual.ts
git commit -m "shturm: 3 карты двор остров неон 🗺️"
```

### Task 9: React HUD + ввод + тач

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/ui/App.tsx`
- Create: `shturm.bratuxa.zomb.top/src/ui/hud.tsx`
- Modify: `shturm.bratuxa.zomb.top/src/main.tsx` (рендер App + canvas связка)

- [ ] **Step 1: HUD HP/волна/патроны/карта + кнопки 1/2/3/V**

```tsx
export function Hud({ hp, wave, ammo, slot }: { hp: number; wave: number; ammo: number; slot: string }) {
  return (<div style={{ position: 'fixed', top: 8, left: 8, color: '#fff', fontFamily: 'system-ui' }}>
    <div>HP {hp} | Волна {wave}/7 | {slot} [{ammo}]</div>
    <div style={{ fontSize: 12 }}>V — 1/3 лицо • 1/2/3 — оружие • R — перезарядка 🏆</div>
  </div>);
}
```

- [ ] **Step 2: Тач-джойстики (левый движение, правый обзор), Commit**

```bash
git add shturm.bratuxa.zomb.top/src/ui/App.tsx shturm.bratuxa.zomb.top/src/ui/hud.tsx shturm.bratuxa.zomb.top/src/main.tsx
git commit -m "shturm: React HUD джойстики 📱"
```

### Task 10: Интеграция + браузерная приёмка + build

**Files:**
- Modify: `shturm.bratuxa.zomb.top/src/main.tsx` (цикл sim 60Гц + render)

- [ ] **Step 1: Цикл + билд**

```bash
cd /root/sites/shturm.bratuxa.zomb.top && bun test && bun run build && ls dist/
```

- [ ] **Step 2: Браузер-чек harness-chrome :9222 (обязательно)**

```python
# browser_exec: открыть dist через file:// или vite preview, скрины: меню, 3 лицо, 1 лицо (V), стрельба, консоль без ошибок
```

- [ ] **Step 3: Финальный коммит**

```bash
git add shturm.bratuxa.zomb.top/dist
git commit -m "shturm: ШТУРМ-43 v1 playable, 3 карты волны босс 🏆"
```
