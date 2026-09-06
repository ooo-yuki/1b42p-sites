import * as THREE from 'three';
import { buildHumanoid, makeClips, skinBox } from '../rig';
import { getTex } from '../textures';

let furMat: THREE.MeshStandardMaterial | null = null;
let eyeMat: THREE.MeshStandardMaterial | null = null;
let darkMat: THREE.MeshStandardMaterial | null = null;
let teethMat: THREE.MeshStandardMaterial | null = null;
let clawMat: THREE.MeshStandardMaterial | null = null;

function mats() {
  if (!furMat) {
    furMat = new THREE.MeshStandardMaterial({ map: getTex('fur'), color: 0x8a7360, roughness: 0.95, metalness: 0 });
    eyeMat = new THREE.MeshStandardMaterial({ color: 0x1a0500, emissive: 0xff4400, emissiveIntensity: 3.2, roughness: 0.3 });
    darkMat = new THREE.MeshStandardMaterial({ color: 0x2a0f0a, roughness: 0.9 });
    teethMat = new THREE.MeshStandardMaterial({ color: 0xe8dcc0, roughness: 0.4 });
    clawMat = new THREE.MeshStandardMaterial({ color: 0x1c1c22, roughness: 0.35, metalness: 0.6 });
  }
  return { furMat: furMat!, eyeMat: eyeMat!, darkMat: darkMat!, teethMat: teethMat!, clawMat: clawMat! };
}

/** R-треки walk в противофазу: сдвиг времён +полпериода (mod длительности). */
export function phaseShiftRight(walk: THREE.AnimationClip): THREE.AnimationClip {
  const dur = walk.duration;
  const tracks = walk.tracks.map((t) => {
    if (!/R\.quaternion$/.test(t.name)) return t;
    const n = t.times.length;
    const pairs = Array.from({ length: n }, (_, i) => ({ t: (t.times[i] + dur / 2) % dur, i }));
    pairs.sort((a, b) => a.t - b.t);
    const times = new Float32Array(pairs.map((p) => p.t));
    const itemSize = t.values.length / n;
    const values = new Float32Array(t.values.length);
    pairs.forEach((p, k) => {
      for (let j = 0; j < itemSize; j++) values[k * itemSize + j] = t.values[p.i * itemSize + j];
    });
    const c = t.clone();
    c.times = times as unknown as THREE.KeyframeTrack['times'];
    c.values = values as unknown as THREE.KeyframeTrack['values'];
    return c;
  });
  return new THREE.AnimationClip(walk.name, dur, tracks);
}

