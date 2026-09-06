import * as THREE from 'three';

export type RigKind = 'biped' | 'wings';

function bone(name: string, parent: THREE.Object3D, x = 0, y = 0, z = 0): THREE.Bone {
  const b = new THREE.Bone();
  b.name = name;
  b.position.set(x, y, z);
  parent.add(b);
  return b;
}

export interface HumanoidBones extends Record<string, THREE.Bone> {
  hips: THREE.Bone; spine: THREE.Bone; head: THREE.Bone;
  shoulderL: THREE.Bone; elbowL: THREE.Bone; handL: THREE.Bone;
  shoulderR: THREE.Bone; elbowR: THREE.Bone; handR: THREE.Bone;
  hipL: THREE.Bone; kneeL: THREE.Bone; footL: THREE.Bone;
  hipR: THREE.Bone; kneeR: THREE.Bone; footR: THREE.Bone;
}

export function buildHumanoid(): { root: THREE.Group; bones: HumanoidBones } {
  const root = new THREE.Group();
  root.name = 'rig';
  const bones = {} as HumanoidBones;
  bones.hips = bone('hips', root, 0, 1.1, 0);
  bones.spine = bone('spine', bones.hips, 0, 0.35, 0);
  bones.head = bone('head', bones.spine, 0, 0.45, 0);
  for (const s of ['L', 'R'] as const) {
    const sg = s === 'L' ? -1 : 1;
    bones[`shoulder${s}`] = bone(`shoulder${s}`, bones.spine, 0.28 * sg, 0.3, 0);
    bones[`elbow${s}`] = bone(`elbow${s}`, bones[`shoulder${s}`], 0, -0.35, 0);
    bones[`hand${s}`] = bone(`hand${s}`, bones[`elbow${s}`], 0, -0.3, 0);
    bones[`hip${s}`] = bone(`hip${s}`, bones.hips, 0.12 * sg, -0.1, 0);
    bones[`knee${s}`] = bone(`knee${s}`, bones[`hip${s}`], 0, -0.45, 0);
    bones[`foot${s}`] = bone(`foot${s}`, bones[`knee${s}`], 0, -0.45, 0);
  }
  return { root, bones };
}

export function buildWings(root: THREE.Group): { wingL: THREE.Bone[]; wingR: THREE.Bone[] } {
  const mk = (s: 'L' | 'R') => {
    const sg = s === 'L' ? -1 : 1;
    const a = bone(`wingA${s}`, root, 0.3 * sg, 0.2, 0);
    const b = bone(`wingB${s}`, a, 0.7 * sg, 0, 0);
    const c = bone(`wingC${s}`, b, 0.7 * sg, 0, 0);
    return [a, b, c];
  };
  return { wingL: mk('L'), wingR: mk('R') };
}

/** Бокс, скиннованный к костям: вершины делятся по Y между boneA(верх)/boneB(низ). */
export function skinBox(w: number, h: number, d: number, boneA: THREE.Bone, boneB: THREE.Bone): THREE.SkinnedMesh {
  const g = new THREE.BoxGeometry(w, h, d, 1, 4, 1);
  const pos = g.attributes.position;
  const idx = new THREE.BufferAttribute(new Uint16Array(pos.count * 4), 4);
  const wgt = new THREE.BufferAttribute(new Float32Array(pos.count * 4), 4);
  // Индексы костей в skeleton: 0 = boneA, 1 = boneB (порядок задаёт вызывающий через Skeleton).
  for (let i = 0; i < pos.count; i++) {
    const t = THREE.MathUtils.clamp(0.5 - pos.getY(i) / h, 0, 1);
    idx.setXYZW(i, 0, 1, 0, 0);
    wgt.setXYZW(i, 1 - t, t, 0, 0);
  }
  g.setAttribute('skinIndex', idx);
  g.setAttribute('skinWeight', wgt);
  const m = new THREE.SkinnedMesh(g, new THREE.MeshStandardMaterial({ roughness: 0.8 }));
  m.castShadow = true;
  m.add(boneA); // кости должны быть в графе меша для updateMatrixWorld
  return m;
}

function q(axis: 'x' | 'z', deg: number): number[] {
  const e = new THREE.Euler(axis === 'x' ? THREE.MathUtils.degToRad(deg) : 0, 0, axis === 'z' ? THREE.MathUtils.degToRad(deg) : 0);
  const qq = new THREE.Quaternion().setFromEuler(e);
  return [qq.x, qq.y, qq.z, qq.w];
}

function swing(name: string, axis: 'x' | 'z', amp: number, dur: number): THREE.QuaternionKeyframeTrack {
  return new THREE.QuaternionKeyframeTrack(`${name}.quaternion`, [0, dur / 2, dur],
    [...q(axis, -amp), ...q(axis, amp), ...q(axis, -amp)]);
}

/**
 * Противофаза правой стороны walk: времена не трогаем, инвертируем размах
 * (кватернион -θ = conjugate: -x,-y,-z,w). Для симметричного треугольника
 * [-a,+a,-a] это точная полупериодная противофаза [+a,-a,+a], ключи строго
 * возрастают. Переехало из mobs/runner.ts — общее для двуногих.
 */
export function phaseShiftRight(walk: THREE.AnimationClip): THREE.AnimationClip {
  const tracks = walk.tracks.map((t) => {
    if (!/R\.quaternion$/.test(t.name)) return t;
    const n = t.times.length;
    const itemSize = t.values.length / n;
    const values = new Float32Array(t.values.length);
    for (let i = 0; i < n; i++) {
      values[i * itemSize] = -t.values[i * itemSize];
      values[i * itemSize + 1] = -t.values[i * itemSize + 1];
      values[i * itemSize + 2] = -t.values[i * itemSize + 2];
      for (let j = 3; j < itemSize; j++) values[i * itemSize + j] = t.values[i * itemSize + j];
    }
    const c = t.clone();
    c.values = values as unknown as THREE.KeyframeTrack['values'];
    return c;
  });
  return new THREE.AnimationClip(walk.name, walk.duration, tracks);
}

export function makeClips(_kind: RigKind): Record<'idle' | 'walk' | 'attack' | 'death', THREE.AnimationClip> {
  const idle = new THREE.AnimationClip('idle', 2, [
    new THREE.VectorKeyframeTrack('spine.position', [0, 1, 2], [0, 0, 0, 0, 0.03, 0, 0, 0, 0]),
  ]);
  const walk = new THREE.AnimationClip('walk', 0.6, [
    swing('hipL', 'x', 30, 0.6), swing('hipR', 'x', 30, 0.6),
    swing('kneeL', 'x', 40, 0.6), swing('kneeR', 'x', 40, 0.6),
    swing('shoulderL', 'x', 25, 0.6), swing('shoulderR', 'x', 25, 0.6),
  ]);
  const attack = new THREE.AnimationClip('attack', 0.4, [
    new THREE.QuaternionKeyframeTrack('shoulderR.quaternion', [0, 0.2, 0.4],
      [...q('x', 0), ...q('x', -120), ...q('x', 0)]),
  ]);
  const death = new THREE.AnimationClip('death', 0.8, [
    new THREE.QuaternionKeyframeTrack('hips.quaternion', [0, 0.8], [...q('x', 0), ...q('x', -90)]),
    new THREE.VectorKeyframeTrack('hips.position', [0, 0.8], [0, 0, 0, 0, -0.9, 0]),
  ]);
  return { idle, walk, attack, death };
}
