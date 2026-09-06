import * as THREE from 'three';
import { getTex } from './textures';

export type GunSlot = 'pistol' | 'auto' | 'shotgun';

export interface GunUserData {
  /** Точка дула в локальных координатах (строго -Z). */
  muzzle: THREE.Vector3;
  /** Отдача: пружинный кик + вспышка на 2 кадра + гильза + дымок. */
  kick: () => void;
  /** Кадровый апдейт пружины/вспышки/гильз/дыма. main.tsx вызывает каждый кадр. */
  update: (dt: number) => void;
}

interface Shell {
  mesh: THREE.Mesh;
  vel: THREE.Vector3;
  spin: THREE.Vector3;
  life: number;
}

// --- Материалы (shared на модуль; текстуры кэширует getTex) ---
let _mats: {
  metal: THREE.MeshStandardMaterial;
  dark: THREE.MeshStandardMaterial;
  wood: THREE.MeshStandardMaterial;
  plastic: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  flash: THREE.MeshBasicMaterial;
  smoke: THREE.SpriteMaterial;
} | null = null;

function mats() {
  if (_mats) return _mats;
  const metal = new THREE.MeshStandardMaterial({
    color: 0x3a4048, metalness: 0.65, roughness: 0.42,
    roughnessMap: getTex('rust'), // потёртости воронения
  });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1d1f24, metalness: 0.6, roughness: 0.38 });
  const wood = new THREE.MeshStandardMaterial({ map: getTex('wood'), roughness: 0.6, metalness: 0.05 });
  const plastic = new THREE.MeshStandardMaterial({ color: 0x2a2c2e, roughness: 0.7, metalness: 0.1 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xd9b13b, metalness: 0.75, roughness: 0.35 });
  const flash = new THREE.MeshBasicMaterial({
    color: 0xffc45e, transparent: true, opacity: 0.95,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  });
  let smokeMap: THREE.Texture | null = null;
  try {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
    g.addColorStop(0, 'rgba(200,200,200,0.55)');
    g.addColorStop(1, 'rgba(200,200,200,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    smokeMap = new THREE.CanvasTexture(c);
  } catch {
    smokeMap = null;
  }
  const smokeParams: THREE.SpriteMaterialParameters = {
    color: 0xbbbbbb, transparent: true,
    opacity: 0, depthWrite: false,
  };
  if (smokeMap) smokeParams.map = smokeMap;
  const smoke = new THREE.SpriteMaterial(smokeParams);
  _mats = { metal, dark, wood, plastic, brass, flash, smoke };
  return _mats;
}

function box(
  parent: THREE.Object3D, w: number, h: number, d: number,
  mat: THREE.Material, x = 0, y = 0, z = 0, rx = 0,
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  if (rx) m.rotation.x = rx;
  m.castShadow = true;
  parent.add(m);
  return m;
}

function cyl(
  parent: THREE.Object3D, rTop: number, rBot: number, len: number, seg: number,
  mat: THREE.Material, x = 0, y = 0, z = 0, axis: 'z' | 'x' | 'y' = 'z',
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, len, seg), mat);
  if (axis === 'z') m.rotation.x = Math.PI / 2;
  if (axis === 'x') m.rotation.z = Math.PI / 2;
  m.position.set(x, y, z);
  m.castShadow = true;
  parent.add(m);
  return m;
}

