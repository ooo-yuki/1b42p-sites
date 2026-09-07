import React from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import { App, inputBus } from './ui/App';
import { initScene } from './three/scene';
import { makeSky, SKY_MOODS } from './three/sky';
import { makeNeonComposer, shouldBloom, NEON_BLOOM, NEON_BLOOM_LOW, type NeonComposer } from './three/post';
import { loadShuba, type Shuba } from './three/shuba';
import { makeMob, setMobLightDetail, updateMob, type MobKind } from './three/mobs';
import { makeGun } from './three/guns';
import { makeTracerPool, makeBoomPool, makeBloodPool, makeSparkPool, makeRocketTrail } from './three/effects';
import { buildMapVisual, disposeMapVisual } from './three/mapsVisual';
import { buildGrass, type GrassRig } from './three/grass';
import { setView, getView, updateCamera, snapCamera } from './three/cameraRig';
import { createPlayer, movePlayer, MAX_HP, type PlayerState } from './sim/player';
import { WEAPONS, fireShot, type Slot } from './sim/weapons';
import { ENEMIES, ATTACK_RANGE } from './sim/enemies';
import { makeWave } from './sim/waves';
import { MAPS, resolveCircle, type MapId } from './sim/maps';
import { spawnPickups, updatePickups, type Medkit } from './sim/pickups';
import { heldTurnRate, nearestFlags } from './sim/touch';
import { gameStore, DIFF_MULT, type Difficulty } from './game/store';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

const canvas = document.getElementById('game') as HTMLCanvasElement | null;
if (!canvas) {
  console.error('[shturm] canvas #game не найден');
  throw new Error('no canvas');
}

// ---------- Sim-состояние ----------
interface Enemy {
  type: keyof typeof ENEMIES;
  hp: number;
  maxHp: number;
  x: number;
  z: number;
  px: number;
  pz: number;
  cd: number;
  mesh: THREE.Group;
  anim: { dying: boolean; dieT: number };
  beam: THREE.SpotLight | null; // фонарь стрелка (кэш со спавна для бюджета света)
  farTick?: boolean; // LOD миксеров: дальние обновляются каждый 2-й кадр
}

const MAG: Record<Slot, number> = { pistol: 12, auto: 30, shotgun: 6 };
// Длительность взмаха атаки (~0.45с): флаг attacking горит только в начале кулдауна.
// План давал e.cd > 0.6 для всех — танк (cd 2.5с) замирал бы в позе удара на ~2с.
const ATK_CD: Record<Enemy['type'], number> = { runner: 0.8, shooter: 1.5, tank: 2.5, boss: 1.2 };
const SLOTS: Slot[] = ['pistol', 'auto', 'shotgun'];
const STEP = 1 / 60;

const sim = {
  player: createPlayer() as PlayerState & { pitch?: number },
  slot: 'auto' as Slot,
  mag: { ...MAG } as Record<Slot, number>,
  reserve: { pistol: 120, auto: 210, shotgun: 42 } as Record<Slot, number>,
  fireCd: 0,
  reloadT: 0,
  wave: 1,
  enemies: [] as Enemy[],
  pickups: [] as Medkit[],
  spawnQueue: [] as { type: keyof typeof ENEMIES }[],
  spawnT: 0,
  summonCd: 12,
  intermission: 0,
  kills: 0,
  shots: 0,
  hits: 0,
  timeSec: 0,
  deaths: 0,
  lowHpStreak: 0,
  balanceMult: 1,
  /** Приёмка камеры: мобы бьют и толкают, но не убивают (замер без смерти). */
  god: false,
  /** Task 2: локальный сид травы — обновляется в startGame, мир не трогает. */
  seed: 0,
};

let mapId: MapId = 'yard';
let difficulty: Difficulty = 'veteran';
let fpsAvg = 60;
let lowDetail = false;
let lowT = 0;

// ---------- Three ----------
const { scene, camera, renderer } = initScene(canvas);
// Небо-купол Task 1: солнце + дрейфующие облака, настроение — через applyMapMood.
const skyRig = makeSky();
scene.add(skyRig.mesh);
renderer.setSize(window.innerWidth, window.innerHeight);
// Task 8: честные draw calls приёмки — info копим за весь кадр
// (все проходы композитора + shadow map), сброс вручную в step().
renderer.info.autoReset = false;
let mapGroup = buildMapVisual(mapId);
scene.add(mapGroup);
// Task 2: трава инстансингом с ветром в шейдере (сид обновляется в startGame).
let grassRig: GrassRig = buildGrass(mapId, 42);
scene.add(grassRig.mesh);

