/* ROCKET ZOV (three.js): из кнопки прямо в зрителя + эпичный взрыв */
import * as THREE from 'three';
import { playAnthem, eagleScream } from './audio';

let busy = false;

function zovTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 128;
  const g = c.getContext('2d');
  if (!g) throw new Error('no 2d context');
  g.fillStyle = '#c81e1e';
  g.fillRect(0, 0, 256, 128);
  g.fillStyle = '#fff';
  g.font = '900 76px system-ui,sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('ZOV', 64, 68);
  g.fillText('ZOV', 192, 68);
  return new THREE.CanvasTexture(c);
}

interface FlameUser {
  flame: THREE.Mesh;
  glow: THREE.PointLight;
}

function buildRocket(): THREE.Group {
  const grp = new THREE.Group();
  const red = new THREE.MeshStandardMaterial({ color: 0xc81e1e, roughness: 0.5, metalness: 0.3 });
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.34, 0.34, 1.7, 24),
    new THREE.MeshStandardMaterial({ map: zovTexture(), roughness: 0.5, metalness: 0.3 }),
  );
  grp.add(body);
  const bandT = new THREE.Mesh(new THREE.CylinderGeometry(0.355, 0.355, 0.16, 24), red);
  bandT.position.y = 0.7;
  grp.add(bandT);
  const bandB = bandT.clone();
  bandB.position.y = -0.7;
  grp.add(bandB);
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.75, 24), red);
  nose.position.y = 1.22;
  grp.add(nose);
  const win = new THREE.Mesh(
    new THREE.SphereGeometry(0.14, 16, 16),
    new THREE.MeshStandardMaterial({
      color: 0xffd23f, roughness: 0.15, metalness: 0.9, emissive: 0x664400,
    }),
  );
  win.position.set(0, 0.45, 0.3);
  grp.add(win);
  for (let i = 0; i < 3; i++) {
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.6, 0.42),
      new THREE.MeshStandardMaterial({ color: 0x3b82ff, roughness: 0.5, metalness: 0.4 }),
    );
    const a = (i / 3) * Math.PI * 2;
    fin.position.set(Math.cos(a) * 0.42, -0.85, Math.sin(a) * 0.42);
    fin.rotation.y = -a;
    grp.add(fin);
  }
  const flame = new THREE.Mesh(
    new THREE.ConeGeometry(0.22, 0.9, 16),
    new THREE.MeshBasicMaterial({ color: 0xffa500, transparent: true, opacity: 0.95 }),
  );
  flame.position.y = -1.55;
  flame.rotation.x = Math.PI;
  grp.add(flame);
  const glow = new THREE.PointLight(0xff8c00, 3, 9);
  glow.position.y = -1.4;
  grp.add(glow);
  (grp as THREE.Group & { userData: FlameUser }).userData = { flame, glow };
  return grp;
}

interface Vel {
  x: number;
  y: number;
  z: number;
}

interface Bits {
  pts: THREE.Points;
  vel: Vel[];
  geo: THREE.BufferGeometry;
  mat: THREE.PointsMaterial;
}

function boomBits(scene: THREE.Scene, pos: THREE.Vector3, n: number, spread: number, up: number): Bits {
  const geo = new THREE.BufferGeometry();
  const arr = new Float32Array(n * 3);
  const vel: Vel[] = [];
  for (let i = 0; i < n; i++) {
    arr[i * 3] = pos.x;
    arr[i * 3 + 1] = pos.y;
    arr[i * 3 + 2] = pos.z;
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    const sp = spread * (0.4 + Math.random());
    vel.push({
      x: Math.sin(ph) * Math.cos(th) * sp,
      y: Math.abs(Math.cos(ph)) * sp * up,
      z: Math.sin(ph) * Math.sin(th) * sp,
    });
  }
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  const mat = new THREE.PointsMaterial({
    color: 0xffb020, size: 0.14, transparent: true, opacity: 1,
    blending: THREE.AdditiveBlending, depthWrite: false,
  });
  const pts = new THREE.Points(geo, mat);
  scene.add(pts);
  return { pts, vel, geo, mat };
}

function disposeScene(scene: THREE.Scene): void {
  scene.traverse((o: THREE.Object3D) => {
    const mesh = o as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    const mat = (mesh as unknown as { material?: THREE.Material | THREE.Material[] }).material;
    if (mat) {
      (Array.isArray(mat) ? mat : [mat]).forEach((mm) => {
        const withMap = mm as THREE.Material & { map?: THREE.Texture | null };
        if (withMap.map) withMap.map.dispose();
        mm.dispose();
      });
    }
  });
}

export interface RocketOpts {
  canvas: HTMLCanvasElement;
  flash: HTMLElement;
  domRing: () => void;
}

