import * as THREE from 'three';
import { buildHumanoid, makeClips } from '../rig';
import { batchRigid, batchSkinned } from '../mobBatch';
import { getTex } from '../textures';

let rustMat: THREE.MeshStandardMaterial | null = null;
let darkMat: THREE.MeshStandardMaterial | null = null;
let plateMat: THREE.MeshStandardMaterial | null = null;
let visorMat: THREE.MeshStandardMaterial | null = null;
let underMat: THREE.MeshStandardMaterial | null = null;
let trimMat: THREE.MeshStandardMaterial | null = null;

function mats() {
  if (!rustMat) {
    const rustTex = getTex('rust').clone();
    rustTex.repeat.set(1, 1);
    rustTex.needsUpdate = true;
    rustMat = new THREE.MeshStandardMaterial({
      map: rustTex, bumpMap: rustTex, bumpScale: 0.6,
      color: 0xd8b088, roughness: 0.75, metalness: 0.45,
    });
    plateMat = new THREE.MeshStandardMaterial({ color: 0x4a4038, roughness: 0.45, metalness: 0.85 });
    darkMat = new THREE.MeshStandardMaterial({ color: 0x1e1c1a, roughness: 0.9 });
    underMat = new THREE.MeshStandardMaterial({ color: 0x3a2c20, roughness: 0.95 });
    trimMat = new THREE.MeshStandardMaterial({ color: 0x77664a, roughness: 0.55, metalness: 0.8 });
    visorMat = new THREE.MeshStandardMaterial({
      color: 0x140800, emissive: 0xff6600, emissiveIntensity: 2.8,
      roughness: 0.25, metalness: 0.3,
    });
  }
  return { rustMat: rustMat!, plateMat: plateMat!, darkMat: darkMat!, visorMat: visorMat!, underMat: underMat!, trimMat: trimMat! };
}

function qx(deg: number): number[] {
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(THREE.MathUtils.degToRad(deg), 0, 0));
  return [q.x, q.y, q.z, q.w];
}
function qz(deg: number): number[] {
  const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, THREE.MathUtils.degToRad(deg)));
  return [q.x, q.y, q.z, q.w];
}

/** Медленный тяжёлый шаг: период 1.2с, низкая частота, большой размах корпуса.
 * Позиционные треки пишутся ОТ базовых позиций костей (миксер ЗАМЕНЯЕТ
 * position треком, а не добавляет): голые нули уронили бы hips 1.1→0. */
function heavyWalk(hipsBase: THREE.Vector3, spineBase: THREE.Vector3): THREE.AnimationClip {
  const D = 1.2;
  const T = [0, D / 2, D];
  const tracks: THREE.QuaternionKeyframeTrack[] = [
    new THREE.QuaternionKeyframeTrack('hipL.quaternion', T, [...qx(-25), ...qx(25), ...qx(-25)]),
    new THREE.QuaternionKeyframeTrack('hipR.quaternion', T, [...qx(25), ...qx(-25), ...qx(25)]),
    new THREE.QuaternionKeyframeTrack('kneeL.quaternion', T, [...qx(10), ...qx(45), ...qx(10)]),
    new THREE.QuaternionKeyframeTrack('kneeR.quaternion', T, [...qx(45), ...qx(10), ...qx(45)]),
    new THREE.QuaternionKeyframeTrack('shoulderL.quaternion', T, [...qx(-22), ...qx(22), ...qx(-22)]),
    new THREE.QuaternionKeyframeTrack('shoulderR.quaternion', T, [...qx(22), ...qx(-22), ...qx(22)]),
    new THREE.QuaternionKeyframeTrack('hips.quaternion', T, [
      ...qz(-4), ...qz(4), ...qz(-4),
    ]),
  ];
  const hb = [hipsBase.x, hipsBase.y, hipsBase.z];
  const hbDip = [hipsBase.x - 0.05, hipsBase.y - 0.03, hipsBase.z];
  const sb = [spineBase.x, spineBase.y, spineBase.z];
  const sbDip = [spineBase.x, spineBase.y - 0.07, spineBase.z];
  const clip = new THREE.AnimationClip('walk', D, [
    ...tracks,
    // тяжёлая просадка корпуса
    new THREE.VectorKeyframeTrack('spine.position', T, [...sb, ...sbDip, ...sb]),
    new THREE.VectorKeyframeTrack('hips.position', T, [...hb, ...hbDip, ...hb]),
  ]);
  return clip;
}

