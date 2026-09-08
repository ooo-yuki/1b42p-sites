import * as THREE from 'three';
import { makeGun, type GunSlot } from './guns';
import { makeMob, type MobKind } from './mobs/index';

const detail = (g: THREE.Group): THREE.Group => {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.03, 24, 72),
    new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xff9d2e, emissiveIntensity: 1.2, metalness: 0.6, roughness: 0.3 }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.9;
  g.add(ring);
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.72, 0.015, 16, 72),
    new THREE.MeshBasicMaterial({ color: 0x4fc3f7 }),
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -0.92;
  g.add(rim);
  return g;
};

export function makeShowcaseGun(slot: GunSlot): THREE.Group {
  const g = makeGun(slot);
  g.scale.setScalar(1.15);
  return detail(g);
}

export function makeShowcaseMob(kind: MobKind): THREE.Group {
  const g = makeMob(kind);
  g.scale.setScalar(kind === 'seagull' ? 0.8 : 1.0);
  return detail(g);
}

export function stepYaw(yaw: number, vel: number, dt: number): { yaw: number; vel: number } {
  const nv = vel * Math.exp(-2.2 * dt);
  return { yaw: yaw + vel * dt, vel: Math.abs(nv) < 0.001 ? 0 : nv };
}
