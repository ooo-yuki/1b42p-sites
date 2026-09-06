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

/** Покадровое обновление моба: бленд idle/walk по скорости, attack поверх, death один раз. */
export interface MobAnimState {
  speed: number;
  attacking: boolean;
  dying: boolean;
  dt: number;
}

export function updateMob(
  root: THREE.Object3D,
  state: MobAnimState,
): void {
  const mixer = root.userData.mixer as THREE.AnimationMixer | undefined;
  const actions = root.userData.actions as
    | Record<'idle' | 'walk' | 'attack' | 'death', THREE.AnimationAction>
    | undefined;
  if (!mixer || !actions) return;
  const dt = Math.max(0, state.dt);
  if (state.dying) {
    if (root.userData.dead !== true) {
      root.userData.dead = true;
      actions.idle.fadeOut(0.2);
      actions.walk.fadeOut(0.2);
      actions.attack.fadeOut(0.1);
      actions.death.reset().setLoop(THREE.LoopOnce, 1).play();
    }
    mixer.update(dt);
    return;
  }
  const w = THREE.MathUtils.clamp(state.speed ?? 0, 0, 1);
  if (!actions.idle.isRunning()) actions.idle.play();
  if (!actions.walk.isRunning()) actions.walk.play();
  actions.idle.setEffectiveWeight(1 - w);
  actions.walk.setEffectiveWeight(w);
  if (state.attacking) {
    if (!actions.attack.isRunning()) actions.attack.reset().fadeIn(0.1).play();
    actions.attack.setEffectiveWeight(1);
  } else if (actions.attack.isRunning()) {
    // F5: attack выходил снэпом — вход fadeIn 0.1 (выше), выход гасим
    // и останавливаем ТОЛЬКО когда вес догорел, иначе stop() режет в снэп.
    actions.attack.fadeOut(0.15);
    if (actions.attack.getEffectiveWeight() < 0.02) actions.attack.stop();
  }
  mixer.update(dt);
}
