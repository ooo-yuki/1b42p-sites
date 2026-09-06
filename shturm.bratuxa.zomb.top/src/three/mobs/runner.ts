import * as THREE from 'three';
import { buildHumanoid, makeClips, phaseShiftRight } from '../rig';
import { getTex } from '../textures';

let furMat: THREE.MeshStandardMaterial | null = null;
let eyeMat: THREE.MeshStandardMaterial | null = null;
let darkMat: THREE.MeshStandardMaterial | null = null;
let teethMat: THREE.MeshStandardMaterial | null = null;
let clawMat: THREE.MeshStandardMaterial | null = null;

function mats() {
  if (!furMat) {
    // F2: мех должен читаться на скрине — клонируем shared-текстуру
    // (repeat shared менять нельзя, он общий), крупный repeat + bump тем же
    // канвасом + светлее base color, иначе тёмный мех сливается с ночью.
    const furTex = getTex('fur').clone();
    furTex.repeat.set(2, 2);
    furTex.needsUpdate = true;
    furMat = new THREE.MeshStandardMaterial({
      map: furTex,
      bumpMap: furTex,
      bumpScale: 0.6,
      color: 0xb59a7e,
      roughness: 0.95,
      metalness: 0,
    });
    eyeMat = new THREE.MeshStandardMaterial({ color: 0x1a0500, emissive: 0xff4400, emissiveIntensity: 3.2, roughness: 0.3 });
    darkMat = new THREE.MeshStandardMaterial({ color: 0x2a0f0a, roughness: 0.9 });
    teethMat = new THREE.MeshStandardMaterial({ color: 0xe8dcc0, roughness: 0.4 });
    clawMat = new THREE.MeshStandardMaterial({ color: 0x1c1c22, roughness: 0.35, metalness: 0.6 });
  }
  return { furMat: furMat!, eyeMat: eyeMat!, darkMat: darkMat!, teethMat: teethMat!, clawMat: clawMat! };
}

function qx(deg: number): number[] {
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(deg), 0, 0));
  return [q.x, q.y, q.z, q.w];
}

/**
 * F3: замах рук в walk — локтевые треки поверх статического сгиба.
 * elbowL в фазе с shoulderL, elbowR в противофазе (уже инвертирован).
 * База -26° (предплечье вперёд) ± 12° кач.
 */
function elbowTracks(): THREE.QuaternionKeyframeTrack[] {
  const T = [0, 0.3, 0.6];
  const L = new THREE.QuaternionKeyframeTrack('elbowL.quaternion', T, [...qx(-38), ...qx(-14), ...qx(-38)]);
  const R = new THREE.QuaternionKeyframeTrack('elbowR.quaternion', T, [...qx(-14), ...qx(-38), ...qx(-14)]);
  return [L, R];
}

