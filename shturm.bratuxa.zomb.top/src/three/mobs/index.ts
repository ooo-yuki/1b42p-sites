import * as THREE from 'three';
import { makeRunner } from './runner';
import { makeShooter } from './shooter';
import { makeTank } from './tank';
import { makeSeagull } from './seagull';

export type MobKind = 'runner' | 'shooter' | 'tank' | 'seagull';

export function makeMob(kind: MobKind): THREE.Group {
  switch (kind) {
    case 'runner': return makeRunner();
    case 'shooter': return makeShooter();
    case 'tank': return makeTank();
    case 'seagull': return makeSeagull();
  }
}

/**
 * Просадка FPS → гасим SpotLight'ы стрелков, остаётся emissive-линза
 * (дешёвый минор Task 10: свет без теней всё равно дорог в массе).
 */
export function setMobLightDetail(root: THREE.Object3D, low: boolean): void {
  root.traverse((o) => {
    if ((o as THREE.SpotLight).isSpotLight) o.visible = !low;
  });
}

/** Заглушка: покадровое обновление моба (реализация — Task 4). */
export function updateMob(_root: THREE.Object3D, _dt: number): void {}
