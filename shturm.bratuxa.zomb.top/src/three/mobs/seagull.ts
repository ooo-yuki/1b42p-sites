import * as THREE from 'three';
import { buildWings } from '../rig';
import { getTex } from '../textures';

let featherMat: THREE.MeshStandardMaterial | null = null;
let greyMat: THREE.MeshStandardMaterial | null = null;
let beakMat: THREE.MeshStandardMaterial | null = null;
let eyeMat: THREE.MeshStandardMaterial | null = null;
let legMat: THREE.MeshStandardMaterial | null = null;
let tipMat: THREE.MeshStandardMaterial | null = null;

function mats() {
  if (!featherMat) {
    const featherTex = getTex('fabric').clone();
    featherTex.repeat.set(3, 3);
    featherTex.needsUpdate = true;
    // V2: map тёмный (#4a4a52) — белый цвет через умножение не получить,
    // поэтому map только в bump, а цвет задаём напрямую светло-серым.
    featherMat = new THREE.MeshStandardMaterial({
      bumpMap: featherTex, bumpScale: 0.4,
      color: 0xececef, roughness: 0.9, metalness: 0,
    });
    greyMat = new THREE.MeshStandardMaterial({ color: 0x9aa0a8, roughness: 0.85 });
    beakMat = new THREE.MeshStandardMaterial({ color: 0xf0a818, roughness: 0.45 });
    eyeMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0a, emissive: 0x1a0d05, emissiveIntensity: 0.3,
      roughness: 0.15, metalness: 0.2,
    });
    legMat = new THREE.MeshStandardMaterial({ color: 0xe87e1e, roughness: 0.65 });
    tipMat = new THREE.MeshStandardMaterial({ color: 0x3c4046, roughness: 0.9 });
  }
  return { featherMat: featherMat!, greyMat: greyMat!, beakMat: beakMat!, eyeMat: eyeMat!, legMat: legMat!, tipMat: tipMat! };
}

function qz(deg: number): number[] {
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, THREE.MathUtils.degToRad(deg)));
  return [q.x, q.y, q.z, q.w];
}
function qx(deg: number): number[] {
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(deg), 0, 0));
  return [q.x, q.y, q.z, q.w];
}

function mesh(geo: THREE.BufferGeometry, mat: THREE.Material): THREE.Mesh {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = true;
  return m;
}

/** Частые взмахи: крыло-брейк по трём сегментам, тело в воздухе. */
function flutterClip(): THREE.AnimationClip {
  const D = 0.5;
  const T = [0, D / 2, D];
  return new THREE.AnimationClip('walk', D, [
    new THREE.QuaternionKeyframeTrack('wingAL.quaternion', T, [...qz(28), ...qz(-30), ...qz(28)]),
    new THREE.QuaternionKeyframeTrack('wingAR.quaternion', T, [...qz(-28), ...qz(30), ...qz(-28)]),
    new THREE.QuaternionKeyframeTrack('wingBL.quaternion', T, [...qz(22), ...qz(-26), ...qz(22)]),
    new THREE.QuaternionKeyframeTrack('wingBR.quaternion', T, [...qz(-22), ...qz(26), ...qz(-22)]),
    new THREE.QuaternionKeyframeTrack('wingCL.quaternion', T, [...qz(16), ...qz(-20), ...qz(16)]),
    new THREE.QuaternionKeyframeTrack('wingCR.quaternion', T, [...qz(-16), ...qz(20), ...qz(-16)]),
  ]);
}

/** Парение idle: редкие мягкие взмахи + покачивание тела. */
function hoverClip(bodyBase: THREE.Vector3): THREE.AnimationClip {
  const D = 2;
  const T = [0, 1, 2];
  const b = [bodyBase.x, bodyBase.y, bodyBase.z];
  const bUp = [bodyBase.x, bodyBase.y + 0.08, bodyBase.z];
  return new THREE.AnimationClip('idle', D, [
    new THREE.QuaternionKeyframeTrack('wingAL.quaternion', T, [...qz(10), ...qz(-12), ...qz(10)]),
    new THREE.QuaternionKeyframeTrack('wingAR.quaternion', T, [...qz(-10), ...qz(12), ...qz(-10)]),
    new THREE.QuaternionKeyframeTrack('wingBL.quaternion', T, [...qz(8), ...qz(-10), ...qz(8)]),
    new THREE.QuaternionKeyframeTrack('wingBR.quaternion', T, [...qz(-8), ...qz(10), ...qz(-8)]),
    new THREE.VectorKeyframeTrack('body.position', T, [...b, ...bUp, ...b]),
  ]);
}

