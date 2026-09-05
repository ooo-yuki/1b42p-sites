import * as THREE from 'three';
import { C, Levels, lvl, disposeGroup, shortKeys, FLOOR_Y } from './palette';
import { buildMenuDecor, buildPromoDecor } from './builders/decor';
import { buildBuilding } from './builders/building';
import { buildTables, buildVeranda } from './builders/furniture';
import { makePerson, Person, Role } from './builders/people';
import { buildKitchen } from './builders/kitchen';
import { buildGarden, buildUmbrellas } from './builders/garden';
import { buildInterior } from './builders/interior';
import { buildEnvironment, Environment } from './builders/environment';

export type ViewName = 'outside' | 'hall' | 'kitchen';

const VIEWS: Record<ViewName, { pos: THREE.Vector3; tgt: THREE.Vector3 }> = {
  outside: { pos: new THREE.Vector3(11, 8.5, 17), tgt: new THREE.Vector3(0, 1, 2) },
  hall: { pos: new THREE.Vector3(0, 4.2, 10.5), tgt: new THREE.Vector3(0, 1.0, -0.5) },
  kitchen: { pos: new THREE.Vector3(6.2, 3.8, 3.4), tgt: new THREE.Vector3(6.2, -0.6, -1.8) },
};
const UMB: Array<[number, number]> = [[-4.5, 6.0], [4.5, 6.0]];
const GATE = new THREE.Vector3(0, 0, 13), DOOR = new THREE.Vector3(0, 0, 4.2);
const COUNTER = new THREE.Vector3(0, 0, -2.4), ANNEX = new THREE.Vector3(4.2, 0, -1.2);
const DAY_BG = new THREE.Color(C.cream), DUSK_BG = new THREE.Color(0xf2b48f), NIGHT_BG = new THREE.Color(0x45425e);
const DAY_SUN = new THREE.Color(0xfff0dd), DUSK_SUN = new THREE.Color(0xff9a5a);
const _c = new THREE.Color();
interface Guest { mesh: Person; st: 'wait' | 'go' | 'sit' | 'back'; wi: number; seat: number; timer: number; path: THREE.Vector3[]; }
interface Glow { m: THREE.MeshStandardMaterial; base: number; seed: number; }