// --- ПИСТОЛЕТ: затвор, мушка, рукоять, спусковая скоба. Дуло -Z. ---
function buildPistol(g: THREE.Group, M: ReturnType<typeof mats>): void {
  // Затвор (slide) + рамка
  box(g, 0.055, 0.055, 0.30, M.dark, 0, 0.035, -0.05);
  box(g, 0.048, 0.03, 0.26, M.metal, 0, 0.0, -0.04);
  // Насечки затвора: 6 полос с каждой стороны
  for (let i = 0; i < 6; i++) {
    const z = 0.05 + i * 0.012;
    box(g, 0.004, 0.03, 0.007, M.metal, -0.0285, 0.035, z);
    box(g, 0.004, 0.03, 0.007, M.metal, 0.0285, 0.035, z);
  }
  // Ствол-дуло + втулка
  cyl(g, 0.012, 0.012, 0.03, 24, M.metal, 0, 0.035, -0.205);
  cyl(g, 0.016, 0.016, 0.012, 24, M.dark, 0, 0.035, -0.198);
  // Мушка + целик
  box(g, 0.006, 0.014, 0.006, M.dark, 0, 0.07, -0.185);
  box(g, 0.014, 0.012, 0.008, M.dark, -0.014, 0.068, 0.085);
  box(g, 0.014, 0.012, 0.008, M.dark, 0.014, 0.068, 0.085);
  // Курок + предохранитель
  box(g, 0.012, 0.03, 0.012, M.metal, 0, 0.03, 0.105, -0.3);
  box(g, 0.052, 0.008, 0.02, M.metal, -0.03, 0.02, 0.03);
  // Рукоять (наклон) + накладки
  const grip = box(g, 0.05, 0.14, 0.06, M.plastic, 0, -0.075, 0.045);
  grip.rotation.x = 0.28;
  const gripL = box(g, 0.004, 0.11, 0.05, M.wood, -0.026, -0.075, 0.045);
  gripL.rotation.x = 0.28;
  const gripR = box(g, 0.004, 0.11, 0.05, M.wood, 0.026, -0.075, 0.045);
  gripR.rotation.x = 0.28;
  box(g, 0.052, 0.012, 0.062, M.dark, 0, -0.148, 0.065); // пятка магазина
  // Спусковая скоба (тор-сегмент) + крючок
  const guard = new THREE.Mesh(new THREE.TorusGeometry(0.032, 0.005, 10, 22, Math.PI * 1.2), M.metal);
  guard.position.set(0, -0.028, -0.045);
  guard.rotation.set(0, Math.PI / 2, Math.PI * 0.9);
  guard.castShadow = true;
  g.add(guard);
  box(g, 0.008, 0.03, 0.01, M.dark, 0, -0.02, -0.045, 0.25);
}