/** Пикирование клювом: крылья сложены, тело ныряет вперёд-вниз. */
function diveClip(bodyBase: THREE.Vector3): THREE.AnimationClip {
  const T = [0, 0.25, 0.5];
  const b = [bodyBase.x, bodyBase.y, bodyBase.z];
  const bDive = [bodyBase.x, bodyBase.y - 0.45, bodyBase.z - 0.55];
  return new THREE.AnimationClip('attack', 0.5, [
    new THREE.QuaternionKeyframeTrack('wingAL.quaternion', T, [...qz(10), ...qz(55), ...qz(10)]),
    new THREE.QuaternionKeyframeTrack('wingAR.quaternion', T, [...qz(-10), ...qz(-55), ...qz(-10)]),
    new THREE.QuaternionKeyframeTrack('wingBL.quaternion', T, [...qz(8), ...qz(70), ...qz(8)]),
    new THREE.QuaternionKeyframeTrack('wingBR.quaternion', T, [...qz(-8), ...qz(-70), ...qz(-8)]),
    new THREE.QuaternionKeyframeTrack('body.quaternion', T, [...qx(0), ...qx(-38), ...qx(0)]),
    new THREE.VectorKeyframeTrack('body.position', T, [...b, ...bDive, ...b]),
  ]);
}

/** Смерть: падение комком со сложенными крыльями. */
function fallClip(bodyBase: THREE.Vector3): THREE.AnimationClip {
  const T = [0, 0.8];
  const b = [bodyBase.x, bodyBase.y, bodyBase.z];
  const bDown = [bodyBase.x, 0.25, bodyBase.z + 0.2];
  return new THREE.AnimationClip('death', 0.8, [
    new THREE.QuaternionKeyframeTrack('wingAL.quaternion', T, [...qz(10), ...qz(75)]),
    new THREE.QuaternionKeyframeTrack('wingAR.quaternion', T, [...qz(-10), ...qz(-75)]),
    new THREE.QuaternionKeyframeTrack('wingBL.quaternion', T, [...qz(8), ...qz(80)]),
    new THREE.QuaternionKeyframeTrack('wingBR.quaternion', T, [...qz(-8), ...qz(-80)]),
    new THREE.QuaternionKeyframeTrack('body.quaternion', T, [...qx(0), ...qx(60)]),
    new THREE.VectorKeyframeTrack('body.position', T, [...b, ...bDown]),
  ]);
}

