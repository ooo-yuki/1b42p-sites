import * as THREE from 'three';
import { buildHumanoid, makeClips } from '../rig';
import { getTex } from '../textures';
import { phaseShiftRight } from './runner';

let camoMat: THREE.MeshStandardMaterial | null = null;
let fabricMat: THREE.MeshStandardMaterial | null = null;
let skinMat: THREE.MeshStandardMaterial | null = null;
let darkMat: THREE.MeshStandardMaterial | null = null;
let metalMat: THREE.MeshStandardMaterial | null = null;
let visorMat: THREE.MeshStandardMaterial | null = null;
let lensMat: THREE.MeshStandardMaterial | null = null;

function mats() {
  if (!camoMat) {
    const camoTex = getTex('camo').clone();
    camoTex.repeat.set(2, 2);
    camoTex.needsUpdate = true;
    camoMat = new THREE.MeshStandardMaterial({
      map: camoTex, bumpMap: camoTex, bumpScale: 0.4,
      color: 0xbdc8a8, roughness: 0.9, metalness: 0,
    });
    const fabTex = getTex('fabric').clone();
    fabTex.repeat.set(2, 2);
    fabTex.needsUpdate = true;
    fabricMat = new THREE.MeshStandardMaterial({
      map: fabTex, color: 0x8a8a90, roughness: 0.95, metalness: 0,
    });
    skinMat = new THREE.MeshStandardMaterial({ color: 0xd9a066, roughness: 0.7 });
    darkMat = new THREE.MeshStandardMaterial({ color: 0x232326, roughness: 0.85 });
    metalMat = new THREE.MeshStandardMaterial({ color: 0x3a3d44, roughness: 0.35, metalness: 0.8 });
    visorMat = new THREE.MeshStandardMaterial({
      color: 0x0a1420, emissive: 0x00c8ff, emissiveIntensity: 1.4,
      roughness: 0.2, metalness: 0.4,
    });
    lensMat = new THREE.MeshStandardMaterial({
      color: 0xfff2b0, emissive: 0xffee88, emissiveIntensity: 2.5, roughness: 0.3,
    });
  }
  return { camoMat: camoMat!, fabricMat: fabricMat!, skinMat: skinMat!, darkMat: darkMat!, metalMat: metalMat!, visorMat: visorMat!, lensMat: lensMat! };
}

function qx(deg: number): number[] {
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(deg), 0, 0));
  return [q.x, q.y, q.z, q.w];
}

