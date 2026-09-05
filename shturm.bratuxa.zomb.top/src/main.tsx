import React from 'react';
import { createRoot } from 'react-dom/client';
import * as THREE from 'three';
import { App, inputBus } from './ui/App';
import { initScene } from './three/scene';
import { loadShuba, type Shuba } from './three/shuba';
import { makeMob, setMobLightDetail, type MobKind } from './three/mobs';
import { makeGun } from './three/guns';
import { makeTracerPool } from './three/effects';
import { buildMapVisual, disposeMapVisual } from './three/mapsVisual';
import { setView, getView, updateCamera } from './three/cameraRig';
import { createPlayer, movePlayer, type PlayerState } from './sim/player';
import { WEAPONS, fireShot, type Slot } from './sim/weapons';
import { ENEMIES } from './sim/enemies';
import { makeWave } from './sim/waves';
import { MAPS, resolveCircle, type MapId } from './sim/maps';
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
  cd: number;
  mesh: THREE.Group;
  bob: number;
}

const MAG: Record<Slot, number> = { pistol: 12, auto: 30, shotgun: 6 };
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
  spawnQueue: [] as { type: keyof typeof ENEMIES }[],
  spawnT: 0,
  intermission: 0,
  kills: 0,
  shots: 0,
  hits: 0,
  timeSec: 0,
  deaths: 0,
  lowHpStreak: 0,
  balanceMult: 1,
};

let mapId: MapId = 'yard';
let difficulty: Difficulty = 'veteran';
let fpsAvg = 60;
let lowDetail = false;
let lowT = 0;

// ---------- Three ----------
const { scene, camera, renderer } = initScene(canvas);
renderer.setSize(window.innerWidth, window.innerHeight);
let mapGroup = buildMapVisual(mapId);
scene.add(mapGroup);

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
const flash = new THREE.PointLight(0xffd27f, 0, 9, 1.6);
scene.add(flash);
let flashT = 0;

// ---------- Resize + pixelRatio (спек §11) ----------
function applySize() {
  const mobile = window.innerWidth < 768;
  const cap = mobile ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowDetail ? 1 : cap));
  renderer.setSize(window.innerWidth, window.innerHeight);
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
  pushHud();
}

// ---------- Волны ----------
function startWave(n: number) {
  sim.wave = n;
  sim.spawnQueue = makeWave(n).map((s) => ({ type: s.type as keyof typeof ENEMIES }));
  sim.spawnT = 0;
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
  mesh.position.set(x, 0, z);
  scene.add(mesh);
  sim.enemies.push({
    type: q.type, hp: base.hp * mult, maxHp: base.hp * mult, x, z, cd: 1, mesh, bob: Math.random() * 6,
  });
}

