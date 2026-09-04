import * as THREE from 'three';
import { C, sph, cyl, mat, box } from '../palette';

export type Role = 'waiter' | 'cook' | 'cleaner' | 'guest';

export interface Person extends THREE.Group {
  userData: {
    update: (t: number, mode: 'idle' | 'walk' | 'sit') => void;
    role: Role;
    seed: number;
  };
}

// 6 пастельных вариантов одежды гостей + тона кожи/волос
const GUEST_TINTS = [0xf6a5b8, 0x9fd8c9, 0xbfe3ff, 0xffe6a3, 0xd9c0e8, 0xffd9c0];
const SKINS = [0xffe3c9, 0xf5c9a3, 0xe0a983, 0xc98d64];
const HAIRS = [0x6b4a35, 0x3a2e28, 0xb07a4a, 0xd9a066, 0x8a8f98, 0xe8d9c8];
const PANTS: Record<Role, number> = {
  waiter: 0x4a3f38,
  cook: 0x8a8f98,
  cleaner: 0x5a6e7a,
  guest: 0x4a3f38, // перезаписывается под тон одежды
};
const APRON: Record<Role, number> = {
  waiter: 0xffd9c0,
  cook: 0xffffff,
  cleaner: 0xcdeac0,
  guest: 0xffffff,
};

// Детерминированный ГПСЧ из seed — гости различаются стабильно
function mulberry(seed: number): () => number {
  let a = Math.floor(seed * 1000 + 17) >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function capsule(r: number, len: number, color: number): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 4, 10), mat(color));
  m.castShadow = true;
  return m;
}