/** Запуск ракеты. Возвращает промис — резолвится после взрыва. */
export function launchRocket(sx: number, sy: number, opts: RocketOpts): Promise<void> {
  if (busy) return Promise.resolve();
  busy = true;
  return new Promise((resolve) => {
    const { canvas: cv3, flash: flashEl } = opts;
    cv3.style.display = 'block';
    const W = window.innerWidth;
    const H = window.innerHeight;
    const renderer = new THREE.WebGLRenderer({ canvas: cv3, alpha: true, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dl = new THREE.DirectionalLight(0xffffff, 1.4);
    dl.position.set(4, 6, 6);
    scene.add(dl);
    const flashL = new THREE.PointLight(0xffffff, 0, 30);
    flashL.position.set(0, 0, 3);
    scene.add(flashL);
    const rocket = buildRocket();
    scene.add(rocket);
    const flame = (rocket.userData as unknown as FlameUser).flame;
    const glow = (rocket.userData as unknown as FlameUser).glow;
    const nx = (sx / W) * 2 - 1;
    const ny = -((sy / H) * 2 - 1);
    const clock = new THREE.Clock();
    let t = 0;
    let bits: Bits | null = null;
    let ringM: THREE.Mesh | null = null;
    let phase: 'fly' | 'boom' = 'fly';
    let shake = 0;
    const trail: Array<{ o: Bits; age: number }> = [];

    rocket.position.set(nx * 4, ny * 3, -9);
    rocket.scale.setScalar(0.55);

    function finish(): void {
      busy = false;
      disposeScene(scene);
      renderer.dispose();
      cv3.style.display = 'none';
      resolve();
    }

    function anim(): void {
      if (!busy) return;
      const raw = clock.getDelta();
      t += raw;
      const dt = Math.min(raw, 0.1);
      if (phase === 'fly') {
        const k = Math.min(t / 1.5, 1);
        const e = 1 - Math.pow(1 - k, 3);
        rocket.position.z = -9 + e * 11.2;
        rocket.position.x = nx * 4 * (1 - e * 0.85);
        rocket.position.y = ny * 3 * (1 - e * 0.85);
        rocket.scale.setScalar(0.55 + e * 2.1);
        rocket.rotation.z = Math.sin(t * 30) * 0.06 * (1 + k * 2);
        rocket.rotation.y += dt * 2.5;
        flame.scale.set(1 + Math.random() * 0.5, 0.8 + Math.random() * 0.9, 1 + Math.random() * 0.5);
        glow.intensity = 2.5 + Math.random() * 2;
        shake = k * 0.12;
        if (Math.random() < 0.8) {
          const sm = boomBits(
            scene,
            rocket.position.clone().add(new THREE.Vector3(0, -0.9, 0)),
            3, 0.5, 0.3,
          );
          sm.mat.color.set(0x8899aa);
          sm.mat.size = 0.1;
          trail.push({ o: sm, age: 0 });
        }
        for (let i = trail.length - 1; i >= 0; i--) {
          const tr = trail[i];
          tr.age += dt;
          const pa = tr.o.pts.geometry.attributes.position as THREE.BufferAttribute;
          const arr = pa.array as Float32Array;
          for (let j = 0; j < tr.o.vel.length; j++) {
            arr[j * 3] += tr.o.vel[j].x * dt;
            arr[j * 3 + 1] += tr.o.vel[j].y * dt;
            arr[j * 3 + 2] += tr.o.vel[j].z * dt;
          }
          pa.needsUpdate = true;
          tr.o.mat.opacity = Math.max(0, 0.5 - tr.age);
          if (tr.age > 0.6) {
            scene.remove(tr.o.pts);
            tr.o.geo.dispose();
            tr.o.mat.dispose();
            trail.splice(i, 1);
          }
        }
        if (k >= 1) {
          phase = 'boom';
          t = 0;
          scene.remove(rocket);
          bits = boomBits(scene, new THREE.Vector3(0, 0, 2), 220, 7, 1);
          const rg = new THREE.RingGeometry(0.3, 0.5, 48);
          ringM = new THREE.Mesh(
            rg,
            new THREE.MeshBasicMaterial({
              color: 0xffd23f, transparent: true, opacity: 0.95, side: THREE.DoubleSide,
            }),
          );
          ringM.position.set(0, 0, 2);
          scene.add(ringM);
          flashL.intensity = 14;
          shake = 0.5;
          flashEl.style.transition = 'none';
          flashEl.style.opacity = '0.9';
          requestAnimationFrame(() => {
            flashEl.style.transition = 'opacity .6s';
            flashEl.style.opacity = '0';
          });
          opts.domRing();
          try {
            if (navigator.vibrate) navigator.vibrate(80);
          } catch {
            /* ignore */
          }
          playAnthem();
          eagleScream(0.3);
        }
      } else {
        if (bits) {
          const pa2 = bits.pts.geometry.attributes.position as THREE.BufferAttribute;
          const a2 = pa2.array as Float32Array;
          for (let m = 0; m < bits.vel.length; m++) {
            a2[m * 3] += bits.vel[m].x * dt;
            a2[m * 3 + 1] += bits.vel[m].y * dt - 2.2 * dt;
            a2[m * 3 + 2] += bits.vel[m].z * dt;
          }
          pa2.needsUpdate = true;
          bits.mat.opacity = Math.max(0, 1 - t * 0.9);
        }
        if (ringM) {
          ringM.scale.addScalar(dt * 14);
          (ringM.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.95 - t * 0.9);
        }
        flashL.intensity = Math.max(0, 14 - t * 16);
        shake = Math.max(0, 0.5 - t * 0.5);
        if (t > 1.4) {
          finish();
          return;
        }
      }
      camera.position.set((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake, 6);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      requestAnimationFrame(anim);
    }
    anim();
  });
}
