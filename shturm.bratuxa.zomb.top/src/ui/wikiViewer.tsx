import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { makeShowcaseGun, makeShowcaseMob, stepYaw } from '../three/showcase';
import type { GunSlot } from '../three/guns';
import type { MobKind } from '../three/mobs/index';

const MOB_OF: Record<string, MobKind> = { runner: 'runner', shooter: 'shooter', tank: 'tank', boss: 'seagull' };

export function WikiViewer({ kind, id }: { kind: 'gun' | 'mob'; id: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    cam.position.set(0, 1.4, 4.2);
    cam.lookAt(0, 0.3, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.DirectionalLight(0xffe0b3, 1.6);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x4fc3f7, 1.1);
    rim.position.set(-4, 2, -3);
    scene.add(rim);
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(1.0, 1.15, 0.12, 48),
      new THREE.MeshStandardMaterial({ color: 0x141824, metalness: 0.7, roughness: 0.35 }),
    );
    disc.position.y = -1.0;
    scene.add(disc);

    let yaw = 0;
    let vel = 1.1;
    let drag = false;
    let px = 0;
    const onDown = (e: PointerEvent) => { drag = true; px = e.clientX; };
    const onMove = (e: PointerEvent) => { if (drag) { yaw += (e.clientX - px) * 0.01; px = e.clientX; vel = 0; } };
    const onUp = () => { drag = false; vel = 0.9; };
    renderer.domElement.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    let raf = 0;
    let t = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      if (!drag) {
        const s = stepYaw(yaw, vel === 0 ? 0.55 : vel, dt);
        yaw = s.yaw;
        vel = s.vel === 0 ? 0.55 : s.vel;
      }
      model.rotation.y = yaw;
      model.position.y = Math.sin(t * 1.6) * 0.08;
      const w = el.clientWidth || 300;
      const h = el.clientHeight || 300;
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      renderer.render(scene, cam);
      raf = requestAnimationFrame(tick);
    };
    const model = kind === 'gun'
      ? makeShowcaseGun(id as GunSlot)
      : makeShowcaseMob(MOB_OF[id] ?? 'runner');
    model.position.y = 0.2;
    scene.add(model);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      renderer.domElement.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry.dispose();
          const mt = m.material as THREE.Material | THREE.Material[];
          (Array.isArray(mt) ? mt : [mt]).forEach((x) => x.dispose());
        }
      });
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [kind, id]);

  return <div ref={ref} style={{ width: '100%', height: 320, cursor: 'grab', borderRadius: 12, background: 'radial-gradient(circle at 50% 35%, rgba(255,209,102,0.14), rgba(5,7,14,0) 70%)' }} />;
}
