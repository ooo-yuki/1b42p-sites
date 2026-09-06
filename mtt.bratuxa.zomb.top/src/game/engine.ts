import * as THREE from 'three';
import vrag1Url from '../assets/vrag1.png';
import vrag2Url from '../assets/vrag2.png';
import dom1Url from '../assets/dom1.png';
import travaUrl from '../assets/trava.jpg';
import skyUrl from '../assets/sky.jpg';
import edgeUrl from '../assets/edge.png';
import house2Url from '../assets/house2.png';
import brickUrl from '../assets/brick.jpg';
import brFloorUrl from '../assets/br-floor.jpg';
import brWallUrl from '../assets/br-wall.jpg';
import brCeilUrl from '../assets/br-ceil.jpg';
import charMttUrl from '../assets/char-mtt.png';
import charKrysaUrl from '../assets/char-krysa.png';

export interface CharDef {
  id: string;
  name: string;
  desc: string;
  hp: number;
  spd: number;
}

export const CHARS: CharDef[] = [
  { id: 'mtt', name: '🕶️ МТТ', desc: 'Шуба, очки, золотые перчатки · +HP', hp: 120, spd: 1 },
  { id: 'krysa', name: '🐀 Крыса', desc: 'Королева крыс · скорость, прыжки ×3, вол-кик', hp: 90, spd: 1.15 },
];

export function charSpec(id: string): CharDef {
  return CHARS.find((c) => c.id === id) ?? CHARS[0];
}

export type Quality = 'fast' | 'nice';
export type MapId = 'arena' | 'duel' | 'backrooms';

/** Карты для выбора в меню: id, название, описание. */
export const MAPS: Array<{ id: MapId; name: string; desc: string }> = [
  { id: 'arena', name: '🌍 Арена', desc: 'Город днём: дома, крыши, мосты, фонтан' },
  { id: 'duel', name: '⚔️ Дуэль', desc: 'Ночной двор 1×1 для разборок' },
  { id: 'backrooms', name: '🟨 Бэкрумс', desc: 'Случайный лабиринт — новый каждый раз' },
];

/** Настройки запуска игры из меню. */
export interface GameOpts {
  /** false — мирный режим: врагов нет, можно гулять. */
  enemies?: boolean;
}

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
  dash: number;
  kick: number;
  med: number;
  lvl: number;
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
  /** Дальнобой: выстрел по прицелу, а не замах вокруг. */
  ranged?: boolean;
}

export const WEAPONS: WeaponDef[] = [
  { id: 'fists', name: '👊 Кулаки', desc: 'Всегда с тобой', dmg: 32, range: 3.8, cd: 0.45, price: 0, minWave: 1 },
  { id: 'bat', name: '🏏 Бита', desc: 'Длиннее и злее', dmg: 48, range: 4.3, cd: 0.6, price: 300, minWave: 2 },
  { id: 'axe', name: '🪓 Секира', desc: 'Тяжёлый аргумент', dmg: 70, range: 4.6, cd: 0.85, price: 800, minWave: 3 },
  { id: 'pistol', name: '🔫 Пистолет', desc: 'Бьёт далеко — целься прицелом', dmg: 45, range: 30, cd: 0.7, price: 1200, minWave: 4, ranged: true },
];

export interface KeyMap {
  fwd: string;
  back: string;
  left: string;
  right: string;
  hit: string;
  run: string;
  jump: string;
  ability: string;
  switch: string;
  use: string;
}

export const KEY_ACTIONS: Array<{ id: keyof KeyMap; label: string }> = [
  { id: 'fwd', label: '⬆️ Вперёд' },
  { id: 'back', label: '⬇️ Назад' },
  { id: 'left', label: '⬅️ Влево' },
  { id: 'right', label: '➡️ Вправо' },
  { id: 'hit', label: '👊 Удар' },
  { id: 'jump', label: '🐇 Прыжок' },
  { id: 'run', label: '💨 Бег' },
  { id: 'ability', label: '⚡ Рывок (МТТ)' },
  { id: 'switch', label: '🔫 Смена оружия' },
  { id: 'use', label: '💊 Аптечка' },
];

export const DEFAULT_KEYS: KeyMap = {
  fwd: 'KeyW', back: 'KeyS', left: 'KeyA', right: 'KeyD',
  hit: 'KeyJ', run: 'ShiftLeft', jump: 'Space', ability: 'KeyC', switch: 'KeyE', use: 'KeyX',
};

export interface GameEvents {
  onHud(h: HudState): void;
  onBusted(s: { score: number; coins: number }): void;
  onSwing(): void;
}

export interface RemotePlayer {
  nick: string;
  x: number;
  z: number;
  hp: number;
  char: string;
}

interface Remote {
  nick: string;
  g: THREE.Group;
  cv: HTMLCanvasElement;
  tex: THREE.CanvasTexture;
  x: number;
  z: number;
  tx: number;
  tz: number;
  hp: number;
  char: string;
}

