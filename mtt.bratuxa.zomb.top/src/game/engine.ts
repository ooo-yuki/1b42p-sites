import * as THREE from 'three';
import vrag1Url from '../assets/vrag1.png';
import vrag2Url from '../assets/vrag2.png';
import dom1Url from '../assets/dom1.png';

export interface HudState {
  coins: number;
  speed: number;
  score: number;
  stars: number;
  nitro: number;
  busted: boolean;
  inCar: boolean;
}

export interface GameEvents {
  onHud(h: HudState): void;
  onBusted(s: { score: number; coins: number }): void;
}

interface BotData {
  dir: number;
  sp: number;
  name: string;
  dead: number;
}

interface CarData {
  v: number;
  steer: number;
  wheels: THREE.Mesh[];
  bar?: THREE.Mesh;
  copGlow?: THREE.Sprite;
  flame?: THREE.Sprite;
}

const CITY = 200;
const HALF = CITY / 2;

function clampCity(v: number): number {
  return Math.max(-HALF + 4, Math.min(HALF - 4, v));
}

export class Game {
  input: Record<string, boolean> = {};
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private fwd = new THREE.Vector3();
  private raf = 0;
  private destroyed = false;
  private lastHud = 0;

  private car!: THREE.Group;
  private elf!: THREE.Group;
  private cops: THREE.Group[] = [];
  private bots: THREE.Group[] = [];
  private smokes: { s: THREE.Sprite; t: number }[] = [];
  private skids: THREE.Mesh[] = [];
  private skidN = 0;
  private solids: { x: number; z: number; r: number }[] = [];
  private glowTex: THREE.CanvasTexture;
  private started = false;

