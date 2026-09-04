import * as THREE from 'three';
import { C, sph, cyl, mat } from '../palette';

export type Role = 'waiter' | 'cook' | 'cleaner' | 'guest';

const APRON: Record<Role, number> = {
  waiter: 0xffd9c0,   // персик
  cook: 0xffffff,     // белый
  cleaner: 0xcdeac0,  // мята
  guest: 0xf6a5b8,    // перезаписывается случайной пастелью
};
const GUEST_TINTS = [0xf6a5b8, 0x9fd8c9, 0xbfe3ff, 0xffe6a3, 0xd9c0e8, 0xffd9c0];

export interface Person extends THREE.Group {
  userData: {
    update: (t: number, mode: 'idle' | 'walk' | 'sit') => void;
    role: Role;
    seed: number;
  };
}

// Кукла: голова-сфера + тело-капсула + глаза. Роль — цветом фартука
// (повар + белый колпак, уборщик + кепка, официант + поднос).
export function makePerson(role: Role, seed = Math.random() * 10): Person {
  const g = new THREE.Group() as Person;
  const tint = role === 'guest'
    ? GUEST_TINTS[Math.floor(Math.random() * GUEST_TINTS.length)]
    : APRON[role];

  // Тело-капсула (фартук)
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.26, 0.5, 4, 10),
    mat(tint),
  );
  body.position.y = 0.62;
  body.castShadow = true;
  g.add(body);

  // Голова
  const head = sph(0.24, 0xffe3c9, 0, 1.25, 0);
  g.add(head);
  // Глаза — две тёмные сферы
  const eyeMat = mat(C.ink, { rough: 0.4 });
  const eL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), eyeMat);
  eL.position.set(-0.09, 1.28, 0.2);
  const eR = eL.clone();
  eR.position.x = 0.09;
  g.add(eL, eR);
  // Румянец
  const blushMat = new THREE.MeshStandardMaterial({ color: 0xf6a5b8, roughness: 1, flatShading: true });
  for (const x of [-0.16, 0.16]) {
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 5), blushMat);
    b.position.set(x, 1.2, 0.17);
    b.scale.z = 0.4;
    g.add(b);
  }

  // Ноги-ботинки
  const boots = new THREE.Group();
  for (const x of [-0.11, 0.11]) {
    boots.add(sph(0.09, C.cocoa, x, 0.09, 0.02));
  }
  g.add(boots);

  // Руки-шарики (качаются при ходьбе)
  const armMat = mat(0xffe3c9);
  const aL = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), armMat);
  aL.position.set(-0.34, 0.75, 0);
  aL.castShadow = true;
  const aR = aL.clone();
  aR.position.x = 0.34;
  g.add(aL, aR);

  if (role === 'cook') {
    // Белый колпак + сковородка в руке
    g.add(cyl(0.2, 0.22, 0.22, 0xffffff, 0, 1.52, 0, 10));
    g.add(sph(0.1, C.steel, 0.42, 0.7, 0.1));
  } else if (role === 'waiter') {
    // Поднос
    const tray = cyl(0.22, 0.22, 0.04, 0xd9c9b8, 0.42, 0.95, 0.05, 10);
    g.add(tray);
    g.add(cyl(0.06, 0.05, 0.1, 0xffffff, 0.42, 1.02, 0.05, 8));
  } else if (role === 'cleaner') {
    // Кепка + швабра
    const cap = sph(0.16, C.mint, 0, 1.42, 0);
    cap.scale.y = 0.55;
    g.add(cap);
    const mop = cyl(0.025, 0.025, 1.0, C.woodDark, 0.42, 0.5, 0.1, 6);
    mop.rotation.z = 0.15;
    g.add(mop);
  }

  g.userData = {
    role, seed,
    update: (t: number, mode: 'idle' | 'walk' | 'sit') => {
      const s = t * 2 + seed * 7;
      if (mode === 'walk') {
        g.position.y = Math.abs(Math.sin(s * 2.4)) * 0.07;
        aL.position.z = Math.sin(s * 2.4) * 0.18;
        aR.position.z = -Math.sin(s * 2.4) * 0.18;
        body.rotation.x = 0.06;
      } else if (mode === 'sit') {
        g.position.y = -0.32;
        body.rotation.x = 0.1;
        aL.position.set(-0.3, 0.7, 0.2);
        aR.position.set(0.3, 0.7, 0.2);
        head.position.y = 1.25 + Math.sin(s * 1.2) * 0.015; // жуёт
      } else {
        // idle bob — дыхание
        g.position.y = Math.sin(s * 1.4) * 0.02;
        aL.position.z *= 0.95;
        aR.position.z *= 0.95;
        body.rotation.x = 0;
        head.rotation.y = Math.sin(s * 0.5) * 0.25;
      }
    },
  };
  return g;
}