export function makeShooter(): THREE.Group {
  const M = mats();
  const { root, bones } = buildHumanoid();
  const g = new THREE.Group();
  g.name = 'shooter';
  g.add(root);

  const order = [
    bones.hips, bones.spine, bones.head,
    bones.shoulderL, bones.elbowL, bones.handL,
    bones.shoulderR, bones.elbowR, bones.handR,
    bones.hipL, bones.kneeL, bones.footL,
    bones.hipR, bones.kneeR, bones.footR,
  ];
  const bi = new Map<THREE.Bone, number>(order.map((b, i) => [b, i]));

  const skinned: THREE.SkinnedMesh[] = [];
  const skinGeo = (geo: THREE.BufferGeometry, mat: THREE.Material, a: THREE.Bone, b: THREE.Bone, y: number, x = 0, z = 0) => {
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
    const m = new THREE.SkinnedMesh(geo, mat);
    m.castShadow = true;
    m.position.set(x, y, z);
    skinned.push(m);
    g.add(m);
    return m;
  };
  const cap = (r: number, len: number) => new THREE.CapsuleGeometry(r, len, 4, 10);

  // Коренастый торс: широкая капсула в камуфляже.
  const torso = skinGeo(cap(0.21, 0.4), M.camoMat, bones.spine, bones.hips, 1.15);
  torso.scale.set(1.25, 1, 0.8);
  // Бронежилет-пластина спереди.
  skinGeo(new THREE.BoxGeometry(0.34, 0.4, 0.06), M.fabricMat, bones.spine, bones.hips, 1.2, 0, -0.17);
  // Шея.
  skinGeo(cap(0.06, 0.1), M.skinMat, bones.head, bones.spine, 1.62);
  // Голова.
  const headGeo = new THREE.SphereGeometry(0.155, 16, 12);
  headGeo.scale(1, 1.15, 1);
  skinGeo(headGeo, M.skinMat, bones.head, bones.spine, 1.82);
  // Руки: рукава камо, предплечья камо.
  for (const s of ['L', 'R'] as const) {
    const sg = s === 'L' ? -1 : 1;
    skinGeo(cap(0.075, 0.2), M.camoMat, (bones as any)[`shoulder${s}`], (bones as any)[`elbow${s}`], 1.575, 0.3 * sg);
    skinGeo(cap(0.06, 0.2), M.camoMat, (bones as any)[`elbow${s}`], (bones as any)[`hand${s}`], 1.25, 0.3 * sg);
    // Ноги: штаны fabric, ботинки тёмные.
    skinGeo(cap(0.085, 0.28), M.fabricMat, (bones as any)[`hip${s}`], (bones as any)[`knee${s}`], 0.775, 0.13 * sg);
    skinGeo(cap(0.07, 0.28), M.darkMat, (bones as any)[`knee${s}`], (bones as any)[`foot${s}`], 0.325, 0.13 * sg);
  }

  g.updateMatrixWorld(true);
  const skeleton = new THREE.Skeleton(order);
  for (const m of skinned) {
    m.bind(skeleton);
    m.normalizeSkinWeights();
  }

  (bones as any).elbowL.rotation.x = -0.35;
  (bones as any).elbowR.rotation.x = -0.35;

  const add = (o: THREE.Object3D, parent: THREE.Object3D) => { parent.add(o); return o; };
  const box = (w: number, h: number, d: number, mat: THREE.Material) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.castShadow = true;
    return m;
  };

  // Каска: полусфера + козырёк.
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.175, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.55), M.darkMat);
  helmet.position.set(0, 0.05, 0);
  helmet.castShadow = true;
  add(helmet, bones.head);
  const brim = box(0.3, 0.03, 0.12, M.darkMat);
  brim.position.set(0, 0.06, -0.17);
  add(brim, bones.head);

  // Визор/прицел: светящаяся полоса на глазах.
  const visor = box(0.24, 0.07, 0.06, M.visorMat);
  visor.position.set(0, 0.02, -0.14);
  add(visor, bones.head);
  // Прицел-монокуляр справа.
  const scope = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 0.12, 10), M.metalMat);
  scope.rotation.x = Math.PI / 2;
  scope.position.set(0.1, 0.1, -0.1);
  scope.castShadow = true;
  add(scope, bones.head);
  const scopeGlass = new THREE.Mesh(new THREE.CircleGeometry(0.028, 10), M.visorMat);
  scopeGlass.position.set(0.1, 0.1, -0.165);
  scopeGlass.rotation.y = Math.PI;
  add(scopeGlass, bones.head);

  // Наплечник слева: приплюснутая пластина-купол, сидит на плече.
  const pad = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), M.metalMat);
  pad.scale.set(1.1, 0.62, 1.1);
  pad.position.set(-0.04, 0.02, 0);
  pad.castShadow = true;
  add(pad, (bones as any).shoulderL);
  const padTrim = box(0.16, 0.03, 0.16, M.darkMat);
  padTrim.position.set(-0.04, -0.035, 0);
  add(padTrim, (bones as any).shoulderL);

  // Пояс + подсумки.
  const belt = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.09, 0.3), M.darkMat);
  belt.position.set(0, 0.02, 0);
  belt.castShadow = true;
  add(belt, bones.hips);
  for (let i = -1; i <= 1; i++) {
    const pouch = box(0.11, 0.13, 0.08, M.fabricMat);
    pouch.position.set(0.14 * i, -0.08, -0.17);
    add(pouch, bones.hips);
    const flap = box(0.11, 0.04, 0.085, M.darkMat);
    flap.position.set(0.14 * i, -0.03, -0.17);
    add(flap, bones.hips);
  }
  // Фляга/подсумок на боку.
  const side = box(0.08, 0.16, 0.12, M.camoMat);
  side.position.set(0.27, -0.05, 0.02);
  add(side, bones.hips);

  // Фонарь в правой руке: корпус + линза + SpotLight внутри группы.
  const lamp = new THREE.Group();
  lamp.name = 'flashlight';
  lamp.position.set(0, -0.05, -0.08);
  add(lamp, (bones as any).handR);
  const lampBody = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 0.18, 12), M.metalMat);
  lampBody.rotation.x = Math.PI / 2;
  lampBody.castShadow = true;
  lamp.add(lampBody);
  const lampRing = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.012, 8, 16), M.darkMat);
  lampRing.position.set(0, 0, -0.09);
  lamp.add(lampRing);
  const lens = new THREE.Mesh(new THREE.CircleGeometry(0.048, 14), M.lensMat);
  lens.position.set(0, 0, -0.095);
  lens.rotation.y = Math.PI;
  lamp.add(lens);
  // Рукоять от кисти к фонарю.
  const grip = box(0.05, 0.05, 0.12, M.darkMat);
  grip.position.set(0, 0.02, 0.06);
  lamp.add(grip);
  const beam = new THREE.SpotLight(0xfff2b0, 12, 20, 0.32, 0.5, 1.2);
  beam.position.set(0, 0, -0.1);
  beam.target.position.set(0, -0.3, -6);
  lamp.add(beam);
  lamp.add(beam.target);

  // Кисть левой руки — кулак.
  const fist = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), M.skinMat);
  fist.position.set(0, -0.06, 0);
  fist.castShadow = true;
  add(fist, (bones as any).handL);

  // Миксер + экшены. Attack — вскидка фонаря-руки вперёд.
  const clips = makeClips('biped');
  const shifted = phaseShiftRight(clips.walk);
  clips.walk = new THREE.AnimationClip('walk', shifted.duration, [...shifted.tracks]);
  const attack = new THREE.AnimationClip('attack', 0.5, [
    new THREE.QuaternionKeyframeTrack('shoulderR.quaternion', [0, 0.2, 0.5],
      [...qx(-10), ...qx(-135), ...qx(-10)]),
    new THREE.QuaternionKeyframeTrack('elbowR.quaternion', [0, 0.2, 0.5],
      [...qx(-20), ...qx(-5), ...qx(-20)]),
  ]);
  clips.attack = attack;
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
