import * as THREE from 'three';
import vrag1Url from '../assets/vrag1.png';
import vrag2Url from '../assets/vrag2.png';
import dom1Url from '../assets/dom1.png';
import travaUrl from '../assets/trava.jpg';
import facadeUrl from '../assets/facade.jpg';
import panelUrl from '../assets/city-panel.jpg';
import shopUrl from '../assets/city-shop.jpg';
import roofUrl from '../assets/city-roof.jpg';
import roadUrl from '../assets/city-road.jpg';
import walkUrl from '../assets/city-walk.jpg';
import plazaUrl from '../assets/city-plaza.jpg';
import fenceUrl from '../assets/fence.jpg';
import skyUrl from '../assets/sky.jpg';
import edgeUrl from '../assets/edge.png';
import house2Url from '../assets/house2.png';
import brickUrl from '../assets/brick.jpg';
import brFloorUrl from '../assets/br-floor.jpg';
import brWallUrl from '../assets/br-wall.jpg';
import brCeilUrl from '../assets/br-ceil.jpg';
import doorExitUrl from '../assets/door-exit.jpg';
import bossUrl from '../assets/boss.png';
import charMttUrl from '../assets/char-mtt.png';
import charKrysaUrl from '../assets/char-krysa.png';
import charShubaUrl from '../assets/char-shuba.png';
import charChumaUrl from '../assets/char-chuma.png';
import charGidroxisUrl from '../assets/char-gidroxis.png';
import stalkerUrl from '../assets/stalker.png';
import shotUrl from '../assets/shot.mp3';
import hitUrl from '../assets/hit.mp3';
import wallkickUrl from '../assets/wallkick.mp3';
import deathUrl from '../assets/death.mp3';
import szegedMesh from '../assets/szeged.mesh.json';
import szegedAtlasUrl from '../assets/szeged-atlas.jpg';
import szegedSolids from '../assets/szeged.solids.json';
import szegedSpawn from '../../tools/szeged-spawn.json';

export interface UpgState { hp: number; dmg: number; spd: number; sup: number }
export const UPG_MAX: UpgState = { hp: 5, dmg: 5, spd: 5, sup: 5 };
/** Цена апгрейда: база × 3.5^ур (hp/dmg/spd — от 100, супер — от 150). */
export function upgCost(key: keyof UpgState, lvl: number): number {
  const base = key === 'sup' ? 150 : 100;
  return Math.round(base * Math.pow(3.5, lvl));
}
/** Кд суперспособности с учётом прокачки: МТТ/рывок мин 1.7с, Крыса мин 1.7с, Ивангой-несутка и Чума-облако 30с мин 20с, Гидроксис-рентген 20с мин 15с. */
export function superCd(id: string, sup: number): number {
  if (id === 'shuba' || id === 'chuma') return Math.max(20, Math.round((30 - sup * 2) * 10) / 10);
  if (id === 'gidroxis') return Math.max(15, Math.round((20 - sup) * 10) / 10);
  const base = id === 'krysa' ? 5 : 3;
  const step = id === 'krysa' ? 0.7 : 0.3;
  return Math.max(1.7, Math.round((base - sup * step) * 10) / 10);
}
/** Дальность суперспособности: +15% за уровень. */
export function superRange(sup: number): number {
  return Math.round((1 + sup * 0.15) * 100) / 100;
}

export interface CharDef {
  id: string;
  name: string;
  desc: string;
  hp: number;
  spd: number;
  /** Редкость бойца: МТТ — Базовый, Стейси — Легендарный. */
  rarity: string;
}

export const CHARS: CharDef[] = [
  { id: 'mtt', name: '🕶️ МТТ', desc: 'Шуба, очки, золотые перчатки · +HP', hp: 120, spd: 1, rarity: 'Базовый' },
  { id: 'krysa', name: '🐀 Стейси Крыса', desc: 'Королева крыс · скорость, прыжки ×3, вол-кик', hp: 90, spd: 1.15, rarity: 'Легендарный' },
  { id: 'shuba', name: '🥷 Ивангой', desc: 'Невидимка в белой шубе · супер — несутка на 3с', hp: 105, spd: 1.05, rarity: 'Редкий' },
  { id: 'chuma', name: '🐦‍⬛ Чума', desc: 'Чумной доктор в чёрном · супер — чумное облако 5с', hp: 100, spd: 1.05, rarity: 'Редкий' },
  { id: 'gidroxis', name: '🧪 Гидроксис', desc: 'Сканер в жёлтом · супер — рентген существ 5с', hp: 95, spd: 1.1, rarity: 'Легендарный' },
];

/** Кейс бойца: цена открытия в фантиках. */
export const CASE_PRICE = 500;
export interface CaseDrop {
  ok: boolean;
  kind: 'char' | 'fantiki' | 'xp' | 'med' | 'empty';
  /** id выпавшего бойца (kind 'char'): чтобы рулетка показала правильную карту */
  char?: string;
  text: string;
}

export function charSpec(id: string): CharDef {
  return CHARS.find((c) => c.id === id) ?? CHARS[0];
}

export type Quality = 'low' | 'medium' | 'high';
export type MapId = 'arena' | 'duel' | 'backrooms' | 'custom' | 'random' | 'pvp' | 'endless' | 'invasion' | 'szeged';

/** Карты для выбора в меню: id, название, описание. */
export const MAPS: Array<{ id: MapId; name: string; desc: string }> = [
  { id: 'arena', name: '🌍 Арена', desc: 'Новый город: витрины, переулки, Г/П-дома, площадь с фонтаном' },
  { id: 'duel', name: '⚔️ Дуэль', desc: 'Ночной двор 1×1 для разборок' },
  { id: 'szeged', name: '🗺️ Szeged', desc: 'Приватная карта МТТ' },
  { id: 'backrooms', name: '🟨 Бэкрумс', desc: 'Случайный лабиринт — новый каждый раз' },
  { id: 'random', name: '🎲 Случайная', desc: 'Дикий ландшафт: холмы, скалы, озеро — новый каждый раз' },
];

/** Своя карта из редактора: блоки-стены поверх травы. */
export interface CustomBlock { x: number; z: number; w: number; d: number; h: number }
export interface CustomMap { name: string; size: number; walls: CustomBlock[] }

/** Детерминированный ГСЧ (mulberry32) — один сид даёт одинаковый лабиринт всем игрокам. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Хеш строки (id комнаты) в числовой сид — у всех в одной комнате одна карта. */
export function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

/** Настройки запуска игры из меню. */
export interface GameOpts {
  /** false — мирный режим: врагов нет, можно гулять. */
  enemies?: boolean;
  /** Своя карта (map 'custom'). */
  custom?: CustomMap | null;
  /** Сид лабиринта бэкрумса: одинаковый у всех в комнате. Нет — случайный. */
  seed?: number;
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
  /** Невидимость Ивангоя: осталось секунд (0 — нет). Кд смотри в superCdOf. */
  invis: number;
  /** Перезарядка несутки Ивангоя: осталось секунд (0 — готова). */
  invisCd: number;
  /** Чумное облако Чумы: висит секунд (0 — нет). Кд смотри в superCdOf. */
  chuma: number;
  /** Перезарядка облака Чумы: осталось секунд (0 — готово). */
  chumaCd: number;
  /** Рентген Гидроксиса: висит секунд (0 — нет). Кд смотри в superCdOf. */
  xray: number;
  /** Перезарядка рентгена Гидроксиса: осталось секунд (0 — готов). */
  xrayCd: number;
  med: number;
  lvl: number;
  /** Живых боссов на карте — для баннера 👑. */
  boss: number;
  /** Сглаженный FPS движка. */
  fps: number;
  /** Текущее качество картинки (авто-сброс при просадке). */
  quality: Quality;
  /** Маяк двери: светится прямо сейчас (раз в минуту 5 секунд). */
  doorPulse: boolean;
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
  /** Дробь веером: урон тает с дистанцией круче, плюс рокет-джамп. */
  spread?: boolean;
}

export const WEAPONS: WeaponDef[] = [
  { id: 'fists', name: '👊 Кулаки', desc: 'Всегда с тобой', dmg: 32, range: 3.8, cd: 0.45, price: 0, minWave: 1 },
  { id: 'bat', name: '🏏 Бита', desc: 'Длиннее и злее', dmg: 48, range: 4.3, cd: 0.6, price: 300, minWave: 2 },
  { id: 'axe', name: '🪓 Секира', desc: 'Тяжёлый аргумент', dmg: 70, range: 4.6, cd: 0.85, price: 800, minWave: 3 },
  { id: 'pistol', name: '🔫 Пистолет', desc: 'Бьёт далеко — целься прицелом', dmg: 45, range: 30, cd: 0.7, price: 1200, minWave: 4, ranged: true },
  { id: 'shotgun', name: '💥 Дробовик', desc: 'Дробь веером: в упор сносит, вдаль щекочет · в стену — катапульта на 13м назад, в землю под ногами — вверх на 6м (от воздуха — нет)', dmg: 110, range: 20, cd: 1.1, price: 1500, minWave: 5, ranged: true, spread: true },
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
  { id: 'ability', label: '⚡ Способность: рывок / вол-кик' },
  { id: 'switch', label: '🔫 Смена оружия' },
  { id: 'use', label: '💊 Аптечка' },
];

export const DEFAULT_KEYS: KeyMap = {
  fwd: 'KeyW', back: 'KeyS', left: 'KeyA', right: 'KeyD',
  hit: 'KeyJ', run: 'ShiftLeft', jump: 'Space', ability: 'KeyC', switch: 'KeyE', use: 'KeyX',
};

export interface GameEvents {
  onHud: (h: HudState) => void;
  onBusted: (s: { score: number; coins: number }) => void;
  /** скример бэкрумса: сталкер убил с 1 удара — показать жуть на весь экран */
  onJumpscare?: () => void;
  /** дверь выхода в Бэкрумсе: живой боец коснулся — баннер «ты выбрался» + награда (App) */
  onEscape?: () => void;
  onSwing: () => void;
  /** удар по сетевому мобу: App шлёт mobhit на сервер, ответ применяет через netSyncHp/netKill */
  onNetHit?: (id: number, dmg: number) => void;
  /** удар по игроку в PvP: App шлёт pvphit на сервер (fid бойца из последнего beat) */
  onPvpHit?: (fid: number, dmg: number) => void;
  /** серверный hp в PvP упал в ноль: показать экран смерти с ресауном */
  onPvpDead?: () => void;
}

export interface RemotePlayer {
  nick: string;
  x: number;
  z: number;
  yaw?: number;
  hp: number;
  char: string;
  /** fid бойца (индекс в строю сервера) — цель для pvphit */
  fid?: number;
  /** полное присутствие: ствол, высота, счётчик ударов, лежит ли */
  weapon?: string;
  py?: number;
  atk?: number;
  dead?: boolean;
}

interface Remote {
  nick: string;
  /** fid бойца для pvphit (-1 = неизвестно) */
  fid: number;
  g: THREE.Group;
  /** тело (children[0]) — кэш, чтобы не дёргать children каждый кадр */
  body: THREE.Sprite;
  /** рентген-контур (белый): чуть больше тела, виден сквозь стены, пока висит рентген */
  ol: THREE.Sprite;
  cv: HTMLCanvasElement;
  tex: THREE.CanvasTexture;
  gunCv: HTMLCanvasElement;
  gunTex: THREE.CanvasTexture;
  x: number;
  z: number;
  /** куда смотрит кукла (с сервера): нужно для линии пули */
  yaw: number;
  tx: number;
  tz: number;
  /** буфер слепков {t,x,z} по времени получения: рендерим прошлое (now-550мс) —
      движение непрерывно при любых рваных обновлениях */
  snaps: Array<{ t: number; x: number; z: number }>;
  hp: number;
  char: string;
  weapon: string;
  py: number;
  atk: number;
  flash: number;
  dead: boolean;
}

/** Ствол сокомнатника текстом: эмодзи всегда чёткие, без боксов фона. */
const GUNEMOJI: Record<string, string> = { fists: '👊', bat: '🏏', axe: '🪓', pistol: '🔫', shotgun: '💥' };

interface Enemy {
  g: THREE.Group;
  body: THREE.Sprite;
  /** рентген-контур (красный): чуть больше тела, виден сквозь стены, пока висит рентген */
  ol: THREE.Sprite;
  hpCv: HTMLCanvasElement;
  hpTex: THREE.CanvasTexture;
  hpSpr: THREE.Sprite;
  kind: 'walk' | 'fly' | 'boss';
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
  /** общий моб комнаты: id хоста, сетевая кукла (позиции со сервера) */
  mobId: number;
  net: boolean;
  tx: number;
  tz: number;
  /** буфер слепков хоста: рендерим прошлое — кукла не дёргается */
  snaps: Array<{ t: number; x: number; z: number }>;
  ewave: number;
  /** обход стен: вейпоинты BFS + таймер пересчёта */
  path: Array<{ x: number; z: number }>;
  repathT: number;
  /** неубиваемый сталкер Бэкрумса (урон гаснет, фраг невозможен) */
  god: boolean;
  /** скалолаз Нашествия: лезет на стены до 12м, идёт по крышам */
  climb: boolean;
  /** цель прошлого маршрута: ушла >4м — пересчитываем досрочно, а не по таймеру */
  ptx: number;
  ptz: number;
  /** анти-прижим к углу: последняя точка, таймер стояния, слайд вбок */
  lx: number;
  lz: number;
  stuckT: number;
  slideT: number;
  slideX: number;
  slideZ: number;
  /** слайд В СТОРОНУ цели: помним прошлый бок, чтобы не качаться туда-сюда у длинной стены */
  slideDir: number;
  /** висит на стене (лезет вверх): гравитацию прыжков не применять, высоту ведёт лазанье */
  climbHold?: boolean;
  /** шаги: таймер топота (звук — по дистанции до игрока) */
  stepT: number;
}

/** Сетевой моб из пульса комнаты (сервер — правда). */
export interface RemoteMob {
  id: number;
  kind: string;
  x: number;
  z: number;
  hp: number;
  dead: boolean;
  wave: number;
  /** неубиваемый сталкер Бэкрумса */
  god?: boolean;
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
  // владение бойцами: по умолчанию только МТТ (Базовый), Стейси (Легендарный) — из кейса
  private ownedChars: string[] = (() => {
    try {
      const d = JSON.parse(localStorage.getItem('mtt_chars_v1') ?? '["mtt"]') as string[];
      const list = Array.isArray(d) ? d.filter((x) => CHARS.some((c) => c.id === x)) : [];
      if (!list.includes('mtt')) list.unshift('mtt');
      return list;
    } catch { return ['mtt']; }
  })();
  private saveChars(): void {
    try { localStorage.setItem('mtt_chars_v1', JSON.stringify(this.ownedChars)); } catch { /* noop */ }
  }
  charsOwned(): string[] { return [...this.ownedChars]; }
  hasChar(id: string): boolean { return this.ownedChars.includes(charSpec(id).id); }
  /** Выдать бойца (из кейса/дебага). true — если новый. */
  unlockChar(id: string): boolean {
    const cid = charSpec(id).id;
    if (this.ownedChars.includes(cid)) return false;
    this.ownedChars.push(cid);
    this.saveChars();
    this.pushHud();
    return true;
  }
  /** Промокод на всех: открывает каждого бойца. Возвращает вновь открытых. */
  unlockAllChars(): string[] {
    const fresh: string[] = [];
    for (const c of CHARS) {
      if (!this.ownedChars.includes(c.id)) { this.ownedChars.push(c.id); fresh.push(c.id); }
    }
    if (fresh.length) { this.saveChars(); this.pushHud(); }
    return fresh;
  }
  /** Открыть кейс бойца за фантики. Редкие по 30%: Шуба (0–0.3) и Чума (0.3–0.6),
      легендарные по 20%: Стейси (0.6–0.8) и Гидроксис (0.8–1.0).
      40+40+20+20 в сотню не лезет — редким ужались до 30, чтобы легендам хватило.
      Занятый диапазон — утешительный приз. */
  openCase(): CaseDrop {
    if (this.fantiki < CASE_PRICE) return { ok: false, kind: 'empty', text: 'Не хватает фантиков' };
    this.fantiki -= CASE_PRICE;
    const roll = Math.random();
    // Шуба ещё закрыта — 30% на неё (редкий)
    if (!this.ownedChars.includes('shuba') && roll < 0.3) {
      this.unlockChar('shuba');
      this.addXp(100);
      this.saveShop();
      this.pushHud();
      return { ok: true, kind: 'char', char: 'shuba', text: '🥷 ИВАНГОЙ · Редкий — твоя!' };
    }
    // Чума ещё закрыта — те же 30% (редкий)
    if (!this.ownedChars.includes('chuma') && roll >= 0.3 && roll < 0.6) {
      this.unlockChar('chuma');
      this.addXp(100);
      this.saveShop();
      this.pushHud();
      return { ok: true, kind: 'char', char: 'chuma', text: '🐦‍⬛ ЧУМА · Редкий — твоя!' };
    }
    // Стейси ещё закрыта — 20% на неё (легендарный)
    if (!this.ownedChars.includes('krysa') && roll >= 0.6 && roll < 0.8) {
      this.unlockChar('krysa');
      this.addXp(100);
      this.saveShop();
      this.pushHud();
      return { ok: true, kind: 'char', char: 'krysa', text: '🐀 СТЕЙСИ КРЫСА · Легендарный — твоя!' };
    }
    // Гидроксис ещё закрыт — те же 20% (легендарный)
    if (!this.ownedChars.includes('gidroxis') && roll >= 0.8) {
      this.unlockChar('gidroxis');
      this.addXp(100);
      this.saveShop();
      this.pushHud();
      return { ok: true, kind: 'char', char: 'gidroxis', text: '🧪 ГИДРОКСИС · Легендарный — твоя!' };
    }
    if (roll < 0.68) {
      this.fantiki += 300;
      this.saveShop();
      this.pushHud();
      return { ok: true, kind: 'fantiki', text: '+300 🎟️ фантиков' };
    }
    if (roll < 0.85) {
      this.addXp(150);
      this.saveShop();
      this.pushHud();
      return { ok: true, kind: 'xp', text: '+150 ✨ опыта бойцу' };
    }
    if (this.medkits < 3) {
      this.medkits++;
      this.saveShop();
      this.pushHud();
      return { ok: true, kind: 'med', text: '+1 💊 аптечка' };
    }
    this.fantiki += 300;
    this.saveShop();
    this.pushHud();
    return { ok: true, kind: 'fantiki', text: '+300 🎟️ фантиков' };
  }
  /** Начислить фантики (промокод): плюс на баланс, сейв, HUD. Возвращает баланс. */
  addFantiki(n: number): number {
    const v = Math.max(0, Math.floor(Number(n) || 0));
    if (v <= 0) return this.fantiki;
    this.fantiki += v;
    this.saveShop();
    this.pushHud();
    return this.fantiki;
  }
  // аптечки и опыт бойцов (не сносить сейвы: merge поверх)
  private medkits = 0;
  private upg: Record<string, UpgState> = (() => {
    const blank = (): UpgState => ({ hp: 0, dmg: 0, spd: 0, sup: 0 });
    try {
      const d = JSON.parse(localStorage.getItem('mtt_upg_v1') ?? '{}') as Record<string, Partial<UpgState>>;
      const clean = (p?: Partial<UpgState>): UpgState => ({
        hp: Math.max(0, Math.min(UPG_MAX.hp, Math.floor(p?.hp ?? 0))),
        dmg: Math.max(0, Math.min(UPG_MAX.dmg, Math.floor(p?.dmg ?? 0))),
        spd: Math.max(0, Math.min(UPG_MAX.spd, Math.floor(p?.spd ?? 0))),
        sup: Math.max(0, Math.min(UPG_MAX.sup, Math.floor(p?.sup ?? 0))),
      });
      return { mtt: clean(d.mtt), krysa: clean(d.krysa), shuba: clean(d.shuba), chuma: clean(d.chuma), gidroxis: clean(d.gidroxis) };
    } catch { return { mtt: blank(), krysa: blank(), shuba: blank(), chuma: blank(), gidroxis: blank() }; }
  })();
  private saveUpg(): void {
    try { localStorage.setItem('mtt_upg_v1', JSON.stringify(this.upg)); } catch { /* noop */ }
  }
  private xp: Record<string, number> = (() => {
    try {
      const d = JSON.parse(localStorage.getItem('mtt_xp_v1') ?? '{}') as Record<string, number>;
      return { mtt: Math.max(0, Math.floor(d.mtt ?? 0)), krysa: Math.max(0, Math.floor(d.krysa ?? 0)), shuba: Math.max(0, Math.floor(d.shuba ?? 0)), chuma: Math.max(0, Math.floor(d.chuma ?? 0)), gidroxis: Math.max(0, Math.floor(d.gidroxis ?? 0)) };
    } catch { return { mtt: 0, krysa: 0, shuba: 0, chuma: 0, gidroxis: 0 }; }
  })();
  private soundOn = true;
  /** Общая громкость 0..1 (слайдер в настройках). Множит все звуки. */
  private volume = 1;
  private sens = 1;
  private moving = false;
  private bobPhase = 0;
  private py = 0;
  private pvy = 0;
  // бросок от дробовика: короткий видимый полёт против выстрела (не импульс —
  // живёт только сам бросок, кнопки в полёте не несут)
  private blastT = 0;
  /** Щит спавна: пока >0 урон не проходит; гасится движением/выстрелом. */
  private shieldT = 0;
  private blastDx = 0;
  private blastDz = 0;
  private keyMap: KeyMap = { ...DEFAULT_KEYS };
  private remotes: Remote[] = [];
  /** Счётчик ударов для совместных комнат: каждый attack() +1, все видят замах. */
  private atk = 0;
  private half: number = HALF;
  /** Прибор лагов: накопленные мс логики/рендера + число кадров. */
  private perfJs = 0;
  private perfR = 0;
  private perfN = 0;
  /** Счётчики триггеров: прыжки/лазанье/спрыгивания ходоков (для отладки поведения). */
  private jumpDBG = 0;
  private climbDBG = 0;
  private dropDBG = 0;
  /** Мирный режим из меню: врагов нет, волны не идут. */
  readonly enemiesOn: boolean = true;
  /** Своя карта из редактора (map 'custom'). */
  private custom: CustomMap | null = null;
  /** Сид лабиринта бэкрумса — один на всех в комнате. */
  readonly mapSeed: number;
  /** Топология лабиринта для поиска пути: стены между клетками (0 = нет карты). */
  private mazeN = 0;
  private mazeS = 0;
  private mazeV: boolean[][] = [];
  private mazeH: boolean[][] = [];
  private wallKickCd = 0;
  /** Таймер топота игрока (шаги — по земле, в полёте тишина). */
  private stepT = 0;
  /** Жуть Бэкрумса: издыхающие лампы (панель + свет дёргаются) и фонарь игрока. */
  private lampFlicker: Array<{ mat: THREE.MeshBasicMaterial; light: THREE.PointLight; seed: number }> = [];
  private torch: THREE.SpotLight | null = null;
  private lampT = 0;
  private torchDir = new THREE.Vector3();