// Банки-аптечки: зелёный ящик с белым крестом, видно издалека.
// Геометрия/материалы общие на все банки — без аллокаций на штуку.
const medGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const medBoxMat = new THREE.MeshStandardMaterial({ color: 0x0a7a3a, emissive: 0x00c853, emissiveIntensity: 0.7, roughness: 0.4 });
const medCrossMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5, roughness: 0.4 });
let medkitGroup: THREE.Group | null = null;
function rebuildMedkitVisuals() {
  if (medkitGroup) scene.remove(medkitGroup);
  medkitGroup = new THREE.Group();
  sim.pickups.forEach((m, i) => {
    const g = new THREE.Group();
    g.position.set(m.x, 0.6, m.z);
    g.userData.i = i;
    const box = new THREE.Mesh(medGeo, medBoxMat);
    g.add(box);
    for (const s of [1, -1]) {
      const h = new THREE.Mesh(medGeo, medCrossMat);
      h.scale.set(0.6, 0.2, 0.1); h.position.z = 0.26 * s; g.add(h);
      const v = new THREE.Mesh(medGeo, medCrossMat);
      v.scale.set(0.2, 0.6, 0.1); v.position.z = 0.26 * s; g.add(v);
    }
    medkitGroup!.add(g);
  });
  scene.add(medkitGroup);
}

let shuba: Shuba | null = null;
const playerRoot = new THREE.Group();
const fallbackBody = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.4, 0.9, 4, 12),
  new THREE.MeshStandardMaterial({ color: 0x8a2be2, roughness: 0.7 }),
);
fallbackBody.position.y = 1.0;
fallbackBody.castShadow = true;
playerRoot.add(fallbackBody);
scene.add(playerRoot);
loadShuba(scene)
  .then((s) => {
    shuba = s;
    playerRoot.remove(fallbackBody);
    playerRoot.add(s.model);
  })
  .catch((e) => console.warn('[shturm] GLB шубы не загрузился, fallback-капсула', e));

const gunMesh = makeGun(sim.slot);
scene.add(gunMesh);
const tracers = makeTracerPool(scene);
// Task 7: пулы эффектов — кровь/взрывы/искры/дым (update в кадровом цикле рядом с tracers).
const boomPool = makeBoomPool(scene);
const bloodPool = makeBloodPool(scene);
const sparkPool = makeSparkPool(scene);
const trailPool = makeRocketTrail(scene);
const flash = new THREE.PointLight(0xffd27f, 0, 9, 1.6);
scene.add(flash);
let flashT = 0;
// Пас освещения Task 4: контровый rim со спины солнца + мягкий подъём снизу,
// чтобы спина бегуна и низ крыла чайки не тонули в темноте (особенно neon-карта).
// Без теней, дешёвый. applyMapMood его не трогает (метка isRim).
const rim = new THREE.DirectionalLight(0x9db8ff, 0.55);
rim.position.set(-18, 14, -20);
rim.userData.isRim = true;
scene.add(rim);
const under = new THREE.HemisphereLight(0x8a9ac8, 0x3a2f22, 0.25);
under.userData.isRim = true;
scene.add(under);

// ---------- Resize + pixelRatio (спек §11) ----------
// Task 8: composer только для neon — лениво при первом старте карты.
let neonFx: NeonComposer | null = null;
function ensureNeonFx() {
  if (!neonFx) neonFx = makeNeonComposer(renderer, scene, camera);
  return neonFx;
}
function applySize() {
  const mobile = window.innerWidth < 768;
  const cap = mobile ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowDetail ? 1 : cap));
  renderer.setSize(window.innerWidth, window.innerHeight);
  neonFx?.composer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', applySize);
applySize();

// ---------- Ввод: pointer-lock обзор, мышь огонь, колесо оружие, Esc пауза ----------
canvas.addEventListener('click', () => {
  if (gameStore.get().phase === 'playing' && document.pointerLockElement !== canvas) {
    canvas.requestPointerLock?.();
  }
});
document.addEventListener('mousemove', (e) => {
  if (document.pointerLockElement !== canvas) return;
  if (gameStore.get().phase !== 'playing') return;
  sim.player.yaw -= e.movementX * 0.0025;
  sim.player.pitch = THREE.MathUtils.clamp(
    ((sim.player.pitch ?? 0) - e.movementY * 0.0022), -1.2, 1.2,
  );
  inputBus.look.dx = 0;
  inputBus.look.dy = 0;
});
canvas.addEventListener('mousedown', (e) => {
  if (gameStore.get().phase !== 'playing') return;
  if (e.button === 0) inputBus.fire = true;
  if (e.button === 2) inputBus.aim = true;
});
window.addEventListener('mouseup', (e) => {
  if (e.button === 0) inputBus.fire = false;
  if (e.button === 2) inputBus.aim = false;
});
canvas.addEventListener('contextmenu', (e) => e.preventDefault());
window.addEventListener('wheel', () => {
  if (gameStore.get().phase !== 'playing') return;
  const i = SLOTS.indexOf(sim.slot);
  switchSlot(SLOTS[(i + 1) % SLOTS.length]);
}, { passive: true });
document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement !== canvas && gameStore.get().phase === 'playing') {
    pauseGame();
  }
});
window.addEventListener('keydown', (e) => {
  if (e.code === 'Escape' && gameStore.get().phase === 'paused') resumeGame();
});

