import * as THREE from 'three';
import vrag1Url from '../assets/vrag1.png';
import vrag2Url from '../assets/vrag2.png';
import dom1Url from '../assets/dom1.png';

export interface HudState {
  hp: number;
  maxhp: number;
  score: number;
  kills: number;
  enemies: number;
  wave: number;
  dead: boolean;
}

export interface GameEvents {
  onHud(h: HudState): void;
  onBusted(s: { score: number; coins: number }): void;
}

interface Enemy {
  g: THREE.Group;
  body: THREE.Sprite;
  hpBg: THREE.Sprite;
  hpFg: THREE.Sprite;
  hp: number;
  maxhp: number;
  speed: number;
  hitCd: number;
  hurtT: number;
  dead: boolean;
}

const ARENA = 110;
const HALF = ARENA / 2;

function clampArena(v: number): number {
  return Math.max(-HALF + 3, Math.min(HALF - 3, v));
}

export class Game {
  input: Record<string, boolean> = {};
  joy = { x: 0, y: 0 };
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private clock = new THREE.Clock();
  private raf = 0;
  private destroyed = false;
  private started = false;

  private px = 0;
  private pz = 22;
  private yaw = 0;
  private pitch = 0;
  private hp = 100;
  private maxhp = 100;
  private score = 0;
  private kills = 0;
  private wave = 1;
  private dead = false;
  private atkCd = 0;
  private swingT = 0;
  private shakeT = 0;
  private enemies: Enemy[] = [];
  private solids: { x: number; z: number; r: number }[] = [];
  private AC: AudioContext | null = null;
  private lookPointer = -1;
  private lookLX = 0;
  private lookLY = 0;

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
    this.camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 400);
    this.camera.rotation.order = 'YXZ';
    this.scene.background = new THREE.Color(0x060a12);
    this.scene.fog = new THREE.Fog(0x060a12, 40, 160);
    this.buildWorld();
    this.spawnWave();
    window.addEventListener('resize', this.onResize);
    canvas.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    this.loop();
  }

  private onResize = (): void => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  };

  private onPointerDown = (e: PointerEvent): void => {
    // клик/тап по правой половине — осмотр; сам удар идёт кнопкой/пробелом
    if (this.lookPointer !== -1) return;
    this.lookPointer = e.pointerId;
    this.lookLX = e.clientX;
    this.lookLY = e.clientY;
  };
  private onPointerMove = (e: PointerEvent): void => {
    if (e.pointerId !== this.lookPointer) return;
    const dx = e.clientX - this.lookLX;
    const dy = e.clientY - this.lookLY;
    this.lookLX = e.clientX;
    this.lookLY = e.clientY;
    this.addLook(dx, dy);
  };
  private onPointerUp = (e: PointerEvent): void => {
    if (e.pointerId === this.lookPointer) this.lookPointer = -1;
  };

  addLook(dx: number, dy: number): void {
    this.yaw -= dx * 0.0042;
    this.pitch -= dy * 0.0032;
    this.pitch = Math.max(-1.1, Math.min(1.1, this.pitch));
  }

  setJoy(x: number, y: number): void {
    this.joy.x = Math.max(-1, Math.min(1, x));
    this.joy.y = Math.max(-1, Math.min(1, y));
  }

  private buildWorld(): void {
    const scene = this.scene;
    scene.add(new THREE.AmbientLight(0x8899bb, 0.6));
    const moon = new THREE.DirectionalLight(0x8fb4ff, 0.9);
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
    scene.add(moon);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(ARENA + 20, ARENA + 20),
      new THREE.MeshStandardMaterial({ color: 0x0d1626, roughness: 0.55, metalness: 0.3 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // сетка улиц для ориентации
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x223148 });
    for (let i = -HALF; i <= HALF; i += 22) {
      const l1 = new THREE.Mesh(new THREE.PlaneGeometry(ARENA, 0.4), lineMat);
      l1.rotation.x = -Math.PI / 2; l1.position.set(0, 0.02, i); scene.add(l1);
      const l2 = new THREE.Mesh(new THREE.PlaneGeometry(0.4, ARENA), lineMat);
      l2.rotation.x = -Math.PI / 2; l2.position.set(i, 0.02, 0); scene.add(l2);
    }

    // периметр — дома МТТ (текстура подъезда)
    const wallTex = new THREE.TextureLoader().load(dom1Url);
    wallTex.colorSpace = THREE.SRGBColorSpace;
    wallTex.wrapS = wallTex.wrapT = THREE.RepeatWrapping;
    wallTex.repeat.set(8, 1);
    const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.85 });
    const wallGeoH = new THREE.BoxGeometry(ARENA + 8, 14, 2);
    const wallGeoV = new THREE.BoxGeometry(2, 14, ARENA + 8);
    [[0, -HALF - 1, wallGeoH], [0, HALF + 1, wallGeoH]].forEach(([x, z, g]) => {
      const m = new THREE.Mesh(g as THREE.BufferGeometry, wallMat);
      m.position.set(x as number, 7, z as number);
      scene.add(m);
    });
    [[-HALF - 1, 0, wallGeoV], [HALF + 1, 0, wallGeoV]].forEach(([x, z, g]) => {
      const m = new THREE.Mesh(g as THREE.BufferGeometry, wallMat);
      m.position.set(x as number, 7, z as number);
      scene.add(m);
    });

    // укрытия-коробки + билборды
    const winTex = Game.makeWindowsTex();
    const bbTex = new THREE.TextureLoader().load(dom1Url);
    bbTex.colorSpace = THREE.SRGBColorSpace;
    const spots: Array<[number, number]> = [[-30, -20], [28, -28], [-24, 18], [30, 22], [0, -38], [-38, -2], [38, 0], [0, 38]];
    for (const [bx, bz] of spots) {
      const w = 10 + Math.random() * 4, d = 8 + Math.random() * 4, h = 7 + Math.random() * 6;
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({ map: winTex, roughness: 0.8 }),
      );
      m.position.set(bx, h / 2, bz);
      m.castShadow = true; m.receiveShadow = true;
      scene.add(m);
      this.solids.push({ x: bx, z: bz, r: Math.max(w, d) / 2 + 0.6 });
      if (Math.random() < 0.6) {
        const bb = new THREE.Mesh(new THREE.PlaneGeometry(8, 4.5), new THREE.MeshBasicMaterial({ map: bbTex }));
        bb.position.set(bx, h + 2.6, bz);
        bb.rotation.y = Math.atan2(-bx, -bz);
        scene.add(bb);
      }
    }

    // фонари
    for (const [fx, fz] of [[-44, -44], [44, -44], [-44, 44], [44, 44], [0, 0]] as Array<[number, number]>) {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 9, 8),
        new THREE.MeshStandardMaterial({ color: 0x334155 }),
      );
      pole.position.set(fx, 4.5, fz);
      pole.castShadow = true;
      scene.add(pole);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.6, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffe9a8 }));
      bulb.position.set(fx, 9.2, fz);
      scene.add(bulb);
      const pl = new THREE.PointLight(0xffd88a, 1.1, 46);
      pl.position.set(fx, 9, fz);
      scene.add(pl);
    }
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

  private spawnWave(): void {
    const n = Math.min(4 + this.wave, 10);
    for (let i = 0; i < n; i++) this.spawnEnemy();
  }

  private spawnEnemy(): void {
    const tex = new THREE.TextureLoader().load(Math.random() < 0.5 ? vrag1Url : vrag2Url);
    tex.colorSpace = THREE.SRGBColorSpace;
    const g = new THREE.Group();
    const body = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
    body.scale.set(1.4, 2.0, 1);
    body.position.set(0, 1.0, 0);
    g.add(body);
    const bg = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0x5a0d0d, depthTest: false }));
    bg.scale.set(1.3, 0.13, 1);
    bg.position.set(0, 2.25, 0);
    g.add(bg);
    const fg = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0x39d353, depthTest: false }));
    fg.scale.set(1.3, 0.13, 1);
    fg.position.set(0, 2.25, 0);
    g.add(fg);
    const a = Math.random() * Math.PI * 2;
    const r = 30 + Math.random() * 18;
    g.position.set(clampArena(Math.cos(a) * r), 0, clampArena(Math.sin(a) * r));
    this.scene.add(g);
    this.enemies.push({
      g, body, hpBg: bg, hpFg: fg,
      hp: 100, maxhp: 100,
      speed: 1.7 + Math.random() * 1.1 + this.wave * 0.12,
      hitCd: 0, hurtT: 0, dead: false,
    });
  }

  private updateHpBar(e: Enemy): void {
    const f = Math.max(0, e.hp / e.maxhp);
    e.hpFg.scale.x = 1.3 * f;
    e.hpFg.position.x = -1.3 * (1 - f) / 2;
    (e.hpFg.material as THREE.SpriteMaterial).color.set(f > 0.5 ? 0x39d353 : f > 0.25 ? 0xffd23f : 0xff3b3b);
  }

  start(): void {
    this.started = true;
    this.blip(660);
  }

  destroy(): void {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.onResize);
    this.canvas.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerup', this.onPointerUp);
    this.renderer.dispose();
  }

  attack(): number {
    if (!this.started || this.dead) return 0;
    if (this.atkCd > 0) return 0;
    this.atkCd = 0.45;
    this.swingT = 0.22;
    this.blip(220);
    const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw);
    let hits = 0;
    for (const e of this.enemies) {
      if (e.dead) continue;
      const dx = e.g.position.x - this.px;
      const dz = e.g.position.z - this.pz;
      const d = Math.hypot(dx, dz);
      if (d > 3.8) continue;
      const cos = (dx * fx + dz * fz) / (d || 1);
      if (cos < 0.35) continue;
      e.hp -= 32 + Math.random() * 8;
      e.hurtT = 0.18;
      const push = 1.6;
      e.g.position.x = clampArena(e.g.position.x + (dx / (d || 1)) * push);
      e.g.position.z = clampArena(e.g.position.z + (dz / (d || 1)) * push);
      this.updateHpBar(e);
      hits++;
      if (e.hp <= 0) {
        e.dead = true;
        this.scene.remove(e.g);
        this.kills++;
        this.score += 100 + this.wave * 10;
        this.blip(520);
      }
    }
    if (hits > 0) this.blip(440);
    this.pushHud();
    if (this.enemies.every((e) => e.dead)) {
      this.wave++;
      this.hp = Math.min(this.maxhp, this.hp + 25);
      this.spawnWave();
    }
    this.drawMM();
    return hits;
  }

  private hitSolid(x: number, z: number, rad: number): boolean {
    for (const s of this.solids) {
      const dx = x - s.x, dz = z - s.z;
      if (dx * dx + dz * dz < (s.r + rad) * (s.r + rad)) return true;
    }
    return false;
  }

  private blip(f: number): void {
    try {
      this.AC = this.AC || new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const o = this.AC.createOscillator();
      const g = this.AC.createGain();
      o.type = 'square';
      o.frequency.value = f;
      g.gain.value = 0.05;
      o.connect(g);
      g.connect(this.AC.destination);
      o.start();
      o.stop(this.AC.currentTime + 0.08);
    } catch { /* noop */ }
  }

  private pushHud(): void {
    this.ev.onHud({
      hp: Math.max(0, Math.round(this.hp)),
      maxhp: this.maxhp,
      score: this.score,
      kills: this.kills,
      enemies: this.enemies.filter((e) => !e.dead).length,
      wave: this.wave,
      dead: this.dead,
    });
  }

  private drawMM(): void {
    const c = this.mmCanvas;
    const g = c.getContext('2d');
    if (!g) return;
    const W = c.width, H = c.height;
    g.fillStyle = 'rgba(4,8,16,.9)';
    g.fillRect(0, 0, W, H);
    const toMap = (x: number, z: number): [number, number] => [
      W / 2 + (x / (HALF + 4)) * (W / 2 - 4),
      H / 2 + (z / (HALF + 4)) * (H / 2 - 4),
    ];
    g.fillStyle = '#ff9f1c';
    const [mx, mz] = toMap(this.px, this.pz);
    g.beginPath(); g.arc(mx, mz, 4, 0, Math.PI * 2); g.fill();
    g.fillStyle = '#ff3b3b';
    for (const e of this.enemies) {
      if (e.dead) continue;
      const [ex, ez] = toMap(e.g.position.x, e.g.position.z);
      g.fillRect(ex - 2, ez - 2, 4, 4);
    }
  }

  // хуки для тестов
  debugPos(): { x: number; z: number; hp: number; enemies: number; kills: number; wave: number } {
    return {
      x: Math.round(this.px * 10) / 10,
      z: Math.round(this.pz * 10) / 10,
      hp: Math.round(this.hp),
      enemies: this.enemies.filter((e) => !e.dead).length,
      kills: this.kills,
      wave: this.wave,
    };
  }
  debugAttack(): number { return this.attack(); }
  debugHp(): number { return Math.round(this.hp); }

  private loop = (): void => {
    if (this.destroyed) return;
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    if (this.started && !this.dead) {
      // поворот стрелками
      if (this.input.ArrowLeft) this.yaw += 1.9 * dt;
      if (this.input.ArrowRight) this.yaw -= 1.9 * dt;
      // атака с клавы
      if (this.input.Space || this.input.KeyJ) {
        this.input.Space = false;
        this.input.KeyJ = false;
        this.attack();
      }
      // движение: WASD + джойстик
      let f = (this.input.KeyW || this.input.ArrowUp ? 1 : 0) - (this.input.KeyS || this.input.ArrowDown ? 1 : 0) - this.joy.y;
      let r = (this.input.KeyD ? 1 : 0) - (this.input.KeyA ? 1 : 0) + this.joy.x;
      f = Math.max(-1, Math.min(1, f));
      r = Math.max(-1, Math.min(1, r));
      const run = this.input.ShiftLeft || this.input.ShiftRight;
      const sp = run ? 8.2 : 5.6;
      const len = Math.hypot(f, r);
      if (len > 0.01) {
        const nf = f / Math.max(1, len), nr = r / Math.max(1, len);
        const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw);
        const rx = Math.cos(this.yaw), rz = -Math.sin(this.yaw);
        const nx = this.px + (fx * nf + rx * nr) * sp * dt;
        const nz = this.pz + (fz * nf + rz * nr) * sp * dt;
        if (!this.hitSolid(nx, this.pz, 0.9)) this.px = clampArena(nx);
        if (!this.hitSolid(this.px, nz, 0.9)) this.pz = clampArena(nz);
      }
      // враги идут к игроку и бьют в упор
      for (const e of this.enemies) {
        if (e.dead) continue;
        const dx = this.px - e.g.position.x;
        const dz = this.pz - e.g.position.z;
        const d = Math.hypot(dx, dz) || 1;
        if (d > 2.1) {
          const nx = e.g.position.x + (dx / d) * e.speed * dt;
          const nz = e.g.position.z + (dz / d) * e.speed * dt;
          if (!this.hitSolid(nx, e.g.position.z, 0.8)) e.g.position.x = clampArena(nx);
          if (!this.hitSolid(e.g.position.x, nz, 0.8)) e.g.position.z = clampArena(nz);
        } else if (e.hitCd <= 0) {
          e.hitCd = 0.95;
          this.hp -= 6 + Math.random() * 5;
          this.shakeT = 0.25;
          this.blip(90);
          if (this.hp <= 0) {
            this.hp = 0;
            this.dead = true;
            this.pushHud();
            this.ev.onBusted({ score: this.score, coins: 0 });
          }
          this.pushHud();
        }
        if (e.hitCd > 0) e.hitCd -= dt;
        if (e.hurtT > 0) {
          e.hurtT -= dt;
          e.body.position.x = Math.sin(performance.now() / 30) * 0.08;
        } else {
          e.body.position.x = 0;
        }
      }
      if (this.atkCd > 0) this.atkCd -= dt;
      if (this.swingT > 0) this.swingT -= dt;
      if (this.shakeT > 0) this.shakeT -= dt;
      if (Math.floor(performance.now() / 200) !== Math.floor((performance.now() - dt * 1000) / 200)) {
        this.pushHud();
        this.drawMM();
      }
    }
    // камера от первого лица
    const shake = this.shakeT > 0 ? Math.sin(performance.now() / 20) * 0.03 : 0;
    const kick = this.swingT > 0 ? -this.swingT * 0.35 : 0;
    this.camera.position.set(this.px, 1.7 + shake, this.pz);
    this.camera.rotation.set(this.pitch + kick, this.yaw, 0);
    this.renderer.render(this.scene, this.camera);
  };
}