  /** Кадр жути: мигание дохнущих ламп + фонарь по взгляду. Дёшево: 2 лампы + 1 спот. */
  private updateLamps(dt: number): void {
    this.lampT += dt;
    const t = this.lampT;
    for (const f of this.lampFlicker) {
      // рваное дёргание с провалами в ноль — лампа издыхает
      const n = Math.sin(t * 31 + f.seed) * Math.sin(t * 17 + f.seed * 2) * Math.sin(t * 7 + f.seed * 3);
      const drop = Math.sin(t * 0.9 + f.seed) > 0.86 ? 0 : 1;
      const k = drop * (n > -0.2 ? 0.75 + 0.25 * n : 0.06);
      f.light.intensity = 7 * k;
      const c = Math.floor(40 + 190 * k);
      f.mat.color.setRGB(c / 255, (c * 0.82) / 255, (c * 0.6) / 255);
    }
    if (this.torch && this.camera) {
      // фонарь сидит на камере и бьёт по взгляду на 12м вперёд (вектор переиспользуем — без мусора в кадр)
      this.torch.position.copy(this.camera.position);
      this.camera.getWorldDirection(this.torchDir);
      this.torch.target.position.copy(this.camera.position).addScaledVector(this.torchDir, 12);
    }
  }
  /** Общая комната: id локальных мобов для слепка хоста; netSync — я гость (мобы со сервера). */
  private mobIdSeq = 1;
  private netSync = false;
  private netMax = new Map<number, number>();
  private netWave = 0;
  private deadLog: RemoteMob[] = [];
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
      this.sfx(wallkickUrl, 0.5);
      this.pushHud();
    }
  }
  private dashT = 0;
  private dashCd = 0;
  /** Невидимость Ивангоя: invisT — осталось секунд жути, invisCd — перезарядка. */
  private invisT = 0;
  private invisCd = 0;
  /** Чумное облако Чумы: chumaT — облако висит секунд, chumaCd — перезарядка. */
  private chumaT = 0;
  private chumaCd = 0;
  /** Таймер дымка облака (частицы каждые 0.4с, пока висит). */
  private chumaFxT = 0;
  /** Рентген Гидроксиса: xrayT — подсветка висит секунд, xrayCd — перезарядка. */
  private xrayT = 0;
  private xrayCd = 0;
  /** Панель разработчика: бессмертие, сквозной рентген, хитбоксы (только у владельца). */
  private devGod = false;
  private devXray = false;
  private devHit = false;
  private hitGroup: THREE.Group | null = null;
  private hitBoxes: THREE.LineSegments[] = [];
  setDevGod(on: boolean): void { this.devGod = !!on; }
  isDevGod(): boolean { return this.devGod; }
  setDevXray(on: boolean): void { this.devXray = !!on; this.syncXray(); }
  isDevXray(): boolean { return this.devXray; }
  setDevHit(on: boolean): void { this.devHit = !!on; if (!on && this.hitGroup) this.hitGroup.visible = false; }
  isDevHit(): boolean { return this.devHit; }
  /** Купол чумного облака: полупрозрачная фиолетовая полусфера 9м. Один на игру. */
  private chumaDome: THREE.Mesh | null = null;
  /** Купол за игроком: стоит на ногах, виден пока облако висит, дышит прозрачностью. */
  private syncChumaDome(): void {
    if (!this.chumaDome) {
      const geo = new THREE.SphereGeometry(9, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2);
      const mat = new THREE.MeshBasicMaterial({
        color: 0x8b3fd9, transparent: true, opacity: 0.22,
        side: THREE.DoubleSide, depthWrite: false,
      });
      this.chumaDome = new THREE.Mesh(geo, mat);
      this.chumaDome.renderOrder = 5;
    }
    const dome = this.chumaDome;
    if (!dome.parent) this.scene.add(dome);
    dome.visible = this.chumaT > 0 && this.started && !this.dead;
    if (dome.visible) {
      dome.position.set(this.px, Math.max(0, this.py), this.pz);
      const mat = dome.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.18 + 0.07 * Math.sin(performance.now() / 350);
    }
  }
  private dashDx = 0;
  private dashDy = 0;
  private dashDz = 0;
  private quality: Quality = 'medium';
  private foeTexCache: THREE.Texture[] = [];
  private enemies: Enemy[] = [];
  // хитбокс окружения строго внутри текстуры и только до своей высоты h:
  // коробки — точный AABB, круглые — точный радиус. Пролететь/перепрыгнуть можно.
  // deck: настил (мост) — снизу проход свободный, сверху можно стоять.
  private solids: Array<{ x: number; z: number; hx: number; hz: number; h: number; deck?: boolean } | { x: number; z: number; r: number; h: number }> = [];
  /** Бюджет BFS на кадр: орда делит, хватило — маршрут, нет — в лоб до следующего кадра. */
  private bfsBudget = 5;
  /** Сглаженный FPS для счётчика. */
  private fpsE = 60;
  /** Кадров подряд с просадкой (авто-сброс качества). */
  private lowT = 0;
  /** Счётчик кадров (LOD дальних врагов). */
  private frame = 0;
  /** Пространственная сетка солидов (ячейка 6м): hitSolid смотрит 3×3 клетки вместо всех стен. */
  private solidGrid = new Map<string, typeof this.solids>();
  private static readonly GRID = 6;

  private rebuildSolidGrid(): void {
    this.solidGrid.clear();
    const C = Game.GRID;
    const put = (cx: number, cz: number, s: (typeof this.solids)[number]): void => {
      const k = cx + ':' + cz;
      let cell = this.solidGrid.get(k);
      if (!cell) { cell = []; this.solidGrid.set(k, cell); }
      cell.push(s);
    };
    for (const s of this.solids) {
      const ex = ('r' in s ? s.r : Math.max(s.hx, s.hz)) + 2.5;
      const x0 = Math.floor((s.x - ex) / C), x1 = Math.floor((s.x + ex) / C);
      const z0 = Math.floor((s.z - ex) / C), z1 = Math.floor((s.z + ex) / C);
      for (let cx = x0; cx <= x1; cx++) for (let cz = z0; cz <= z1; cz++) put(cx, cz, s);
    }
  }
  private lookPointer = -1;
  private lookLX = 0;
  private lookLY = 0;
  private parts: Array<{ s: THREE.Sprite; vx: number; vy: number; vz: number; life: number }> = [];

  /** Красные частицы удара: брызги в точке попадания. На low — втрое меньше (FPS). */
  burst(x: number, y: number, z: number, n = 10): void {
    const scaled = this.quality === 'low' ? Math.ceil(n / 3) : this.quality === 'medium' ? Math.ceil(n / 1.5) : n;
    for (let i = 0; i < scaled; i++) {
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
    this.custom = opts.custom ?? null;
    this.mapSeed = (opts.seed ?? Math.floor(Math.random() * 2 ** 31)) >>> 0;
    // Бэкрумс большой: лабиринт ~120м. Размер задаёт сам строитель через halfOverride.
    this.half = map === 'duel' ? 32 : HALF;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
    // свет наблюдателя: день вместо жути — висят выключенными, зажигаются в specOn
    this.specLight = new THREE.AmbientLight(0xfff6e6, 1.15);
    this.specLight.visible = false;
    this.scene.add(this.specLight);
    this.specSun = new THREE.DirectionalLight(0xfff2dd, 1.0);
    this.specSun.position.set(40, 120, 20);
    this.specSun.visible = false;
    this.scene.add(this.specSun);
    this.loadQuality();
    this.loadChar();
    // старый сейв мог держать закрытого бойца — откатываем на МТТ
    if (!this.ownedChars.includes(this.charId)) this.charId = 'mtt';
    this.applyLevel();
    const spec0 = charSpec(this.charId);
    this.hp = this.maxhp;
    this.charSpd = spec0.spd * (1 + (this.upg[this.charId]?.spd ?? 0) * 0.06);
    this.jumpVel = this.charId === 'krysa' ? 4.8 * Math.sqrt(3) : 4.8;
    this.renderer.setPixelRatio(this.quality === 'high' ? Math.min(window.devicePixelRatio, 2) : this.quality === 'low' ? 0.75 : 1);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = this.quality === 'high';
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 500);
    this.camera.rotation.order = 'YXZ';
    if (map === 'duel') {
      this.scene.background = new THREE.Color(0x1a1030);
      this.scene.fog = new THREE.Fog(0x1a1030, 40, 140);
    } else if (map === 'backrooms' || map === 'endless') {
      // жуть: почти тьма, тёплый туман, небо не нужно — сверху потолок
      this.scene.background = new THREE.Color(0x060503);
      this.scene.fog = new THREE.Fog(0x060503, 6, 50);
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
      this.skyMesh = sky;
    }
    // запоминаем родной туман карты — ползунок дальности будет резать от него
    const fg0 = this.scene.fog as THREE.Fog | null;
    if (fg0) this.fogOrig = { near: fg0.near, far: fg0.far };
    this.loadShop();
    this.loadKeys();
    this.buildWorld();
    this.rebuildSolidGrid();
    this.loadDrawDist();
    this.applyDrawDist();
    // endless: только сталкеры (волн нет); duel/pvp: без врагов вообще
    if (map !== 'duel' && map !== 'endless' && map !== 'pvp' && this.enemiesOn) this.spawnWave();
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
      const d = JSON.parse(raw) as { fantiki?: number; owned?: string[]; weapon?: string; sound?: boolean; sens?: number; med?: number; volume?: number };
      if (typeof d.fantiki === 'number') this.fantiki = Math.max(0, Math.floor(d.fantiki));
      if (Array.isArray(d.owned) && d.owned.length) this.owned = d.owned.filter((x) => WEAPONS.some((w) => w.id === x));
      if (!this.owned.includes('fists')) this.owned.unshift('fists');
      if (d.weapon && this.owned.includes(d.weapon)) this.weaponId = d.weapon;
      if (typeof d.sound === 'boolean') this.soundOn = d.sound;
      if (typeof d.volume === 'number') this.volume = Math.max(0, Math.min(1, d.volume));
      if (typeof d.sens === 'number') this.sens = Math.max(0.3, Math.min(2.5, d.sens));
      if (typeof d.med === 'number') this.medkits = Math.max(0, Math.min(3, Math.floor(d.med)));
    } catch { /* noop */ }
  }

  private saveShop(): void {
    try {
      localStorage.setItem('mtt_shop_v1', JSON.stringify({
        fantiki: this.fantiki, owned: this.owned, weapon: this.weaponId, sound: this.soundOn, sens: this.sens, med: this.medkits, volume: this.volume,
      }));
    } catch { /* noop */ }
  }

  // аптечки: максимум 3 в запасе, +50 HP по кнопке X
  buyMedkit(): boolean {
    if (this.medkits >= 3 || this.fantiki < 150) return false;
    this.fantiki -= 150;
    this.medkits++;
    this.saveShop();
    this.pushHud();
    return true;
  }

  useMedkit(): boolean {
    if (!this.started || this.dead || this.medkits <= 0 || this.hp >= this.maxhp) return false;
    this.medkits--;
    this.hp = Math.min(this.maxhp, this.hp + 50);
    this.saveShop();
    this.burst(this.px, 1.0, this.pz, 8);
    this.pushHud();
    return true;
  }

  // прокачка бойца: опыт за фраги/волны, уровень = 1+sqrt(xp/1000); +10 maxHP и +5% урона за уровень
  // плюс покупные апгрейды за фантики: hp +15 maxHP/ур, dmg +8%/ур, spd +6%/ур, sup — кд до 1.7с + дальность +15%/ур
  level(): number {
    return this.levelOf(this.charId);
  }

  xpOf(id: string): number { return Math.max(0, Math.floor(this.xp[charSpec(id).id] ?? 0)); }
  /** Порог следующего уровня: lvl²×1000 (ур1: 0–999, ур2 с 1000, ур3 с 4000…). */
  xpNeedOf(id: string): number {
    const lvl = this.levelOf(charSpec(id).id);
    return lvl * lvl * 1000;
  }
  upgOf(id: string): UpgState { return { ...(this.upg[charSpec(id).id] ?? { hp: 0, dmg: 0, spd: 0, sup: 0 }) }; }
  superCdOf(id: string): number {
    const cid = charSpec(id).id;
    return superCd(cid, this.upg[cid]?.sup ?? 0);
  }
  /** Купить апгрейд за фантики. Возвращает true если куплено. */
  buyUpg(id: string, key: keyof UpgState): boolean {
    const cid = charSpec(id).id;
    const cur = this.upg[cid] ?? { hp: 0, dmg: 0, spd: 0, sup: 0 };
    if (cur[key] >= UPG_MAX[key]) return false;
    const cost = upgCost(key, cur[key]);
    if (this.fantiki < cost) return false;
    this.fantiki -= cost;
    this.upg[cid] = { ...cur, [key]: cur[key] + 1 };
    this.saveUpg();
    this.saveShop();
    this.applyLevel();
    const spec = charSpec(this.charId);
    this.charSpd = spec.spd * (1 + (this.upg[this.charId]?.spd ?? 0) * 0.06);
    this.pushHud();
    return true;
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
    const u = this.upg[this.charId] ?? { hp: 0, dmg: 0, spd: 0, sup: 0 };
    this.maxhp = spec.hp + (this.level() - 1) * 10 + u.hp * 15;
    this.hp = Math.min(this.hp, this.maxhp);
  }

  private dmgMul(): number {
    const u = this.upg[this.charId] ?? { hp: 0, dmg: 0, spd: 0, sup: 0 };
    return 1 + (this.level() - 1) * 0.05 + u.dmg * 0.08;
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
    this.pushHud();
    return true;
  }

  setWeapon(id: string): boolean {
    if (!this.owned.includes(id)) return false;
    this.weaponId = id;
    this.saveShop();
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
    return this.weaponId;
  }

  setSound(v: boolean): void { this.soundOn = v; this.saveShop(); this.pushHud(); }
  setSens(v: number): void { this.sens = Math.max(0.3, Math.min(2.5, v)); this.saveShop(); }
  getChar(): string { return this.charId; }
  setChar(id: string): string {
    const cid = charSpec(id).id;
    // закрытого бойца выбрать нельзя — только из кейса
    if (!this.ownedChars.includes(cid)) return this.charId;
    this.charId = cid;
    try { localStorage.setItem('mtt_char_v1', this.charId); } catch { /* noop */ }
    this.applyLevel();
    const spec = charSpec(this.charId);
    this.hp = this.maxhp;
    this.charSpd = spec.spd * (1 + (this.upg[this.charId]?.spd ?? 0) * 0.06);
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
  /** Переключить на следующее: low → medium → high → low. Возвращает новое. */
  cycleQuality(): Quality {
    return this.setQuality(this.quality === 'low' ? 'medium' : this.quality === 'medium' ? 'high' : 'low');
  }
  setQuality(q: Quality): Quality {
    this.quality = q === 'high' ? 'high' : q === 'low' ? 'low' : 'medium';
    try { localStorage.setItem('mtt_quality_v1', this.quality); } catch { /* noop */ }
    this.applyQuality();
    return this.quality;
  }
  private loadQuality(): void {
    try {
      const v = localStorage.getItem('mtt_quality_v1');
      // старые сейвы: fast → medium, nice → high
      this.quality = v === 'high' || v === 'nice' ? 'high' : v === 'low' ? 'low' : 'medium';
    } catch { /* noop */ }
  }
  private applyQuality(): void {
    if (this.quality === 'high') this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    else if (this.quality === 'low') this.renderer.setPixelRatio(0.75);
    else this.renderer.setPixelRatio(1);
    this.renderer.shadowMap.enabled = this.quality === 'high';
    this.scene.traverse((o) => {
      const m = o as { material?: { needsUpdate?: boolean } | Array<{ needsUpdate?: boolean }> };
      if (Array.isArray(m.material)) m.material.forEach((x) => { x.needsUpdate = true; });
      else if (m.material) m.material.needsUpdate = true;
    });
  }
  getSound(): boolean { return this.soundOn; }
  getVolume(): number { return this.volume; }
  /** Дальность прорисовки 80–500м: сохраняется, применяется сразу. */
  getDrawDist(): number { return this.drawDist; }
  setDrawDist(v: number): number {
    this.drawDist = Math.max(80, Math.min(500, Math.round(Number(v) || 500)));
    try { localStorage.setItem('mtt_drawdist_v1', String(this.drawDist)); } catch { /* noop */ }
    this.applyDrawDist();
    return this.drawDist;
  }
  private loadDrawDist(): void {
    try {
      const raw = localStorage.getItem('mtt_drawdist_v1');
      if (raw === null || raw === '') return;
      const v = Number(raw);
      if (Number.isFinite(v)) this.drawDist = Math.max(80, Math.min(500, Math.round(v)));
    } catch { /* noop */ }
  }
  /** Применяем дальность во ВСЕХ режимах: край камеры + туман жмётся
      пропорционально (в лабиринте родной туман 50м — иначе ползунок там не
      чувствовался) + небо под край. Туманом владеет спек — пока он летит, не трогаем. */
  private applyDrawDist(): void {
    const d = this.drawDist;
    this.camera.far = d;
    this.camera.updateProjectionMatrix();
    if (this.skyMesh) {
      const s = (d * 0.95) / 420;
      this.skyMesh.scale.set(s, s, s);
    }
    if (!this.fogSave && this.fogOrig) {
      const fog = this.scene.fog as THREE.Fog | null;
      if (fog) {
        const k = d / 500;
        fog.far = Math.max(12, this.fogOrig.far * k);
        fog.near = Math.min(this.fogOrig.near, fog.far * 0.8);
      }
    }
  }
  /** Громкость 0..1: сохраняется, применяется ко всем звукам сразу. */
  setVolume(v: number): number {
    this.volume = Math.max(0, Math.min(1, Number(v) || 0));
    this.saveShop();
    return this.volume;
  }
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
    // из призраков — сначала выйти (тело вернуть, потолок вернуть), потом оживать
    if (this.specOn) this.setSpec(false);
    this.dead = false;
    this.deathPlayed = false;
    this.hp = this.maxhp;
    this.score = Math.max(0, this.score - 100);
    for (const e of this.enemies) {
      if (e.dead) continue;
      const dx = e.g.position.x - this.px, dz = e.g.position.z - this.pz;
      const d = Math.hypot(dx, dz) || 1;
      // расталкиваем от игрока, но НЕ сквозь стены — с проверкой по осям
      const qx = clampArena(e.g.position.x + (dx / d) * 6, this.half);
      const qz = clampArena(e.g.position.z + (dz / d) * 6, this.half);
      if (!this.hitSolid(qx, e.g.position.z, 0.8)) e.g.position.x = qx;
      if (!this.hitSolid(e.g.position.x, qz, 0.8)) e.g.position.z = qz;
    }
    this.sfx(hitUrl, 0.5);
    this.pushHud();
    this.drawMM();
    return true;
  }

  /** Щит спавна вкл/выкл (загрузка ставит вкл, движение/выстрел гасит). */
  setShield(on: boolean): void { this.shieldT = on ? 1e9 : 0; }
  shield(): boolean { return this.shieldT > 0; }

  /** Предзагрузка текстур перед боем: только нужное под карту + общие (бойцы, враги).
      Шуба ужата до 512px, грузим пачками параллельно — экран загрузки пролетает. */
  async preload(onPct: (p: number) => void): Promise<void> {
    const core = [vrag1Url, vrag2Url, bossUrl, stalkerUrl, charMttUrl, charKrysaUrl, charShubaUrl, charChumaUrl, charGidroxisUrl, skyUrl];
    const byMap: Record<string, string[]> = {
      arena: [dom1Url, travaUrl, facadeUrl, panelUrl, shopUrl, roofUrl, roadUrl, walkUrl, plazaUrl, fenceUrl, edgeUrl, house2Url, brickUrl],
      duel: [travaUrl, brickUrl, edgeUrl],
      backrooms: [brFloorUrl, brWallUrl, brCeilUrl, doorExitUrl],
      endless: [brFloorUrl, brWallUrl, brCeilUrl],
      random: [travaUrl, brickUrl, edgeUrl, house2Url],
      custom: [travaUrl, brickUrl],
      szeged: [szegedAtlasUrl],
      pvp: [travaUrl, brickUrl, edgeUrl, house2Url],
      invasion: [dom1Url, travaUrl, facadeUrl, brickUrl, edgeUrl],
    };
    const urls = [...core, ...(byMap[this.map] ?? Object.values(byMap).flat())];
    if (urls.length === 0) { onPct(100); return; }
    const total = urls.length;
    let done = 0;
    const man = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(man);
    const step = () => { done++; onPct(Math.min(100, Math.round((done / total) * 100))); };
    // пачки по 6: браузер всё равно держит ~6 коннектов на хост, зато прогресс ровный
    for (let i = 0; i < urls.length; i += 6) {
      await Promise.all(urls.slice(i, i + 6).map((u) => new Promise<void>((res) => {
        loader.load(u, () => { step(); res(); }, undefined, () => { step(); res(); });
      })));
    }
    onPct(100);
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

  // Сегед: приватная карта МТТ — запечённый индексный меш (формат szeged-mesh-3).
  // Экспанд угла c треугольника t: P=positions[3*pos_index[c]], N=normals[3*nor_index[c]], C=colors[3*col_index[t]], UV=uv[2*c:2*c+2].
  private buildSzeged(): void {
    const scene = this.scene;
    // half ядра: половина большей стороны запечённого bbox + 10м
    // (true-scale ядро ~350м -> half ~185)
    let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
    for (let i = 0; i < szegedMesh.positions.length; i += 3) {
      const x = szegedMesh.positions[i]!, z = szegedMesh.positions[i + 2]!;
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (z < z0) z0 = z; if (z > z1) z1 = z;
    }
    this.half = Math.max(x1 - x0, z1 - z0) / 2 + 10;
    const H = this.half;
    // свет дня: небо сверху, земля снизу (объём вместо плоского фона) +
    // тёплое солнце; ACES из buildWorld не даст выгореть белому.
    scene.add(new THREE.HemisphereLight(0xbfd9ff, 0x8a7a66, 0.75));
    const sun = new THREE.DirectionalLight(0xffe7c4, 1.5);
    sun.position.set(120, 180, 60);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.left = -H - 5;
    sun.shadow.camera.right = H + 5;
    sun.shadow.camera.top = H + 5;
    sun.shadow.camera.bottom = -H - 5;
    sun.shadow.camera.near = 10;
    sun.shadow.camera.far = 600;
    sun.shadow.bias = -0.0004;
    scene.add(sun);
    // индексный меш -> плоские атрибуты (цвет постоянен на треугольник)
    const n = szegedMesh.pos_index.length;
    const pos = new Float32Array(n * 3);
    const nor = new Float32Array(n * 3);
    const col = new Float32Array(n * 3);
    for (let c = 0; c < n; c++) {
      const t = (c / 3) | 0;
      const p = szegedMesh.pos_index[c] * 3;
      const v = szegedMesh.nor_index[c] * 3;
      const k = szegedMesh.col_index[t] * 3;
      pos[c * 3] = szegedMesh.positions[p];
      pos[c * 3 + 1] = szegedMesh.positions[p + 1];
      pos[c * 3 + 2] = szegedMesh.positions[p + 2];
      nor[c * 3] = szegedMesh.normals[v];
      nor[c * 3 + 1] = szegedMesh.normals[v + 1];
      nor[c * 3 + 2] = szegedMesh.normals[v + 2];
      col[c * 3] = szegedMesh.colors[k];
      col[c * 3 + 1] = szegedMesh.colors[k + 1];
      col[c * 3 + 2] = szegedMesh.colors[k + 2];
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(szegedMesh.uv), 2));
    const atlasTex = new THREE.TextureLoader().load(szegedAtlasUrl);
    atlasTex.colorSpace = THREE.SRGBColorSpace;
    atlasTex.anisotropy = 4;
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({ map: atlasTex, color: 0xffffff, vertexColors: true, roughness: 0.9 }),
    );
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    for (const s of szegedSolids) {
      this.solids.push({ x: s.x, z: s.z, hx: s.hx, hz: s.hz, h: s.h });
    }
    // спавн: первичный — baked RECOMMENDED_SPAWN (tools/szeged-spawn.json,
    // ближайшая к (0,0) свободная кругом r=2м точка); фолбэк — спираль от
    // центра (r=2..half шаг 2, 8 направлений), затем старые углы ядра
    const S = this.half - 10;
    if (!this.hitSolid(szegedSpawn.x, szegedSpawn.z, 1.5)) {
      this.px = szegedSpawn.x; this.pz = szegedSpawn.z; this.yaw = 0; return;
    }
    for (let r = 2; r <= this.half; r += 2) {
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        const qx = clampArena(Math.cos(a) * r, this.half);
        const qz = clampArena(Math.sin(a) * r, this.half);
        if (!this.hitSolid(qx, qz, 1.5)) { this.px = qx; this.pz = qz; this.yaw = 0; return; }
      }
    }
    const cand: Array<[number, number]> = [[-S, -S], [S, -S], [-S, S], [S, S]];
    for (const [qx, qz] of cand) {
      if (!this.hitSolid(qx, qz, 1.5)) { this.px = qx; this.pz = qz; this.yaw = 0; return; }
    }
    for (let t = 0; t < 30; t++) {
      const qx = Math.random() * 2 * S - S, qz = Math.random() * 2 * S - S;
      if (!this.hitSolid(qx, qz, 1.5)) { this.px = qx; this.pz = qz; this.yaw = 0; return; }
    }
    this.px = -S; this.pz = -S; this.yaw = 0;
  }

  /**
   * БЭКРУМС: большой случайный лабиринт, новый каждый запуск.
   * Случайный DFS-лабиринт N×N клеток; стены — InstancedMesh (1 draw call),
   * пол/потолок/стены — с фото МТТ, сверху гул жёлтых ламп.
   */
  private buildBackrooms(): void {
    const scene = this.scene;
    const N = 50, CELL = 6, WH = 3, TH = 0.7;
    const S = N * CELL;
    this.half = S / 2;
    // свет жути: тусклый тёплый фон + живые лампы островками, остальное — тьма.
    // Направленного солнца нет (сверху потолок), только слабый блик для чтения форм.
    scene.add(new THREE.AmbientLight(0x9a8a6a, 0.28));
    const glimmer = new THREE.DirectionalLight(0xffe9c4, 0.12);
    glimmer.position.set(20, 30, 10);
    scene.add(glimmer);
    const floorTex = new THREE.TextureLoader().load(brFloorUrl);
    floorTex.colorSpace = THREE.SRGBColorSpace;
    floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(S / 4, S / 4);
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
    ceilTex.repeat.set(S / 3, S / 3);
    const ceil = new THREE.Mesh(
      new THREE.PlaneGeometry(S + 10, S + 10),
      new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 1 }),
    );
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = WH;
    scene.add(ceil);
    // наблюдатель сверху прячет потолок — видно весь лабиринт
    this.ceilMesh = ceil;
    // лабиринт по сиду комнаты: рандомизированный алгоритм Прима на seeded RNG
    // + braid (пробивка тупиков до ~20). Открытый лабиринт с петлями вместо ловушек.
    // Один сид = одна карта у всех игроков. Было Math.random — у каждого своя.
    const rng = mulberry32(this.mapSeed);
    this.mazeDeads = 0;
    const vWall: boolean[][] = Array.from({ length: N + 1 }, () => new Array(N).fill(true));
    const hWall: boolean[][] = Array.from({ length: N }, () => new Array(N + 1).fill(true));
    const inMz: boolean[][] = Array.from({ length: N }, () => new Array(N).fill(false));
    inMz[0][0] = true;
    // граница: стены между «своими» и «чужими» клетками [x, y, dir]
    const front: Array<[number, number, number]> = [];
    const pushFront = (x: number, y: number): void => {
      if (x > 0 && !inMz[x - 1][y]) front.push([x, y, 0]);
      if (x < N - 1 && !inMz[x + 1][y]) front.push([x, y, 1]);
      if (y > 0 && !inMz[x][y - 1]) front.push([x, y, 2]);
      if (y < N - 1 && !inMz[x][y + 1]) front.push([x, y, 3]);
    };
    pushFront(0, 0);
    while (front.length > 0) {
      const k = Math.floor(rng() * front.length);
      const [fx, fy, dir] = front.splice(k, 1)[0]!;
      let nx = fx, ny = fy;
      if (dir === 0) { nx = fx - 1; if (inMz[nx][ny]) continue; vWall[fx][fy] = false; }
      else if (dir === 1) { nx = fx + 1; if (inMz[nx][ny]) continue; vWall[fx + 1][fy] = false; }
      else if (dir === 2) { ny = fy - 1; if (inMz[nx][ny]) continue; hWall[fx][fy] = false; }
      else { ny = fy + 1; if (inMz[nx][ny]) continue; hWall[fx][fy + 1] = false; }
      inMz[nx][ny] = true;
      pushFront(nx, ny);
    }
    // МЕНЬШЕ ТУПИКОВ: пробиваем стены у тупиковых клеток, пока их не останется ~20.
    // Лабиринт становится открытым (петли вместо ловушек), связность не рвётся —
    // мы только СНОСИМ стены. ГСЧ тот же seeded — карта одна на всех в комнате.
    for (let t = 0; t < 3000; t++) {
      // список тупиков: клетка с ≤1 выходом + её закрытые внутренние стены
      const deadWalls: Array<Array<[number, number, number]>> = [];
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
        let open = 0;
        const w: Array<[number, number, number]> = [];
        if (i > 0) { if (!vWall[i][j]) open++; else w.push([0, i, j]); }
        if (i < N - 1) { if (!vWall[i + 1][j]) open++; else w.push([0, i + 1, j]); }
        if (j > 0) { if (!hWall[i][j]) open++; else w.push([1, i, j]); }
        if (j < N - 1) { if (!hWall[i][j + 1]) open++; else w.push([1, i, j + 1]); }
        if (open <= 1 && w.length > 0) deadWalls.push(w);
      }
      if (deadWalls.length <= 20) break;
      const w = deadWalls[Math.floor(rng() * deadWalls.length)]!;
      const s = w[Math.floor(rng() * w.length)]!;
      if (s[0] === 0) vWall[s[1]][s[2]] = false;
      else hWall[s[1]][s[2]] = false;
    }
    const passOpen = (x1: number, y1: number, x2: number, y2: number): boolean => {
      if (x2 === x1 + 1) return !vWall[x2][y1];
      if (x2 === x1 - 1) return !vWall[x1][y1];
      if (y2 === y1 + 1) return !hWall[x1][y2];
      if (y2 === y1 - 1) return !hWall[x1][y1];
      return false;
    };
    let deads = 0;
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      let open = 0;
      if (i > 0 && passOpen(i, j, i - 1, j)) open++;
      if (i < N - 1 && passOpen(i, j, i + 1, j)) open++;
      if (j > 0 && passOpen(i, j, i, j - 1)) open++;
      if (j < N - 1 && passOpen(i, j, i, j + 1)) open++;
      if (open <= 1) deads++;
    }
    this.mazeDeads = deads;
    // топология для поиска пути: мобы ходят по клеткам, а не по геометрии
    this.mazeN = N; this.mazeS = S; this.mazeV = vWall; this.mazeH = hWall;
    // сегменты стен: вертикальные vWall[i][j], горизонтальные hWall[i][j].
    // Длина ровно CELL (стык в стык, без нахлёста): нахлёст +0.35 с каждого конца
    // торчал кончиком в проход, и соседние клетки BFS (центры свободны) соединялись
    // линией через этот кончик — моб шёл в стену и клинил. Стык без нахлёста углы
    // не дырявит: крест 0.7×0.7 закрыт обеими стенами, конец стены — ровный торец.
    const segs: Array<{ x: number; z: number; sx: number; sz: number }> = [];
    for (let i = 0; i <= N; i++) {
      for (let j = 0; j < N; j++) {
        if (vWall[i][j]) segs.push({ x: -S / 2 + i * CELL, z: -S / 2 + (j + 0.5) * CELL, sx: TH, sz: CELL });
      }
    }
    for (let i = 0; i < N; i++) {
      for (let j = 0; j <= N; j++) {
        if (hWall[i][j]) segs.push({ x: -S / 2 + (i + 0.5) * CELL, z: -S / 2 + j * CELL, sx: CELL, sz: TH });
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
    // ДВЕРЬ ВЫХОДА (только бэкрумс, не endless): одна на карту, место — на сиде
    // комнаты (у всех одна). Стоит ВПРИТЫК К СТЕНЕ: берём случайную внутреннюю
    // стену подальше от старта и лепим дверь лицом в коридор. Текстура unlit —
    // дверь светится в темноте, видно издалека.
    // ТОЛЬКО Бесконечный: на остальных серверах (обычный бэкрумс, арена...) двери нет вообще.
    if (this.doorMode) {
      const cand: Array<{ v: boolean; i: number; j: number }> = [];
      for (let i = 1; i < N; i++) for (let j = 0; j < N; j++) if (vWall[i][j]) cand.push({ v: true, i, j });
      for (let i = 0; i < N; i++) for (let j = 1; j < N; j++) if (hWall[i][j]) cand.push({ v: false, i, j });
      // подальше от старта (старт — угол клеток (0,0))
      const far = cand.filter((c) => Math.hypot(c.i, c.j) > N * 0.55);
      const pool = far.length > 0 ? far : cand;
      const pick = pool[Math.floor(rng() * pool.length)]!;
      const side = rng() < 0.5 ? 1 : -1;
      let dx: number, dz: number, sx: number, sz: number, hx: number, hz: number;
      let fnx = 1, fnz = 0;
      if (pick.v) {
        // вертикальная стена: дверь тонким боком к ней (грань к грани, без щели)
        dx = -S / 2 + pick.i * CELL + side * (TH / 2 + 0.2);
        dz = -S / 2 + (pick.j + 0.5) * CELL;
        sx = 0.4; sz = 2.2; hx = 0.2; hz = 1.1;
        fnx = side; fnz = 0;
      } else {
        // горизонтальная стена: то же, лицом вдоль коридора
        dx = -S / 2 + (pick.i + 0.5) * CELL;
        dz = -S / 2 + pick.j * CELL + side * (TH / 2 + 0.2);
        sx = 2.2; sz = 0.4; hx = 1.1; hz = 0.2;
        fnx = 0; fnz = side;
      }
      this.door = { x: dx, z: dz };
      this.doorFace = { x: fnx, z: fnz };
      const doorTex = new THREE.TextureLoader().load(doorExitUrl);
      doorTex.colorSpace = THREE.SRGBColorSpace;
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(sx, 3, sz),
        new THREE.MeshBasicMaterial({ map: doorTex }),
      );
      door.position.set(dx, 1.5, dz);
      scene.add(door);
      this.solids.push({ x: dx, z: dz, hx, hz, h: 3 });
      // маяк двери: раз в минуту 5 секунд — светится САМА ДВЕРЬ, видно всем
      this.doorMesh = door;
      const glow = new THREE.PointLight(0xffc861, 0, 20, 1.6);
      glow.position.set(dx, 2.4, dz);
      scene.add(glow);
      this.doorGlow = glow;
    }
    // лампы: живые островки света (~1/3 панелей), дохлые (тьма) и пара мигающих.
    // Стартовая клетка всегда светлая — игрок рождается в свете, а не в соплях.
    const liveMat = new THREE.MeshBasicMaterial({ color: 0xffe2a8 });
    const deadMat = new THREE.MeshBasicMaterial({ color: 0x201c16 });
    const lampGeo = new THREE.BoxGeometry(1.4, 0.08, 0.7);
    // тёплая лужа света на полу под живой лампой (одна текстура на всех — дёшево)
    const poolCv = document.createElement('canvas');
    poolCv.width = poolCv.height = 128;
    const pg = poolCv.getContext('2d')!;
    const grad = pg.createRadialGradient(64, 64, 4, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,196,110,0.7)');
    grad.addColorStop(0.6, 'rgba(255,180,90,0.3)');
    grad.addColorStop(1, 'rgba(255,170,80,0)');
    pg.fillStyle = grad;
    pg.fillRect(0, 0, 128, 128);
    const poolTex = new THREE.CanvasTexture(poolCv);
    const poolGeo = new THREE.PlaneGeometry(11, 11);
    let flickLeft = 2;
    // сначала решаем судьбу каждой панели, потом включаем РЕАЛЬНЫЙ свет только
    // на 8 разбросанных (жадный min-dist 26м): панели и лужи — unlit-материалы,
    // они горят бесплатно, а каждый PointLight жрёт каждый пиксель кадра.
    // Было ~17 источников + спот — вот и лаги. Стало 8 + 2 мигающих + фонарь.
    const liveCells: Array<[number, number]> = [];
    const cellKind = new Map<string, 'flick' | 'live' | 'dead'>();
    for (let i = 1; i < N; i += 3) {
      for (let j = 1; j < N; j += 3) {
        const isStart = i === 1 && j === 1;
        const roll = rng();
        if (flickLeft > 0 && !isStart && roll > 0.86) {
          flickLeft--;
          cellKind.set(i + ':' + j, 'flick');
        } else if (isStart || roll < 0.36) {
          cellKind.set(i + ':' + j, 'live');
          liveCells.push([-S / 2 + (i + 0.5) * CELL, -S / 2 + (j + 0.5) * CELL]);
        } else {
          cellKind.set(i + ':' + j, 'dead');
        }
      }
    }
    // стартовая клетка — всегда с настоящим светом (игрок рождается в свете)
    const startKey = '1:1';
    const litKeys = new Set<string>([startKey]);
    const litPos: Array<[number, number]> = [liveCells[0]];
    for (const [lx, lz] of liveCells.slice(1)) {
      if (litKeys.size >= 8) break;
      let ok = true;
      for (const [px, pz] of litPos) {
        const dx = lx - px, dz = lz - pz;
        if (dx * dx + dz * dz < 26 * 26) { ok = false; break; }
      }
      if (ok) {
        litPos.push([lx, lz]);
        // ключ по координатам стартовой сетки — ищем ближайшую ячейку
        let best = '', bd = Infinity;
        for (const k of cellKind.keys()) {
          if (cellKind.get(k) !== 'live' || litKeys.has(k)) continue;
          const [ci, cj] = k.split(':').map(Number);
          const cx = -S / 2 + (ci + 0.5) * CELL, cz = -S / 2 + (cj + 0.5) * CELL;
          const d = (cx - lx) * (cx - lx) + (cz - lz) * (cz - lz);
          if (d < bd) { bd = d; best = k; }
        }
        if (best) litKeys.add(best);
      }
    }
    for (let i = 1; i < N; i += 3) {
      for (let j = 1; j < N; j += 3) {
        const lx = -S / 2 + (i + 0.5) * CELL, lz = -S / 2 + (j + 0.5) * CELL;
        const kind = cellKind.get(i + ':' + j) ?? 'dead';
        // корпус панели виден всегда — тёмный или светящийся
        if (kind === 'flick') {
          // издыхающая: панель дёргается, свет её — тоже (обновляется в updateLamps)
          const fmat = new THREE.MeshBasicMaterial({ color: 0xffd9a0 });
          const panel = new THREE.Mesh(lampGeo, fmat);
          panel.position.set(lx, WH - 0.05, lz);
          scene.add(panel);
          const fl = new THREE.PointLight(0xffc06a, 2, 13, 1.8);
          fl.position.set(lx, WH - 0.5, lz);
          scene.add(fl);
          this.lampFlicker.push({ mat: fmat, light: fl, seed: rng() * 100 });
        } else if (kind === 'live') {
          // панель горит + лужа на полу всегда; настоящий источник — только у избранных
          const panel = new THREE.Mesh(lampGeo, liveMat);
          panel.position.set(lx, WH - 0.05, lz);
          scene.add(panel);
          const pool = new THREE.Mesh(poolGeo, new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
          pool.rotation.x = -Math.PI / 2;
          pool.position.set(lx, 0.02, lz);
          scene.add(pool);
          if (litKeys.has(i + ':' + j)) {
            const pl = new THREE.PointLight(0xffbe5a, 16, 19, 1.8);
            pl.position.set(lx, WH - 0.5, lz);
            scene.add(pl);
          }
        } else {
          // дохлая: тёмная панель, вокруг — тьма
          const panel = new THREE.Mesh(lampGeo, deadMat);
          panel.position.set(lx, WH - 0.05, lz);
          scene.add(panel);
        }
      }
    }
    // фонарь игрока: без него в тёмных зонах слепота — тёплый конус по взгляду
    this.torch = new THREE.SpotLight(0xfff0d0, 70, 36, 0.55, 0.4, 1.3);
    scene.add(this.torch);
    scene.add(this.torch.target);
    // старт — в клетке (0,0), лицо в открытый проход (восток или юг — что прокопано)
    this.px = -S / 2 + 0.5 * CELL;
    this.pz = -S / 2 + 0.5 * CELL;
    this.yaw = !vWall[1][0] ? -Math.PI / 2 : Math.PI;
  }

  /** Для тестов: текущий туман камеры. */
  debugFog(): { near: number; far: number } | null {
    const fog = this.scene.fog as THREE.Fog | null;
    return fog ? { near: Math.round(fog.near * 10) / 10, far: Math.round(fog.far * 10) / 10 } : null;
  }
  /** Для тестов: дверь выхода (бэкрумс) — где стоит. */
  debugDoor(): { x: number; z: number } | null {
    return this.door ? { x: Math.round(this.door.x * 10) / 10, z: Math.round(this.door.z * 10) / 10 } : null;
  }
  /** Для тестов: маяк двери горит прямо сейчас? */
  debugDoorPulse(): boolean { return this.doorPulse; }
  /** Для тестов: принудительный маяк (null — как обычно по времени). */
  debugDoorPulseForce(v: boolean | null): void { this.doorPulseForce = v === null ? null : !!v; }
  /** Для тестов: куда дверь смотрит лицом (сторона коридора). */
  debugDoorFace(): { x: number; z: number } { return { ...this.doorFace }; }
  /** Для тестов: состояние материала двери (маяк = зелёная поверх стен). */
  debugDoorMat(): { color: number; opacity: number; depthTest: boolean; order: number } {
    const m = this.doorMesh?.material as THREE.MeshBasicMaterial | undefined;
    if (!m || !this.doorMesh) return { color: 0, opacity: 0, depthTest: true, order: 0 };
    return { color: (m.color.getHex() as number) >>> 0, opacity: Math.round(m.opacity * 100) / 100, depthTest: m.depthTest, order: this.doorMesh.renderOrder };
  }
  debugMaze(): { n: number; cell: number; segs: number; half: number; seed: number; deads: number } {
    return { n: 50, cell: 6, segs: this.solids.length, half: this.half, seed: this.mapSeed, deads: this.mazeDeads };
  }

  /**
   * СВОЯ КАРТА из редактора: трава, кирпичный периметр, блоки-стены.
   * Пустая карта (без блоков) — просто поле для прогулок.
   */
  private buildCustom(): void {
    const scene = this.scene;
    const c = this.custom;
    const S = c && c.size >= 40 && c.size <= 140 ? c.size : 90;
    this.half = S / 2;
    scene.add(new THREE.AmbientLight(0xffffff, 0.95));
    const sun = new THREE.DirectionalLight(0xfff2dd, 1.1);
    sun.position.set(40, 70, 20);
    scene.add(sun);
    const grass = new THREE.TextureLoader().load(travaUrl);
    grass.colorSpace = THREE.SRGBColorSpace;
    grass.wrapS = grass.wrapT = THREE.MirroredRepeatWrapping;
    grass.repeat.set(S / 4, S / 4);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(S + 10, S + 10),
      new THREE.MeshStandardMaterial({ map: grass, roughness: 1 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    const wallTex = new THREE.TextureLoader().load(brickUrl);
    wallTex.colorSpace = THREE.SRGBColorSpace;
    wallTex.wrapS = wallTex.wrapT = THREE.MirroredRepeatWrapping;
    wallTex.repeat.set(S / 8, 1);
    const wallMat = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.9 });
    const PH = 6;
    const mkPer = (w: number, d: number, x: number, z: number): void => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, PH, d), wallMat);
      m.position.set(x, PH / 2, z);
      scene.add(m);
    };
    mkPer(S + 4, 2, 0, -S / 2 - 1);
    mkPer(S + 4, 2, 0, S / 2 + 1);
    mkPer(2, S + 4, -S / 2 - 1, 0);
    mkPer(2, S + 4, S / 2 + 1, 0);
    // блоки автора карты — тот же фасад, повтор под размер блока
    const cwt0 = new THREE.TextureLoader().load(facadeUrl);
    cwt0.colorSpace = THREE.SRGBColorSpace;
    for (const b of c?.walls ?? []) {
      const bt = cwt0.clone();
      bt.wrapS = bt.wrapT = THREE.MirroredRepeatWrapping;
      bt.repeat.set(Math.max(1, Math.round(b.w / 6)), Math.max(1, Math.round(b.h / 6)));
      bt.needsUpdate = true;
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(b.w, b.h, b.d),
        new THREE.MeshStandardMaterial({ map: bt, roughness: 0.85, color: 0xd8b48f }),
      );
      m.position.set(b.x, b.h / 2, b.z);
      m.castShadow = true; m.receiveShadow = true;
      scene.add(m);
      this.solids.push({ x: b.x, z: b.z, hx: b.w / 2, hz: b.d / 2, h: b.h });
    }
    // спавн: юг карты, если занято — ищем свободное
    const cand: Array<[number, number]> = [[0, S / 2 - 8], [0, 0], [-S / 4, S / 4], [S / 4, S / 4], [0, -S / 2 + 8]];
    for (const [qx, qz] of cand) {
      if (!this.hitSolid(qx, qz, 1.5)) { this.px = qx; this.pz = qz; this.yaw = 0; return; }
    }
    for (let t = 0; t < 30; t++) {
      const qx = (Math.random() * 2 - 1) * (S / 2 - 5);
      const qz = (Math.random() * 2 - 1) * (S / 2 - 5);
      if (!this.hitSolid(qx, qz, 1.5)) { this.px = qx; this.pz = qz; this.yaw = 0; return; }
    }
    this.px = 0; this.pz = S / 2 - 8; this.yaw = 0;
  }

  /** Для тестов: что построили из своей карты. */
  debugCustom(): { walls: number; half: number } {
    return { walls: this.solids.length, half: this.half };
  }

  /** НОВЫЙ ГОРОД 2026-09-06: у каждого объекта своя сгенерированная текстура. */
  private buildCity(): void {
    const scene = this.scene;
    scene.add(new THREE.AmbientLight(0xffffff, 0.95));
    scene.add(new THREE.HemisphereLight(0xbfd9ff, 0x6a7a5a, 0.55));
    const sun = new THREE.DirectionalLight(0xfff3d6, 1.5);
    sun.position.set(-40, 80, -30);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.left = -70; sun.shadow.camera.right = 70;
    sun.shadow.camera.top = 70; sun.shadow.camera.bottom = -70;
    sun.shadow.camera.near = 10; sun.shadow.camera.far = 220;
    sun.shadow.bias = -0.0004;
    scene.add(sun);

    const tex = (url: string, rx: number, ry: number): THREE.Texture => {
      const t = new THREE.TextureLoader().load(url);
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping;
      t.repeat.set(rx, ry);
      t.anisotropy = 4;
      return t;
    };
    // СВОИ ТЕКСТУРЫ: тротуар — база всего города
    const walkT = tex(walkUrl, 30, 30);
    const base = new THREE.Mesh(
      new THREE.PlaneGeometry(ARENA + 20, ARENA + 20),
      new THREE.MeshStandardMaterial({ map: walkT, roughness: 0.95 }),
    );
    base.rotation.x = -Math.PI / 2;
    base.receiveShadow = true;
    scene.add(base);

    // парк: живая трава с фото МТТ (СЗ-квартал)
    const grassT = tex(travaUrl, 10, 10);
    const park = new THREE.Mesh(
      new THREE.PlaneGeometry(36, 36),
      new THREE.MeshStandardMaterial({ map: grassT, roughness: 1 }),
    );
    park.rotation.x = -Math.PI / 2;
    park.position.set(-30, 0.01, -30);
    park.receiveShadow = true;
    scene.add(park);

    // ДОРОГИ: асфальт со своей текстурой + жёлтая разметка по центру
    const roadT = tex(roadUrl, 55, 4);
    const roadMat = new THREE.MeshStandardMaterial({ map: roadT, roughness: 1 });
    for (const [w, d, x, z] of [[ARENA, 7, 0, 0], [7, ARENA, 0, 0]] as Array<[number, number, number, number]>) {
      const r = new THREE.Mesh(new THREE.PlaneGeometry(w, d), roadMat);
      r.rotation.x = -Math.PI / 2;
      r.position.set(x, 0.02, z);
      r.receiveShadow = true;
      scene.add(r);
    }
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xffd23f });
    for (let i = -HALF + 6; i < HALF - 4; i += 6) {
      if (Math.abs(i) < 12) continue; // круг у площади не закрашиваем
      for (const [x, z, w, d] of [[i, 0, 2.4, 0.35], [0, i, 0.35, 2.4]] as Array<[number, number, number, number]>) {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), dashMat);
        m.rotation.x = -Math.PI / 2;
        m.position.set(x, 0.035, z);
        scene.add(m);
      }
    }
    // переходы-зебры у центра
    const zebraMat = new THREE.MeshBasicMaterial({ color: 0xf2f5f7 });
    for (const [x, z, vert] of [[8, 0, false], [-8, 0, false], [0, 8, true], [0, -8, true]] as Array<[number, number, boolean]>) {
      for (let k = -2; k <= 2; k++) {
        const s = new THREE.Mesh(new THREE.PlaneGeometry(vert ? 0.6 : 2.6, vert ? 2.6 : 0.6), zebraMat);
        s.rotation.x = -Math.PI / 2;
        s.position.set(x + (vert ? k * 1.1 : 0), 0.035, z + (vert ? 0 : k * 1.1));
        scene.add(s);
      }
    }

    // ДОМА: первый этаж — витрины магазинов, выше — панелька, сверху — рулонная крыша
    const shopT0 = tex(shopUrl, 3, 1);
    const panelT0 = tex(panelUrl, 2, 2);
    const roofT0 = tex(roofUrl, 2, 2);
    const roofMat0 = new THREE.MeshStandardMaterial({ map: roofT0, roughness: 0.95 });
    const parapMat = new THREE.MeshStandardMaterial({ color: 0x7a6a58, roughness: 0.9 });
    const acMat = new THREE.MeshStandardMaterial({ color: 0xb9c2cc, roughness: 0.6, metalness: 0.3 });
    type B = { x: number; z: number; w: number; d: number; up: number; tint: number; top: 'tank' | 'antenna' | 'garden' | 'ac' | 'flat'; sign: number };
    const homes: B[] = [
      { x: 20, z: -19, w: 12, d: 10, up: 9, tint: 0xf2e2c4, top: 'ac', sign: 0 },
      { x: 39, z: -21, w: 8, d: 8, up: 7, tint: 0xe8d4b0, top: 'tank', sign: 1 },
      { x: 22, z: -39, w: 10, d: 8, up: 11, tint: 0xdfc9a2, top: 'garden', sign: 2 },
      { x: -20, z: 19, w: 12, d: 10, up: 8, tint: 0xf5e6cc, top: 'garden', sign: 3 },
      { x: -39, z: 23, w: 9, d: 9, up: 12, tint: 0xe3cda4, top: 'antenna', sign: 4 },
      { x: 18, z: 41, w: 11, d: 9, up: 9, tint: 0xefdcba, top: 'ac', sign: 5 },
      { x: 41, z: 33, w: 8, d: 8, up: 6, tint: 0xe8d0a8, top: 'tank', sign: 6 },
      { x: -32, z: -32, w: 10, d: 9, up: 8, tint: 0xe9d2ac, top: 'ac', sign: 7 },
      { x: -17, z: -37, w: 8, d: 8, up: 6, tint: 0xf0ddb8, top: 'flat', sign: 0 },
      { x: 36, z: -38, w: 10, d: 9, up: 12, tint: 0xdec39c, top: 'tank', sign: 1 },
      { x: -44, z: -8, w: 8, d: 8, up: 7, tint: 0xe5cba0, top: 'antenna', sign: 2 },
      { x: 8, z: -18, w: 6, d: 5, up: 0, tint: 0xffffff, top: 'flat', sign: 3 },
      { x: -8, z: 18, w: 6, d: 5, up: 0, tint: 0xffffff, top: 'flat', sign: 4 },
      { x: 13, z: -34, w: 6, d: 5, up: 4, tint: 0xefe0c0, top: 'flat', sign: 5 },
    ];
    const signCols = [0xc23b3b, 0x2b6cb0, 0x2f9e44, 0xe8c547, 0x6c5ce7, 0xe07b39, 0x9b59b6, 0x1abc9c];
    for (const b of homes) {
      const shopT = shopT0.clone();
      shopT.repeat.set(Math.max(2, Math.round(b.w / 4)), 1);
      shopT.needsUpdate = true;
      const gnd = new THREE.Mesh(
        new THREE.BoxGeometry(b.w, 3.5, b.d),
        new THREE.MeshStandardMaterial({ map: shopT, roughness: 0.7 }),
      );
      gnd.position.set(b.x, 1.75, b.z);
      gnd.castShadow = true; gnd.receiveShadow = true;
      scene.add(gnd);
      const H = 3.5 + b.up;
      if (b.up > 0) {
        // верхние этажи — панелька, повтор под размер коробки
        const panelT = panelT0.clone();
        panelT.repeat.set(Math.max(1, Math.round(b.w / 8)), Math.max(1, Math.round(b.up / 8)));
        panelT.needsUpdate = true;
        const up = new THREE.Mesh(
          new THREE.BoxGeometry(b.w, b.up, b.d),
          new THREE.MeshStandardMaterial({ map: panelT, roughness: 0.85, color: b.tint }),
        );
        up.position.set(b.x, 3.5 + b.up / 2, b.z);
        up.castShadow = true; up.receiveShadow = true;
        scene.add(up);
        // карниз между витринами и панелькой — здание читается объёмом
        const cor = new THREE.Mesh(new THREE.BoxGeometry(b.w + 0.5, 0.3, b.d + 0.5), parapMat);
        cor.position.set(b.x, 3.6, b.z);
        scene.add(cor);
        // балконы на обе стороны (только у высоких — мелочь жрёт draw calls)
        const nb = b.up >= 7 ? (b.w >= 10 ? 2 : 1) : 0;
        for (const bs of [-1, 1]) {
          for (let k = 0; k < nb; k++) {
            const bx2 = b.x + (nb === 1 ? 0 : (k === 0 ? -b.w / 4 : b.w / 4));
            const bz2 = b.z + bs * (b.d / 2 + 0.45);
            const sl = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.15, 0.9), parapMat);
            sl.position.set(bx2, 3.5 + b.up * 0.55, bz2);
            scene.add(sl);
          }
        }
      }
      const slab = new THREE.Mesh(new THREE.BoxGeometry(b.w + 0.4, 0.35, b.d + 0.4), roofMat0);
      slab.position.set(b.x, H + 0.17, b.z);
      slab.castShadow = true;
      scene.add(slab);
      // парапет по краю крыши
      const ph = 0.55, pt = 0.28;
      for (const [w, d, ox, oz] of [[b.w + 0.4, pt, 0, -(b.d + 0.4) / 2], [b.w + 0.4, pt, 0, (b.d + 0.4) / 2], [pt, b.d + 0.4, -(b.w + 0.4) / 2, 0], [pt, b.d + 0.4, (b.w + 0.4) / 2, 0]] as Array<[number, number, number, number]>) {
        const p = new THREE.Mesh(new THREE.BoxGeometry(w, ph, d), parapMat);
        p.position.set(b.x + ox, H + 0.35 + ph / 2, b.z + oz);
        scene.add(p);
      }
      // вывеска магазина над витринами — у каждого свой цвет
      const sign = new THREE.Mesh(
        new THREE.BoxGeometry(Math.min(b.w - 1.5, 4.5), 1, 0.25),
        new THREE.MeshStandardMaterial({ color: signCols[b.sign % signCols.length], roughness: 0.6 }),
      );
      sign.position.set(b.x, 2.7, b.z + b.d / 2 + 0.15);
      scene.add(sign);
      if (b.top === 'tank') {
        const t = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 2, 10), parapMat);
        t.position.set(b.x + b.w / 4, H + 1.3, b.z);
        t.castShadow = false;
        scene.add(t);
      } else if (b.top === 'antenna') {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 5, 6), parapMat);
        pole.position.set(b.x, H + 2.8, b.z);
        scene.add(pole);
        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff3b3b }));
        tip.position.set(b.x, H + 5.3, b.z);
        scene.add(tip);
      } else if (b.top === 'garden') {
        const gr = new THREE.Mesh(new THREE.CircleGeometry(Math.min(b.w, b.d) / 2 - 0.7, 18), new THREE.MeshStandardMaterial({ map: grassT, roughness: 1 }));
        gr.rotation.x = -Math.PI / 2;
        gr.position.set(b.x, H + 0.37, b.z);
        scene.add(gr);
      } else {
        for (let k = -1; k <= 1; k++) {
          const ac = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.8, 0.9), acMat);
          ac.position.set(b.x + k * 2.4, H + 0.75, b.z + b.d / 4);
          ac.castShadow = false;
          scene.add(ac);
        }
      }
      // козырьки подъездов с двух сторон
      for (const s of [-1, 1]) {
        const cn = new THREE.Mesh(new THREE.BoxGeometry(3, 0.22, 1.4), parapMat);
        cn.position.set(b.x + s * (b.w / 4), 3.6, b.z + (b.d / 2 + 0.6));
        scene.add(cn);
      }
      this.solids.push({ x: b.x, z: b.z, hx: b.w / 2, hz: b.d / 2, h: H + 0.4 });
    }

    // КОРПУС: отдельное крыло сложной формы (Г/П-дома собираются из крыльев).
    const block = (x: number, z: number, w: number, d: number, H: number, si: number): void => {
      const shopT = shopT0.clone();
      shopT.repeat.set(Math.max(2, Math.round(w / 4)), 1);
      shopT.needsUpdate = true;
      const gnd = new THREE.Mesh(
        new THREE.BoxGeometry(w, 3.5, d),
        new THREE.MeshStandardMaterial({ map: shopT, roughness: 0.7 }),
      );
      gnd.position.set(x, 1.75, z);
      gnd.castShadow = true; gnd.receiveShadow = true;
      scene.add(gnd);
      const upH = H - 3.5;
      if (upH > 0) {
        const panelT = panelT0.clone();
        panelT.repeat.set(Math.max(1, Math.round(w / 8)), Math.max(1, Math.round(upH / 8)));
        panelT.needsUpdate = true;
        const up = new THREE.Mesh(
          new THREE.BoxGeometry(w, upH, d),
          new THREE.MeshStandardMaterial({ map: panelT, roughness: 0.85 }),
        );
        up.position.set(x, 3.5 + upH / 2, z);
        up.castShadow = true; up.receiveShadow = true;
        scene.add(up);
      }
      const slab = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 0.35, d + 0.4), roofMat0);
      slab.position.set(x, H + 0.17, z);
      scene.add(slab);
      const ph2 = 0.55, pt2 = 0.28;
      for (const [w2, d2, ox, oz] of [[w + 0.4, pt2, 0, -(d + 0.4) / 2], [w + 0.4, pt2, 0, (d + 0.4) / 2], [pt2, d + 0.4, -(w + 0.4) / 2, 0], [pt2, d + 0.4, (w + 0.4) / 2, 0]] as Array<[number, number, number, number]>) {
        const pp = new THREE.Mesh(new THREE.BoxGeometry(w2, ph2, d2), parapMat);
        pp.position.set(x + ox, H + 0.35 + ph2 / 2, z + oz);
        scene.add(pp);
      }
      const sign = new THREE.Mesh(
        new THREE.BoxGeometry(Math.min(w - 1.5, 4.5), 1, 0.25),
        new THREE.MeshStandardMaterial({ color: signCols[si % signCols.length], roughness: 0.6 }),
      );
      sign.position.set(x, 2.7, z + d / 2 + 0.15);
      scene.add(sign);
      this.solids.push({ x, z, hx: w / 2, hz: d / 2, h: H + 0.4 });
    };
    // ПЕРЕУЛОК ВОСТОЧНЫЙ: два ряда узких домов, между ними lane 2м с фонарями
    block(30, -8, 5, 6, 11, 0);
    block(30, -15, 5, 6, 9, 1);
    block(37, -8, 5, 6, 10, 2);
    block(37, -15, 5, 6, 12, 3);
    const laneGlow = new THREE.MeshBasicMaterial({ color: 0xfff2c4 });
    for (const [alx, alz] of [[33.5, -5], [33.5, -12], [33.5, -19]] as Array<[number, number]>) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.17, 5, 7), parapMat);
      pole.position.set(alx, 2.5, alz);
      scene.add(pole);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 8), laneGlow);
      bulb.position.set(alx, 5.1, alz);
      scene.add(bulb);
      this.solids.push({ x: alx, z: alz, r: 0.2, h: 5 });
    }
    // западный дом + северные киоски
    block(-44, -22, 6, 6, 9, 4);
    block(-8, -46, 5, 4, 6.5, 5);
    block(8, -46, 5, 4, 7.5, 6);
    // Г-ДОМ: два крыла уголком
    block(-8, 31, 6, 10, 12, 7);
    block(-8, 35, 8, 6, 12, 0);
    // П-ДОМ: планка + два крыла, внутри дворик с клумбой
    block(-36, 11, 5, 14, 13, 1);
    block(-32, 6.5, 8, 5, 10, 2);
    block(-32, 15.5, 8, 5, 10, 3);
    const yardBed = new THREE.Mesh(
      new THREE.CircleGeometry(1.6, 20),
      new THREE.MeshStandardMaterial({ color: 0xff5d8f, roughness: 1 }),
    );
    yardBed.rotation.x = -Math.PI / 2;
    yardBed.position.set(-31, 0.03, 11);
    scene.add(yardBed);
    // ЕЩЁ ДОМА: забиваем свободные пятна
    block(6, 32, 7, 7, 10, 1);
    block(-14, -7, 5, 5, 8, 2);
    block(48, -8, 6, 7, 10, 3);
    block(48, -32, 6, 7, 11, 4);
    block(12, 24, 6, 6, 9, 5);
    // ГАЗОНЫ: трава + клумба (визуал, проход свободный)
    const lawn = (lx: number, lz: number, w: number, d: number, bed: number): void => {
      const g = new THREE.Mesh(
        new THREE.PlaneGeometry(w, d),
        new THREE.MeshStandardMaterial({ map: grassT, roughness: 1 }),
      );
      g.rotation.x = -Math.PI / 2;
      g.position.set(lx, 0.012, lz);
      g.receiveShadow = true;
      scene.add(g);
      const b = new THREE.Mesh(
        new THREE.CircleGeometry(1.4, 18),
        new THREE.MeshStandardMaterial({ color: bed, roughness: 1 }),
      );
      b.rotation.x = -Math.PI / 2;
      b.position.set(lx, 0.03, lz);
      scene.add(b);
    };
    lawn(-1, 30, 6, 8, 0xffd23f);
    lawn(2, -28, 8, 6, 0xff6b35);
    lawn(46, 20, 8, 8, 0xc77dff);


    // ПЛОЩАДЬ с фонтаном (ЮВ): брусчатка со своей текстурой
    const plazaT = tex(plazaUrl, 6, 6);
    const plaza = new THREE.Mesh(new THREE.CircleGeometry(10, 30), new THREE.MeshStandardMaterial({ map: plazaT, roughness: 0.9 }));
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.set(27, 0.03, 27);
    plaza.receiveShadow = true;
    scene.add(plaza);
    const rim = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.5, 1.1, 16), new THREE.MeshStandardMaterial({ map: plazaT, roughness: 0.8 }));
    rim.position.set(27, 0.55, 27);
    rim.castShadow = true;
    scene.add(rim);
    const water = new THREE.Mesh(new THREE.CircleGeometry(1.9, 16), new THREE.MeshBasicMaterial({ color: 0x55d4ff }));
    water.rotation.x = -Math.PI / 2;
    water.position.set(27, 1.12, 27);
    scene.add(water);
    const jet = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.3, 2.2, 8), new THREE.MeshBasicMaterial({ color: 0xbdf1ff }));
    jet.position.set(27, 2.1, 27);
    scene.add(jet);
    this.solids.push({ x: 27, z: 27, r: 2.4, h: 1.2 });

    // киоск + остановка у центра
    const kioskT = tex(shopUrl, 2, 1);
    const kiosk = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.8, 2.6), new THREE.MeshStandardMaterial({ map: kioskT, roughness: 0.7 }));
    kiosk.position.set(-7.5, 1.4, -11);
    kiosk.castShadow = true;
    scene.add(kiosk);
    const kRoof = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.25, 3), roofMat0);
    kRoof.position.set(-7.5, 2.9, -11);
    scene.add(kRoof);
    this.solids.push({ x: -7.5, z: -11, hx: 1.7, hz: 1.3, h: 3 });
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x9fd4ff, roughness: 0.1, metalness: 0.4, transparent: true, opacity: 0.55 });
    const shRoof = new THREE.Mesh(new THREE.BoxGeometry(5, 0.25, 2), roofMat0);
    shRoof.position.set(7.5, 2.7, 12);
    scene.add(shRoof);
    for (const ox of [-2.2, 2.2]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.7, 6), parapMat);
      post.position.set(7.5 + ox, 1.35, 12);
      scene.add(post);
    }
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.6), glassMat);
    glass.position.set(7.5, 1.6, 12.9);
    glass.rotation.y = Math.PI;
    scene.add(glass);
    this.solids.push({ x: 7.5, z: 12, hx: 2.5, hz: 0.3, h: 2.7 });
    // вторая остановка — на западной стороне
    const shRoof2 = new THREE.Mesh(new THREE.BoxGeometry(5, 0.25, 2), roofMat0);
    shRoof2.position.set(-7.5, 2.7, 24);
    scene.add(shRoof2);
    for (const ox of [-2.2, 2.2]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 2.7, 6), parapMat);
      post.position.set(-7.5 + ox, 1.35, 24);
      scene.add(post);
    }
    const glass2 = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.6), glassMat);
    glass2.position.set(-7.5, 1.6, 24.9);
    scene.add(glass2);
    this.solids.push({ x: -7.5, z: 24, hx: 2.5, hz: 0.3, h: 2.7 });


    // деревьев больше нет — вместо них плотная инфраструктура: рынок и урны
    const stallWood = new THREE.MeshStandardMaterial({ color: 0x8a5a2e, roughness: 0.9 });
    const stallCols = [0xc23b3b, 0xe8e2d4, 0x2b6cb0, 0xe8e2d4];
    [-25, -21.5, -18, -14.5].forEach((sx, i) => {
      if (this.hitSolid(sx, -24, 1.6)) return;
      const box = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.1, 2), stallWood);
      box.position.set(sx, 0.55, -24);
      box.castShadow = false;
      scene.add(box);
      const awn = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.15, 2.4),
        new THREE.MeshStandardMaterial({ color: stallCols[i % stallCols.length], roughness: 0.8 }),
      );
      awn.position.set(sx, 2.2, -24);
      awn.castShadow = false;
      scene.add(awn);
      for (const ox of [-1.2, 1.2]) {
        for (const oz of [-1, 1]) {
          const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 6), parapMat);
          pole.position.set(sx + ox, 1.1, -24 + oz);
          scene.add(pole);
        }
      }
      this.solids.push({ x: sx, z: -24, hx: 1.25, hz: 1, h: 1.1 });
    });
    const binMat = new THREE.MeshStandardMaterial({ color: 0x3d5a3d, roughness: 0.8, metalness: 0.3 });
    for (const [ux, uz] of [[6, 6], [-6, 6], [6, -6], [-6, -6], [12, 8], [-12, -8], [30, 20], [-30, -20]] as Array<[number, number]>) {
      if (this.hitSolid(ux, uz, 0.7)) continue;
      const bin = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.35, 1, 10), binMat);
      bin.position.set(ux, 0.5, uz);
      bin.castShadow = false;
      scene.add(bin);
      this.solids.push({ x: ux, z: uz, r: 0.4, h: 1 });
    }
    // детская площадка в парке: две стойки + перекладина + качель
    const playMat = new THREE.MeshStandardMaterial({ color: 0xd84a4a, roughness: 0.7 });
    for (const ox of [-2, 2]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 3, 6), playMat);
      leg.position.set(-22 + ox, 1.5, -38);
      scene.add(leg);
    }
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 4.4, 6), playMat);
    bar.rotation.z = Math.PI / 2;
    bar.position.set(-22, 3, -38);
    scene.add(bar);

    // фонари вдоль проспектов
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x2b3444, roughness: 0.7 });
    const glowMat = new THREE.MeshBasicMaterial({ color: 0xfff2c4 });
    for (let i = -42; i <= 42; i += 14) {
      for (const [lx, lz] of [[-5.6, i], [5.6, i + 7], [i, -5.6], [i + 7, 5.6]] as Array<[number, number]>) {
        if (this.hitSolid(lx, lz, 0.9)) continue;
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.17, 6, 7), poleMat);
        pole.position.set(lx, 3, lz);
        pole.castShadow = true;
        scene.add(pole);
        const arm = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 0.12), poleMat);
        arm.position.set(lx + (Math.abs(lx) > 5 ? (lx > 0 ? -0.5 : 0.5) : 0), 5.9, lz);
        scene.add(arm);
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.26, 8, 8), glowMat);
        bulb.position.set(lx + (Math.abs(lx) > 5 ? (lx > 0 ? -1 : 1) : 0), 5.75, lz);
        scene.add(bulb);
        this.solids.push({ x: lx, z: lz, r: 0.2, h: 6 });
      }
    }
    // день: угловых прожекторов нет — хватает солнца и полусферы (FPS дороже)

    // парковка (ЮЗ): тёмный асфальт + разметка + 6 цветных машин
    const parkT = tex(roadUrl, 6, 3);
    const lot = new THREE.Mesh(new THREE.PlaneGeometry(22, 11), new THREE.MeshStandardMaterial({ map: parkT, roughness: 1 }));
    lot.rotation.x = -Math.PI / 2;
    lot.position.set(-28, 0.025, 40);
    lot.receiveShadow = true;
    scene.add(lot);
    const lineMat = new THREE.MeshBasicMaterial({ color: 0xe8edf2 });
    for (let k = 0; k <= 6; k++) {
      const ln = new THREE.Mesh(new THREE.PlaneGeometry(0.25, 10), lineMat);
      ln.rotation.x = -Math.PI / 2;
      ln.position.set(-38 + k * 3.3, 0.04, 40);
      scene.add(ln);
    }
    const carCols = [0xc23b3b, 0x2b6cb0, 0x2f9e44, 0xe8c547, 0x6c5ce7, 0x222831];
    const winMat = new THREE.MeshStandardMaterial({ color: 0x18242f, roughness: 0.2, metalness: 0.5 });
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111318, roughness: 1 });
    carCols.forEach((cc, i) => {
      const cx = -36.3 + i * 3.3, cz = 40;
      if (this.hitSolid(cx, cz, 1.6)) return;
      const body = new THREE.Mesh(new THREE.BoxGeometry(2, 0.85, 4.2), new THREE.MeshStandardMaterial({ color: cc, roughness: 0.35, metalness: 0.4 }));
      body.position.set(cx, 0.85, cz);
      body.castShadow = true;
      scene.add(body);
      const cab = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.7, 2), winMat);
      cab.position.set(cx, 1.55, cz - 0.2);
      scene.add(cab);
      for (const [ox, oz] of [[-0.95, 1.4], [0.95, 1.4], [-0.95, -1.4], [0.95, -1.4]] as Array<[number, number]>) {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.3, 10), wheelMat);
        w.rotation.z = Math.PI / 2;
        w.position.set(cx + ox, 0.38, cz + oz);
        scene.add(w);
      }
      this.solids.push({ x: cx, z: cz, hx: 1, hz: 2.1, h: 1.9 });
    });
    // вторая парковка (СВ): тот же асфальт, 4 машины
    const lot2 = new THREE.Mesh(new THREE.PlaneGeometry(16, 8), new THREE.MeshStandardMaterial({ map: parkT, roughness: 1 }));
    lot2.rotation.x = -Math.PI / 2;
    lot2.position.set(38, 0.025, 8);
    lot2.receiveShadow = true;
    scene.add(lot2);
    [0xd8d8d8, 0x8e44ad, 0x16a085, 0xd35400].forEach((cc, i) => {
      const cx = 33.5 + i * 3, cz = 8;
      if (this.hitSolid(cx, cz, 1.6)) return;
      const body = new THREE.Mesh(new THREE.BoxGeometry(2, 0.85, 4.2), new THREE.MeshStandardMaterial({ color: cc, roughness: 0.35, metalness: 0.4 }));
      body.position.set(cx, 0.85, cz);
      body.castShadow = true;
      scene.add(body);
      const cab = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.7, 2), winMat);
      cab.position.set(cx, 1.55, cz - 0.2);
      scene.add(cab);
      for (const [ox, oz] of [[-0.95, 1.4], [0.95, 1.4], [-0.95, -1.4], [0.95, -1.4]] as Array<[number, number]>) {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.3, 10), wheelMat);
        w.rotation.z = Math.PI / 2;
        w.position.set(cx + ox, 0.38, cz + oz);
        scene.add(w);
      }
      this.solids.push({ x: cx, z: cz, hx: 1, hz: 2.1, h: 1.9 });
    });

    // скамейки вокруг площади и в парке
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x8a5a2e, roughness: 0.9 });
    const benchAt = (bx: number, bz: number, ry: number): void => {
      if (this.hitSolid(bx, bz, 0.9)) return;
      const g = new THREE.Group();
      const seat = new THREE.Mesh(new THREE.BoxGeometry(2, 0.12, 0.6), woodMat);
      seat.position.y = 0.55;
      g.add(seat);
      const back = new THREE.Mesh(new THREE.BoxGeometry(2, 0.5, 0.1), woodMat);
      back.position.set(0, 0.95, -0.28);
      g.add(back);
      for (const ox of [-0.8, 0.8]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.5), poleMat);
        leg.position.set(ox, 0.27, 0);
        g.add(leg);
      }
      g.position.set(bx, 0, bz);
      g.rotation.y = ry;
      scene.add(g);
      this.solids.push({ x: bx, z: bz, hx: 1, hz: 0.4, h: 1 });
    };
    for (let a = 0; a < 6; a++) {
      const an = (a / 6) * Math.PI * 2;
      benchAt(27 + Math.cos(an) * 12.5, 27 + Math.sin(an) * 12.5, -an + Math.PI / 2);
    }
    benchAt(-24, -22, 0.4);
    benchAt(-36, -30, -0.5);
    benchAt(14, 30, 1.2);

    // клумбы-цветники
    const bedCols = [0xff5d8f, 0xffd23f, 0xff6b35, 0xc77dff];
    [[16, 16], [-14, -20], [36, 20], [-30, 32]].forEach(([fx, fz], i) => {
      if (this.hitSolid(fx, fz, 1.8)) return;
      const bed = new THREE.Mesh(new THREE.CircleGeometry(1.6, 20), new THREE.MeshStandardMaterial({ color: bedCols[i % bedCols.length], roughness: 1 }));
      bed.rotation.x = -Math.PI / 2;
      bed.position.set(fx, 0.03, fz);
      scene.add(bed);
    });

    // стройка у северного дома: оранжевый забор с текстурой МТТ + хитбоксы
    const fenceT = tex(fenceUrl, 1, 1);
    const fenceMat = new THREE.MeshStandardMaterial({ map: fenceT, roughness: 0.9 });
    for (let k = -2; k <= 2; k++) {
      const fx = 22 + k * 2.5;
      const f = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, 0.15), fenceMat);
      f.position.set(fx, 0.8, -32.5);
      f.castShadow = false;
      scene.add(f);
      this.solids.push({ x: fx, z: -32.5, hx: 1.2, hz: 0.15, h: 1.6 });
    }
    // зелёный забор вдоль западной стройки — та же текстура, свой оттенок
    const fenceGreen = new THREE.MeshStandardMaterial({ map: fenceT, color: 0x51c46b, roughness: 0.9 });
    for (let k = 0; k < 8; k++) {
      const gz = -30 + k * 2.5;
      const g = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.6, 2.4), fenceGreen);
      g.position.set(-40, 0.8, gz);
      g.castShadow = false;
      scene.add(g);
      this.solids.push({ x: -40, z: gz, hx: 0.15, hz: 1.2, h: 1.6 });
    }
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

    // билборды у площади
    const bbT = new THREE.TextureLoader().load(house2Url);
    bbT.colorSpace = THREE.SRGBColorSpace;
    for (const [bx, bz, ry] of [[12, 20, Math.PI], [-12, -20, 0]] as Array<[number, number, number]>) {
      const legs = new THREE.Mesh(new THREE.BoxGeometry(0.4, 6, 0.4), poleMat);
      legs.position.set(bx, 3, bz);
      scene.add(legs);
      const board = new THREE.Mesh(new THREE.PlaneGeometry(9, 5), new THREE.MeshBasicMaterial({ map: bbT }));
      board.position.set(bx, 8.5, bz);
      board.rotation.y = ry;
      scene.add(board);
      this.solids.push({ x: bx, z: bz, hx: 0.2, hz: 0.2, h: 6 });
    }

    // край карты: граффити-стена целиком — 5 повторов, ничего не режем
    const wallT = tex(edgeUrl, 5, 1);
    const wallMat = new THREE.MeshStandardMaterial({ map: wallT, roughness: 0.85 });
    const wallGeoH = new THREE.BoxGeometry(ARENA + 8, 14, 2);
    const wallGeoV = new THREE.BoxGeometry(2, 14, ARENA + 8);
    for (const [x, z, g] of [[0, -HALF - 1, wallGeoH], [0, HALF + 1, wallGeoH]] as Array<[number, number, THREE.BufferGeometry]>) {
      const m = new THREE.Mesh(g, wallMat);
      m.position.set(x, 7, z);
      scene.add(m);
    }
    for (const [x, z, g] of [[-HALF - 1, 0, wallGeoV], [HALF + 1, 0, wallGeoV]] as Array<[number, number, THREE.BufferGeometry]>) {
      const m = new THREE.Mesh(g, wallMat);
      m.position.set(x, 7, z);
      scene.add(m);
    }
  }

  /** 🎲 СЛУЧАЙНАЯ КАРТА: дикий ландшафт — холмы-террасы, скалы, озеро, руины. Новый каждый запуск. */
  private buildRandom(): void {
    const scene = this.scene;
    scene.add(new THREE.AmbientLight(0xffffff, 0.95));
    scene.add(new THREE.HemisphereLight(0xbfd9ff, 0x6a7a5a, 0.55));
    const sun = new THREE.DirectionalLight(0xfff3d6, 1.5);
    sun.position.set(-40, 80, -30);
    sun.castShadow = true;
    sun.shadow.mapSize.width = 1024;
    sun.shadow.mapSize.height = 1024;
    sun.shadow.camera.left = -70; sun.shadow.camera.right = 70;
    sun.shadow.camera.top = 70; sun.shadow.camera.bottom = -70;
    sun.shadow.camera.near = 10; sun.shadow.camera.far = 220;
    sun.shadow.bias = -0.0004;
    scene.add(sun);

    const R = (a: number, b: number): number => a + Math.random() * (b - a);
    const tex = (url: string, rx: number, ry: number): THREE.Texture => {
      const t = new THREE.TextureLoader().load(url);
      t.colorSpace = THREE.SRGBColorSpace;
      t.wrapS = t.wrapT = THREE.MirroredRepeatWrapping;
      t.repeat.set(rx, ry);
      t.anisotropy = 4;
      return t;
    };
    // земля — трава МТТ во всё поле
    const grassT = tex(travaUrl, 26, 26);
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(ARENA + 20, ARENA + 20),
      new THREE.MeshStandardMaterial({ map: grassT, roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    // песчаные проплешины (визуал, без хитбоксов)
    const sandT = tex(walkUrl, 3, 3);
    const sandMat = new THREE.MeshStandardMaterial({ map: sandT, color: 0xd8c49a, roughness: 1 });
    for (let i = 0; i < 4; i++) {
      const sx = R(-40, 40), sz = R(-40, 40);
      if (Math.hypot(sx, sz) < 12) continue;
      const patch = new THREE.Mesh(new THREE.CircleGeometry(R(3, 6), 18), sandMat);
      patch.rotation.x = -Math.PI / 2;
      patch.position.set(sx, 0.015, sz);
      scene.add(patch);
    }

    const rockMat = new THREE.MeshStandardMaterial({ color: 0x8a7a68, roughness: 1 });
    const darkRock = new THREE.MeshStandardMaterial({ color: 0x6b6259, roughness: 1 });
    // ХОЛМЫ-ТЕРРАСЫ: уступы по 1м — перешагиваем автоматом, врозь на 20м
    const mesas: Array<{ x: number; z: number }> = [];
    for (let t = 0; t < 60 && mesas.length < 6; t++) {
      const cx = R(-44, 44), cz = R(-44, 44);
      if (Math.hypot(cx, cz) < 14) continue;
      if (mesas.some((m) => Math.hypot(m.x - cx, m.z - cz) < 20)) continue;
      const B = R(4.5, 7);
      const L = B > 6.2 ? 4 : 3;
      for (let k = 0; k < L; k++) {
        const s = B - 1.7 * k;
        const lvl = new THREE.Mesh(new THREE.BoxGeometry(2 * s, 1, 2 * s), rockMat);
        lvl.position.set(cx, k + 0.5, cz);
        lvl.castShadow = true; lvl.receiveShadow = true;
        scene.add(lvl);
        this.solids.push({ x: cx, z: cz, hx: s, hz: s, h: k + 1 });
      }
      // травяная шапка на вершине
      const sTop = B - 1.7 * (L - 1);
      const cap = new THREE.Mesh(
        new THREE.BoxGeometry(2 * sTop + 0.15, 0.18, 2 * sTop + 0.15),
        new THREE.MeshStandardMaterial({ map: grassT, roughness: 1 }),
      );
      cap.position.set(cx, L + 0.09, cz);
      scene.add(cap);
      mesas.push({ x: cx, z: cz });
    }
    // СКАЛЫ: серые глыбы-цилиндры (вращение не ломает круглый хитбокс)
    for (let t = 0; t < 40; t++) {
      const rx = R(-48, 48), rz = R(-48, 48);
      const rr = R(0.7, 1.5), rh = R(1.5, 3.2);
      if (Math.hypot(rx, rz) < 12) continue;
      if (this.hitSolid(rx, rz, rr + 1.2)) continue;
      const rock = new THREE.Mesh(new THREE.CylinderGeometry(rr, rr * 1.25, rh, 7), darkRock);
      rock.position.set(rx, rh / 2, rz);
      rock.rotation.y = Math.random() * Math.PI;
      rock.castShadow = true;
      scene.add(rock);
      this.solids.push({ x: rx, z: rz, r: rr, h: rh });
    }
    // ОЗЕРО: каменное кольцо + вода (мелко — проходим вброд)
    for (let t = 0; t < 30; t++) {
      const lx = R(-35, 35), lz = R(-35, 35);
      if (Math.hypot(lx, lz) < 14) continue;
      if (this.hitSolid(lx, lz, 9)) continue;
      for (let k = 0; k < 10; k++) {
        const an = (k / 10) * Math.PI * 2;
        const bx = lx + Math.cos(an) * 7.5, bz = lz + Math.sin(an) * 7.5;
        const stone = new THREE.Mesh(new THREE.BoxGeometry(2.2, R(1.2, 1.8), 2.2), darkRock);
        stone.position.set(bx, 0.7, bz);
        stone.castShadow = true;
        scene.add(stone);
        this.solids.push({ x: bx, z: bz, hx: 1.1, hz: 1.1, h: 1.6 });
      }
      const water = new THREE.Mesh(new THREE.CircleGeometry(6.6, 24), new THREE.MeshBasicMaterial({ color: 0x55d4ff }));
      water.rotation.x = -Math.PI / 2;
      water.position.set(lx, 0.03, lz);
      scene.add(water);
      break;
    }
    // РУИНЫ: битые кирпичные стены (строго по осям — хитбокс честный)
    const ruinT = tex(brickUrl, 3, 1);
    const ruinMat = new THREE.MeshStandardMaterial({ map: ruinT, roughness: 0.95 });
    for (let t = 0; t < 30; t++) {
      const wx = R(-44, 44), wz = R(-44, 44);
      if (Math.hypot(wx, wz) < 12) continue;
      const len = R(4, 7), wh = R(1.6, 2.6);
      const alongX = Math.random() < 0.5;
      if (this.hitSolid(wx, wz, len / 2 + 1)) continue;
      const wall = new THREE.Mesh(
        alongX ? new THREE.BoxGeometry(len, wh, 0.7) : new THREE.BoxGeometry(0.7, wh, len),
        ruinMat,
      );
      wall.position.set(wx, wh / 2, wz);
      wall.castShadow = true; wall.receiveShadow = true;
      scene.add(wall);
      this.solids.push(alongX
        ? { x: wx, z: wz, hx: len / 2, hz: 0.35, h: wh }
        : { x: wx, z: wz, hx: 0.35, hz: len / 2, h: wh });
      if (this.solids.length > 90) break;
    }
    // ХУТОРА: 3 домика витрина+панелька (поровну, врозь от холмов)
    const hutShop = tex(shopUrl, 2, 1);
    const hutPanel = tex(panelUrl, 1, 1);
    const hutRoof = tex(roofUrl, 2, 2);
    const hutRoofMat = new THREE.MeshStandardMaterial({ map: hutRoof, roughness: 0.95 });
    let huts = 0;
    for (let t = 0; t < 50 && huts < 3; t++) {
      const hx = R(-42, 42), hz = R(-42, 42);
      if (Math.hypot(hx, hz) < 13) continue;
      if (mesas.some((m) => Math.hypot(m.x - hx, m.z - hz) < 14)) continue;
      const w = R(5, 7), d = R(5, 7), H = R(6, 9);
      if (this.hitSolid(hx, hz, Math.max(w, d) / 2 + 2)) continue;
      const gnd = new THREE.Mesh(new THREE.BoxGeometry(w, 3.5, d), new THREE.MeshStandardMaterial({ map: hutShop, roughness: 0.7 }));
      gnd.position.set(hx, 1.75, hz);
      gnd.castShadow = true; gnd.receiveShadow = true;
      scene.add(gnd);
      const up = new THREE.Mesh(new THREE.BoxGeometry(w, H - 3.5, d), new THREE.MeshStandardMaterial({ map: hutPanel, roughness: 0.85 }));
      up.position.set(hx, 3.5 + (H - 3.5) / 2, hz);
      up.castShadow = true;
      scene.add(up);
      const slab = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 0.35, d + 0.4), hutRoofMat);
      slab.position.set(hx, H + 0.17, hz);
      scene.add(slab);
      this.solids.push({ x: hx, z: hz, hx: w / 2, hz: d / 2, h: H + 0.4 });
      huts++;
    }
    // ящики и заборы вразброс
    const crateMat = new THREE.MeshStandardMaterial({ color: 0x8a5a2b, roughness: 0.9 });
    for (let t = 0; t < 30; t++) {
      const cx = R(-46, 46), cz = R(-46, 46);
      if (Math.hypot(cx, cz) < 11) continue;
      if (this.hitSolid(cx, cz, 1.8)) continue;
      const c = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.2, 2.2), crateMat);
      c.position.set(cx, 1.1, cz);
      c.castShadow = true; c.receiveShadow = true;
      scene.add(c);
      this.solids.push({ x: cx, z: cz, hx: 1.1, hz: 1.1, h: 2.2 });
      if (this.solids.length > 110) break;
    }
    const fenceT = tex(fenceUrl, 1, 1);
    const fenceMat = new THREE.MeshStandardMaterial({ map: fenceT, roughness: 0.9 });
    for (let t = 0; t < 20; t++) {
      const fx = R(-44, 44), fz = R(-44, 44);
      if (Math.hypot(fx, fz) < 11) continue;
      if (this.hitSolid(fx, fz, 2)) continue;
      const alongX = Math.random() < 0.5;
      const f = new THREE.Mesh(new THREE.BoxGeometry(alongX ? 2.4 : 0.15, 1.6, alongX ? 0.15 : 2.4), fenceMat);
      f.position.set(fx, 0.8, fz);
      scene.add(f);
      this.solids.push(alongX
        ? { x: fx, z: fz, hx: 1.2, hz: 0.15, h: 1.6 }
        : { x: fx, z: fz, hx: 0.15, hz: 1.2, h: 1.6 });
      if (this.solids.length > 120) break;
    }
    // край дикого поля — те же граффити-стены целиком
    const wallT = tex(edgeUrl, 5, 1);
    const wallMat = new THREE.MeshStandardMaterial({ map: wallT, roughness: 0.85 });
    const wallGeoH = new THREE.BoxGeometry(ARENA + 8, 14, 2);
    const wallGeoV = new THREE.BoxGeometry(2, 14, ARENA + 8);
    for (const [x, z, g] of [[0, -HALF - 1, wallGeoH], [0, HALF + 1, wallGeoH]] as Array<[number, number, THREE.BufferGeometry]>) {
      const m = new THREE.Mesh(g, wallMat);
      m.position.set(x, 7, z);
      scene.add(m);
    }
    for (const [x, z, g] of [[-HALF - 1, 0, wallGeoV], [HALF + 1, 0, wallGeoV]] as Array<[number, number, THREE.BufferGeometry]>) {
      const m = new THREE.Mesh(g, wallMat);
      m.position.set(x, 7, z);
      scene.add(m);
    }
    // спавн: юг поля, если занято — ищем свободное
    const cand: Array<[number, number]> = [[0, 22], [0, 0], [-15, 15], [15, 15], [0, -22]];
    for (const [qx, qz] of cand) {
      if (!this.hitSolid(qx, qz, 1.5)) { this.px = qx; this.pz = qz; this.yaw = 0; return; }
    }
    for (let t = 0; t < 30; t++) {
      const qx = R(-45, 45), qz = R(-45, 45);
      if (!this.hitSolid(qx, qz, 1.5)) { this.px = qx; this.pz = qz; this.yaw = 0; return; }
    }
    this.px = 0; this.pz = 22; this.yaw = 0;
  }

  private buildWorld(): void {
    // Szeged — киношный свет (ACES filmic: не выгорает, цвета глубже),
    // остальные карты — как были, без изменений.
    this.renderer.toneMapping = this.map === 'szeged'
      ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping;
    // ACES затемняет середину — компенсируем экспозицией (только Szeged)
    this.renderer.toneMappingExposure = this.map === 'szeged' ? 1.35 : 1.0;
    if (this.map === 'duel') { this.buildDuel(); return; }
    if (this.map === 'backrooms' || this.map === 'endless') { this.buildBackrooms(); return; }
    if (this.map === 'custom') { this.buildCustom(); return; }
    if (this.map === 'random') { this.buildRandom(); return; }
    if (this.map === 'szeged') { this.buildSzeged(); return; }
    // arena, pvp, invasion — город
    this.buildCity(); return;
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

    // край карты с фото МТТ: текстура целиком — 5 целых повторов по стене, ничего не обрезано
    const wallTex = new THREE.TextureLoader().load(edgeUrl);
    wallTex.colorSpace = THREE.SRGBColorSpace;
    wallTex.wrapS = wallTex.wrapT = THREE.MirroredRepeatWrapping;
    wallTex.repeat.set(5, 1);
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

    // дома: фасад с фото МТТ (по мотивам «Дом 1») — у каждого свой повтор под размер
    const winTex = Game.makeWindowsTex();
    const facadeTex = new THREE.TextureLoader().load(facadeUrl);
    facadeTex.colorSpace = THREE.SRGBColorSpace;
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
      // фасад: 3 этажа на тайл — повтор по ширине и высоте коробки
      const wt = facadeTex.clone();
      wt.wrapS = wt.wrapT = THREE.MirroredRepeatWrapping;
      wt.repeat.set(Math.max(1, Math.round(cfg.w / 9)), Math.max(1, Math.round(cfg.h / 9)));
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

    // ===== полноценный город: деревья, фонари, машины, скамейки =====
    // точки подбираем свободно: занято — пропускаем (хитбоксы домов/ящиков святы)
    const free = (x: number, z: number, r: number): boolean => !this.hitSolid(x, z, r);
    // деревья: ствол + две кроны (детерминированно, в кварталах между дорогами)
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5a3d22, roughness: 1 });
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x2f7a3d, roughness: 1 });
    const leafMat2 = new THREE.MeshStandardMaterial({ color: 0x3fa34d, roughness: 1 });
    const treeSpots: Array<[number, number]> = [
      [6, 6], [-6, 6], [6, -6], [-6, -6], [18, 16], [-18, -16], [18, -16], [-18, 16],
      [30, 6], [-30, -6], [8, 40], [-8, -40], [40, -8], [-40, 8], [28, -34], [-28, 34],
    ];
    let ti = 0;
    for (const [tx, tz] of treeSpots) {
      if (!free(tx, tz, 1)) continue;
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.35, 2.4, 7), trunkMat);
      trunk.position.set(tx, 1.2, tz);
      trunk.castShadow = true;
      scene.add(trunk);
      const lm = ti % 2 === 0 ? leafMat : leafMat2;
      const c1 = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.6, 8), lm);
      c1.position.set(tx, 3.4, tz);
      c1.castShadow = true;
      scene.add(c1);
      const c2 = new THREE.Mesh(new THREE.ConeGeometry(1.1, 1.8, 8), lm);
      c2.position.set(tx, 4.8, tz);
      scene.add(c2);
      this.solids.push({ x: tx, z: tz, r: 0.3, h: 4 });
      ti++;
    }
    // уличные фонари вдоль дорог (лампа светится, без источников — день)
    const poleMat = new THREE.MeshStandardMaterial({ color: 0x2b3444, roughness: 0.7 });
    const lampGlow = new THREE.MeshBasicMaterial({ color: 0xfff2c4 });
    const lampSpots: Array<[number, number]> = [
      [-30, -36], [-8, -36], [14, -36], [36, -36], [-30, 36], [-8, 36], [14, 36], [36, 36],
      [-36, -30], [-36, -8], [-36, 14], [-36, 36], [36, -30], [36, -8], [36, 14], [36, 36],
    ];
    for (const [lx, lz] of lampSpots) {
      if (!free(lx, lz, 0.8)) continue;
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 6, 7), poleMat);
      pole.position.set(lx, 3, lz);
      pole.castShadow = true;
      scene.add(pole);
      const arm = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.12, 0.12), poleMat);
      arm.position.set(lx + 0.6, 5.9, lz);
      scene.add(arm);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), lampGlow);
      lamp.position.set(lx + 1.2, 5.7, lz);
      scene.add(lamp);
      this.solids.push({ x: lx, z: lz, r: 0.2, h: 6 });
    }
    // припаркованные машины: кузов + кабина (стоят вдоль дорог, объезжай)
    const carCols = [0xc0392b, 0x2471a3, 0xf39c12, 0x7d3c98, 0x1abc9c, 0x7f8c8d];
    const carSpots: Array<[number, number, number]> = [
      [20, -30.5, 0], [-16, -30.5, 0], [-38, 13.5, 1], [38, -13.5, 1], [8, 35.5, 0], [-6, -35.5, 0],
    ];
    carCols.forEach((cc, ci) => {
      const spot = carSpots[ci % carSpots.length];
      const [ax, az, vert] = spot;
      if (!free(ax, az, 2.6)) return;
      const cm = new THREE.MeshStandardMaterial({ color: cc, roughness: 0.4 });
      const glass = new THREE.MeshStandardMaterial({ color: 0x1a2530, roughness: 0.2 });
      const w = vert ? 1.8 : 4.2, d = vert ? 4.2 : 1.8;
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, 0.9, d), cm);
      body.position.set(ax, 0.65, az);
      body.castShadow = true; body.receiveShadow = true;
      scene.add(body);
      const cab = new THREE.Mesh(new THREE.BoxGeometry(vert ? 1.6 : 2.2, 0.7, vert ? 2.2 : 1.6), glass);
      cab.position.set(ax, 1.4, az);
      cab.castShadow = true;
      scene.add(cab);
      this.solids.push({ x: ax, z: az, hx: w / 2, hz: d / 2, h: 1.8 });
    });
    // скамейки у площади и в сквере (низкие — декор, проход свободный)
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x6e4a26, roughness: 0.9 });
    for (const [sx, sz, ry] of [[11, 5, 0.5], [-11, -5, 0.5], [5, -11, -0.5], [-5, 11, -0.5], [19, 7, 0], [-19, -7, 0]] as Array<[number, number, number]>) {
      if (!free(sx, sz, 1.2)) continue;
      const seat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.15, 0.6), benchMat);
      seat.position.set(sx, 0.55, sz);
      seat.rotation.y = ry;
      seat.castShadow = true;
      scene.add(seat);
      for (const e of [-0.9, 0.9]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.55, 0.5), poleMat);
        leg.position.set(sx + e * Math.cos(ry), 0.27, sz - e * Math.sin(ry));
        scene.add(leg);
      }
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
    // endless: волн нет вообще, только сталкеры через spawnStalkers()
    if (this.map === 'endless') return;
    // Бэкрумс: обычных нет — только бессмертные сталкеры (пак растёт с волной)
    if (this.map === 'backrooms') {
      this.spawnBackroomsPack();
      return;
    }
    // Нашествие: орда скалолазов — в разы гуще обычной (до 40 рыл)
    if (this.map === 'invasion') {
      const n = Math.min(8 + this.wave * 3, 40);
      if (this.wave % 5 === 0) {
        this.spawnEnemy('boss');
        for (let i = 0; i < 10; i++) this.spawnClimber(i % 4 === 0 ? 'fly' : 'walk');
        return;
      }
      const flyers = Math.floor(n * 0.2);
      for (let i = 0; i < n; i++) {
        const kind = i < flyers ? 'fly' : 'walk';
        if (kind === 'fly') this.spawnEnemy('fly');
        else this.spawnClimber('walk');
      }
      return;
    }
    const n = Math.min(4 + this.wave, 10);
    // каждая 5-я волна — БОСС-гопник + свита поменьше
    if (this.wave % 5 === 0) {
      this.spawnEnemy('boss');
      const flyers = this.wave >= 2 ? Math.floor((n - 2) * 0.3) : 0;
      for (let i = 0; i < n - 2; i++) this.spawnEnemy(i < flyers ? 'fly' : 'walk');
      return;
    }
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

  private bossTexCache: THREE.Texture | null = null;

  /** Гопник с пивом: босс каждой 5-й волны. */
  private bossTexture(): THREE.Texture {
    if (!this.bossTexCache) {
      const t = new THREE.TextureLoader().load(bossUrl);
      t.colorSpace = THREE.SRGBColorSpace;
      this.bossTexCache = t;
    }
    return this.bossTexCache;
  }

  debugSpawn(kind: 'walk' | 'fly' | 'boss'): number {
    this.spawnEnemy(kind);
    return this.debugFlyers();
  }

  debugBoss(): number {
    return this.enemies.filter((e) => !e.dead && e.kind === 'boss').length;
  }

  /** Скалолаз Нашествия: обычный спавн + лазание по стенам. */
  private spawnClimber(kind: 'walk' | 'fly'): void {
    const before = this.enemies.length;
    this.spawnEnemy(kind);
    if (this.enemies.length > before) {
      const e = this.enemies[this.enemies.length - 1]!;
      e.climb = true;
      if (kind === 'walk') e.speed *= 1.15;
    }
  }

  private stalkersOn = false;
  /** Текстура жути МТТ: высокий красно-чёрный сталкер (тело только бессмертным). */
  private stalkerTexCache: THREE.Texture | null = null;
  private stalkerTexture(): THREE.Texture {
    if (!this.stalkerTexCache) {
      const t = new THREE.TextureLoader().load(stalkerUrl);
      t.colorSpace = THREE.SRGBColorSpace;
      this.stalkerTexCache = t;
    }
    return this.stalkerTexCache;
  }

  /** Только вид жути (тело+масштаб+прячем бар): для сетевых кукол-сталкеров. */
  private toStalkerLook(e: Enemy): void {
    e.body.material.map = this.stalkerTexture();
    e.body.material.needsUpdate = true;
    e.body.scale.set(2.2, 2.9, 1);
    this.updateHpBar(e);
  }

  /** Превратить моба в сталкера: бессмертие + скорость + тело жути. */
  private toStalker(e: Enemy): void {
    e.god = true;
    e.hp = 9999; e.maxhp = 9999;
    e.speed = 7.5;
    e.hitCd = 0;
    e.repathT = Math.min(e.repathT, 0.15);
    this.toStalkerLook(e);
  }

  /** Дальняя точка от игрока (кольцо minD–minD+20м): пак не спавнится в лицо.
      Не нашлось на minD — вернём самую дальнюю свободную (но не ближе 25м). */
  private farSpot(minD: number): [number, number] | null {
    let best: [number, number] | null = null, bd = 0;
    for (let t = 0; t < 16; t++) {
      const a = Math.random() * Math.PI * 2;
      const r = minD + Math.random() * 20;
      const x = Math.max(-this.half + 3, Math.min(this.half - 3, this.px + Math.cos(a) * r));
      const z = Math.max(-this.half + 3, Math.min(this.half - 3, this.pz + Math.sin(a) * r));
      if (this.hitSolid(x, z, 2)) continue;
      const d = Math.hypot(x - this.px, z - this.pz);
      if (d >= minD) return [x, z];
      if (d > bd) { bd = d; best = [x, z]; }
    }
    return bd >= 25 ? best : null;
  }
  /** Точка в заданном направлении от игрока (кольцо minD–minD+20м).
      Крутим угол, пока точка не ляжет ВНУТРИ карты (точку за краем не прибиваем
      клампом в кучу — иначе весь пак сплющивается у одного борта).
      avoid — уже занятые точки пака: ближе 25м не встаём. Не влезла — общий farSpot. */
  private farSpotAt(minD: number, ang: number, avoid: Array<[number, number]> = []): [number, number] | null {
    const a0 = ang + Math.random() * 0.5;
    for (let t = 0; t < 24; t++) {
      const a = a0 + (t / 24) * Math.PI * 2;
      const r = minD + Math.random() * 20;
      const rx = this.px + Math.cos(a) * r, rz = this.pz + Math.sin(a) * r;
      if (rx < -this.half + 3 || rx > this.half - 3 || rz < -this.half + 3 || rz > this.half - 3) continue;
      if (this.hitSolid(rx, rz, 2)) continue;
      if (Math.hypot(rx - this.px, rz - this.pz) < minD) continue;
      let clash = false;
      for (const q of avoid) {
        if (Math.hypot(rx - q[0], rz - q[1]) < 25) { clash = true; break; }
      }
      if (clash) continue;
      return [rx, rz];
    }
    return this.farSpot(minD);
  }
  /** Пак Бэкрумса: ровно 4 бессмертных сталкера (больше не надо — они не умирают).
      Обычных мобов на этой карте нет — жуть должна давить, а не фармиться.
      Спавн в 100м от игрока по 4 сторонам света, чтобы не падали на голову и не в одну точку. */
  private spawnBackroomsPack(): number {
    if (this.netSync) return 0;
    const want = 4;
    let have = this.enemies.filter((e) => !e.dead && e.god).length;
    // добиваем пак до нормы (волна зачистки не будет — сталкеры не умирают)
    let k = 0;
    const taken: Array<[number, number]> = [];
    while (have < want) {
      const before = this.enemies.length;
      const spot = this.farSpotAt(100, (k / want) * Math.PI * 2, taken);
      this.spawnEnemy('walk', 100, spot);
      k++;
      if (this.enemies.length <= before) break;
      const e = this.enemies[this.enemies.length - 1]!;
      if (spot) taken.push(spot);
      this.toStalker(e);
      have++;
    }
    return have;
  }

  /** 4 неубиваемых быстрых сталкера Бэкрумса (хост endless, один раз за бой) — по 4 сторонам. */
  spawnStalkers(): number {
    if (this.netSync) return 0;
    if (this.stalkersOn) return this.enemies.filter((e) => !e.dead && e.god).length;
    this.stalkersOn = true;
    const taken: Array<[number, number]> = [];
    for (let i = 0; i < 4; i++) {
      const before = this.enemies.length;
      const spot = this.farSpotAt(100, (i / 4) * Math.PI * 2, taken);
      this.spawnEnemy('walk', 100, spot);
      if (this.enemies.length > before) {
        if (spot) taken.push(spot);
        const e = this.enemies[this.enemies.length - 1]!;
        this.toStalker(e);
      }
    }
    return this.enemies.filter((e) => !e.dead && e.god).length;
  }

  debugStalkers(): number {
    return this.enemies.filter((e) => !e.dead && e.god).length;
  }

  /** Жуть без полосок: все живые бессмертные прячут HP-бар. */
  debugGodBars(): boolean {
    return this.enemies.every((e) => e.dead || !e.god || e.hpSpr.visible === false);
  }

  /** Все живые сталкеры носят тело жути (текстура МТТ, не гопник). */
  debugStalkerTex(): number {
    if (!this.stalkerTexCache) return -1;
    return this.enemies.filter((e) => !e.dead && e.god && e.body.material.map === this.stalkerTexCache).length;
  }

  // ============================================================
  // НАБЛЮДАТЕЛЬ: призрак, которого нет ни для кого.
  // - МОНСТРЫ не видят: при specOn цель во всех ветках наведения — только живые
  //   сокомнатники, урон и ваншот по наблюдателю запрещены, топота нет.
  // - ИГРОКИ не видят: тела нет вообще — туша лежит под картой (py=-60 летит
  //   в пульс, чужая кукла под землёй), в списках комнаты сервер спеков прячет,
  //   на миникарте чужих нет.
  // - ПОЛЁТ: WASD/стрелки + джойстик — по взгляду, Shift — быстрее (14 м/с),
  //   Space — вверх, C — вниз (0.5–30м). Коллизий у камеры НЕТ ВООБЩЕ:
  //   сквозь стены, сквозь потолок. Выше потолка потолок прячем — сверху
  //   видно весь лабиринт.
  // - РЕЖИМЫ: follow — висим на живом (цель бежит — летим за ней, умерла —
  //   пересаживаемся на следующего живого); free — летим сами (любой ход
  //   отрывает от цели, смена цели возвращает follow). Вышел — тело и
  //   потолок вернулись на место.
  // ============================================================
  private specOn = false;
  private specX = 0;
  /** Высота камеры (Space — вверх, C — вниз, 0.5–30м). */
  private specY = 2.6;
  private specZ = 0;
  /** true — свободный полёт; false — висим на цели. */
  private specFree = false;
  /** Куда вернуть тело при выходе из наблюдения. */
  private specStash: { x: number; z: number; py: number } | null = null;
  /** Ник живого игрока, за которым летит камера. Пусто — стоим на точке. */
  private specFollow = '';
  /** Потолок Бэкрумса: сверху прячем, чтобы было видно лабиринт. */
  private ceilMesh: THREE.Object3D | null = null;
  /** Свет наблюдателя: дневной свет + солнце сверху, горят только в specOn. */
  private specLight: THREE.AmbientLight | null = null;
  private specSun: THREE.DirectionalLight | null = null;
  /** Родной туман карты: отодвигаем на время полёта, при выходе возвращаем. */
  private fogSave: { near: number; far: number } | null = null;
  /** Дальность прорисовки 80–500м (ползунок в настройках): меньше — выше FPS. */
  private drawDist = 500;
  /** Родной туман карты (для пересчёта под дальность). */
  private fogOrig: { near: number; far: number } | null = null;
  /** Небо-сфера: масштабируем под дальность, иначе на минимуме пустота вместо неба. */
  private skyMesh: THREE.Mesh | null = null;
  /** Дверь выхода из Бэкрумса (для тестов/миникарты). */
  private door: { x: number; z: number } | null = null;
  /** Дверь выхода живёт ТОЛЬКО в Бесконечном Бэкрумсе (не обычный, не арена). */
  private get doorMode(): boolean { return this.map === 'endless'; }
  /** Куда дверь смотрит лицом (в коридор): с чужой стороны стены касания нет. */
  private doorFace: { x: number; z: number } = { x: 1, z: 0 };
  /** Подсветка двери: раз в минуту 5 секунд светится всем (и наблюдателям). */
  private doorMesh: THREE.Mesh | null = null;
  private doorGlow: THREE.PointLight | null = null;
  /** Принудительный маяк для тестов (null — по времени). */
  private doorPulseForce: boolean | null = null;
  private doorPulse = false;
  /** Побег уже засчитан в этом забеге (дверь — один раз). */
  private escapedFired = false;
  /** Тупиков в лабиринте Бэкрумса (для тестов/баланса). */
  private mazeDeads = 0;
  setSpec(on: boolean, x = 0, z = 0, followNick = ''): void {
    if (on && !this.specOn) this.specEnter();
    if (!on && this.specOn) this.specExit();
    if (on) {
      // тот же таргет с пульса комнаты — камеру НЕ трогаем: иначе каждый бит
      // сервера (1–2с) сбрасывал бы свободный полёт к цели (высота 2.6, follow).
      // Именно так наблюдатель «застревал»: взлетел — дёрнули назад.
      if (this.specOn && followNick !== '' && followNick === this.specFollow) {
        this.syncSpecCeil();
        return;
      }
      this.specX = x; this.specZ = z; this.specY = 2.6;
      // цель дали — висим на ней; цели нет (пустой сервер, соло) — сразу свободный полёт
      if (followNick !== '') { this.specFollow = followNick; this.specFree = false; }
      else this.specFree = true;
    }
    this.specOn = on;
    this.syncSpecCeil();
  }
  /** Вход в призраки: тело под карту, камера на точку, висим на цели. */
  private specEnter(): void {
    this.specStash = { x: this.px, z: this.pz, py: this.py };
    this.py = -60; this.pvy = 0;
    this.moving = false;
  }
  /** Выход из призраков: тело назад, цель сброшена, потолок назад. */
  private specExit(): void {
    if (this.specStash) {
      this.px = this.specStash.x; this.pz = this.specStash.z; this.py = this.specStash.py;
      this.specStash = null;
    }
    this.specFollow = '';
    this.specFree = false;
    if (this.ceilMesh) this.ceilMesh.visible = true;
  }
  debugSpec(): boolean { return this.specOn; }
  /** Координаты свободной камеры (для тестов/отладки). */
  debugSpecPos(): { x: number; z: number; y: number; free: boolean } {
    return { x: this.specX, z: this.specZ, y: this.specY, free: this.specFree };
  }

  /** Потолок Бэкрумса: камера выше него — прячем (видно весь лабиринт сверху).
      Вернулся вниз или вышел — возвращаем. Заодно дёргаем свет наблюдателя. */
  private syncSpecCeil(): void {
    this.syncSpecLight();
    if (!this.ceilMesh) return;
    const hide = this.specOn
      && (this.map === 'backrooms' || this.map === 'endless')
      && this.specY > 3.4;
    if (this.ceilMesh.visible === hide) this.ceilMesh.visible = !hide;
  }

  /** Свет наблюдателя: светло как днём, темноты нет. Туман карты отодвигаем —
      иначе сверху видно только тьму (родной туман 6–50м). Выход — всё назад. */
  private syncSpecLight(): void {
    const on = this.specOn;
    if (this.specLight) this.specLight.visible = on;
    if (this.specSun) this.specSun.visible = on;
    const fog = this.scene.fog as THREE.Fog | null;
    if (!fog) return;
    if (on) {
      if (!this.fogSave) {
        this.fogSave = { near: fog.near, far: fog.far };
        fog.near = 80; fog.far = 600;
      }
      // сверху видно весь лабиринт (300м) — край камеры отодвигаем тоже
      this.camera.far = 600;
      this.camera.updateProjectionMatrix();
    } else if (this.fogSave) {
      this.fogSave = null;
      this.applyDrawDist();
    }
  }

  /** Каждый кадр: follow — висеть на живом (убежал — летим за ним, умер —
      пересели на следующего живого); free — летим сами, не трогаем. */
  private updateSpecFollow(): void {
    if (!this.specOn || this.specFree) return;
    const alive = this.remotes.filter((r) => !r.dead);
    if (alive.length === 0) return;
    let t = alive.find((r) => r.nick === this.specFollow);
    if (!t) { t = alive[0]!; this.specFollow = t.nick; }
    this.specX = t.x; this.specZ = t.z;
    this.syncSpecCeil();
  }

  /** Свободный полёт: WASD — по взгляду сквозь всё (стен не спрашиваем),
      Shift — быстрее, Space — вверх, C — вниз. Любой ход отрывает от цели. */
  private flySpec(f: number, r: number, dt: number): void {
    const km = this.keyMap;
    const len = Math.hypot(f, r);
    const fly = (this.input[km.run] || this.input.ShiftLeft || this.input.ShiftRight) ? 14 : 8;
    if (len > 0.01) {
      const nf = f / Math.max(1, len), nr = r / Math.max(1, len);
      const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw);
      const rx = Math.cos(this.yaw), rz = -Math.sin(this.yaw);
      // сквозь стены: только края арены держат, остальное — воздух
      this.specX = this.clamp(this.specX + (fx * nf + rx * nr) * fly * dt);
      this.specZ = this.clamp(this.specZ + (fz * nf + rz * nr) * fly * dt);
      this.specFree = true;
    }
    // сквозь потолок: высота без collisions, потолок сверху прячем (см. syncSpecCeil).
    // Вертикаль — тоже полёт: отрываемся от цели, иначе follow каждый кадр
    // прибивает камеру обратно к цели и Space/C будто не работают.
    if (this.input[km.jump] || this.input.Space) { this.specY = Math.min(30, this.specY + 8 * dt); this.specFree = true; }
    if (this.input[km.ability] || this.input.KeyC) { this.specY = Math.max(0.5, this.specY - 8 * dt); this.specFree = true; }
    this.moving = false;
    this.syncSpecCeil();
  }

  /** Сталкер бэкрумса убивает с 1 удара: смерть + скример на весь экран + звук смерти (1 раз). */
  private killByStalker(): void {
    if (this.dead || this.specOn || this.invisT > 0 || this.shieldT > 0 || this.devGod) return;
    this.hp = 0;
    this.dead = true;
    this.burst(this.px - Math.sin(this.yaw) * 1.2, 1.5, this.pz - Math.cos(this.yaw) * 1.2, 8);
    this.shakeT = 0.35;
    try { this.sfx(hitUrl, 0.8); } catch { /* noop */ }
    this.playDeathOnce();
    this.pushHud();
    this.ev.onBusted({ score: this.score, coins: 0 });
    try { this.ev.onJumpscare?.(); } catch { /* noop */ }
  }

  /** Звук смерти в Бэкрумсе: играет 1 раз за жизнь (флаг сбрасывает revive/start). */
  private deathPlayed = false;
  private playDeathOnce(): void {
    if (this.deathPlayed) return;
    if (this.map !== 'backrooms' && this.map !== 'endless') return;
    this.deathPlayed = true;
    try { this.sfx(deathUrl, 1); } catch { /* noop */ }
  }

  debugFlyers(): number {
    return this.enemies.filter((e) => !e.dead && e.kind === 'fly').length;
  }

  /** Туша моба: спрайт тела + красный рентген-контур + полоска HP (общее для локальных и сетевых кукол). */
  private makeEnemyVisuals(kind: 'walk' | 'fly' | 'boss'): { g: THREE.Group; body: THREE.Sprite; ol: THREE.Sprite; hpCv: HTMLCanvasElement; hpTex: THREE.CanvasTexture; hpSpr: THREE.Sprite } {
    // в Бэкрумс потолок 3м — летуны бы скребли макушкой, только пешие (босс проходит: он земной)
    const fly = kind === 'fly' && this.map !== 'backrooms';
    const boss = kind === 'boss';
    const tex = boss ? this.bossTexture() : fly ? this.foeTextureTinted() : this.foeTexture();
    const g = new THREE.Group();
    const body = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, color: fly ? 0xdd99ff : 0xffffff }));
    body.scale.set(boss ? 2.8 : fly ? 1.2 : 1.4, boss ? 3.6 : fly ? 1.6 : 2.0, 1);
    body.position.set(0, boss ? 1.8 : fly ? 3.2 : 1.0, 0);
    g.add(body);
    // контур рентгена: та же текстура в красном, чуть больше тела, рисуется РАНЬШЕ
    // тела (renderOrder -1) и сквозь стены (depthTest false). Тело накрывает середину,
    // по краям выглядывает красная кайма; за стеной видно только её, а не всю текстуру.
    const ol = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, color: 0xff2222, opacity: 0.9, depthTest: false, depthWrite: false }));
    ol.visible = false;
    ol.renderOrder = -1;
    ol.position.copy(body.position);
    ol.scale.set(body.scale.x * 1.18, body.scale.y * 1.18, 1);
    g.add(ol);
    // полоска HP с цифрами: рисуем на канвасе (пиксель-стиль)
    const hpCv = document.createElement('canvas');
    hpCv.width = 128; hpCv.height = 32;
    const hpTex = new THREE.CanvasTexture(hpCv);
    const hpSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: hpTex, depthTest: true, transparent: true }));
    hpSpr.scale.set(boss ? 3.4 : 1.7, boss ? 0.84 : 0.42, 1);
    hpSpr.position.set(0, boss ? 4.1 : fly ? 4.6 : 2.35, 0);
    g.add(hpSpr);
    return { g, body, ol, hpCv, hpTex, hpSpr };
  }

  private spawnEnemy(kind: 'walk' | 'fly' | 'boss', minDist = 0, at: [number, number] | null = null): void {
    if (this.netSync) return;
    const boss = kind === 'boss';
    const fly = kind === 'fly' && this.map !== 'backrooms';
    const { g, body, ol, hpCv, hpTex, hpSpr } = this.makeEnemyVisuals(kind);
    // точка спавна: только свободная (не внутри укрытий) и не впритык к игроку (босс — подальше)
    let sx = 0, sz = 40;
    let ok = false;
    const keepAway = minDist > 0 ? minDist : boss ? 14 : 10;
    // готовая точка (дальний пак): проверяем и берём сразу
    if (at && !this.hitSolid(at[0], at[1], 2)) {
      sx = at[0]; sz = at[1];
      ok = true;
    }
    for (let t = 0; t < 24 && !ok; t++) {
      const a = Math.random() * Math.PI * 2;
      // бэкрумс: спавн в 100м от игрока (100–115м кольцо), остальные как раньше (26–48м)
      const far = this.map === 'backrooms' || this.map === 'endless';
      const r = far ? 100 + Math.random() * 15 : 26 + Math.random() * 22;
      const cx = clampArena(Math.cos(a) * r, this.half);
      const cz = clampArena(Math.sin(a) * r, this.half);
      if (this.hitSolid(cx, cz, 2)) continue;
      if (Math.hypot(cx - this.px, cz - this.pz) < keepAway) continue;
      sx = cx; sz = cz;
      ok = true;
      break;
    }
    // запасные свободные точки, если рандом не нашёл: сначала дальняя от игрока
    // (бэкрумс — от 100м, остальные — от 25м)
    if (!ok) {
      const fs = this.farSpot(this.map === 'backrooms' || this.map === 'endless' ? 100 : 25);
      if (fs) { sx = fs[0]; sz = fs[1]; ok = true; }
    }
    if (!ok) {
      const safe: Array<[number, number]> = [[20, 20], [-20, 20], [20, -20], [-20, -20], [0, 0], [40, 0], [-40, 0]];
      for (const [qx, qz] of safe) {
        if (!this.hitSolid(qx, qz, 2) && Math.hypot(qx - this.px, qz - this.pz) >= keepAway) {
          sx = qx; sz = qz;
          ok = true;
          break;
        }
      }
    }
    // последний шанс: любая свободная рядом
    if (!ok) {
      const fs = this.farSpot(5);
      if (fs) { sx = fs[0]; sz = fs[1]; ok = true; }
    }
    // спираль вокруг игрока с сужением дистанции: игрок всегда стоит на
    // свободном — рядом с ним место точно есть, пусть и ближе keepAway
    if (!ok) {
      for (let r = keepAway; r >= 3 && !ok; r -= 3) {
        for (let k = 0; k < 12 && !ok; k++) {
          const a = (k / 12) * Math.PI * 2;
          const qx = clampArena(this.px + Math.cos(a) * r, this.half);
          const qz = clampArena(this.pz + Math.sin(a) * r, this.half);
          if (!this.hitSolid(qx, qz, 2)) { sx = qx; sz = qz; ok = true; }
        }
      }
    }
    // свободного места нет вообще — НЕ спавним в стену (раньше падал в дефолт (0,40) без проверки)
    if (!ok) return;
    g.position.set(sx, 0, sz);
    this.scene.add(g);
    const foe: Enemy = {
      g, body, ol, hpCv, hpTex, hpSpr, kind,
      hp: boss ? 500 + this.wave * 50 : fly ? 70 : 100,
      maxhp: boss ? 500 + this.wave * 50 : fly ? 70 : 100,
      speed: boss ? 1.5 : 1.7 + Math.random() * 1.1 + this.wave * 0.12 + (fly ? 0.6 : 0),
      hitCd: 0, hurtT: 0, phase: Math.random() * 6.28, ey: 0, evy: 0, hopCd: 1 + Math.random() * 2, dead: false,
      mobId: this.mobIdSeq++, net: false, tx: sx, tz: sz, snaps: [], ewave: this.wave,
      path: [], repathT: 0.1 + Math.random() * 0.2, god: false, climb: false,
      ptx: sx, ptz: sz, lx: sx, lz: sz, stuckT: 0, slideT: 0, slideX: 0, slideZ: 0, slideDir: 0,
      stepT: Math.random() * 0.4,
    };
    this.updateHpBar(foe);
    this.enemies.push(foe);
    this.pushHud();
  }

  private updateHpBar(e: Enemy): void {
    // бессмертный — без полоски: жуть не показывает HP (и так ясно, что не убить)
    e.hpSpr.visible = !e.god;
    if (e.god) return;
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
    this.deathPlayed = false;
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
    if (!this.started || this.dead || this.specOn) return 0;
    if (this.atkCd > 0) return 0;
    this.shieldT = 0;
    this.atk++;
    const W = Game.weapon(this.weaponId);
    this.atkCd = W.cd;
    this.swingT = 0.22;
    this.ev.onSwing();
    if (W.spread) return this.shotgunFire(W.dmg, W.range);
    if (W.ranged) return this.shoot(W.dmg, W.range);
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
      this.strikeEnemy(e, W.dmg * this.dmgMul() + Math.random() * 8, dx, dz, d, 1.6);
      hits++;
    }
    // PvP: ближний бой достаёт и игроков (конус тот же, урон считает сервер)
    if (this.map === 'pvp') {
      for (const r of this.remotes) {
        if (r.dead || r.fid < 0) continue;
        const dx = r.x - this.px;
        const dz = r.z - this.pz;
        const d = Math.hypot(dx, dz);
        if (d > W.range) continue;
        const cos = (dx * fx + dz * fz) / (d || 1);
        if (cos < 0.35) continue;
        this.hitRemote(r, W.dmg * this.dmgMul() + Math.random() * 8);
        hits++;
      }
    }
    if (hits > 0) this.sfx(hitUrl);
    this.pushHud();
    this.waveClearCheck();
    this.drawMM();
    return hits;
  }

  /** Попадание по игроку в PvP: картинка + заявка на сервер (HP и фраг считает сервер). */
  private hitRemote(r: Remote, dmg: number): void {
    this.burst(r.x, 1.5, r.z, 8);
    r.flash = 0.3;
    this.sfx(hitUrl);
    if (r.fid >= 0) this.ev.onPvpHit?.(r.fid, Math.round(dmg));
  }

  /** Серверный HP в PvP: жертва принимает урон, в ноль — экран смерти (не busted). */
  setPvpHp(hp: number): number {
    this.hp = Math.max(0, Math.min(this.maxhp, Math.round(hp)));
    if (this.hp <= 0 && this.started && !this.dead) {
      this.dead = true;
      this.pushHud();
      this.ev.onPvpDead?.();
    } else {
      this.pushHud();
    }
    return this.hp;
  }

  /** Ресаун в PvP после смерти: на точку, полное HP, без штрафа (штраф — сама смерть).
      Точка из сети может оказаться в стене (сервер карты не знает) — дёргаем
      спиралью на ближайшую свободную, иначе жертва воскреснет вмурованной. */
  pvpRespawn(x: number, z: number): boolean {
    this.dead = false;
    this.hp = this.maxhp;
    let qx = this.clamp(Number(x) || 0), qz = this.clamp(Number(z) || 0);
    if (this.hitSolid(qx, qz, 1.0, 0)) {
      let free = false;
      for (let ring = 1; ring <= 12 && !free; ring++) {
        for (let ax = -ring; ax <= ring && !free; ax++) {
          for (let az = -ring; az <= ring && !free; az++) {
            if (Math.max(Math.abs(ax), Math.abs(az)) !== ring) continue;
            const cx = this.clamp(qx + ax * 2), cz = this.clamp(qz + az * 2);
            if (!this.hitSolid(cx, cz, 1.0, 0)) { qx = cx; qz = cz; free = true; }
          }
        }
      }
      if (!free) { this.randomSpawn(); this.pushHud(); this.drawMM(); return true; }
    }
    this.px = qx;
    this.pz = qz;
    this.py = 0; this.pvy = 0;
    this.pushHud();
    this.drawMM();
    return true;
  }

  /** Случайная свободная точка арены (спавн PvP/Бэкрумса/Нашествия): 24 попытки мимо стен. */
  randomSpawn(): { x: number; z: number } {
    for (let t = 0; t < 24; t++) {
      const qx = -48 + Math.random() * 96, qz = -48 + Math.random() * 96;
      if (!this.hitSolid(qx, qz, 1.0)) { this.px = qx; this.pz = qz; this.yaw = 0; this.py = 0; this.pvy = 0; return { x: qx, z: qz }; }
    }
    this.px = 0; this.pz = 22; this.yaw = 0;
    return { x: 0, z: 22 };
  }

  /** Пульс присутствия для комнаты: ствол, высота, счётчик ударов, смерть. */
  presence(): { weapon: string; py: number; atk: number; dead: boolean } {
    return { weapon: this.weaponId, py: Math.round(this.py * 10) / 10, atk: this.atk, dead: this.dead };
  }

  // удар по врагу: локальному — сразу HP и фраг, сетевому — картинка + заявка на сервер (HP считает сервер)
  private strikeEnemy(e: Enemy, dmg: number, dx: number, dz: number, d: number, push: number): void {
    if (e.net) {
      e.hurtT = 0.18;
      this.burst(e.g.position.x, 1.2, e.g.position.z, 6);
      this.updateHpBar(e);
      this.ev.onNetHit?.(e.mobId, Math.round(dmg));
      return;
    }
    e.hp -= dmg;
    this.afterHit(e, dx, dz, d, push);
  }

  // общий итог попадания: отброс, полоса HP, частицы, фраг
  private afterHit(e: Enemy, dx: number, dz: number, d: number, push: number): void {
    e.hurtT = 0.18;
    // кламп сначала под карту, проверка финальной точки (иначе отброс в стену)
    const nx = clampArena(e.g.position.x + (dx / (d || 1)) * push, this.half);
    const nz = clampArena(e.g.position.z + (dz / (d || 1)) * push, this.half);
    const goX = !this.hitSolid(nx, e.g.position.z, 0.8);
    const goZ = !this.hitSolid(e.g.position.x, nz, 0.8);
    // отброс углом в стену запрещён: едем только по главной оси
    if (goX && goZ && this.hitSolid(nx, nz, 0.8)) {
      if (Math.abs(dx) >= Math.abs(dz)) e.g.position.x = nx;
      else e.g.position.z = nz;
    } else {
      if (goX) e.g.position.x = nx;
      if (goZ) e.g.position.z = nz;
    }
    this.updateHpBar(e);
    this.burst(e.g.position.x, 1.2, e.g.position.z, 10);
    if (e.hp <= 0) {
      e.dead = true;
      this.scene.remove(e.g);
      this.kills++;
      // за босса — куш: +500 очков и +100 фантиков
      this.score += e.kind === 'boss' ? 500 + e.ewave * 10 : 100 + e.ewave * 10;
      this.fantiki += e.kind === 'boss' ? 100 : 10;
      this.addXp(e.kind === 'boss' ? 100 : 10);
      this.saveShop();
      if (!e.net) {
        this.deadLog.push({ id: e.mobId, kind: e.kind, x: Math.round(e.g.position.x * 10) / 10, z: Math.round(e.g.position.z * 10) / 10, hp: 0, dead: true, wave: e.ewave });
        if (this.deadLog.length > 24) this.deadLog.splice(0, this.deadLog.length - 24);
      }
    }
  }

  // 🔫 выстрел: хитскан строго по прицелу (конус ~2°) — без автонаводки;
  // урон тает с дистанцией
  private shoot(baseDmg: number, range: number): number {
    this.sfx(shotUrl);
    const cp = Math.cos(this.pitch);
    const dx = -Math.sin(this.yaw) * cp, dy = Math.sin(this.pitch), dz = -Math.cos(this.yaw) * cp;
    const cx = this.px, cy = 1.7 + this.py, cz = this.pz;
    let best: Enemy | null = null;
    let bestD = Infinity;
    for (const e of this.enemies) {
      if (e.dead) continue;
      const ty = e.kind === 'fly' ? 3.2 : 1.0 + e.ey;
      const vx = e.g.position.x - cx, vy = ty - cy, vz = e.g.position.z - cz;
      // хитбокс-туша R~0.9м: сближение луча с центром — вплотную бьёт, вдаль строго
      const t = vx * dx + vy * dy + vz * dz;
      if (t > range || t < 0.15) continue;
      const mx = vx - dx * t, my = vy - dy * t, mz = vz - dz * t;
      if (Math.sqrt(mx * mx + my * my + mz * mz) > 0.9) continue;
      if (t < bestD) { bestD = t; best = e; }
    }
    // PvP: луч встречает и игроков (туша та же R~0.9, высота по прыжку)
    let bestR: Remote | null = null;
    let bestRD = Infinity;
    if (this.map === 'pvp') {
      for (const r of this.remotes) {
        if (r.dead || r.fid < 0) continue;
        const ty = 1.0 + (r.py || 0);
        const vx = r.x - cx, vy = ty - cy, vz = r.z - cz;
        const t = vx * dx + vy * dy + vz * dz;
        if (t > range || t < 0.15) continue;
        const mx = vx - dx * t, my = vy - dy * t, mz = vz - dz * t;
        if (Math.sqrt(mx * mx + my * my + mz * mz) > 0.9) continue;
        if (t < bestRD) { bestRD = t; bestR = r; }
      }
      if (bestR && bestRD < bestD) {
        const fall = 1 - (bestRD / range) * 0.5;
        this.tracer(cx, cy, cz, bestR.x, 1.0 + (bestR.py || 0), bestR.z);
        this.hitRemote(bestR, baseDmg * fall * this.dmgMul() + Math.random() * 5);
        this.pushHud();
        this.drawMM();
        return 1;
      }
    }
    if (!best) {
      // мимо: пыль на излёте пули + трассер в никуда
      this.burst(cx + dx * 8, cy + dy * 8, cz + dz * 8, 3);
      this.tracer(cx, cy, cz, cx + dx * range, cy + dy * range, cz + dz * range);
      this.pushHud();
      return 0;
    }
    const fall = 1 - (bestD / range) * 0.5;
    const bdx = best.g.position.x - cx, bdz = best.g.position.z - cz;
    this.tracer(cx, cy, cz, best.g.position.x, (best.kind === 'fly' ? 3.2 : 1.0 + best.ey), best.g.position.z);
    this.strikeEnemy(best, baseDmg * fall * this.dmgMul() + Math.random() * 5, bdx, bdz, Math.hypot(bdx, bdz), 0.8);
    this.sfx(hitUrl);
    this.pushHud();
    this.waveClearCheck();
    this.drawMM();
    return 1;
  }

  // зачистка волны: +волна, +25HP, +25 фантиков, +50 опыта (один хелпер на все стволы)
  private waveClearCheck(): void {
    if (this.netSync) return;
    if ((this.map === 'arena' || this.map === 'backrooms' || this.map === 'custom' || this.map === 'random' || this.map === 'invasion') && this.enemiesOn && this.enemies.length > 0 && this.enemies.every((e) => e.dead)) {
      this.wave++;
      this.hp = Math.min(this.maxhp, this.hp + 25);
      this.fantiki += 25;
      this.addXp(50);
      this.saveShop();
      this.spawnWave();
    }
  }

  // что первым встретит луч выстрела: стена или земля/крыша (дистанция — метры)?
  // Нет поверхности рядом — от воздуха не оттолкнуться.
  private shotFirstSurface(cx: number, cy: number, cz: number, dx: number, dy: number, dz: number): { kind: 'wall' | 'ground'; dist: number } | null {
    for (let t = 0.25; t <= 12; t += 0.25) {
      const x = cx + dx * t, y = cy + dy * t, z = cz + dz * t;
      if (this.hitSolid(x, z, 0.5, y)) return { kind: 'wall', dist: t };
      if (y <= this.groundAt(x, z) + 0.15) return { kind: 'ground', dist: t };
    }
    return null;
  }

  // 💥 дробовик: 8 дробин честным веером (~4°). В упор — полный урон, вдаль — щекотка:
  // урон = дробины × база/8 × затухание с дистанцией (^1.6). Без автонаводки.
  // Выстрел себе под ноги (круто вниз) — рокет-джамп: швыряет против выстрела,
  // вверх на 6м (pvy 12 при гравитации 12: 12²/24 = 6) + отброс назад.
  private shotgunFire(totalDmg: number, range: number): number {
    this.sfx(shotUrl);
    const cp = Math.cos(this.pitch);
    const dx = -Math.sin(this.yaw) * cp, dy = Math.sin(this.pitch), dz = -Math.cos(this.yaw) * cp;
    const cx = this.px, cy = 1.7 + this.py, cz = this.pz;
    this.burst(cx + dx * 2, cy + dy * 2, cz + dz * 2, 14);
    // 8 дробин летят честным веером (~4° вокруг прицела): куда навёл — туда и ушло,
    // никакой автонаводки — попадание считается по пересечению луча дробины с тушей
    const PELLETS = 8, SPREAD = 0.07;
    let rx = -dz, ry = 0, rz = dx;
    let rl = Math.hypot(rx, ry, rz);
    if (rl < 0.01) { rx = 1; ry = 0; rz = 0; rl = 1; }
    rx /= rl; ry /= rl; rz /= rl;
    const ux = ry * dz - rz * dy, uy = rz * dx - rx * dz, uz = rx * dy - ry * dx;
    const perPellet = totalDmg / PELLETS;
    const hitsBy = new Map<number, number>();
    const hitPos = new Map<number, { x: number; y: number; z: number; hx: number; hz: number }>();
    const pvpMode = this.map === 'pvp';
    const remHits = new Map<number, number>();
    const remPos = new Map<number, { dist: number }>();
    for (let pi = 0; pi < PELLETS; pi++) {
      const ox = (Math.random() * 2 - 1) * SPREAD, oy = (Math.random() * 2 - 1) * SPREAD;
      let pdx = dx + rx * ox + ux * oy, pdy = dy + ry * ox + uy * oy, pdz = dz + rz * ox + uz * oy;
      const pl = Math.hypot(pdx, pdy, pdz) || 1;
      pdx /= pl; pdy /= pl; pdz /= pl;
      for (let ei = 0; ei < this.enemies.length; ei++) {
        const e = this.enemies[ei];
        if (e.dead) continue;
        const ty = e.kind === 'fly' ? 3.2 : 1.0 + e.ey;
        const ex = e.g.position.x - cx, ey = ty - cy, ez = e.g.position.z - cz;
        const t = ex * pdx + ey * pdy + ez * pdz;
        if (t < 0.5 || t > range) continue;
        const dd = Math.sqrt(Math.max(0, ex * ex + ey * ey + ez * ez - t * t));
        if (dd > 0.9) continue;
        hitsBy.set(ei, (hitsBy.get(ei) ?? 0) + 1);
        if (!hitPos.has(ei)) hitPos.set(ei, { x: e.g.position.x, y: ty, z: e.g.position.z, hx: ex, hz: ez });
        this.tracer(cx, cy, cz, cx + pdx * t, cy + pdy * t, cz + pdz * t);
      }
      // PvP: дробины встречают и игроков
      if (pvpMode) {
        for (let ri = 0; ri < this.remotes.length; ri++) {
          const r = this.remotes[ri];
          if (r.dead || r.fid < 0) continue;
          const ty = 1.0 + (r.py || 0);
          const ex = r.x - cx, ey = ty - cy, ez = r.z - cz;
          const t = ex * pdx + ey * pdy + ez * pdz;
          if (t < 0.5 || t > range) continue;
          const dd = Math.sqrt(Math.max(0, ex * ex + ey * ey + ez * ez - t * t));
          if (dd > 0.9) continue;
          remHits.set(ri, (remHits.get(ri) ?? 0) + 1);
          if (!remPos.has(ri)) remPos.set(ri, { dist: Math.hypot(ex, ez) });
          this.tracer(cx, cy, cz, cx + pdx * t, cy + pdy * t, cz + pdz * t);
        }
      }
    }
    let hits = 0;
    remHits.forEach((count, ri) => {
      const r = this.remotes[ri];
      const rp = remPos.get(ri);
      if (!r || !rp || r.dead || r.fid < 0) return;
      const fall = Math.pow(Math.max(0, 1 - rp.dist / range), 1.6);
      this.hitRemote(r, count * perPellet * fall * this.dmgMul() + Math.random() * 3);
      hits++;
    });
    hitsBy.forEach((count, ei) => {
      const e = this.enemies[ei];
      const hp = hitPos.get(ei);
      if (!hp) return;
      const dist = Math.hypot(hp.hx, hp.hz);
      const fall = Math.pow(Math.max(0, 1 - dist / range), 1.6);
      this.strikeEnemy(e, count * perPellet * fall * this.dmgMul() + Math.random() * 3, hp.hx, hp.hz, dist, 2.2);
      hits++;
    });
    if (hits > 0) this.sfx(hitUrl);
    // СТЕНА + дробовик = катапульта: луч первым упёрся в стену (≤12м) —
    // швыряет на ~13м против выстрела видимым полётом (стены тормозят) + подброс.
    // Иначе классика: круто вниз в землю рядом (≤3.5м) — рокет-джамп 6м вверх.
    const surf = this.shotFirstSurface(cx, cy, cz, dx, dy, dz);
    if (surf && surf.kind === 'wall') {
      const hl = Math.hypot(dx, dz) || 1;
      this.blastDx = (-dx / hl) * 11.5;
      this.blastDz = (-dz / hl) * 11.5;
      this.blastT = 1.15;
      this.pvy = Math.max(this.pvy, 6.5);
      this.shakeT = 0.4;
      this.burst(this.px, 1.0, this.pz, 20);
      this.sfx(shotUrl, 0.8);
    } else if (dy < -0.45 && surf && surf.kind === 'ground' && surf.dist <= 3.5) {
      // рокет-джамп: чем круче вниз, тем выше (максимум 12 → ровно 6м);
      // отброс назад — коротким видимым броском против выстрела
      const k = Math.min(1, (-dy - 0.45) / 0.44);
      this.pvy = 12 * k;
      const hl = Math.hypot(dx, dz) || 1;
      this.blastDx = (-dx / hl) * 6 * k;
      this.blastDz = (-dz / hl) * 6 * k;
      this.blastT = 0.35;
      this.burst(this.px, 0.3, this.pz, 16);
      this.sfx(shotUrl, 0.8);
    }
    this.pushHud();
    this.waveClearCheck();
    this.drawMM();
    return hits;
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

  // рывок МТТ: строго в сторону взгляда, включая вверх/вниз (куда смотрит камера), кд 3с (качается до 1.7с).
  // Союзников (remotes) урон не трогает вовсе: attack() бьёт только enemies.
  dash(): boolean {
    if (!this.started || this.dead || this.dashCd > 0 || this.charId !== 'mtt') return false;
    const cp = Math.cos(this.pitch);
    this.dashDx = -Math.sin(this.yaw) * cp;
    this.dashDy = Math.sin(this.pitch);
    this.dashDz = -Math.cos(this.yaw) * cp;
    this.dashT = 0.18;
    this.dashCd = superCd(this.charId, this.upg[this.charId]?.sup ?? 0);
    this.pvy = 0;
    this.burst(this.px, 0.4, this.pz, 12);
    this.pushHud();
    return true;
  }

  debugDash(): number { return Math.round(this.dashCd * 10) / 10; }

  // несутка Ивангоя: 3с враги не видят и не преследуют, перезарядка 30с (качается до 20с).
  invis(): boolean {
    if (!this.started || this.dead || this.invisCd > 0 || this.invisT > 0 || this.charId !== 'shuba') return false;
    this.invisT = 3;
    this.invisCd = superCd('shuba', this.upg['shuba']?.sup ?? 0);
    this.burst(this.px, 0.4, this.pz, 12);
    this.pushHud();
    return true;
  }

  debugInvis(): { t: number; cd: number } {
    return { t: Math.round(this.invisT * 10) / 10, cd: Math.round(this.invisCd * 10) / 10 };
  }

  // чумное облако Чумы: 5с враги в радиусе 9м травятся (9/с) и тормозятся на 45%,
  // перезарядка 30с (качается до 20с). Бессмертных сталкеров не убивает — только тормозит.
  chuma(): boolean {
    if (!this.started || this.dead || this.chumaCd > 0 || this.chumaT > 0 || this.charId !== 'chuma') return false;
    this.chumaT = 5;
    this.chumaCd = superCd('chuma', this.upg['chuma']?.sup ?? 0);
    this.burst(this.px, 0.8, this.pz, 16);
    this.pushHud();
    return true;
  }

  debugChuma(): { t: number; cd: number } {
    return { t: Math.round(this.chumaT * 10) / 10, cd: Math.round(this.chumaCd * 10) / 10 };
  }

  /** Купол виден прямо сейчас (для тестов). */
  debugDome(): boolean {
    return !!this.chumaDome && this.chumaDome.visible;
  }

  // рентген Гидроксиса: 5с всех существ видно сквозь стены, перезарядка 20с
  // (качается до 15с). Работает и на мобов, и на сокомнатников.
  xray(): boolean {
    if (!this.started || this.dead || this.xrayCd > 0 || this.xrayT > 0 || this.charId !== 'gidroxis') return false;
    this.xrayT = 5;
    this.xrayCd = superCd('gidroxis', this.upg['gidroxis']?.sup ?? 0);
    this.burst(this.px, 1.2, this.pz, 12);
    this.pushHud();
    return true;
  }

  debugXray(): { t: number; cd: number } {
    return { t: Math.round(this.xrayT * 10) / 10, cd: Math.round(this.xrayCd * 10) / 10 };
  }

  /** Контуры рентгена: враги (красные) и бойцы (белые) — видны ли прямо сейчас. */
  debugXrayFlags(): { foe: boolean[]; mate: boolean[] } {
    return {
      foe: this.enemies.filter((e) => !e.dead).map((e) => e.ol.visible),
      mate: this.remotes.filter((r) => !r.dead).map((r) => r.ol.visible),
    };
  }

  /** Рентген: пока висит — у мобов красный контур, у бойцов белый (видны сквозь стены).
      Сами текстуры не трогаем: тело рисуется как обычно, сквозь стену видна только кайма. */
  private syncXray(): void {
    const on = this.xrayT > 0 || this.devXray;
    const fit = (host: { body: THREE.Sprite; ol: THREE.Sprite }, dead: boolean): void => {
      const ol = host.ol;
      const show = on && !dead;
      if (ol.visible !== show) ol.visible = show;
      if (show) {
        ol.position.copy(host.body.position);
        ol.scale.set(host.body.scale.x * 1.18, host.body.scale.y * 1.18, 1);
        const om = ol.material as THREE.SpriteMaterial;
        const cur = host.body.material.map;
        if (om.map !== cur) { om.map = cur; om.needsUpdate = true; }
      }
    };
    for (const e of this.enemies) fit(e, e.dead);
    for (const r of this.remotes) fit(r, r.dead);
  }
  /** Хитбоксы разработчика: проволочные коробки на живых врагах (красные)
      и сокомнатниках (зелёные). Сквозь стены (depthTest нет) — видно всех. */
  private syncHit(): void {
    if (!this.devHit) return;
    if (!this.hitGroup) {
      this.hitGroup = new THREE.Group();
      this.scene.add(this.hitGroup);
    }
    this.hitGroup.visible = true;
    let i = 0;
    const need = (color: number): THREE.LineSegments => {
      let b = this.hitBoxes[i];
      if (!b) {
        const geo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
        b = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color, depthTest: false, transparent: true }));
        b.renderOrder = 999;
        this.hitBoxes[i] = b;
        this.hitGroup!.add(b);
      }
      (b.material as THREE.LineBasicMaterial).color.set(color);
      i++;
      return b;
    };
    for (const e of this.enemies) {
      if (e.dead) continue;
      const b = need(0xff3b3b);
      const w = e.kind === 'boss' ? 2.6 : 1.8;
      const h = e.kind === 'boss' ? 2.9 : e.kind === 'fly' ? 1.5 : 2.2;
      const cy = (e.kind === 'fly' ? 3.2 : e.ey) + h / 2;
      b.visible = true;
      b.position.set(e.g.position.x, cy, e.g.position.z);
      b.scale.set(w, h, w);
    }
    for (const r of this.remotes) {
      if (r.dead) continue;
      const b = need(0x39d353);
      b.visible = true;
      b.position.set(r.x, r.py + 1.0, r.z);
      b.scale.set(1.5, 2.0, 1.5);
    }
    for (let k = i; k < this.hitBoxes.length; k++) this.hitBoxes[k].visible = false;
  }
  /** В бою (для общей комнаты): идёт игра и боец жив. */
  debugPlaying(): boolean { return this.started && !this.dead; }
  debugAtkCd(): number { return Math.round(this.atkCd * 10) / 10; }
  /** Гость ли я общей комнаты + сколько сетевых кукол держу. */
  debugNetSync(): boolean { return this.netSync; }
  /** Тест-контракт кукол: включить/выключить гостя и влить слепок хоста. */
  debugNetSyncSet(on: boolean): void { this.setNetSync(!!on); }
  debugMobsSet(list: RemoteMob[]): void { this.setRemoteMobs(list); }
  debugNetMobs(): number { return this.enemies.filter((e) => e.net && !e.dead).length; }
  /** Отладка для тестов: сбросить кд атаки (детерминированный выстрел). */
  debugResetCd(): void { this.atkCd = 0; }
  debugKick(): number { return Math.round(this.wallKickCd * 10) / 10; }
  debugWall(): number { return Math.round(this.wallT * 100) / 100; }
  debugTeleport(x: number, z: number, yaw?: number): void {
    this.px = this.clamp(Number(x) || 0);
    this.pz = this.clamp(Number(z) || 0);
    if (typeof yaw === 'number' && Number.isFinite(yaw)) this.yaw = yaw;
  }
  /** Тестовый крюк: поставить ноги игрока на высоту (крыша для проб плоскостей). */
  debugSetPy(v: number): void {
    if (!Number.isFinite(v)) return;
    this.py = Math.max(0, Math.min(30, v));
    this.pvy = 0;
  }
  debugRemoteList(): RemotePlayer[] {
    return this.remotes.map((m) => ({ nick: m.nick, char: m.char, x: m.x, z: m.z, yaw: m.yaw, hp: m.hp, weapon: m.weapon, py: m.py, atk: m.atk, dead: m.dead, fid: m.fid }));
  }
  /** Отладка для тестов: живые враги с координатами (навести прицел точно). */
  debugFoes(): Array<{ id: number; x: number; z: number; hp: number; dead: boolean; ey: number; climb: boolean; god: boolean }> {
    return this.enemies.filter((e) => !e.dead).map((e) => ({ id: e.mobId, x: e.g.position.x, z: e.g.position.z, hp: Math.round(e.hp), dead: e.dead, ey: Math.round(e.ey * 100) / 100, climb: e.climb, god: e.god }));
  }

  /** Гость общей комнаты: локальную симуляцию гасим, мобы едут со сервера. */
  setNetSync(on: boolean): void {
    if (this.netSync === on) return;
    if (!on && this.netWave > this.wave) this.wave = this.netWave;
    this.netSync = on;
    for (const e of this.enemies) this.scene.remove(e.g);
    this.enemies = [];
    this.deadLog = [];
    this.netMax.clear();
    this.netWave = 0;
    // вышел из гостей (или стал хостом): своя симуляция с нуля, если поле пустое
    if (!on && this.started && !this.dead && this.enemiesOn) this.spawnWave();
  }

  /** Слепок мобов для хоста общей комнаты (живые + свежие трупы, дуэль мимо). */
  debugMobs(): RemoteMob[] {
    if (this.map === 'duel') return [];
    const out: RemoteMob[] = this.enemies
      .filter((e) => !e.net && !e.dead)
      .slice(0, 60)
      .map((e) => ({ id: e.mobId, kind: e.kind, x: Math.round(e.g.position.x * 10) / 10, z: Math.round(e.g.position.z * 10) / 10, hp: Math.round(e.hp), dead: false, wave: e.ewave, god: e.god }));
    for (const d of this.deadLog) out.push(d);
    return out.slice(0, 60);
  }

  /** Сетевые куклы гостя: сверка со слепком хоста (позиции — плавной догонкой). */
  setRemoteMobs(list: RemoteMob[]): void {
    if (!this.netSync) return;
    const waves = list.map((m) => Math.round(Number(m.wave) || 1));
    const top = waves.length > 0 ? Math.max(...waves) : this.netWave;
    if (top > this.netWave) {
      for (const e of this.enemies) if (e.net) this.scene.remove(e.g);
      this.enemies = this.enemies.filter((e) => !e.net);
      this.netMax.clear();
      this.netWave = top;
      // гость живёт волной хоста: иначе HUD навсегда на 1-й, баннеров нет, счёт врет
      if (this.wave !== top) { this.wave = top; this.pushHud(); }
    }
    const seen = new Set<number>();
    for (const m of list.slice(0, 60)) {
      const id = Math.floor(Number(m.id));
      if (!Number.isFinite(id)) continue;
      seen.add(id);
      const kind = m.kind === 'fly' || m.kind === 'boss' ? m.kind : 'walk';
      let e = this.enemies.find((q) => q.net && q.mobId === id);
      if (m.dead === true) {
        if (e && !e.dead) {
          e.dead = true;
          this.burst(e.g.position.x, 1.2, e.g.position.z, 10);
          this.scene.remove(e.g);
        }
        continue;
      }
      if (!e) {
        const v = this.makeEnemyVisuals(kind);
        v.g.position.set(Number(m.x) || 0, 0, Number(m.z) || 0);
        this.scene.add(v.g);
        const maxhp = Math.max(Math.round(Number(m.hp) || 1), 1);
        this.netMax.set(id, maxhp);
        e = {
          ...v, kind, hp: maxhp, maxhp, speed: 0,
          hitCd: 0, hurtT: 0, phase: Math.random() * 6.28, ey: 0, evy: 0, hopCd: 1e9, dead: false,
          mobId: id, net: true, tx: v.g.position.x, tz: v.g.position.z, snaps: [{ t: performance.now(), x: v.g.position.x, z: v.g.position.z }], ewave: Math.round(Number(m.wave) || 1),
          path: [], repathT: 0, god: m.god === true, climb: false,
          ptx: v.g.position.x, ptz: v.g.position.z, lx: v.g.position.x, lz: v.g.position.z,
          stuckT: 0, slideT: 0, slideX: 0, slideZ: 0, slideDir: 0, stepT: Math.random() * 0.4,
        };
        if (e.god) this.toStalkerLook(e);
        this.updateHpBar(e);
        this.enemies.push(e);
      } else {
        // слепок хоста в буфер куклы
        this.snapPush(e.snaps, performance.now(), Number(m.x) || 0, Number(m.z) || 0);
        e.tx = Number(m.x) || 0;
        e.tz = Number(m.z) || 0;
        if (m.god === true && !e.god) { e.god = true; this.toStalkerLook(e); }
        else e.god = m.god === true;
        e.hp = Math.max(0, Math.round(Number(m.hp) || 0));
        const maxhp = Math.max(e.maxhp, e.hp, 1);
        e.maxhp = maxhp;
        this.netMax.set(id, maxhp);
        this.updateHpBar(e);
      }
    }
    for (const e of this.enemies.filter((q) => q.net && !seen.has(q.mobId))) this.scene.remove(e.g);
    this.enemies = this.enemies.filter((e) => !e.net || seen.has(e.mobId));
  }

  /** Ответ сервера на удар: синхронизировать HP сетевого моба. */
  netSyncHp(netId: number, hp: number): void {
    const e = this.enemies.find((q) => q.net && q.mobId === netId && !q.dead);
    if (!e) return;
    e.hp = Math.max(0, hp);
    e.maxhp = Math.max(e.maxhp, e.hp, 1);
    this.updateHpBar(e);
  }

  /** Сетевой фраг по ответу сервера: награда только здесь (фраг один на всех). god-мобы не умирают. */
  netKill(netId: number, reward = true): boolean {
    const e = this.enemies.find((q) => q.net && q.mobId === netId && !q.dead);
    if (!e || e.god) return false;
    e.dead = true;
    this.burst(e.g.position.x, 1.2, e.g.position.z, 10);
    this.scene.remove(e.g);
    if (!reward) { this.pushHud(); return true; }
    this.kills++;
    this.score += e.kind === 'boss' ? 500 + e.ewave * 10 : 100 + e.ewave * 10;
    this.fantiki += e.kind === 'boss' ? 100 : 10;
    this.addXp(e.kind === 'boss' ? 100 : 10);
    this.saveShop();
    this.pushHud();
    this.drawMM();
    return true;
  }

  /** Хост общей комнаты: слепок сервера сказал, что гости добили, — гасим
      локальные копии без награды (награда ушла убийце через freshKill) и
      тянем полосы к серверному пулу вниз. Иначе хост бьёт труп, а волна встаёт. */
  applyHostKills(list: RemoteMob[]): void {
    if (this.netSync) return;
    let changed = false;
    for (const m of list.slice(0, 60)) {
      const id = Math.floor(Number(m.id));
      if (!Number.isFinite(id)) continue;
      const e = this.enemies.find((q) => !q.net && q.mobId === id && !q.dead);
      if (!e) continue;
      if (m.dead === true || Math.max(0, Math.round(Number(m.hp) || 0)) <= 0) {
        e.dead = true;
        this.burst(e.g.position.x, 1.2, e.g.position.z, 10);
        this.scene.remove(e.g);
        changed = true;
        continue;
      }
      const sh = Math.max(0, Math.round(Number(m.hp) || 0));
      if (sh < e.hp) {
        e.hp = sh;
        this.updateHpBar(e);
        changed = true;
      }
    }
    if (!changed) return;
    this.waveClearCheck();
    this.enemies = this.enemies.filter((e) => !e.dead);
    this.pushHud();
    this.drawMM();
  }

  /** Обход стен: в лабиринте — BFS по клеткам топологии (знаем стены точно),
      на остальных картах — BFS по сетке 2м через hitSolid-оракул. Возвращает
      вейпоинты от врага к цели (без стартовой клетки). Нет пути — пусто (идём
      в лоб). Раньше лабиринт щупали геометрией 2м: 23 тысячи клеток, один поиск
      висел ~2 секунды — отсюда фризы каждые несколько секунд. Теперь тысячные
      доли секунды. Спрямление ниже гарантирует: каждый отрезок проходим телом. */
  private findPath(fx: number, fz: number, tx: number, tz: number, clr = 0.9, y = 0): Array<{ x: number; z: number }> {
    // ЛАБИРИНТ: идём по клеткам топологии (50×50 = 2500), а не щупаем геометрию.
    // Стены между клетками знаем точно — поиск занимает тысячные доли секунды,
    // а не 2 секунды как раньше. Спрямление ниже режет углы по прямой видимости.
    if (this.mazeN > 0 && (this.map === 'backrooms' || this.map === 'endless')) {
      const N = this.mazeN, S = this.mazeS, CM = S / N;
      const w2c = (v: number) => Math.max(0, Math.min(N - 1, Math.floor((v + S / 2) / CM)));
      const si = w2c(fx), sj = w2c(fz), ti = w2c(tx), tj = w2c(tz);
      if (si !== ti || sj !== tj) {
        const V = this.mazeV, H = this.mazeH;
        const key = (ix: number, iz: number) => ix * N + iz;
        const sk = key(si, sj), tk = key(ti, tj);
        const prev = new Map<number, number>();
        const seen = new Set<number>([sk]);
        const q: Array<[number, number]> = [[si, sj]];
        let qh = 0, found = false;
        while (qh < q.length) {
          const cur = q[qh++]!;
          if (key(cur[0], cur[1]) === tk) { found = true; break; }
          const cx = cur[0], cz = cur[1], ck = key(cx, cz);
          if (cx > 0 && !V[cx][cz]) { const k = key(cx - 1, cz); if (!seen.has(k)) { seen.add(k); prev.set(k, ck); q.push([cx - 1, cz]); } }
          if (cx < N - 1 && !V[cx + 1][cz]) { const k = key(cx + 1, cz); if (!seen.has(k)) { seen.add(k); prev.set(k, ck); q.push([cx + 1, cz]); } }
          if (cz > 0 && !H[cx][cz]) { const k = key(cx, cz - 1); if (!seen.has(k)) { seen.add(k); prev.set(k, ck); q.push([cx, cz - 1]); } }
          if (cz < N - 1 && !H[cx][cz + 1]) { const k = key(cx, cz + 1); if (!seen.has(k)) { seen.add(k); prev.set(k, ck); q.push([cx, cz + 1]); } }
        }
        if (found) {
          const cells: Array<[number, number]> = [];
          let c = tk, guard = 10000;
          while (c !== sk && guard-- > 0) {
            cells.push([Math.floor(c / N), c % N]);
            const p = prev.get(c);
            if (p === undefined) break;
            c = p;
          }
          cells.reverse();
          const ctr = (ix: number, iz: number) => ({ x: -S / 2 + (ix + 0.5) * CM, z: -S / 2 + (iz + 0.5) * CM });
          const pts: Array<{ x: number; z: number }> = [{ x: fx, z: fz }];
          for (const cl of cells) pts.push(ctr(cl[0], cl[1]));
          pts.push({ x: tx, z: tz });
          const losClear = (ax: number, az: number, bx: number, bz: number): boolean => {
            const d = Math.hypot(bx - ax, bz - az);
            const n = Math.max(1, Math.ceil(d / 0.5));
            for (let i = 1; i <= n; i++) {
              if (this.hitSolid(ax + ((bx - ax) * i) / n, az + ((bz - az) * i) / n, clr, y)) return false;
            }
            return true;
          };
          const out: Array<{ x: number; z: number }> = [];
          let anchor = 0;
          while (anchor < pts.length - 1) {
            let jump = anchor + 1;
            for (let k = anchor + 2; k < pts.length; k++) {
              if (losClear(pts[anchor].x, pts[anchor].z, pts[k].x, pts[k].z)) jump = k;
              else break;
            }
            out.push(pts[jump]);
            anchor = jump;
          }
          return out;
        }
        return [];
      }
      return [];
    }
    const CELL = 2, R = Math.ceil(this.half / CELL), OFF = 64;
    const gx = (v: number) => Math.max(-R, Math.min(R, Math.round(v / CELL)));
    const key = (ix: number, iz: number) => (ix + OFF) * 4096 + (iz + OFF);
    const unkey = (k: number) => ({ ix: Math.floor(k / 4096) - OFF, iz: (k % 4096) - OFF });
    const s = { ix: gx(fx), iz: gx(fz) }, t = { ix: gx(tx), iz: gx(tz) };
    // цель внутри стены (игрок вжался в дом): дёргаем цель на ближайшую
    // свободную клетку спиралью, иначе BFS заливает всю карту и возвращает [].
    // Именно это и душило кадры, когда ты упирался в стену, а орда шла к тебе.
    if (this.hitSolid(t.ix * CELL, t.iz * CELL, clr, y)) {
      let fixed = false;
      for (let ring = 1; ring <= 6 && !fixed; ring++) {
        for (let ax = -ring; ax <= ring && !fixed; ax++) {
          for (let az = -ring; az <= ring && !fixed; az++) {
            if (Math.max(Math.abs(ax), Math.abs(az)) !== ring) continue;
            const cix = t.ix + ax, ciz = t.iz + az;
            if (Math.abs(cix) > R || Math.abs(ciz) > R) continue;
            if (!this.hitSolid(cix * CELL, ciz * CELL, clr, y)) { t.ix = cix; t.iz = ciz; fixed = true; }
          }
        }
      }
      if (!fixed) return [];
    }
    const sk = key(s.ix, s.iz), tk = key(t.ix, t.iz);
    if (sk === tk) return [];
    const prev = new Map<number, number>();
    const seen = new Set<number>([sk]);
    const q: Array<[number, number]> = [[s.ix, s.iz]];
    const nb = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    // очередь указателем (без shift — иначе O(n²) на тысячах клеток)
    let qh = 0;
    let foundTk = false;
    // потолок заливки — вся сетка карты целиком: сталкер видит всю карту и строит
    // маршрут через неё полностью (тупики обходит, а не тыкается). Карманов без
    // прохода честно дают [], а не жуют кадр — BFS конечен размером сетки.
    const cap = (2 * R + 1) * (2 * R + 1);
    while (qh < q.length && q.length < cap) {
      const cur = q[qh++]!;
      if (key(cur[0], cur[1]) === tk) { foundTk = true; break; }
      for (const o of nb) {
        const nx = cur[0] + o[0], nz = cur[1] + o[1];
        if (Math.abs(nx) > R || Math.abs(nz) > R) continue;
        const k = key(nx, nz);
        if (seen.has(k)) continue;
        if (this.hitSolid(nx * CELL, nz * CELL, clr, y)) continue;
        // без среза углов: диагональ — только если обе ортогональные соседки свободны
        // ПЛЮС середина диагонали свободна: кончик стены (Т-стык лабиринта) может
        // стоять ровно на середине диагонали — центры соседок его не видят (дальше
        // метра), а тело 0.9 в него втыкается. Проверяем середину тем же радиусом.
        if (o[0] !== 0 && o[1] !== 0) {
          if (this.hitSolid((cur[0] + o[0]) * CELL, cur[1] * CELL, clr, y)) continue;
          if (this.hitSolid(cur[0] * CELL, (cur[1] + o[1]) * CELL, clr, y)) continue;
          if (this.hitSolid((cur[0] + o[0] / 2) * CELL, (cur[1] + o[1] / 2) * CELL, clr, y)) continue;
        }
        seen.add(k);
        prev.set(k, key(cur[0], cur[1]));
        q.push([nx, nz]);
      }
    }
    if (!foundTk) return [];
    const cells: Array<[number, number]> = [];
    let c = tk, guard = 10000;
    while (c !== sk && guard-- > 0) {
      const u = unkey(c);
      cells.push([u.ix, u.iz]);
      const p = prev.get(c);
      if (p === undefined) return [];
      c = p;
    }
    if (guard <= 0) return [];
    cells.reverse();
    // спрямление по прямой видимости (string pulling): от якоря — к самой дальней
    // видимой клетке. Моб идёт по чистым прямым, а не трётся о каждый центр клетки.
    const losClear = (ax: number, az: number, bx: number, bz: number): boolean => {
      const d = Math.hypot(bx - ax, bz - az);
      const n = Math.max(1, Math.ceil(d / 0.5));
      for (let i = 1; i <= n; i++) {
        if (this.hitSolid(ax + ((bx - ax) * i) / n, az + ((bz - az) * i) / n, clr, y)) return false;
      }
      return true;
    };
    const pts: Array<{ x: number; z: number }> = [{ x: fx, z: fz }];
    for (const cl of cells) pts.push({ x: cl[0] * CELL, z: cl[1] * CELL });
    pts.push({ x: t.ix * CELL, z: t.iz * CELL });
    const out: Array<{ x: number; z: number }> = [];
    let anchor = 0;
    while (anchor < pts.length - 1) {
      let jump = anchor + 1;
      for (let k = anchor + 2; k < pts.length; k++) {
        if (losClear(pts[anchor].x, pts[anchor].z, pts[k].x, pts[k].z)) jump = k;
        else break;
      }
      out.push(pts[jump]);
      anchor = jump;
    }
    return out;
  }

  // круг (игрок/враг радиусом rad на высоте y) против окружения: коробка — точный AABB,
  // круглое — точный радиус, и только если сущность НИЖЕ верха (y <= h+0.4).
  // Хитбокс не выходит за текстуру и не тянется до неба: перепрыгнуть/перелететь можно.
  private hitSolid(x: number, z: number, rad: number, y = 0): boolean {
    const C = Game.GRID;
    const cx = Math.floor(x / C), cz = Math.floor(z / C);
    // кандидаты из 3×3 клеток; сетка пуста (карта без стен) — полный проход
    let found = false;
    for (let ix = cx - 1; ix <= cx + 1 && !found; ix++) {
      for (let iz = cz - 1; iz <= cz + 1; iz++) {
        const cell = this.solidGrid.get(ix + ':' + iz);
        if (cell && cell.length > 0) { found = true; break; }
      }
    }
    if (found) {
      const seen: typeof this.solids = [];
      for (let ix = cx - 1; ix <= cx + 1; ix++) {
        for (let iz = cz - 1; iz <= cz + 1; iz++) {
          const cell = this.solidGrid.get(ix + ':' + iz);
          if (!cell) continue;
          for (const s of cell) {
            if (seen.indexOf(s) >= 0) continue;
            seen.push(s);
            if (this.solidHit(s, x, z, rad, y)) return true;
          }
        }
      }
      return false;
    }
    for (const s of this.solids) if (this.solidHit(s, x, z, rad, y)) return true;
    return false;
  }

  private solidHit(s: (typeof this.solids)[number], x: number, z: number, rad: number, y: number): boolean {
    if (y > s.h + 0.4) return false;
    // стоишь на верху объекта — это пол, а не стена: идём свободно
    if (y >= s.h - 0.1) return false;
      if ('r' in s) {
        const dx = x - s.x, dz = z - s.z;
        if (dx * dx + dz * dz < (s.r + rad) * (s.r + rad)) return true;
      } else {
        // настил: пока ты ниже него — проходишь под мостом свободно
        if (s.deck && y < s.h - 0.5) return false;
        const cx = Math.max(s.x - s.hx, Math.min(x, s.x + s.hx));
        const cz = Math.max(s.z - s.hz, Math.min(z, s.z + s.hz));
        const dx = x - cx, dz = z - cz;
        if (dx * dx + dz * dz < rad * rad) return true;
      }
    return false;
  }

  /** Звуки МТТ (его файлы): выстрел, удар, отскок Крысы. Молчит при выключенном звуке. Громкость — vol × общий слайдер. */
  private sfxCache: Record<string, HTMLAudioElement> = {};
  private sfx(url: string, vol = 0.7): void {
    if (!this.soundOn || this.volume <= 0.01) return;
    try {
      let a = this.sfxCache[url];
      if (!a) {
        a = new Audio(url);
        a.preload = 'auto';
        this.sfxCache[url] = a;
      }
      a.volume = Math.max(0, Math.min(1, vol * this.volume));
      a.currentTime = 0;
      void a.play().catch(() => undefined);
    } catch { /* noop */ }
  }

  /** Топот: процедурный шаг через WebAudio (ассетов нет — короткий шумовой тап).
      Игрок — глухой средний, враги — выше/тише, громкость тает с дистанцией. */
  private stepCtx: AudioContext | null = null;
  private stepBuf: AudioBuffer | null = null;
  private stepN = 0;
  private eStepN = 0;
  private stepSound(vol: number, pitch: number): void {
    if (!this.soundOn || this.volume <= 0.01 || vol <= 0.01) return;
    try {
      if (!this.stepCtx) this.stepCtx = new AudioContext();
      const ctx = this.stepCtx;
      if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
      if (!this.stepBuf) {
        const n = Math.max(1, Math.floor(ctx.sampleRate * 0.07));
        this.stepBuf = ctx.createBuffer(1, n, ctx.sampleRate);
        const ch = this.stepBuf.getChannelData(0);
        for (let i = 0; i < n; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.5);
      }
      const src = ctx.createBufferSource();
      src.buffer = this.stepBuf;
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = pitch;
      const g = ctx.createGain();
      g.gain.value = Math.min(0.4, vol * this.volume);
      src.connect(f); f.connect(g); g.connect(ctx.destination);
      src.start();
    } catch { /* noop */ }
  }

  debugSteps(): { me: number; foes: number } { return { me: this.stepN, foes: this.eStepN }; }

  /** Сброс прогресса на диск: фантики/стволы (шоп) + кач (апгрейды). Вызывать перед выходом в меню. */
  flushProgress(): void {
    this.saveShop();
    this.saveUpg();
  }

  private pushHud(): void {
    let alive = 0, bosses = 0;
    for (const e of this.enemies) {
      if (e.dead) continue;
      alive++;
      if (e.kind === 'boss') bosses++;
    }
    this.ev.onHud({
      hp: Math.max(0, Math.round(this.hp)),
      maxhp: this.maxhp,
      score: this.score,
      kills: this.kills,
      enemies: alive,
      wave: this.wave,
      dead: this.dead,
      fantiki: this.fantiki,
      weapon: this.weaponId,
      owned: [...this.owned],
      moving: this.moving,
      med: this.medkits,
      lvl: this.level(),
      boss: bosses,
      dash: Math.round(this.dashCd * 10) / 10,
      kick: Math.round(this.wallKickCd * 10) / 10,
      invis: Math.round(this.invisT * 10) / 10,
      invisCd: Math.round(this.invisCd * 10) / 10,
      chuma: Math.round(this.chumaT * 10) / 10,
      chumaCd: Math.round(this.chumaCd * 10) / 10,
      xray: Math.round(this.xrayT * 10) / 10,
      xrayCd: Math.round(this.xrayCd * 10) / 10,
      fps: Math.round(this.fpsE),
      quality: this.quality,
      doorPulse: this.doorPulse,
    });
  }

  debugFps(): number { return Math.round(this.fpsE); }

  private drawMM(): void {
    if (!this.mmCanvas) return;
    const c = this.mmCanvas;
    const g = c.getContext('2d');
    if (!g) return;
    const W = c.width, H = c.height;
    g.fillStyle = 'rgba(4,8,16,.9)';
    g.fillRect(0, 0, W, H);
    const toMap = (x: number, z: number): [number, number] => [
      W / 2 + (x / (this.half + 4)) * (W / 2 - 4),
      H / 2 + (z / (this.half + 4)) * (H / 2 - 4),
    ];
    g.fillStyle = '#ff9f1c';
    const [mx, mz] = toMap(this.px, this.pz);
    g.beginPath(); g.arc(mx, mz, 4, 0, Math.PI * 2); g.fill();
    // дверь выхода — зелёный квадрат (бэкрумс): видно, куда бежать.
    // Маяк: раз в минуту 5 секунд — квадрат вдвое больше и золотой.
    if (this.door) {
      const [dx, dz] = toMap(this.door.x, this.door.z);
      g.fillStyle = this.doorPulse ? '#ffd166' : '#39d353';
      const s = this.doorPulse ? 6 : 3;
      g.fillRect(dx - s, dz - s, s * 2, s * 2);
    }
    g.fillStyle = '#ff3b3b';
    for (const e of this.enemies) {
      if (e.dead) continue;
      const [ex, ez] = toMap(e.g.position.x, e.g.position.z);
      g.fillRect(ex - 2, ez - 2, 4, 4);
    }
  }

  private charTexCache: Record<string, THREE.Texture> = {};

  private charTexture(id: string): THREE.Texture {
    const key = id === 'krysa' ? 'krysa' : id === 'shuba' ? 'shuba' : id === 'chuma' ? 'chuma' : id === 'gidroxis' ? 'gidroxis' : 'mtt';
    let t = this.charTexCache[key];
    if (!t) {
      t = new THREE.TextureLoader().load(key === 'krysa' ? charKrysaUrl : key === 'shuba' ? charShubaUrl : key === 'chuma' ? charChumaUrl : key === 'gidroxis' ? charGidroxisUrl : charMttUrl);
      t.colorSpace = THREE.SRGBColorSpace;
      this.charTexCache[key] = t;
    }
    return t;
  }

  // сокомнатники: полноценные бойцы, а не призраки — тело в цвете, ствол в руках,
  // удары вспышкой, прыжки высотой, смерти лежачими (позиции с сервера комнаты)
  /** Буфер слепков: положить точку, держать последние 8. Точный дубль
      выбрасываем — иначе рендер ползёт через нулевой сегмент (пауза). */
  private snapPush(snaps: Array<{ t: number; x: number; z: number }>, t: number, x: number, z: number): void {
    const last = snaps[snaps.length - 1];
    if (last && last.x === x && last.z === z) return;
    snaps.push({ t, x, z });
    if (snaps.length > 8) snaps.splice(0, snaps.length - 8);
  }

  /** Позиция в момент rt по буферу: между слепками — линейно, телепорт >20м — снап. */
  private snapAt(snaps: Array<{ t: number; x: number; z: number }>, rt: number, fx: number, fz: number): { x: number; z: number } {
    const n = snaps.length;
    if (n === 0) return { x: fx, z: fz };
    if (rt <= snaps[0].t) return { x: snaps[0].x, z: snaps[0].z };
    for (let i = 0; i + 1 < n; i++) {
      const a = snaps[i], b = snaps[i + 1];
      if (rt >= a.t && rt <= b.t) {
        const dx = b.x - a.x, dz = b.z - a.z;
        if (dx * dx + dz * dz > 400) return { x: b.x, z: b.z };
        const k = b.t > a.t ? (rt - a.t) / (b.t - a.t) : 1;
        return { x: a.x + dx * k, z: a.z + dz * k };
      }
    }
    const last = snaps[n - 1];
    const prev = snaps[n - 2];
    // слепки кончились (пропуск пульса): тянемся дальше с той же скоростью, не стоим.
    // Прогноз max 0.5с — дальше замираем на последнем слепке, а не улетаем в мусор.
    if (prev && last.t > prev.t) {
      const dt = last.t - prev.t;
      const extra = Math.min(rt - last.t, 500) / dt;
      return { x: last.x + (last.x - prev.x) * extra, z: last.z + (last.z - prev.z) * extra };
    }
    return { x: last.x, z: last.z };
  }

  setRemotes(list: RemotePlayer[]): void {
    const seen = new Set<string>();
    for (const p of list.slice(0, 12)) {
      const nick = String(p.nick ?? '').slice(0, 20) || 'Братуха';
      // ключ строя: fid с сервера (уникален), иначе ник (соло/дуэль)
      const pfid0 = Math.floor(Number(p.fid));
      const key = Number.isFinite(pfid0) && pfid0 >= 0 ? 'fid:' + pfid0 : 'nick:' + nick;
      seen.add(key);
      const char = p.char === 'krysa' ? 'krysa' : p.char === 'shuba' ? 'shuba' : p.char === 'chuma' ? 'chuma' : p.char === 'gidroxis' ? 'gidroxis' : 'mtt';
      const weapon = p.weapon === 'bat' || p.weapon === 'axe' || p.weapon === 'pistol' || p.weapon === 'shotgun' ? p.weapon : 'fists';
      let r: Remote | undefined = undefined;
      for (const q of this.remotes) {
        const qk = q.fid >= 0 ? 'fid:' + q.fid : 'nick:' + q.nick;
        if (qk === key) { r = q; break; }
      }
      if (!r) {
        const g = new THREE.Group();
        const body = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.charTexture(char), transparent: true }));
        body.scale.set(1.4, 2.0, 1);
        body.position.set(0, 1.0, 0);
        g.add(body);
        // белый контур рентгена: как у мобов, только белый — своих видно сквозь стены
        const ol = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.charTexture(char), transparent: true, color: 0xffffff, opacity: 0.9, depthTest: false, depthWrite: false }));
        ol.visible = false;
        ol.renderOrder = -1;
        ol.position.copy(body.position);
        ol.scale.set(body.scale.x * 1.18, body.scale.y * 1.18, 1);
        g.add(ol);
        const gunCv = document.createElement('canvas');
        gunCv.width = 64; gunCv.height = 64;
        const gunTex = new THREE.CanvasTexture(gunCv);
        const gun = new THREE.Sprite(new THREE.SpriteMaterial({ map: gunTex, depthTest: false, transparent: true }));
        gun.scale.set(0.8, 0.8, 1);
        gun.position.set(0.85, 0.7, 0);
        gun.renderOrder = 5;
        g.add(gun);
        const cv = document.createElement('canvas');
        cv.width = 128; cv.height = 48;
        const ltex = new THREE.CanvasTexture(cv);
        const lab = new THREE.Sprite(new THREE.SpriteMaterial({ map: ltex, depthTest: true, transparent: true }));
        lab.scale.set(1.9, 0.72, 1);
        lab.position.set(0, 2.5, 0);
        g.add(lab);
        this.scene.add(g);
        r = { nick, g, body, ol, cv, tex: ltex, gunCv, gunTex, x: 0, z: 0, yaw: 0, tx: 0, tz: 0, snaps: [], hp: 100, char, weapon: '', py: 0, atk: 0, flash: 0, dead: false, fid: -1 };
        this.gunIcon(weapon, gunCv, gunTex);
        r.weapon = weapon;
        this.remotes.push(r);
      } else {
        if (r.nick !== nick) r.nick = nick;
        if (r.char !== char) {
          r.char = char;
          r.body.material.map = this.charTexture(char);
          r.body.material.needsUpdate = true;
          r.ol.material.map = this.charTexture(char);
          r.ol.material.needsUpdate = true;
        }
        if (r.weapon !== weapon) {
          r.weapon = weapon;
          this.gunIcon(weapon, r.gunCv, r.gunTex);
        }
      }
      const rr: Remote = r;
      // слепок в буфер: рендерим прошлое — движение непрерывно при рваных битах
      rr.tx = this.clamp(Number(p.x) || 0);
      rr.tz = this.clamp(Number(p.z) || 0);
      const nowMs = performance.now();
      this.snapPush(rr.snaps, nowMs, rr.tx, rr.tz);
      if (rr.x === 0 && rr.z === 0 && (rr.tx !== 0 || rr.tz !== 0)) { rr.x = rr.tx; rr.z = rr.tz; }
      rr.hp = Math.max(0, Math.min(100, Number(p.hp) || 0));
      rr.py = Math.max(0, Math.min(30, Number(p.py) || 0));
      const yawV = Number(p.yaw);
      if (Number.isFinite(yawV)) rr.yaw = Math.max(-10, Math.min(10, yawV));
      const atk = Math.max(0, Math.floor(Number(p.atk) || 0));
      if (atk !== rr.atk) {
        rr.atk = atk;
        rr.flash = 0.3;
        // чужая пуля: светящаяся линия от куклы по её взгляду — видно, кто куда стреляет.
        // Ближний бой (кулаки/бита/секира) — только дёрганье телом, линию не рисуем.
        if (!rr.dead && (rr.weapon === 'pistol' || rr.weapon === 'shotgun')) {
          const len = rr.weapon === 'shotgun' ? 20 : 30;
          const dx = -Math.sin(rr.yaw), dz = -Math.cos(rr.yaw);
          const sx = rr.tx, sy = 1.4 + rr.py, sz = rr.tz;
          this.burst(sx + dx, sy, sz + dz, 3);
          if (rr.weapon === 'shotgun') {
            // веер дроби: центр + два боковых луча
            for (const a of [-0.09, 0, 0.09]) {
              const c = Math.cos(a), s = Math.sin(a);
              this.tracer(sx, sy, sz, sx + (dx * c - dz * s) * len, sy, sz + (dx * s + dz * c) * len);
            }
          } else {
            this.tracer(sx, sy, sz, sx + dx * len, sy, sz + dz * len);
          }
        }
      }
      rr.dead = p.dead === true;
      const pfid = Math.floor(Number(p.fid));
      rr.fid = Number.isFinite(pfid) && pfid >= 0 ? pfid : -1;
      this.drawRemote(rr);
    }
    this.remotes = this.remotes.filter((r) => {
      const k = r.fid >= 0 ? 'fid:' + r.fid : 'nick:' + r.nick;
      if (!seen.has(k)) { this.scene.remove(r.g); return false; }
      return true;
    });
  }

  /** Значок ствола сокомнатника: эмодзи на прозрачном — чётко и без боксов. */
  private gunIcon(weapon: string, cv: HTMLCanvasElement, tex: THREE.CanvasTexture): void {
    const g = cv.getContext('2d')!;
    g.clearRect(0, 0, cv.width, cv.height);
    g.font = '48px serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(GUNEMOJI[weapon] ?? '👊', 32, 34);
    tex.needsUpdate = true;
  }

  private drawRemote(r: Remote): void {
    const g = r.cv.getContext('2d')!;
    g.fillStyle = '#101018';
    g.fillRect(0, 0, 128, 48);
    g.font = 'bold 17px monospace';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillStyle = r.dead ? '#888888' : '#ffd23f';
    g.fillText((r.dead ? '💀 ' : '') + (GUNEMOJI[r.weapon] ?? '') + ' ' + r.nick.slice(0, 10), 64, 13);
    g.fillStyle = '#000';
    g.fillRect(14, 26, 100, 14);
    g.fillStyle = r.dead ? '#555555' : '#39d353';
    g.fillRect(16, 28, 96 * (r.hp / 100), 10);
    r.tex.needsUpdate = true;
  }

  debugRemotes(): number { return this.remotes.length; }
  /** Сколько линий пуль сейчас висит в кадре (для тестов). */
  debugTracers(): number { return this.tracers.length; }

  // хуки для тестов
  debugPos(): { x: number; z: number; hp: number; enemies: number; kills: number; wave: number; yaw: number; py: number; pitch: number } {
    return {
      x: Math.round(this.px * 10) / 10,
      z: Math.round(this.pz * 10) / 10,
      hp: Math.round(this.hp),
      enemies: this.enemies.filter((e) => !e.dead).length,
      kills: this.kills,
      wave: this.wave,
      yaw: Math.round(this.yaw * 100) / 100,
      py: Math.round(this.py * 100) / 100,
      pitch: Math.round(this.pitch * 100) / 100,
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
    if (this.shieldT > 0 || this.devGod) return Math.round(this.hp);
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
  debugSolidAt(x: number, z: number, y: number, r = 0.9): boolean {
    return this.hitSolid(Number(x) || 0, Number(z) || 0, Number(r) > 0 ? Number(r) : 0.9, Number(y) || 0);
  }
  /** Тест-контракт обхода: вейпоинты BFS от точки к точке (чистая функция, без времени). */
  debugPath(fx: number, fz: number, tx: number, tz: number): Array<{ x: number; z: number }> {
    return this.findPath(Number(fx) || 0, Number(fz) || 0, Number(tx) || 0, Number(tz) || 0);
  }

  // высота опоры под ногами: верх самого высокого объекта в этой точке (крыши, мосты, ступени).
  // rad расширяет поиск: для перешагивания смотрим опору впереди по курсу.
  groundAt(x: number, z: number, rad = 0): number {
    let g = 0;
    // опора всегда под ногами — берём кандидатов из сетки 3×3, а не все солиды.
    // Раньше тут был полный проход по this.solids при КАЖДОМ вызове, а у стены
    // вызовов 3 за кадр (посадка + 2 степ-проверки) — отсюда и просадка в упор.
    const C = Game.GRID;
    const cx = Math.floor(x / C), cz = Math.floor(z / C);
    const seen: typeof this.solids = [];
    for (let ix = cx - 1; ix <= cx + 1; ix++) {
      for (let iz = cz - 1; iz <= cz + 1; iz++) {
        const cell = this.solidGrid.get(ix + ':' + iz);
        if (!cell) continue;
        for (const s of cell) {
          if (seen.indexOf(s) >= 0) continue;
          seen.push(s);
          if ('r' in s) {
            const dx = x - s.x, dz = z - s.z;
            if (dx * dx + dz * dz <= (s.r + rad) * (s.r + rad) && s.h > g) g = s.h;
          } else {
            if (Math.abs(x - s.x) <= s.hx + rad && Math.abs(z - s.z) <= s.hz + rad && s.h > g) g = s.h;
          }
        }
      }
    }
    return g;
  }

  debugGround(x: number, z: number): number {
    return this.groundAt(Number(x) || 0, Number(z) || 0);
  }

  private loop = (): void => {
    if (this.destroyed) return;
    this.raf = requestAnimationFrame(this.loop);
    const tLoop = performance.now();
    const dt = Math.min(this.clock.getDelta(), 0.05);
    // FPS-метр (сглаживание) + свежий бюджет BFS на кадр
    if (dt > 0.0005) this.fpsE += (1 / dt - this.fpsE) * 0.05;
    this.bfsBudget = 5;
    this.frame++;
    // жуть Бэкрумса: мигание ламп + фонарь (только если карта их завела)
    if (this.torch || this.lampFlicker.length > 0) this.updateLamps(dt);
    // купол Чумы — каждый кадр (виден, пока облако висит; смерть и меню гасят)
    this.syncChumaDome();
    // рентген Гидроксиса тикает + щёлкает видимость сквозь стены каждый кадр
    if (this.xrayT > 0) {
      this.xrayT -= dt;
      if (this.xrayT <= 0) { this.xrayT = 0; this.pushHud(); }
      else if (Math.floor(this.xrayT * 2) !== Math.floor((this.xrayT + dt) * 2)) this.pushHud();
    }
    if (this.xrayCd > 0) {
      this.xrayCd -= dt;
      if (this.xrayCd <= 0) { this.xrayCd = 0; this.pushHud(); }
      else if (Math.floor(this.xrayCd * 5) !== Math.floor((this.xrayCd + dt) * 5)) this.pushHud();
    }
    this.syncXray();
    this.syncHit();
    // авто-качество: 4с просадки ниже 28 FPS — тихо спускаемся на ступень (high → medium → low)
    if (this.started) {
      if (this.fpsE < 28 && this.quality !== 'low') this.lowT += dt;
      else this.lowT = 0;
      if (this.lowT > 4) {
        this.lowT = 0;
        this.setQuality(this.quality === 'high' ? 'medium' : 'low');
      }
    }
    // Бой и движение — живым; НАБЛЮДАТЕЛЬ (и мёртвый тоже) идёт здесь же:
    // в наблюдатели попадают именно мёртвыми, а полёт/камера/следование живут ниже.
    // Защита от трупных артефактов — внутри: attack/jump/абилки/урон проверяют specOn/dead сами.
    if (this.started && (!this.dead || this.specOn)) {
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
      // прыжок: с земли — вверх (с любой опоры: земля, крыша, мост).
      // Вол-кик Крысы — на C (способность), не на прыжке.
      // Наблюдатель не прыгает: камера висит на цели.
      if (this.input[km.jump] && !this.specOn) {
        if (this.py <= this.groundAt(this.px, this.pz) + 0.01) {
          this.pvy = this.jumpVel;
        }
      }
      // вол-кик Стейси Крысы на C: в полёте у стены — разворот с подбросом (кд 5с).
      // Кик швыряет ПРОТИВ движения; если стоишь — толчок от стены.
      if (this.input[km.ability] && this.charId === 'krysa' && !this.specOn) {
        this.input[km.ability] = false;
        if (this.wallT > 0 && this.wallKickCd <= 0 && this.py > 0.05) {
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
          // ...и толчок ровно против него (дальность качается: +15% за уровень супера)
          const krange = 2.2 * superRange(this.upg.krysa?.sup ?? 0);
          const kx = this.clamp(this.px + mx * krange);
          const kz = this.clamp(this.pz + mz * krange);
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
          this.wallKickCd = superCd('krysa', this.upg.krysa?.sup ?? 0);
          this.burst(this.px, 1.0, this.pz, 10);
          this.sfx(wallkickUrl);
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
      // способность на C: Крыса — вол-кик (съедено выше), Шуба-Ивангой — несутка, остальные — рывок МТТ.
      // Наблюдатель способностей не жмёт.
      if (this.input[km.ability] && this.charId !== 'krysa' && !this.specOn) {
        this.input[km.ability] = false;
        if (this.charId === 'shuba') this.invis(); else if (this.charId === 'chuma') this.chuma(); else if (this.charId === 'gidroxis') this.xray(); else this.dash();
      }
      // NOTE: призраку input.ability НЕ чистим — это его спуск (C) в flySpec ниже.
      if (this.dashCd > 0) this.dashCd -= dt;
      // несутка тикает: кончилась — сбрасываем HUD (враги снова видят)
      if (this.invisT > 0) {
        this.invisT -= dt;
        if (this.invisT <= 0) { this.invisT = 0; this.pushHud(); }
        else if (Math.floor(this.invisT * 5) !== Math.floor((this.invisT + dt) * 5)) this.pushHud();
      }
      if (this.invisCd > 0) {
        this.invisCd -= dt;
        if (this.invisCd <= 0) { this.invisCd = 0; this.pushHud(); }
        else if (Math.floor(this.invisCd * 5) !== Math.floor((this.invisCd + dt) * 5)) this.pushHud();
      }
      // облако тикает: висит — травим округу в ветке врагов, кончилось — сброс HUD
      if (this.chumaT > 0) {
        this.chumaT -= dt;
        if (this.chumaT <= 0) { this.chumaT = 0; this.pushHud(); }
        else {
          this.chumaFxT -= dt;
          if (this.chumaFxT <= 0) { this.chumaFxT = 0.4; this.burst(this.px, 0.8, this.pz, 6); }
          if (Math.floor(this.chumaT * 2) !== Math.floor((this.chumaT + dt) * 2)) this.pushHud();
        }
      }
      if (this.chumaCd > 0) {
        this.chumaCd -= dt;
        if (this.chumaCd <= 0) { this.chumaCd = 0; this.pushHud(); }
        else if (Math.floor(this.chumaCd * 5) !== Math.floor((this.chumaCd + dt) * 5)) this.pushHud();
      }
      // смена оружия на назначенной клавише (по умолчанию E) — только купленное; призрак не меняет
      if (!this.specOn && (this.input[km.switch] || this.input.KeyE)) {
        this.input[km.switch] = false;
        this.input.KeyE = false;
        this.switchWeapon();
      }
      // аптечка на назначенной клавише (по умолчанию X); призрак не лечится
      if (!this.specOn && (this.input[km.use] || this.input.KeyX)) {
        this.input[km.use] = false;
        this.input.KeyX = false;
        this.useMedkit();
      }
      // движение: назначенные клавиши + стрелки + джойстик.
      // Наблюдатель: ноги стоят, камера летит сама сквозь стены (WASD — полёт, Space/C — вверх/вниз).
      let f = (this.input[km.fwd] || this.input.ArrowUp ? 1 : 0) - (this.input[km.back] || this.input.ArrowDown ? 1 : 0) - this.joy.y;
      let r = (this.input[km.right] ? 1 : 0) - (this.input[km.left] ? 1 : 0) + this.joy.x;
      if (this.specOn) {
        // ноги стоят; ПОЛЁТ — ниже, вне ворот !dead (мёртвый наблюдатель тоже летит)
        f = 0; r = 0;
      }
      f = Math.max(-1, Math.min(1, f));
      r = Math.max(-1, Math.min(1, r));
      // бросок летит сам: кнопки на время полёта глушим
      if (this.blastT > 0) { f = 0; r = 0; }
      const run = this.input[km.run] || this.input.ShiftLeft || this.input.ShiftRight;
      const sp = (run ? 8.2 : 5.6) * this.charSpd;
      const len = Math.hypot(f, r);
      this.moving = len > 0.15;
      if (this.moving) {
        this.shieldT = 0;
        this.bobPhase += dt * 11;
        // топот: на земле — шаг каждые ~0.4с (бег чаще), в полёте тишина
        const onGround = this.py <= this.groundAt(this.px, this.pz) + 0.05;
        this.stepT -= dt;
        if (onGround && this.stepT <= 0) {
          this.stepT = run ? 0.32 : 0.44;
          this.stepN++;
          this.stepSound(0.25, 500 + Math.random() * 150);
        }
      }
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
          // hitSolid(nx,pz) уже проверен в условии выше — второй раз не щупаем
          this.px = this.clamp(nx);
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
      // дальность качается: +15% за уровень супера
      if (this.dashT > 0) {
        this.dashT -= dt;
        const dspd = 22 * superRange(this.upg.mtt?.sup ?? 0);
        const nx = this.px + this.dashDx * dspd * dt;
        const nz = this.pz + this.dashDz * dspd * dt;
        if (!this.hitSolid(nx, this.pz, 0.9, this.py)) this.px = this.clamp(nx);
        if (!this.hitSolid(this.px, nz, 0.9, this.py)) this.pz = this.clamp(nz);
        this.py = Math.max(0, this.py + this.dashDy * dspd * dt);
        this.pvy = 0;
        if (!this.moving) this.bobPhase += dt * 11;
      } else {
        // бросок от дробовика: видимый полёт против выстрела (гравитация работает),
        // в стену вмазался — бросок кончился, камера тряхнула
        if (this.blastT > 0) {
          this.blastT -= dt;
          const bnx = this.px + this.blastDx * dt;
          if (this.hitSolid(bnx, this.pz, 0.9, this.py)) { this.blastT = 0; this.blastDx = 0; this.blastDz = 0; this.shakeT = 0.35; }
          else this.px = this.clamp(bnx);
          const bnz = this.pz + this.blastDz * dt;
          if (this.hitSolid(this.px, bnz, 0.9, this.py)) { this.blastT = 0; this.blastDx = 0; this.blastDz = 0; this.shakeT = 0.35; }
          else this.pz = this.clamp(bnz);
          if (this.blastT <= 0) { this.blastDx = 0; this.blastDz = 0; }
        }
        this.pvy -= 12 * dt;
        this.py += this.pvy * dt;
        // Бэкрумс: потолок 3м — головой не пробивать (глаза 1.7м + прыжок)
        if ((this.map === 'backrooms' || this.map === 'endless') && this.py > 1.2) { this.py = 1.2; this.pvy = Math.min(0, this.pvy); }
        // приземление на опору под ногами: земля, крыша, мост, ступень (бросок гасим)
        const g = this.groundAt(this.px, this.pz);
        if (this.py <= g) { this.py = g; this.pvy = 0; this.blastT = 0; this.blastDx = 0; this.blastDz = 0; }
        // наблюдатель: тело держим под картой, чтобы чужие куклы его не видели
        if (this.specOn) { this.py = -60; this.pvy = 0; }
      }
      // НАБЛЮДАТЕЛЬ летит здесь (ворота выше расширены на specOn): WASD — полёт,
      // стрелки-поворот — выше, Space/C — вверх/вниз внутри flySpec.
      if (this.specOn && this.started) {
        const km2 = this.keyMap;
        const sf = (this.input[km2.fwd] || this.input.ArrowUp ? 1 : 0) - (this.input[km2.back] || this.input.ArrowDown ? 1 : 0) - this.joy.y;
        const sr = (this.input[km2.right] ? 1 : 0) - (this.input[km2.left] ? 1 : 0) + this.joy.x;
        this.flySpec(sf, sr, dt);
      }
      // МАЯК ДВЕРИ: раз в минуту 5 секунд — ЗЕЛЁНОЕ мигание СКВОЗЬ СТЕНЫ + баннер
      // всем (бойцам и наблюдателям). Синхрон по сиду комнаты: у всех одна фаза.
      if (this.doorMode && this.doorMesh) {
        const natural = this.started && (((Date.now() / 1000) + (this.mapSeed % 60)) % 60) < 5;
        const on = this.doorPulseForce !== null ? (this.started && this.doorPulseForce) : natural;
        const dm = this.doorMesh.material as THREE.MeshBasicMaterial;
        if (on !== this.doorPulse) {
          this.doorPulse = on;
          if (on) {
            // дверь поверх всего: видно сквозь стены; туман дверь не прячет
            dm.color.set(0x39d353);
            dm.transparent = true;
            dm.depthTest = false;
            dm.fog = false;
            dm.needsUpdate = true;
            this.doorMesh.renderOrder = 999;
          } else {
            dm.color.set(0xffffff);
            dm.transparent = false;
            dm.opacity = 1;
            dm.depthTest = true;
            dm.fog = true;
            dm.needsUpdate = true;
            this.doorMesh.renderOrder = 0;
            if (this.doorGlow) this.doorGlow.intensity = 0;
          }
          this.pushHud();
        }
        if (on) {
          // мигание ~2 раза в секунду: только сама дверь + лёгкая вспышка рядом
          const bl = Math.floor(Date.now() / 500) % 2 === 0;
          dm.opacity = bl ? 1 : 0.25;
          if (this.doorGlow) { this.doorGlow.color.set(0x39d353); this.doorGlow.intensity = bl ? 18 : 4; }
        }
      }
      // дверь выхода: живой боец КОСНУЛСЯ — один раз за забег (призрак мимо).
      // Честное касание: вплотную (1.4м) И со стороны коридора, куда дверь смотрит.
      // Сквозь стену (с чужой стороны) не засчитывает.
      // Дальше — баннер «ты выбрался» + награда (App через onEscape).
      if (this.doorMode && this.door && !this.escapedFired && !this.specOn && !this.dead && this.started) {
        const ddx = this.px - this.door.x, ddz = this.pz - this.door.z;
        const dd = Math.hypot(ddx, ddz);
        if (dd < 1.4 && ddx * this.doorFace.x + ddz * this.doorFace.z > -0.3) {
          this.escapedFired = true;
          try { this.ev.onEscape?.(); } catch { /* noop */ }
        }
      }
      // наблюдатель: камеру держим на живом каждый кадр (цель бежит — летим за ней)
      this.updateSpecFollow();
      // враги идут к игроку и бьют в упор; сетевые куклы — догоняют точку хоста
      for (const e of this.enemies) {
        if (e.dead) continue;
        // наблюдателя и несутку-Ивангоя враги не видят: себя из целей убираем, бьём только живых бойцов.
        // ВСЕ местные (и сталкеры, и обычные) идут к ближайшему живому — себе или
        // сокомнатнику. Раньше обычные шли только на хоста, а второй игрок для них
        // был пустым местом. Урон считает клиент жертвы (см. huntingRemote ниже).
        const hidden = this.specOn || this.invisT > 0;
        let txp = hidden ? Infinity : this.px, tzp = hidden ? Infinity : this.pz;
        let huntingRemote = false;
        if (hidden) {
          // только живые сокомнатники; нет живых — проваливаемся в стойбище ниже
          // (маршрут чистим, BFS-бюджет не жрём)
          let bd = Infinity;
          for (const r of this.remotes) {
            if (r.dead) continue;
            const rd = Math.hypot(r.x - e.g.position.x, r.z - e.g.position.z);
            if (rd < bd) { bd = rd; txp = r.x; tzp = r.z; huntingRemote = true; }
          }
        } else if (!e.net) {
          let bd = Math.hypot(txp - e.g.position.x, tzp - e.g.position.z);
          for (const r of this.remotes) {
            if (r.dead) continue;
            const rd = Math.hypot(r.x - e.g.position.x, r.z - e.g.position.z);
            if (rd < bd) { bd = rd; txp = r.x; tzp = r.z; huntingRemote = true; }
          }
        }
        // цели нет вообще (наблюдатель один на карте / все сокомнатники мертвы):
        // стоим на месте, маршрут чистим, BFS-бюджет НЕ трогаем. Иначе толпа идёт
        // в угол карты (Infinity режется клампом в R) и съедает все 5 BFS на кадр —
        // после этого живые мобы маршрут не получают и тыкаются в стены.
        if (!Number.isFinite(txp) || !Number.isFinite(tzp)) {
          e.path = [];
          e.repathT = 0.3;
          e.stuckT = 0;
          e.slideT = 0;
          if (e.hitCd > 0) e.hitCd -= dt;
          e.phase += dt * (2 + e.speed);
          continue;
        }
        const dx = txp - e.g.position.x;
        const dz = tzp - e.g.position.z;
        const d = Math.hypot(dx, dz) || 1;
        if (e.net) {
          // кукла: прошлое по буферу хоста (без «догнал—стою» при рваных битах).
          // Слепки хоста стен не знают — ведём куклу со скольжением вдоль стен,
          // иначе на экране гостя мобы идут СКВОЗЬ стены. Высота летуна своя.
          const mp = this.snapAt(e.snaps, performance.now() - 550, e.tx, e.tz);
          const eyH = e.kind === 'fly' ? 3.2 : e.ey;
          const dcx = clampArena(mp.x, this.half);
          const dcz = clampArena(mp.z, this.half);
          let bx = this.hitSolid(dcx, e.g.position.z, 0.8, eyH);
          let bz = this.hitSolid(e.g.position.x, dcz, 0.8, eyH);
          if (!bx && !bz && dcx !== e.g.position.x && dcz !== e.g.position.z
            && this.hitSolid(dcx, dcz, 0.8, eyH)) {
            if (Math.abs(dcx - e.g.position.x) >= Math.abs(dcz - e.g.position.z)) bz = true;
            else bx = true;
          }
          if (!bx) e.g.position.x = dcx;
          if (!bz) e.g.position.z = dcz;
          // кукла сталкера рядом — бьёт гостя локально (серверный урон гаснет только у хоста).
          // наблюдателя не бьём вообще: камера летает, тела в бою нет.
          // БЭКРУМС: 1 удар = смерть + скример. Остальные карты — старый урон.
          if (e.god && !this.dead && !this.specOn && this.invisT <= 0) {
            const pd = Math.hypot(this.px - e.g.position.x, this.pz - e.g.position.z);
            if (pd <= 2.3 && e.hitCd <= 0 && this.shieldT <= 0 && !this.devGod) {
              e.hitCd = 1.0;
              if (this.map === 'backrooms' || this.map === 'endless') { this.killByStalker(); }
              else {
              this.hp -= 12 + Math.random() * 6;
              this.burst(this.px - Math.sin(this.yaw) * 1.2, 1.5, this.pz - Math.cos(this.yaw) * 1.2, 8);
              this.shakeT = 0.25;
              this.sfx(hitUrl, 0.8);
              if (this.hp <= 0) {
                this.hp = 0;
                this.dead = true;
                this.pushHud();
                this.ev.onBusted({ score: this.score, coins: 0 });
              }
              }
              this.pushHud();
            }
          }
          // кукла ОБЫЧНОГО моба рядом — тоже бьёт гостя локально (раньше обычные
          // гостя вообще не трогали: второй игрок был бессмертным статистом).
          if (!e.god && !this.dead && !this.specOn && this.invisT <= 0) {
            const pd = Math.hypot(this.px - e.g.position.x, this.pz - e.g.position.z);
            // бьём только свою плоскость: гость на крыше, кукла на земле — мимо
            if (pd <= 2.3 && Math.abs(e.ey - this.py) <= (e.kind === 'boss' ? 2.8 : 2.2) && e.hitCd <= 0 && this.shieldT <= 0 && !this.devGod) {
              e.hitCd = e.kind === 'boss' ? 1.2 : 0.95;
              this.hp -= e.kind === 'boss' ? 18 + Math.random() * 10 : 6 + Math.random() * 5;
              this.burst(this.px - Math.sin(this.yaw) * 1.2, 1.5, this.pz - Math.cos(this.yaw) * 1.2, 8);
              this.shakeT = 0.25;
              this.sfx(hitUrl, 0.8);
              if (this.hp <= 0) {
                this.hp = 0;
                this.dead = true;
                this.pushHud();
                this.ev.onBusted({ score: this.score, coins: 0 });
              }
              this.pushHud();
            }
          }
        } else if (e.god && !huntingRemote && !this.dead && d <= 2.3 && Math.abs(e.ey - this.py) <= 2.2 && e.hitCd <= 0 && this.shieldT <= 0 && !this.devGod) {
          // БЭКРУМС: 1 удар = смерть + скример. Остальные карты — старый урон.
          // Сталкер под крышей игрока не достаёт — только своя плоскость.
          e.hitCd = 1.0;
          if (this.map === 'backrooms' || this.map === 'endless') { this.killByStalker(); }
          else {
          this.hp -= 12 + Math.random() * 6;
          this.burst(this.px - Math.sin(this.yaw) * 1.2, 1.5, this.pz - Math.cos(this.yaw) * 1.2, 8);
          this.shakeT = 0.25;
          this.sfx(hitUrl, 0.8);
          if (this.hp <= 0) {
            this.hp = 0;
            this.dead = true;
            this.pushHud();
            this.ev.onBusted({ score: this.score, coins: 0 });
          }
          }
          this.pushHud();
        } else if (d > 2.1) {
          // LOD: дальние (>45м) шевелятся через кадр — глаз не заметит, процессор скажет спасибо
          if (d <= 45 || (this.frame & 1) === 0 || e.god) {
          const eyH = e.kind === 'fly' ? 3.2 : e.ey;
          // габарит туши для проверок прохода: босс шире дверей, ему запас больше
          const CLR = e.kind === 'boss' ? 1.3 : 0.9;
          // пеший местный: виден напрямую — в лоб; за стеной — по вейпоинтам BFS.
          // Летуны — тем же маршрутом, но на своей высоте (облетают высокие дома, а не тонут в них).
          // Сетевые куклы — старым ходом (слепки хоста не знают стен).
          let wx = txp, wz = tzp;
          if (!e.net) {
            e.repathT -= dt;
            // цель ушла далеко от спланированной — маршрут протух, пересчёт сразу
            if (Math.hypot(txp - e.ptx, tzp - e.ptz) > 4) e.repathT = Math.min(e.repathT, 0.08);
            if (e.repathT <= 0 || e.path.length === 0) {
              // прямая видимость: шаг 2м, не дальше 48м (дальше — сразу BFS-бюджет).
              let blocked = false;
              const far = Math.min(d, 48);
              const checks = Math.min(24, Math.max(1, Math.ceil(far / 2)));
              for (let s = 1; s <= checks; s++) {
                const t = (far * s) / (checks + 1);
                const qx = e.g.position.x + (dx / d) * t, qz = e.g.position.z + (dz / d) * t;
                if (this.hitSolid(qx, qz, CLR, eyH)) {
                  blocked = true;
                  break;
                }
              }
              if (!blocked && d <= 48) {
                e.path = [];
              } else if (this.bfsBudget > 0) {
                // любое препятствие (и низкое тоже) — сначала в обход по BFS.
                // Прыжок остаётся запасным: сработает, если упёрся носом (тупик, щель)
                this.bfsBudget--;
                e.path = this.findPath(e.g.position.x, e.g.position.z, txp, tzp, CLR, e.kind === 'fly' ? eyH : 0);
              } else {
                // бюджет кадра исчерпан (орда Нашествия) — повторим через 0.12с, пока идём в лоб
                e.path = [];
                e.repathT = 0.12;
                continue;
              }
              e.ptx = txp; e.ptz = tzp;
              // дальний сталкер (>60м) идёт минутами — ему пересчёт раз в ~секунду
              // хватает, а кадры не жрёт. Ближние — как было, шустрые.
              const farT = d > 60;
              e.repathT = (e.god ? (farT ? 0.8 : 0.25) : 0.4) + Math.random() * (farT ? 0.5 : 0.3);
            }
            if (e.path.length > 0) {
              const wp = e.path[0];
              if (Math.hypot(wp.x - e.g.position.x, wp.z - e.g.position.z) < 1.4) e.path.shift();
              else { wx = wp.x; wz = wp.z; }
            }
          }
          const ddx = wx - e.g.position.x, ddz = wz - e.g.position.z;
          const dd = Math.hypot(ddx, ddz) || 1;
          // анти-прижим к углу: стоим дольше 0.25с, хотя идём, —
          // слайд вбок 0.6с В СТОРОНУ ЦЕЛИ (угол огибаем, а не качаемся) + маршрут пересчитать сразу
          const moved = Math.hypot(e.g.position.x - e.lx, e.g.position.z - e.lz);
          if (moved < 0.5) {
            e.stuckT += dt;
            // висящий на стене не слайдит: его держит лазанье, боковой дёрг
            // сбросит щуп с стены — будет ёрзать и топтаться вместо подъёма
            if (e.stuckT > 0.25 && e.slideT <= 0 && !e.climbHold) {
              e.stuckT = 0;
              e.slideT = 0.6;
              // с какой стороны от курса цель: туда и ползём вдоль стены
              const toTx = txp - e.g.position.x, toTz = tzp - e.g.position.z;
              const cross = ddx * toTz - ddz * toTx;
              let side = cross > 0.5 ? 1 : cross < -0.5 ? -1 : 0;
              // цель ровно за стеной (непонятно куда) — чередуем бок, а не рандом:
              // рандом мог дважды дать тот же тупик, чередование выводит всегда
              if (side === 0) side = e.slideDir !== 0 ? -e.slideDir : (Math.random() < 0.5 ? 1 : -1);
              e.slideDir = side;
              e.slideX = (-ddz / dd) * side;
              e.slideZ = (ddx / dd) * side;
              e.repathT = Math.min(e.repathT, 0.05);
            }
          } else {
            e.stuckT = 0;
            e.lx = e.g.position.x;
            e.lz = e.g.position.z;
          }
          let mdx = ddx / dd, mdz = ddz / dd;
          if (e.slideT > 0) {
            e.slideT -= dt;
            mdx = (mdx * 0.35 + e.slideX * 0.95);
            mdz = (mdz * 0.35 + e.slideZ * 0.95);
            const ml = Math.hypot(mdx, mdz) || 1;
            mdx /= ml; mdz /= ml;
          }
          // чумное облако Чумы: в радиусе 9м враг травится (9/с) и ползёт на 55% скорости.
          // Бессмертного сталкера не убивает (HP 9999), но тормозит — можно убежать.
          const inCloud = this.chumaT > 0 && d < 9 && !e.dead;
          if (inCloud) {
            e.hp -= 9 * dt;
            this.updateHpBar(e);
            if (e.hp <= 0) this.strikeEnemy(e, 1, ddx, ddz, dd || 1, 0);
          }
          const foeSpd = e.speed * (inCloud ? 0.55 : 1);
          const nx = e.g.position.x + mdx * foeSpd * dt;
          const nz = e.g.position.z + mdz * foeSpd * dt;
          // топот орды: слышно в радиусе 18м, громкость тает с дистанцией
          e.stepT -= dt;
          if (e.stepT <= 0) {
            e.stepT = 0.42 + Math.random() * 0.15;
            if (d < 18) {
              this.eStepN++;
              this.stepSound(0.3 * (1 - d / 20), 750 + Math.random() * 250);
            }
          }
          // кламп СНАЧАЛА (под половину текущей карты), проверка — уже финальной точки:
          // иначе валидируем одно место, а встаём в другое (стена)
          const cx = clampArena(nx, this.half);
          const cz = clampArena(nz, this.half);
          let blockedX = this.hitSolid(cx, e.g.position.z, 0.8, eyH);
          let blockedZ = this.hitSolid(e.g.position.x, cz, 0.8, eyH);
          // угол: по осям проход есть, а по диагонали тело 0.8 не лезет —
          // не срезаем, скользим вдоль главной оси (иначе клин в стене)
          if (!blockedX && !blockedZ && cx !== e.g.position.x && cz !== e.g.position.z
            && this.hitSolid(cx, cz, 0.8, eyH)) {
            if (Math.abs(mdx) >= Math.abs(mdz)) blockedZ = true;
            else blockedX = true;
          }
          if (!blockedX) e.g.position.x = cx;
          if (!blockedZ) e.g.position.z = cz;
          // ЛАЗАНЬЕ + ПРЫЖКИ: все ходоки кроме босса (босс — kind 'boss', летуны — 'fly').
          // Низкое (до 1.9м: ящик, забор) — перепрыгивают (прыжок 6 м/с, вершина 1.8м —
          // solidHit считает верх объекта полом, пролетают свободно).
          // Высокое (до 12м: стена, дом) — лезут вверх 2.5 м/с, дальше идут по крыше.
          const canClimb = e.kind === 'walk';
          if (canClimb && (blockedX || blockedZ)) {
            // высоту меряем ЩУПОМ ВПЕРЁД (до 2м по курсу): точка рядом со стеной
            // ещё не внутри неё, а тонкий забор в замер без щупа не попадает
            let top = 0; let qx = 0, qz = 0, qFound = false;
            for (let k = 1; k <= 4; k++) {
              const qx2 = e.g.position.x + mdx * 0.5 * k, qz2 = e.g.position.z + mdz * 0.5 * k;
              if (this.hitSolid(qx2, qz2, 0.5, e.ey)) { top = this.groundAt(qx2, qz2, 0.5); qx = qx2; qz = qz2; qFound = true; break; }
            }
            const ownG = this.groundAt(e.g.position.x, e.g.position.z);
            const dh = top - e.ey;
            // на дома — только если игрок наверху (py>2.5): иначе в обход по BFS,
            // а не на стену. Низкое (до 1.9м) прыгаем всегда — это запасной путь.
            const wantUp = this.py > 2.5;
            // низкое у земли (забор, ящик) — прыжком; «почти долез» наверху —
            // лазаньем: вершина прыжка 1.8м до края не дотягивает и выходит вечный
            // подпрыг-откат у самой крыши. Порог 2.5м — ступень игрока (1.1м) с запасом
            if (dh > 0 && dh <= 1.9 && top - ownG <= 2.5 && e.ey - ownG <= 0.05 && e.evy <= 0) { e.evy = 6; e.climbHold = false; this.jumpDBG++; }
            else if (wantUp && dh > 0 && dh <= 12) { e.ey = Math.min(top, e.ey + 2.5 * dt); e.evy = 0; e.climbHold = true; this.climbDBG++; }
            else if (wantUp && qFound && dh <= 0 && dh > -1.2 && top - ownG <= 12 && e.evy <= 0) {
              // дополз до верха, а нос ещё в стене — перевал через край на крышу.
              // Наверху тесно (голова упрётся) — отпускаем: сползёт вниз, а не зависнет
              if (!this.hitSolid(qx, qz, 0.5, top)) {
                e.g.position.x = qx; e.g.position.z = qz; e.ey = top; e.evy = 0; e.climbHold = false; this.dropDBG++;
              } else e.climbHold = false;
            }
            // не за что держаться (угол, край стены, выше 12м) — флаг вниз,
            // иначе гравитация его вечно не берёт и он висит в воздухе
            else e.climbHold = false;
          }
          if (canClimb) {
            const gt = this.groundAt(e.g.position.x, e.g.position.z);
            // спуск — только на свободном ходу (сошёл с крыши); пока упёрт в стену
            // (blocked) — лезем вверх, тянуть вниз нельзя (иначе топчемся на 0.6м).
            // В полёте прыжка (evy!=0) тоже не лезем — там правит баллистика
            if (!(blockedX || blockedZ) && e.evy === 0 && e.ey > gt + 0.05) {
              e.climbHold = false;
              // СПРЫГИВАНИЕ с крыши: высоко — быстро вниз (12 м/с), ступенька — плавно
              if (e.ey - gt > 1.0) { e.ey = Math.max(gt, e.ey - 12 * dt); this.dropDBG++; }
              else e.ey += (gt - e.ey) * Math.min(1, dt * 4);
            }
          }
          if (e.climb && (blockedX || blockedZ) && this.py > 2.5) {
            // скалолаз: стена до 12м — только за игроком наверху, иначе в обход
            const top = this.groundAt(blockedX ? cx : e.g.position.x, blockedZ ? cz : e.g.position.z);
            if (top > e.ey && top - e.ey <= 12) e.ey = Math.min(top, e.ey + 2.5 * dt);
          }
          if (e.climb) {
            // соскользнули с крыши — плавно вниз по опоре
            const gt = this.groundAt(e.g.position.x, e.g.position.z);
            if (e.ey > gt) e.ey += (gt - e.ey) * Math.min(1, dt * 4);
          }
          } // LOD: дальние двигаются через кадр
        // d<=2.1 (рядом) + своя плоскость: игрок на крыше, враг на земле — урона нет
        } else if (!huntingRemote && !this.dead && Math.abs(e.ey - this.py) <= (e.kind === 'boss' ? 2.8 : 2.2) && e.hitCd <= 0 && this.shieldT <= 0 && !this.specOn && this.invisT <= 0 && !this.devGod) {
          // бьём ТОЛЬКО себя: враг добежал до сокомнатника (huntingRemote) — урон считает его клиент, нам чужого не надо.
          // Труп тоже не бьём: умер — тишина, без добивания и звуков после смерти.
          // Облако Чумы достаёт и в упор (враг бьёт — сам травится).
          if (this.chumaT > 0) {
            const pdx = this.px - e.g.position.x, pdz = this.pz - e.g.position.z;
            if (Math.hypot(pdx, pdz) < 9) {
              e.hp -= 9 * dt;
              this.updateHpBar(e);
              if (e.hp <= 0) this.strikeEnemy(e, 1, pdx, pdz, 1, 0);
            }
          }
          e.hitCd = e.kind === 'boss' ? 1.2 : 0.95;
          // босс бьёт втрое злее
          this.hp -= e.kind === 'boss' ? 18 + Math.random() * 10 : 6 + Math.random() * 5;
          this.burst(this.px - Math.sin(this.yaw) * 1.2, 1.5, this.pz - Math.cos(this.yaw) * 1.2, 8);
          this.shakeT = 0.25;
          this.sfx(hitUrl, 0.8);
          if (this.hp <= 0) {
            this.hp = 0;
            this.dead = true;
            this.playDeathOnce();
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
        } else if (e.climb) {
          // скалолаз не прыгает — высота от стены/крыши
          e.body.position.y = 1.0 + e.ey;
        } else {
          // прыжки орды; висящего на стене (climbHold) гравитация не трогает —
          // высоту ведёт лазанье, иначе карабканье вечно топчется у земли
          if (e.climbHold && e.ey <= this.groundAt(e.g.position.x, e.g.position.z) + 0.05 && e.evy <= 0) e.climbHold = false;
          e.hopCd -= dt;
          if (!e.climbHold && e.hopCd <= 0 && e.ey <= 0) {
            e.evy = 2.5 + Math.random() * 1.5;
            e.hopCd = 2 + Math.random() * 2;
          }
          if (!e.climbHold && (e.ey > 0 || e.evy !== 0)) {
            e.evy -= 10 * dt;
            e.ey += e.evy * dt;
            // посадка на опору под ногами (земля, крыша, забор) — раньше было
            // только на ноль: с крыши проваливались сквозь неё и дёргались в полёте.
            // Садимся, только если летели СВЕРХУ (prev выше опоры): прыжок под мостом
            // на мост не телепортирует — падает обратно на землю
            const landG = this.groundAt(e.g.position.x, e.g.position.z);
            const prevEy = e.ey - e.evy * dt;
            if (e.evy <= 0 && e.ey <= landG && prevEy >= landG - 0.05) { e.ey = landG; e.evy = 0; }
            else if (e.ey <= 0) { e.ey = 0; e.evy = 0; }
          }
          e.body.position.y = (e.god ? 1.45 : 1.0) + Math.abs(Math.sin(e.phase)) * 0.12 + e.ey;
        }
        // плашка ХП едет вместе с тушей: на стене — над головой верхолаза, а не у земли
        e.hpSpr.position.y = (e.kind === 'fly' ? 4.6 : e.kind === 'boss' ? 4.1 : 2.35) + e.ey;
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
      // сокомнатники: рендерим прошлое (now-550мс) по буферу слепков —
      // непрерывно при любых рваных битах; удары вспышкой, прыжки высотой
      const rt = performance.now() / 600;
      const nowMs = performance.now();
      const renderT = nowMs - 550;
      for (const r of this.remotes) {
        const sp = this.snapAt(r.snaps, renderT, r.tx, r.tz);
        r.x = sp.x; r.z = sp.z;
        if (r.flash > 0) r.flash -= dt;
        const rbody = r.body;
        const pop = r.flash > 0 ? 1 + r.flash : 1;
        rbody.scale.set(1.4 * pop, 2.0 * pop, 1);
        rbody.material.color.set(r.dead ? 0x777777 : 0xffffff);
        r.g.position.set(r.x, r.py + Math.abs(Math.sin(rt + r.x)) * 0.08, r.z);
      }
      if (Math.floor(performance.now() / 200) !== Math.floor((performance.now() - dt * 1000) / 200)) {
        this.pushHud();
        this.drawMM();
      }
    }
    // камера от первого лица + покачивание ходьбы.
    // Наблюдатель: свободная камера (высота specY, осмотр мышью), покачивания нет.
    const shake = this.shakeT > 0 ? Math.sin(performance.now() / 20) * 0.03 : 0;
    const bob = this.moving && !this.specOn ? Math.sin(this.bobPhase) * 0.055 : 0;
    const kick = this.swingT > 0 ? -this.swingT * 0.35 : 0;
    const camX = this.specOn ? this.specX : this.px;
    const camZ = this.specOn ? this.specZ : this.pz;
    const camY = this.specOn ? this.specY : 1.7 + this.py;
    this.camera.position.set(camX, camY + shake + bob, camZ);
    this.camera.rotation.set(this.pitch + kick, this.yaw, 0);
    const tJs = performance.now();
    this.renderer.render(this.scene, this.camera);
    const tEnd = performance.now();
    // прибор лагов: сколько кадр жрала логика (JS) и сколько отрисовка (рендер)
    this.perfJs += tJs - tLoop; this.perfR += tEnd - tJs; this.perfN++;
  };
  /** Прибор лагов: средние мс логики/рендера за замер + сброс. */
  debugPerf(): { js: number; r: number; n: number; jump: number; climb: number; drop: number } {
    const o = { js: this.perfN ? this.perfJs / this.perfN : 0, r: this.perfN ? this.perfR / this.perfN : 0, n: this.perfN };
    this.perfJs = 0; this.perfR = 0; this.perfN = 0;
    return { js: Math.round(o.js * 10) / 10, r: Math.round(o.r * 10) / 10, n: o.n, jump: this.jumpDBG, climb: this.climbDBG, drop: this.dropDBG };
  }
}