function switchSlot(s: Slot) {
  sim.slot = s;
  sim.reloadT = 0;
  scene.remove(gunMesh);
  const fresh = makeGun(s);
  gunMesh.clear();
  fresh.children.slice().forEach((c) => gunMesh.add(c));
  scene.add(gunMesh); // remove выше отцеплял ствол — без add переключённый ствол невидим
  // Task 6: у нового ствола свои muzzle/kick/update — переносим на долгоживущий gunMesh.
  gunMesh.userData.muzzle = fresh.userData.muzzle;
  gunMesh.userData.kick = fresh.userData.kick;
  gunMesh.userData.update = fresh.userData.update;
  gunMesh.name = fresh.name;
  pushHud();
}

// ---------- Волны ----------
function startWave(n: number) {
  sim.wave = n;
  sim.spawnQueue = makeWave(n).map((s) => ({ type: s.type as keyof typeof ENEMIES }));
  sim.spawnT = 0;
  sim.summonCd = 12;
  pushHud(`Волна ${n}/7${n === 7 ? ' — БОСС Чайка Рукрасии � чайка' : ''}`);
}

function spawnOne() {
  const q = sim.spawnQueue.shift();
  if (!q) return;
  const def = MAPS[mapId];
  const half = def.size / 2;
  // Спавн ≥15м от игрока, вне фрустума — кольцо + точки карты.
  let x = 0;
  let z = 0;
  for (let tries = 0; tries < 12; tries++) {
    const a = Math.random() * Math.PI * 2;
    const r = 15 + Math.random() * (half - 15);
    x = THREE.MathUtils.clamp(sim.player.x + Math.cos(a) * r, -half + 1, half - 1);
    z = THREE.MathUtils.clamp(sim.player.z + Math.sin(a) * r, -half + 1, half - 1);
    if (Math.hypot(x - sim.player.x, z - sim.player.z) >= 15) break;
  }
  const mult = DIFF_MULT[difficulty] * sim.balanceMult;
  const base = ENEMIES[q.type];
  const kind: MobKind = q.type === 'boss' ? 'seagull' : (q.type as MobKind);
  const mesh = makeMob(kind);
  if (q.type === 'boss') mesh.scale.setScalar(2.2);
  if (lowDetail) setMobLightDetail(mesh, true);
  // Фонарь стрелка ищем один раз при спавне (бюджет света в step, не traverse каждый кадр).
  let beam: THREE.SpotLight | null = null;
  mesh.traverse((o) => { if (!beam && (o as THREE.SpotLight).isSpotLight) beam = o as THREE.SpotLight; });
  mesh.position.set(x, 0, z);
  scene.add(mesh);
  sim.enemies.push({
    type: q.type, hp: base.hp * mult, maxHp: base.hp * mult, x, z, px: x, pz: z,
    cd: 1, mesh, anim: { dying: false, dieT: 0 }, beam,
  });
}

// ---------- Действия (меню/пауза/рестарт) ----------
function startGame(map: MapId, diff: Difficulty) {
  mapId = map;
  difficulty = diff;
  disposeMapVisual(scene, mapGroup);
  mapGroup = buildMapVisual(mapId);
  scene.add(mapGroup);
  sim.pickups = spawnPickups(mapId);
  rebuildMedkitVisuals();
  // Task 2: трава заново под карту со свежим сидом (старый риг — dispose + со сцены).
  sim.seed = Date.now() % 2147483647;
  grassRig.dispose();
  scene.remove(grassRig.mesh);
  grassRig = buildGrass(mapId, sim.seed);
  scene.add(grassRig.mesh);
  applyMapMood(mapId);
  sim.player = createPlayer() as PlayerState & { pitch?: number };
  // Спавн вдали от препятствий, лицом к центру карты.
  const SPAWN: Record<MapId, { x: number; z: number; yaw: number }> = {
    yard: { x: 0, z: 10, yaw: 0 },
    island: { x: 0, z: 10, yaw: 0 },
    neon: { x: -8, z: -10, yaw: Math.PI / 4 },
  };
  sim.player.x = SPAWN[map].x;
  sim.player.z = SPAWN[map].z;
  sim.player.yaw = SPAWN[map].yaw;
  snapCamera(); // спавн — камера сразу на месте, без пролёта через карту
  sim.slot = 'auto';
  sim.mag = { ...MAG };
  sim.reserve = { pistol: 120, auto: 210, shotgun: 42 };
  sim.fireCd = 0;
  sim.reloadT = 0;
  sim.kills = 0;
  sim.shots = 0;
  sim.hits = 0;
  sim.timeSec = 0;
  sim.deaths = 0;
  sim.balanceMult = 1;
  sim.intermission = 0;
  for (const e of sim.enemies) scene.remove(e.mesh);
  sim.enemies = [];
  gameStore.reset(map, diff);
  gameStore.set({ phase: 'playing' });
  startWave(1);
}

