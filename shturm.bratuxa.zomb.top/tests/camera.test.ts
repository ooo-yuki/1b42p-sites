import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { updateCamera, collideEye, thirdEye, setView, snapCamera } from '../src/three/cameraRig';
import { createPlayer, movePlayer, WALK_SPEED } from '../src/sim/player';

const cam = () => new THREE.PerspectiveCamera(75, 1, 0.1, 300);

describe('камера: завал при повороте', () => {
  test('third: крен ноль при yaw+pitch', () => {
    setView('third');
    snapCamera();
    const c = cam();
    updateCamera(c, { x: 0, z: 0, yaw: 1.2, pitch: 0.5 }, { dt: 0.016 });
    expect(c.rotation.order).toBe('YXZ');
    expect(c.rotation.z).toBeCloseTo(0, 6);
  });
  test('first: yaw/pitch без крена', () => {
    setView('first');
    const c = cam();
    updateCamera(c, { x: 5, z: -3, yaw: -2.1, pitch: -0.7 });
    expect(c.rotation.z).toBeCloseTo(0, 6);
    expect(c.rotation.y).toBeCloseTo(-2.1, 6);
    expect(c.rotation.x).toBeCloseTo(-0.7, 6);
  });
});

describe('камера: 3-е лицо', () => {
  test('плечо крутится с yaw (не мировое +0.8)', () => {
    const e0 = thirdEye({ x: 0, z: 0, yaw: 0 });
    expect(e0.x).toBeCloseTo(0.8, 6);
    expect(e0.z).toBeCloseTo(2.2, 6);
    const e1 = thirdEye({ x: 0, z: 0, yaw: Math.PI });
    expect(e1.x).toBeCloseTo(-0.8, 6);
    expect(e1.z).toBeCloseTo(-2.2, 6);
  });
  test('герой в кадре: голова близко к центру', () => {
    setView('third');
    snapCamera();
    const c = cam();
    updateCamera(c, { x: 0, z: 0, yaw: 0, pitch: 0 }, { dt: 0.016 });
    c.updateMatrixWorld();
    const v = new THREE.Vector3(0, 1.5, 0).project(c);
    expect(v.z).toBeLessThan(1);
    expect(Math.abs(v.x)).toBeLessThan(0.6);
    expect(Math.abs(v.y)).toBeLessThan(0.6);
  });
});

describe('камера: стены и мобы', () => {
  test('не втыкается в круг-препятствие', () => {
    const head = new THREE.Vector3(0, 1.5, 5);
    const eye = new THREE.Vector3(0, 2.4, 9.2);
    const out = collideEye(head, eye, [{ x: 0, z: 8, r: 2 }], 21);
    expect(out.z).toBeLessThan(8 - 2);
    expect(out.z).toBeGreaterThan(5);
  });
  test('мобы не влияют: без коллайдеров дистанция полная', () => {
    const head = new THREE.Vector3(0, 1.5, 5);
    const eye = new THREE.Vector3(0, 2.4, 7.2);
    const out = collideEye(head, eye, [], 21);
    expect(out.distanceTo(eye)).toBeCloseTo(0, 6);
  });
});

describe('движение относительно yaw', () => {
  test('W при yaw=0 везёт на -Z', () => {
    const p = createPlayer();
    movePlayer(p, { fwd: 1, strafe: 0, sprint: false, dt: 1 }, 1);
    expect(p.vx).toBeCloseTo(0, 6);
    expect(p.vz).toBeCloseTo(-WALK_SPEED, 6);
  });
  test('W при yaw=π/2 везёт за камерой (-X)', () => {
    const p = createPlayer();
    p.yaw = Math.PI / 2;
    movePlayer(p, { fwd: 1, strafe: 0, sprint: false, dt: 1 }, 1);
    expect(p.vx).toBeCloseTo(-WALK_SPEED, 6);
    expect(p.vz).toBeCloseTo(0, 6);
  });
  test('D при yaw=0 — вправо +X', () => {
    const p = createPlayer();
    movePlayer(p, { fwd: 0, strafe: 1, sprint: false, dt: 1 }, 1);
    expect(p.vx).toBeCloseTo(WALK_SPEED, 6);
    expect(p.vz).toBeCloseTo(0, 6);
  });
});
