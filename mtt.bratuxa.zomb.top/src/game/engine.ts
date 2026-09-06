import * as THREE from 'three';
import vrag1Url from '../assets/vrag1.png';
import vrag2Url from '../assets/vrag2.png';
import dom1Url from '../assets/dom1.png';
import travaUrl from '../assets/trava.jpg';

export interface HudState {
  hp: number;
  maxhp: number;
  score: number;
  kills: number;
  enemies: number;
  wave: number;
  dead: boolean;
  fantiki: number;
  weapon: string;
  owned: string[];
  moving: boolean;
}

export interface WeaponDef {
  id: string;
  name: string;
  desc: string;
  dmg: number;
  range: number;
  cd: number;
  price: number;
  /** С какой волны доступна. */
  minWave: number;
}

export const WEAPONS: WeaponDef[] = [
  { id: 'fists', name: '👊 Кулаки', desc: 'Всегда с тобой', dmg: 32, range: 3.8, cd: 0.45, price: 0, minWave: 1 },
  { id: 'bat', name: '🏏 Бита', desc: 'Длиннее и злее', dmg: 48, range: 4.3, cd: 0.6, price: 300, minWave: 2 },
  { id: 'axe', name: '🪓 Секира', desc: 'Тяжёлый аргумент', dmg: 70, range: 4.6, cd: 0.85, price: 800, minWave: 3 },
];

export interface KeyMap {
  fwd: string;
  back: string;
  left: string;
  right: string;
  hit: string;
  run: string;
  jump: string;
}

export const KEY_ACTIONS: Array<{ id: keyof KeyMap; label: string }> = [
  { id: 'fwd', label: '⬆️ Вперёд' },
  { id: 'back', label: '⬇️ Назад' },
  { id: 'left', label: '⬅️ Влево' },
  { id: 'right', label: '➡️ Вправо' },
  { id: 'hit', label: '👊 Удар' },
  { id: 'jump', label: '🐇 Прыжок' },
  { id: 'run', label: '💨 Бег' },
];

export const DEFAULT_KEYS: KeyMap = {
  fwd: 'KeyW', back: 'KeyS', left: 'KeyA', right: 'KeyD',
  hit: 'KeyJ', run: 'ShiftLeft', jump: 'Space',
};

export interface GameEvents {
  onHud(h: HudState): void;
  onBusted(s: { score: number; coins: number }): void;
}

interface Enemy {
  g: THREE.Group;
  body: THREE.Sprite;
  hpCv: HTMLCanvasElement;
  hpTex: THREE.CanvasTexture;
  hpSpr: THREE.Sprite;
  hp: number;
  maxhp: number;
  speed: number;
  hitCd: number;
  hurtT: number;
  phase: number;
  ey: number;
  evy: number;
  hopCd: number;
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
  private weaponId = 'fists';
  private fantiki = 0;
  private owned: string[] = ['fists'];
  private soundOn = true;
  private sens = 1;
  private moving = false;
  private bobPhase = 0;
  private py = 0;
  private pvy = 0;
  private keyMap: KeyMap = { ...DEFAULT_KEYS };
  private enemies: Enemy[] = [];
  private solids: { x: number; z: number; r: number }[] = [];
  private AC: AudioContext | null = null;
  private lookPointer = -1;
  private lookLX = 0;
  private lookLY = 0;
  private parts: Array<{ s: THREE.Sprite; vx: number; vy: number; vz: number; life: number }> = [];