/** Настроение света/неба под карту (спек §7: двор день, остров день, неон закат). */
function applyMapMood(map: MapId) {
  const mood = {
    yard: { sky: 0x87ceeb, fogNear: 20, fogFar: 90, hemi: 0.6, sun: 0xffffcc, sunI: 1.5 },
    island: { sky: 0x9fd4ff, fogNear: 25, fogFar: 90, hemi: 0.7, sun: 0xfff2d8, sunI: 1.6 },
    neon: { sky: 0x1a1033, fogNear: 8, fogFar: 55, hemi: 0.5, sun: 0xff9a5c, sunI: 0.9 },
  }[map];
  (scene.background as THREE.Color).set(mood.sky);
  if (scene.fog instanceof THREE.Fog) {
    scene.fog.color.set(mood.sky);
    scene.fog.near = mood.fogNear;
    scene.fog.far = mood.fogFar;
  }
  // Небо-купол Task 1: параметры купола + экспозиция + солнце из SKY_MOODS.
  skyRig.setMood(SKY_MOODS[map]);
  renderer.toneMappingExposure = SKY_MOODS[map].exposure;
  scene.traverse((o) => {
    if ((o as THREE.HemisphereLight).isHemisphereLight && !o.userData.isRim) (o as THREE.HemisphereLight).intensity = mood.hemi;
    if ((o as THREE.DirectionalLight).isDirectionalLight && !o.userData.isRim) {
      (o as THREE.DirectionalLight).color.set(mood.sun);
      (o as THREE.DirectionalLight).intensity = mood.sunI;
      // Солнце встаёт по направлению из настроения неба (купол и свет в согласии).
      (o as THREE.DirectionalLight).position.copy(SKY_MOODS[map].sunDir).multiplyScalar(120);
    }
  });
}

function pauseGame() {
  if (gameStore.get().phase !== 'playing') return;
  gameStore.set({ phase: 'paused' });
  if (document.pointerLockElement === canvas) document.exitPointerLock?.();
}

function resumeGame() {
  if (gameStore.get().phase !== 'paused') return;
  gameStore.set({ phase: 'playing' });
}

function pushHud(message?: string) {
  const s = gameStore.get();
  gameStore.set({
    hp: Math.max(0, Math.round(sim.player.hp)),
    maxHp: MAX_HP,
    stamina: Math.round(sim.player.stamina),
    wave: sim.wave,
    slot: sim.slot,
    mag: sim.mag[sim.slot],
    reserve: sim.reserve[sim.slot],
    kills: sim.kills,
    enemiesLeft: sim.enemies.length + sim.spawnQueue.length,
    fps: Math.round(fpsAvg),
    timeSec: Math.round(sim.timeSec),
    accuracy: sim.shots ? Math.round((sim.hits / sim.shots) * 100) : 0,
    ...(message !== undefined ? { message: s.phase === 'playing' ? message : s.message } : {}),
  });
}

// Тест-хук для браузер-приёмки: window.__shturm.
(window as unknown as { __shturm: object }).__shturm = {
  start: startGame,
  pause: pauseGame,
  resume: resumeGame,
  fire: (on: boolean) => { inputBus.fire = on; },
  move: (x: number, y: number) => { inputBus.move = { x, y }; },
  view: (v: 'first' | 'third') => setView(v),
  wave: (n: number) => startWave(n),
  get: () => gameStore.get(),
  dbg: () => ({ t: sim.timeSec, acc, fps: fpsAvg, n: tickCount, frames: frameCount, enemies: sim.enemies.length, queue: sim.spawnQueue.length, px: sim.player.x, pz: sim.player.z, yaw: sim.player.yaw, cam: [camera.position.x, camera.position.y, camera.position.z], roll: camera.rotation.z, view: getView(), meds: sim.pickups.filter((m) => !m.taken).length }),
  /** Приёмка камеры: yaw, телепорт (тест стен), обзор правым стиком. */
  setYaw: (y: number) => { sim.player.yaw = y; },
  tp: (x: number, z: number) => { sim.player.x = x; sim.player.z = z; snapCamera(); },
  /** Приёмка камеры: бессмертие (мобы бьют/толкают, но замер не прерывается смертью). */
  god: (on: boolean) => { sim.god = on; },
  /** Draw calls приёмки: renderer.info.render (calls/triangles/points/lines). */
  draw: () => ({ ...renderer.info.render }),
  /** Перепись сцены приёмки: видимые меши, источники света с тенями. */
  census: () => {
    let meshes = 0; let shadowLights = 0;
    scene.traverse((o) => {
      if ((o as THREE.Mesh).isMesh && o.visible) meshes++;
      if ((o as THREE.Light).isLight && (o as THREE.DirectionalLight).castShadow) shadowLights++;
    });
    return { meshes, shadowLights, shadowMap: renderer.shadowMap.enabled };
  },
  /** Тест-утилита приёмки: довернуть игрока к ближайшему мобу. */
  aimNearest: () => {
    const p = sim.player;
    let best: Enemy | null = null;
    let bestD = Infinity;
    for (const e of sim.enemies) {
      const d = Math.hypot(e.x - p.x, e.z - p.z);
      if (d < bestD) { best = e; bestD = d; }
    }
    if (best) p.yaw = Math.atan2(-(best.x - p.x), -(best.z - p.z));
    return bestD;
  },
  /** Task 7: детерминированный триггер эффектов для браузер-приёмки (точка — перед игроком). */
  fx: (kind: 'boom' | 'big' | 'blood' | 'spark' | 'trail') => {
    const p = sim.player;
    const dir = new THREE.Vector3(-Math.sin(p.yaw), 0, -Math.cos(p.yaw));
    const at = new THREE.Vector3(p.x, 1, p.z).addScaledVector(dir, 5);
    if (kind === 'boom') boomPool.fire(at);
    else if (kind === 'big') boomPool.fire(at, { big: true });
    else if (kind === 'blood') bloodPool.fire(at);
    else if (kind === 'spark') sparkPool.fire(at);
    else trailPool.fire(at);
    return [at.x, at.y, at.z];
  },
};