  private S = { coins: 0, score: 0, wanted: 0, inCar: true, heat: 0, over: false, t: 0, nitro: 100 };
  private AC: AudioContext | null = null;
  private engOsc: OscillatorNode | null = null;
  private engGain: GainNode | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private mmCanvas: HTMLCanvasElement,
    private ev: GameEvents,
  ) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 500);
    this.scene.background = new THREE.Color(0x060a12);
    this.scene.fog = new THREE.Fog(0x060a12, 60, 220);
    this.glowTex = Game.makeGlowTex();
    this.buildWorld();
    window.addEventListener('resize', this.onResize);
    this.loop();
  }

  private static makeGlowTex(): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const g = c.getContext('2d')!;
    const gr = g.createRadialGradient(64, 64, 2, 64, 64, 64);
    gr.addColorStop(0, 'rgba(255,255,255,1)');
    gr.addColorStop(0.35, 'rgba(255,255,255,.45)');
    gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }

  private glow(color: number, size: number, opacity = 0.6): THREE.Sprite {
    const m = new THREE.SpriteMaterial({
      map: this.glowTex, color, transparent: true, opacity,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    const s = new THREE.Sprite(m);
    s.scale.set(size, size, 1);
    return s;
  }

  private onResize = (): void => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  };

  private buildWorld(): void {
    const scene = this.scene;
    scene.add(new THREE.AmbientLight(0x8899bb, 0.55));
    const moon = new THREE.DirectionalLight(0x8fb4ff, 0.8);
    moon.position.set(-40, 80, -30);
    moon.castShadow = true;
    moon.shadow.mapSize.width = 1024;
    moon.shadow.mapSize.height = 1024;
    moon.shadow.camera.left = -70;
    moon.shadow.camera.right = 70;
    moon.shadow.camera.top = 70;
    moon.shadow.camera.bottom = -70;
    moon.shadow.camera.near = 10;
    moon.shadow.camera.far = 220;
    moon.shadow.bias = -0.0004;
    moon.shadow.normalBias = 0.03;
    scene.add(moon);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(CITY, CITY),
      new THREE.MeshStandardMaterial({ color: 0x0d1626, roughness: 0.5, metalness: 0.35 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1a2233, roughness: 0.38, metalness: 0.32 });
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xffd23f });
    for (let ri = -HALF; ri <= HALF; ri += 40) {
      const r1 = new THREE.Mesh(new THREE.PlaneGeometry(CITY, 7), roadMat);
      r1.rotation.x = -Math.PI / 2; r1.position.set(0, 0.02, ri); r1.receiveShadow = true; scene.add(r1);
      const r2 = new THREE.Mesh(new THREE.PlaneGeometry(7, CITY), roadMat);
      r2.rotation.x = -Math.PI / 2; r2.position.set(ri, 0.02, 0); r2.receiveShadow = true; scene.add(r2);
      for (let d = -HALF + 6; d < HALF; d += 12) {
        const s1 = new THREE.Mesh(new THREE.PlaneGeometry(3, 0.5), lineMat);
        s1.rotation.x = -Math.PI / 2; s1.position.set(d, 0.04, ri); scene.add(s1);
        const s2 = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 3), lineMat);
        s2.rotation.x = -Math.PI / 2; s2.position.set(ri, 0.04, d); scene.add(s2);
      }
    }

    // дома + билборды МТТ с текстурой подъезда
    const winTex = Game.makeWindowsTex();
    const bbTex = new THREE.TextureLoader().load(dom1Url);
    bbTex.colorSpace = THREE.SRGBColorSpace;
    for (let bx = -HALF + 20; bx < HALF; bx += 40) {
      for (let bz = -HALF + 20; bz < HALF; bz += 40) {
        if (Math.abs(bx) < 25 && Math.abs(bz) < 25) continue;
        const h = 12 + Math.random() * 30;
        const w = 16 + Math.random() * 8, d = 16 + Math.random() * 8;
        const m = new THREE.Mesh(
          new THREE.BoxGeometry(w, h, d),
          new THREE.MeshStandardMaterial({ map: winTex, roughness: 0.8 }),
        );
        m.position.set(bx, h / 2, bz);
        m.castShadow = true; m.receiveShadow = true;
        scene.add(m);
        this.solids.push({ x: bx, z: bz, r: 11 });
        if (Math.random() < 0.4) {
          const bb = new THREE.Mesh(
            new THREE.PlaneGeometry(10, 5.6),
            new THREE.MeshBasicMaterial({ map: bbTex }),
          );
          bb.position.set(bx, 7, bz + d / 2 + 0.3);
          scene.add(bb);
          const frame = new THREE.Mesh(
            new THREE.BoxGeometry(10.6, 6.2, 0.3),
            new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7 }),
          );
          frame.position.set(bx, 7, bz + d / 2 + 0.1);
          scene.add(frame);
        }
      }
    }

    // фонари + отражения
    const streakMat = new THREE.MeshBasicMaterial({
      color: 0xffd88a, transparent: true, opacity: 0.14,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });
    let lamps = 0;
    for (let lx = -HALF + 20; lx < HALF; lx += 40) {
      for (let lz = -HALF + 20; lz < HALF; lz += 40) {
        const fx = lx + 10, fz = lz + 10;
        const pole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.25, 0.25, 9, 8),
          new THREE.MeshStandardMaterial({ color: 0x334155 }),
        );
        pole.castShadow = true;
        pole.position.set(fx, 4.5, fz);
        scene.add(pole);
        const bulb = new THREE.Mesh(
          new THREE.SphereGeometry(0.6, 10, 10),
          new THREE.MeshBasicMaterial({ color: 0xffe9a8 }),
        );
        bulb.position.set(fx, 9.2, fz);
        scene.add(bulb);
        const bg = this.glow(0xffe9a8, 4, 0.55);
        bg.position.set(fx, 9.2, fz);
        scene.add(bg);
        const streak = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 9), streakMat);
        streak.rotation.x = -Math.PI / 2;
        streak.position.set(fx, 0.05, fz);
        scene.add(streak);
        if (lamps < 8) {
          const pl = new THREE.PointLight(0xffd88a, 1.2, 42);
          pl.position.set(fx, 9, fz);
          scene.add(pl);
          lamps++;
        }
      }
    }

    this.car = this.makeCar(0xff9f1c, false, true);
    this.car.position.set(0, 0, 10);
    scene.add(this.car);
    this.elf = this.makeElf(0xff9f1c);
    this.elf.position.set(3, 0, 10);
    this.elf.visible = false;
    scene.add(this.elf);
    for (let i = 0; i < 10; i++) this.spawnBot();
    for (let i = 0; i < 14; i++) this.spawnCoin();
  }

  private static makeWindowsTex(): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d')!;
    g.fillStyle = '#101828';
    g.fillRect(0, 0, 64, 64);
    for (let y = 4; y < 64; y += 12) {
      for (let x = 4; x < 64; x += 12) {
        g.fillStyle = Math.random() < 0.5 ? '#ffe27a' : '#27436b';
        g.fillRect(x, y, 7, 8);
      }
    }
    return new THREE.CanvasTexture(c);
  }

  private makeCar(color: number, isCop: boolean, isHero: boolean): THREE.Group {
    const g = new THREE.Group();
    const mat = isHero
      ? new THREE.MeshPhysicalMaterial({ color, roughness: 0.25, metalness: 0.7, clearcoat: 1, clearcoatRoughness: 0.15 })
      : new THREE.MeshStandardMaterial({ color, roughness: 0.35, metalness: 0.6 });
    const b = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.8, 4.4), mat);
    b.position.y = 0.75; b.castShadow = true; g.add(b);
    const cab = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 0.7, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x0e1626, roughness: 0.15, metalness: 0.85 }),
    );
    cab.position.set(0, 1.4, -0.2); cab.castShadow = true; g.add(cab);
    const wg = new THREE.CylinderGeometry(0.45, 0.45, 0.4, 12);
    const wm = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const wheels: THREE.Mesh[] = [];
    [[-1.15, 1.5], [1.15, 1.5], [-1.15, -1.5], [1.15, -1.5]].forEach(([x, z]) => {
      const w = new THREE.Mesh(wg, wm);
      w.rotation.z = Math.PI / 2;
      w.position.set(x, 0.45, z);
      w.castShadow = true;
      g.add(w);
      wheels.push(w);
    });
    const hl = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.3, 0.2),
      new THREE.MeshBasicMaterial({ color: 0xfff6c8 }),
    );
    hl.position.set(0, 0.8, 2.25); g.add(hl);
    const hlg = this.glow(0xfff2c0, 3, 0.5);
    hlg.position.set(0, 0.9, 2.4); g.add(hlg);
    const tl = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 0.25, 0.15),
      new THREE.MeshBasicMaterial({ color: 0xff2222 }),
    );
    tl.position.set(0, 0.8, -2.25); g.add(tl);
    const tlg = this.glow(0xff2222, 2.4, 0.55);
    tlg.position.set(0, 0.9, -2.4); g.add(tlg);
    const data: CarData = { v: 0, steer: 0, wheels };
    if (isCop) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.25, 0.5),
        new THREE.MeshBasicMaterial({ color: 0x2244ff }),
      );
      bar.position.set(0, 1.9, -0.2);
      g.add(bar);
      data.bar = bar;
      const copGlow = this.glow(0x2244ff, 3.5, 0.7);
      copGlow.position.set(0, 2.1, -0.2);
      g.add(copGlow);
      data.copGlow = copGlow;
    }
    if (isHero) {
      const spot = new THREE.SpotLight(0xfff2c0, 2.2, 65, 0.55, 0.5, 1);
      spot.position.set(0, 1.2, 2.2);
      const tgt = new THREE.Object3D();
      tgt.position.set(0, 0, 30);
      g.add(tgt);
      spot.target = tgt;
      g.add(spot);
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0xfff2c0, transparent: true, opacity: 0.1,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
      });
      const coneGeo = new THREE.ConeGeometry(3.2, 15, 16, 1, true);
      [-0.8, 0.8].forEach((x) => {
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.rotation.x = Math.PI / 2;
        cone.position.set(x, 0.9, 2.2 + 7.5);
        g.add(cone);
      });
      const under = new THREE.Mesh(
        new THREE.PlaneGeometry(3.4, 5.4),
        new THREE.MeshBasicMaterial({
          color: 0x00e5ff, transparent: true, opacity: 0.22,
          blending: THREE.AdditiveBlending, depthWrite: false,
        }),
      );
      under.rotation.x = -Math.PI / 2;
      under.position.y = 0.06;
      g.add(under);
      const flame = this.glow(0xff6a00, 3, 0);
      flame.position.set(0, 0.8, -2.6);
      g.add(flame);
      data.flame = flame;
    }
    g.userData.car = data;
    return g;
  }

  private carData(g: THREE.Group): CarData {
    return g.userData.car as CarData;
  }

  private makeElf(shirt: number): THREE.Group {
    const g = new THREE.Group();
    const legs = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.8, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x273449 }),
    );
    legs.position.y = 0.4; legs.castShadow = true; g.add(legs);
    const torso = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.8, 0.45),
      new THREE.MeshStandardMaterial({ color: shirt }),
    );
    torso.position.y = 1.2; torso.castShadow = true; g.add(torso);
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0xf2c9a0 }),
    );
    head.position.y = 1.95; head.castShadow = true; g.add(head);
    const hat = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 0.7, 10),
      new THREE.MeshStandardMaterial({ color: 0xff9f1c }),
    );
    hat.position.y = 2.4; g.add(hat);
    return g;
  }

  // Пешеходы — фото МТТ (враг 1 / враг 2) вместо коробок
  private spawnBot(): void {
    const tex = new THREE.TextureLoader().load(Math.random() < 0.5 ? vrag1Url : vrag2Url);
    tex.colorSpace = THREE.SRGBColorSpace;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
    sp.scale.set(1.3, 1.9, 1);
    const a = Math.random() * Math.PI * 2;
    const r = 20 + Math.random() * 60;
    sp.position.set(Math.cos(a) * r, 0.95, Math.sin(a) * r);
    sp.userData.bot = {
      dir: Math.random() * Math.PI * 2,
      sp: 1 + Math.random() * 1.5,
      name: 'Бот',
      dead: 0,
    } as BotData;
    this.scene.add(sp);
    const holder = new THREE.Group();
    holder.position.copy(sp.position);
    holder.add(sp);
    sp.position.set(0, 0.95, 0);
    this.scene.add(holder);
    this.bots.push(holder);
  }

  private coinsArr: THREE.Mesh[] = [];

  private spawnCoin(): void {
    const geo = new THREE.CylinderGeometry(0.7, 0.7, 0.15, 18);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffd23f, metalness: 0.9, roughness: 0.25, emissive: 0x553300,
    });
    const m = new THREE.Mesh(geo, mat);
    const rx = (Math.floor(Math.random() * 5) - 2) * 40;
    const rz = (Math.floor(Math.random() * 5) - 2) * 40;
    m.position.set(rx + (Math.random() * 10 - 5), 1.1, rz + (Math.random() * 10 - 5));
    m.rotation.x = Math.PI / 2;
    this.scene.add(m);
    const cg = this.glow(0xffd23f, 2.6, 0.5);
    cg.position.copy(m.position);
    this.scene.add(cg);
    (m.userData as { glow?: THREE.Sprite }).glow = cg;
    this.coinsArr.push(m);
  }

  start(): void {
    this.started = true;
    this.engStart();
    this.blip(660);
  }

  destroy(): void {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    try { this.engOsc?.stop(); } catch { /* noop */ }
    this.renderer.dispose();
  }

  toggleCar(): void {
    if (this.S.over) return;
    this.S.inCar = !this.S.inCar;
    if (this.S.inCar) {
      this.car.position.copy(this.elf.position);
      this.car.rotation.y = this.elf.rotation.y;
      this.elf.visible = false;
    } else {
      this.elf.position.set(this.car.position.x + 2.5, 0, this.car.position.z);
      this.elf.rotation.y = this.car.rotation.y;
      this.elf.visible = true;
    }
    this.blip(this.S.inCar ? 500 : 300);
  }

  get score(): number { return this.S.score; }
  get coinCount(): number { return this.S.coins; }

  debugDrive(s: boolean): void { this.input.KeyW = s; }
  debugNitro(s: boolean): void { this.input.ShiftLeft = s; }
  debugPos(): { x: number; z: number; car: boolean } {
    return { x: Math.round(this.car.position.x), z: Math.round(this.car.position.z), car: this.S.inCar };
  }
  debugNitroLeft(): number { return Math.round(this.S.nitro); }

  private blip(f: number): void {
    try {
      this.AC = this.AC || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const o = this.AC.createOscillator();
      const g = this.AC.createGain();
      o.type = 'square';
      o.frequency.value = f;
      g.gain.value = 0.06;
      o.connect(g);
      g.connect(this.AC.destination);
      o.start();
      o.stop(this.AC.currentTime + 0.09);
    } catch { /* noop */ }
  }

  private engStart(): void {
    try {
      this.AC = this.AC || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      this.engOsc = this.AC.createOscillator();
      this.engGain = this.AC.createGain();
      this.engOsc.type = 'sawtooth';
      this.engOsc.frequency.value = 50;
      this.engGain.gain.value = 0;
      this.engOsc.connect(this.engGain);
      this.engGain.connect(this.AC.destination);
      this.engOsc.start();
    } catch { /* noop */ }
  }

  private engUpdate(v: number, thr: boolean): void {
    try {
      if (!this.engOsc || !this.engGain) return;
      this.engOsc.frequency.value = 50 + Math.abs(v) * 4.2;
      this.engGain.gain.value = thr ? 0.035 : 0.008;
    } catch { /* noop */ }
  }

  private hitSolid(x: number, z: number, rad: number): boolean {
    for (const s of this.solids) {
      const dx = x - s.x, dz = z - s.z;
      if (dx * dx + dz * dz < (s.r + rad) * (s.r + rad)) return true;
    }
    return false;
  }

  private starStr(): string {
    let s = '';
    for (let i = 0; i < 5; i++) s += i < this.S.wanted ? '★' : '☆';
    return s;
  }

  private spawnCop(): void {
    const c = this.makeCar(0x2255dd, true, false);
    const a = Math.random() * Math.PI * 2;
    c.position.set(Math.cos(a) * 70, 0, Math.sin(a) * 70);
    this.scene.add(c);
    this.cops.push(c);
  }

  bust = (): void => {
    if (this.S.over) return;
    this.S.over = true;
    this.pushHud(true);
    this.blip(70);
    window.setTimeout(() => {
      this.S.over = false;
      this.S.wanted = 0;
      this.S.coins = Math.max(0, this.S.coins - 5);
      while (this.cops.length) {
        const c = this.cops.pop()!;
        this.scene.remove(c);
      }
      this.car.position.set(0, 0, 10);
      this.carData(this.car).v = 0;
      this.car.rotation.y = 0;
      if (!this.S.inCar) {
        this.S.inCar = true;
        this.elf.visible = false;
      }
      this.pushHud(false);
    }, 2200);
  };

  private pushHud(busted: boolean): void {
    this.ev.onHud({
      coins: this.S.coins,
      speed: Math.round(Math.abs(this.carData(this.car).v) * 3.6),
      score: this.S.score,
      stars: this.S.wanted,
      nitro: Math.round(this.S.nitro),
      busted,
      inCar: this.S.inCar,
    });
  }

  starText(): string {
    return this.starStr();
  }

  private loop = (): void => {
    if (this.destroyed) return;
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    if (this.started && !this.S.over) {
      this.S.t += dt;
      this.S.score += Math.floor(dt * (this.S.inCar ? Math.abs(this.carData(this.car).v) : 2));
      if (this.S.inCar) this.steerCar(dt);
      else this.steerElf(dt);
      this.updateBots(dt);
      this.updateCops(dt);
      this.updateCoins(dt);
      this.updateFx(dt);
      if (Math.floor(this.S.t * 5) !== Math.floor((this.S.t - dt) * 5)) {
        this.pushHud(false);
        this.drawMM();
      }
      const f = this.S.inCar ? this.car.position : this.elf.position;
      const back = this.S.inCar ? 13 : 8;
      const up = this.S.inCar ? 7 : 5;
      this.fwd.set(0, 0, 1).applyEuler(this.S.inCar ? this.car.rotation : this.elf.rotation);
      let ct = 1;
      for (let tt = 1; tt > 0.2; tt -= 0.1) {
        const px = f.x - this.fwd.x * back * tt;
        const pz = f.z - this.fwd.z * back * tt;
        if (!this.hitSolid(px, pz, 2)) { ct = tt; break; }
        ct = tt;
      }
      this.camera.position.set(f.x - this.fwd.x * back * ct, up + (1 - ct) * 4, f.z - this.fwd.z * back * ct);
      this.camera.lookAt(f.x, 2, f.z);
    }
    this.renderer.render(this.scene, this.camera);
  };

  private steerCar(dt: number): void {
    const k = this.input;
    const gas = (k.KeyW || k.ArrowUp ? 1 : 0) - (k.KeyS || k.ArrowDown ? 1 : 0);
    const lr = (k.KeyA || k.ArrowLeft ? 1 : 0) - (k.KeyD || k.ArrowRight ? 1 : 0);
    const wantNitro = (!!k.ShiftLeft || !!k.ShiftRight) && gas > 0 && this.S.nitro > 1;
    const u = this.carData(this.car);
    const vmax = wantNitro ? 52 : 34;
    if (wantNitro) this.S.nitro = Math.max(0, this.S.nitro - 35 * dt);
    else this.S.nitro = Math.min(100, this.S.nitro + 12 * dt);
    u.v += gas * (wantNitro ? 34 : 22) * dt;
    u.v *= Math.pow(k.Space ? 0.2 : 0.92, dt * 60);
    u.v = Math.max(-14, Math.min(vmax, u.v));
    u.steer += ((u.v >= 0 ? lr : -lr) * 0.55 - u.steer) * Math.min(1, dt * 8);
    this.car.rotation.y += u.steer * dt * Math.min(1, Math.abs(u.v) / 8) * (u.v >= 0 ? 1 : -1) * 2;
    this.fwd.set(0, 0, 1).applyEuler(this.car.rotation);
    const nx = this.car.position.x + this.fwd.x * u.v * dt;
    const nz = this.car.position.z + this.fwd.z * u.v * dt;
    if (!this.hitSolid(nx, nz, 2.4)) {
      this.car.position.x = clampCity(nx);
      this.car.position.z = clampCity(nz);
    } else {
      u.v *= -0.3;
      if (Math.abs(u.v) > 6) this.addWanted(0);
      this.blip(140);
    }
    u.wheels.forEach((w) => { w.rotation.x += u.v * dt * 2; });
    const drifting = !!k.Space && Math.abs(u.v) > 10;
    if (drifting) {
      this.puff(this.car.position.x - this.fwd.x * 2, 0.6, this.car.position.z - this.fwd.z * 2);
      this.skid(
        this.car.position.x - this.fwd.x * 2 + this.fwd.z * 1,
        this.car.position.z - this.fwd.z * 2 - this.fwd.x * 1,
        this.car.rotation.y,
      );
    }
    if (u.flame) u.flame.material.opacity = wantNitro ? 0.6 + Math.random() * 0.4 : 0;
    const fovTgt = wantNitro ? 75 : 65;
    const cam = this.camera as THREE.PerspectiveCamera;
    if (Math.abs(cam.fov - fovTgt) > 0.5) {
      cam.fov += (fovTgt - cam.fov) * Math.min(1, dt * 4);
      cam.updateProjectionMatrix();
    }
    this.engUpdate(u.v, gas !== 0);
    for (let i = this.bots.length - 1; i >= 0; i--) {
      const b = this.bots[i];
      const ud = b.userData.bot as BotData;
      if (ud.dead > 0) continue;
      const dx = b.position.x - this.car.position.x;
      const dz = b.position.z - this.car.position.z;
      if (dx * dx + dz * dz < 7 && Math.abs(u.v) > 4) {
        ud.dead = 5;
        this.addWanted(1);
        this.S.score += 10;
        this.blip(90);
      }
    }
    for (const c of this.cops) {
      const dx2 = c.position.x - this.car.position.x;
      const dz2 = c.position.z - this.car.position.z;
      if (dx2 * dx2 + dz2 * dz2 < 9) {
        u.v *= 0.5;
        this.S.heat = 1;
      }
    }
  }

  private steerElf(dt: number): void {
    const k = this.input;
    const mx = (k.KeyD || k.ArrowRight ? 1 : 0) - (k.KeyA || k.ArrowLeft ? 1 : 0);
    const mz = (k.KeyS || k.ArrowDown ? 1 : 0) - (k.KeyW || k.ArrowUp ? 1 : 0);
    const sp = k.ShiftLeft ? 11 : 6;
    if (mx || mz) {
      const a = Math.atan2(mx, mz);
      this.elf.rotation.y = a;
      const nx = this.elf.position.x + Math.sin(a) * sp * dt;
      const nz = this.elf.position.z + Math.cos(a) * sp * dt;
      if (!this.hitSolid(nx, nz, 1)) {
        this.elf.position.x = clampCity(nx);
        this.elf.position.z = clampCity(nz);
      }
      this.elf.position.y = Math.abs(Math.sin(this.S.t * 10)) * 0.15;
    } else {
      this.elf.position.y = 0;
    }
    this.engUpdate(0, false);
  }

  private addWanted(n: number): void {
    this.S.wanted = Math.max(0, Math.min(5, this.S.wanted + n));
    this.S.heat = 1;
    while (this.cops.length < this.S.wanted) this.spawnCop();
  }

  private updateBots(dt: number): void {
    for (let i = 0; i < this.bots.length; i++) {
      const b = this.bots[i];
      const u = b.userData.bot as BotData;
      if (u.dead > 0) {
        u.dead -= dt;
        if (u.dead <= 0) {
          b.visible = true;
          const a = Math.random() * Math.PI * 2;
          const r = 20 + Math.random() * 60;
          b.position.set(Math.cos(a) * r, 0, Math.sin(a) * r);
        }
        continue;
      }
      if (Math.random() < dt * 0.3) u.dir += (Math.random() - 0.5) * 2;
      const nx = b.position.x + Math.sin(u.dir) * u.sp * dt;
      const nz = b.position.z + Math.cos(u.dir) * u.sp * dt;
      if (!this.hitSolid(nx, nz, 1) && Math.abs(nx) < HALF && Math.abs(nz) < HALF) {
        b.position.x = nx;
        b.position.z = nz;
      } else {
        u.dir += Math.PI / 2;
      }
      b.position.y = Math.abs(Math.sin(this.S.t * 8 + i)) * 0.1;
    }
  }

  private updateCops(dt: number): void {
    const tx = this.S.inCar ? this.car.position : this.elf.position;
    for (const c of this.cops) {
      const dx = tx.x - c.position.x;
      const dz = tx.z - c.position.z;
      const d = Math.hypot(dx, dz) || 1;
      if (this.S.wanted > 0) {
        c.rotation.y = Math.atan2(dx, dz);
        this.fwd.set(0, 0, 1).applyEuler(c.rotation);
        const nx = c.position.x + this.fwd.x * 20 * dt;
        const nz = c.position.z + this.fwd.z * 20 * dt;
        if (!this.hitSolid(nx, nz, 2.4)) {
          c.position.x = clampCity(nx);
          c.position.z = clampCity(nz);
        }
        const redPhase = Math.floor(this.S.t * 4) % 2;
        const data = this.carData(c);
        (data.bar!.material as THREE.MeshBasicMaterial).color.setHex(redPhase ? 0xff2222 : 0x2244ff);
        if (data.copGlow) data.copGlow.material.color.setHex(redPhase ? 0xff2222 : 0x2244ff);
        if (d < 4) {
          if (this.S.inCar && Math.abs(this.carData(this.car).v) < 2) this.bust();
          else if (!this.S.inCar) this.bust();
        }
      }
    }
    if (this.S.wanted > 0) {
      this.S.heat -= dt * 0.05;
      if (this.S.heat <= 0) {
        this.S.wanted--;
        this.S.heat = this.S.wanted > 0 ? 1 : 0;
        while (this.cops.length > this.S.wanted) {
          const c2 = this.cops.pop()!;
          this.scene.remove(c2);
        }
      }
    }
  }

  private updateCoins(dt: number): void {
    const p = this.S.inCar ? this.car.position : this.elf.position;
    for (let i = this.coinsArr.length - 1; i >= 0; i--) {
      const m = this.coinsArr[i];
      m.rotation.z += dt * 3;
      const dx = m.position.x - p.x;
      const dz = m.position.z - p.z;
      if (dx * dx + dz * dz < 6) {
        this.scene.remove(m);
        const gl = (m.userData as { glow?: THREE.Sprite }).glow;
        if (gl) this.scene.remove(gl);
        this.coinsArr.splice(i, 1);
        this.S.coins++;
        this.S.score += 25;
        this.blip(880);
        this.spawnCoin();
      }
    }
  }

  private puff(x: number, y: number, z: number): void {
    const s = this.glow(0x9aa4b8, 1.5, 0.4);
    s.position.set(x, y, z);
    this.scene.add(s);
    this.smokes.push({ s, t: 0.8 });
  }

  private skid(x: number, z: number, rot: number): void {
    const geo = new THREE.PlaneGeometry(1.3, 0.4);
    let m: THREE.Mesh;
    if (this.skidN < 80) {
      m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
        color: 0x05070c, transparent: true, opacity: 0.55, depthWrite: false,
      }));
      this.scene.add(m);
      this.skids.push(m);
    } else {
      m = this.skids[this.skidN % 80];
    }
    m.position.set(x, 0.045, z);
    m.rotation.set(-Math.PI / 2, 0, rot);
    (m.material as THREE.MeshBasicMaterial).opacity = 0.55;
    (m.userData as { t?: number }).t = 6;
    this.skidN++;
  }

  private updateFx(dt: number): void {
    for (let i = this.smokes.length - 1; i >= 0; i--) {
      const p = this.smokes[i];
      p.t -= dt;
      p.s.position.y += dt * 2;
      const sc = p.s.scale.x + dt * 3;
      p.s.scale.set(sc, sc, 1);
      p.s.material.opacity = Math.max(p.t, 0) * 0.5;
      if (p.t <= 0) {
        this.scene.remove(p.s);
        this.smokes.splice(i, 1);
      }
    }
    for (const m of this.skids) {
      const t = (m.userData as { t?: number }).t || 0;
      if (t > 0) {
        (m.userData as { t?: number }).t = t - dt;
        (m.material as THREE.MeshBasicMaterial).opacity = Math.max(t / 6, 0) * 0.55;
      }
    }
  }

  private drawMM(): void {
    const g = this.mmCanvas.getContext('2d');
    if (!g) return;
    const k = 140 / CITY;
    g.fillStyle = 'rgba(4,8,16,.9)';
    g.fillRect(0, 0, 140, 140);
    g.strokeStyle = '#2a3a5f';
    for (let r = -HALF; r <= HALF; r += 40) {
      g.beginPath(); g.moveTo(0, (r + HALF) * k); g.lineTo(140, (r + HALF) * k); g.stroke();
      g.beginPath(); g.moveTo((r + HALF) * k, 0); g.lineTo((r + HALF) * k, 140); g.stroke();
    }
    g.fillStyle = '#ff9f1c';
    for (const h of this.solids) {
      g.fillRect((h.x + HALF) * k - 2, (h.z + HALF) * k - 2, 4, 4);
    }
    g.fillStyle = '#ffd23f';
    for (const m of this.coinsArr) {
      g.fillRect((m.position.x + HALF) * k - 1, (m.position.z + HALF) * k - 1, 2, 2);
    }
    const redPhase = Math.floor(this.S.t * 4) % 2;
    g.fillStyle = redPhase ? '#ff2222' : '#2244ff';
    for (const cp of this.cops) {
      g.beginPath();
      g.arc((cp.position.x + HALF) * k, (cp.position.z + HALF) * k, 2.5, 0, 6.29);
      g.fill();
    }
    const p = this.S.inCar ? this.car.position : this.elf.position;
    const rot = this.S.inCar ? this.car.rotation.y : this.elf.rotation.y;
    g.save();
    g.translate((p.x + HALF) * k, (p.z + HALF) * k);
    g.rotate(Math.atan2(Math.sin(rot), -Math.cos(rot)) + Math.PI);
    g.fillStyle = '#fff';
    g.beginPath();
    g.moveTo(0, -5);
    g.lineTo(3.5, 4);
    g.lineTo(-3.5, 4);
    g.closePath();
    g.fill();
    g.restore();
  }
}
