import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { makeGun, type GunSlot } from '../three/guns';
import { makeMob, type MobKind } from '../three/mobs';
import type { EnemyType } from '../sim/enemies';

export type ViewerSel =
  | { kind: 'gun'; id: GunSlot }
  | { kind: 'mob'; id: EnemyType };

const enemyToMob = (t: EnemyType): { mob: MobKind; scale: number } => {
  if (t === 'boss') return { mob: 'seagull', scale: 1.6 };
  return { mob: t as MobKind, scale: 1 };
};

function disposeDeep(root: THREE.Object3D) {
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (mesh.isMesh) {
      mesh.geometry?.dispose?.();
      const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(m)) m.forEach((x) => x.dispose?.());
      else m?.dispose?.();
    }
  });
}

/**
 * Витрина как в Destiny-инспекте / CoD Gunsmith / Warframe-арсенале:
 * тёмная студия, светящийся стенд-диск, модель парит и крутится, статы рядом (в wiki.tsx).
 */
export function WikiViewer({ sel }: { sel: ViewerSel }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0e17, 0.06);

    const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 60);

    // Студийный свет: полусфера + ключ спереди + циановый rim сзади + янтарь снизу.
    scene.add(new THREE.HemisphereLight(0x8fb4ff, 0x1a1410, 0.75));
    const key = new THREE.DirectionalLight(0xfff2dd, 1.7);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = new THREE.SpotLight(0x00e5ff, 60, 30, Math.PI / 5, 0.5, 1.6);
    rim.position.set(-4, 3.5, -4);
    rim.target.position.set(0, 0.6, 0);
    scene.add(rim, rim.target);
    const under = new THREE.PointLight(0xffd166, 6, 6, 1.8);
    under.position.set(0, 0.12, 0);
    scene.add(under);

    // Стенд: тёмный диск + янтарное кольцо + мягкий неоновый ободок.
    const stand = new THREE.Group();
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(1.05, 1.2, 0.12, 48),
      new THREE.MeshStandardMaterial({ color: 0x1a2030, metalness: 0.85, roughness: 0.35 }),
    );
    disc.position.y = 0;
    disc.receiveShadow = true;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.025, 12, 64),
      new THREE.MeshBasicMaterial({ color: 0xffd166 }),
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.07;
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(1.28, 0.012, 8, 64),
      new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.55 }),
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.y = 0.02;
    stand.add(disc, ring, halo);
    scene.add(stand);

    // Модель: боевые билдеры из игры, нормализуем размер и центрируем.
    const holder = new THREE.Group();
    scene.add(holder);
    let model: THREE.Group | null = null;
    try {
      if (sel.kind === 'gun') {
        model = makeGun(sel.id);
        model.rotation.set(0.15, 0, 0.12);
      } else {
        const { mob, scale } = enemyToMob(sel.id);
        model = makeMob(mob);
        model.scale.setScalar(scale);
      }
    } catch {
      model = new THREE.Group();
    }
    if (model) {
      const bb = new THREE.Box3().setFromObject(model);
      const size = new THREE.Vector3();
      bb.getSize(size);
      const center = new THREE.Vector3();
      bb.getCenter(center);
      const maxDim = Math.max(size.x, size.y, size.z, 0.001);
      const k = 1.7 / maxDim;
      model.scale.multiplyScalar(k);
      model.position.sub(center.clone().multiplyScalar(k));
      holder.add(model);
    }
    const baseY = 0.85;
    holder.position.y = baseY;

    // Камера под размер стенда.
    camera.position.set(0, 1.5, 3.4);
    camera.lookAt(0, 0.7, 0);

    const resize = () => {
      const w = parent.clientWidth || 300;
      const h = parent.clientHeight || 340;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(parent);

    let mx = 0;
    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = ((e.clientX - r.left) / Math.max(1, r.width) - 0.5) * 0.3;
    };
    canvas.addEventListener('mousemove', onMouse);

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();
      holder.rotation.y += dt * 0.9;
      holder.position.y = baseY + Math.sin(t * 1.6) * 0.08;
      holder.rotation.y += (mx - holder.rotation.y * 0) * 0; // параллакс ниже
      camera.position.x += (mx * 2 - camera.position.x) * 0.04;
      camera.lookAt(0, 0.7, 0);
      halo.rotation.z += dt * 0.4;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMouse);
      if (model) {
        holder.remove(model);
        disposeDeep(model);
      }
      disposeDeep(stand);
      scene.clear();
      renderer.dispose();
    };
  }, [sel.kind, sel.id]);

  return (
    <div
      style={{
        position: 'relative', width: '100%', height: 340, borderRadius: 14, overflow: 'hidden',
        background: 'radial-gradient(ellipse 90% 70% at 50% 30%, #182238 0%, #0b0e17 62%, #060810 100%)',
        border: '1px solid rgba(255,209,102,0.25)',
      }}
    >
      <div style={{ position: 'absolute', top: 10, left: 12, fontSize: 11, letterSpacing: 2, color: 'rgba(0,229,255,0.8)' }}>
        3D-ОСМОТР • 43
      </div>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      <div style={{ position: 'absolute', bottom: 8, left: 0, right: 0, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
        модель из боя • крутится • парит на стенде
      </div>
    </div>
  );
}