// App сообщает смену карты/слота/вида через кастомные события.
window.addEventListener('shturm:start', (e) => {
  const d = (e as CustomEvent).detail as { map: MapId; difficulty: Difficulty };
  startGame(d.map, d.difficulty);
});
window.addEventListener('shturm:pause', pauseGame);
window.addEventListener('shturm:resume', resumeGame);
window.addEventListener('shturm:slot', (e) => {
  switchSlot((e as CustomEvent).detail as Slot);
});
window.addEventListener('shturm:view', (e) => {
  const v = (e as CustomEvent).detail as 'first' | 'third';
  setView(v);
  gameStore.set({ view: v });
});
window.addEventListener('shturm:restart', () => {
  startGame(gameStore.get().map, gameStore.get().difficulty);
});

// ---------- Sim tick (фикс-степ 60 Гц) ----------
function tick(dt: number) {
  tickCount += 1;
  const snap = gameStore.get();
  if (snap.phase !== 'playing') return;
  const p = sim.player;
  sim.timeSec += dt;

  // Движение WASD/джойстик.
  const sprint = (window as unknown as { __sprint?: boolean }).__sprint === true || sprintKey;
  movePlayer(p, { fwd: inputBus.move.y, strafe: inputBus.move.x, sprint, dt }, dt);
  // Обзор: разовый (мышь/совместимость) + удерживаемый с правого стика.
  // Held крутит постоянно, пока палец отклонён, — камера и движение идут одновременно.
  p.yaw -= inputBus.look.dx * dt * 2;
  p.pitch = THREE.MathUtils.clamp((p.pitch ?? 0) - inputBus.look.dy * dt * 2, -1.2, 1.2);
  inputBus.look.dx *= 0.8;
  inputBus.look.dy *= 0.8;
  p.yaw -= heldTurnRate(inputBus.lookHeld.x) * dt;
  p.pitch = THREE.MathUtils.clamp((p.pitch ?? 0) + heldTurnRate(inputBus.lookHeld.y) * dt, -1.2, 1.2);
  resolveCircle(p, 0.4, mapId);
  const healed = updatePickups(sim.pickups, p.x, p.z, dt);
  if (healed > 0) {
    p.hp = Math.min(MAX_HP, p.hp + healed);
    pushHud(`Аптечка +${healed} 🏥`);
  }

  // Оружие: кулдаун, огонь, перезарядка.
  const w = WEAPONS[sim.slot];
  sim.fireCd -= dt;
  if (sim.reloadT > 0) {
    sim.reloadT -= dt;
    if (sim.reloadT <= 0) {
      const need = MAG[sim.slot] - sim.mag[sim.slot];
      const take = Math.min(need, sim.reserve[sim.slot]);
      sim.mag[sim.slot] += take;
      sim.reserve[sim.slot] -= take;
      pushHud();
    }
  }
  if (inputBus.reload) {
    inputBus.reload = false;
    if (sim.reloadT <= 0 && sim.mag[sim.slot] < MAG[sim.slot] && sim.reserve[sim.slot] > 0) {
      sim.reloadT = w.reload;
    }
  }
  if (inputBus.fire && sim.fireCd <= 0 && sim.reloadT <= 0) {
    if (sim.mag[sim.slot] > 0) {
      sim.fireCd = w.interval;
      sim.mag[sim.slot] -= 1;
      sim.shots += 1;
      const dir = new THREE.Vector3(-Math.sin(p.yaw), 0, -Math.cos(p.yaw));
      const from = new THREE.Vector3(p.x, 1.4, p.z).addScaledVector(dir, 0.8);
      tracers.fire(from, dir);
      // Task 6: отдача ствола — пружинный кик + вспышка 2 кадра + гильза + дымок.
      (gunMesh.userData.kick as (() => void) | undefined)?.();
      flash.position.copy(from);
      flash.intensity = 30;
      flashT = 0.06;
      // Хитскан: ближайший моб в конусе ±3° и дальности.
      let best: Enemy | null = null;
      let bestD = Infinity;
      for (const e of sim.enemies) {
        if (e.anim.dying) continue; // по трупам не стреляем
        const dx = e.x - p.x;
        const dz = e.z - p.z;
        const d = Math.hypot(dx, dz);
        if (d > w.range) continue;
        const ang = Math.abs(Math.atan2(-dx, -dz) - p.yaw);
        const norm = Math.min(ang, Math.PI * 2 - ang);
        if (norm < 0.06 + w.spread * 0.01 && d < bestD) {
          best = e;
          bestD = d;
        }
      }
      const res = fireShot(sim.slot, best ? bestD : 999, sim.shots);
      if (best) {
        sim.hits += 1;
        const fall = sim.slot === 'shotgun' && bestD > 15 ? 0.5 : 1;
        best.hp -= res.pellets.length * (sim.slot === 'shotgun' ? 12 * fall : w.dmg);
        // Task 7: попадание — кровь из груди; по броне танка — жёлтые искры рикошета.
        const chest = new THREE.Vector3(best.x, 1.2, best.z);
        bloodPool.fire(chest);
        if (best.type === 'tank') sparkPool.fire(chest);
        if (best.hp <= 0 && !best.anim.dying) {
          // Task 4: смерть с задержкой — death-клип 0.8с, remove в кадровом цикле.
          best.anim.dying = true;
          best.anim.dieT = 0.8;
          sim.kills += 1;
          // Task 7: смерть — кровь + взрыв (босс — большой + дымный шлейф салюта).
          const ground = new THREE.Vector3(best.x, 0.8, best.z);
          bloodPool.fire(ground);
          const big = best.type === 'boss';
          boomPool.fire(ground, { big });
          if (big) trailPool.fire(ground);
          // Дроп 42%: патроны или аптечка.
          if (Math.random() < 0.42) {
            if (Math.random() < 0.5) {
              sim.reserve[sim.slot] += Math.ceil(MAG[sim.slot] / 2);
              pushHud('Дроп: патроны + 🏆');
            } else {
              p.hp = Math.min(MAX_HP, p.hp + 25);
              pushHud('Дроп: аптечка +25 HP 🏆');
            }
          } else pushHud();
          if (best.type === 'boss') {
            gameStore.set({ phase: 'won' });
            pushHud();
            return;
          }
        } else pushHud();
      } else pushHud();
      if (shuba) shuba.update(0, true, false, 0.016);
    } else if (sim.reserve[sim.slot] > 0) {
      sim.reloadT = w.reload; // автоперезарядка на пустом магазине
    }
  }

  // Спавн очереди.
  if (sim.spawnQueue.length) {
    sim.spawnT -= dt;
    if (sim.spawnT <= 0) {
      spawnOne();
      sim.spawnT = 0.8;
      pushHud();
    }
  }

  // ИИ мобов: steering к игроку + сепарация + атаки.
  for (const e of sim.enemies) {
    if (e.anim.dying) continue; // труп: не ходит, не бьёт, ждёт death-клип
    const dx = p.x - e.x;
    const dz = p.z - e.z;
    const d = Math.hypot(dx, dz) || 1;
    const base = ENEMIES[e.type];
    let want = d;
    if (e.type === 'shooter') want = d - 12; // держит 12м
    if (Math.abs(want) > 0.5) {
      const v = base.speed * dt;
      e.x += (dx / d) * Math.sign(want) * v;
      e.z += (dz / d) * Math.sign(want) * v;
    }
    // Сепарация.
    for (const o of sim.enemies) {
      if (o === e) continue;
      const sx = e.x - o.x;
      const sz = e.z - o.z;
      const sd = Math.hypot(sx, sz);
      if (sd > 0.01 && sd < 1.2) {
        e.x += (sx / sd) * dt * 2;
        e.z += (sz / sd) * dt * 2;
      }
    }
    resolveCircle(e as { x: number; z: number }, 0.4, mapId);
    // Атаки по дистанции + кулдауну.
    e.cd -= dt;
    const reach = e.type === 'tank' ? ATTACK_RANGE.tank : e.type === 'boss' ? ATTACK_RANGE.boss : ATTACK_RANGE.melee;
    if (e.type === 'shooter') {
      if (d < ATTACK_RANGE.shooter && e.cd <= 0) {
        e.cd = 1.5;
        if (!sim.god) p.hp -= base.dmg * DIFF_MULT[difficulty] * sim.balanceMult;
        pushHud();
      }
    } else if (d <= reach && e.cd <= 0) {
      e.cd = e.type === 'tank' ? 2.5 : e.type === 'boss' ? 1.2 : 0.8;
      if (!sim.god) p.hp -= base.dmg * DIFF_MULT[difficulty] * sim.balanceMult;
      // Отброс танка/босса — ОТ моба (было: знак минус швырял игрока В моба,
      // камера прыгала на 1.5м прямо в пасть).
      if (e.type === 'tank' || e.type === 'boss') {
        p.x += (dx / d) * 1.5;
        p.z += (dz / d) * 1.5;
        resolveCircle(p, 0.4, mapId);
      }
      pushHud();
    }
  }
  // Босс: крик-спавн свиты — 2 раннера раз в 12с (кулдаун, один пуш).
  // Было: floor(timeSec)%12==0 && cd<=-0.4 пушил каждый тик целую секунду (~120 пушей).
  if (sim.wave >= 7 && sim.enemies.some((x) => x.type === 'boss')) {
    sim.summonCd -= dt;
    if (sim.summonCd <= 0) {
      sim.summonCd = 12;
      for (let i = 0; i < 2; i++) sim.spawnQueue.push({ type: 'runner' });
    }
  }

  // Автобаланс (урон мобам уже масштабирован при спавне; смерть → −15%, мин ×0.6).
  if (p.hp <= 0) {
    p.hp = 0;
    sim.deaths += 1;
    sim.balanceMult = Math.max(0.6, sim.balanceMult * 0.85);
    gameStore.set({ phase: 'lost' });
    pushHud();
    return;
  }

  // Конец волны → передышка 10с → следующая.
  if (!sim.spawnQueue.length && sim.enemies.length === 0 && snap.phase === 'playing') {
    if (sim.wave >= 7) {
      gameStore.set({ phase: 'won' });
      pushHud();
      return;
    }
    sim.intermission += dt;
    if (sim.intermission === dt) pushHud(`Волна ${sim.wave} зачищена 🏆`);
    if (sim.intermission >= 10) {
      sim.intermission = 0;
      // Точность>40% и без смертей → +15% сложности.
      const acc = sim.shots ? sim.hits / sim.shots : 0;
      if (sim.deaths === 0 && acc > 0.4) sim.balanceMult = Math.min(1.6, sim.balanceMult * 1.15);
      startWave(sim.wave + 1);
    }
  }

  hudT += dt;
  if (hudT > 0.25) {
    hudT = 0;
    pushHud();
  }
}
let hudT = 0;
let tickCount = 0;
let sprintKey = false;
window.addEventListener('keydown', (e) => {
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') sprintKey = true;
});
window.addEventListener('keyup', (e) => {
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') sprintKey = false;
});