// --- АВТОМАТ: изогнутый рожок, приклад, цевьё, прицел-кольцо. ---
function buildAuto(g: THREE.Group, M: ReturnType<typeof mats>): void {
  // Ствольная коробка + крышка
  box(g, 0.06, 0.075, 0.42, M.metal, 0, 0.01, 0.05);
  box(g, 0.062, 0.02, 0.3, M.dark, 0, 0.055, 0.08);
  // Ствол + дульный тормоз с прорезями
  cyl(g, 0.013, 0.013, 0.34, 32, M.metal, 0, 0.02, -0.33);
  cyl(g, 0.02, 0.02, 0.07, 24, M.dark, 0, 0.02, -0.485);
  for (let i = 0; i < 3; i++) {
    box(g, 0.044, 0.008, 0.012, M.dark, 0, 0.028 + (i === 1 ? -0.016 : 0), -0.47 - i * 0.018);
  }
  // Газоотвод + мушка на стойке
  cyl(g, 0.01, 0.01, 0.22, 20, M.metal, 0, 0.055, -0.3);
  box(g, 0.008, 0.03, 0.008, M.dark, 0, 0.075, -0.4);
  box(g, 0.006, 0.014, 0.02, M.dark, 0, 0.085, -0.4);
  // Цевьё (дерево) + желобки
  box(g, 0.068, 0.06, 0.24, M.wood, 0, -0.005, -0.28);
  for (let i = 0; i < 4; i++) {
    box(g, 0.072, 0.008, 0.01, M.dark, 0, -0.02, -0.36 + i * 0.05);
  }
  // Изогнутый рожок: 3 сегмента под углом
  const mag1 = box(g, 0.045, 0.1, 0.07, M.metal, 0, -0.07, -0.05);
  mag1.rotation.x = 0.15;
  const mag2 = box(g, 0.045, 0.1, 0.07, M.metal, 0, -0.15, -0.085);
  mag2.rotation.x = 0.45;
  const mag3 = box(g, 0.045, 0.09, 0.07, M.plastic, 0, -0.215, -0.135);
  mag3.rotation.x = 0.75;
  box(g, 0.048, 0.015, 0.073, M.dark, 0, -0.255, -0.165); // пятка рожка
  // Приклад (дерево) + затыльник
  const stock = box(g, 0.055, 0.09, 0.26, M.wood, 0, -0.01, 0.38);
  stock.rotation.x = -0.06;
  box(g, 0.058, 0.1, 0.02, M.plastic, 0, -0.018, 0.515);
  // Пистолетная рукоять
  const pg = box(g, 0.045, 0.11, 0.055, M.plastic, 0, -0.08, 0.14);
  pg.rotation.x = 0.35;
  // Прицел: стойка + кольцо (тор) + целик
  box(g, 0.02, 0.04, 0.03, M.dark, 0, 0.085, 0.1);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.006, 12, 28), M.dark);
  ring.position.set(0, 0.115, 0.1);
  ring.castShadow = true;
  g.add(ring);
  box(g, 0.05, 0.015, 0.01, M.dark, 0, 0.07, 0.16);
  // Планка: основание + 8 слотов
  box(g, 0.05, 0.012, 0.3, M.dark, 0, 0.068, -0.05);
  for (let i = 0; i < 8; i++) box(g, 0.054, 0.008, 0.012, M.metal, 0, 0.072, -0.17 + i * 0.035);
  // Боковые винты + переводчик огня
  for (const [x, z] of [[-0.032, 0.0], [0.032, 0.0], [-0.032, 0.12], [0.032, 0.12]] as const) {
    cyl(g, 0.007, 0.007, 0.006, 12, M.dark, x, 0.01, z, 'x');
  }
  box(g, 0.008, 0.02, 0.05, M.metal, 0.035, -0.01, 0.05);
  // Скоба + крючок
  const guard = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.005, 10, 22, Math.PI * 1.2), M.metal);
  guard.position.set(0, -0.045, 0.06);
  guard.rotation.set(0, Math.PI / 2, Math.PI * 0.9);
  guard.castShadow = true;
  g.add(guard);
  box(g, 0.008, 0.028, 0.01, M.dark, 0, -0.038, 0.06, 0.25);
}