export function makeRunner(): THREE.Group {
  const { furMat, clawMat } = mats();
  const { root, bones } = buildHumanoid();
  const g = new THREE.Group();
  g.name = 'runner';
  g.add(root);

  // Порядок костей общего скелета.
  const order = [
    bones.hips, bones.spine, bones.head,
    bones.shoulderL, bones.elbowL, bones.handL,
    bones.shoulderR, bones.elbowR, bones.handR,
    bones.hipL, bones.kneeL, bones.footL,
    bones.hipR, bones.kneeR, bones.footR,
  ];
  const bi = new Map<THREE.Bone, number>(order.map((b, i) => [b, i]));

  const skinned: THREE.SkinnedMesh[] = [];
  /**
   * F1: скруглённые объёмы вместо плоских коробок.
   * Любая BufferGeometry скинится по Y бокса между boneA(верх)/boneB(низ),
   * как skinBox из rig.ts (его не трогаем — хелпер локальный).
   */
  const skinGeo = (geo: THREE.BufferGeometry, a: THREE.Bone, b: THREE.Bone, y: number, x = 0, z = 0) => {
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    const h = Math.max(1e-5, bb.max.y - bb.min.y);
    const pos = geo.getAttribute('position') as THREE.BufferAttribute;
    const idx = new THREE.BufferAttribute(new Uint16Array(pos.count * 4), 4);
    const wgt = new THREE.BufferAttribute(new Float32Array(pos.count * 4), 4);
    const ia = bi.get(a)!;
    const ib = bi.get(b)!;
    for (let i = 0; i < pos.count; i++) {
      const t = THREE.MathUtils.clamp((bb.max.y - pos.getY(i)) / h, 0, 1);
      idx.setXYZW(i, ia, ib, 0, 0);
      wgt.setXYZW(i, 1 - t, t, 0, 0);
    }
    geo.setAttribute('skinIndex', idx);
    geo.setAttribute('skinWeight', wgt);
    const m = new THREE.SkinnedMesh(geo, furMat);
    m.castShadow = true;
    m.position.set(x, y, z);
    skinned.push(m);
    g.add(m);
    return m;
  };
  const cap = (r: number, len: number, mat = furMat) => {
    void mat;
    return new THREE.CapsuleGeometry(r, len, 4, 8);
  };

  // F1: крупные объёмы — капсулы/сферы. Торс-приплюснутая капсула,
  // голова-сфера, конечности-капсулы. ~3.7к треугольников (лимит 5к).
  const torso = skinGeo(cap(0.17, 0.42), bones.spine, bones.hips, 1.15);
  torso.scale.set(1, 1, 0.72);
  const headGeo = new THREE.SphereGeometry(0.165, 14, 10);
  headGeo.scale(0.95, 1.2, 1.0);
  skinGeo(headGeo, bones.head, bones.spine, 1.78);
  skinGeo(cap(0.07, 0.12), bones.head, bones.spine, 1.6); // шея — закрыть щель
  for (const s of ['L', 'R'] as const) {
    const sg = s === 'L' ? -1 : 1;
    skinGeo(cap(0.055, 0.24), (bones as any)[`shoulder${s}`], (bones as any)[`elbow${s}`], 1.575, 0.28 * sg);
    skinGeo(cap(0.045, 0.22), (bones as any)[`elbow${s}`], (bones as any)[`hand${s}`], 1.25, 0.28 * sg);
    skinGeo(cap(0.065, 0.32), (bones as any)[`hip${s}`], (bones as any)[`knee${s}`], 0.775, 0.12 * sg);
    skinGeo(cap(0.05, 0.32), (bones as any)[`knee${s}`], (bones as any)[`foot${s}`], 0.325, 0.12 * sg);
  }

  g.updateMatrixWorld(true);
  const skeleton = new THREE.Skeleton(order);
  for (const m of skinned) {
    m.bind(skeleton);
    m.normalizeSkinWeights();
  }

  // F3: статический сгиб локтей (перебивается walk-треками локтей в движении).
  (bones as any).elbowL.rotation.x = -0.45;
  (bones as any).elbowR.rotation.x = -0.45;

  const M = mats();
  const add = (o: THREE.Object3D, parent: THREE.Object3D) => { parent.add(o); return o; };
  const sph = (r: number, mat: THREE.Material, w = 12, h = 10) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, w, h), mat);
    return m;
  };

  // Глаза: emissive, на голове, смотрят вперёд (-Z).
  for (const s of [-1, 1]) {
    const e = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 6), M.eyeMat);
    e.position.set(0.068 * s, 0.03, -0.145);
    add(e, bones.head);
  }
  // Пасть: тёмный провал + нижняя челюсть + клыки.
  const jaw = sph(0.07, M.darkMat);
  jaw.scale.set(1.3, 0.45, 0.8);
  jaw.position.set(0, -0.07, -0.12);
  add(jaw, bones.head);
  for (const s of [-1, 0, 1]) {
    const f = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.05, 6), M.teethMat);
    f.position.set(0.05 * s, -0.1, -0.155);
    f.rotation.x = Math.PI;
    add(f, bones.head);
  }
  // Трапеция: скруглённый мост от торса к плечам (капсула лёжа).
  for (const s of [-1, 1]) {
    const trap = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.12, 3, 8), furMat);
    trap.rotation.z = Math.PI / 2 - 0.25 * s;
    trap.position.set(0.19 * s, 0.3, 0);
    trap.castShadow = true;
    add(trap, bones.spine);
  }
  // Гребень-шипы вдоль спины.
  for (let i = 0; i < 3; i++) {
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 6), M.clawMat);
    spike.position.set(0, 0.05 - i * 0.18, 0.13);
    spike.rotation.x = 0.9;
    add(spike, bones.spine);
  }
  // Когти на лапах (3 на кисть) и стопах.
  for (const s of ['L', 'R'] as const) {
    for (let c = -1; c <= 1; c++) {
      const claw = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.12, 6), M.clawMat);
      claw.position.set(0.03 * c, -0.07, -0.02);
      claw.rotation.x = Math.PI;
      add(claw, (bones as any)[`hand${s}`]);
      const toe = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.1, 6), M.clawMat);
      toe.position.set(0.035 * c, -0.03, -0.07);
      toe.rotation.x = -Math.PI / 2 - 0.2;
      add(toe, (bones as any)[`foot${s}`]);
    }
  }
  // Хвост-хлыст назад.
  const tail = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.55, 7), furMat);
  tail.position.set(0, 0.08, 0.32);
  tail.rotation.x = Math.PI / 2 - 0.5;
  tail.castShadow = true;
  add(tail, bones.hips);

  // Миксер + экшены.
  const clips = makeClips('biped');
  const shifted = phaseShiftRight(clips.walk);
  clips.walk = new THREE.AnimationClip('walk', shifted.duration, [...shifted.tracks, ...elbowTracks()]);
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