export function makeSeagull(): THREE.Group {
  const M = mats();
  const g = new THREE.Group();
  g.name = 'seagull';

  // Тело — отдельная именованная группа-«кость» для анимационных треков.
  const body = new THREE.Group();
  body.name = 'body';
  const BODY_Y = 1.7;
  body.position.set(0, BODY_Y, 0);
  g.add(body);

  // Крылья ОБЯЗАТЕЛЬНО через buildWings — кости сидят на теле.
  // V2: корни buildWings (y=0.2) проходят сквозь голову — опускаем до mid-body.
  const { wingL, wingR } = buildWings(body);
  for (const w of [...wingL, ...wingR]) void w;
  wingL[0].position.set(-0.28, 0.05, 0.05);
  wingR[0].position.set(0.28, 0.05, 0.05);

  const add = (o: THREE.Object3D, parent: THREE.Object3D) => { parent.add(o); return o; };

  // Тело-капля: капсула вдоль Z (голова смотрит на -Z) + вытянутая грудь.
  // Круг 2: тело вытянуто (0.55→0.62), грудь тянется к шее, голова больше.
  const torso = mesh(new THREE.CapsuleGeometry(0.24, 0.62, 4, 10), M.featherMat);
  torso.rotation.x = Math.PI / 2;
  torso.scale.set(1, 1, 1);
  torso.position.set(0, 0, 0.12);
  add(torso, body);
  const breast = mesh(new THREE.SphereGeometry(0.22, 12, 10), M.featherMat);
  breast.scale.set(0.95, 1.0, 1.15);
  breast.position.set(0, -0.08, -0.24);
  add(breast, body);
  // Шея — наклонный цилиндр от груди к голове (утоплена в обе, чтобы не
  // давать затенённой складки-«ошейника» спереди).
  const neck = mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.24, 10), M.featherMat);
  neck.rotation.x = 0.35;
  neck.position.set(0, 0.18, -0.4);
  add(neck, body);

  // Голова + клюв-конус (жёлтый) + глаза-бусины.
  // Круг 2: голова больше (r 0.19), посажена низко — низ сферы утоплен
  // в грудь, иначе камера снизу видит тёмную нижнюю полусферу («ошейник»).
  const head = mesh(new THREE.SphereGeometry(0.19, 14, 12), M.featherMat);
  head.position.set(0, 0.22, -0.45);
  add(head, body);
  const cap = mesh(new THREE.SphereGeometry(0.185, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.45), M.greyMat);
  cap.position.set(0, 0.245, -0.45);
  add(cap, body);
  const beak = mesh(new THREE.ConeGeometry(0.06, 0.3, 8), M.beakMat);
  beak.rotation.x = -Math.PI / 2;
  beak.position.set(0, 0.18, -0.72);
  add(beak, body);
  const beakLow = mesh(new THREE.ConeGeometry(0.032, 0.15, 6), M.beakMat);
  beakLow.rotation.x = -Math.PI / 2 + 0.12;
  beakLow.position.set(0, 0.145, -0.64);
  add(beakLow, body);
  for (const s of [-1, 1]) {
    const eye = mesh(new THREE.SphereGeometry(0.034, 8, 6), M.eyeMat);
    eye.position.set(0.115 * s, 0.28, -0.585);
    add(eye, body);
  }

  // Крылья: ступенчатое сужение хорды A→B→C + веер из 5 маховых перьев.
  // Круг 2: хорда 0.5→0.38→0.28 (были «доски» 0.5/0.42/0.34), перья — длинные
  // узкие вдоль размаха X: светлое основание + тёмный кончик, щели-прорези
  // (шаг 0.095 > ширины 0.088) + внахлёст по Y + веерное расхождение.
  const segGeoA = new THREE.BoxGeometry(0.7, 0.05, 0.5);
  const segGeoB = new THREE.BoxGeometry(0.62, 0.045, 0.38);
  const segGeoC = new THREE.BoxGeometry(0.5, 0.04, 0.28);
  const primBaseGeo = new THREE.BoxGeometry(0.32, 0.018, 0.088);
  const primTipGeo = new THREE.BoxGeometry(0.24, 0.016, 0.082);
  const sides: Array<{ bones: THREE.Bone[]; sg: number }> = [
    { bones: wingL, sg: -1 },
    { bones: wingR, sg: 1 },
  ];
  for (const { bones, sg } of sides) {
    const [a, b, c] = bones;
    const segA = mesh(segGeoA, M.featherMat);
    segA.position.set(0.35 * sg, 0, 0.05);
    add(segA, a);
    const covert = mesh(new THREE.BoxGeometry(0.5, 0.05, 0.3), M.greyMat);
    covert.position.set(0.3 * sg, 0.02, -0.05);
    add(covert, a);
    const segB = mesh(segGeoB, M.featherMat);
    segB.position.set(0.31 * sg, 0, 0.02);
    add(segB, b);
    const segC = mesh(segGeoC, M.greyMat);
    segC.position.set(0.25 * sg, 0, 0);
    add(segC, c);
    // Веер из 5 маховых перьев: продолжение размаха, концы уходят назад.
    for (let i = 0; i < 5; i++) {
      const f = i - 2; // -2..2
      const feather = new THREE.Group();
      feather.position.set(0.48 * sg, 0.004 * i, 0.095 * f);
      feather.rotation.y = -0.1 * f * sg;
      const base = mesh(primBaseGeo, i % 2 ? M.featherMat : M.greyMat);
      base.position.set(0.16 * sg, 0, 0.04);
      feather.add(base);
      const tip = mesh(primTipGeo, M.tipMat);
      tip.position.set(0.42 * sg, 0.001, 0.09);
      feather.add(tip);
      add(feather, c);
    }
  }

  // Хвост-веер: 5 перьев внахлёст, шире и толще (было 3 тонких — «палочка»).
  const tailGeo = new THREE.BoxGeometry(0.13, 0.03, 0.5);
  for (let i = 0; i < 5; i++) {
    const f = i - 2; // -2..2
    const t = mesh(tailGeo, i % 2 ? M.featherMat : M.greyMat);
    t.position.set(0.085 * f, 0.02 + 0.003 * i, 0.72 - 0.02 * Math.abs(f));
    t.rotation.y = 0.18 * f;
    add(t, body);
  }

  // Лапы: толще (r 0.028→0.042), перепонки шире (прижаты — птица в воздухе).
  for (const s of [-1, 1]) {
    const leg = mesh(new THREE.CylinderGeometry(0.042, 0.042, 0.34, 8), M.legMat);
    leg.rotation.x = Math.PI / 2 - 0.15;
    leg.position.set(0.11 * s, -0.24, 0.28);
    add(leg, body);
    const web = mesh(new THREE.BoxGeometry(0.16, 0.03, 0.2), M.legMat);
    web.position.set(0.11 * s, -0.27, 0.48);
    add(web, body);
    for (let toe = -1; toe <= 1; toe++) {
      const t = mesh(new THREE.ConeGeometry(0.024, 0.12, 5), M.legMat);
      t.rotation.x = Math.PI / 2;
      t.position.set(0.11 * s + 0.05 * toe, -0.27, 0.6);
      add(t, body);
    }
  }

  // Миксер + экшены: порхание/walk, парение/idle, пикирование/attack, падение/death.
  const bodyBase = body.position.clone();
  const clips = {
    idle: hoverClip(bodyBase),
    walk: flutterClip(),
    attack: diveClip(bodyBase),
    death: fallClip(bodyBase),
  };
  const mixer = new THREE.AnimationMixer(g);
  const mk = (clip: THREE.AnimationClip) => {
    const a = mixer.clipAction(clip);
    a.enabled = true;
    return a;
  };
  const actions = { idle: mk(clips.idle), walk: mk(clips.walk), attack: mk(clips.attack), death: mk(clips.death) };
  actions.idle.play();
  actions.walk.play();
  actions.walk.setEffectiveWeight(0);
  actions.attack.setLoop(THREE.LoopRepeat, Infinity);
  actions.death.setLoop(THREE.LoopOnce, 1);
  actions.death.clampWhenFinished = true;
  g.userData.mixer = mixer;
  g.userData.actions = actions;
  g.userData.dead = false;
  return g;
}