interface Enemy {
  g: THREE.Group;
  body: THREE.Sprite;
  hpCv: HTMLCanvasElement;
  hpTex: THREE.CanvasTexture;
  hpSpr: THREE.Sprite;
  kind: 'walk' | 'fly';
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

function clampArena(v: number, half: number = HALF): number {
  return Math.max(-half + 3, Math.min(half - 3, v));
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
  // аптечки и опыт бойцов (не сносить сейвы: merge поверх)
  private medkits = 0;
  private xp: Record<string, number> = (() => {
    try {
      const d = JSON.parse(localStorage.getItem('mtt_xp_v1') ?? '{}') as Record<string, number>;
      return { mtt: Math.max(0, Math.floor(d.mtt ?? 0)), krysa: Math.max(0, Math.floor(d.krysa ?? 0)) };
    } catch { return { mtt: 0, krysa: 0 }; }
  })();
  private soundOn = true;
  private sens = 1;
  private moving = false;
  private bobPhase = 0;
  private py = 0;
  private pvy = 0;
  private keyMap: KeyMap = { ...DEFAULT_KEYS };
  private remotes: Remote[] = [];
  private half: number = HALF;
  /** Мирный режим из меню: врагов нет, волны не идут. */
  readonly enemiesOn: boolean = true;
  private wallKickCd = 0;
  private charId = 'mtt';
  private charSpd = 1;
  private jumpVel = 4.8;
  private wallT = 0;
  private wallNx = 0;
  private wallNz = 0;
  private kickTurnT = 0;
  private kickTurnFrom = 0;
  private kickTurnDelta = 0;
  // коснулся здания в полёте после кика — вол-кик перезаряжается мгновенно
  private kickAirT = 0;
  // трассеры пуль: светящиеся линии выстрелов, живут долю секунды
  private tracers: Array<{ l: THREE.Line; life: number }> = [];
  private kickTouch(): void {
    if (this.charId !== 'krysa' || this.kickAirT <= 0 || this.py < 0.5) return;
    if (this.wallKickCd > 0) {
      this.wallKickCd = 0;
      this.kickAirT = 0;
      this.blip(700);
      this.pushHud();
    }
  }
  private dashT = 0;
  private dashCd = 0;
  private dashDx = 0;
  private dashDy = 0;
  private dashDz = 0;
  private quality: Quality = 'fast';
  private foeTexCache: THREE.Texture[] = [];
  private enemies: Enemy[] = [];
  // хитбокс окружения строго внутри текстуры и только до своей высоты h:
  // коробки — точный AABB, круглые — точный радиус. Пролететь/перепрыгнуть можно.
  // deck: настил (мост) — снизу проход свободный, сверху можно стоять.
  private solids: Array<{ x: number; z: number; hx: number; hz: number; h: number; deck?: boolean } | { x: number; z: number; r: number; h: number }> = [];
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
    readonly map: MapId = 'arena',
    opts: GameOpts = {},
  ) {
    this.enemiesOn = opts.enemies !== false;
    // Бэкрумс большой: лабиринт ~120м. Размер задаёт сам строитель через halfOverride.
    this.half = map === 'duel' ? 32 : HALF;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
    this.loadQuality();
    this.loadChar();
    this.applyLevel();
    const spec0 = charSpec(this.charId);
    this.hp = this.maxhp;
    this.charSpd = spec0.spd;
    this.jumpVel = this.charId === 'krysa' ? 4.8 * Math.sqrt(3) : 4.8;
    this.renderer.setPixelRatio(this.quality === 'nice' ? Math.min(window.devicePixelRatio, 1.5) : 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = this.quality === 'nice';
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 500);
    this.camera.rotation.order = 'YXZ';
    if (map === 'duel') {
      this.scene.background = new THREE.Color(0x1a1030);
      this.scene.fog = new THREE.Fog(0x1a1030, 40, 140);
    } else if (map === 'backrooms') {
      // гул жёлтых ламп: тёплый туман, небо не нужно — сверху потолок
      this.scene.background = new THREE.Color(0x8a7a3a);
      this.scene.fog = new THREE.Fog(0x8a7a3a, 8, 55);
    } else {
      this.scene.background = new THREE.Color(0x9ecdf0);
      this.scene.fog = new THREE.Fog(0x9ecdf0, 60, 200);
      // небо с фото МТТ: огромная сфера, туман её не трогает
      const skyTex = new THREE.TextureLoader().load(skyUrl);
      skyTex.colorSpace = THREE.SRGBColorSpace;
      const sky = new THREE.Mesh(
        new THREE.SphereGeometry(420, 24, 16),
        new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false }),
      );
      this.scene.add(sky);
    }
    this.loadShop();
    this.loadKeys();
    this.buildWorld();
    if (map !== 'duel' && this.enemiesOn) this.spawnWave();
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
      const d = JSON.parse(raw) as { fantiki?: number; owned?: string[]; weapon?: string; sound?: boolean; sens?: number; med?: number };
      if (typeof d.fantiki === 'number') this.fantiki = Math.max(0, Math.floor(d.fantiki));
      if (Array.isArray(d.owned) && d.owned.length) this.owned = d.owned.filter((x) => WEAPONS.some((w) => w.id === x));
      if (!this.owned.includes('fists')) this.owned.unshift('fists');
      if (d.weapon && this.owned.includes(d.weapon)) this.weaponId = d.weapon;
      if (typeof d.sound === 'boolean') this.soundOn = d.sound;
      if (typeof d.sens === 'number') this.sens = Math.max(0.3, Math.min(2.5, d.sens));
      if (typeof d.med === 'number') this.medkits = Math.max(0, Math.min(3, Math.floor(d.med)));
    } catch { /* noop */ }
  }

  private saveShop(): void {
    try {
      localStorage.setItem('mtt_shop_v1', JSON.stringify({
        fantiki: this.fantiki, owned: this.owned, weapon: this.weaponId, sound: this.soundOn, sens: this.sens, med: this.medkits,
      }));
    } catch { /* noop */ }
  }

  // аптечки: максимум 3 в запасе, +50 HP по кнопке X
  buyMedkit(): boolean {
    if (this.medkits >= 3 || this.fantiki < 150) return false;
    this.fantiki -= 150;
    this.medkits++;
    this.saveShop();
    this.blip(700);
    this.pushHud();
    return true;
  }

  useMedkit(): boolean {
    if (!this.started || this.dead || this.medkits <= 0 || this.hp >= this.maxhp) return false;
    this.medkits--;
    this.hp = Math.min(this.maxhp, this.hp + 50);
    this.saveShop();
    this.blip(600);
    this.burst(this.px, 1.0, this.pz, 8);
    this.pushHud();
    return true;
  }

  // прокачка бойца: опыт за фраги/волны, уровень = 1+sqrt(xp/1000); +10 maxHP и +5% урона за уровень
  level(): number {
    return this.levelOf(this.charId);
  }

  levelOf(id: string): number {
    return 1 + Math.floor(Math.sqrt((this.xp[id] ?? 0) / 1000));
  }

  private addXp(n: number): void {
    this.xp[this.charId] = (this.xp[this.charId] ?? 0) + n;
    try { localStorage.setItem('mtt_xp_v1', JSON.stringify(this.xp)); } catch { /* noop */ }
    this.applyLevel();
  }

  private applyLevel(): void {
    const spec = charSpec(this.charId);
    this.maxhp = spec.hp + (this.level() - 1) * 10;
    this.hp = Math.min(this.hp, this.maxhp);
  }

  private dmgMul(): number {
    return 1 + (this.level() - 1) * 0.05;
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

  // E: переключение ствола строго по купленным (по кругу, закрытое не выпадает)
  switchWeapon(): string {
    if (!this.started || this.dead) return this.weaponId;
    const ids = WEAPONS.map((w) => w.id).filter((id) => this.owned.includes(id));
    if (ids.length < 2) return this.weaponId;
    const i = ids.indexOf(this.weaponId);
    this.weaponId = ids[(i + 1) % ids.length];
    this.saveShop();
    this.pushHud();
    this.blip(500);
    return this.weaponId;
  }

  setSound(v: boolean): void { this.soundOn = v; this.saveShop(); this.pushHud(); }
  setSens(v: number): void { this.sens = Math.max(0.3, Math.min(2.5, v)); this.saveShop(); }
  getChar(): string { return this.charId; }
  setChar(id: string): string {
    this.charId = charSpec(id).id;
    try { localStorage.setItem('mtt_char_v1', this.charId); } catch { /* noop */ }
    this.applyLevel();
    const spec = charSpec(this.charId);
    this.hp = this.maxhp;
    this.charSpd = spec.spd;
    // Крыса прыгает в 3 раза выше: высота ~ v², значит скорость ×√3
    this.jumpVel = this.charId === 'krysa' ? 4.8 * Math.sqrt(3) : 4.8;
    this.dashT = 0;
    this.dashCd = 0;
    this.pushHud();
    return this.charId;
  }
  private loadChar(): void {
    try {
      const v = localStorage.getItem('mtt_char_v1');
      if (v) this.charId = charSpec(v).id;
    } catch { /* noop */ }
  }
  getQuality(): Quality { return this.quality; }
  setQuality(q: Quality): Quality {
    this.quality = q === 'nice' ? 'nice' : 'fast';
    try { localStorage.setItem('mtt_quality_v1', this.quality); } catch { /* noop */ }
    this.applyQuality();
    return this.quality;
  }
  private loadQuality(): void {
    try {
      const v = localStorage.getItem('mtt_quality_v1');
      this.quality = v === 'nice' ? 'nice' : 'fast';
    } catch { /* noop */ }
  }
  private applyQuality(): void {
    const fast = this.quality !== 'nice';
    this.renderer.setPixelRatio(fast ? 1 : Math.min(window.devicePixelRatio, 1.5));
    this.renderer.shadowMap.enabled = !fast;
    this.scene.traverse((o) => {
      const m = o as { material?: { needsUpdate?: boolean } | Array<{ needsUpdate?: boolean }> };
      if (Array.isArray(m.material)) m.material.forEach((x) => { x.needsUpdate = true; });
      else if (m.material) m.material.needsUpdate = true;
    });
  }
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

  // Дуэльный двор 1×1: ночь, глина, симметрия. Спавны: (0,20) и (0,-20).
  private buildDuel(): void {
    const scene = this.scene;
    const H = this.half;
    scene.add(new THREE.AmbientLight(0x8a8ac0, 0.55));
    const moon = new THREE.DirectionalLight(0xff9f6a, 1.0);
    moon.position.set(-30, 60, -20);
    moon.castShadow = true;
    moon.shadow.mapSize.width = 1024;
    moon.shadow.mapSize.height = 1024;
    moon.shadow.camera.left = -50;
    moon.shadow.camera.right = 50;
    moon.shadow.camera.top = 50;
    moon.shadow.camera.bottom = -50;
    moon.shadow.camera.near = 10;
    moon.shadow.camera.far = 180;
    moon.shadow.bias = -0.0004;
    scene.add(moon);
    // глина вместо травы
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(H * 2 + 20, H * 2 + 20),
      new THREE.MeshStandardMaterial({ color: 0x7a5240, roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    // светящийся круг центра
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(4, 5, 32),
      new THREE.MeshBasicMaterial({ color: 0xff9f1c, transparent: true, opacity: 0.7, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(0, 0.03, 0);
    scene.add(ring);
    // периметр — низкие стены с текстурой дома
    const wallTex = new THREE.TextureLoader().load(dom1Url);
    wallTex.colorSpace = THREE.SRGBColorSpace;
    wallTex.wrapS = wallTex.wrapT = THREE.MirroredRepeatWrapping;
    wallTex.repeat.set(6, 1);
    const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.85 });
    const mkWall = (w: number, d: number, x: number, z: number): void => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, 7, d), wallMat);
      m.position.set(x, 3.5, z);
      m.castShadow = true;
      scene.add(m);
      this.solids.push({ x, z, hx: w / 2, hz: d / 2, h: 7 });
    };
    mkWall(H * 2 + 4, 2, 0, -H - 1);
    mkWall(H * 2 + 4, 2, 0, H + 1);
    mkWall(2, H * 2 + 4, -H - 1, 0);
    mkWall(2, H * 2 + 4, H + 1, 0);
    // центральный низкий барьер + 4 симметричных ящика
    const barMat = new THREE.MeshStandardMaterial({ color: 0x5a3a22, roughness: 0.9 });
    const bar = new THREE.Mesh(new THREE.BoxGeometry(10, 1.4, 1.2), barMat);
    bar.position.set(0, 0.7, 0);
    bar.castShadow = true;
    scene.add(bar);
    this.solids.push({ x: 0, z: 0, hx: 5, hz: 0.6, h: 1.4 });
    for (const [cx, cz] of [[-12, -12], [12, -12], [-12, 12], [12, 12]] as Array<[number, number]>) {
      const c = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 2.4), barMat);
      c.position.set(cx, 1.2, cz);
      c.castShadow = true;
      scene.add(c);
      this.solids.push({ x: cx, z: cz, hx: 1.2, hz: 1.2, h: 2.4 });
    }
    // факелы по углам (свет без теней — дёшево)
    for (const [fx, fz] of [[-H + 4, -H + 4], [H - 4, -H + 4], [-H + 4, H - 4], [H - 4, H - 4]] as Array<[number, number]>) {
      const pole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 4, 8),
        new THREE.MeshStandardMaterial({ color: 0x2a2018 }),
      );
      pole.position.set(fx, 2, fz);
      scene.add(pole);
      const flame = new THREE.Mesh(new THREE.SphereGeometry(0.5, 10, 10), new THREE.MeshBasicMaterial({ color: 0xff7b1c }));
      flame.position.set(fx, 4.3, fz);
      scene.add(flame);
      const tl = new THREE.PointLight(0xff8b2a, 0.8, 30);
      tl.position.set(fx, 4.3, fz);
      scene.add(tl);
      this.solids.push({ x: fx, z: fz, r: 0.2, h: 4.5 });
    }
  }

  /**
   * БЭКРУМС: большой случайный лабиринт, новый каждый запуск.
   * Случайный DFS-лабиринт N×N клеток; стены — InstancedMesh (1 draw call),
   * пол/потолок/стены — с фото МТТ, сверху гул жёлтых ламп.
   */
  private buildBackrooms(): void {
    const scene = this.scene;
    const N = 21, CELL = 6, WH = 3, TH = 0.7;
    const S = N * CELL;
    this.half = S / 2;
    // свет ламп: тепло и ярко, теней нет — дёшево при сотнях стен
    scene.add(new THREE.AmbientLight(0xffe9a8, 1.15));
    const top = new THREE.DirectionalLight(0xfff2cc, 0.55);
    top.position.set(20, 30, 10);
    scene.add(top);
    const floorTex = new THREE.TextureLoader().load(brFloorUrl);
    floorTex.colorSpace = THREE.SRGBColorSpace;
    floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(32, 32);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(S + 10, S + 10),
      new THREE.MeshStandardMaterial({ map: floorTex, roughness: 1 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    const ceilTex = new THREE.TextureLoader().load(brCeilUrl);
    ceilTex.colorSpace = THREE.SRGBColorSpace;
    ceilTex.wrapS = ceilTex.wrapT = THREE.RepeatWrapping;
    ceilTex.repeat.set(42, 42);
    const ceil = new THREE.Mesh(
      new THREE.PlaneGeometry(S + 10, S + 10),
      new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 1 }),
    );
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = WH;
    scene.add(ceil);
    // случайный лабиринт: recursive backtracker
    const vWall: boolean[][] = Array.from({ length: N + 1 }, () => new Array(N).fill(true));
    const hWall: boolean[][] = Array.from({ length: N }, () => new Array(N + 1).fill(true));
    const seen: boolean[][] = Array.from({ length: N }, () => new Array(N).fill(false));
    const stack: Array<[number, number]> = [[0, 0]];
    seen[0][0] = true;
    while (stack.length > 0) {
      const [cx, cy] = stack[stack.length - 1];
      const nb: Array<[number, number, number]> = [];
      if (cx > 0 && !seen[cx - 1][cy]) nb.push([cx - 1, cy, 0]);
      if (cx < N - 1 && !seen[cx + 1][cy]) nb.push([cx + 1, cy, 1]);
      if (cy > 0 && !seen[cx][cy - 1]) nb.push([cx, cy - 1, 2]);
      if (cy < N - 1 && !seen[cx][cy + 1]) nb.push([cx, cy + 1, 3]);
      if (nb.length === 0) { stack.pop(); continue; }
      const [nx, ny, dir] = nb[Math.floor(Math.random() * nb.length)];
      if (dir === 0) vWall[cx][cy] = false;
      else if (dir === 1) vWall[cx + 1][cy] = false;
      else if (dir === 2) hWall[cx][cy] = false;
      else hWall[cx][cy + 1] = false;
      seen[nx][ny] = true;
      stack.push([nx, ny]);
    }
    // сегменты стен: вертикальные vWall[i][j], горизонтальные hWall[i][j]
    const segs: Array<{ x: number; z: number; sx: number; sz: number }> = [];
    for (let i = 0; i <= N; i++) {
      for (let j = 0; j < N; j++) {
        if (vWall[i][j]) segs.push({ x: -S / 2 + i * CELL, z: -S / 2 + (j + 0.5) * CELL, sx: TH, sz: CELL + TH });
      }
    }
    for (let i = 0; i < N; i++) {
      for (let j = 0; j <= N; j++) {
        if (hWall[i][j]) segs.push({ x: -S / 2 + (i + 0.5) * CELL, z: -S / 2 + j * CELL, sx: CELL + TH, sz: TH });
      }
    }
    const wallTex = new THREE.TextureLoader().load(brWallUrl);
    wallTex.colorSpace = THREE.SRGBColorSpace;
    const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.95 });
    const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), wallMat, segs.length);
    const m4 = new THREE.Matrix4();
    const q0 = new THREE.Quaternion();
    segs.forEach((s, k) => {
      m4.compose(new THREE.Vector3(s.x, WH / 2, s.z), q0, new THREE.Vector3(s.sx, WH, s.sz));
      inst.setMatrixAt(k, m4);
      this.solids.push({ x: s.x, z: s.z, hx: s.sx / 2, hz: s.sz / 2, h: WH });
    });
    inst.instanceMatrix.needsUpdate = true;
    scene.add(inst);
    // панели ламп на потолке через 3 клетки — просто светлые, без источников
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xfff6d8 });
    const lampGeo = new THREE.BoxGeometry(1.4, 0.08, 0.7);
    for (let i = 1; i < N; i += 3) {
      for (let j = 1; j < N; j += 3) {
        const lamp = new THREE.Mesh(lampGeo, lampMat);
        lamp.position.set(-S / 2 + (i + 0.5) * CELL, WH - 0.05, -S / 2 + (j + 0.5) * CELL);
        scene.add(lamp);
      }
    }
    // старт — в клетке (0,0), лицо в открытый проход (восток или юг — что прокопано)
    this.px = -S / 2 + 0.5 * CELL;
    this.pz = -S / 2 + 0.5 * CELL;
    this.yaw = !vWall[1][0] ? -Math.PI / 2 : Math.PI;
  }

  /** Для тестов: параметры сгенерированного лабиринта. */
  debugMaze(): { n: number; cell: number; segs: number; half: number } {
    return { n: 21, cell: 6, segs: this.solids.length, half: this.half };
  }

  private buildWorld(): void {
    if (this.map === 'duel') { this.buildDuel(); return; }
    if (this.map === 'backrooms') { this.buildBackrooms(); return; }
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

    // пол — трава МТТ с фото (тайлится по арене, зеркальный повтор прячет швы)
    const grassTex = new THREE.TextureLoader().load(travaUrl);
    grassTex.colorSpace = THREE.SRGBColorSpace;
    grassTex.wrapS = grassTex.wrapT = THREE.MirroredRepeatWrapping;
    grassTex.repeat.set(28, 28);
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(ARENA + 20, ARENA + 20),
      new THREE.MeshStandardMaterial({ map: grassTex, roughness: 0.95, metalness: 0 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // город: асфальтовые улицы с пунктиром (одна переиспользуемая текстура — дёшево)
    const roadCv = document.createElement('canvas');
    roadCv.width = 128; roadCv.height = 64;
    const rg = roadCv.getContext('2d')!;
    rg.fillStyle = '#2e3440';
    rg.fillRect(0, 0, 128, 64);
    rg.fillStyle = '#3a4150';
    for (let i = 0; i < 40; i++) rg.fillRect(Math.random() * 128, Math.random() * 64, 3, 3);
    rg.fillStyle = '#ffd23f';
    rg.fillRect(8, 30, 44, 4);
    rg.fillRect(76, 30, 44, 4);
    const roadTex = new THREE.CanvasTexture(roadCv);
    roadTex.colorSpace = THREE.SRGBColorSpace;
    roadTex.wrapS = roadTex.wrapT = THREE.RepeatWrapping;
    roadTex.repeat.set(16, 1);
    const roadMat = new THREE.MeshStandardMaterial({ map: roadTex, roughness: 1 });
    for (let i = -HALF; i <= HALF; i += 22) {
      const r1 = new THREE.Mesh(new THREE.PlaneGeometry(ARENA, 5), roadMat);
      r1.rotation.x = -Math.PI / 2; r1.position.set(0, 0.012, i); r1.receiveShadow = true; scene.add(r1);
      const r2 = new THREE.Mesh(new THREE.PlaneGeometry(5, ARENA), roadMat);
      r2.rotation.x = -Math.PI / 2; r2.rotation.z = Math.PI / 2; r2.position.set(i, 0.012, 0); r2.receiveShadow = true; scene.add(r2);
    }

    // край карты с фото МТТ: граффити-стена, зеркало прячет швы
    const wallTex = new THREE.TextureLoader().load(edgeUrl);
    wallTex.colorSpace = THREE.SRGBColorSpace;
    wallTex.wrapS = wallTex.wrapT = THREE.MirroredRepeatWrapping;
    wallTex.repeat.set(12, 2);
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

    // дома: каждый уникален (размер/цвет/крыша заданы, не рандом).
    // Пары A и B стоят рядом и связаны мостами; на крышу A ведёт лестница.
    const winTex = Game.makeWindowsTex();
    const bbTex = new THREE.TextureLoader().load(house2Url);
    bbTex.colorSpace = THREE.SRGBColorSpace;
    type Roof = 'tank' | 'antenna' | 'garden' | 'parapet' | 'flat';
    const houses: Array<{ x: number; z: number; w: number; d: number; h: number; tint: number; roof: Roof; bb: boolean }> = [
      { x: -24, z: -24, w: 6, d: 6, h: 5, tint: 0xd8b48f, roof: 'flat', bb: false },
      { x: -24, z: -16, w: 6, d: 6, h: 5, tint: 0xc9a06a, roof: 'garden', bb: false },
      { x: 24, z: 19, w: 6, d: 6, h: 6, tint: 0xb08d5f, roof: 'flat', bb: false },
      { x: 24, z: 27, w: 6, d: 6, h: 6, tint: 0xd8c49a, roof: 'tank', bb: false },
      { x: -41, z: -24, w: 8, d: 8, h: 7, tint: 0xcf9a5a, roof: 'tank', bb: true },
      { x: 44, z: -24, w: 9, d: 8, h: 8, tint: 0xb57e4a, roof: 'antenna', bb: true },
      { x: -24, z: 24, w: 9, d: 9, h: 6, tint: 0xdba860, roof: 'garden', bb: true },
      { x: 44, z: 24, w: 10, d: 8, h: 9, tint: 0xc08a4e, roof: 'parapet', bb: true },
    ];
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x6b4a2e, roughness: 0.95 });
    for (const cfg of houses) {
      // окна — свой повтор под размер коробки: окно ~1.2м, не тянется на весь дом
      const wt = winTex.clone();
      wt.wrapS = wt.wrapT = THREE.MirroredRepeatWrapping;
      wt.repeat.set(Math.max(1, Math.round(cfg.w / 6)), Math.max(1, Math.round(cfg.h / 6)));
      wt.needsUpdate = true;
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d),
        new THREE.MeshStandardMaterial({ map: wt, roughness: 0.8, color: cfg.tint }),
      );
      m.position.set(cfg.x, cfg.h / 2, cfg.z);
      m.castShadow = true; m.receiveShadow = true;
      scene.add(m);
      this.solids.push({ x: cfg.x, z: cfg.z, hx: cfg.w / 2, hz: cfg.d / 2, h: cfg.h });
      // крыша: у каждого своя фишка
      if (cfg.roof === 'tank') {
        const tank = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2, 10), roofMat);
        tank.position.set(cfg.x + cfg.w / 4, cfg.h + 1, cfg.z);
        tank.castShadow = true;
        scene.add(tank);
      } else if (cfg.roof === 'antenna') {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 5, 6), roofMat);
        pole.position.set(cfg.x, cfg.h + 2.5, cfg.z);
        scene.add(pole);
        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff3b3b }));
        tip.position.set(cfg.x, cfg.h + 5, cfg.z);
        scene.add(tip);
      } else if (cfg.roof === 'garden') {
        const gr = new THREE.Mesh(
          new THREE.CircleGeometry(Math.min(cfg.w, cfg.d) / 2 - 0.5, 18),
          new THREE.MeshStandardMaterial({ color: 0x3fa34d, roughness: 1 }),
        );
        gr.rotation.x = -Math.PI / 2;
        gr.position.set(cfg.x, cfg.h + 0.03, cfg.z);
        scene.add(gr);
      } else if (cfg.roof === 'parapet') {
        const ph = 0.6, pt = 0.3;
        const mkP = (w: number, d: number, x: number, z: number): void => {
          const p = new THREE.Mesh(new THREE.BoxGeometry(w, ph, d), roofMat);
          p.position.set(x, cfg.h + ph / 2, z);
          p.castShadow = true;
          scene.add(p);
          this.solids.push({ x, z, hx: w / 2, hz: d / 2, h: cfg.h + ph });
        };
        mkP(cfg.w, pt, cfg.x, cfg.z - cfg.d / 2);
        mkP(cfg.w, pt, cfg.x, cfg.z + cfg.d / 2);
        mkP(pt, cfg.d, cfg.x - cfg.w / 2, cfg.z);
        mkP(pt, cfg.d, cfg.x + cfg.w / 2, cfg.z);
      }
      if (cfg.bb) {
        const bb = new THREE.Mesh(new THREE.PlaneGeometry(8, 4.5), new THREE.MeshBasicMaterial({ map: bbTex }));
        bb.position.set(cfg.x, cfg.h + 2.6, cfg.z);
        bb.rotation.y = Math.atan2(-cfg.x, -cfg.z);
        scene.add(bb);
      }
    }

    // мостики между соседними домами пары (настил: сверху стоим, снизу проходим)
    const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x7a5230, roughness: 0.9 });
    const mkBridge = (x: number, z: number, w: number, len: number, top: number): void => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(w, 0.3, len), bridgeMat);
      b.position.set(x, top - 0.15, z);
      b.castShadow = true; b.receiveShadow = true;
      scene.add(b);
      this.solids.push({ x, z, hx: w / 2, hz: len / 2, h: top, deck: true });
      // столбики-опоры по краям (декор)
      for (const e of [-1, 1]) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, top, 8), bridgeMat);
        post.position.set(x + e * (w / 2 - 0.2), top / 2, z);
        scene.add(post);
      }
    };
    mkBridge(-24, -20, 2.5, 3, 5);
    mkBridge(24, 23, 2.5, 3, 6);

    // лестница на крышу A1: ступени по 1м снаружи дома — перешагиваем автоматом
    const stairMat = new THREE.MeshStandardMaterial({ color: 0x9aa0ad, roughness: 1 });
    for (let i = 0; i < 4; i++) {
      const top = i + 1;
      const sx = -33.9 + i * 1.6;
      const st = new THREE.Mesh(new THREE.BoxGeometry(1.6, top, 3), stairMat);
      st.position.set(sx, top / 2, -24);
      st.castShadow = true; st.receiveShadow = true;
      scene.add(st);
      this.solids.push({ x: sx, z: -24, hx: 0.8, hz: 1.5, h: top });
    }

    // переулки: кирпич с фото МТТ — два ряда узких высоких домов образуют улочки с фонарями
    const brickTex = new THREE.TextureLoader().load(brickUrl);
    brickTex.colorSpace = THREE.SRGBColorSpace;
    brickTex.wrapS = brickTex.wrapT = THREE.MirroredRepeatWrapping;
    brickTex.repeat.set(3, 2);
    const brickMat = new THREE.MeshStandardMaterial({ map: brickTex, roughness: 0.9 });
    const alleyMat = new THREE.MeshStandardMaterial({ color: 0x8a6f4d, roughness: 0.9 });
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xffe9a3 });
    const mkAlleyHouse = (hx: number, hz: number, h: number): void => {
      // кирпич с фото: честная кладка вместо процедурных окон
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(5, h, 6),
        brickMat,
      );
      m.position.set(hx, h / 2, hz);
      m.castShadow = true; m.receiveShadow = true;
      scene.add(m);
      this.solids.push({ x: hx, z: hz, hx: 2.5, hz: 3, h });
    };
    for (const sx of [-1, 1]) {
      for (const hz of [-30, -10, 10, 30]) {
        mkAlleyHouse(sx * 18.5, hz, 9 + ((hz + 30) % 3));
        mkAlleyHouse(sx * 9.5, hz + 5, 10 + ((hz + 40) % 2));
      }
      // фонари вдоль улочки
      for (const hz of [-20, 0, 20]) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3.4, 8), alleyMat);
        pole.position.set(sx * 14, 1.7, hz);
        scene.add(pole);
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), lampMat);
        bulb.position.set(sx * 14, 3.6, hz);
        scene.add(bulb);
      }
    }

    // входы в дома периметра: тёмный проём + козырёк + ступени + лампа (декор на внутренней грани)
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x0c0f16, roughness: 1 });
    const stepMat = new THREE.MeshStandardMaterial({ color: 0x9aa0ad, roughness: 1 });
    const mkDoor = (x: number, z: number, ry: number): void => {
      const grp = new THREE.Group();
      const door = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.6, 0.5), doorMat);
      door.position.y = 1.8;
      grp.add(door);
      const canopy = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.25, 1.4), alleyMat);
      canopy.position.set(0, 4.1, 0.5);
      grp.add(canopy);
      const step = new THREE.Mesh(new THREE.BoxGeometry(3, 0.3, 1.2), stepMat);
      step.position.set(0, 0.15, 0.8);
      grp.add(step);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 8), lampMat);
      lamp.position.set(0, 4.6, 0.5);
      grp.add(lamp);
      grp.position.set(x, 0, z);
      grp.rotation.y = ry;
      scene.add(grp);
    };
    for (const ex of [-36, -12, 12, 36]) {
      mkDoor(ex, HALF - 0.2, Math.PI);
      mkDoor(ex, -HALF + 0.2, 0);
      mkDoor(HALF - 0.2, ex, -Math.PI / 2);
      mkDoor(-HALF + 0.2, ex, Math.PI / 2);
    }

    // клумбы у фонтана: плоские цветные круги (декор, проход свободный)
    const bedCols = [0xff5d8f, 0xffd23f, 0xff6b35, 0xc77dff];
    [[8, 8], [-8, 8], [8, -8], [-8, -8]].forEach(([fx, fz], i) => {
      const bed = new THREE.Mesh(
        new THREE.CircleGeometry(1.6, 20),
        new THREE.MeshStandardMaterial({ color: bedCols[i % bedCols.length], roughness: 1 }),
      );
      bed.rotation.x = -Math.PI / 2;
      bed.position.set(fx, 0.02, fz);
      scene.add(bed);
    });

    // фонари (центр занят фонтаном)
    for (const [fx, fz] of [[-44, -44], [44, -44], [-44, 44], [44, 44]] as Array<[number, number]>) {
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
      // столб тонкий и круглый: хитбокс ровно по нему
      this.solids.push({ x: fx, z: fz, r: 0.25, h: 9 });
    }

    // центр — площадь с фонтаном
    const plaza = new THREE.Mesh(
      new THREE.CircleGeometry(9, 28),
      new THREE.MeshStandardMaterial({ color: 0x5d7050, roughness: 1 }),
    );
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.set(0, 0.015, 0);
    plaza.receiveShadow = true;
    scene.add(plaza);
    const fountainBase = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2.3, 1, 14),
      new THREE.MeshStandardMaterial({ color: 0x8fa3c4, roughness: 0.7 }),
    );
    fountainBase.position.set(0, 0.5, 0);
    fountainBase.castShadow = true;
    scene.add(fountainBase);
    const fountainWater = new THREE.Mesh(
      new THREE.CircleGeometry(1.8, 14),
      new THREE.MeshBasicMaterial({ color: 0x66ddff }),
    );
    fountainWater.rotation.x = -Math.PI / 2;
    fountainWater.position.set(0, 1.02, 0);
    scene.add(fountainWater);
    // чаша круглая: хитбокс ровно по радиусу, не выходит за текстуру
    this.solids.push({ x: 0, z: 0, r: 2, h: 1 });

    // ящики-укрытия (ровно 2.2×2.2, без поворотов — коллизия честная)
    const crateMat = new THREE.MeshStandardMaterial({ color: 0x8a5a2b, roughness: 0.9 });
    const crateMat2 = new THREE.MeshStandardMaterial({ color: 0x6e4520, roughness: 0.9 });
    const crates: Array<[number, number, number]> = [
      [12, 8, 0], [-12, 10, 1], [14, -10, 1], [-14, -12, 0], [8, 32, 0],
      [-8, -32, 1], [32, 12, 0], [-32, -14, 1], [10, -24, 0], [-10, 26, 1],
    ];
    for (const [cx, cz, v] of crates) {
      const c = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 2.2), v === 0 ? crateMat : crateMat2);
      c.position.set(cx, 1.1, cz);
      c.castShadow = true; c.receiveShadow = true;
      scene.add(c);
      this.solids.push({ x: cx, z: cz, hx: 1.1, hz: 1.1, h: 2.2 });
    }

    // два больших билборда у площади
    for (const [bx, bz, ry] of [[12, 0, -Math.PI / 2], [-12, 0, Math.PI / 2]] as Array<[number, number, number]>) {
      const legs = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 6, 0.4),
        new THREE.MeshStandardMaterial({ color: 0x334155 }),
      );
      legs.position.set(bx, 3, bz);
      scene.add(legs);
      const board = new THREE.Mesh(new THREE.PlaneGeometry(9, 5), new THREE.MeshBasicMaterial({ map: bbTex }));
      board.position.set(bx, 8.5, bz);
      board.rotation.y = ry;
      scene.add(board);
      this.solids.push({ x: bx, z: bz, hx: 0.2, hz: 0.2, h: 6 });
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
    // со 2-й волны 30% орды — летуны
    const flyers = this.wave >= 2 ? Math.floor(n * 0.3) : 0;
    for (let i = 0; i < n; i++) this.spawnEnemy(i < flyers ? 'fly' : 'walk');
  }

  private foeTexture(): THREE.Texture {
    if (this.foeTexCache.length === 0) {
      for (const url of [vrag1Url, vrag2Url]) {
        const t = new THREE.TextureLoader().load(url);
        t.colorSpace = THREE.SRGBColorSpace;
        this.foeTexCache.push(t);
      }
    }
    return this.foeTexCache[Math.floor(Math.random() * this.foeTexCache.length)] as THREE.Texture;
  }

  private flyTexCache: THREE.Texture | null = null;

  private foeTextureTinted(): THREE.Texture {
    if (!this.flyTexCache) {
      const t = new THREE.TextureLoader().load(vrag2Url);
      t.colorSpace = THREE.SRGBColorSpace;
      this.flyTexCache = t;
    }
    return this.flyTexCache;
  }

  debugSpawn(kind: 'walk' | 'fly'): number {
    this.spawnEnemy(kind === 'fly' ? 'fly' : 'walk');
    return this.debugFlyers();
  }

  debugFlyers(): number {
    return this.enemies.filter((e) => !e.dead && e.kind === 'fly').length;
  }

  private spawnEnemy(kind: 'walk' | 'fly'): void {
    // в Бэкрумс потолок 3м — летуны бы скребли макушкой, только пешие
    const fly = kind === 'fly' && this.map !== 'backrooms';
    const tex = fly ? this.foeTextureTinted() : this.foeTexture();
    const g = new THREE.Group();
    const body = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, color: fly ? 0xdd99ff : 0xffffff }));
    body.scale.set(fly ? 1.2 : 1.4, fly ? 1.6 : 2.0, 1);
    body.position.set(0, fly ? 3.2 : 1.0, 0);
    g.add(body);
    // полоска HP с цифрами: рисуем на канвасе (пиксель-стиль)
    const hpCv = document.createElement('canvas');
    hpCv.width = 128; hpCv.height = 32;
    const hpTex = new THREE.CanvasTexture(hpCv);
    const hpSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: hpTex, depthTest: false, transparent: true }));
    hpSpr.scale.set(1.7, 0.42, 1);
    hpSpr.position.set(0, fly ? 4.6 : 2.35, 0);
    g.add(hpSpr);
    // точка спавна: только свободная (не внутри укрытий) и не впритык к игроку
    let sx = 0, sz = 40;
    let ok = false;
    for (let t = 0; t < 24; t++) {
      const a = Math.random() * Math.PI * 2;
      const r = 26 + Math.random() * 22;
      const cx = clampArena(Math.cos(a) * r);
      const cz = clampArena(Math.sin(a) * r);
      if (this.hitSolid(cx, cz, 2)) continue;
      if (Math.hypot(cx - this.px, cz - this.pz) < 10) continue;
      sx = cx; sz = cz;
      ok = true;
      break;
    }
    // запасные свободные точки, если рандом не нашёл
    if (!ok) {
      const safe: Array<[number, number]> = [[20, 20], [-20, 20], [20, -20], [-20, -20], [0, 0], [40, 0], [-40, 0]];
      for (const [qx, qz] of safe) {
        if (!this.hitSolid(qx, qz, 2) && Math.hypot(qx - this.px, qz - this.pz) >= 10) {
          sx = qx; sz = qz;
          ok = true;
          break;
        }
      }
    }
    g.position.set(sx, 0, sz);
    this.scene.add(g);
    const foe: Enemy = {
      g, body, hpCv, hpTex, hpSpr, kind,
      hp: fly ? 70 : 100, maxhp: fly ? 70 : 100,
      speed: 1.7 + Math.random() * 1.1 + this.wave * 0.12 + (fly ? 0.6 : 0),
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

  stop(): void {
    this.started = false;
  }

  destroy(): void {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    for (const r of this.remotes) this.scene.remove(r.g);
    this.remotes = [];
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
    this.ev.onSwing();
    if (W.ranged) return this.shoot(W.dmg, W.range);
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
      e.hp -= W.dmg * this.dmgMul() + Math.random() * 8;
      this.afterHit(e, dx, dz, d, 1.6);
      hits++;
    }
    if (hits > 0) this.blip(440);
    this.pushHud();
    if ((this.map === 'arena' || this.map === 'backrooms') && this.enemiesOn && this.enemies.length > 0 && this.enemies.every((e) => e.dead)) {
      this.wave++;
      this.hp = Math.min(this.maxhp, this.hp + 25);
      this.fantiki += 25;
      this.addXp(50);
      this.saveShop();
      this.spawnWave();
    }
    this.drawMM();
    return hits;
  }

  // общий итог попадания: отброс, полоса HP, частицы, фраг
  private afterHit(e: Enemy, dx: number, dz: number, d: number, push: number): void {
    e.hurtT = 0.18;
    const nx = clampArena(e.g.position.x + (dx / (d || 1)) * push);
    const nz = clampArena(e.g.position.z + (dz / (d || 1)) * push);
    if (!this.hitSolid(nx, e.g.position.z, 0.8)) e.g.position.x = nx;
    if (!this.hitSolid(e.g.position.x, nz, 0.8)) e.g.position.z = nz;
    this.updateHpBar(e);
    this.burst(e.g.position.x, 1.2, e.g.position.z, 10);
    if (e.hp <= 0) {
      e.dead = true;
      this.scene.remove(e.g);
      this.kills++;
      this.score += 100 + this.wave * 10;
      this.fantiki += 10;
      this.addXp(10);
      this.saveShop();
      this.blip(520);
    }
  }

  // 🔫 выстрел: хитскан по прицелу — ближайший враг в конусе ~8°; урон тает с дистанцией
  private shoot(baseDmg: number, range: number): number {
    this.blip(880);
    const cp = Math.cos(this.pitch);
    const dx = -Math.sin(this.yaw) * cp, dy = Math.sin(this.pitch), dz = -Math.cos(this.yaw) * cp;
    const cx = this.px, cy = 1.7 + this.py, cz = this.pz;
    let best: Enemy | null = null;
    let bestD = Infinity;
    for (const e of this.enemies) {
      if (e.dead) continue;
      const ty = e.kind === 'fly' ? 3.2 : 1.0 + e.ey;
      const vx = e.g.position.x - cx, vy = ty - cy, vz = e.g.position.z - cz;
      const dist = Math.hypot(vx, vy, vz);
      if (dist > range || dist < 0.5) continue;
      const cos = (vx * dx + vy * dy + vz * dz) / dist;
      if (cos < 0.99) continue;
      if (dist < bestD) { bestD = dist; best = e; }
    }
    if (!best) {
      // мимо: пыль на излёте пули + трассер в никуда
      this.burst(cx + dx * 8, cy + dy * 8, cz + dz * 8, 3);
      this.tracer(cx, cy, cz, cx + dx * range, cy + dy * range, cz + dz * range);
      this.pushHud();
      return 0;
    }
    const fall = 1 - (bestD / range) * 0.5;
    best.hp -= baseDmg * fall * this.dmgMul() + Math.random() * 5;
    this.tracer(cx, cy, cz, best.g.position.x, (best.kind === 'fly' ? 3.2 : 1.0 + best.ey), best.g.position.z);
    this.afterHit(best, best.g.position.x - cx, best.g.position.z - cz, Math.hypot(best.g.position.x - cx, best.g.position.z - cz), 0.8);
    this.blip(440);
    this.pushHud();
    if ((this.map === 'arena' || this.map === 'backrooms') && this.enemiesOn && this.enemies.length > 0 && this.enemies.every((e) => e.dead)) {
      this.wave++;
      this.hp = Math.min(this.maxhp, this.hp + 25);
      this.fantiki += 25;
      this.addXp(50);
      this.saveShop();
      this.spawnWave();
    }
    this.drawMM();
    return 1;
  }

  // светящаяся линия выстрела от дула до точки попадания
  private tracer(x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): void {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x1, y1, z1), new THREE.Vector3(x2, y2, z2)]);
    const mat = new THREE.LineBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0.95 });
    const l = new THREE.Line(geo, mat);
    this.scene.add(l);
    this.tracers.push({ l, life: 1 });
    if (this.tracers.length > 12) {
      const old = this.tracers.shift();
      if (old) { this.scene.remove(old.l); old.l.geometry.dispose(); (old.l.material as THREE.Material).dispose(); }
    }
  }

  // рывок МТТ: строго в сторону взгляда, включая вверх/вниз (куда смотрит камера), кд 3с.
  // Союзников (remotes) урон не трогает вовсе: attack() бьёт только enemies.
  dash(): boolean {
    if (!this.started || this.dead || this.dashCd > 0 || this.charId !== 'mtt') return false;
    const cp = Math.cos(this.pitch);
    this.dashDx = -Math.sin(this.yaw) * cp;
    this.dashDy = Math.sin(this.pitch);
    this.dashDz = -Math.cos(this.yaw) * cp;
    this.dashT = 0.18;
    this.dashCd = 3;
    this.pvy = 0;
    this.burst(this.px, 0.4, this.pz, 12);
    this.blip(880);
    this.pushHud();
    return true;
  }

  debugDash(): number { return Math.round(this.dashCd * 10) / 10; }
  debugKick(): number { return Math.round(this.wallKickCd * 10) / 10; }
  debugWall(): number { return Math.round(this.wallT * 100) / 100; }
  debugTeleport(x: number, z: number, yaw?: number): void {
    this.px = this.clamp(Number(x) || 0);
    this.pz = this.clamp(Number(z) || 0);
    if (typeof yaw === 'number' && Number.isFinite(yaw)) this.yaw = yaw;
  }
  debugRemoteList(): RemotePlayer[] {
    return this.remotes.map((m) => ({ nick: m.nick, char: m.char, x: m.x, z: m.z, hp: m.hp }));
  }

  // круг (игрок/враг радиусом rad на высоте y) против окружения: коробка — точный AABB,
  // круглое — точный радиус, и только если сущность НИЖЕ верха (y <= h+0.4).
  // Хитбокс не выходит за текстуру и не тянется до неба: перепрыгнуть/перелететь можно.
  private hitSolid(x: number, z: number, rad: number, y = 0): boolean {
    for (const s of this.solids) {
      if (y > s.h + 0.4) continue;
      // стоишь на верху объекта — это пол, а не стена: идём свободно
      if (y >= s.h - 0.1) continue;
      if ('r' in s) {
        const dx = x - s.x, dz = z - s.z;
        if (dx * dx + dz * dz < (s.r + rad) * (s.r + rad)) return true;
      } else {
        // настил: пока ты ниже него — проходишь под мостом свободно
        if (s.deck && y < s.h - 0.5) continue;
        const cx = Math.max(s.x - s.hx, Math.min(x, s.x + s.hx));
        const cz = Math.max(s.z - s.hz, Math.min(z, s.z + s.hz));
        const dx = x - cx, dz = z - cz;
        if (dx * dx + dz * dz < rad * rad) return true;
      }
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
      med: this.medkits,
      lvl: this.level(),
      dash: Math.round(this.dashCd * 10) / 10,
      kick: Math.round(this.wallKickCd * 10) / 10,
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

  private charTexCache: Record<string, THREE.Texture> = {};

  private charTexture(id: string): THREE.Texture {
    const key = id === 'krysa' ? 'krysa' : 'mtt';
    let t = this.charTexCache[key];
    if (!t) {
      t = new THREE.TextureLoader().load(key === 'krysa' ? charKrysaUrl : charMttUrl);
      t.colorSpace = THREE.SRGBColorSpace;
      this.charTexCache[key] = t;
    }
    return t;
  }

  // сокомнатники: призраки в шкуре выбранного персонажа, с никами (позиции с сервера комнаты)
  setRemotes(list: RemotePlayer[]): void {
    const seen = new Set<string>();
    for (const p of list.slice(0, 8)) {
      const nick = String(p.nick ?? '').slice(0, 20) || 'Братуха';
      seen.add(nick);
      const char = p.char === 'krysa' ? 'krysa' : 'mtt';
      let r: Remote | undefined = undefined;
      for (const q of this.remotes) if (q.nick === nick) { r = q; break; }
      if (!r) {
        const g = new THREE.Group();
        const body = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.charTexture(char), transparent: true, color: 0x99ddff }));
        body.scale.set(1.4, 2.0, 1);
        body.position.set(0, 1.0, 0);
        g.add(body);
        const cv = document.createElement('canvas');
        cv.width = 128; cv.height = 48;
        const ltex = new THREE.CanvasTexture(cv);
        const lab = new THREE.Sprite(new THREE.SpriteMaterial({ map: ltex, depthTest: false, transparent: true }));
        lab.scale.set(1.9, 0.72, 1);
        lab.position.set(0, 2.5, 0);
        g.add(lab);
        this.scene.add(g);
        r = { nick, g, cv, tex: ltex, x: 0, z: 0, tx: 0, tz: 0, hp: 100, char };
        this.remotes.push(r);
      } else if (r.char !== char) {
        r.char = char;
        const body = r.g.children[0] as THREE.Sprite;
        body.material.map = this.charTexture(char);
        body.material.needsUpdate = true;
      }
      const rr: Remote = r;
      // цели с сервера; рендер догоняет их плавно каждый кадр (без задержек и рывков)
      rr.tx = this.clamp(Number(p.x) || 0);
      rr.tz = this.clamp(Number(p.z) || 0);
      if (rr.x === 0 && rr.z === 0 && (rr.tx !== 0 || rr.tz !== 0)) { rr.x = rr.tx; rr.z = rr.tz; }
      rr.hp = Math.max(0, Math.min(100, Number(p.hp) || 0));
      this.drawRemote(rr);
    }
    this.remotes = this.remotes.filter((r) => {
      if (!seen.has(r.nick)) { this.scene.remove(r.g); return false; }
      return true;
    });
  }

  private drawRemote(r: Remote): void {
    const g = r.cv.getContext('2d')!;
    g.fillStyle = '#101018';
    g.fillRect(0, 0, 128, 48);
    g.font = 'bold 17px monospace';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = '#66ccff';
    g.fillText(r.nick.slice(0, 12), 64, 13);
    g.fillStyle = '#000';
    g.fillRect(14, 26, 100, 14);
    g.fillStyle = '#39d353';
    g.fillRect(16, 28, 96 * (r.hp / 100), 10);
    r.tex.needsUpdate = true;
  }

  debugRemotes(): number { return this.remotes.length; }

  // хуки для тестов
  debugPos(): { x: number; z: number; hp: number; enemies: number; kills: number; wave: number; yaw: number } {
    return {
      x: Math.round(this.px * 10) / 10,
      z: Math.round(this.pz * 10) / 10,
      hp: Math.round(this.hp),
      enemies: this.enemies.filter((e) => !e.dead).length,
      kills: this.kills,
      wave: this.wave,
      yaw: Math.round(this.yaw * 100) / 100,
    };
  }
  private clamp(v: number): number {
    return clampArena(v, this.half);
  }

  debugMap(): MapId { return this.map; }

  // HP дуэли ставит сервер (синхрон обоих бойцов)
  setDuelHp(hp: number): number {
    this.hp = Math.max(0, Math.min(this.maxhp, Math.round(hp)));
    this.pushHud();
    return this.hp;
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
  debugSolids(): Array<{ x: number; z: number; hx: number; hz: number; r: number; h: number }> {
    return this.solids.map((s) => {
      if ('r' in s) return { x: s.x, z: s.z, hx: s.r, hz: s.r, r: s.r, h: s.h };
      return { ...s, r: Math.hypot(s.hx, s.hz) };
    });
  }
  debugSolidAt(x: number, z: number, y: number): boolean {
    return this.hitSolid(Number(x) || 0, Number(z) || 0, 0.9, Number(y) || 0);
  }

  // высота опоры под ногами: верх самого высокого объекта в этой точке (крыши, мосты, ступени).
  // rad расширяет поиск: для перешагивания смотрим опору впереди по курсу.
  groundAt(x: number, z: number, rad = 0): number {
    let g = 0;
    for (const s of this.solids) {
      if ('r' in s) {
        const dx = x - s.x, dz = z - s.z;
        if (dx * dx + dz * dz <= (s.r + rad) * (s.r + rad) && s.h > g) g = s.h;
      } else {
        if (Math.abs(x - s.x) <= s.hx + rad && Math.abs(z - s.z) <= s.hz + rad && s.h > g) g = s.h;
      }
    }
    return g;
  }

  debugGround(x: number, z: number): number {
    return this.groundAt(Number(x) || 0, Number(z) || 0);
  }

  debugTracers(): number {
    return this.tracers.length;
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
      // прыжок: с земли — вверх; Крыса в полёте у стены — вол-кик (кд 5с).
      // Кик швыряет ПРОТИВ движения (разворот на 180°); если стоишь — толчок от стены.
      if (this.input[km.jump]) {
        // прыжок с любой опоры: земля, крыша, мост
        if (this.py <= this.groundAt(this.px, this.pz) + 0.01) {
          this.pvy = this.jumpVel;
        } else if (this.charId === 'krysa' && this.wallT > 0 && this.wallKickCd <= 0 && this.py > 0.05) {
          let kf = (this.input[km.fwd] || this.input.ArrowUp ? 1 : 0) - (this.input[km.back] || this.input.ArrowDown ? 1 : 0) - this.joy.y;
          let kr = (this.input[km.right] ? 1 : 0) - (this.input[km.left] ? 1 : 0) + this.joy.x;
          kf = Math.max(-1, Math.min(1, kf));
          kr = Math.max(-1, Math.min(1, kr));
          const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw);
          const rx = Math.cos(this.yaw), rz = -Math.sin(this.yaw);
          // мировое направление движения...
          let mx = fx * kf + rx * kr, mz = fz * kf + rz * kr;
          const mlen = Math.hypot(mx, mz);
          if (mlen < 0.15) { mx = -this.wallNx; mz = -this.wallNz; }
          else { mx = -mx / mlen; mz = -mz / mlen; }
          // ...и толчок ровно против него
          const kx = this.clamp(this.px + mx * 2.2);
          const kz = this.clamp(this.pz + mz * 2.2);
          if (!this.hitSolid(kx, this.pz, 0.9, this.py)) this.px = kx;
          if (!this.hitSolid(this.px, kz, 0.9, this.py)) this.pz = kz;
          this.pvy = 7.5;
          // камера доворачивается туда же, куда отскок (плавно, 0.3с)
          this.kickTurnFrom = this.yaw;
          let dyaw = Math.atan2(-mx, -mz) - this.yaw;
          while (dyaw > Math.PI) dyaw -= Math.PI * 2;
          while (dyaw < -Math.PI) dyaw += Math.PI * 2;
          this.kickTurnDelta = dyaw;
          this.kickTurnT = 0.3;
          this.kickAirT = 1.2;
          this.wallT = 0;
          this.wallKickCd = 5;
          this.burst(this.px, 1.0, this.pz, 10);
          this.blip(700);
          this.pushHud();
        }
      }
      if (this.wallT > 0) this.wallT -= dt;
      // трассеры гаснут за долю секунды
      for (let i = this.tracers.length - 1; i >= 0; i--) {
        const t = this.tracers[i];
        t.life -= dt * 3.5;
        if (t.life <= 0) {
          this.scene.remove(t.l);
          t.l.geometry.dispose();
          (t.l.material as THREE.Material).dispose();
          this.tracers.splice(i, 1);
        } else {
          (t.l.material as THREE.LineBasicMaterial).opacity = t.life * 0.95;
        }
      }
      if (this.wallKickCd > 0) {
        this.wallKickCd -= dt;
        if (Math.floor(this.wallKickCd * 5) !== Math.floor((this.wallKickCd + dt) * 5)) this.pushHud();
      }
      if (this.kickAirT > 0) this.kickAirT -= dt;
      // доворот камеры за вол-киком: быстро и плавно
      if (this.kickTurnT > 0) {
        this.kickTurnT -= dt;
        const t = Math.max(0, this.kickTurnT / 0.3);
        const e = 1 - t * t;
        this.yaw = this.kickTurnFrom + this.kickTurnDelta * e;
      }
      // рывок МТТ на назначенной клавише (по умолчанию C)
      if (this.input[km.ability]) {
        this.input[km.ability] = false;
        this.dash();
      }
      if (this.dashCd > 0) this.dashCd -= dt;
      // смена оружия на назначенной клавише (по умолчанию E) — только купленное
      if (this.input[km.switch] || this.input.KeyE) {
        this.input[km.switch] = false;
        this.input.KeyE = false;
        this.switchWeapon();
      }
      // аптечка на назначенной клавише (по умолчанию X)
      if (this.input[km.use] || this.input.KeyX) {
        this.input[km.use] = false;
        this.input.KeyX = false;
        this.useMedkit();
      }
      // движение: назначенные клавиши + стрелки + джойстик
      let f = (this.input[km.fwd] || this.input.ArrowUp ? 1 : 0) - (this.input[km.back] || this.input.ArrowDown ? 1 : 0) - this.joy.y;
      let r = (this.input[km.right] ? 1 : 0) - (this.input[km.left] ? 1 : 0) + this.joy.x;
      f = Math.max(-1, Math.min(1, f));
      r = Math.max(-1, Math.min(1, r));
      const run = this.input[km.run] || this.input.ShiftLeft || this.input.ShiftRight;
      const sp = (run ? 8.2 : 5.6) * this.charSpd;
      const len = Math.hypot(f, r);
      this.moving = len > 0.15;
      if (this.moving) this.bobPhase += dt * 11;
      if (len > 0.01) {
        const nf = f / Math.max(1, len), nr = r / Math.max(1, len);
        const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw);
        const rx = Math.cos(this.yaw), rz = -Math.sin(this.yaw);
        const nx = this.px + (fx * nf + rx * nr) * sp * dt;
        const nz = this.pz + (fz * nf + rz * nr) * sp * dt;
        // стена: запоминаем нормаль (толчок от стены для вол-кика Крысы).
        // невысокий порог (ступень ≤1.1м) перешагиваем автоматом — так лезем по лестницам на крыши
        if (this.hitSolid(nx, this.pz, 0.9, this.py)) {
          const step = this.groundAt(nx, this.pz, 0.9);
          if (step > this.py && step - this.py <= 1.1 && this.pvy <= 0.5) {
            this.py = step;
            this.px = this.clamp(nx);
          } else {
            this.wallNx = nx > this.px ? -1 : 1;
            this.wallNz = 0;
            this.wallT = 0.3;
            this.kickTouch();
          }
        } else {
          if (!this.hitSolid(nx, this.pz, 0.9, this.py)) this.px = this.clamp(nx);
        }
        if (this.hitSolid(this.px, nz, 0.9, this.py)) {
          const step = this.groundAt(this.px, nz, 0.9);
          if (step > this.py && step - this.py <= 1.1 && this.pvy <= 0.5) {
            this.py = step;
            this.pz = this.clamp(nz);
          } else {
            this.wallNx = 0;
            this.wallNz = nz > this.pz ? -1 : 1;
            this.wallT = 0.3;
            this.kickTouch();
          }
        } else {
          this.pz = this.clamp(nz);
        }
      }
      // рывок: бросок 22 м/с по взгляду (включая вверх), стены уважает, гравитация на паузе
      if (this.dashT > 0) {
        this.dashT -= dt;
        const nx = this.px + this.dashDx * 22 * dt;
        const nz = this.pz + this.dashDz * 22 * dt;
        if (!this.hitSolid(nx, this.pz, 0.9, this.py)) this.px = this.clamp(nx);
        if (!this.hitSolid(this.px, nz, 0.9, this.py)) this.pz = this.clamp(nz);
        this.py = Math.max(0, this.py + this.dashDy * 22 * dt);
        this.pvy = 0;
        if (!this.moving) this.bobPhase += dt * 11;
      } else {
        this.pvy -= 12 * dt;
        this.py += this.pvy * dt;
        // приземление на опору под ногами: земля, крыша, мост, ступень
        const g = this.groundAt(this.px, this.pz);
        if (this.py <= g) { this.py = g; this.pvy = 0; }
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
          const eyH = e.kind === 'fly' ? 3.2 : e.ey;
          if (!this.hitSolid(nx, e.g.position.z, 0.8, eyH)) e.g.position.x = clampArena(nx);
          if (!this.hitSolid(e.g.position.x, nz, 0.8, eyH)) e.g.position.z = clampArena(nz);
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
        // анимация: ходоки пружинят и прыгают, летуны парят
        e.phase += dt * (2 + e.speed);
        if (e.kind === 'fly') {
          e.body.position.y = 3.2 + Math.sin(e.phase * 1.5) * 0.5;
        } else {
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
        }
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
      // сокомнатники догоняют серверные цели плавно (интерполяция — без задержек и телепортов)
      const rt = performance.now() / 600;
      const k = 1 - Math.exp(-10 * dt);
      for (const r of this.remotes) {
        r.x += (r.tx - r.x) * k;
        r.z += (r.tz - r.z) * k;
        r.g.position.set(r.x, Math.abs(Math.sin(rt + r.x)) * 0.08, r.z);
      }
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