/** Треки makeClips('biped') тоже писаны от нуля (idle spine, death hips) —
 * сдвигаем ключи на базу кости. rig.ts не трогаем, правим копию здесь. */
function rebasePosTrack(clip: THREE.AnimationClip, trackName: string, base: THREE.Vector3): void {
  const t = clip.tracks.find((x) => x.name === trackName) as THREE.VectorKeyframeTrack | undefined;
  if (!t) return;
  const v = t.values as unknown as number[];
  for (let i = 0; i < v.length; i += 3) {
    v[i] += base.x;
    v[i + 1] += base.y;
    v[i + 2] += base.z;
  }
}

export function makeTank(): THREE.Group {
  const M = mats();
  const { root, bones } = buildHumanoid();
  const g = new THREE.Group();
  g.name = 'tank';
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
  // rigid: жёсткая привязка всех вершин к одной кости (для мелких деталей
  // вдали от сустава — иначе вершины на «чужой» кости уносит движением).
  const skinGeo = (geo: THREE.BufferGeometry, mat: THREE.Material, a: THREE.Bone, b: THREE.Bone, y: number, x = 0, z = 0, rigid?: THREE.Bone) => {
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;
    const h = Math.max(1e-5, bb.max.y - bb.min.y);
    const pos = geo.getAttribute('position') as THREE.BufferAttribute;
    const idx = new THREE.BufferAttribute(new Uint16Array(pos.count * 4), 4);
    const wgt = new THREE.BufferAttribute(new Float32Array(pos.count * 4), 4);
    const ia = bi.get(a)!;
    const ib = bi.get(b)!;
    const ir = rigid ? bi.get(rigid)! : -1;
    for (let i = 0; i < pos.count; i++) {
      if (ir >= 0) {
        idx.setXYZW(i, ir, 0, 0, 0);
        wgt.setXYZW(i, 1, 0, 0, 0);
        continue;
      }
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
  const cap = (r: number, len: number) => new THREE.CapsuleGeometry(r, len, 3, 8);

  // Громила: торс-бочка в ржавой броне, в 1.4 раза шире.
  const torso = skinGeo(cap(0.26, 0.42), M.rustMat, bones.spine, bones.hips, 1.12);
  torso.scale.set(1.45, 1, 1.0);
  // Нагрудная плита + пластина живота (посажены вплотную, z −0.225/−0.21).
  skinGeo(new THREE.BoxGeometry(0.52, 0.34, 0.1), M.plateMat, bones.spine, bones.hips, 1.28, 0, -0.225);
  skinGeo(new THREE.BoxGeometry(0.44, 0.22, 0.08), M.plateMat, bones.spine, bones.hips, 1.0, 0, -0.21);
  // Спина-пластина вплотную (z 0.225, грань утоплена в торс).
  skinGeo(new THREE.BoxGeometry(0.5, 0.4, 0.08), M.plateMat, bones.spine, bones.hips, 1.2, 0, 0.225);
  // Светлый рант по краю нагрудной и спинной плит + заклёпки по углам.
  const rivetGeo = new THREE.SphereGeometry(0.022, 5, 4);
  const edge = (w: number, h: number, d: number, y: number, z: number) =>
    skinGeo(new THREE.BoxGeometry(w, h, d), M.trimMat, bones.spine, bones.hips, y, 0, z);
  edge(0.54, 0.035, 0.1, 1.465, -0.225);
  edge(0.54, 0.035, 0.1, 1.095, -0.225);
  edge(0.52, 0.035, 0.08, 1.415, 0.225);
  edge(0.52, 0.035, 0.08, 0.985, 0.225);
  for (const [ry, rz] of [[1.4, -0.28], [1.16, -0.28], [1.32, 0.28], [1.08, 0.28]] as const) {
    for (const rx of [-0.22, 0.22]) {
      skinGeo(rivetGeo, M.trimMat, bones.spine, bones.hips, ry, rx, rz, bones.spine);
    }
  }
  // Шея-столб + воротник закрывают стык.
  skinGeo(cap(0.1, 0.06), M.underMat, bones.head, bones.spine, 1.58);
  skinGeo(new THREE.CylinderGeometry(0.16, 0.22, 0.16, 8), M.plateMat, bones.head, bones.spine, 1.52);
  // Голова-шар + шлем.
  skinGeo(new THREE.SphereGeometry(0.15, 10, 7), M.underMat, bones.head, bones.spine, 1.78);

  // Руки-брёвна, ноги-столбы.
  for (const s of ['L', 'R'] as const) {
    const sg = s === 'L' ? -1 : 1;
    const shoulder = s === 'L' ? bones.shoulderL : bones.shoulderR;
    const elbow = s === 'L' ? bones.elbowL : bones.elbowR;
    const hand = s === 'L' ? bones.handL : bones.handR;
    const hip = s === 'L' ? bones.hipL : bones.hipR;
    const knee = s === 'L' ? bones.kneeL : bones.kneeR;
    const foot = s === 'L' ? bones.footL : bones.footR;
    skinGeo(cap(0.12, 0.2), M.rustMat, shoulder, elbow, 1.55, 0.34 * sg);
    skinGeo(cap(0.105, 0.2), M.underMat, elbow, hand, 1.22, 0.34 * sg);
    // Ноги-столбы: бедро +43%, голень +42% к черновику — держат массивный верх.
    skinGeo(cap(0.215, 0.26), M.rustMat, hip, knee, 0.75, 0.15 * sg);
    skinGeo(cap(0.185, 0.26), M.darkMat, knee, foot, 0.32, 0.15 * sg);
    // Набедренник + наколенник (шире, под новые объёмы).
    skinGeo(new THREE.BoxGeometry(0.36, 0.26, 0.36), M.plateMat, hip, knee, 0.95, 0.15 * sg);
    skinGeo(new THREE.BoxGeometry(0.28, 0.2, 0.14), M.plateMat, knee, foot, 0.55, 0.15 * sg, -0.14);
    // Рант набедренника спереди + заклёпки (жёстко на hip: у сустава бедра,
    // градиент hip→knee растягивал бы их сгибом колена в клинки).
    skinGeo(new THREE.BoxGeometry(0.37, 0.05, 0.05), M.trimMat, hip, knee, 1.04, 0.15 * sg, -0.18, hip);
    const hipRivetGeo = new THREE.SphereGeometry(0.022, 5, 4);
    skinGeo(hipRivetGeo, M.trimMat, hip, knee, 0.88, 0.15 * sg - 0.14, -0.19, hip);
    skinGeo(hipRivetGeo, M.trimMat, hip, knee, 0.88, 0.15 * sg + 0.14, -0.19, hip);
  }

  g.updateMatrixWorld(true);
  // Task 8: склейка скина по материалам ДО bind — меньше draw calls, вид тот же.
  batchSkinned(g, skinned);
  const skeleton = new THREE.Skeleton(order);
  for (const m of skinned) {
    m.bind(skeleton);
    m.normalizeSkinWeights();
  }

  bones.elbowL.rotation.x = -0.25;
  bones.elbowR.rotation.x = -0.25;

  const add = (o: THREE.Object3D, parent: THREE.Object3D) => { parent.add(o); return o; };
  const box = (w: number, h: number, d: number, mat: THREE.Material) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    // Мелочёвка обвеса тени не отбрасывает: только лишний проход shadow map.
    return m;
  };

  // Шлем: купол + козырёк-надбровник + прорезь-визор (emissive).
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.19, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.62), M.plateMat);
  dome.position.set(0, 0.05, 0.01);
  dome.castShadow = true;
  add(dome, bones.head);
  const brow = box(0.3, 0.06, 0.1, M.plateMat);
  brow.position.set(0, 0.03, -0.17);
  add(brow, bones.head);
  const visor = box(0.26, 0.06, 0.05, M.visorMat);
  visor.position.set(0, -0.03, -0.16);
  add(visor, bones.head);
  // Челюстная пластина + болты.
  const jawPlate = box(0.22, 0.1, 0.08, M.plateMat);
  jawPlate.position.set(0, -0.13, -0.12);
  add(jawPlate, bones.head);
  for (const bs of [-1, 1]) {
    const bolt = new THREE.Mesh(new THREE.SphereGeometry(0.02, 5, 4), M.darkMat);
    bolt.position.set(0.12 * bs, -0.13, -0.16);
    add(bolt, bones.head);
  }

  // Наплечники — скошенные плиты, не блины: купол выше и уже + наружная
  // скошенная плита + рант по нижней кромке + шип.
  for (const s of ['L', 'R'] as const) {
    const sg = s === 'L' ? -1 : 1;
    const shoulder = s === 'L' ? bones.shoulderL : bones.shoulderR;
    const pad = new THREE.Mesh(new THREE.SphereGeometry(0.19, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.6), M.rustMat);
    pad.scale.set(1.15, 1.0, 1.15);
    pad.position.set(-0.03 * sg, 0.02, 0);
    pad.castShadow = true;
    add(pad, shoulder);
    const slope = box(0.2, 0.13, 0.26, M.plateMat);
    slope.position.set(-0.09 * sg, 0.09, 0);
    slope.rotation.z = 0.32 * sg;
    add(slope, shoulder);
    const trim = box(0.24, 0.04, 0.24, M.trimMat);
    trim.position.set(-0.03 * sg, -0.05, 0);
    add(trim, shoulder);
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.14, 6), M.plateMat);
    spike.position.set(-0.03 * sg, 0.2, 0);
    add(spike, shoulder);
    for (const rs of [-1, 1]) {
      const rivet = new THREE.Mesh(new THREE.SphereGeometry(0.022, 5, 4), M.darkMat);
      rivet.position.set(-0.03 * sg + 0.1 * rs, -0.02, -0.13);
      add(rivet, shoulder);
    }
  }

  // Пояс-броня + юбка-пластины.
  const belt = box(0.56, 0.12, 0.4, M.plateMat);
  belt.position.set(0, 0.02, 0);
  belt.castShadow = true;
  add(belt, bones.hips);
  for (let i = -1; i <= 1; i++) {
    const skirt = box(0.14, 0.2, 0.06, M.rustMat);
    skirt.position.set(0.17 * i, -0.14, -0.2);
    add(skirt, bones.hips);
  }

  // Кулаки-тараны: цилиндры крупнее, вынесены вперёд + костяные шипы.
  for (const s of ['L', 'R'] as const) {
    const hand = s === 'L' ? bones.handL : bones.handR;
    const fist = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.155, 0.22, 8), M.plateMat);
    fist.position.set(0, -0.12, -0.06);
    fist.castShadow = true;
    add(fist, hand);
    for (let k = -1; k <= 1; k++) {
      const stud = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.07, 5), M.darkMat);
      stud.position.set(0.08 * k, -0.24, -0.06);
      stud.rotation.x = Math.PI;
      add(stud, hand);
    }
  }
  // Ботинки-блоки: шире и длиннее, под новые голени.
  for (const s of ['L', 'R'] as const) {
    const foot = s === 'L' ? bones.footL : bones.footR;
    const boot = box(0.28, 0.14, 0.42, M.plateMat);
    boot.position.set(0, -0.04, -0.09);
    boot.castShadow = true;
    add(boot, foot);
    const toe = box(0.28, 0.06, 0.1, M.trimMat);
    toe.position.set(0, -0.01, -0.28);
    add(toe, foot);
  }

  // Миксер + экшены. Attack — удар сверху вниз обеими руками.
  const clips = makeClips('biped');
  const hipsBase = bones.hips.position.clone();
  const spineBase = bones.spine.position.clone();
  rebasePosTrack(clips.idle, 'spine.position', spineBase);
  rebasePosTrack(clips.death, 'hips.position', hipsBase);
  const heavy = heavyWalk(hipsBase, spineBase);
  // heavyWalk уже написан в противофазе (R зеркалит L) — phaseShiftRight
  // здесь НЕ нужен: он бы инвертировал R обратно в фазу L (ноги вместе).
  clips.walk = heavy;
  const attack = new THREE.AnimationClip('attack', 0.7, [
    new THREE.QuaternionKeyframeTrack('shoulderL.quaternion', [0, 0.3, 0.5, 0.7],
      [...qx(-10), ...qx(-170), ...qx(60), ...qx(-10)]),
    new THREE.QuaternionKeyframeTrack('shoulderR.quaternion', [0, 0.3, 0.5, 0.7],
      [...qx(-10), ...qx(-170), ...qx(60), ...qx(-10)]),
    new THREE.QuaternionKeyframeTrack('elbowL.quaternion', [0, 0.3, 0.5, 0.7],
      [...qx(-15), ...qx(-40), ...qx(-5), ...qx(-15)]),
    new THREE.QuaternionKeyframeTrack('elbowR.quaternion', [0, 0.3, 0.5, 0.7],
      [...qx(-15), ...qx(-40), ...qx(-5), ...qx(-15)]),
    new THREE.QuaternionKeyframeTrack('spine.quaternion', [0, 0.3, 0.5, 0.7],
      [...qx(0), ...qx(-18), ...qx(22), ...qx(0)]),
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
  // Task 8: склейка rigid-декора по родителям — меньше draw calls, вид тот же.
  batchRigid(g);
  return g;
}