  /** Красные частицы удара: брызги в точке попадания. */
  burst(x: number, y: number, z: number, n = 10): void {
    for (let i = 0; i < n; i++) {
      let p = this.parts.find((q) => q.life <= 0);
      if (!p) {
        if (this.parts.length >= 90) return;
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xff2222, transparent: true, depthWrite: false }));
        s.scale.set(0.22, 0.22, 1);
        this.scene.add(s);
        p = { s, vx: 0, vy: 0, vz: 0, life: 0 };
        this.parts.push(p);
      }
      const a = Math.random() * Math.PI * 2;
      const sp = 2 + Math.random() * 4;
      p.s.position.set(x, y, z);
      p.vx = Math.cos(a) * sp;
      p.vz = Math.sin(a) * sp;
      p.vy = 1.5 + Math.random() * 3.5;
      p.life = 0.45 + Math.random() * 0.2;
      p.s.visible = true;
      (p.s.material as THREE.SpriteMaterial).opacity = 1;
    }
  }

  private updateParts(dt: number): void {
    for (const p of this.parts) {
      if (p.life <= 0) continue;
      p.life -= dt;
      if (p.life <= 0) { p.s.visible = false; continue; }
      p.vy -= 9 * dt;
      p.s.position.x += p.vx * dt;
      p.s.position.y = Math.max(0.05, p.s.position.y + p.vy * dt);
      p.s.position.z += p.vz * dt;
      (p.s.material as THREE.SpriteMaterial).opacity = Math.min(1, p.life / 0.3);
    }
  }

  constructor(
    private canvas: HTMLCanvasElement,
    private mmCanvas: HTMLCanvasElement | null,
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
    this.scene.background = new THREE.Color(0x9ecdf0);
    this.scene.fog = new THREE.Fog(0x9ecdf0, 60, 200);
    this.loadShop();
    this.loadKeys();
    this.buildWorld();
    this.spawnWave();
    window.addEventListener('resize', this.onResize);
    canvas.addEventListener('pointerdown', this.onPointerDown);
    window.addEventListener('pointermove', this.onPointerMove);
    window.addEventListener('pointerup', this.onPointerUp);
    canvas.addEventListener('mousedown', this.onMouseDown);
    this.loop();
  }

  // клик в захвате мыши — удар (кнопка не нужна)
  private onMouseDown = (e: MouseEvent): void => {
    if (e.button === 0 && typeof document !== 'undefined' && document.pointerLockElement === this.canvas) {
      this.attack();
    }
  };

  private onResize = (): void => {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  };

  private onPointerDown = (e: PointerEvent): void => {
    // клик по экрану — автозахват мыши (pointer lock), дальше осмотр без кнопок
    try {
      const r = (this.canvas.requestPointerLock as (() => Promise<void> | void) | undefined)?.call(this.canvas);
      if (r && typeof (r as Promise<void>).catch === 'function') (r as Promise<void>).catch(() => undefined);
    } catch { /* noop */ }
    if (this.lookPointer !== -1) return;
    this.lookPointer = e.pointerId;
    this.lookLX = e.clientX;
    this.lookLY = e.clientY;
  };
  private onPointerMove = (e: PointerEvent): void => {
    // в захвате — поворот свободный, кнопка не нужна
    if (typeof document !== 'undefined' && document.pointerLockElement === this.canvas) {
      this.addLook(e.movementX || 0, e.movementY || 0);
      return;
    }
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

  static weapon(id: string): WeaponDef {
    return WEAPONS.find((w) => w.id === id) ?? WEAPONS[0];
  }

  private loadShop(): void {
    try {
      const raw = localStorage.getItem('mtt_shop_v1');
      if (!raw) return;
      const d = JSON.parse(raw) as { fantiki?: number; owned?: string[]; weapon?: string; sound?: boolean; sens?: number };
      if (typeof d.fantiki === 'number') this.fantiki = Math.max(0, Math.floor(d.fantiki));
      if (Array.isArray(d.owned) && d.owned.length) this.owned = d.owned.filter((x) => WEAPONS.some((w) => w.id === x));
      if (!this.owned.includes('fists')) this.owned.unshift('fists');
      if (d.weapon && this.owned.includes(d.weapon)) this.weaponId = d.weapon;
      if (typeof d.sound === 'boolean') this.soundOn = d.sound;
      if (typeof d.sens === 'number') this.sens = Math.max(0.3, Math.min(2.5, d.sens));
    } catch { /* noop */ }
  }

  private saveShop(): void {
    try {
      localStorage.setItem('mtt_shop_v1', JSON.stringify({
        fantiki: this.fantiki, owned: this.owned, weapon: this.weaponId, sound: this.soundOn, sens: this.sens,
      }));
    } catch { /* noop */ }
  }

  buyWeapon(id: string): boolean {
    const w = Game.weapon(id);
    if (this.wave < w.minWave) return false;
    if (this.owned.includes(w.id)) { this.weaponId = w.id; this.saveShop(); this.pushHud(); return true; }
    if (this.fantiki < w.price) return false;
    this.fantiki -= w.price;
    this.owned.push(w.id);
    this.weaponId = w.id;
    this.saveShop();
    this.blip(700);
    this.pushHud();
    return true;
  }

  setWeapon(id: string): boolean {
    if (!this.owned.includes(id)) return false;
    this.weaponId = id;
    this.saveShop();
    this.blip(500);
    this.pushHud();
    return true;
  }

  setSound(v: boolean): void { this.soundOn = v; this.saveShop(); this.pushHud(); }
  setSens(v: number): void { this.sens = Math.max(0.3, Math.min(2.5, v)); this.saveShop(); }
  getSound(): boolean { return this.soundOn; }
  getSens(): number { return this.sens; }
  getKeys(): KeyMap { return { ...this.keyMap }; }
  setKeys(p: Partial<KeyMap>): KeyMap {
    const clean: Partial<KeyMap> = {};
    (Object.keys(DEFAULT_KEYS) as Array<keyof KeyMap>).forEach((k) => {
      const v = p[k];
      if (typeof v === 'string' && v.length > 0 && v.length < 24) clean[k] = v;
    });
    this.keyMap = { ...this.keyMap, ...clean };
    try { localStorage.setItem('mtt_keys_v1', JSON.stringify(this.keyMap)); } catch { /* noop */ }
    return this.getKeys();
  }
  resetKeys(): KeyMap {
    this.keyMap = { ...DEFAULT_KEYS };
    try { localStorage.removeItem('mtt_keys_v1'); } catch { /* noop */ }
    return this.getKeys();
  }
  private loadKeys(): void {
    try {
      const raw = localStorage.getItem('mtt_keys_v1');
      if (!raw) return;
      this.setKeys(JSON.parse(raw) as Partial<KeyMap>);
    } catch { /* noop */ }
  }

  revive(): boolean {
    if (!this.dead) return false;
    this.dead = false;
    this.hp = this.maxhp;
    this.score = Math.max(0, this.score - 100);
    for (const e of this.enemies) {
      if (e.dead) continue;
      const dx = e.g.position.x - this.px, dz = e.g.position.z - this.pz;
      const d = Math.hypot(dx, dz) || 1;
      e.g.position.x = clampArena(e.g.position.x + (dx / d) * 6);
      e.g.position.z = clampArena(e.g.position.z + (dz / d) * 6);
    }
    this.blip(520);
    this.pushHud();
    this.drawMM();
    return true;
  }

  addLook(dx: number, dy: number): void {
    this.yaw -= dx * 0.0042 * this.sens;
    this.pitch -= dy * 0.0032 * this.sens;
    this.pitch = Math.max(-1.1, Math.min(1.1, this.pitch));
  }

  setJoy(x: number, y: number): void {
    this.joy.x = Math.max(-1, Math.min(1, x));
    this.joy.y = Math.max(-1, Math.min(1, y));
  }

  private buildWorld(): void {
    const scene = this.scene;
    // светло: день вместо ночи
    scene.add(new THREE.AmbientLight(0xffffff, 0.95));
    const moon = new THREE.DirectionalLight(0xfff3d6, 1.4);
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

    // пол — трава МТТ с фото (тайлится по арене)
    const grassTex = new THREE.TextureLoader().load(travaUrl);
    grassTex.colorSpace = THREE.SRGBColorSpace;
    grassTex.wrapS = grassTex.wrapT = THREE.RepeatWrapping;
    grassTex.repeat.set(28, 28);
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(ARENA + 20, ARENA + 20),
      new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.95, metalness: 0 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // сетка улиц для ориентации
    const lineMat = new THREE.MeshBasicMaterial({ color: 0x8fa3c4 });
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
      const pl = new THREE.PointLight(0xffd88a, 0.5, 46);
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
    // полоска HP с цифрами: рисуем на канвасе (пиксель-стиль)
    const hpCv = document.createElement('canvas');
    hpCv.width = 128; hpCv.height = 32;
    const hpTex = new THREE.CanvasTexture(hpCv);
    const hpSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: hpTex, depthTest: false, transparent: true }));
    hpSpr.scale.set(1.7, 0.42, 1);
    hpSpr.position.set(0, 2.35, 0);
    g.add(hpSpr);
    // точка спавна: только свободная (не внутри укрытий) и не впритык к игроку
    let sx = 0, sz = 40;
    for (let t = 0; t < 24; t++) {
      const a = Math.random() * Math.PI * 2;
      const r = 26 + Math.random() * 22;
      const cx = clampArena(Math.cos(a) * r);
      const cz = clampArena(Math.sin(a) * r);
      if (this.hitSolid(cx, cz, 2)) continue;
      if (Math.hypot(cx - this.px, cz - this.pz) < 10) continue;
      sx = cx; sz = cz;
      break;
    }
    g.position.set(sx, 0, sz);
    this.scene.add(g);
    const foe: Enemy = {
      g, body, hpCv, hpTex, hpSpr,
      hp: 100, maxhp: 100,
      speed: 1.7 + Math.random() * 1.1 + this.wave * 0.12,
      hitCd: 0, hurtT: 0, phase: Math.random() * 6.28, ey: 0, evy: 0, hopCd: 1 + Math.random() * 2, dead: false,
    };
    this.updateHpBar(foe);
    this.enemies.push(foe);
  }

  private updateHpBar(e: Enemy): void {
    const f = Math.max(0, e.hp / e.maxhp);
    const g = e.hpCv.getContext('2d')!;
    // рамка + фон
    g.fillStyle = '#101018';
    g.fillRect(0, 0, 128, 32);
    g.fillStyle = '#000';
    g.fillRect(3, 3, 122, 26);
    // заливка по доле
    g.fillStyle = f > 0.5 ? '#39d353' : f > 0.25 ? '#ffd23f' : '#ff3b3b';
    g.fillRect(5, 5, 118 * f, 22);
    // цифры HP
    g.font = 'bold 17px monospace';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = '#000';
    g.fillText(`${Math.ceil(e.hp)}/${e.maxhp}`, 65, 17);
    g.fillStyle = '#fff';
    g.fillText(`${Math.ceil(e.hp)}/${e.maxhp}`, 64, 16);
    e.hpTex.needsUpdate = true;
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
    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    this.renderer.dispose();
  }

  attack(): number {
    if (!this.started || this.dead) return 0;
    if (this.atkCd > 0) return 0;
    const W = Game.weapon(this.weaponId);
    this.atkCd = W.cd;
    this.swingT = 0.22;
    this.blip(220);
    const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw);
    let hits = 0;
    for (const e of this.enemies) {
      if (e.dead) continue;
      const dx = e.g.position.x - this.px;
      const dz = e.g.position.z - this.pz;
      const d = Math.hypot(dx, dz);
      if (d > W.range) continue;
      const cos = (dx * fx + dz * fz) / (d || 1);
      if (cos < 0.35) continue;
      e.hp -= W.dmg + Math.random() * 8;
      e.hurtT = 0.18;
      const push = 1.6;
      const nx = clampArena(e.g.position.x + (dx / (d || 1)) * push);
      const nz = clampArena(e.g.position.z + (dz / (d || 1)) * push);
      if (!this.hitSolid(nx, e.g.position.z, 0.8)) e.g.position.x = nx;
      if (!this.hitSolid(e.g.position.x, nz, 0.8)) e.g.position.z = nz;
      this.updateHpBar(e);
      this.burst(e.g.position.x, 1.2, e.g.position.z, 10);
      hits++;
      if (e.hp <= 0) {
        e.dead = true;
        this.scene.remove(e.g);
        this.kills++;
        this.score += 100 + this.wave * 10;
        this.fantiki += 10;
        this.saveShop();
        this.blip(520);
      }
    }
    if (hits > 0) this.blip(440);
    this.pushHud();
    if (this.enemies.every((e) => e.dead)) {
      this.wave++;
      this.hp = Math.min(this.maxhp, this.hp + 25);
      this.fantiki += 25;
      this.saveShop();
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
    if (!this.soundOn) return;
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
      fantiki: this.fantiki,
      weapon: this.weaponId,
      owned: [...this.owned],
      moving: this.moving,
    });
  }

  private drawMM(): void {
    if (!this.mmCanvas) return;
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
  debugGive(n: number): number { this.fantiki += n; this.saveShop(); this.pushHud(); return this.fantiki; }
  debugHurt(n: number): number {
    if (!this.started || this.dead) return Math.round(this.hp);
    this.hp -= n;
    if (this.hp <= 0) {
      this.hp = 0;
      this.dead = true;
      this.pushHud();
      this.ev.onBusted({ score: this.score, coins: 0 });
    } else {
      this.pushHud();
    }
    return Math.round(this.hp);
  }
  debugRevive(): boolean { return this.revive(); }
  debugPy(): number { return Math.round(this.py * 100) / 100; }
  debugHops(): number[] {
    return this.enemies.filter((e) => !e.dead).map((e) => Math.round(e.ey * 100) / 100);
  }
  debugSetWave(n: number): number {
    this.wave = Math.max(1, Math.min(10, Math.floor(n)));
    this.pushHud();
    return this.wave;
  }
  debugSpots(): Array<{ x: number; z: number }> {
    return this.enemies.filter((e) => !e.dead).map((e) => ({ x: e.g.position.x, z: e.g.position.z }));
  }
  debugSolids(): Array<{ x: number; z: number; r: number }> {
    return this.solids.map((s) => ({ ...s }));
  }

  private loop = (): void => {
    if (this.destroyed) return;
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    if (this.started && !this.dead) {
      const km = this.keyMap;
      // поворот стрелками
      if (this.input.ArrowLeft) this.yaw += 1.9 * dt;
      if (this.input.ArrowRight) this.yaw -= 1.9 * dt;
      // атака с клавы (назначенная + J запасная)
      if (this.input[km.hit] || this.input.KeyJ) {
        this.input[km.hit] = false;
        this.input.KeyJ = false;
        this.attack();
      }
      // прыжок (держи — будет банни-хоп)
      if (this.input[km.jump] && this.py <= 0) this.pvy = 4.8;
      this.pvy -= 12 * dt;
      this.py += this.pvy * dt;
      if (this.py <= 0) { this.py = 0; this.pvy = 0; }
      // движение: назначенные клавиши + стрелки + джойстик
      let f = (this.input[km.fwd] || this.input.ArrowUp ? 1 : 0) - (this.input[km.back] || this.input.ArrowDown ? 1 : 0) - this.joy.y;
      let r = (this.input[km.right] ? 1 : 0) - (this.input[km.left] ? 1 : 0) + this.joy.x;
      f = Math.max(-1, Math.min(1, f));
      r = Math.max(-1, Math.min(1, r));
      const run = this.input[km.run] || this.input.ShiftLeft || this.input.ShiftRight;
      const sp = run ? 8.2 : 5.6;
      const len = Math.hypot(f, r);
      this.moving = len > 0.15;
      if (this.moving) this.bobPhase += dt * 11;
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
          this.burst(this.px - Math.sin(this.yaw) * 1.2, 1.5, this.pz - Math.cos(this.yaw) * 1.2, 8);
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
        // анимация ходьбы: пружинка + покачивание
        e.phase += dt * (2 + e.speed);
        // прыжки орды
        e.hopCd -= dt;
        if (e.hopCd <= 0 && e.ey <= 0) {
          e.evy = 2.5 + Math.random() * 1.5;
          e.hopCd = 2 + Math.random() * 2;
        }
        if (e.ey > 0 || e.evy !== 0) {
          e.evy -= 10 * dt;
          e.ey += e.evy * dt;
          if (e.ey <= 0) { e.ey = 0; e.evy = 0; }
        }
        e.body.position.y = 1.0 + Math.abs(Math.sin(e.phase)) * 0.12 + e.ey;
        e.body.material.rotation = Math.sin(e.phase) * 0.07;
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
      this.updateParts(dt);
      if (Math.floor(performance.now() / 200) !== Math.floor((performance.now() - dt * 1000) / 200)) {
        this.pushHud();
        this.drawMM();
      }
    }
    // камера от первого лица + покачивание ходьбы
    const shake = this.shakeT > 0 ? Math.sin(performance.now() / 20) * 0.03 : 0;
    const bob = this.moving ? Math.sin(this.bobPhase) * 0.055 : 0;
    const kick = this.swingT > 0 ? -this.swingT * 0.35 : 0;
    this.camera.position.set(this.px, 1.7 + this.py + shake + bob, this.pz);
    this.camera.rotation.set(this.pitch + kick, this.yaw, 0);
    this.renderer.render(this.scene, this.camera);
  };
}
