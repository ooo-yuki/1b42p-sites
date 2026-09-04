import * as THREE from 'three';
import { C, Levels, lvl, disposeGroup, shortKeys } from './palette';
import { buildMenuDecor, buildPromoDecor } from './builders/decor';
import { buildBuilding } from './builders/building';
import { buildTables, buildVeranda } from './builders/furniture';
import { makePerson, Person, Role } from './builders/people';
import { buildKitchen } from './builders/kitchen';
import { buildGarden, buildUmbrellas } from './builders/garden';
import { buildEnvironment, Environment } from './builders/environment';

export type ViewName = 'outside' | 'hall' | 'kitchen';

const VIEWS: Record<ViewName, { pos: THREE.Vector3; tgt: THREE.Vector3 }> = {
  outside: { pos: new THREE.Vector3(11, 8.5, 17), tgt: new THREE.Vector3(0, 1, 2) },
  hall: { pos: new THREE.Vector3(0, 3.2, 13.5), tgt: new THREE.Vector3(0, 0.6, 4.2) },
  kitchen: { pos: new THREE.Vector3(10.5, 4.2, 5.0), tgt: new THREE.Vector3(4.9, 0.2, -0.9) },
};
const TABLE_POS: Array<[number, number]> = [[-4.5, 5.5], [4.5, 5.5], [-4.5, 0.5], [4.8, 0.2]];
interface Guest { mesh: Person; state: 'in' | 'sit' | 'out' | 'wait'; seat: number; timer: number; to: THREE.Vector3; }
interface Glow { m: THREE.MeshStandardMaterial; base: number; seed: number; }