export class CafeScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private env: Environment;
  private sun: THREE.DirectionalLight;
  private hemi: THREE.HemisphereLight;
  private hallLamp: THREE.PointLight;
  private dyn = new THREE.Group();
  private guests: Guest[] = [];
  private staff: Person[] = [];
  private wtargets: THREE.Vector3[] = [];
  private steams: THREE.Sprite[] = [];
  private flames: THREE.Object3D[] = [];
  private smokes: THREE.Group[] = [];
  private notes: THREE.Group[] = [];
  private dust: THREE.Sprite[] = [];
  private flies: THREE.Sprite[] = [];
  private glowMats: Glow[] = [];
  private steamTex: THREE.Texture;
  private seats: THREE.Object3D[] = [];
  private cut: THREE.Object3D[] = [];
  private sFin: THREE.Mesh[] = [];
  private view: ViewName = 'outside';
  private camPos = VIEWS.outside.pos.clone();
  private camTgt = VIEWS.outside.tgt.clone();
  private flying = false;
  private theta = 0.6; private phi = 1.0; private radius = 21;
  private tod = 0.35; private manual = 0; // 0..1, 0=полночь 0.5=полдень; manual=пауза автоцикла 240с
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
    this.hemi = new THREE.HemisphereLight(0xfff4e0, 0xd9b8a3, 0.75);
    this.sun = new THREE.DirectionalLight(0xfff0dd, 1.1);
    this.sun.position.set(10, 16, 8);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    Object.assign(this.sun.shadow.camera, { left: -18, right: 18, top: 18, bottom: -18 });
    this.scene.add(this.hemi, this.sun, new THREE.AmbientLight(0xfff4e0, 0.25));
    this.hallLamp = new THREE.PointLight(0xffd9a0, 14, 14, 1.8);
    this.hallLamp.position.set(0, 2.7, 0);
    this.scene.add(this.hallLamp);
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    this.syncOrbitFromCam();
    this.env = buildEnvironment();
    this.scene.add(this.env.group, this.dyn);
    this.steamTex = makeSteamTexture();
    this.buildAir();
    this.applyLevels(this.getLevels());
    this.bindOrbit(canvas);
    this.resize();
    if (canvas.parentElement) { this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(canvas.parentElement); }
    (window as unknown as Record<string, unknown>).__cafe = this;
    const loop = () => { if (this.disposed) return; this.tick(); this.raf = requestAnimationFrame(loop); };
    loop();
  }

  setView(v: ViewName): void { this.view = v; this.flying = true; this.applyCut(); }
  /** Время суток 0..1: 0=полночь, 0.25=рассвет, 0.5=полдень, 0.75=закат. Глушит автоцикл на 90с. */
  setTimeOfDay(t: number): void { this.tod = Math.max(0, Math.min(1, t)); this.manual = 90; }

  applyLevels(levels: Levels): void {
    disposeGroup(this.dyn);
    this.scene.remove(this.dyn);
    this.dyn = new THREE.Group();
    this.scene.add(this.dyn);
    this.guests = []; this.staff = []; this.steams = [];
    this.flames = []; this.smokes = []; this.notes = [];
    this.glowMats = []; this.cut = []; this.wtargets = []; this.sFin = [];
    const S = shortKeys(levels);
    const L = (id: string) => lvl(S, id);
    this.dyn.add(buildBuilding(L('building')));
    this.dyn.add(buildVeranda(L('veranda')));
    const tables = buildTables(L('chairs'));
    tables.group.position.y = FLOOR_Y;
    this.dyn.add(tables.group);
    this.seats = tables.seats;
    const interior = buildInterior();
    interior.group.position.y = FLOOR_Y;
    this.dyn.add(buildUmbrellas(L('umbrellas'), UMB), buildGarden(L('garden')), interior.group, interior.chandelier);
    const kitchen = buildKitchen({ fridge: L('fridge'), stove: L('stove'), pan: L('pan') });
    kitchen.position.set(5.6, 0, -0.6);
    this.dyn.add(kitchen, buildMenuDecor(levels), buildPromoDecor(levels, this.notes));
    for (const a of tables.steamAnchors) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.steamTex, transparent: true, opacity: 0.5, depthWrite: false }));
      s.scale.set(0.35, 0.5, 1);
      s.position.copy(a.getWorldPosition(new THREE.Vector3()));
      s.userData = { bx: s.position.x, by: s.position.y, bz: s.position.z, seed: Math.random() * 6.28, speed: 0.35 + Math.random() * 0.25 };
      this.dyn.add(s); this.steams.push(s);
    }
    this.dyn.traverse((o) => {
      if (o.name === 'flame') this.flames.push(o);
      if (o.name === 'chimneySmoke') this.smokes.push(o as THREE.Group);
    });
    this.collectGlow();
    for (const n of ['cutSouth', 'cutRoofMain', 'cutAnnexEast', 'cutRoofAnnex']) {
      const o = this.dyn.getObjectByName(n);
      if (o) this.cut.push(o);
    }
    this.sFin = [];
    this.dyn.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      for (let p: THREE.Object3D | null = o; p; p = p.parent) if (p.name.startsWith('cut')) return;
      const v = m.position;
      if (v.z > 3.0 && v.z < 3.7 && Math.abs(v.x) < 4.7 && v.y < 3.6) this.sFin.push(m);
    });
    this.applyCut();
    const addStaff = (role: Role, n: number) => {
      for (let i = 0; i < n; i++) {
        const p = makePerson(role, i * 1.7 + role.length);
        if (role === 'cook') p.position.set(5.5 + i * 0.7, 0, -1.5);
        else if (role === 'waiter') p.position.set(-2 + i * 2, 0, 5);
        else p.position.set(2 - i * 3, 0, 8);
        p.userData.seed = i * 3.1;
        this.dyn.add(p); this.staff.push(p);
      }
    };
    addStaff('waiter', Math.min(3, L('waiter')));
    addStaff('cook', L('cook') <= 0 ? 0 : L('cook') >= 4 ? 2 : 1);
    addStaff('cleaner', Math.min(2, L('cleaner')));
    this.wtargets = [COUNTER.clone(), ANNEX.clone(), ...this.seats.map((s) => s.getWorldPosition(new THREE.Vector3())), ...UMB.map(([x, z]) => new THREE.Vector3(x + 1.6, 0, z))];
    const flow = 1 + L('ads') + L('flyer') + L('music');
    const n = Math.max(1, Math.min(this.seats.length + 2, flow));
    for (let i = 0; i < n; i++) {
      const mesh = makePerson('guest', i * 2.3);
      mesh.position.set((Math.random() - 0.5) * 3, 0, 13 + Math.random() * 1.5);
      this.guests.push({ mesh, st: 'wait', wi: 0, seat: i % Math.max(1, this.seats.length), timer: 1 + i * 2.5, path: [] });
      this.dyn.add(mesh);
    }
  }

  /** Разрез: hall прячет юг+крышу, kitchen — восток пристроя+обе крыши, outside — всё видно. */
  private applyCut(): void {
    const byName = (n: string) => this.cut.find((o) => o.name === n);
    const show = (n: string, v: boolean) => { const o = byName(n); if (o) o.visible = v; };
    for (const m of this.sFin) m.visible = this.view !== 'hall';
    if (this.view === 'hall') {
      show('cutSouth', false); show('cutRoofMain', false); show('cutAnnexEast', true); show('cutRoofAnnex', true);
    } else if (this.view === 'kitchen') {
      show('cutAnnexEast', false); show('cutRoofAnnex', false); show('cutRoofMain', false); show('cutSouth', true);
    } else for (const o of this.cut) o.visible = true;
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
    for (const p of [...this.dust, ...this.flies]) { (p.material as THREE.SpriteMaterial).dispose(); this.scene.remove(p); }
    this.dust = []; this.flies = [];
    disposeGroup(this.dyn);
    disposeGroup(this.env.group);
    this.steamTex.dispose();
    this.renderer.dispose();
  }

  private buildAir(): void {
    const mk = (n: number, col: number, add: boolean, sc0: number, sc1: number) => {
      for (let i = 0; i < n; i++) {
        const m = new THREE.SpriteMaterial({ map: this.steamTex, transparent: true, opacity: 0.4, color: col, depthWrite: false, blending: add ? THREE.AdditiveBlending : THREE.NormalBlending });
        const s = new THREE.Sprite(m);
        const sc = sc0 + Math.random() * (sc1 - sc0);
        s.scale.set(sc, sc, 1);
        const bx = (Math.random() - 0.5) * 20, by = 0.5 + Math.random() * 4, bz = (Math.random() - 0.5) * 18 + 2;
        s.position.set(bx, by, bz);
        s.userData = { bx, by, bz, seed: Math.random() * 6.28, amp: 0.3 + Math.random() * 0.7, spd: 0.2 + Math.random() * 0.5 };
        this.scene.add(s);
        (add ? this.flies : this.dust).push(s);
      }
    };
    mk(30, 0xfff6ea, false, 0.06, 0.15); mk(24, 0xd8ff9a, true, 0.08, 0.16);
  }

  private collectGlow(): void {
    const seen = new Set<THREE.Material>();
    for (const root of [this.env.group, this.dyn]) root.traverse((o) => {
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
    if (this.manual > 0) this.manual -= dt; else this.tod = (this.tod + dt / 240) % 1;
    this.applyTod(t);
    const dest = VIEWS[this.view];
    if (this.flying) {
      const k = 1 - Math.pow(0.001, dt);
      this.camPos.lerp(dest.pos, k);
      this.camTgt.lerp(dest.tgt, k);
      if (this.camPos.distanceTo(dest.pos) < 0.05) { this.flying = false; this.syncOrbitFromCam(); }
    } else if (this.view === 'outside') {
      this.camPos.set(this.camTgt.x + this.radius * Math.sin(this.phi) * Math.sin(this.theta), this.camTgt.y + this.radius * Math.cos(this.phi), this.camTgt.z + this.radius * Math.sin(this.phi) * Math.cos(this.theta));
    }
    this.camera.position.copy(this.camPos);
    this.camera.lookAt(this.camTgt);
    this.env.update(t);
    for (const s of this.steams) {
      const u = s.userData as { bx: number; by: number; bz: number; seed: number; speed: number };
      s.position.y += dt * u.speed;
      s.position.x = u.bx + Math.sin(t * 1.5 + u.seed) * 0.08;
      const prog = (s.position.y - u.by) / 1.2;
      const sm = s.material as THREE.SpriteMaterial;
      if (prog >= 1) { s.position.set(u.bx, u.by, u.bz); s.scale.set(0.35, 0.5, 1); }
      else { sm.opacity = 0.55 * (1 - prog); const gr = 1 + prog * 0.9; s.scale.set(0.35 * gr, 0.5 * gr, 1); }
    }
    const elev = Math.sin((this.tod - 0.25) * Math.PI * 2);
    const dayF = THREE.MathUtils.smoothstep(elev, -0.08, 0.35), nightF = 1 - dayF;
    this.drift(this.dust, t, 0.25 + dayF * 0.75);
    this.drift(this.flies, t, nightF, true);
    for (const gl of this.glowMats) gl.m.emissiveIntensity = gl.base * (1 + nightF * 1.6) + Math.sin(t * 2.2 + gl.seed) * 0.3;
    for (const f of this.flames) {
      const k = 1 + Math.sin(t * 13 + f.position.x * 9) * 0.18;
      f.scale.set(k, 1 + Math.sin(t * 17) * 0.25, k);
    }
    for (const sm of this.smokes) for (const [i, p] of sm.children.entries()) {
      p.position.y += dt * (0.5 + i * 0.15);
      if (p.position.y > 8.5) p.position.y = 6.6;
    }
    for (const n of this.notes) {
      n.position.y += Math.sin(t * 2 + ((n.userData.seed ?? 0) as number)) * dt * 0.5;
      n.rotation.y = t * 1.5 + ((n.userData.seed ?? 0) as number);
    }
    this.tickStaff(t, dt);
    this.tickGuests(t, dt);
    this.renderer.render(this.scene, this.camera);
  }

  private applyTod(t: number): void {
    const ph = (this.tod - 0.25) * Math.PI * 2;
    const elev = Math.sin(ph);
    this.sun.position.set(Math.cos(ph) * 16, Math.max(-6, elev * 18), 8);
    const dayF = THREE.MathUtils.smoothstep(elev, -0.08, 0.35);
    const duskF = Math.exp(-Math.pow((elev - 0.08) / 0.22, 2));
    const nightF = 1 - dayF;
    this.sun.intensity = 0.06 + dayF * 1.05 + duskF * 0.25;
    this.sun.color.copy(_c.copy(DAY_SUN).lerp(DUSK_SUN, Math.min(1, duskF * 1.2)));
    _c.copy(NIGHT_BG).lerp(DAY_BG, dayF).lerp(DUSK_BG, Math.min(1, duskF * 0.55));
    (this.scene.background as THREE.Color).copy(_c);
    (this.scene.fog as THREE.Fog).color.copy(_c);
    this.hemi.intensity = 0.22 + dayF * 0.55;
    this.hallLamp.intensity = 10 + nightF * 18;
    for (const pl of this.env.lamps) pl.intensity = (pl.userData.base as number) * (0.35 + nightF * 1.8);
    for (const g of this.env.glints) {
      const gm = g.material as THREE.SpriteMaterial;
      gm.opacity = (gm.userData.base as number) * (0.25 + nightF * 1.3);
      const s = 1.5 * (1 + nightF * 0.5 + Math.sin(t * 2.2 + g.position.x) * 0.08);
      g.scale.set(s, s, 1);
    }
  }

  private drift(list: THREE.Sprite[], t: number, vis: number, blink = false): void {
    for (const p of list) {
      const u = p.userData as { bx: number; by: number; bz: number; seed: number; amp: number; spd: number };
      p.visible = vis > 0.05;
      if (!p.visible) continue;
      p.position.set(u.bx + Math.sin(t * u.spd + u.seed) * u.amp, u.by + Math.sin(t * 0.6 + u.seed * 2) * 0.4, u.bz + Math.cos(t * u.spd * 0.8 + u.seed) * u.amp);
      (p.material as THREE.SpriteMaterial).opacity = vis * (blink ? 0.25 + Math.abs(Math.sin(t * 2.4 + u.seed)) * 0.75 : 0.3 + Math.abs(Math.sin(t * 1.4 + u.seed)) * 0.35);
    }
  }

  /** Высота земли под ногами: пол зала, доски пристроя, иначе трава. */
  private groundY(x: number, z: number): number {
    if (Math.abs(x) <= 4.5 && z >= -3.5 && z <= 3.5) return FLOOR_Y;
    if (x > 4.5 && x <= 8.0 && z >= -3.0 && z <= 0.5) return 0.1;
    return 0;
  }

  private move(p: THREE.Object3D, to: THREE.Vector3, dt: number, walk: (m: 'walk' | 'idle') => void): boolean {
    const dx = to.x - p.position.x, dz = to.z - p.position.z, d = Math.hypot(dx, dz), k = 1 - Math.pow(0.05, dt);
    p.position.x += dx * k; p.position.z += dz * k;
    p.position.y += (this.groundY(p.position.x, p.position.z) - p.position.y) * k;
    p.lookAt(to.x, 0, to.z);
    walk(d > 0.4 ? 'walk' : 'idle');
    return d < 0.35;
  }

  private tickStaff(t: number, dt: number): void {
    this.staff.forEach((p, i) => {
      const role = p.userData.role;
      const up = (m: 'idle' | 'walk' | 'sit') => p.userData.update(t, m);
      if (role === 'waiter') {
        const tgt = this.wtargets.length ? this.wtargets[Math.floor(t * 0.12 + i * 1.7) % this.wtargets.length] : COUNTER;
        this.move(p, tgt, dt, (m) => up(m));
      } else if (role === 'cook') {
        const u = (p.userData.seed ?? 0) as number;
        const ud = p.userData as unknown as Record<string, unknown>;
        if (!ud.target || p.position.distanceTo(ud.target as THREE.Vector3) < 0.3) {
          ud.target = new THREE.Vector3(5.5 + ((t * 0.7 + u * 2.3) % 1.5), 0, -2 + ((t * 0.43 + u) % 1));
        }
        this.move(p, ud.target as THREE.Vector3, dt, (m) => up(m));
      } else if (role === 'cleaner') {
        p.position.x += (Math.sin(t * 0.25 + i * 2.5) * 5 - p.position.x) * (1 - Math.pow(0.1, dt));
        p.position.z += (7 + Math.cos(t * 0.2 + i) * 2.5 - p.position.z) * (1 - Math.pow(0.1, dt));
        up('walk');
      } else up('idle');
    });
  }

  private tickGuests(t: number, dt: number): void {
    const seatPos = (i: number) => this.seats[i % this.seats.length].getWorldPosition(new THREE.Vector3());
    for (const gu of this.guests) {
      const m = gu.mesh, up = (x: 'idle' | 'walk' | 'sit') => m.userData.update(t, x);
      if (gu.st === 'wait' || gu.st === 'sit') {
        up(gu.st === 'sit' ? 'sit' : 'idle');
        gu.timer -= dt;
        if (gu.timer > 0 || !this.seats.length) continue;
        if (gu.st === 'wait') { gu.path = [DOOR.clone(), seatPos(gu.seat)]; gu.wi = 0; gu.st = 'go'; }
        else { gu.path = [DOOR.clone(), GATE.clone().add(new THREE.Vector3((Math.random() - 0.5) * 3, 0, Math.random()))]; gu.wi = 0; gu.st = 'back'; }
        continue;
      }
      const goal = gu.path[gu.wi];
      if (!goal) { gu.st = 'wait'; gu.timer = 3; continue; }
      m.position.lerp(new THREE.Vector3(goal.x, this.groundY(goal.x, goal.z), goal.z), 1 - Math.pow(0.02, dt));
      m.lookAt(goal.x, 0, goal.z); up('walk');
      if (Math.hypot(m.position.x - goal.x, m.position.z - goal.z) >= (gu.st === 'go' && gu.wi === 1 ? 0.25 : 0.4)) continue;
      if (++gu.wi < gu.path.length) continue;
      if (gu.st === 'go') {
        gu.st = 'sit'; gu.timer = 8 + Math.random() * 8;
        const s = this.seats[gu.seat % this.seats.length];
        m.position.copy(s.getWorldPosition(new THREE.Vector3())); m.rotation.copy(s.rotation);
      } else { gu.st = 'wait'; gu.timer = 3 + Math.random() * 8; gu.seat = Math.floor(Math.random() * Math.max(1, this.seats.length)); }
    }
  }
}

function makeSteamTexture(): THREE.Texture {
  const cv = document.createElement('canvas');
  cv.width = 64; cv.height = 64;
  const ctx = cv.getContext('2d')!;
  const gr = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  gr.addColorStop(0, 'rgba(255,255,255,0.9)');
  gr.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gr; ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(cv);
}