// Кукла на шарнирах: бедро→колено→голень, плечо→локоть→кисть.
// rig — внутренняя группа для bob/наклона: внешний трансформ
// принадлежит сцене (сидя гостя ставят на seat снаружи).
export function makePerson(role: Role, seed = Math.random() * 10): Person {
  const g = new THREE.Group() as Person;
  const R = mulberry(seed);
  const tint = role === 'guest' ? GUEST_TINTS[Math.floor(R() * GUEST_TINTS.length)] : 0;
  const shirt = role === 'waiter' ? 0xfff6ea : role === 'cook' ? 0xffffff
    : role === 'cleaner' ? 0xcdeac0 : tint;
  const pants = role === 'guest' ? C.ink : PANTS[role];
  const skin = SKINS[Math.floor(R() * SKINS.length)];
  const hairC = HAIRS[Math.floor(R() * HAIRS.length)];

  const rig = new THREE.Group();
  g.add(rig);

  // ---- Ноги: бедро (hip) + колено (knee) + голень + ботинок ----
  const hips: THREE.Group[] = [];
  const knees: THREE.Group[] = [];
  for (const sx of [-1, 1]) {
    const hip = new THREE.Group();
    hip.position.set(0.11 * sx, 0.82, 0);
    const thigh = capsule(0.09, 0.2, pants);
    thigh.position.y = -0.17;
    hip.add(thigh);
    const knee = new THREE.Group();
    knee.position.y = -0.36;
    const shin = capsule(0.07, 0.18, pants);
    shin.position.y = -0.15;
    knee.add(shin);
    const boot = sph(0.095, C.cocoa, 0, -0.31, 0.05);
    boot.scale.set(1, 0.75, 1.25);
    knee.add(boot);
    hip.add(knee);
    rig.add(hip);
    hips.push(hip);
    knees.push(knee);
  }

  // ---- Корпус ----
  const torso = new THREE.Group();
  torso.position.y = 0.82;
  rig.add(torso);
  const pelvis = sph(0.2, pants, 0, 0.05, 0);
  pelvis.scale.set(1.15, 0.8, 0.9);
  torso.add(pelvis);
  const belly = capsule(0.23, 0.28, shirt);
  belly.position.y = 0.3;
  torso.add(belly);
  // Грудь — отдельный меш: idle-дыхание меняет её масштаб
  const chest = sph(0.235, shirt, 0, 0.52, 0);
  const chestBase = new THREE.Vector3(1.05, 0.9, 0.85);
  chest.scale.copy(chestBase);
  torso.add(chest);
  // Фартук-нагрудник
  const apronC = role === 'guest' ? shirt : APRON[role];
  const apron = box(0.36, 0.42, 0.06, apronC, 0, 0.32, 0.21);
  torso.add(apron);
  if (role === 'cook') {
    // Пуговицы на фартуке
    for (let i = 0; i < 3; i++) {
      torso.add(sph(0.028, C.ink, 0.09, 0.44 - i * 0.13, 0.25));
    }
  } else if (role === 'waiter') {
    // Бабочка официанта
    const bow = box(0.12, 0.05, 0.04, C.ink, 0, 0.62, 0.2);
    torso.add(bow);
  }

  // ---- Руки: плечо (sh) + локоть (el) + кисть ----
  const shs: THREE.Group[] = [];
  const els: THREE.Group[] = [];
  for (const sx of [-1, 1]) {
    const sh = new THREE.Group();
    sh.position.set(0.33 * sx, 0.48, 0);
    const sleeve = capsule(0.07, 0.14, shirt);
    sleeve.position.y = -0.13;
    sh.add(sleeve);
    const el = new THREE.Group();
    el.position.y = -0.29;
    const fore = capsule(0.058, 0.14, skin);
    fore.position.y = -0.11;
    el.add(fore);
    const hand = sph(0.075, skin, 0, -0.25, 0);
    el.add(hand);
    sh.add(el);
    torso.add(sh);
    shs.push(sh);
    els.push(el);
  }

  // ---- Голова ----
  const head = new THREE.Group();
  head.position.y = 0.66; // ~1.48 над землёй
  torso.add(head);
  const skull = sph(0.23, skin, 0, 0.08, 0);
  head.add(skull);
  // Глаза — шкала Y используется для моргания
  const eyeGeo = new THREE.SphereGeometry(0.042, 8, 6);
  const eyeMat = mat(C.ink, { rough: 0.4 });
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
  eyeL.position.set(-0.085, 0.1, 0.19);
  const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
  eyeR.position.set(0.085, 0.1, 0.19);
  head.add(eyeL, eyeR);
  // Нос-пуговка
  head.add(sph(0.028, skin, 0, 0.04, 0.225));
  // Щёки-румянец: два розовых сплюснутых сфероида — всем
  const blushMat = new THREE.MeshStandardMaterial({
    color: 0xf6a5b8, roughness: 1, flatShading: true,
  });
  for (const sx of [-1, 1]) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 6), blushMat);
    b.position.set(0.15 * sx, 0.0, 0.155);
    b.scale.set(1, 0.7, 0.4);
    head.add(b);
  }
  // Шапка волос сзади — всем, чтобы затылок не был лысым
  const hairBack = sph(0.245, hairC, 0, 0.13, -0.045);
  hairBack.scale.set(1, 0.95, 1);
  head.add(hairBack);

  // Причёски гостей по seed: 0 пучок / 1 хвостик / 2 чёлка
  if (role === 'guest') {
    const hv = Math.floor(R() * 3);
    if (hv === 0) {
      head.add(sph(0.1, hairC, 0, 0.36, -0.05)); // пучок
      const tie = cyl(0.035, 0.035, 0.05, GUEST_TINTS[Math.floor(R() * 6)], 0, 0.28, -0.05, 8);
      head.add(tie);
    } else if (hv === 1) {
      const tail = capsule(0.06, 0.16, hairC);
      tail.position.set(0.12, 0.18, -0.24);
      tail.rotation.x = 0.7;
      tail.rotation.z = -0.3;
      head.add(tail);
    } else {
      // Чёлка — приплюснутая полусфера надо лбом
      const fringe = sph(0.2, hairC, 0, 0.22, 0.09);
      fringe.scale.set(1.05, 0.45, 0.8);
      head.add(fringe);
    }
  } else {
    // Персоналу — аккуратная чёлка-полоска
    const neat = sph(0.21, hairC, 0, 0.24, 0.02);
    neat.scale.set(1, 0.4, 1);
    head.add(neat);
  }

  // ---- Роль-реквизит ----
  if (role === 'waiter') {
    // Поднос в левой руке (привязан к предплечью — качается с рукой)
    const trayG = new THREE.Group();
    trayG.position.set(0, -0.3, 0.04);
    const tray = cyl(0.24, 0.24, 0.035, 0xd9c9b8, 0, 0, 0, 12);
    trayG.add(tray);
    trayG.add(cyl(0.055, 0.045, 0.1, 0xffffff, 0.08, 0.07, 0.02, 8)); // чашка
    trayG.add(sph(0.05, 0xf6a5b8, -0.09, 0.06, -0.03)); // десерт
    els[0].add(trayG);
  } else if (role === 'cook') {
    // Колпак: тулья + пышный верх
    head.add(cyl(0.19, 0.21, 0.2, 0xffffff, 0, 0.36, 0, 12));
    const puff = sph(0.2, 0xffffff, 0, 0.5, 0);
    puff.scale.y = 0.7;
    head.add(puff);
  } else if (role === 'cleaner') {
    // Кепка: приплюснутый верх + козырёк
    const cap = sph(0.17, C.mint, 0, 0.3, 0.01);
    cap.scale.y = 0.55;
    head.add(cap);
    head.add(box(0.2, 0.04, 0.18, C.mint, 0, 0.26, 0.22));
    // Швабра в правой руке
    const mopG = new THREE.Group();
    mopG.position.set(0, -0.26, 0.02);
    mopG.rotation.x = 0.25;
    const stick = cyl(0.022, 0.022, 1.1, C.woodDark, 0, -0.35, 0, 6);
    mopG.add(stick);
    mopG.add(box(0.13, 0.12, 0.13, 0xe8d9c8, 0, -0.92, 0)); // насадка
    els[1].add(mopG);
  } else {
    // Гость держит чашку перед собой — руки тянутся к ней в sit
    const cupG = new THREE.Group();
    cupG.position.set(0, 0.12, 0.36);
    cupG.add(cyl(0.05, 0.04, 0.09, 0xffffff, 0, 0, 0, 8));
    const tea = cyl(0.042, 0.042, 0.02, 0xb07a4a, 0, 0.035, 0, 8);
    cupG.add(tea);
    torso.add(cupG);
  }

  // Нейтраль — руки чуть от корпуса, чтобы не клипповали фартук
  shs[0].rotation.z = 0.12;
  shs[1].rotation.z = -0.12;

  g.userData = {
    role, seed,
    update: (t: number, mode: 'idle' | 'walk' | 'sit') => {
      const wt = t * 7 + seed * 6.28;      // фаза шага
      const br = t * 1.7 + seed * 3.0;     // фаза дыхания
      const breathe = Math.sin(br);
      // Моргание: ~0.12с закрыты каждые ~3.7с, со сдвигом по seed
      const blink = ((t * 0.9 + seed * 2.2) % 3.7) < 0.12 ? 0.12 : 1;
      eyeL.scale.y = blink;
      eyeR.scale.y = blink;
      // Дыхание груди — во всех режимах
      const bb = 1 + breathe * 0.035;
      chest.scale.set(chestBase.x * bb, chestBase.y, chestBase.z * (1 + breathe * 0.05));

      if (mode === 'walk') {
        const s = Math.sin(wt);
        // Ноги: бёдра в противофазе, колено сгибается на переносе
        hips[0].rotation.x = s * 0.6;
        hips[1].rotation.x = -s * 0.6;
        knees[0].rotation.x = 0.12 + Math.max(0, -s) * 0.95;
        knees[1].rotation.x = 0.12 + Math.max(0, s) * 0.95;
        // Руки в противофазе ногам (левая нога ↔ правая рука)
        if (role === 'waiter') {
          shs[0].rotation.x = -0.55; // поднос держим ровно
          els[0].rotation.x = -0.45;
        } else {
          shs[0].rotation.x = -s * 0.5;
          els[0].rotation.x = -0.25 - Math.max(0, s) * 0.3;
        }
        shs[1].rotation.x = s * 0.5;
        els[1].rotation.x = -0.25 - Math.max(0, -s) * 0.3;
        if (role === 'cleaner') els[1].rotation.x = -0.35;
        // Bob + лёгкий наклон корпуса вперёд
        rig.position.y = Math.abs(Math.cos(wt)) * 0.055;
        rig.rotation.x = 0.07;
        torso.rotation.x = 0.03;
        head.rotation.set(0.02, Math.sin(wt * 0.5) * 0.08, 0);
      } else if (mode === 'sit') {
        // Сидя: бедро вперёд 90°, голень вниз; таз опускает rig на стул.
        // Внешний трансформ (позиция/поворот на seat) не трогаем.
        hips[0].rotation.x = -1.45;
        hips[1].rotation.x = -1.45;
        knees[0].rotation.x = 1.35;
        knees[1].rotation.x = 1.35;
        rig.position.y = -0.27;
        rig.rotation.x = 0;
        torso.rotation.x = 0.1;
        // Руки вперёд к чашке
        shs[0].rotation.x = -0.85;
        shs[1].rotation.x = -0.85;
        els[0].rotation.x = -0.5;
        els[1].rotation.x = -0.5;
        // Жевание + взгляд на чашку
        head.rotation.set(0.18 + Math.sin(t * 5 + seed) * 0.02, Math.sin(br * 0.4) * 0.12, 0);
      } else {
        // Idle: ноги прямо, руки висят с лёгким покачиванием
        hips[0].rotation.x = 0;
        hips[1].rotation.x = 0;
        knees[0].rotation.x = 0.06;
        knees[1].rotation.x = 0.06;
        if (role === 'waiter') {
          shs[0].rotation.x = -0.55;
          els[0].rotation.x = -0.45;
        } else {
          shs[0].rotation.x = Math.sin(br * 0.5) * 0.05;
          els[0].rotation.x = -0.12;
        }
        shs[1].rotation.x = -Math.sin(br * 0.5) * 0.05;
        els[1].rotation.x = role === 'cleaner' ? -0.35 : -0.12;
        rig.position.y = breathe * 0.02;
        rig.rotation.x = 0;
        torso.rotation.x = 0;
        // Лёгкий осмотр по сторонам
        head.rotation.set(Math.sin(br * 0.7) * 0.04, Math.sin(t * 0.4 + seed * 2) * 0.3, 0);
      }
    },
  };
  return g;
}