// --- ДРОБОВИК: помпа, толстый ствол, приклад. ---
function buildShotgun(g: THREE.Group, M: ReturnType<typeof mats>): void {
  // Толстый ствол + чок + мушка-бусина
  cyl(g, 0.021, 0.021, 0.56, 32, M.metal, 0, 0.03, -0.28);
  cyl(g, 0.024, 0.024, 0.05, 24, M.dark, 0, 0.03, -0.55);
  const bead = new THREE.Mesh(new THREE.SphereGeometry(0.008, 12, 10), M.brass);
  bead.position.set(0, 0.055, -0.52);
  g.add(bead);
  // Прицельная планка: основание + 5 стоек
  box(g, 0.014, 0.008, 0.5, M.dark, 0, 0.055, -0.28);
  for (let i = 0; i < 5; i++) box(g, 0.01, 0.012, 0.01, M.dark, 0, 0.047, -0.46 + i * 0.1);
  // Подствольный магазин-трубка + крышка
  cyl(g, 0.015, 0.015, 0.4, 24, M.metal, 0, -0.015, -0.3);
  cyl(g, 0.018, 0.018, 0.03, 20, M.dark, 0, -0.015, -0.5);
  // Помпа (дерево) + 3 ребра-кольца
  cyl(g, 0.026, 0.026, 0.16, 24, M.wood, 0, -0.015, -0.32);
  for (let i = 0; i < 3; i++) {
    const rib = new THREE.Mesh(new THREE.TorusGeometry(0.027, 0.004, 6, 16), M.wood);
    rib.position.set(0, -0.015, -0.357 + i * 0.042);
    rib.castShadow = true;
    g.add(rib);
  }
  // Ствольная коробка + окно выброса + затворная ручка
  box(g, 0.062, 0.08, 0.3, M.metal, 0, 0.0, 0.12);
  box(g, 0.02, 0.03, 0.1, M.dark, 0.025, 0.02, 0.1);
  cyl(g, 0.008, 0.008, 0.03, 12, M.dark, 0.04, 0.01, 0.16, 'x');
  // Приклад (дерево) + затыльник + щёка
  const stock = box(g, 0.056, 0.095, 0.28, M.wood, 0, -0.015, 0.4);
  stock.rotation.x = -0.05;
  box(g, 0.06, 0.105, 0.025, M.plastic, 0, -0.022, 0.545);
  box(g, 0.05, 0.02, 0.16, M.wood, 0, 0.04, 0.38);
  // Рукоять-шейка приклада
  const neck = box(g, 0.048, 0.1, 0.06, M.wood, 0, -0.075, 0.22);
  neck.rotation.x = 0.4;
  // Скоба + крючок
  const guard = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.005, 10, 22, Math.PI * 1.2), M.metal);
  guard.position.set(0, -0.05, 0.1);
  guard.rotation.set(0, Math.PI / 2, Math.PI * 0.9);
  guard.castShadow = true;
  g.add(guard);
  box(g, 0.008, 0.028, 0.01, M.dark, 0, -0.043, 0.1, 0.25);
  // Антабки (2 кольца под ремень)
  for (const z of [-0.42, 0.5] as const) {
    const sw = new THREE.Mesh(new THREE.TorusGeometry(0.012, 0.003, 8, 16), M.dark);
    sw.position.set(0, -0.045, z);
    g.add(sw);
  }
}

const BUILDERS: Record<GunSlot, { build: (g: THREE.Group, M: ReturnType<typeof mats>) => void; muzzleZ: number; impulse: number }> = {
  pistol: { build: buildPistol, muzzleZ: -0.225, impulse: 1.0 },
  auto: { build: buildAuto, muzzleZ: -0.525, impulse: 0.7 },
  shotgun: { build: buildShotgun, muzzleZ: -0.58, impulse: 1.7 },
};

/** Подсчёт треугольников группы (для тестов бюджета 1–3к). */
export function countTris(root: THREE.Object3D): number {
  let n = 0;
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const geo = mesh.geometry as THREE.BufferGeometry | undefined;
    if (!geo) return;
    const pos = geo.getAttribute('position');
    if (!pos) return;
    n += (geo.index ? geo.index.count : pos.count) / 3;
  });
  return Math.round(n);
}