// ---------- Действия (меню/пауза/рестарт) ----------
function startGame(map: MapId, diff: Difficulty) {
  mapId = map;
  difficulty = diff;
  disposeMapVisual(scene, mapGroup);
  mapGroup = buildMapVisual(mapId);
  scene.add(mapGroup);
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
    island: { sky: 0x9fd4ff, fogNear: 25, fogFar: 110, hemi: 0.7, sun: 0xfff2d8, sunI: 1.6 },
    neon: { sky: 0x1a1033, fogNear: 12, fogFar: 70, hemi: 0.35, sun: 0xff9a5c, sunI: 0.9 },
  }[map];
  (scene.background as THREE.Color).set(mood.sky);
  if (scene.fog instanceof THREE.Fog) {
    scene.fog.color.set(mood.sky);
    scene.fog.near = mood.fogNear;
    scene.fog.far = mood.fogFar;
  }
  scene.traverse((o) => {
    if ((o as THREE.HemisphereLight).isHemisphereLight) (o as THREE.HemisphereLight).intensity = mood.hemi;
    if ((o as THREE.DirectionalLight).isDirectionalLight) {
      (o as THREE.DirectionalLight).color.set(mood.sun);
      (o as THREE.DirectionalLight).intensity = mood.sunI;
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
  dbg: () => ({ t: sim.timeSec, acc, fps: fpsAvg, n: tickCount, frames: frameCount, enemies: sim.enemies.length, queue: sim.spawnQueue.length }),
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
  // Обзор с правого стика (десктоп-мышь идёт через pointer-lock выше).
  p.yaw -= inputBus.look.dx * dt * 2;
  p.pitch = THREE.MathUtils.clamp((p.pitch ?? 0) - inputBus.look.dy * dt * 2, -1.2, 1.2);
  inputBus.look.dx *= 0.8;
  inputBus.look.dy *= 0.8;
  resolveCircle(p, 0.4, mapId);

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
      flash.position.copy(from);
      flash.intensity = 30;
      flashT = 0.06;
      // Хитскан: ближайший моб в конусе ±3° и дальности.
      let best: Enemy | null = null;
      let bestD = Infinity;
      for (const e of sim.enemies) {
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
        if (best.hp <= 0) {
          scene.remove(best.mesh);
          sim.enemies.splice(sim.enemies.indexOf(best), 1);
          sim.kills += 1;
          // Дроп 42%: патроны или аптечка.
          if (Math.random() < 0.42) {
            if (Math.random() < 0.5) {
              sim.reserve[sim.slot] += Math.ceil(MAG[sim.slot] / 2);
              pushHud('Дроп: патроны + 🏆');
            } else {
              p.hp = Math.min(100, p.hp + 25);
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
    const reach = e.type === 'tank' ? 3 : e.type === 'boss' ? 3.5 : 1.6;
    if (e.type === 'shooter') {
      if (d < 25 && e.cd <= 0) {
        e.cd = 1.5;
        p.hp -= base.dmg * DIFF_MULT[difficulty] * sim.balanceMult;
        pushHud();
      }
    } else if (d <= reach && e.cd <= 0) {
      e.cd = e.type === 'tank' ? 2.5 : e.type === 'boss' ? 1.2 : 0.8;
      p.hp -= base.dmg * DIFF_MULT[difficulty] * sim.balanceMult;
      // Отброс танка/босса.
      if (e.type === 'tank' || e.type === 'boss') {
        p.x += (dx / d) * -1.5;
        p.z += (dz / d) * -1.5;
        resolveCircle(p, 0.4, mapId);
      }
      pushHud();
    }
    // Босс: крик-спавн каждые 12с.
    if (e.type === 'boss' && Math.floor(sim.timeSec) % 12 === 0 && e.cd <= -0.4) {
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
  let dt = (now - last) / 1000;
  last = now;
  if (dt > 0.25) dt = 0.25;
  fpsAvg += ((dt > 0 ? 1 / dt : 60) - fpsAvg) * 0.05;

  // Адаптив: просадка <30 FPS 2с → emissive-режим + pixelRatio 1.
  if (fpsAvg < 30) {
    lowT += dt;
    if (lowT > 2 && !lowDetail) {
      lowDetail = true;
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
  for (const e of sim.enemies) {
    e.bob += dt * 6;
    e.mesh.position.set(e.x, Math.abs(Math.sin(e.bob)) * 0.06, e.z);
    e.mesh.rotation.y = Math.atan2(p.x - e.x, p.z - e.z);
  }
  tracers.update(dt);
  if (flashT > 0) {
    flashT -= dt;
    if (flashT <= 0) flash.intensity = 0;
  }

  // Камера + viewmodel ствола.
  const view = getView();
  updateCamera(camera, { x: p.x, z: p.z, yaw: p.yaw });
  camera.rotation.x += (p.pitch ?? 0) * 0.6;
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
    gunMesh.rotation.set(0, p.yaw + Math.PI, 0);
    gunMesh.visible = true;
    playerRoot.visible = false;
  } else {
    gunMesh.position.set(p.x - Math.cos(p.yaw) * 0.35, 1.25, p.z + Math.sin(p.yaw) * 0.35);
    gunMesh.rotation.set(0, p.yaw + Math.PI / 2, 0);
    gunMesh.visible = true;
    playerRoot.visible = true;
  }

  hudSync += dt;
  if (hudSync > 0.5) {
    hudSync = 0;
    const s = gameStore.get();
    if (s.fps !== Math.round(fpsAvg) || s.phase === 'playing') pushHud();
  }
  renderer.render(scene, camera);
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