export function makeRunner(): THREE.Group {
  const { furMat, clawMat } = mats();
  const { root, bones } = buildHumanoid();
  const g = new THREE.Group();
  g.name = 'runner';
  g.add(root);

  // Порядок костей общего скелета (skinBox пишет индексы 0/1 → ремапим).
  const order = [
    bones.hips, bones.spine, bones.head,
    bones.shoulderL, bones.elbowL, bones.handL,
    bones.shoulderR, bones.elbowR, bones.handR,
    bones.hipL, bones.kneeL, bones.footL,
    bones.hipR, bones.kneeR, bones.footR,
  ];
  const bi = new Map<THREE.Bone, number>(order.map((b, i) => [b, i]));

  const skinned: THREE.SkinnedMesh[] = [];
  // Точный вызов skinBox: он делает m.add(boneA) — возвращаем кость на место.
  const skin = (w: number, h: number, d: number, a: THREE.Bone, b: THREE.Bone, y: number, x = 0, z = 0) => {
    const parentA = a.parent!;
    const m = skinBox(w, h, d, a, b);
    parentA.add(a); // skinBox делает m.add(boneA) — возвращаем кость в риг
    const ia = bi.get(a)!;
    const ib = bi.get(b)!;
    const idx = m.geometry.getAttribute('skinIndex') as THREE.BufferAttribute;
    for (let i = 0; i < idx.count; i++) {
      const v0 = idx.getX(i) === 0 ? ia : ib;
      const v1 = idx.getY(i) === 0 ? ia : ib;
      idx.setXYZW(i, v0, v1, 0, 0);
    }
    idx.needsUpdate = true;
    m.material = furMat;
    m.position.set(x, y, z);
    skinned.push(m);
    g.add(m);
    return m;
  };

  // Тощий гуманоид: узкий торс, длинные конечности.
  skin(0.34, 0.75, 0.22, bones.spine, bones.hips, 1.15); // торс
  skin(0.26, 0.38, 0.28, bones.head, bones.spine, 1.8); // голова+шея
  for (const s of ['L', 'R'] as const) {
    const sg = s === 'L' ? -1 : 1;
    skin(0.09, 0.35, 0.09, (bones as any)[`shoulder${s}`], (bones as any)[`elbow${s}`], 1.575, 0.28 * sg);
    skin(0.08, 0.3, 0.08, (bones as any)[`elbow${s}`], (bones as any)[`hand${s}`], 1.25, 0.28 * sg);
    skin(0.11, 0.45, 0.11, (bones as any)[`hip${s}`], (bones as any)[`knee${s}`], 0.775, 0.12 * sg);
    skin(0.09, 0.45, 0.09, (bones as any)[`knee${s}`], (bones as any)[`foot${s}`], 0.325, 0.12 * sg);
  }

  g.updateMatrixWorld(true);
  const skeleton = new THREE.Skeleton(order);
  for (const m of skinned) {
    // Риг целиком один раз в граф (g.add(root) выше); общий скелет на все меши.
    // m.add(root) на каждый меш невозможен: root один, переподвешивание 10 раз
    // смещает весь риг на позицию последнего меша (наблюдалось как «парящие глаза»).
    m.bind(skeleton);
    m.normalizeSkinWeights();
  }

  const M = mats();
  const add = (o: THREE.Object3D, parent: THREE.Object3D) => { parent.add(o); return o; };
  const box = (w: number, h: number, d: number, mat: THREE.Material) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.castShadow = true;
    return m;
  };

  // Глаза: emissive, на голове, смотрят вперёд (-Z).
  for (const s of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 10), M.eyeMat);
    e.position.set(0.07 * s, 0.1, -0.15);
    add(e, bones.head);
  }
  // Пасть: тёмный провал + нижняя челюсть + клыки.
  const jaw = box(0.18, 0.05, 0.1, M.darkMat);
  jaw.position.set(0, -0.06, -0.14);
  add(jaw, bones.head);
  for (const s of [-1, 0, 1]) {
    const f = box(0.025, 0.05, 0.025, M.teethMat);
    f.position.set(0.05 * s, -0.08, -0.17);
    add(f, bones.head);
  }
  // Гребень-шипы вдоль спины.
  for (let i = 0; i < 3; i++) {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 6), M.clawMat);
    spike.position.set(0, 0.05 - i * 0.18, 0.13);
    spike.rotation.x = 0.9;
    spike.castShadow = true;
    add(spike, bones.spine);
  }
  // Когти на лапах (3 на кисть) и стопах.
  for (const s of ['L', 'R'] as const) {
    for (let c = -1; c <= 1; c++) {
      const claw = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.12, 6), M.clawMat);
      claw.position.set(0.03 * c, -0.06, -0.02);
      claw.rotation.x = Math.PI;
      claw.castShadow = true;
      add(claw, (bones as any)[`hand${s}`]);
      const toe = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.1, 6), M.clawMat);
      toe.position.set(0.035 * c, -0.03, -0.07);
      toe.rotation.x = -Math.PI / 2 - 0.2;
      toe.castShadow = true;
      add(toe, (bones as any)[`foot${s}`]);
    }
  }
  // Хвост-хлыст назад.
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.55, 7), furMat);
  tail.position.set(0, -0.05, 0.3);
  tail.rotation.x = Math.PI / 2 + 0.35;
  tail.castShadow = true;
  add(tail, bones.hips);

  // Миксер + экшены.
  const clips = makeClips('biped');
  clips.walk = phaseShiftRight(clips.walk);
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