export function makeGun(slot: GunSlot): THREE.Group {
  const M = mats();
  const cfg = BUILDERS[slot];
  const group = new THREE.Group();
  group.name = `gun-${slot}`;
  const inner = new THREE.Group(); // отдача двигает inner
  group.add(inner);
  cfg.build(inner, M);

  const muzzle = new THREE.Vector3(0, slot === 'pistol' ? 0.035 : slot === 'auto' ? 0.02 : 0.03, cfg.muzzleZ);

  // Вспышка: конус + ядро у дула, аддитив, видна 2 кадра после kick().
  const flashGrp = new THREE.Group();
  flashGrp.position.copy(muzzle);
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.2, 12, 1, true), M.flash);
  cone.rotation.x = -Math.PI / 2; // остриём к -Z
  cone.position.z = -0.1;
  const core = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), M.flash);
  flashGrp.add(cone, core);
  flashGrp.visible = false;
  inner.add(flashGrp);

  // Дымок: 3 спрайта у дула.
  const smokes: { s: THREE.Sprite; life: number }[] = [];
  for (let i = 0; i < 3; i++) {
    const sp = new THREE.Sprite(M.smoke.clone());
    sp.position.copy(muzzle);
    sp.scale.setScalar(0.08);
    (sp.material as THREE.SpriteMaterial).opacity = 0;
    inner.add(sp);
    smokes.push({ s: sp, life: 0 });
  }

  // Гильзы: пул 10 латунных боксов с гравитацией.
  const shells: Shell[] = [];
  const shellGeo = new THREE.BoxGeometry(0.012, 0.012, 0.026);
  for (let i = 0; i < 10; i++) {
    const m = new THREE.Mesh(shellGeo, M.brass);
    m.visible = false;
    m.castShadow = true;
    inner.add(m);
    shells.push({
      mesh: m,
      vel: new THREE.Vector3(),
      spin: new THREE.Vector3(),
      life: 0,
    });
  }
  let shellK = 0;

  // Пружина отдачи.
  let kickX = 0;
  let kickV = 0;
  let flashT = 0;
  const kick = () => {
    kickV += cfg.impulse * 3.2;
    flashT = 2 / 60; // вспышка ровно 2 кадра
    flashGrp.visible = true;
    flashGrp.scale.setScalar(0.9 + Math.random() * 0.4);
    flashGrp.rotation.z = Math.random() * Math.PI;
    // Гильза из окна выброса (справа, +X).
    const sh = shells[shellK++ % shells.length];
    sh.mesh.visible = true;
    sh.mesh.position.set(0.04, 0.02, 0.05);
    sh.vel.set(0.9 + Math.random() * 0.5, 1.3 + Math.random() * 0.5, 0.5 + Math.random() * 0.4);
    sh.spin.set(Math.random() * 20, Math.random() * 20, Math.random() * 20);
    sh.life = 1.3;
    // Дымок.
    const sm = smokes.find((s) => s.life <= 0) ?? smokes[0];
    sm.life = 0.8;
    sm.s.position.copy(muzzle).add(new THREE.Vector3(0, 0.01, -0.08));
    sm.s.scale.setScalar(0.07);
    (sm.s.material as THREE.SpriteMaterial).opacity = 0.5;
  };

  const update = (dt: number) => {
    const cdt = Math.min(dt, 0.05);
    // Пружина: жёсткость 180, демпфер 14.
    const acc = -180 * kickX - 14 * kickV;
    kickV += acc * cdt;
    kickX += kickV * cdt;
    inner.position.z = kickX * 0.055;
    inner.rotation.x = kickX * 0.11; // дуло вверх
    if (flashT > 0) {
      flashT -= cdt;
      if (flashT <= 0) flashGrp.visible = false;
    }
    for (const sm of smokes) {
      if (sm.life > 0) {
        sm.life -= cdt;
        sm.s.position.y += cdt * 0.25;
        sm.s.position.z -= cdt * 0.1;
        sm.s.scale.addScalar(cdt * 0.25);
        (sm.s.material as THREE.SpriteMaterial).opacity = Math.max(0, (sm.life / 0.8) * 0.5);
      }
    }
    for (const sh of shells) {
      if (sh.life > 0) {
        sh.life -= cdt;
        sh.vel.y -= 6.5 * cdt;
        sh.mesh.position.addScaledVector(sh.vel, cdt);
        sh.mesh.rotation.x += sh.spin.x * cdt;
        sh.mesh.rotation.y += sh.spin.y * cdt;
        if (sh.mesh.position.y < -0.4 || sh.life <= 0) {
          if (sh.life > 0.2) sh.life = 0.2; // докатилась — скоро гаснем
          sh.mesh.position.y = Math.max(sh.mesh.position.y, -0.4);
          sh.vel.multiplyScalar(0.9);
        }
        if (sh.life <= 0) sh.mesh.visible = false;
      }
    }
  };

  group.userData.muzzle = muzzle;
  group.userData.kick = kick;
  group.userData.update = update;
  // Подсвет вьюмодела: света карты бьют спереди, казённая часть у камеры тонет
  // в тени. Точечный fill едет вместе со стволом, дальность 5 — карту не моет.
  const fill = new THREE.PointLight(0xfff2dd, 2.2, 5, 1.6);
  fill.position.set(0, 0.35, 0.7);
  group.add(fill);
  return group;
}