// ---------- Кадр: фикс-степ sim + render-снапшот ----------
let last = performance.now();
let acc = 0;
let hudSync = 0;
let frameCount = 0;

function step(now: number) {
  lastStep = now;
  frameCount += 1;
  renderer.info.reset(); // Task 8: сброс счётчиков кадра (autoReset выкл — копим все проходы).
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.25) dt = 0.25;
  fpsAvg += ((dt > 0 ? 1 / dt : 60) - fpsAvg) * 0.05;

  // Адаптив: просадка <30 FPS 2с → emissive-режим + pixelRatio 1.
  if (fpsAvg < 30) {
    lowT += dt;
    if (lowT > 2 && !lowDetail) {
      lowDetail = true;
      grassRig.setLow(true); // Task 2: трава вполовину дешевле на просадке.
      scene.traverse((o) => {
        if ((o as THREE.SpotLight).isSpotLight) o.visible = false;
      });
      applySize();
    }
  } else {
    lowT = 0;
  }

  acc += dt;
  let n = 0;
  // Кэп 15 = покрытие dt-капа 0.25с; на живых 60fps аккумулятор больше 2 тиков не собирает.
  while (acc >= STEP && n < 15) {
    tick(STEP);
    acc -= STEP;
    n++;
  }

  const p = sim.player;
  const speed = Math.hypot(inputBus.move.x, inputBus.move.y) * 7;
  playerRoot.position.set(p.x, 0, p.z);
  playerRoot.rotation.y = p.yaw;
  if (shuba) shuba.update(speed, false, gameStore.get().phase === 'lost', dt);
  // Task 4: контроллер анима мобов. Скорость — из прошлого кадра (px/pz),
  // нормированная на ENEMIES.speed (updateMob ждёт бленд idle/walk 0..1,
  // сырая м/с давала бы вечный w=1). Смерть — death-клип 0.8с, потом remove.
  for (const e of [...sim.enemies]) {
    if (e.anim.dying) {
      e.anim.dieT -= dt;
      updateMob(e.mesh, { speed: 0, attacking: false, dying: true, dt });
      if (e.anim.dieT <= 0) {
        scene.remove(e.mesh);
        sim.enemies.splice(sim.enemies.indexOf(e), 1);
      }
      continue;
    }
    const base = ENEMIES[e.type];
    const raw = Math.hypot(e.x - e.px, e.z - e.pz) / Math.max(dt, 1e-4);
    const v = THREE.MathUtils.clamp(base.speed > 0 ? raw / base.speed : 0, 0, 1);
    e.px = e.x;
    e.pz = e.z;
    const cdMax = ATK_CD[e.type] ?? 0.8;
    // LOD миксеров: дальние (>26м) — каждый 2-й кадр с dt×2, визуально то же, CPU вдвое меньше.
    const distP = Math.hypot(e.x - p.x, e.z - p.z);
    e.farTick = !e.farTick;
    if (distP < 26 || e.farTick || e.cd > cdMax - 0.45) {
      updateMob(e.mesh, { speed: v, attacking: e.cd > cdMax - 0.45, dying: false, dt: e.farTick && distP >= 26 ? dt * 2 : dt });
    }
    e.mesh.position.set(e.x, 0, e.z);
    e.mesh.rotation.y = Math.atan2(p.x - e.x, p.z - e.z);
  }
  // Бюджет фонарей: горят ≤3 ближайших стрелка, линзы emissive светят всегда — ночью разницы ноль.
  {
    const shooters = sim.enemies.filter((e) => e.beam && !e.anim.dying);
    if (shooters.length > 0) {
      const flags = nearestFlags(shooters.map((e) => Math.hypot(e.x - p.x, e.z - p.z)), 3);
      shooters.forEach((e, i) => { if (e.beam) e.beam.visible = flags[i]; });
    }
  }
  tracers.update(dt);
  grassRig.tick(dt); // Task 2: ветер по траве.
  skyRig.tick(dt); // Task 1: дрейф облаков на куполе.
  if (medkitGroup) {
    const t = now / 1000;
    medkitGroup.children.forEach((g) => {
      const m = sim.pickups[g.userData.i];
      if (m.taken) { g.visible = false; return; }
      g.visible = true;
      g.position.y = 0.6 + Math.sin(t * 2 + g.userData.i) * 0.12;
      g.rotation.y += dt * 1.2;
    });
  }
  boomPool.update(dt);
  bloodPool.update(dt);
  sparkPool.update(dt);
  trailPool.update(dt);
  // Task 6: пружина отдачи, вспышка, гильзы, дым ствола.
  (gunMesh.userData.update as ((dt: number) => void) | undefined)?.(dt);
  if (flashT > 0) {
    flashT -= dt;
    if (flashT <= 0) flash.intensity = 0;
  }

  // Камера + viewmodel ствола. Питч и коллизию считает сам риг (порядок YXZ —
  // крена нет); хак rotation.x += после set удалён — он и давал «завал» при повороте.
  const view = getView();
  const def = MAPS[mapId];
  updateCamera(
    camera,
    { x: p.x, z: p.z, yaw: p.yaw, pitch: p.pitch ?? 0 },
    { dt, colliders: def.obstacles, half: def.size / 2 },
  );
  if (inputBus.aim) {
    camera.fov = 45;
    camera.updateProjectionMatrix();
  } else if (camera.fov !== 75) {
    camera.fov = 75;
    camera.updateProjectionMatrix();
  }
  if (view === 'first') {
    const dir = new THREE.Vector3(-Math.sin(p.yaw), 0, -Math.cos(p.yaw));
    gunMesh.position.copy(camera.position).addScaledVector(dir, 0.5);
    gunMesh.position.y -= 0.25;
    // Task 6: дуло модели строго -Z → rotation.y = yaw кладёт дуло по dir.
    // (Старое +PI было невидимо на симметричной коробке, разворачивало ствол назад.)
    gunMesh.rotation.set(0, p.yaw, 0);
    gunMesh.visible = true;
    playerRoot.visible = false;
  } else {
    // 3-е лицо: ствол на правом плече — та же сторона, что и камера рига.
    // Было левое плечо: ствол прятался за героем и выглядел «боком».
    gunMesh.position.set(p.x + Math.cos(p.yaw) * 0.35, 1.25, p.z - Math.sin(p.yaw) * 0.35);
    // Task 6: та же причина — ствол смотрит по курсу, а не вбок.
    gunMesh.rotation.set(0, p.yaw, 0);
    gunMesh.visible = true;
    playerRoot.visible = true;
  }

  hudSync += dt;
  if (hudSync > 0.5) {
    hudSync = 0;
    const s = gameStore.get();
    if (s.fps !== Math.round(fpsAvg) || s.phase === 'playing') pushHud();
  }
  // Task 8: bloom только на неоне; просадка <42 FPS — strength вниз, не выключаем.
  if (shouldBloom(mapId)) {
    const fx = ensureNeonFx();
    fx.bloom.strength = fpsAvg < 42 ? NEON_BLOOM_LOW : NEON_BLOOM.strength;
    fx.composer.render();
  } else {
    renderer.render(scene, camera);
  }
}

// rAF — основной драйвер; в headless композитор может не тикать —
// interval-watchdog ведёт тот же step, если кадр старше 100мс.
let lastStep = 0;
function frame(now: number) {
  requestAnimationFrame(frame);
  step(now);
}
setInterval(() => {
  const now = performance.now();
  if (now - lastStep > 100) step(now);
}, 50);
requestAnimationFrame(frame);