export class CafeScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private env: Environment;
  private dyn = new THREE.Group();
  private guests: Guest[] = [];
  private staff: Person[] = [];
  private steams: THREE.Sprite[] = [];
  private flames: THREE.Object3D[] = [];
  private smokes: THREE.Group[] = [];
  private notes: THREE.Group[] = [];
  private pollen: THREE.Sprite[] = [];
  private glowMats: Glow[] = [];
  private steamTex: THREE.Texture;
  private seats: THREE.Object3D[] = [];
  private view: ViewName = 'outside';
  private camPos = VIEWS.outside.pos.clone();
  private camTgt = VIEWS.outside.tgt.clone();
  private flying = false;
  private theta = 0.6; private phi = 1.0; private radius = 21;
  private raf = 0; private clock = new THREE.Clock(); private disposed = false;
  private ro: ResizeObserver | null = null;
  constructor(private canvas: HTMLCanvasElement, private getLevels: () => Levels) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene.background = new THREE.Color(C.cream);
    this.scene.fog = new THREE.Fog(C.cream, 30, 90);
    this.scene.add(new THREE.HemisphereLight(0xfff4e0, 0xd9b8a3, 0.75));
    const dir = new THREE.DirectionalLight(0xfff0dd, 1.1);
    dir.position.set(10, 16, 8);
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    Object.assign(dir.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18 });
    this.scene.add(dir, new THREE.AmbientLight(0xfff4e0, 0.25));
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    this.syncOrbitFromCam();
    this.env = buildEnvironment();
    this.scene.add(this.env.group, this.dyn);
    this.steamTex = makeSteamTexture();
    this.buildPollen();
    this.applyLevels(this.getLevels());
    this.bindOrbit(canvas);
    this.resize();
    if (canvas.parentElement) {
      this.ro = new ResizeObserver(() => this.resize());
      this.ro.observe(canvas.parentElement);
    }
    const loop = () => { if (this.disposed) return; this.tick(); this.raf = requestAnimationFrame(loop); };
    loop();
  }

  setView(v: ViewName): void { this.view = v; this.flying = true; }

  applyLevels(levels: Levels): void {
    disposeGroup(this.dyn);
    this.scene.remove(this.dyn);
    this.dyn = new THREE.Group();
    this.scene.add(this.dyn);
    this.guests = []; this.staff = []; this.steams = [];
    this.flames = []; this.smokes = []; this.notes = [];
    this.glowMats = [];
    const S = shortKeys(levels);
    const L = (id: string) => lvl(S, id);
    this.dyn.add(buildBuilding(L('building')));
    this.dyn.add(buildVeranda(L('veranda')));
    const tables = buildTables(L('chairs'));
    this.dyn.add(tables.group);
    this.seats = tables.seats;
    this.dyn.add(buildUmbrellas(L('umbrellas'), TABLE_POS));
    this.dyn.add(buildGarden(L('garden')));
    const kitchen = buildKitchen({ fridge: L('fridge'), stove: L('stove'), pan: L('pan') });
    kitchen.position.set(5.6, 0, -0.6);
    this.dyn.add(kitchen, buildMenuDecor(levels), buildPromoDecor(levels, this.notes));
    for (const a of tables.steamAnchors) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.steamTex, transparent: true, opacity: 0.5, depthWrite: false }));
      s.scale.set(0.35, 0.5, 1);
      s.position.copy(a.getWorldPosition(new THREE.Vector3()));
      s.userData = { bx: s.position.x, by: s.position.y, bz: s.position.z, seed: Math.random() * 6.28, speed: 0.35 + Math.random() * 0.25 };
      this.dyn.add(s);
      this.steams.push(s);
    }
    this.dyn.traverse((o) => {
      if (o.name === 'flame') this.flames.push(o);
      if (o.name === 'chimneySmoke') this.smokes.push(o as THREE.Group);
    });
    this.collectGlow();
    const addStaff = (role: Role, n: number) => {
      for (let i = 0; i < n; i++) {
        const p = makePerson(role, i * 1.7 + role.length);
        if (role === 'cook') p.position.set(5.2 + i * 1.1, 0, 0.7);
        else if (role === 'waiter') p.position.set(-2 + i * 2, 0, 5);
        else p.position.set(2 - i * 3, 0, 8);
        this.dyn.add(p);
        this.staff.push(p);
      }
    };
    addStaff('waiter', Math.min(3, L('waiter')));
    addStaff('cook', L('cook') <= 0 ? 0 : L('cook') >= 4 ? 2 : 1);
    addStaff('cleaner', Math.min(2, L('cleaner')));
    const flow = 1 + L('ads') + L('flyer') + L('music');
    const n = Math.max(1, Math.min(this.seats.length + 2, flow));
    for (let i = 0; i < n; i++) {
      const mesh = makePerson('guest', i * 2.3);
      mesh.position.set(-6 + i * 2, 0, 14);
      this.guests.push({ mesh, state: 'wait', seat: i % Math.max(1, this.seats.length), timer: 1 + i * 2.5, to: mesh.position.clone() });
      this.dyn.add(mesh);
    }
  }

  resize(): void {
    const el = this.canvas.parentElement ?? this.canvas;
    const w = el.clientWidth || 800, h = el.clientHeight || 600;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro?.disconnect();
    for (const p of this.pollen) {
      (p.material as THREE.SpriteMaterial).dispose();
      this.scene.remove(p);
    }
    this.pollen = [];
    disposeGroup(this.dyn);
    disposeGroup(this.env.group);
    this.steamTex.dispose();
    this.renderer.dispose();
  }

  // Пыльца / светлячки: 30 спрайтов, живут в сцене (не в dyn)
  private buildPollen(): void {
    for (let i = 0; i < 30; i++) {
      const m = new THREE.SpriteMaterial({
        map: this.steamTex, transparent: true,
        opacity: 0.35 + Math.random() * 0.3,
        color: i % 3 === 0 ? 0xffe6a3 : 0xffffff,
        depthWrite: false,
      });
      const s = new THREE.Sprite(m);
      const sc = 0.06 + Math.random() * 0.09;
      s.scale.set(sc, sc, 1);
      const bx = (Math.random() - 0.5) * 20;
      const by = 0.5 + Math.random() * 4.5;
      const bz = (Math.random() - 0.5) * 18 + 2;
      s.position.set(bx, by, bz);
      s.userData = { bx, by, bz, seed: Math.random() * 6.28, amp: 0.3 + Math.random() * 0.7, spd: 0.2 + Math.random() * 0.5 };
      this.scene.add(s);
      this.pollen.push(s);
    }
  }

  // Тёплые пульс-материалы: всё с userData.pulse из env + dyn
  private collectGlow(): void {
    const seen = new Set<THREE.Material>();
    const walk = (root: THREE.Object3D) => {
      root.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (!mesh.isMesh) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const mm of mats) {
          const sm = mm as THREE.MeshStandardMaterial;
          if (!sm || seen.has(mm)) continue;
          if (mm.userData?.pulse && typeof sm.emissiveIntensity === 'number') {
            seen.add(mm);
            this.glowMats.push({ m: sm, base: Number(mm.userData.base ?? sm.emissiveIntensity), seed: Number(mm.userData.seed ?? 0) });
          }
        }
      });
    };
    walk(this.env.group);
    walk(this.dyn);
  }

  private bindOrbit(canvas: HTMLCanvasElement): void {
    let drag = false, lx = 0, ly = 0;
    canvas.addEventListener('pointerdown', (e) => { drag = true; lx = e.clientX; ly = e.clientY; canvas.setPointerCapture(e.pointerId); });
    canvas.addEventListener('pointermove', (e) => {
      if (!drag || this.view !== 'outside') return;
      this.theta -= (e.clientX - lx) * 0.005;
      this.phi = Math.max(0.35, Math.min(1.35, this.phi - (e.clientY - ly) * 0.004));
      lx = e.clientX; ly = e.clientY;
      this.flying = false;
    });
    canvas.addEventListener('pointerup', () => { drag = false; });
    canvas.addEventListener('wheel', (e) => {
      if (this.view !== 'outside') return;
      e.preventDefault();
      this.radius = Math.max(9, Math.min(30, this.radius + e.deltaY * 0.02));
      this.flying = false;
    }, { passive: false });
  }

  private syncOrbitFromCam(): void {
    const off = this.camPos.clone().sub(this.camTgt);
    this.radius = off.length();
    this.theta = Math.atan2(off.x, off.z);
    this.phi = Math.acos(Math.max(-1, Math.min(1, off.y / this.radius)));
  }

  private tick(): void {
    const dt = Math.min(0.05, this.clock.getDelta());
    const t = this.clock.elapsedTime;
    const dest = VIEWS[this.view];
    if (this.flying) {
      const k = 1 - Math.pow(0.001, dt);
      this.camPos.lerp(dest.pos, k);
      this.camTgt.lerp(dest.tgt, k);
      if (this.camPos.distanceTo(dest.pos) < 0.05) { this.flying = false; this.syncOrbitFromCam(); }
    } else if (this.view === 'outside') {
      this.camPos.set(
        this.camTgt.x + this.radius * Math.sin(this.phi) * Math.sin(this.theta),
        this.camTgt.y + this.radius * Math.cos(this.phi),
        this.camTgt.z + this.radius * Math.sin(this.phi) * Math.cos(this.theta),
      );
    }
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.camTgt);
    this.env.update(t);
    // Пар: подъём + растворение + ресет на базу
    for (const s of this.steams) {
      const u = s.userData;
      s.position.y += dt * (u.speed as number);
      s.position.x = (u.bx as number) + Math.sin(t * 1.5 + (u.seed as number)) * 0.08;
      const prog = (s.position.y - (u.by as number)) / 1.2;
      const sm = s.material as THREE.SpriteMaterial;
      if (prog >= 1) {
        s.position.set(u.bx as number, u.by as number, u.bz as number);
        s.scale.set(0.35, 0.5, 1);
      } else {
        sm.opacity = 0.55 * (1 - prog);
        const gr = 1 + prog * 0.9;
        s.scale.set(0.35 * gr, 0.5 * gr, 1);
      }
    }
    // Пыльца / светлячки: медленный дрейф + мерцание
    for (const p of this.pollen) {
      const u = p.userData;
      p.position.set(
        (u.bx as number) + Math.sin(t * (u.spd as number) + (u.seed as number)) * (u.amp as number),
        (u.by as number) + Math.sin(t * 0.6 + (u.seed as number) * 2) * 0.4,
        (u.bz as number) + Math.cos(t * (u.spd as number) * 0.8 + (u.seed as number)) * (u.amp as number),
      );
      (p.material as THREE.SpriteMaterial).opacity = 0.3 + Math.abs(Math.sin(t * 1.4 + (u.seed as number))) * 0.35;
    }
    // Тёплый пульс гирлянды и фонарей
    for (const gl of this.glowMats) {
      gl.m.emissiveIntensity = gl.base + Math.sin(t * 2.2 + gl.seed) * 0.35;
    }
    for (const f of this.flames) {
      const k = 1 + Math.sin(t * 13 + f.position.x * 9) * 0.18;
      f.scale.set(k, 1 + Math.sin(t * 17) * 0.25, k);
    }
    for (const sm of this.smokes) {
      sm.children.forEach((p, i) => {
        p.position.y += dt * (0.5 + i * 0.15);
        if (p.position.y > 8.5) p.position.y = 6.6;
      });
    }
    for (const n of this.notes) {
      n.position.y += Math.sin(t * 2 + (n.userData.seed ?? 0)) * dt * 0.5;
      n.rotation.y = t * 1.5 + (n.userData.seed ?? 0);
    }
    this.staff.forEach((p, i) => {
      const role = p.userData.role;
      if (role === 'waiter') {
        const [tx, tz] = TABLE_POS[Math.floor(t * 0.12 + i * 1.7) % TABLE_POS.length];
        const dx = tx + 1.6 - p.position.x, dz = tz - p.position.z;
        p.position.x += dx * (1 - Math.pow(0.05, dt));
        p.position.z += dz * (1 - Math.pow(0.05, dt));
        p.lookAt(tx + 1.6, 0, tz);
        p.userData.update(t, Math.hypot(dx, dz) > 0.4 ? 'walk' : 'idle');
      } else if (role === 'cleaner') {
        p.position.x += (Math.sin(t * 0.25 + i * 2.5) * 5 - p.position.x) * (1 - Math.pow(0.1, dt));
        p.position.z += (7 + Math.cos(t * 0.2 + i) * 2.5 - p.position.z) * (1 - Math.pow(0.1, dt));
        p.userData.update(t, 'walk');
      } else p.userData.update(t, 'idle');
    });
    for (const gu of this.guests) {
      const m = gu.mesh;
      if (gu.state === 'wait') {
        m.userData.update(t, 'idle');
        gu.timer -= dt;
        if (gu.timer <= 0 && this.seats.length) {
          gu.state = 'in';
          gu.to.copy(this.seats[gu.seat % this.seats.length].getWorldPosition(new THREE.Vector3()));
        }
      } else if (gu.state === 'sit') {
        m.userData.update(t, 'sit');
        gu.timer -= dt;
        if (gu.timer <= 0) { gu.state = 'out'; gu.to.set(m.position.x > 0 ? 8 : -8, 0, 14); }
      } else {
        m.position.lerp(gu.to, 1 - Math.pow(0.02, dt));
        m.lookAt(gu.to.x, 0, gu.to.z);
        m.userData.update(t, 'walk');
        const arrived = m.position.distanceTo(gu.to) < (gu.state === 'in' ? 0.25 : 0.4);
        if (arrived && gu.state === 'in' && this.seats.length) {
          gu.state = 'sit'; gu.timer = 8 + Math.random() * 8;
          const s = this.seats[gu.seat % this.seats.length];
          m.position.copy(s.getWorldPosition(new THREE.Vector3()));
          m.rotation.copy(s.rotation);
        } else if (arrived) {
          gu.state = 'wait'; gu.timer = 3 + Math.random() * 8;
          gu.seat = Math.floor(Math.random() * Math.max(1, this.seats.length));
        }
      }
    }
    this.renderer.render(this.scene, this.camera);
  }
}

function makeSteamTexture(): THREE.Texture {
  const cv = document.createElement('canvas');
  cv.width = 64; cv.height = 64;
  const ctx = cv.getContext('2d')!;
  const gr = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  gr.addColorStop(0, 'rgba(255,255,255,0.9)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gr;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(cv);
}
