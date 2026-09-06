import { describe, expect, test } from 'bun:test';
import * as THREE from 'three';
import { makeBoomPool, makeBloodPool, makeSparkPool, makeRocketTrail } from '../src/three/effects';

function scene() { return new THREE.Scene(); }
const P = (x = 1, y = 1, z = 2) => new THREE.Vector3(x, y, z);

describe('effects', () => {
  test('взрыв: fire зажигает свет 180, update гасит в 0 без NaN', () => {
    const s = scene();
    const boom = makeBoomPool(s);
    boom.fire(P());
    let light!: THREE.PointLight;
    s.traverse((o) => { if ((o as THREE.PointLight).isPointLight && (o as THREE.PointLight).intensity > 0) light = o as THREE.PointLight; });
    expect(light.intensity).toBe(180);
    expect(light.castShadow).toBe(false);
    for (let i = 0; i < 40; i++) boom.update(0.016);
    expect(light.intensity).toBe(0);
    s.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        const p = (o as THREE.Mesh).position;
        expect(Number.isNaN(p.x + p.y + p.z)).toBe(false);
      }
    });
  });

  test('взрыв большой: дольше и ярче малого', () => {
    const s = scene();
    const boom = makeBoomPool(s);
    boom.fire(P(), { big: true });
    let light!: THREE.PointLight;
    s.traverse((o) => { if ((o as THREE.PointLight).isPointLight && (o as THREE.PointLight).intensity > 0) light = o as THREE.PointLight; });
    expect(light.intensity).toBe(320);
    for (let i = 0; i < 30; i++) boom.update(0.016); // 0.48с — малый бы уже погас
    expect(light.intensity).toBeGreaterThan(0);
    for (let i = 0; i < 30; i++) boom.update(0.016);
    expect(light.intensity).toBe(0);
  });

  test('кровь: брызги падают с гравитацией, декаль на земле видна 10с', () => {
    const s = scene();
    const blood = makeBloodPool(s);
    blood.fire(P(0, 1.2, 0));
    let pts!: THREE.Points;
    s.traverse((o) => { if ((o as THREE.Points).isPoints && o.visible) { pts = o as THREE.Points; } });
    const y0 = (pts.geometry.getAttribute('position') as THREE.BufferAttribute).getY(0);
    blood.update(0.3);
    const y1 = (pts.geometry.getAttribute('position') as THREE.BufferAttribute).getY(0);
    expect(y1).toBeLessThan(y0); // гравитация тянет вниз
    // Декаль видна сразу и гаснет после 10с.
    const decals = s.children.filter((o) => (o as THREE.Mesh).isMesh && (o as THREE.Mesh).geometry.type === 'PlaneGeometry');
    expect(decals.length).toBeGreaterThan(0);
    const d0 = decals[0] as THREE.Mesh;
    expect(d0.visible).toBe(true);
    expect(Math.abs(d0.position.y - 0.02) < 0.01).toBe(true);
    blood.update(9.5);
    expect(d0.visible).toBe(true);
    blood.update(1);
    expect(d0.visible).toBe(false);
  });

  test('искры: гаснут за ~0.3с', () => {
    const s = scene();
    const sparks = makeSparkPool(s);
    sparks.fire(P());
    let pts!: THREE.Points;
    s.traverse((o) => { if ((o as THREE.Points).isPoints && o.visible) pts = o as THREE.Points; });
    expect(pts.visible).toBe(true);
    for (let i = 0; i < 25; i++) sparks.update(0.016);
    expect(pts.visible).toBe(false);
  });

  test('след ракеты: эмиттер дымит 1с, шлейф гаснет', () => {
    const s = scene();
    const trail = makeRocketTrail(s);
    trail.fire(P(0, 1, 0));
    for (let i = 0; i < 10; i++) trail.update(0.05); // 0.5с — дым активен
    const visible = s.children.filter((o) => (o as THREE.Sprite).isSprite && o.visible).length;
    expect(visible).toBeGreaterThan(0);
    for (let i = 0; i < 60; i++) trail.update(0.05); // всё отжило
    const left = s.children.filter((o) => (o as THREE.Sprite).isSprite && o.visible).length;
    expect(left).toBe(0);
  });
});
