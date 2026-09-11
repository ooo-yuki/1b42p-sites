import { useEffect, useRef, useState, useCallback } from 'react';
import { Game, WEAPONS, CHARS, MAPS, hashSeed, KEY_ACTIONS, DEFAULT_KEYS, UPG_MAX, upgCost, superCd, superRange, CASE_PRICE, type HudState, type KeyMap, type Quality, type MapId, type CustomMap, type UpgState, type CaseDrop, type RemoteMob } from './game/engine';
import oruzh1Url from './assets/oruzh1.png';
import oruzh2Url from './assets/oruzh2.png';
import pistolUrl from './assets/pistol.png';
import shotgunUrl from './assets/shotgun.png';
import batUrl from './assets/bat.png';
import charMttUrl from './assets/char-mtt.png';
import charKrysaUrl from './assets/char-krysa.png';
import charShubaUrl from './assets/char-shuba.png';
import charChumaUrl from './assets/char-chuma.png';
import charGidroxisUrl from './assets/char-gidroxis.png';
import jumpscareUrl from './assets/jumpscare.jpg';
import menuBgUrl from './assets/menu-bg.jpg';

const CHARIMG: Record<string, string> = { mtt: charMttUrl, krysa: charKrysaUrl, shuba: charShubaUrl, chuma: charChumaUrl, gidroxis: charGidroxisUrl };

/** Подробные описания способностей бойцов для меню. */
const CHAR_ABILITIES: Record<string, { lines: string[]; sup: string }> = {
  mtt: {
    lines: [
      '❤️ Здоровье 120 — самый живучий, держит толпу',
      '💨 Скорость ×1.0 — ровный шаг, не проседает в махаче',
      '👊 Урон полный — бита и стволы бьют как надо',
    ],
    sup: '⚡ СУПЕР — Рывок на C: бросок ~4м строго туда, куда смотришь (можно вверх — взлетаешь). Кд 3с, качается до 1.7с, дальность +15% за уровень.',
  },
  krysa: {
    lines: [
      '❤️ Здоровье 90 — хрупкая, но юркая',
      '💨 Скорость ×1.15 — самая быстрая на карте',
      '🦘 Прыжки ×3 выше всех — залетает на крыши без лестниц',
    ],
    sup: '🌀 СУПЕР — Вол-кик: в полёте у стены жми C — разворот на 180° с подбросом. Кд 5с, качается до 1.7с, дальность +15% за уровень. Коснулся здания в полёте — кд сгорает сразу.',
  },
  shuba: {
    lines: [
      '❤️ Здоровье 105 — крепыш в белой шубе',
      '💨 Скорость ×1.05 — чуть бодрее МТТ',
      '👻 Не видят враги — супер прячет на 3 секунды',
    ],
    sup: '👻 СУПЕР — Несутка на C: 3с враги тебя не видят и не преследуют, бить не могут. Кд 30с, качается до 20с.',
  },
  chuma: {
    lines: [
      '❤️ Здоровье 100 — держит удар',
      '💨 Скорость ×1.05 — чуть бодрее МТТ',
      '🦠 Травит врагов — супер накрывает облаком на 5 секунд',
    ],
    sup: '🦠 СУПЕР — Чумное облако на C: 5с враги в радиусе 9м травятся и ползут вдвое медленнее. Кд 30с, качается до 20с.',
  },
  gidroxis: {
    lines: [
      '❤️ Здоровье 95 — держит удар',
      '💨 Скорость ×1.1 — быстрый сканер',
      '🔍 Видит сквозь стены — супер подсвечивает всех существ',
    ],
    sup: '🔍 СУПЕР — Рентген на C: 5с всех существ видно сквозь стены (мобы и бойцы). Кд 20с, качается до 15с.',
  },
};

interface ScoreRow {
  nick: string;
  score: number;
  coins: number;
}

interface RoomMate {
  nick: string;
  login: string;
  char: string;
  x: number;
  z: number;
  hp: number;
  score: number;
  kills: number;
  wave: number;
  /** PvP: фраги, наблюдатель, fid бойца для pvphit */
  frags?: number;
  spec?: boolean;
  fid?: number;
  /** полное присутствие с сервера: ствол, высота, удары, лежит ли */
  weapon?: string;
  py?: number;
  atk?: number;
  dead?: boolean;
}

interface DuelFoe {
  nick: string;
  login: string;
  char: string;
  x: number;
  z: number;
  hp: number;
  weapon?: string;
  py?: number;
  atk?: number;
  dead?: boolean;
}

interface DuelInfo {
  active: boolean;
  round: number;
  lastWinner: string;
  foe: DuelFoe | null;
  myHp: number;
  myWins: number;
  foeWins: number;
  spawn: { x: number; z: number; yaw: number } | null;
}

const TOKEN_KEY = 'mtt_token';

function token(): string {
  try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
}

interface RoomInfo {
  id: string;
  name: string;
  mode: MapId;
  count: number;
  started?: boolean;
  official?: boolean;
  restartIn?: number;
}

interface LobbyInfo {
  name: string;
  mode: MapId;
  seed?: number;
  started: boolean;
  owner: boolean;
  count: number;
  players: RoomMate[];
  pending?: RoomMate[];
  accepted?: boolean;
  official?: boolean;
  restartIn?: number;
}

/** Ответ пульса комнаты: дуэль, PvP-табло, наблюдатель, ресаун, хост мобов. */
interface BeatInfo {
  players: RoomMate[];
  seed?: number;
  duel?: DuelInfo;
  chat?: Array<{ nick: string; text: string; t: number }>;
  mobs?: Array<{ id: number; kind: string; x: number; z: number; hp: number; dead: boolean; wave: number; god?: boolean }>;
  owner?: boolean;
  t?: number;
  scoreboard?: Array<{ nick: string; frags: number }>;
  specView?: { spec: boolean; target?: string; targets?: Array<{ sid: string; nick: string; hp: number; dead: boolean }> };
  respawn?: { x: number; z: number } | null;
  myHp?: number;
  myFrags?: number;
  mobHost?: boolean;
  started?: boolean;
  official?: boolean;
  restartIn?: number;
}

/** Значок режима комнаты/карты. */
function modeIcon(mode: string): string {
  if (mode === 'duel') return '⚔️';
  if (mode === 'backrooms' || mode === 'endless') return '🟨';
  if (mode === 'pvp') return '⚔️';
  if (mode === 'invasion') return '🌊';
  if (mode === 'custom') return '🧩';
  if (mode === 'random') return '🎲';
  return '🌍';
}

/** Название режима комнаты. */
function modeName(mode: string): string {
  if (mode === 'duel') return '⚔️ ДУЭЛЬ 1×1';
  if (mode === 'backrooms') return '🟨 БЭКРУМС';
  if (mode === 'pvp') return '⚔️ PvP-АРЕНА';
  if (mode === 'endless') return '🟨 БЕСКОНЕЧНЫЙ БЭКРУМС';
  if (mode === 'invasion') return '🌊 НАШЕСТВИЕ';
  if (mode === 'custom') return '🧩 СВОЯ';
  return '🌍 Арена';
}

/** Секунды до рестарта → мм:сс. */
function fmtRestart(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** Описание режима для плашки сервера. */
function modeDesc(mode: string): string {
  if (mode === 'pvp') return 'Без врагов — только ты и соперники. Побеждает лидер фрагов.';
  if (mode === 'endless') return 'Гигантский лабиринт и 5 неубиваемых быстрых сталкеров. Выживи.';
  if (mode === 'invasion') return 'Орда скалолазов лезет на стены и крыши. Держись.';
  if (mode === 'duel') return 'Ночной двор 1×1 для разборок.';
  if (mode === 'backrooms') return 'Случайный лабиринт — новый каждый раз.';
  return 'Новый город: витрины, переулки, площадь с фонтаном.';
}
/** Лимит игроков по режиму (зеркало сервера). */
function modeCap(mode: string): number {
  if (mode === 'duel') return 2;
  if (mode === 'pvp') return 12;
  if (mode === 'endless' || mode === 'invasion') return 10;
  return 8;
}

async function loadRooms(): Promise<RoomInfo[]> {
  try {
    const r = await fetch('/api/rooms');
    if (!r.ok) return [];
    return (await r.json()) as RoomInfo[];
  } catch {
    return [];
  }
}

const WIMG: Record<string, string> = { fists: oruzh1Url, bat: batUrl, axe: oruzh2Url, pistol: pistolUrl, shotgun: shotgunUrl };

const SID_KEY = 't42_sid';
function sid(): string {
  try {
    let s = localStorage.getItem(SID_KEY);
    if (!s || !/^[0-9a-f]{32}$/.test(s)) {
      s = '';
      const h = '0123456789abcdef';
      for (let i = 0; i < 32; i++) s += h[Math.floor(Math.random() * 16)];
      localStorage.setItem(SID_KEY, s);
    }
    return s;
  } catch {
    return '00000000000000000000000000000000';
  }
}

function beacon(): void {
  try {
    fetch('https://hub.bratuxa.zomb.top/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ site: 'mtt', sid: sid() }),
      keepalive: true,
    }).catch(() => undefined);
  } catch { /* noop */ }
}

async function loadScores(): Promise<ScoreRow[]> {
  try {
    const r = await fetch('/api/scores');
    if (!r.ok) return [];
    return (await r.json()) as ScoreRow[];
  } catch {
    return [];
  }
}

async function loadDuelTop(): Promise<Array<{ login: string; wins: number }>> {
  try {
    const r = await fetch('/api/duel-top');
    if (!r.ok) return [];
    return (await r.json()) as Array<{ login: string; wins: number }>;
  } catch {
    return [];
  }
}

function submitScore(nick: string, score: number, coins: number): void {
  try {
    fetch('/api/score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nick, score, coins, token: token() }),
      keepalive: true,
    }).catch(() => undefined);
  } catch { /* noop */ }
}

function prettyKey(code: string): string {
  return code.replace(/^Key/, '').replace(/^Digit/, '').replace(/^Arrow/, '')
    .replace('Space', 'Пробел').replace('ShiftLeft', 'Shift').replace('ShiftRight', 'Shift');
}

const NICK_KEY = 'mtt_nick';

/** 3D-превью своей карты: изометрия на 2D — работает везде, высота блоков видна. */
function EditorPreview({ grid, size }: { grid: number[][]; size: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const W = 420, H = 300;
    cv.width = W; cv.height = H;
    const g = cv.getContext('2d');
    if (!g) return;
    const cols = grid.length;
    const dx = 0.866, dy = 0.5;
    const s = Math.min(W / (cols * 2 * dx + 2), (H - 30) / (cols * 2 * dy + 16));
    const hs = s;
    const ox = W / 2, oy = 16;
    g.fillStyle = '#101828';
    g.fillRect(0, 0, W, H);
    // земля ромбом
    g.fillStyle = '#2a4a2a';
    g.beginPath();
    const gx = (x: number, y: number): number => ox + (x - y) * dx * s;
    const gy = (x: number, y: number): number => oy + (x + y) * dy * s;
    g.moveTo(gx(0, 0), gy(0, 0));
    g.lineTo(gx(cols, 0), gy(cols, 0));
    g.lineTo(gx(cols, cols), gy(cols, cols));
    g.lineTo(gx(0, cols), gy(0, cols));
    g.closePath();
    g.fill();
    // блоки от дальних к ближним
    for (let sy = 0; sy <= cols * 2; sy++) {
      for (let x = 0; x < cols; x++) {
        const y = sy - x;
        if (y < 0 || y >= cols) continue;
        const h = grid[y]?.[x] ?? 0;
        if (!h) continue;
        const hh = h * hs;
        const cx = gx(x, y), cy = gy(x, y);
        const hw = dx * s, hh2 = dy * s;
        // левый и правый бока
        g.fillStyle = '#8a6f3d';
        g.beginPath();
        g.moveTo(cx - hw, cy); g.lineTo(cx, cy + hh2); g.lineTo(cx, cy + hh2 + hh); g.lineTo(cx - hw, cy + hh);
        g.closePath(); g.fill();
        g.fillStyle = '#a5854e';
        g.beginPath();
        g.moveTo(cx + hw, cy); g.lineTo(cx, cy + hh2); g.lineTo(cx, cy + hh2 + hh); g.lineTo(cx + hw, cy + hh);
        g.closePath(); g.fill();
        // крыша
        g.fillStyle = '#c9a06a';
        g.beginPath();
        g.moveTo(cx, cy - hh); g.lineTo(cx + hw, cy + hh2 - hh); g.lineTo(cx, cy + hh2 * 2 - hh); g.lineTo(cx - hw, cy + hh2 - hh);
        g.closePath(); g.fill();
      }
    }
  }, [grid, size]);
  return (
    <canvas
      id="edPreview"
      ref={(el) => {
        const cv = ref.current;
        void cv;
        // первичная отрисовка при монтировании
        if (el) {
          const W = 420, H = 300;
          el.width = W; el.height = H;
          const g = el.getContext('2d');
          if (g) {
            const cols = grid.length;
            const dx = 0.866, dy = 0.5;
            const s = Math.min(W / (cols * 2 * dx + 2), (H - 30) / (cols * 2 * dy + 16));
            const hs = s;
            const ox = W / 2, oy = 16;
            const gx = (x: number, y: number): number => ox + (x - y) * dx * s;
            const gy = (x: number, y: number): number => oy + (x + y) * dy * s;
            g.fillStyle = '#101828';
            g.fillRect(0, 0, W, H);
            g.fillStyle = '#2a4a2a';
            g.beginPath();
            g.moveTo(gx(0, 0), gy(0, 0));
            g.lineTo(gx(cols, 0), gy(cols, 0));
            g.lineTo(gx(cols, cols), gy(cols, cols));
            g.lineTo(gx(0, cols), gy(0, cols));
            g.closePath();
            g.fill();
            for (let sy = 0; sy <= cols * 2; sy++) {
              for (let x = 0; x < cols; x++) {
                const y = sy - x;
                if (y < 0 || y >= cols) continue;
                const h = grid[y]?.[x] ?? 0;
                if (!h) continue;
                const hh = h * hs;
                const cx = gx(x, y), cy = gy(x, y);
                const hw = dx * s, hh2 = dy * s;
                g.fillStyle = '#8a6f3d';
                g.beginPath();
                g.moveTo(cx - hw, cy); g.lineTo(cx, cy + hh2); g.lineTo(cx, cy + hh2 + hh); g.lineTo(cx - hw, cy + hh);
                g.closePath(); g.fill();
                g.fillStyle = '#a5854e';
                g.beginPath();
                g.moveTo(cx + hw, cy); g.lineTo(cx, cy + hh2); g.lineTo(cx, cy + hh2 + hh); g.lineTo(cx + hw, cy + hh);
                g.closePath(); g.fill();
                g.fillStyle = '#c9a06a';
                g.beginPath();
                g.moveTo(cx, cy - hh); g.lineTo(cx + hw, cy + hh2 - hh); g.lineTo(cx, cy + hh2 * 2 - hh); g.lineTo(cx - hw, cy + hh2 - hh);
                g.closePath(); g.fill();
              }
            }
          }
        }
        ref.current = el;
      }}
      style={{ width: '100%', maxWidth: 420, touchAction: 'none' }}
    />
  );
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const joyRef = useRef<HTMLDivElement>(null);
  const joyKnob = useRef<HTMLDivElement>(null);
  const weaponRef = useRef<HTMLDivElement>(null);
  const joyId = useRef(-1);
  const gameRef = useRef<Game | null>(null);
  const [menu, setMenu] = useState(true);
  const [loading, setLoading] = useState<{ show: boolean; pct: number }>({ show: false, pct: 0 });
  const [hud, setHud] = useState<HudState>({ hp: 100, maxhp: 100, score: 0, kills: 0, enemies: 0, wave: 1, dead: false, fantiki: 0, weapon: 'fists', owned: ['fists'], moving: false, dash: 0, kick: 0, invis: 0, invisCd: 0, chuma: 0, chumaCd: 0, xray: 0, xrayCd: 0, med: 0, lvl: 1, boss: 0, fps: 60, quality: 'medium', doorPulse: false });
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [duelTop, setDuelTop] = useState<Array<{ login: string; wins: number }>>([]);
  const [gstats, setGstats] = useState<{ games: number; best: number; online: number } | null>(null);

async function loadStats(): Promise<void> {
  try {
    const r = await fetch('/api/stats');
    if (r.ok) setGstats((await r.json()) as { games: number; best: number; online: number });
  } catch { /* noop */ }
}
  const [shopOpen, setShopOpen] = useState(false);
  const [setOpen, setSetOpen] = useState(false);
  const [sound, setSound] = useState(true);
  const [sens, setSens] = useState(1);
  const [quality, setQuality] = useState<Quality>('medium');
  /** Громкость 0..1 (слайдер в настройках, дублируется в бою и в меню). */
  const [volume, setVolume] = useState(1);
  const [drawDist, setDrawDist] = useState(500);
  const [char, setChar] = useState('mtt');
  // прокачка бойцов: какой боец раскрыт, тик для перерисовки после покупки
  const [upgOpen, setUpgOpen] = useState<string | null>(null);
  const [upgTick, setUpgTick] = useState(0);
  const buyUpg = useCallback((id: string, key: keyof UpgState) => {
    const g = gameRef.current;
    if (g?.buyUpg(id, key)) setUpgTick((t) => t + 1);
  }, []);
  // кейсы: результат последнего открытия, тик для перерисовки баланса
  // РУЛЕТКА: барабан лотов летит справа налево, дроп подсвечивается по центру
  interface ReelItem { kind: CaseDrop['kind']; label: string; sub: string; char?: string; }
  const REEL_N = 42;
  const REEL_WIN = 34;
  /** Запасной шаг барабана, если DOM ещё не встал — реальный меряем по карточке в рантайме. */
  const CARD_W = 128; // карточка 120 + gap 8 — синхронно с CSS #caseFull .rcard
  const reelLabel = (kind: CaseDrop['kind']): { label: string; sub: string } => {
    if (kind === 'char') return { label: '🐀 СТЕЙСИ', sub: 'Легендарный' };
    if (kind === 'fantiki') return { label: '+300 🎟️', sub: 'фантики' };
    if (kind === 'xp') return { label: '+150 ✨', sub: 'опыт' };
    if (kind === 'med') return { label: '+1 💊', sub: 'аптечка' };
    return { label: '⛔ МИМО', sub: 'пусто' };
  };
  const fillerKind = (): CaseDrop['kind'] => {
    const r = Math.random();
    if (r < 0.1) return 'char';
    if (r < 0.4) return 'fantiki';
    if (r < 0.7) return 'xp';
    return 'med';
  };
  /** Карта-пустышка для барабана: боец — по шансам кейса (редкие 30/30, легенды 20/20) */
  const fillerReel = (k: CaseDrop['kind']): ReelItem => {
    if (k === 'char') {
      const r = Math.random();
      const c = r < 0.3 ? 'shuba' : r < 0.6 ? 'chuma' : r < 0.8 ? 'krysa' : 'gidroxis';
      return c === 'shuba'
        ? { kind: 'char', char: 'shuba', label: '🥷 ИВАНГОЙ', sub: 'Редкий' }
        : c === 'chuma'
          ? { kind: 'char', char: 'chuma', label: '🐦‍⬛ ЧУМА', sub: 'Редкий' }
          : c === 'krysa'
            ? { kind: 'char', char: 'krysa', label: '🐀 СТЕЙСИ', sub: 'Легендарный' }
            : { kind: 'char', char: 'gidroxis', label: '🧪 ГИДРОКСИС', sub: 'Легендарный' };
    }
    const v = reelLabel(k);
    return { kind: k, label: v.label, sub: v.sub };
  };
  const dropToReel = (d: CaseDrop): ReelItem => {
    if (d.kind === 'char') {
      const c = d.char === 'shuba' ? 'shuba' : d.char === 'chuma' ? 'chuma' : d.char === 'gidroxis' ? 'gidroxis' : 'krysa';
      return c === 'shuba'
        ? { kind: 'char', char: 'shuba', label: '🥷 ИВАНГОЙ', sub: 'ТВОЯ!' }
        : c === 'chuma'
          ? { kind: 'char', char: 'chuma', label: '🐦‍⬛ ЧУМА', sub: 'ТВОЯ!' }
          : c === 'gidroxis'
            ? { kind: 'char', char: 'gidroxis', label: '🧪 ГИДРОКСИС', sub: 'ТВОЯ!' }
            : { kind: 'char', char: 'krysa', label: '🐀 СТЕЙСИ', sub: 'ТВОЯ!' };
    }
    const v = reelLabel(d.kind);
    return { kind: d.kind, label: v.label, sub: v.sub };
  };
  const [caseDrop, setCaseDrop] = useState<CaseDrop | null>(null);
  const [caseTick, setCaseTick] = useState(0);
  const [reel, setReel] = useState<ReelItem[]>([]);
  const [spin, setSpin] = useState(false);
  const [winOn, setWinOn] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const overTimer = useRef(0);
  /** Прямой доступ к ленте: крутим через style, без ре-рендеров на каждом кадре. */
  const trackRef = useRef<HTMLDivElement | null>(null);
  /** Кадр анимации (отмена при новом открытии/закрытии/размонтировании). */
  const spinAnim = useRef(0);
  /** Ревизия открытия: старый полёт чужого открытия не трогает. */
  const spinRev = useRef(0);
  /** Дроп текущего открытия: финиш анимации забирает его, а не замыкание. */
  const caseDropRef = useRef<CaseDrop | null>(null);
  const closeOverlay = useCallback(() => {
    spinRev.current++;
    if (spinAnim.current) cancelAnimationFrame(spinAnim.current);
    window.clearTimeout(overTimer.current);
    setOverlayOpen(false);
    setSpin(false);
  }, []);
  const openCase = useCallback(() => {
    const g = gameRef.current;
    if (!g || spin) return;
    const d = g.openCase();
    if (!d.ok && d.kind === 'empty') { setCaseDrop(d); return; }
    // барабан: филлер + реальный дроп строго под прицелом — на весь экран
    const items: ReelItem[] = Array.from({ length: REEL_N }, () => fillerReel(fillerKind()));
    items[REEL_WIN] = dropToReel(d);
    const rev = spinRev.current + 1;
    spinRev.current = rev;
    if (spinAnim.current) cancelAnimationFrame(spinAnim.current);
    window.clearTimeout(overTimer.current);
    caseDropRef.current = d;
    setReel(items);
    setCaseDrop(null);
    setWinOn(false);
    setSpin(true);
    setOverlayOpen(true);
  }, [spin]);
  // Полёт барабана: ведём по кадрам (rAF), а не по таймеру.
  // Цель меряем по живому DOM после вставки, едем easeOutQuart 4.8с справа налево,
  // финиш — ровно под прицелом. Пишем transform напрямую в DOM (без 300 ре-рендеров).
  useEffect(() => {
    if (!overlayOpen || reel.length === 0) return;
    const rev = spinRev.current;
    const DUR = 4800;
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
    const measure = (): number => {
      try {
        const track = trackRef.current;
        const win = document.querySelector('#caseWin') as HTMLElement | null;
        if (track && win && track.children.length > REEL_WIN) {
          const wc = track.children[REEL_WIN] as HTMLElement;
          const wr = win.getBoundingClientRect();
          const cr = wc.getBoundingClientRect();
          const t = (cr.left + cr.width / 2) - (wr.left + wr.width / 2);
          if (Number.isFinite(t) && t > 0) return t;
        }
      } catch { /* noop */ }
      return REEL_WIN * CARD_W - 140 + CARD_W / 2;
    };
    const finish = () => {
      if (rev !== spinRev.current) return;
      const d = caseDropRef.current;
      setWinOn(true);
      setSpin(false);
      if (d && d.ok) {
        setCaseDrop(d);
        setCaseTick((t) => t + 1);
        if (d.kind === 'char') setUpgTick((t) => t + 1);
      }
      // выиграл — полюбовался — оверлей сам уходит, результат остаётся во вкладке
      overTimer.current = window.setTimeout(() => {
        if (rev === spinRev.current) setOverlayOpen(false);
      }, 8000);
    };
    // два кадра — дать ленте встать в DOM, потом меряем и едем
    spinAnim.current = requestAnimationFrame(() => {
      spinAnim.current = requestAnimationFrame(() => {
        if (rev !== spinRev.current) return;
        const target = measure();
        if (trackRef.current) trackRef.current.style.transform = 'translateX(0px)';
        const t0 = performance.now();
        const step = (now: number) => {
          if (rev !== spinRev.current) return;
          const t = Math.min(1, (now - t0) / DUR);
          const x = target * easeOutQuart(t);
          if (trackRef.current) trackRef.current.style.transform = `translateX(${-x}px)`;
          if (t < 1) { spinAnim.current = requestAnimationFrame(step); return; }
          finish();
        };
        spinAnim.current = requestAnimationFrame(step);
      });
    });
    return () => { if (spinAnim.current) cancelAnimationFrame(spinAnim.current); };
  }, [overlayOpen, reel]);
  useEffect(() => () => {
    spinRev.current++;
    window.clearTimeout(overTimer.current);
    if (spinAnim.current) cancelAnimationFrame(spinAnim.current);
  }, []);
  const [keys, setKeys] = useState<KeyMap>({ ...DEFAULT_KEYS });
  const [capturing, setCapturing] = useState<keyof KeyMap | null>(null);
  const [waveBanner, setWaveBanner] = useState(0);
  const prevWave = useRef(0);
  const [nick, setNick] = useState(() => {
    try { return localStorage.getItem(NICK_KEY) || 'Братуха'; } catch { return 'Братуха'; }
  });
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomMode, setRoomMode] = useState<MapId>('arena');
  /** Сид карты от сервера: один на всех в комнате, новый после рестарта. */
  const [mapSeed, setMapSeed] = useState<number | undefined>(undefined);
  const [roomDraft, setRoomDraft] = useState('');
  const [draftMode, setDraftMode] = useState<MapId>('arena');
  const [roomsList, setRoomsList] = useState<RoomInfo[]>([]);
  const [mates, setMates] = useState<RoomMate[]>([]);
  /** PvP-табло сверху + счётчик до рестарта сервера */
  const [scoreboard, setScoreboard] = useState<Array<{ nick: string; frags: number }>>([]);
  const [myFrags, setMyFrags] = useState(0);
  const [restartIn, setRestartIn] = useState(0);
  /** экран смерти PvP: ресаун в случайной точке или выход в меню */
  const [pvpDead, setPvpDead] = useState(false);
  const pvpDeadRef = useRef(false);
  /** Баннер «сервер перезагрузился»: кикнуло TTL — заходи заново */
  const [restartKick, setRestartKick] = useState(false);
  /** список игроков сервера на Tab (в бою) */
  const [showMates, setShowMates] = useState(false);
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.code !== 'Tab') return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      if (chatOpenRef.current) return;
      e.preventDefault();
      setShowMates((v) => !v);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  /** наблюдатель Бэкрумса: цели из пульса, выбранный ник — в рефе (пульс без замыканий) */
  const [specActive, setSpecActive] = useState(false);
  /** скример: жуть на весь экран 5с после ваншота сталкера, поверх абсолютно всего */
  const [jumpscare, setJumpscare] = useState(false);
  const jumpscareTimer = useRef(0);
  const [specTargets, setSpecTargets] = useState<Array<{ sid: string; nick: string; hp: number; dead: boolean }>>([]);
  /** Побег через дверь: баннер «ты выбрался» (приз + баланс после зачисления). */
  const [escaped, setEscaped] = useState<{ gain: number; bal: number } | null>(null);
  /** Выбравшийся зашёл обратно: после старта — сразу в наблюдатели. */
  const escapedJoinRef = useRef(false);
  /** specWatch для вызова из go (объявлен ниже — напрямую была бы TDZ-ловушка). */
  const specWatchRef = useRef<(sid: string, nick: string) => Promise<void>>(() => Promise.resolve());
  const specSelNick = useRef('');
  // лобби: владелец/заявки/старт. isOwner — я создал; waiting — моя заявка висит; lobby — свежий состав
  const [isOwner, setIsOwner] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [lobby, setLobby] = useState<LobbyInfo | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  /** Смена пароля/логина в профиле + глазок (показать точки). */
  const [passOld, setPassOld] = useState('');
  const [passNew, setPassNew] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [newLogin, setNewLogin] = useState('');
  const [newLoginPass, setNewLoginPass] = useState('');
  const [loginMsg, setLoginMsg] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);
  const [admin, setAdmin] = useState<null | { rooms: Array<{ id: string; name: string; mode: string; started: boolean; round: number; players: Array<{ nick: string; login: string; char: string; score: number; kills: number; wave: number; hp: number; x: number; z: number }> ; pending: Array<{ nick: string; login: string }> }>; totalPlayers: number }>(null);
  const [profile, setProfile] = useState<{ login: string; games: number; best: number; coins: number } | null>(null);
  const [mapChoice, setMapChoice] = useState<MapId>('arena');
  // вкладки меню в стиле TWD: каждая кнопка слева — своя вкладка справа
  type TabId = 'play' | 'fighter' | 'cases' | 'promo' | 'maps' | 'editor' | 'rooms' | 'servers' | 'settings' | 'tops';
  const [menuTab, setMenuTab] = useState<TabId>('play');
  // мирный режим: врагов нет, можно гулять по карте
  const [noEnemies, setNoEnemies] = useState(false);
  // чат комнаты: T — открыть, Enter — отправить
  const [chatOpen, setChatOpen] = useState(false);
  const [chatLog, setChatLog] = useState<Array<{ nick: string; text: string; t: number }>>([]);
  const [chatText, setChatText] = useState('');
  const chatLast = useRef(0);
  /** Чья переписка на экране: id комнаты ('' — соло). Чат строго свой: чужие комнаты не подмешиваем. */
  const chatRoom = useRef('');
  const chatOpenRef = useRef(false);
  // чат открыт — персонаж глух: сбрасываем залипшие кнопки
  useEffect(() => {
    chatOpenRef.current = chatOpen;
    if (chatOpen) {
      const g = gameRef.current;
      if (g) { for (const k of Object.keys(g.input)) g.input[k] = false; }
    }
  }, [chatOpen]);
  // редактор карт: свои карты живут в localStorage, играют соло
  const CUSTOMS_KEY = 'mtt_customs_v1';
  const loadCustoms = (): Record<string, CustomMap> => {
    try {
      const d = JSON.parse(localStorage.getItem(CUSTOMS_KEY) ?? '{}') as Record<string, CustomMap>;
      const out: Record<string, CustomMap> = {};
      for (const [k, v] of Object.entries(d)) {
        if (!v || typeof v.name !== 'string') continue;
        const size = Math.min(140, Math.max(40, Math.floor(v.size ?? 90)));
        const walls = Array.isArray(v.walls) ? v.walls.filter((b) => b && isFinite(b.x) && isFinite(b.z)).slice(0, 400) : [];
        out[k] = { name: v.name.slice(0, 24), size, walls };
      }
      return out;
    } catch { return {}; }
  };
  const [customs, setCustoms] = useState<Record<string, CustomMap>>(loadCustoms);
  const [customSel, setCustomSel] = useState<string | null>(null);
  const [customRev, setCustomRev] = useState(0);
  const customsRef = useRef(customs);
  customsRef.current = customs;
  const [edName, setEdName] = useState('');
  const [edSize, setEdSize] = useState(90);
  const [edGrid, setEdGrid] = useState<number[][]>(() => Array.from({ length: 18 }, () => new Array(18).fill(0)));
  const [edTool, setEdTool] = useState<'wall' | 'erase'>('wall');
  // высота строений: какой высоты кладутся новые стены (2–8м)
  const [edH, setEdH] = useState(4);
  const edCanvas = useRef<HTMLCanvasElement | null>(null);
  const [duel, setDuel] = useState<DuelInfo | null>(null);
  const roomRef = useRef({ id: '', sid: '', mode: '' });
  const duelRef = useRef<DuelInfo | null>(null);
  const matesRef = useRef<RoomMate[]>([]);
  const prevRound = useRef(0);
  // пульс строго по очереди: пока прошлый не вернулся — новый не шлём (без обгонов и прыжков назад)
  const beatBusy = useRef(false);
  const rejoinLast = useRef(0);
  const spawnRef = useRef<{ x: number; z: number; yaw: number } | null>(null);
  // аккаунт: '' — неизвестно, 'guest' — гость, иначе логин
  const [authed, setAuthed] = useState('');
  const [authLogin, setAuthLogin] = useState('');
  const [authPass, setAuthPass] = useState('');
  /** Глазок пароля: показать/скрыть точки (вход и смена пароля). */
  const [showPass, setShowPass] = useState(false);
  const [authMsg, setAuthMsg] = useState('');
  /** промокоды: ввод, занятость, результат */
  const [promoCode, setPromoCode] = useState('');
  const [promoBusy, setPromoBusy] = useState(false);
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null);
  /** DEV-панель: разблокируется промокодом LXX42P2ILX (один на весь сервер). */
  const [devUnlocked, setDevUnlocked] = useState(() => {
    try { return localStorage.getItem('mtt_dev') === '1'; } catch { return false; }
  });
  const [devOpen, setDevOpen] = useState(false);
  const hudRef = useRef(hud);
  hudRef.current = hud;
  // ник в рефах: пульс и переподключение живут в []-эффекте и видят только протухшее замыкание
  const nickRef = useRef(nick);
  nickRef.current = nick;

  // замах: дёргаем ствол (вызывает движок через onSwing при каждом реальном ударе).
  // Без key-remount: узел стабилен (картинка не мигает), анимацию перезапускаем классом.
  // Конец замаха — по ТАЙМЕРУ (320мс), а не animationend: в фоне вкладки CSS-часы стоят,
  // и ствол иначе залипал бы в замахе навсегда.
  const [swinging, setSwinging] = useState(false);
  const swingingRef = useRef(false);
  const swingRev = useRef(0);
  const swing = useCallback(() => {
    // Синхронно: класс встаёт в ближайшем коммите (без rAF — кадр может опоздать).
    // Все кд стволов дольше 340мс, так что класс всегда успевает уйти до следующего замаха.
    const rev = swingRev.current + 1;
    swingRev.current = rev;
    swingingRef.current = true;
    setSwinging(true);
    window.setTimeout(() => {
      if (rev !== swingRev.current) return;
      swingingRef.current = false;
      setSwinging(false);
    }, 340);
  }, []);
  const endSwing = useCallback((e: React.AnimationEvent) => {
    const n = (e.nativeEvent as AnimationEvent).animationName;
    if (n === 'wswing' || n === 'wrecoil') { swingingRef.current = false; setSwinging(false); }
  }, []);

  // удар по дуэлянту: бьём только если противник в радиусе ствола и по курсу; урон ставит сервер
  const tryDuelHit = useCallback(() => {
    const d = duelRef.current;
    const g = gameRef.current;
    if (!d?.active || !d.foe || !g) return;
    const { id, sid } = roomRef.current;
    if (!id || !sid) return;
    const p = g.debugPos();
    const dx = d.foe.x - p.x, dz = d.foe.z - p.z;
    const dist = Math.hypot(dx, dz);
    const W = WEAPONS.find((w) => w.id === hudRef.current.weapon);
    if (dist > (W?.range ?? 3.8) + 1.5) return;
    const cos = (dx * -Math.sin(p.yaw) + dz * -Math.cos(p.yaw)) / (dist || 1);
    if (cos < 0.25) return;
    fetch(`/api/rooms/${id}/hit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sid, dmg: W?.dmg ?? 30 }),
    }).then((r) => r.json()).then((dd: { wins: number; round: number; lastWinner: string }) => {
      setDuel((prev) => (prev ? { ...prev, myWins: dd.wins, round: dd.round, lastWinner: dd.lastWinner } : prev));
    }).catch(() => undefined);
  }, []);

  // вход/рега: токен в сейф, ник = логин
  const doAuth = useCallback(async (kind: 'login' | 'register') => {
    setAuthMsg('');
    try {
      const r = await fetch(`/api/${kind}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login: authLogin, pass: authPass }),
      });
      const d = (await r.json()) as { token?: string; login?: string; error?: string };
      if (!r.ok || !d.token || !d.login) {
        setAuthMsg(d.error === 'taken' ? 'Логин занят' : d.error === 'badpass' || d.error === 'nouser' ? 'Неверный логин/пароль' : d.error === 'badlogin' ? 'Логин: 3–16, буквы/цифры/_' : 'Пароль: от 4 символов');
        return;
      }
      try {
        localStorage.setItem(TOKEN_KEY, d.token);
        localStorage.setItem(NICK_KEY, d.login);
      } catch { /* noop */ }
      setNick(d.login);
      setAuthed(d.login);
    } catch {
      setAuthMsg('Нет связи');
    }
  }, [authLogin, authPass]);

  const guestIn = useCallback(() => { setAuthed('guest'); }, []);
  const authOut = useCallback(() => {
    try { localStorage.removeItem(TOKEN_KEY); } catch { /* noop */ }
    setAuthed('');
  }, []);

  /** Промокод: сервер проверяет аккаунт и одноразовость, фантики падают в игру. */
  const redeemPromo = useCallback(async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) { setPromoMsg({ ok: false, text: 'Впиши код' }); return; }
    setPromoBusy(true);
    try {
      const r = await fetch('/api/promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token(), code }),
      });
      const d = (await r.json()) as { ok?: boolean; fantiki?: number; unlockAll?: boolean; dev?: boolean; error?: string };
      if (!r.ok || !d.ok) {
        setPromoMsg({
          ok: false,
          text: d.error === 'nologin'
            ? 'Войди в аккаунт (вкладка ИГРАТЬ), без него промокод не засчитать'
            : d.error === 'used' ? 'Этот код ты уже забирал'
            : d.error === 'taken' ? 'Этот код уже забрали до тебя — он был один на всех' : 'Такого кода нет, проверь буквы',
        });
        return;
      }
      const g = gameRef.current;
      if (d.dev) {
        // LXX42P2ILX: панель разработчика (один на весь сервер, сервер уже проверил)
        try { localStorage.setItem('mtt_dev', '1'); } catch { /* приватный режим */ }
        setDevUnlocked(true);
        setDevOpen(true);
        setPromoCode('');
        setPromoMsg({ ok: true, text: '🛠️ Панель разработчика твоя! Жми на баннер сбоку.' });
        return;
      }
      if (d.unlockAll) {
        // ALLTT: открываем всех бойцов на аккаунте (сейв — в localStorage, общий для комнат)
        const fresh = g ? g.unlockAllChars() : [];
        setPromoCode('');
        setUpgTick((t) => t + 1);
        setPromoMsg({
          ok: true,
          text: fresh.length > 0
            ? `🥷 Все бойцы твои! Открыто: ${fresh.length} (Стейси, Ивангой, Чума, Гидроксис). Выбирай во вкладке БОЕЦ`
            : '🥷 Все бойцы уже твои! Загляни во вкладку БОЕЦ',
        });
        return;
      }
      const bal = g ? g.addFantiki(d.fantiki ?? 0) : (d.fantiki ?? 0);
      setPromoCode('');
      setPromoMsg({ ok: true, text: `+${d.fantiki} 🎟️ фантиков! Баланс: ${bal}` });
    } catch {
      setPromoMsg({ ok: false, text: 'Нет связи, попробуй позже' });
    } finally {
      setPromoBusy(false);
    }
  }, [promoCode]);

  useEffect(() => {
    const t = token();
    if (!t) return;
    fetch(`/api/me?token=${encodeURIComponent(t)}`)
      .then((r) => r.json())
      .then((d: { login?: string }) => { if (d.login) { setAuthed(d.login); setNick(d.login); } })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    beacon();
    const t = window.setInterval(beacon, 30000);
    loadScores().then(setScores);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (gameRef.current) { gameRef.current.destroy(); gameRef.current = null; }
    const game = new Game(canvasRef.current, null, {
      onHud: (h) => { setHud(h); setQuality((q) => (q === h.quality ? q : h.quality)); },
      onBusted: () => undefined,
      onJumpscare: () => {
        setJumpscare(true);
        window.clearTimeout(jumpscareTimer.current);
        jumpscareTimer.current = window.setTimeout(() => setJumpscare(false), 5000);
      },
      // дверь выхода из Бэкрумса: сервер засчитывает побег (раз за рестарт),
      // фантики на аккаунт, баннер «ты выбрался» с выбором
      onEscape: () => {
        const { id, sid } = roomRef.current;
        void (async () => {
          let gain = 2500;
          try {
            if (id && sid) {
              const r = await fetch(`/api/rooms/${id}/escape`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sid }),
              });
              const d = (await r.json()) as { ok?: boolean; fantiki?: number };
              if (r.ok && d.ok) gain = d.fantiki ?? 2500;
            }
          } catch { /* noop */ }
          const g = gameRef.current;
          const bal = g ? g.addFantiki(gain) : gain;
          setEscaped({ gain, bal });
        })();
      },
      onSwing: () => { swing(); tryDuelHit(); },
      onNetHit: (nid, dmg) => {
        const { id: rid, sid } = roomRef.current;
        if (!rid || !sid) return;
        fetch(`/api/rooms/${rid}/mobhit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sid, id: nid, dmg }),
        }).then((r) => r.json()).then((d: { hp?: number; dead?: boolean; freshKill?: boolean }) => {
          const g = gameRef.current;
          if (!g) return;
          if (d.dead) g.netKill(nid, d.freshKill === true);
          else if (typeof d.hp === 'number') g.netSyncHp(nid, d.hp);
        }).catch(() => undefined);
      },
      onPvpHit: (fid, dmg) => {
        const { id: rid, sid } = roomRef.current;
        if (!rid || !sid) return;
        fetch(`/api/rooms/${rid}/pvphit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sid, target: fid, dmg }),
        }).then((r) => r.json()).then((d: { frags?: number }) => {
          if (typeof d.frags === 'number') setMyFrags(d.frags);
        }).catch(() => undefined);
      },
      onPvpDead: () => { pvpDeadRef.current = true; setPvpDead(true); },
    }, mapChoice, { enemies: !noEnemies && mapChoice !== 'pvp', custom: mapChoice === 'custom' ? customsRef.current[customSel ?? ''] ?? null : undefined,
      // сид от сервера: один на всех в комнате, новый после рестарта.
      // Нет серверного (соло) — хеш комнаты или случайный («новый каждый раз»).
      seed: (mapChoice === 'backrooms' || mapChoice === 'endless') ? (mapSeed ?? (roomRef.current.id ? hashSeed(roomRef.current.id) : undefined)) : undefined });
    gameRef.current = game;
    setSound(game.getSound());
    setVolume(game.getVolume());
    setDrawDist(game.getDrawDist());
    setSens(game.getSens());
    setQuality(game.getQuality());
    setChar(game.getChar());
    setKeys(game.getKeys());
    (window as unknown as { __mtt?: object }).__mtt = {
      pos: () => game.debugPos(),
      attack: () => game.debugAttack(),
      hp: () => game.debugHp(),
      py: () => game.debugPy(),
      hops: () => game.debugHops(),
      keys: () => game.getKeys(),
      spots: () => game.debugSpots(),
      solids: () => game.debugSolids(),
      solidAt: (x: number, z: number, y: number, r?: number) => game.debugSolidAt(x, z, y, r ?? 0.9),
      path: (fx: number, fz: number, tx: number, tz: number) => game.debugPath(fx, fz, tx, tz),
      ground: (x: number, z: number) => game.debugGround(x, z),
      tracers: () => game.debugTracers(),
      give: (n: number) => game.debugGive(n),
      hurt: (n: number) => game.debugHurt(n),
      revive: () => game.debugRevive(),
      setWave: (n: number) => game.debugSetWave(n),
      joy: (x: number, y: number) => game.setJoy(x, y),
      look: (dx: number, dy: number) => game.addLook(dx, dy),
      remotes: () => game.debugRemotes(),
      setRemotes: (list: RoomMate[]) => game.setRemotes(list),
      chara: () => game.getChar(),
      quality: () => game.getQuality(),
      drawd: () => game.getDrawDist(),
      setdraw: (n: number) => game.setDrawDist(n),
      dash: () => game.debugDash(),
      invis: () => game.debugInvis(),
      chuma: () => game.debugChuma(),
      doChuma: () => game.chuma(),
      dome: () => game.debugDome(),
      xray: () => game.debugXray(),
      doXray: () => game.xray(),
      xrayFlags: () => game.debugXrayFlags(),
      playing: () => game.debugPlaying(),
      atkcd: () => game.debugAtkCd(),
      netsync: () => game.debugNetSync(),
      netsyncSet: (on: boolean) => game.debugNetSyncSet(on),
      mobsSet: (list: RemoteMob[]) => game.debugMobsSet(list),
      netmobs: () => game.debugNetMobs(),
      resetcd: () => game.debugResetCd(),
      doDash: () => game.dash(),
      wall: () => game.debugWall(),
      kick: () => game.debugKick(),
      map: () => game.debugMap(),
      duelHp: (hp: number) => game.setDuelHp(hp),
      teleport: (x: number, z: number, yaw?: number) => game.debugTeleport(x, z, yaw),
      pvpHp: (n: number) => game.setPvpHp(n),
      pvpSpawn: () => game.randomSpawn(),
      pvpRespawn: (x: number, z: number) => game.pvpRespawn(x, z),
      fps: () => game.debugFps(),
      stalkers: () => game.spawnStalkers(),
      stalkCount: () => game.debugStalkers(),
      godBars: () => game.debugGodBars(),
      stalkTex: () => game.debugStalkerTex(),
      steps: () => game.debugSteps(),
      flush: () => game.flushProgress(),
      spec: (on: boolean, x: number, z: number, nick?: string) => game.setSpec(on, x, z, nick ?? ''),
      specOn: () => game.debugSpec(),
      specpos: () => game.debugSpecPos(),
      unlockall: () => game.unlockAllChars(),
      mkroom: (name: string, mode: MapId) => createRoom(name, mode),
      charaSet: (id: string) => { game.unlockChar(id); return game.setChar(id); },
      switchW: () => game.switchWeapon(),
      medBuy: () => game.buyMedkit(),
      medUse: () => game.useMedkit(),
      level: () => game.level(),
      xp: (id: string) => game.xpOf(id),
      xpneed: (id: string) => game.xpNeedOf(id),
      upg: (id: string) => game.upgOf(id),
      supercd: (id: string) => game.superCdOf(id),
      buyupg: (id: string, key: 'hp' | 'dmg' | 'spd' | 'sup') => game.buyUpg(id, key),
      unlock: (id: string) => game.unlockChar(id),
      haschar: (id: string) => game.hasChar(id),
      opencase: () => game.openCase(),
      spawnKind: (kind: 'walk' | 'fly' | 'boss') => game.debugSpawn(kind),
      foes: () => game.debugFoes(),
      flyers: () => game.debugFlyers(),
      boss: () => game.debugBoss(),
      remoteList: () => game.debugRemoteList(),
      roomSid: () => roomRef.current.sid,
      maze: () => game.debugMaze(),
      fog: () => game.debugFog(),
      door: () => game.debugDoor(),
      perf: () => game.debugPerf(),
      doorPulse: () => game.debugDoorPulse(),
      doorPulseForce: (v: boolean | null) => game.debugDoorPulseForce(v),
      doorFace: () => game.debugDoorFace(),
      doorMat: () => game.debugDoorMat(),
      custom: () => game.debugCustom(),
      peaceful: () => !game.enemiesOn,
    };
    const kd = (e: KeyboardEvent) => {
      // печатаешь в чат (или чат открыт) — персонаж не слушает кнопки
      const t = e.target as HTMLElement | null;
      if (chatOpenRef.current || (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA'))) return;
      game.input[e.code] = true;
      const hk = game.getKeys().hit;
      if (e.code === hk || e.code === 'KeyJ') e.preventDefault();
      // пробел и стрелки — игровые: не даём странице скроллиться и сфокусированной
      // кнопке срабатывать (иначе Space вместо взлёта жмёт «реснуть/выйти» и кажется,
      // что наблюдатель завис). Чат и поля ввода выше уже отсечены.
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'ArrowDown' || e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
        e.preventDefault();
        (document.activeElement as HTMLElement | null)?.blur?.();
      }
    };
    const ku = (e: KeyboardEvent) => { game.input[e.code] = false; };
    window.addEventListener('keydown', kd);
    window.addEventListener('keyup', ku);
    return () => {
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
      game.destroy();
      gameRef.current = null;
      delete (window as unknown as { __mtt?: object }).__mtt;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapChoice, noEnemies, customSel, customRev, menu, roomId, mapSeed]);

  const go = useCallback(async () => {
    try { localStorage.setItem(NICK_KEY, nick); } catch { /* noop */ }
    // создатель своим входом даёт старт всей комнате
    const { id, sid } = roomRef.current;
    if (id && sid && isOwner) {
      fetch(`/api/rooms/${id}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sid }),
      }).catch(() => undefined);
    }
    setMenu(false);
    // загрузка: греем текстуры под оверлеем, в бой — под щитом (щит до движения/выстрела)
    setLoading({ show: true, pct: 0 });
    try {
      await gameRef.current?.preload((p) => setLoading({ show: true, pct: p }));
    } catch { /* noop */ }
    gameRef.current?.setShield(true);
    setLoading({ show: false, pct: 100 });
    window.setTimeout(() => {
      const g = gameRef.current;
      if (!g) return;
      const sp = spawnRef.current;
      if (sp && roomMode === 'duel') g.debugTeleport(sp.x, sp.z, sp.yaw);
      // официальные режимы: случайная точка (сервер тоже раскидал, пульс сведёт)
      if (roomMode === 'pvp' || roomMode === 'endless' || roomMode === 'invasion') g.randomSpawn();
      pvpDeadRef.current = false;
      setPvpDead(false);
      g.start();
      // выбравшийся вернулся: до рестарта только наблюдатель — сразу в призраки
      if (escapedJoinRef.current) {
        escapedJoinRef.current = false;
        window.setTimeout(() => { void specWatchRef.current?.('', ''); }, 1000);
      }
    }, 50);
    loadScores().then(setScores);
    setEscaped(null);
  }, [nick, roomMode, isOwner]);

  // админ-панель МТТ: онлайн и действия каждого (сервер пускает только владельца)
  const loadAdmin = useCallback(async () => {
    try {
      const r = await fetch(`/api/admin/stats?token=${encodeURIComponent(token())}`);
      if (!r.ok) { setAdmin(null); return false; }
      setAdmin((await r.json()) as { rooms: []; totalPlayers: number });
      return true;
    } catch { setAdmin(null); return false; }
  }, []);

  // профиль: сведения об аккаунте, скрыты пока не откроешь
  const openProfile = useCallback(async () => {
    setProfileOpen(true);
    if (authed === 'guest' || !authed) { setProfile(null); return; }
    try {
      const r = await fetch(`/api/profile?login=${encodeURIComponent(authed)}`);
      if (!r.ok) { setProfile(null); return; }
      setProfile((await r.json()) as { login: string; games: number; best: number; coins: number });
    } catch { setProfile(null); }
  }, [authed]);

  // смена пароля: старый + новый, хранится только хеш на сервере
  const changePass = useCallback(async () => {
    setPassMsg('');
    try {
      const r = await fetch('/api/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token(), old: passOld, pass: passNew }),
      });
      const d = (await r.json()) as { ok?: boolean; error?: string };
      if (!r.ok || !d.ok) {
        setPassMsg(d.error === 'badpass' ? 'Старый пароль неверный' : d.error === 'passlen' ? 'Новый: от 4 до 64 символов' : 'Не вышло, попробуй позже');
        return;
      }
      setPassOld('');
      setPassNew('');
      setPassMsg('Пароль сменён ✅');
    } catch {
      setPassMsg('Нет связи');
    }
  }, [passOld, passNew]);

  // смена логина: пароль для подтверждения, статистика и промокоды едут следом
  const changeLogin = useCallback(async () => {
    setLoginMsg('');
    try {
      const r = await fetch('/api/login-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token(), pass: newLoginPass, login: newLogin }),
      });
      const d = (await r.json()) as { ok?: boolean; login?: string; error?: string };
      if (!r.ok || !d.ok || !d.login) {
        setLoginMsg(d.error === 'badpass' ? 'Пароль неверный' : d.error === 'taken' ? 'Такой логин уже занят' : d.error === 'badlogin' ? 'Логин: 3–16, буквы/цифры/_' : 'Не вышло, попробуй позже');
        return;
      }
      const next = d.login;
      setAuthed(next);
      // ник совпадал со старым логином — едем следом, чужой ник не трогаем
      setNick((prev) => {
        const v = prev === authed ? next : prev;
        try { localStorage.setItem(NICK_KEY, v); } catch { /* noop */ }
        return v;
      });
      setProfile((prev) => (prev ? { ...prev, login: next } : prev));
      setNewLogin('');
      setNewLoginPass('');
      setLoginMsg(`Теперь ты @${next} ✅`);
    } catch {
      setLoginMsg('Нет связи');
    }
  }, [newLogin, newLoginPass, authed]);

  // ---- комнаты ----
  const refreshRooms = useCallback(() => { loadRooms().then(setRoomsList); void loadStats(); loadDuelTop().then(setDuelTop); pingApi(); }, []);
  const [apiPing, setApiPing] = useState(-1);
  const pingApi = useCallback(async () => {
    const t0 = Date.now();
    try {
      const r = await fetch('/api/stats');
      if (!r.ok) throw new Error('bad');
      setApiPing(Date.now() - t0);
    } catch { setApiPing(-1); }
  }, []);
  useEffect(() => { refreshRooms(); }, [refreshRooms]);

  const createRoom = useCallback(async (nameOverride?: string, modeOverride?: MapId) => {
    try {
      const r = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nick: nickRef.current, name: nameOverride ?? roomDraft, char: gameRef.current?.getChar() ?? 'mtt', mode: modeOverride ?? draftMode, token: token() }),
      });
      if (!r.ok) return;
      const d = (await r.json()) as { id: string; sid: string; mode: MapId; seed?: number; spawn: { x: number; z: number; yaw: number } | null };
      roomRef.current = { id: d.id, sid: d.sid, mode: d.mode };
      setRoomId(d.id);
      setMapSeed(typeof d.seed === 'number' ? d.seed >>> 0 : undefined);
      // новая комната — новый чат: чужую переписку не тащим
      chatRoom.current = d.id; chatLast.current = 0; setChatLog([]);
      setRoomName(nameOverride || roomDraft || `Комната ${nickRef.current}`);
      setRoomMode(d.mode);
      setMapChoice(d.mode);
      spawnRef.current = d.spawn;
      prevRound.current = 1;
      setDuel(null);
      duelRef.current = null;
      setMates([]);
      matesRef.current = [];
      setIsOwner(true);
      setWaiting(false);
      escapedJoinRef.current = false;
      setLobby(null);
      refreshRooms();
    } catch { /* noop */ }
  }, [nick, roomDraft, draftMode, refreshRooms]);

  const joinRoom = useCallback(async (id: string) => {
    try {
      const r = await fetch(`/api/rooms/${id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nick, char: gameRef.current?.getChar() ?? 'mtt', token: token() }),
      });
      if (!r.ok) return;
      const d = (await r.json()) as { sid: string; name: string; mode: MapId; seed?: number; pending?: boolean };
      roomRef.current = { id, sid: d.sid, mode: d.mode };
      if ((d as { escaped?: boolean }).escaped === true) escapedJoinRef.current = true;
      setRoomId(id);
      setMapSeed(typeof d.seed === 'number' ? d.seed >>> 0 : undefined);
      // чужая комната — чужой чат не смотрим: лог чистим, дальше только своё
      chatRoom.current = id; chatLast.current = 0; setChatLog([]);
      setRoomName(d.name);
      setRoomMode(d.mode);
      setMapChoice(d.mode);
      spawnRef.current = null;
      prevRound.current = 1;
      setDuel(null);
      duelRef.current = null;
      setMates([]);
      matesRef.current = [];
      setIsOwner(false);
      setWaiting(!!d.pending);
      setLobby(null);
      setRestartKick(false);
      refreshRooms();
    } catch { /* noop */ }
  }, [nick, refreshRooms]);

  const leaveRoom = useCallback(async () => {
    const { id, sid } = roomRef.current;
    roomRef.current = { id: '', sid: '', mode: '' };
    setRoomId('');
    setMapSeed(undefined);
    // вышел — чат комнаты больше не твой: чистим
    chatRoom.current = ''; chatLast.current = 0; setChatLog([]);
    setRoomName('');
    setRoomMode('arena');
    setMapChoice('arena');
    spawnRef.current = null;
    prevRound.current = 0;
    setDuel(null);
    duelRef.current = null;
    setMates([]);
    matesRef.current = [];
    setIsOwner(false);
    setWaiting(false);
    setLobby(null);
    gameRef.current?.setNetSync(false);
    gameRef.current?.setRemotes([]);
    setScoreboard([]);
    setMyFrags(0);
    setRestartIn(0);
    setPvpDead(false);
    pvpDeadRef.current = false;
    setSpecActive(false);
    setSpecTargets([]);
    specSelNick.current = '';
    setEscaped(null);
    escapedJoinRef.current = false;
    setShowMates(false);
    gameRef.current?.setSpec(false);
    if (id && sid) {
      try {
        await fetch(`/api/rooms/${id}/leave`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sid }),
        });
      } catch { /* noop */ }
    }
    refreshRooms();
  }, [refreshRooms]);

  // выйти в меню из боя: рейтинг сохраняем, движок ставим на паузу
  const toMenu = useCallback(() => {
    const h = hudRef.current;
    submitScore(nick, h.score, 0);
    gameRef.current?.stop();
    gameRef.current?.setNetSync(false);
    setMenu(true);
    loadScores().then(setScores);
    refreshRooms();
  }, [nick, refreshRooms]);

  /** В МЕНЮ из боя: ресурсы на диск (фантики/стволы/кач) + рейтинг на сервер,
      затем мгновенный вылет с сервера (leave чистит комнату сразу, fetch — в фоне). */
  const exitToMenu = useCallback(() => {
    try { gameRef.current?.flushProgress(); } catch { /* noop */ }
    toMenu();
    void leaveRoom();
  }, [toMenu, leaveRoom]);

  /** Наблюдатель живёт в лабиринте (бекрумс + бесконечный — одна карта) */
  const specWatch = useCallback(async (targetSid: string, targetNick: string) => {
    const { id, sid } = roomRef.current;
    const g = gameRef.current;
    if (!g) return;
    // наблюдатель живёт в лабиринте (бекрумс + бесконечный — одна карта);
    // в остальных режимах входа нет
    if (g.debugMap() !== 'backrooms' && g.debugMap() !== 'endless') return;
    if (!id || !sid) {
      // соло без комнаты (пустой сервер): наблюдатель локально, целей нет — сразу свободный полёт
      specSelNick.current = targetNick;
      setSpecTargets([]);
      setSpecActive(true);
      const p = g.debugPos();
      g.setSpec(true, p.x, p.z, targetNick);
      return;
    }
    try {
      const r = await fetch(`/api/rooms/${id}/watch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sid, target: targetSid }),
      });
      if (!r.ok) return;
      const d = (await r.json()) as { targets?: Array<{ sid: string; nick: string; hp: number; dead: boolean }> };
      const targets = d.targets ?? [];
      specSelNick.current = targetNick || targets[0]?.nick || '';
      setSpecTargets(targets);
      setSpecActive(true);
      const p = g.debugPos();
      g.setSpec(true, p.x, p.z, specSelNick.current);
    } catch { /* noop */ }
  }, []);
  specWatchRef.current = specWatch;

  // действия создателя в лобби
  const lobbyAct = useCallback(async (action: 'approve' | 'deny' | 'kick' | 'start', target?: string) => {
    const { id, sid } = roomRef.current;
    if (!id || !sid) return;
    try {
      const r = await fetch(`/api/rooms/${id}/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sid, target }),
      });
      if (!r.ok) return;
      if (action === 'start') go();
    } catch { /* noop */ }
  }, [go]);

  // пульс комнаты 5 раз в секунду (раз в 0.2с): шлём себя, забираем сокомнатников (без задержек) + дуэль
  useEffect(() => {
    const t = window.setInterval(async () => {
      const g = gameRef.current;
      const { id, sid } = roomRef.current;
      if (!g || !id || !sid) return;
      if (beatBusy.current) return;
      beatBusy.current = true;
      try {
        const p = g.debugPos();
        const h = hudRef.current;
        const pr = g.presence();
        // зависший запрос не должен клинить пульс навсегда: рвём через 3с (пульс быстрый, 0.2с)
        const ctl = new AbortController();
        const to = window.setTimeout(() => ctl.abort(), 3000);
        let r: Response;
        try {
          r = await fetch(`/api/rooms/${id}/beat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sid, char: g.getChar(), x: p.x, z: p.z, yaw: p.yaw, hp: h.hp, score: h.score, kills: h.kills, wave: h.wave, weapon: pr.weapon, py: pr.py, atk: pr.atk, dead: pr.dead }),
            signal: ctl.signal,
          });
        } finally { window.clearTimeout(to); }
        if (r.status === 404) {
          // комнаты нет: TTL выкинул всех (рестарт сервера) или комнату снесли —
          // в меню с баннером, заходим заново
          leaveRoom();
          toMenu();
          setRestartKick(true);
          return;
        }
        if (!r.ok) {
          // вылет из комнаты: молча просимся назад тем же ником (не чаще раза в 5с),
          // создатель примет — игра продолжится; заявитель просто ждёт; комнаты нет — в меню
          if (r.status === 403) {
            let err = '';
            try { err = String(((await r.json()) as { error?: string }).error ?? ''); } catch { /* noop */ }
            if (err === 'nosid' && Date.now() - rejoinLast.current > 5000) {
              rejoinLast.current = Date.now();
              try {
                const jr = await fetch(`/api/rooms/${id}/join`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ nick: nickRef.current, char: g.getChar(), token: localStorage.getItem(TOKEN_KEY) ?? '' }),
                });
                if (jr.status === 404) {
                  leaveRoom();
                  toMenu();
                  setRestartKick(true);
                  return;
                }
                const jd = (await jr.json()) as { sid?: string };
                if (typeof jd.sid === 'string' && jd.sid) roomRef.current = { ...roomRef.current, sid: jd.sid };
              } catch { /* noop */ }
            }
          }
          return;
        }
        const d = (await r.json()) as BeatInfo;
        // запоздалый ответ уже чужой комнаты — игнорим целиком (чат, строй, мобы)
        if (id !== chatRoom.current) return;
        if (typeof d.seed === 'number') setMapSeed((prev) => (prev === (d.seed! >>> 0) ? prev : (d.seed! >>> 0)));
        const plist = d.players ?? [];
        setMates(plist);
        matesRef.current = plist;
        // сокомнатники + дуэлянт — все в одном строю, полными телами
        const all = [...plist];
        if (d.duel && d.duel.active && d.duel.foe) {
          const f = d.duel.foe;
          all.push({ nick: f.nick, login: f.login, char: f.char, x: f.x, z: f.z, hp: f.hp, score: 0, kills: 0, wave: 1, weapon: f.weapon, py: f.py, atk: f.atk, dead: f.dead });
        }
        g.setRemotes(all);
        // PvP: табло сверху, серверный hp, очередь ресауна, таймер рестарта
        const isPvp = roomRef.current.mode === 'pvp';
        if (isPvp) {
          if (Array.isArray(d.scoreboard)) setScoreboard(d.scoreboard);
          if (typeof d.myFrags === 'number') setMyFrags(d.myFrags);
          setRestartIn(typeof d.restartIn === 'number' ? d.restartIn : 0);
          // сначала серверный hp (в ноль — экран смерти), потом точка ресауна (мимо экрана)
          if (typeof d.myHp === 'number' && !pvpDeadRef.current) g.setPvpHp(d.myHp);
          if (d.respawn && !pvpDeadRef.current) g.pvpRespawn(d.respawn.x, d.respawn.z);
        } else if (roomRef.current.mode === 'endless' || roomRef.current.mode === 'invasion' || roomRef.current.mode === 'backrooms') {
          setRestartIn(typeof d.restartIn === 'number' ? d.restartIn : 0);
          // наблюдатель живёт в лабиринте (бекрумс + бесконечный): в других режимах цели не подхватываем
          if ((roomRef.current.mode === 'backrooms' || roomRef.current.mode === 'endless') && d.specView && d.specView.spec) {
            const tgts = d.specView.targets ?? [];
            setSpecTargets(tgts);
            setSpecActive(true);
            if (!specSelNick.current && tgts.length > 0) specSelNick.current = tgts[0]?.nick ?? '';
            if (specSelNick.current) {
              try {
                const list = g.debugRemoteList();
                const t = list.find((q) => q.nick === specSelNick.current);
                if (t) g.setSpec(true, t.x, t.z, specSelNick.current);
              } catch { /* noop */ }
            }
          }
        }
        // общие мобы: хост заливает слепок, гость ставит кукол (только в бою на моб-карте)
        // PvP без мобов; endless/invasion — хост назначает сервер (первый боец)
        const mobMap = roomRef.current.mode === 'arena' || roomRef.current.mode === 'backrooms' || roomRef.current.mode === 'endless' || roomRef.current.mode === 'invasion';
        const amOwner = d.owner === true || d.mobHost === true;
        const inGame = (() => { try { return g.debugPlaying(); } catch { return false; } })();
        // хост Бэкрумса выпускает 5 сталкеров (движок — один раз за бой, гостям — куклы)
        if (roomRef.current.mode === 'endless' && inGame && amOwner) {
          try { g.spawnStalkers(); } catch { /* noop */ }
        }
        g.setNetSync(!!id && inGame && !amOwner && mobMap);
        if (inGame && mobMap && amOwner) {
          try {
            await fetch(`/api/rooms/${id}/mobpush`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sid, mobs: g.debugMobs() }),
            });
          } catch { /* noop */ }
          // хост тоже читает слепок: фраги гостей гаснут локально, полосы едут к серверному пулу
          if (Array.isArray(d.mobs)) g.applyHostKills(d.mobs);
        } else if (inGame && mobMap && !amOwner && Array.isArray(d.mobs)) {
          g.setRemoteMobs(d.mobs);
        }
        // чат своей комнаты: добираем только новое по метке времени
        if (d.chat && d.chat.length > 0) {
          setChatLog((prev) => {
            const known = prev.length > 0 ? prev[prev.length - 1].t : chatLast.current;
            const fresh = d.chat!.filter((m) => m.t > known);
            if (fresh.length === 0) return prev;
            chatLast.current = fresh[fresh.length - 1].t;
            return [...prev.slice(-19), ...fresh].slice(-20);
          });
        }
        if (d.duel && d.duel.active) {
          const dd = d.duel;
          setDuel(dd);
          duelRef.current = dd;
          g.setDuelHp(dd.myHp);
          if (dd.spawn && dd.round !== prevRound.current) {
            prevRound.current = dd.round;
            g.debugTeleport(dd.spawn.x, dd.spawn.z, dd.spawn.yaw);
          }
        } else {
          setDuel(null);
          duelRef.current = null;
          prevRound.current = 0;
        }
      } catch { /* noop */ } finally { beatBusy.current = false; }
    }, 200);
    return () => window.clearInterval(t);
  }, []);

  // пульс лобби в меню: состав, заявки, старт от создателя (не владелец сам входит по старту)
  const startedRef = useRef(false);
  useEffect(() => {
    if (!menu || !roomId || !roomRef.current.sid) { startedRef.current = false; return; }
    const t = window.setInterval(async () => {
      const { id, sid } = roomRef.current;
      if (!id || !sid) return;
      try {
        const r = await fetch(`/api/rooms/${id}/info?sid=${encodeURIComponent(sid)}`);
        if (!r.ok) { setLobby(null); return; }
        const d = (await r.json()) as LobbyInfo & { spawn?: { x: number; z: number; yaw: number } };
        setLobby(d);
        if (typeof d.seed === 'number') setMapSeed((prev) => (prev === (d.seed! >>> 0) ? prev : (d.seed! >>> 0)));
        if (d.accepted) setWaiting(false);
        if (d.started && !d.owner && !startedRef.current) {
          startedRef.current = true;
          if (d.spawn) spawnRef.current = d.spawn;
          go();
        }
      } catch { /* noop */ }
    }, 1500);
    return () => window.clearInterval(t);
  }, [menu, roomId, go]);

  // админка открыта — обновляем онлайн каждые 2 секунды
  useEffect(() => {
    if (!adminOpen || admin === null) return;
    const t = window.setInterval(() => { void loadAdmin(); }, 2000);
    return () => window.clearInterval(t);
  }, [adminOpen, admin, loadAdmin]);

  const onBustedShown = useRef(false);
  // плашка нового раунда: всплывает на каждую смену волны
  useEffect(() => {
    if (menu || hud.wave === prevWave.current) return;
    prevWave.current = hud.wave;
    setWaveBanner(hud.wave);
    const t = window.setTimeout(() => setWaveBanner(0), 2600);
    return () => window.clearTimeout(t);
  }, [hud.wave, menu]);
  // плашка БОССА: гопник вышел — все видят
  const [bossBanner, setBossBanner] = useState(false);
  const prevBoss = useRef(0);
  useEffect(() => {
    if (menu) { prevBoss.current = hud.boss; return; }
    if (hud.boss > 0 && prevBoss.current === 0) {
      setBossBanner(true);
      const t = window.setTimeout(() => setBossBanner(false), 3000);
      prevBoss.current = hud.boss;
      return () => window.clearTimeout(t);
    }
    prevBoss.current = hud.boss;
  }, [hud.boss, menu]);
  // I — полный экран в один клик (в полях ввода не срабатывает)
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.code !== 'KeyI') return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      if (document.fullscreenElement) void document.exitFullscreen();
      else void document.documentElement.requestFullscreen().catch(() => {});
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  // T — чат комнаты в бою (в полях ввода и в меню не срабатывает)
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.code !== 'KeyT') return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      if (menu) return;
      e.preventDefault();
      setChatOpen((o) => !o);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [menu]);

  // Escape — закрыть ОДИН верхний оверлей за нажатие: чат → магазин → настройки → профиль → онлайн.
  // Кейс не трогаем: посреди прокрута выход только через ЗАБРАТЬ.
  // В полях ввода не срабатываем (там свой Enter/Escape: чат шлёт по Enter, закрывается своим хендлером).
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.code !== 'Escape') return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      if (chatOpen) { e.preventDefault(); setChatOpen(false); }
      else if (shopOpen) { e.preventDefault(); setShopOpen(false); }
      else if (setOpen) { e.preventDefault(); setSetOpen(false); }
      else if (profileOpen) { e.preventDefault(); setProfileOpen(false); }
      else if (adminOpen) { e.preventDefault(); setAdminOpen(false); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [chatOpen, shopOpen, setOpen, profileOpen, adminOpen]);

  // отправка в чат комнаты
  const sendChat = useCallback(async () => {
    const text = chatText.trim().slice(0, 200);
    if (!text) return;
    const { id, sid } = roomRef.current;
    setChatText('');
    if (!id || !sid) {
      // без комнаты — видно только мне
      const m = { nick: nick || 'Я', text, t: Date.now() };
      chatLast.current = m.t;
      setChatLog((prev) => [...prev.slice(-19), m]);
      return;
    }
    try {
      await fetch(`/api/rooms/${id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sid, text }),
      });
    } catch { /* noop */ }
  }, [chatText, nick]);

  // ---- редактор карт ----
  const edCols = Math.max(8, Math.min(28, Math.round(edSize / 5)));
  // рисование сетки: трава + стены + точка спавна (юг). Обычная функция — зовём отовсюду.
  const drawEd = (grid: number[][]) => {
    const cv = edCanvas.current ?? (document.querySelector('#edGrid') as HTMLCanvasElement | null);
    if (!cv) return;
    const cols = grid.length;
    const px = 20;
    cv.width = cols * px; cv.height = cols * px;
    const g = cv.getContext('2d');
    if (!g) return;
    g.fillStyle = '#2a4a2a';
    g.fillRect(0, 0, cv.width, cv.height);
    for (let y = 0; y < cols; y++) {
      for (let x = 0; x < cols; x++) {
        if (grid[y]?.[x]) {
          g.fillStyle = '#c9a06a';
          g.fillRect(x * px + 1, y * px + 1, px - 2, px - 2);
        } else {
          g.strokeStyle = 'rgba(255,255,255,.12)';
          g.strokeRect(x * px + 0.5, y * px + 0.5, px - 1, px - 1);
        }
      }
    }
    // спавн — юг по центру
    g.fillStyle = '#39d353';
    g.beginPath();
    g.arc(cv.width / 2, cv.height - px * 1.5, px * 0.4, 0, 6.29);
    g.fill();
  };
  // применить сетку сразу с отрисовкой
  const applyGrid = (ng: number[][]) => { setEdGrid(ng); drawEd(ng); };
  // смена размера — чистая сетка под него
  const changeEdSize = (s: number) => {
    setEdSize(s);
    const c = Math.max(8, Math.min(28, Math.round(s / 5)));
    applyGrid(Array.from({ length: c }, () => new Array(c).fill(0)));
  };
  const paintEd = (cx: number, cy: number) => {
    // клетка хранит высоту: 0 — пусто, иначе высота строения
    const v = edTool === 'wall' ? edH : 0;
    const c = Math.max(8, Math.min(28, Math.round(edSize / 5)));
    if (cx < 0 || cy < 0 || cx >= c || cy >= c) return;
    setEdGrid((g) => {
      if (cy >= g.length || cx >= g[0].length || g[cy][cx] === v) return g;
      const ng = g.map((row) => row.slice());
      ng[cy][cx] = v;
      drawEd(ng);
      return ng;
    });
  };
  const edCellPos = (e: React.MouseEvent<HTMLCanvasElement>): [number, number] => {
    const el = e.target as HTMLCanvasElement;
    const r = el.getBoundingClientRect();
    return [Math.floor((e.clientX - r.left) / (r.width / edCols)), Math.floor((e.clientY - r.top) / (r.width / edCols))];
  };
  // клетки в блоки: сливаем ряды подряд в длинные стены, высота — из клетки
  const gridToWalls = (grid: number[][], size: number): CustomMap['walls'] => {
    const cols = grid.length;
    const cell = size / cols;
    const walls: CustomMap['walls'] = [];
    for (let y = 0; y < cols; y++) {
      let x = 0;
      while (x < cols) {
        const raw = Math.round(grid[y][x] ?? 0);
        if (!raw) { x++; continue; }
        const h = Math.min(8, Math.max(2, raw));
        let x2 = x;
        while (x2 + 1 < cols && Math.round(grid[y][x2 + 1] ?? 0) === raw) x2++;
        const run = x2 - x + 1;
        walls.push({
          x: -size / 2 + (x + run / 2) * cell,
          z: -size / 2 + (y + 0.5) * cell,
          w: run * cell,
          d: cell,
          h,
        });
        x = x2 + 1;
      }
    }
    return walls.slice(0, 400);
  };
  const wallsToGrid = (walls: CustomMap['walls'], size: number, cols: number): number[][] => {
    const grid = Array.from({ length: cols }, () => new Array(cols).fill(0));
    const cell = size / cols;
    for (const b of walls) {
      const h = Math.min(8, Math.max(2, Math.round(b.h)));
      const x0 = Math.max(0, Math.floor((b.x - b.w / 2 + size / 2) / cell));
      const x1 = Math.min(cols - 1, Math.floor((b.x + b.w / 2 + size / 2) / cell));
      const y0 = Math.max(0, Math.floor((b.z - b.d / 2 + size / 2) / cell));
      const y1 = Math.min(cols - 1, Math.floor((b.z + b.d / 2 + size / 2) / cell));
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) grid[y][x] = h;
    }
    return grid;
  };
  const saveCustom = useCallback(() => {
    const name = edName.trim().slice(0, 24) || `Карта ${Object.keys(customsRef.current).length + 1}`;
    const walls = gridToWalls(edGrid, edSize);
    const next = { ...customsRef.current, [name]: { name, size: edSize, walls } };
    setCustoms(next);
    customsRef.current = next;
    try { localStorage.setItem(CUSTOMS_KEY, JSON.stringify(next)); } catch { /* noop */ }
    setCustomSel(name);
    setCustomRev((r) => r + 1);
    setMapChoice('custom');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edName, edGrid, edSize]);
  const editCustom = useCallback((name: string) => {
    const m = customsRef.current[name];
    if (!m) return;
    setEdName(m.name);
    setEdSize(m.size);
    const c = Math.max(8, Math.min(28, Math.round(m.size / 5)));
    setEdGrid(wallsToGrid(m.walls, m.size, c));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const delCustom = useCallback((name: string) => {
    const next = { ...customsRef.current };
    delete next[name];
    setCustoms(next);
    customsRef.current = next;
    try { localStorage.setItem(CUSTOMS_KEY, JSON.stringify(next)); } catch { /* noop */ }
    if (customSel === name) { setCustomSel(null); setMapChoice('arena'); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customSel]);
  const playCustom = useCallback((name: string) => {
    if (!customsRef.current[name]) return;
    setCustomSel(name);
    setMapChoice('custom');
  }, []);
  useEffect(() => {
    if (!capturing) return;
    const h = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const g = gameRef.current;
      if (g) setKeys({ ...g.setKeys({ [capturing]: e.code } as Partial<KeyMap>) });
      setCapturing(null);
    };
    window.addEventListener('keydown', h, true);
    return () => window.removeEventListener('keydown', h, true);
  }, [capturing]);
  useEffect(() => {
    if (hud.dead && !onBustedShown.current) {
      onBustedShown.current = true;
      submitScore(nick, hud.score, 0);
      window.setTimeout(() => {
        onBustedShown.current = false;
        loadScores().then(setScores);
      }, 2400);
    }
  }, [hud.dead, hud.score, nick]);

  const joyMove = useCallback((e: React.PointerEvent) => {
    if (joyId.current === -1) return;
    const base = joyRef.current;
    if (!base) return;
    const r = base.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    let dx = (e.clientX - cx) / (r.width / 2);
    let dy = (e.clientY - cy) / (r.height / 2);
    dx = Math.max(-1, Math.min(1, dx));
    dy = Math.max(-1, Math.min(1, dy));
    gameRef.current?.setJoy(dx, dy);
    if (joyKnob.current) joyKnob.current.style.transform = `translate(${dx * 34}px, ${dy * 34}px)`;
  }, []);

  const joyStart = useCallback((e: React.PointerEvent) => {
    joyId.current = e.pointerId;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    joyMove(e);
  }, [joyMove]);

  const joyEnd = useCallback(() => {
    joyId.current = -1;
    gameRef.current?.setJoy(0, 0);
    if (joyKnob.current) joyKnob.current.style.transform = 'translate(0px, 0px)';
  }, []);

  const buySel = useCallback((id: string) => {
    gameRef.current?.buyWeapon(id);
  }, []);

  const toggleSound = useCallback(() => {
    const g = gameRef.current;
    if (!g) return;
    const v = !g.getSound();
    g.setSound(v);
    setSound(v);
  }, []);

  const changeSens = useCallback((v: number) => {
    gameRef.current?.setSens(v);
    setSens(v);
  }, []);

  const pickChar = useCallback((id: string) => {
    const g = gameRef.current;
    if (g) setChar(g.setChar(id));
  }, []);

  const toggleQuality = useCallback(() => {
    const g = gameRef.current;
    if (g) setQuality(g.cycleQuality());
  }, []);

  /** Название уровня графики для кнопок. */
  const qualityName = (q: Quality): string =>
    q === 'low' ? '🥔 КАРТОШКА' : q === 'high' ? '💎 КРАСИВО' : '⚖️ СРЕДНЕ';

  const changeVolume = useCallback((v: number) => {
    const g = gameRef.current;
    setVolume(g ? g.setVolume(v) : Math.max(0, Math.min(1, v)));
  }, []);

  /** Дальность прорисовки: меньше — выше FPS (край камеры + туман + небо). */
  const changeDrawDist = useCallback((v: number) => {
    const vv = Math.max(80, Math.min(500, Math.round(v)));
    // в меню игры может не быть — тогда просто запоминаем (подхватит следующий бой)
    try { localStorage.setItem('mtt_drawdist_v1', String(vv)); } catch { /* noop */ }
    const g = gameRef.current;
    setDrawDist(g ? g.setDrawDist(vv) : vv);
  }, []);

  const hpFrac = Math.max(0, hud.hp / hud.maxhp);
  const wname = WEAPONS.find((w) => w.id === hud.weapon)?.name ?? '👊 Кулаки';

  return (
    <>
      {jumpscare && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2147483647, background: '#000' }}>
          <img src={jumpscareUrl} alt="" style={{ width: '100vw', height: '100vh', objectFit: 'cover', display: 'block' }} />
        </div>
      )}
      {/* рулетка кейса — на корне, поверх всего: внутри меню её резал блюр вкладки */}
      {overlayOpen && reel.length > 0 && (
        <div id="caseOverlay" onClick={() => { if (winOn) closeOverlay(); }}>
          <div id="caseFull" onClick={(e) => e.stopPropagation()}>
            <h3>🎰 КЕЙС БОЙЦА</h3>
            <div id="caseRoulette">
              <div id="casePointer">▼</div>
              <div id="caseWin">
                <div
                  id="caseTrack"
                  ref={trackRef}
                  style={{ transform: 'translateX(0px)' }}
                >
                  {reel.map((it, i) => (
                    <div
                      key={i}
                      className={'rcard ' + it.kind + (winOn && i === REEL_WIN ? ' win' : '')}
                      id={winOn && i === REEL_WIN ? 'caseWinCard' : undefined}
                    >
                      {it.kind === 'char'
                        ? <img src={CHARIMG[it.char ?? 'krysa'] ?? CHARIMG.krysa} alt={it.label} />
                        : <div className="remo">{it.label.split(' ')[0]}</div>}
                      <div className="rlabel">{it.label}</div>
                      <div className="rsub">{it.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {spin && <div id="caseResult" className="drop spin">🎰 Барабан крутится… лоты летят справа налево!</div>}
            {!spin && caseDrop && <div id="caseResult" className={'drop ' + caseDrop.kind}>{caseDrop.ok ? `🎉 ${caseDrop.text}` : `⛔ ${caseDrop.text}`}</div>}
            {winOn
              ? <button id="caseClose" onClick={closeOverlay}>ЗАБРАТЬ ✔</button>
              : <div className="cfullHint">Смотри, куда едет… 👁️</div>}
          </div>
        </div>
      )}
      <canvas id="c" ref={canvasRef} />
      {!menu && <div id="vig" />}
      {!menu && (
        <div id="hud">
          <div id="hpWrap">
            <span>❤️ {hud.hp}/{hud.maxhp}</span>
            <div id="hpBar"><div id="hpFill" style={{ width: `${hpFrac * 100}%` }} /></div>
          </div>
          <div id="hudRow">{noEnemies ? '🕊️ МИРНЫЙ РЕЖИМ · ' : `🌊 Волна ${hud.wave} · 👹 ${hud.enemies} · `}💀 {hud.kills} · 🏆 {hud.score}</div>
          <div id="hudRow2">🎟️ {hud.fantiki} · 💊 {hud.med}/3 · ⭐ {hud.lvl} · {wname}{char === 'mtt' && (hud.dash > 0 ? ` · ⚡ ${hud.dash.toFixed(1)}с` : ' · ⚡ рывок готов')}{char === 'krysa' && (hud.kick > 0 ? ` · 🌀 ${hud.kick.toFixed(1)}с` : ' · 🌀 вол-кик готов')}{char === 'shuba' && (hud.invis > 0 ? ` · 👻 ещё ${hud.invis.toFixed(1)}с` : hud.invisCd > 0 ? ` · 👻 ${hud.invisCd.toFixed(1)}с` : ' · 👻 несутка готова')}{char === 'chuma' && (hud.chuma > 0 ? ` · 🦠 ещё ${hud.chuma.toFixed(1)}с` : hud.chumaCd > 0 ? ` · 🦠 ${hud.chumaCd.toFixed(1)}с` : ' · 🦠 облако готово')}{char === 'gidroxis' && (hud.xray > 0 ? ` · 🔍 ещё ${hud.xray.toFixed(1)}с` : hud.xrayCd > 0 ? ` · 🔍 ${hud.xrayCd.toFixed(1)}с` : ' · 🔍 рентген готов')}</div>
        </div>
      )}
      {!menu && (
        <>
          <button id="shopBtn" onClick={() => setShopOpen(true)}>🛒 Магазин</button>
          <button id="setBtn" onClick={() => setSetOpen(true)}>⚙️</button>
          <button id="fsBtn" onClick={() => {
            if (document.fullscreenElement) void document.exitFullscreen();
            else void document.documentElement.requestFullscreen().catch(() => {});
          }}>⛶</button>
          <button id="menuBtn" onClick={exitToMenu}>🏠 В МЕНЮ</button>
          <button id="chatBtn" onClick={() => setChatOpen((o) => !o)}>💬{chatLog.length > 0 && !chatOpen ? ` ${Math.min(chatLog.length, 9)}` : ''}</button>
          {!chatOpen && chatLog.length > 0 && (
            <div id="chatToast">{chatLog[chatLog.length - 1].nick}: {chatLog[chatLog.length - 1].text}</div>
          )}
          {chatOpen && (
            <div id="chatOv">
              <div id="chatLog">
                {chatLog.length === 0 ? <div className="chatSys">Тихо… напиши первым! (Enter — отправить)</div> : chatLog.map((m, i) => (
                  <div key={i} className="chatMsg"><b>{m.nick}:</b> {m.text}</div>
                ))}
              </div>
              <div id="chatRow">
                <input
                  id="chatIn"
                  value={chatText}
                  maxLength={200}
                  onChange={(e) => setChatText(e.target.value)}
                  placeholder="Сообщение…"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') void sendChat();
                    else if (e.key === 'Escape') setChatOpen(false);
                  }}
                />
                <button id="chatSend" onClick={() => void sendChat()}>➤</button>
              </div>
            </div>
          )}
          <div id="cross"><i></i><i></i></div>
          <div
            id="joy"
            ref={joyRef}
            style={typeof navigator !== 'undefined' && navigator.maxTouchPoints === 0 && !('ontouchstart' in window) ? { display: 'none' } : undefined}
            onPointerDown={joyStart}
            onPointerMove={joyMove}
            onPointerUp={joyEnd}
            onPointerCancel={joyEnd}
          >
            <div id="joyKnob" ref={joyKnob} />
          </div>
          <button
            id="hitBtn"
            style={typeof navigator !== 'undefined' && navigator.maxTouchPoints === 0 && !('ontouchstart' in window) ? { display: 'none' } : undefined}
            onPointerDown={() => { gameRef.current?.attack(); }}
          >
            👊<span>УДАР</span>
          </button>
          {!hud.dead && (
          <div
            id="weapon"
            ref={weaponRef}
            onAnimationEnd={endSwing}
            className={(hud.moving ? 'walk' : '') + (swinging ? ' play' : '') + ((hud.weapon === 'pistol' || hud.weapon === 'shotgun') ? ' ranged' : '') + (hud.weapon === 'pistol' || hud.weapon === 'shotgun' ? ' ' + hud.weapon : '') + ((hud.weapon === 'fists' || hud.weapon === 'bat' || hud.weapon === 'shotgun') ? ' screen' : '')}
          >
            <img src={WIMG[hud.weapon] ?? oruzh1Url} alt="оружие" />
          </div>
          )}
          {roomId && (
            <div id="roomBadge">
              🌐 {roomId} · {mates.length + 1}
              <button id="roomLeave" onClick={leaveRoom}>✕</button>
              {mates.length > 0 && (
                <div id="roomMates">{mates.map((m) => `${WEAPONS.find((w) => w.id === m.weapon)?.name ?? '👊'} ${m.nick}${m.login ? `(@${m.login})` : ''} ${m.score}🏆`).join(' · ')}</div>
              )}
            </div>
          )}
          <div id="fps">{hud.fps} FPS</div>
          {showMates && roomId && (
            <div id="matesList">
              <div id="matesTitle">👥 НА СЕРВЕРЕ — {mates.length + 1} (Tab — закрыть)</div>
              <div className="mrow sme">🫵 {nick} · {hud.hp}❤️{roomMode === 'pvp' ? ` · ${myFrags}💀` : ''}</div>
              {mates.map((m, i) => (
                <div className="mrow" key={i}>🎭 {m.nick} · {m.hp}❤️{typeof m.frags === 'number' ? ` · ${m.frags}💀` : ''}{m.dead ? ' · 💀' : ''}</div>
              ))}
            </div>
          )}
          {(mapChoice === 'backrooms' || mapChoice === 'endless') && specActive && (
            <div id="specBar">
              <div id="specTitle">👁 НАБЛЮДАТЕЛЬ — тебя не видят{restartIn > 0 ? ` · ♻️ ${fmtRestart(restartIn)}` : ''}</div>
              <div id="specHint">WASD — летать сквозь стены · Space — вверх · C — вниз · Shift — быстрее · выше потолка — весь лабиринт · ткни бойца — вернуться к нему</div>
              <div id="specTargets">
                {specTargets.length > 0 ? specTargets.map((t) => (
                  <button key={t.sid} id={`spec-${t.sid}`} className={'wbtn' + (specSelNick.current === t.nick ? ' cur' : '')} onClick={() => void specWatch(t.sid, t.nick)}>👁 {t.nick} {t.dead ? '💀' : `${t.hp}❤️`}</button>
                )) : <span>Ждём бойцов…</span>}
              </div>
              <button id="specLobbyBtn2" className="wbtn" onClick={() => { toMenu(); void leaveRoom(); }}>🚪 ВЫЙТИ В ЛОББИ</button>
            </div>
          )}
          {duel && duel.active && (
            <div id="duelBar">
              <div>⚔️ РАУНД {duel.round} · ТЫ {duel.myWins} : {duel.foeWins} {duel.foe?.nick}</div>
              <div id="duelHp"><div id="duelHpFill" style={{ width: `${Math.max(0, duel.myHp)}%` }} /></div>
              <div id="duelFoe">👹 {duel.foe?.nick}: {duel.foe?.hp} ❤️</div>
              {duel.myHp <= 0 && <div id="duelDown">💀 РАУНД ПРОИГРАН — ждём следующий...</div>}
              {duel.lastWinner && <div id="duelLast">🏆 Раунд взял: {duel.lastWinner}</div>}
            </div>
          )}
          {roomMode === 'pvp' && (
            <div id="scoreboard">
              <div id="scoreTitle">⚔️ ФРАГИ · ТЫ: {myFrags} 💀{restartIn > 0 ? ` · ♻️ ${fmtRestart(restartIn)}` : ''}</div>
              {scoreboard.length > 0 ? scoreboard.map((s, i) => (
                <div key={i} className={s.nick === nick ? 'sme' : ''}>{i + 1}. {s.nick} — {s.frags} 💀</div>
              )) : <div>Пока тихо — разведи движ!</div>}
            </div>
          )}
          {(roomMode === 'endless' || roomMode === 'invasion') && restartIn > 0 && (
            <div id="restartBadge">♻️ Рестарт через {fmtRestart(restartIn)}</div>
          )}
          {waveBanner > 0 && (
            <div id="waveBanner" key={`wave-${waveBanner}`}>🌊 ВОЛНА {waveBanner}</div>
          )}
          {bossBanner && (
            <div id="bossBanner" key="boss">👑 БОСС-ГОПНИК 🍺</div>
          )}
          {hud.doorPulse && (
            <div id="doorPulse" key="door">🚪 ДВЕРЬ МИГАЕТ ЗЕЛЁНЫМ — беги на свет!</div>
          )}
        </>
      )}
      {hud.dead && !menu && roomMode !== 'pvp' && !specActive && (
        roomMode === 'endless' ? (
        <div id="busted" style={{ display: 'flex' }}>
          <div id="deadPanel">
            <div>☠️ СТАЛКЕРЫ ДОСТАЛИ!</div>
            <div id="deadScore">{hud.score} 🏆 · {hud.kills} 💀</div>
            <button id="specWatchBtn" onClick={() => void specWatch('', '')}>👁 СТАТЬ НАБЛЮДАТЕЛЕМ</button>
            <button id="specLobbyBtn" onClick={() => { toMenu(); void leaveRoom(); }}>🚪 ВЫЙТИ В ЛОББИ</button>
          </div>
        </div>
        ) : (
        <div id="busted" style={{ display: 'flex' }}>
          <div id="deadPanel">
            <div>ЗАВАЛЕН! 👊</div>
            <div id="deadScore">{hud.score} 🏆 · {hud.kills} 💀</div>
            <button id="reviveBtn" onClick={() => gameRef.current?.revive()}>💚 ВОЗРОДИТЬСЯ (−100 🏆)</button>
            {(mapChoice === 'backrooms' || mapChoice === 'endless') && (
              <button id="specWatchBtn" onClick={() => void specWatch('', '')}>👁 СТАТЬ НАБЛЮДАТЕЛЕМ</button>
            )}
            <button id="retryBtn" onClick={() => window.location.reload()}>🔄 ЗАНОВО</button>
          </div>
        </div>
        )
      )}
      {escaped && !menu && !specActive && (
        <div id="escaped" style={{ display: 'flex' }}>
          <div id="escapePanel">
            <div>🚪 ТЫ ВЫБРАЛСЯ!</div>
            <div id="escapeScore">+{escaped.gain} 🎟️ фантиков! Баланс: {escaped.bal}</div>
            <button id="escapeSpecBtn" onClick={() => { setEscaped(null); void specWatch('', ''); }}>👁 СТАТЬ НАБЛЮДАТЕЛЕМ</button>
            <button id="escapeMenuBtn" onClick={() => { setEscaped(null); toMenu(); void leaveRoom(); }}>🚪 ВЫЙТИ В МЕНЮ</button>
          </div>
        </div>
      )}
      {pvpDead && !menu && roomMode === 'pvp' && (
        <div id="busted" style={{ display: 'flex' }}>
          <div id="deadPanel">
            <div>☠️ ТЕБЯ ЗАВАЛИЛИ!</div>
            <div id="deadScore">Фраги: {myFrags} 💀</div>
            <button id="pvpRespawn" onClick={() => { const g = gameRef.current; if (g) { const sp = g.randomSpawn(); g.pvpRespawn(sp.x, sp.z); } pvpDeadRef.current = false; setPvpDead(false); }}>🎲 ВОЗРОДИТЬСЯ В СЛУЧАЙНОЙ ТОЧКЕ</button>
            <button id="pvpMenu" onClick={() => { pvpDeadRef.current = false; setPvpDead(false); toMenu(); void leaveRoom(); }}>🚪 ВЫЙТИ В МЕНЮ</button>
          </div>
        </div>
      )}
      {shopOpen && !menu && (
        <div className="modal" onClick={() => setShopOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <h3>🛒 Оружейка <span id="shopMoney">🎟️ {hud.fantiki}</span></h3>
            {WEAPONS.map((w) => {
              const has = hud.owned.includes(w.id);
              const cur = hud.weapon === w.id;
              const locked = hud.wave < w.minWave;
              return (
                <div className="wcard" key={w.id}>
                  <div className="wname">{w.name}</div>
                  <div className="wdesc">{w.desc} · 💥 {w.dmg} · 📏 {w.range}м · ⏱️ {w.cd}с</div>
                  {cur ? <button className="wbtn cur" disabled>✔ В РУКАХ</button>
                    : locked ? <button className="wbtn" disabled>🔒 С ВОЛНЫ {w.minWave}</button>
                    : has ? <button className="wbtn" id={`sel-${w.id}`} onClick={() => buySel(w.id)}>ВЗЯТЬ</button>
                    : <button className="wbtn buy" id={`buy-${w.id}`} onClick={() => buySel(w.id)} disabled={hud.fantiki < w.price}>
                      КУПИТЬ за 🎟️ {w.price}
                    </button>}
                </div>
              );
            })}
            <h3>💊 Аптечки (макс 3, X — использовать, +50 HP)</h3>
            <div className="wcard">
              <div className="wname">💊 Аптечка · в запасе {hud.med}/3</div>
              <div className="wdesc">Мгновенно +50 HP прямо в бою · 🎟️ 150</div>
              <button className="wbtn buy" id="buy-med" onClick={() => gameRef.current?.buyMedkit()} disabled={hud.med >= 3 || hud.fantiki < 150}>
                КУПИТЬ за 🎟️ 150
              </button>
            </div>
            <button className="wclose" onClick={() => setShopOpen(false)}>ЗАКРЫТЬ</button>
          </div>
        </div>
      )}
      {setOpen && !menu && (
        <div className="modal" onClick={() => setSetOpen(false)}>
          <div className="sheet" onClick={(e) => e.stopPropagation()}>
            <h3>⚙️ Настройки</h3>
            <div className="srow">
              <span>🔊 Звук</span>
              <button id="soundBtn" className="wbtn" onClick={toggleSound}>{sound ? 'ВЫКЛ' : 'ВКЛ'}</button>
            </div>
            <div className="srow">
              <span>🎚️ Громкость: {Math.round(volume * 100)}%</span>
            </div>
            <input
              id="volRange"
              type="range" min={0} max={1} step={0.05} value={volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
            />
            <div className="srow">
              <span>👀 Чувствительность: {sens.toFixed(1)}</span>
            </div>
            <input
              id="sensRange"
              type="range" min={0.3} max={2.5} step={0.1} value={sens}
              onChange={(e) => changeSens(Number(e.target.value))}
            />
            <div className="srow">
              <span>🎨 Графика</span>
              <button id="qualityBtn" className="wbtn" onClick={toggleQuality}>
                {qualityName(quality)}
              </button>
            </div>
            <div className="srow">
              <span>🔭 Дальность: {drawDist}м</span>
            </div>
            <input
              id="drawRange"
              type="range" min={80} max={500} step={20} value={drawDist}
              onChange={(e) => changeDrawDist(Number(e.target.value))}
            />
            <div className="wdesc">Меньше — выше FPS (даль не рисуется). Если лагает — крути влево.</div>
            <div className="wdesc">Картошка — максимум fps (пиксели крупнее, без теней). Средне — баланс. Красиво — тени и чёткость, слабым телефонам тяжело.</div>
            <div className="srow"><span>🎮 Управление (ткни и жми клавишу)</span></div>
            <div id="keysSec">
              {KEY_ACTIONS.map((a) => (
                <div className="srow" key={a.id}>
                  <span>{a.label}</span>
                  <button
                    id={`key-${a.id}`}
                    className={'wbtn' + (capturing === a.id ? ' cur' : '')}
                    onClick={() => setCapturing(a.id)}
                  >
                    {capturing === a.id ? 'НАЖМИ…' : prettyKey(keys[a.id])}
                  </button>
                </div>
              ))}
            </div>
            <button
              className="wclose"
              onClick={() => {
                const g = gameRef.current;
                if (g) setKeys({ ...g.resetKeys() });
              }}
            >
              ↩ СБРОС КЛАВИШ
            </button>
            <button className="wclose" onClick={() => setSetOpen(false)}>ЗАКРЫТЬ</button>
          </div>
        </div>
      )}
      {loading.show && (
        <div id="loading">
          <div id="loadTitle">ЗАГРУЗКА БОЯ… {loading.pct}%</div>
          <div id="loadbar"><div id="loadfill" style={{ width: loading.pct + '%' }} /></div>
          <div id="loadHint">Текстуры греются · щит держит до первого шага</div>
        </div>
      )}
      {menu && (
        <div
          id="menu"
          className="twd"
          style={{
            backgroundImage: `linear-gradient(rgba(4,6,15,.62), rgba(4,6,15,.62)), url(${menuBgUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div id="menuBalance" title="Твои фантики">🎟️ {hud.fantiki}</div>
          <div id="menuNav">
            <h1>👊 42 LIVE 💥</h1>
            {([['play', '▶ ИГРАТЬ'], ['fighter', '🎭 БОЕЦ'], ['cases', '🎰 КЕЙСЫ'], ['promo', '🎟️ ПРОМОКОДЫ'], ['maps', '🗺️ КАРТЫ'], ['editor', '🧩 РЕДАКТОР'], ['rooms', '🌐 КОМНАТЫ'], ['servers', '🖥️ СЕРВЕРА'], ['settings', '⚙️ НАСТРОЙКИ'], ['tops', '🏆 ТОПЫ']] as Array<[TabId, string]>).map(([id, label]) => (
              <button key={id} id={`nav-${id}`} className={'tnav' + (menuTab === id ? ' active' : '')} onClick={() => setMenuTab(id)}>{label}</button>
            ))}
            <a id="hubLink" href="https://hub.bratuxa.zomb.top">← Хаб 1Б42П</a>
          </div>
          <div id="menuBody">
          <div className={'mtab' + (menuTab === 'fighter' ? ' show' : '')}>
            <div className="board" id="charSec">
              <h3>🎭 Выбор бойца</h3>
              <div className="charRow">
                {CHARS.map((c) => {
                  const g = gameRef.current;
                  void upgTick;
                  const lvl = g?.levelOf(c.id) ?? 1;
                  const xp = g?.xpOf(c.id) ?? 0;
                  const need = g?.xpNeedOf(c.id) ?? 1000;
                  const prev = (lvl - 1) * (lvl - 1) * 1000;
                  const frac = Math.max(0, Math.min(1, (xp - prev) / Math.max(1, need - prev)));
                  const u = g?.upgOf(c.id) ?? { hp: 0, dmg: 0, spd: 0, sup: 0 };
                  const ab = CHAR_ABILITIES[c.id];
                  const opened = upgOpen === c.id;
                  const owned = g ? g.hasChar(c.id) : c.id === 'mtt';
                  const locked = !owned;
                  return (
                    <div key={c.id} className={'charCard' + (char === c.id ? ' sel' : '') + (locked ? ' locked' : '')} id={`char-${c.id}`}>
                      <button
                        className="charPick"
                        id={`pick-${c.id}`}
                        onClick={() => { if (!locked) pickChar(c.id); }}
                        disabled={locked}
                      >
                        <img src={CHARIMG[c.id]} alt={c.name} />
                        <div className="cname">{c.name}</div>
                        <div className="cdesc">{c.desc}</div>
                      </button>
                      <div className="cstats">❤️ {c.hp} · 💨 {c.spd}× · ⭐ Ур. {lvl}</div>
                      <div className={'rarity ' + (c.rarity === 'Легендарный' ? 'leg' : c.rarity === 'Редкий' ? 'rare' : 'base')} id={`rarity-${c.id}`}>
                        {c.rarity === 'Легендарный' ? '🌟 Редкость: Легендарный' : c.rarity === 'Редкий' ? '💎 Редкость: Редкий' : '⚪ Редкость: Базовый'}
                      </div>
                      {locked && <div className="clocked" id={`locked-${c.id}`}>🔒 ЗАКРЫТ — выбей из 🎰 кейса</div>}
                      <div className="cxp" id={`xp-${c.id}`}>
                        <div className="cxpBar"><div className="cxpFill" style={{ width: `${Math.round(frac * 100)}%` }} /></div>
                        <small>✨ Опыт {xp}/{need} · Ур. {lvl} (+10 HP и +5% урона за уровень)</small>
                      </div>
                      <ul className="cabilityList" id={`abilities-${c.id}`}>
                        {ab?.lines.map((l) => <li key={l}>{l}</li>)}
                        <li className="csup">{ab?.sup}</li>
                      </ul>
                      <div className="cupgLine"><small>🔧 Прокачка: ❤️×{u.hp} 💪×{u.dmg} 💨×{u.spd} {c.id === 'mtt' ? '⚡' : c.id === 'shuba' ? '👻' : c.id === 'chuma' ? '🦠' : c.id === 'gidroxis' ? '🔍' : '🌀'}×{u.sup} · кд супера {g?.superCdOf(c.id) ?? (c.id === 'krysa' ? 5 : c.id === 'shuba' || c.id === 'chuma' ? 30 : c.id === 'gidroxis' ? 20 : 3)}с</small></div>
                      <button
                        className="wbtn"
                        id={`upg-${c.id}`}
                        onClick={() => setUpgOpen(opened ? null : c.id)}
                      >
                        {opened ? 'СВЕРНУТЬ ▲' : 'ПРОКАЧАТЬ ▼'}
                      </button>
                      {opened && (
                        <div className="upgPanel" id={`upgpanel-${c.id}`}>
                          {([
                            ['hp', '❤️ Здоровье', `+15 maxHP за уровень (макс +${UPG_MAX.hp * 15})`],
                            ['dmg', '💪 Сила', '+8% к урону за уровень'],
                            ['spd', '💨 Скорость', '+6% к скорости за уровень'],
                            ['sup', c.id === 'mtt' ? '⚡ Супер: рывок' : c.id === 'shuba' ? '👻 Супер: несутка' : c.id === 'chuma' ? '🦠 Супер: облако' : c.id === 'gidroxis' ? '🔍 Супер: рентген' : '🌀 Супер: вол-кик', `кд → мин ${c.id === 'shuba' || c.id === 'chuma' ? '20' : c.id === 'gidroxis' ? '15' : '1.7'}с (сейчас ${g?.superCdOf(c.id)}с)${c.id === 'shuba' || c.id === 'chuma' || c.id === 'gidroxis' ? '' : ` · дальность ×${superRange(u.sup)} (+15%/ур)`}`],
                          ] as Array<[keyof UpgState, string, string]>).map(([key, label, hint]) => {
                            const lvlU = u[key];
                            const max = UPG_MAX[key];
                            const cost = upgCost(key, lvlU);
                            const done = lvlU >= max;
                            return (
                              <div className="upgRow" key={key}>
                                <div className="upgInfo">
                                  <b>{label}</b>
                                  <span className="upgPips">{'●'.repeat(lvlU)}{'○'.repeat(max - lvlU)}</span>
                                  <small>{hint}</small>
                                </div>
                                <button
                                  className="wbtn buy"
                                  id={`upg-${c.id}-${key}`}
                                  disabled={done || hud.fantiki < cost}
                                  onClick={() => buyUpg(c.id, key)}
                                >
                                  {done ? 'МАКС' : `🎟️ ${cost}`}
                                </button>
                              </div>
                            );
                          })}
                          <small>💰 Баланс: 🎟️ {hud.fantiki} · качается за фантики, сейв хранится</small>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="srow">
                <button className="wclose" id="charBack" onClick={() => setMenuTab('play')}>← НАЗАД</button>
                <button className="wbtn" id="charGo" onClick={() => setMenuTab('play')}>ИГРАТЬ ЭТИМ ✔</button>
              </div>
            </div>
          </div>
          <div className={'mtab' + (menuTab === 'cases' ? ' show' : '')}>
          <div className="board" id="caseSec">
            <h3>🎰 Кейсы</h3>
            <div className="caseCard" id="case-fighter">
              <div className="mname">📦 КЕЙС БОЙЦА</div>
              <div className="mdesc">Внутри — боец! Редкие по 30%: 🥷 Ивангой и 🐦‍⬛ Чума. Легендарные по 20%: 🌟 Стейси Крыса и 🧪 Гидроксис. Не повезло — утешительный приз: фантики, опыт или аптечка.</div>
              <ul className="cabilityList">
                <li>⚪ МТТ — у тебя уже есть (Базовый)</li>
                <li>💎 Ивангой — только из кейса (Редкий)</li>
                <li>💎 Чума — только из кейса (Редкий)</li>
                <li>🌟 Стейси Крыса — только из кейса (Легендарный)</li>
                <li>🌟 Гидроксис — только из кейса (Легендарный)</li>
              </ul>
              <div className="srow">
                <button
                  className="wbtn buy"
                  id="caseOpen"
                  disabled={hud.fantiki < CASE_PRICE || spin}
                  onClick={openCase}
                >
                  {spin ? '🎰 КРУТИТСЯ…' : `ОТКРЫТЬ ЗА 🎟️ ${CASE_PRICE} (баланс ${hud.fantiki})`}
                </button>
              </div>
              {(() => { void caseTick; return null; })()}
              {!overlayOpen && caseDrop && <div id="caseResult" className={'drop ' + caseDrop.kind}>{caseDrop.ok ? `🎉 ${caseDrop.text}` : `⛔ ${caseDrop.text}`}</div>}
            </div>
          </div>
          </div>
          <div className={'mtab' + (menuTab === 'promo' ? ' show' : '')}>
          <div className="board" id="promoSec">
            <h3>🎟️ Промокоды</h3>
            <div className="mdesc">Впиши код — фантики упадут прямо в игру. Нужен аккаунт (войди во вкладке ИГРАТЬ), каждый код — один раз.</div>
            <div className="srow">
              <input
                id="promoIn"
                value={promoCode}
                maxLength={24}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => { if (e.key === 'Enter') void redeemPromo(); }}
                placeholder="Впиши код…"
                autoComplete="off"
              />
              <button className="wbtn buy" id="promoGo" disabled={promoBusy} onClick={redeemPromo}>
                {promoBusy ? '⏳…' : 'ЗАБРАТЬ ✔'}
              </button>
            </div>
            {promoMsg && <div id="promoResult" className={'drop ' + (promoMsg.ok ? 'fantiki' : 'empty')}>{promoMsg.ok ? `🎉 ${promoMsg.text}` : `⛔ ${promoMsg.text}`}</div>}
          </div>
          </div>
          <div className={'mtab' + (menuTab === 'play' ? ' show' : '')}>
          <p>Арена 42 LIVE от первого лица: машешься с волнами врагов, у каждого полоска HP.
            Джойстик слева — движение, кнопка справа — удар. Фантики с врагов трать в 🛒 оружейке,
            завал — жми 💚 возродиться!</p>
          {!authed && (
            <div className="board" id="authBox">
              <h3><span className="stepN">1</span>🔐 Вход</h3>
              <input
                id="authLogin"
                value={authLogin}
                maxLength={16}
                onChange={(e) => setAuthLogin(e.target.value)}
                placeholder="Логин"
                autoComplete="username"
              />
              <input
                id="authPass"
                type={showPass ? 'text' : 'password'}
                value={authPass}
                maxLength={64}
                onChange={(e) => setAuthPass(e.target.value)}
                placeholder="Пароль"
                autoComplete="current-password"
              />
              <button className="wbtn" id="showPassBtn" onClick={() => setShowPass((v) => !v)} title="Показать/скрыть пароль">
                {showPass ? '🙈 СКРЫТЬ' : '👁️ ПОКАЗАТЬ'}
              </button>
              {authMsg && <div id="authMsg">{authMsg}</div>}
              <div className="srow">
                <button className="wbtn" id="loginBtn" onClick={() => doAuth('login')}>ВОЙТИ</button>
                <button className="wbtn" id="regBtn" onClick={() => doAuth('register')}>СОЗДАТЬ</button>
              </div>
              <button className="wclose" id="guestBtn" onClick={guestIn}>ИГРАТЬ ГОСТЕМ</button>
            </div>
          )}
          {authed !== '' && (
              <div id="authWho">
                {authed === 'guest' ? '👤 Гость' : `🔐 ${authed}`}
                {authed !== 'guest' && (
                  <>
                    {' · '}
                    <button id="profileBtn" onClick={openProfile}>👤 ПРОФИЛЬ</button>
                    {' · '}
                    <button id="adminBtn" onClick={async () => { if (await loadAdmin()) setAdminOpen(true); }}>📊 ОНЛАЙН</button>
                  </>
                )}
                {' · '}
                <button id="authOut" onClick={authOut}>{authed === 'guest' ? 'войти' : 'выйти'}</button>
              </div>
          )}
          </div>
          <div className={'mtab' + (menuTab === 'maps' ? ' show' : '')}>
          <div className="board" id="mapSec">
            <h3>🗺️ Карта</h3>
            <div className="mapRow">
              {MAPS.map((m) => (
                <button
                  key={m.id}
                  id={`map-${m.id}`}
                  className={'mapCard' + (mapChoice === m.id ? ' sel' : '')}
                  onClick={() => setMapChoice(m.id)}
                >
                  <div className="mname">{m.name}</div>
                  <div className="mdesc">{m.desc}</div>
                </button>
              ))}
            </div>
          </div>
          </div>
          <div className={'mtab' + (menuTab === 'play' ? ' show' : '')}>
          <div className="board" id="foeSec">
            <h3><span className="stepN">2</span>👹 Враги</h3>
            <div className="srow">
              <button id="foeBtn" className={'wbtn' + (!noEnemies ? ' cur' : '')} onClick={() => setNoEnemies((v) => !v)}>
                {noEnemies ? '🕊️ ВРАГИ: ВЫКЛ — просто гуляю' : '👹 ВРАГИ: ВКЛ — будет махач'}
              </button>
            </div>
          </div>
          </div>
          <div className={'mtab' + (menuTab === 'editor' ? ' show' : '')}>
          <div className="board" id="editorSec">
            <h3>🧩 Редактор карт</h3>
            <div className="srow">
              <input
                id="edName"
                value={edName}
                maxLength={24}
                onChange={(e) => setEdName(e.target.value)}
                placeholder="Название карты"
              />
              {[60, 90, 120].map((s) => (
                <button key={s} className={'wbtn' + (edSize === s ? ' cur' : '')} id={`edsize-${s}`} onClick={() => changeEdSize(s)}>{s}м</button>
              ))}
            </div>
            <div className="srow">
              <button className={'wbtn' + (edTool === 'wall' ? ' cur' : '')} id="edtool-wall" onClick={() => setEdTool('wall')}>🧱 Стена</button>
              <button className={'wbtn' + (edTool === 'erase' ? ' cur' : '')} id="edtool-erase" onClick={() => setEdTool('erase')}>🧽 Стереть</button>
              <button className="wclose" id="edclear" onClick={() => setEdGrid(Array.from({ length: edCols }, () => new Array(edCols).fill(0)))}>Очистить</button>
            </div>
            <div className="srow">
              <span>📏 Высота строений: {edH}м</span>
            </div>
            <input
              id="edHRange"
              type="range" min={2} max={8} step={1} value={edH}
              onChange={(e) => setEdH(Number(e.target.value))}
            />
            <canvas
              id="edGrid"
              ref={(el) => {
                edCanvas.current = el;
                if (el) drawEd(edGrid);
                // eslint-disable-next-line react-hooks/exhaustive-deps
              }}
              style={{ width: '100%', maxWidth: 420, touchAction: 'none', cursor: 'crosshair' }}
              onPointerDown={(e) => {
                (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
                const [cx, cy] = edCellPos(e);
                paintEd(cx, cy);
              }}
              onPointerMove={(e) => {
                if (e.buttons !== 1) return;
                const [cx, cy] = edCellPos(e);
                paintEd(cx, cy);
              }}
            />
            <div><small>👁️ 3D-превью карты:</small></div>
            <EditorPreview grid={edGrid} size={edSize} />
            <div className="srow">
              <button className="wbtn" id="edsave" onClick={saveCustom}>💾 СОХРАНИТЬ И ИГРАТЬ</button>
            </div>
            {Object.keys(customs).length > 0 && (
              <div id="customList">
                {Object.values(customs).map((m) => (
                  <div className="srow" key={m.name}>
                    <span>🧩 {m.name} · {m.size}м · 🧱 {m.walls.length}{customSel === m.name ? ' · ✔ выбрана' : ''}</span>
                    <button className="wbtn" id={`custom-play-${m.name}`} onClick={() => playCustom(m.name)}>ИГРАТЬ</button>
                    <button className="wbtn" id={`custom-edit-${m.name}`} onClick={() => editCustom(m.name)}>РЕД.</button>
                    <button className="wclose" id={`custom-del-${m.name}`} onClick={() => delCustom(m.name)}>✕</button>
                  </div>
                ))}
              </div>
            )}
            <div><small>Свои карты — для соло (без комнаты). Тыкни по сетке — стена, зелёная точка — спавн.</small></div>
          </div>
          </div>
          <div className={'mtab' + (menuTab === 'play' ? ' show' : '')}>
          <div className="board" id="goSec">
            <h3><span className="stepN">3</span>🚀 В бой</h3>
          <input
            id="nick"
            value={nick}
            maxLength={20}
            onChange={(e) => setNick(e.target.value)}
            placeholder="Твой ник"
          />
          <button id="charBtn" className="wbtn" onClick={() => setMenuTab('fighter')}>
            🎭 БОЕЦ: {char === 'krysa' ? '🐀 Стейси' : char === 'shuba' ? '🥷 Ивангой' : char === 'chuma' ? '🐦‍⬛ Чума' : char === 'gidroxis' ? '🧪 Гидроксис' : '🕶️ МТТ'} — ВЫБРАТЬ
          </button>
          {(roomId && !isOwner) || waiting ? (
            <button id="goBtn" disabled title="Ждём старта от создателя">⏳ ЖДУ СТАРТА…</button>
          ) : !authed ? (
            <button id="goBtn" disabled title="Сначала войди или жми «ИГРАТЬ ГОСТЕМ»">🔐 СНАЧАЛА ВОЙДИ</button>
          ) : (
            <button id="goBtn" onClick={go}>{(() => { const gm = roomId ? roomMode : mapChoice; return gm === 'duel' ? '⚔️ В ДУЭЛЬ' : gm === 'backrooms' ? '🟨 В БЭКРУМС' : gm === 'pvp' ? '⚔️ В PvP-БОЙ' : gm === 'endless' ? '♾️ В БЕСКОНЕЧНЫЙ' : gm === 'invasion' ? '🌊 В НАШЕСТВИЕ' : gm === 'custom' ? '🧩 НА СВОЮ' : gm === 'random' ? '🎲 НА СЛУЧАЙНУЮ' : '▶️ ПОГНАЛИ'; })()}</button>
          )}
          </div>
          </div>
          {profileOpen && (
            <div className="modal" id="profileOv">
              <div className="sheet">
                <h3>👤 Профиль</h3>
                {authed === 'guest' ? (
                  <div>Гость: статистика не ведётся. Войди под логином — будем считать!</div>
                ) : profile ? (
                  <>
                    <div>🔐 <b>{profile.login}</b></div>
                    <div>🎮 Игр сыграно: <b>{profile.games}</b></div>
                    <div>🏆 Лучший счёт: <b>{profile.best}</b></div>
                    <div>🎟️ Фантиков всего: <b>{profile.coins}</b></div>
                    <div>🎭 Боец: {char === 'krysa' ? '🐀 Стейси' : char === 'shuba' ? '🥷 Ивангой' : char === 'chuma' ? '🐦‍⬛ Чума' : char === 'gidroxis' ? '🧪 Гидроксис' : '🕶️ МТТ'} · ⭐ Ур. {hud.lvl} · Ник: {nick}</div>
                    <h3>🔑 Сменить пароль</h3>
                    <input
                      id="passOld"
                      type={showPass ? 'text' : 'password'}
                      value={passOld}
                      maxLength={64}
                      onChange={(e) => setPassOld(e.target.value)}
                      placeholder="Старый пароль"
                      autoComplete="current-password"
                    />
                    <input
                      id="passNew"
                      type={showPass ? 'text' : 'password'}
                      value={passNew}
                      maxLength={64}
                      onChange={(e) => setPassNew(e.target.value)}
                      placeholder="Новый пароль (от 4 символов)"
                      autoComplete="new-password"
                    />
                    <button className="wbtn" id="showPassBtn2" onClick={() => setShowPass((v) => !v)} title="Показать/скрыть пароль">
                      {showPass ? '🙈 СКРЫТЬ' : '👁️ ПОКАЗАТЬ'}
                    </button>
                    {passMsg && <div id="passMsg">{passMsg}</div>}
                    <button className="wbtn" id="passBtn" onClick={changePass}>СМЕНИТЬ ПАРОЛЬ</button>
                    <h3>📝 Сменить логин</h3>
                    <input
                      id="newLogin"
                      value={newLogin}
                      maxLength={16}
                      onChange={(e) => setNewLogin(e.target.value)}
                      placeholder="Новый логин (латиница, 3–16)"
                      autoComplete="username"
                    />
                    <input
                      id="newLoginPass"
                      type={showPass ? 'text' : 'password'}
                      value={newLoginPass}
                      maxLength={64}
                      onChange={(e) => setNewLoginPass(e.target.value)}
                      placeholder="Пароль для подтверждения"
                      autoComplete="current-password"
                    />
                    <button className="wbtn" id="showPassBtn3" onClick={() => setShowPass((v) => !v)} title="Показать/скрыть пароль">
                      {showPass ? '🙈 СКРЫТЬ' : '👁️ ПОКАЗАТЬ'}
                    </button>
                    {loginMsg && <div id="loginMsg">{loginMsg}</div>}
                    <button className="wbtn" id="loginBtn2" onClick={changeLogin}>СМЕНИТЬ ЛОГИН</button>
                  </>
                ) : (
                  <div>Загрузка…</div>
                )}
                <button className="wclose" id="profileClose" onClick={() => setProfileOpen(false)}>ЗАКРЫТЬ</button>
              </div>
            </div>
          )}
          <div className={'mtab' + (menuTab === 'rooms' ? ' show' : '')}>
          <div className="board" id="roomSec">
            <h3>🌐 Комнаты</h3>
            {roomId ? (
              <>
                <div>Сидишь в <b>{roomName || roomId}</b> ({roomId}) {modeName(roomMode)}{isOwner ? ' · 👑 ты создатель' : ''}{lobby?.official ? ' · ✅ официальный' : ''}{typeof lobby?.restartIn === 'number' && (lobby?.restartIn ?? 0) > 0 ? ` · ♻️ ${fmtRestart(lobby?.restartIn ?? 0)}` : ''} — сокомнатники на карте полными телами: виден ствол, удары, прыжки.</div>
                {(lobby?.players?.length ?? 0) > 0 && (
                  <div id="lobbyList">
                    <b>👥 В комнате ({(lobby?.players?.length ?? 0) + 1}):</b>
                    <div>👑 {nick} (ты)</div>
                    {(lobby?.players ?? []).map((m, i) => (
                      <div className="srow" key={i}>
                        <span>{m.char === 'krysa' ? '🐀' : '🕶️'} {m.nick}{m.login ? `(@${m.login})` : ''} · {WEAPONS.find((w) => w.id === m.weapon)?.name ?? '👊 Кулаки'} · {m.score}🏆</span>
                        {isOwner && <button className="wclose" id={`kick-${i}`} onClick={() => lobbyAct('kick', (m as RoomMate & { sid?: string }).sid ?? '')}>КИК</button>}
                      </div>
                    ))}
                  </div>
                )}
                {isOwner && (lobby?.pending?.length ?? 0) > 0 && (
                  <div id="lobbyReqs">
                    <b>🙋 Заявки ({lobby?.pending?.length}):</b>
                    {(lobby?.pending ?? []).map((m, i) => {
                      const psid = (m as RoomMate & { sid?: string }).sid ?? '';
                      return (
                        <div className="srow" key={i}>
                          <span>{m.nick}{m.login ? `(@${m.login})` : ''}</span>
                          <button className="wbtn" id={`approve-${i}`} onClick={() => lobbyAct('approve', psid)}>ПРИНЯТЬ</button>
                          <button className="wclose" id={`deny-${i}`} onClick={() => lobbyAct('deny', psid)}>✕</button>
                        </div>
                      );
                    })}
                  </div>
                )}
                {isOwner ? (
                  <div className="srow">
                    <button className="wbtn" id="roomStart" onClick={() => lobbyAct('start')}>🚀 СТАРТ ИГРЫ</button>
                    <button className="wclose" onClick={leaveRoom}>ПОКИНУТЬ</button>
                  </div>
                ) : (
                  <>
                    {waiting && <div>⏳ Заявка у создателя — жди, тебя примут!</div>}
                    {lobby?.started
                      ? <div>🚀 Создатель дал старт — заходим…</div>
                      : <div>⏳ Игра начнётся, когда создатель нажмёт СТАРТ.</div>}
                    <button className="wclose" onClick={leaveRoom}>ПОКИНУТЬ</button>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="srow">
                  <input
                    id="roomDraft"
                    value={roomDraft}
                    maxLength={24}
                    onChange={(e) => setRoomDraft(e.target.value)}
                    placeholder="Название комнаты"
                  />
                  <button className="wbtn" id="roomCreate" onClick={() => createRoom()}>СОЗДАТЬ</button>
                </div>
                <div className="srow">
                  <span>Режим</span>
                  {MAPS.map((m) => (
                    <button key={m.id} className={'wbtn' + (draftMode === m.id ? ' cur' : '')} id={`mode-${m.id}`} onClick={() => setDraftMode(m.id)}>{m.name}</button>
                  ))}
                </div>
                <div><small>Официальные сервера (PvP, Бэкрумс, Нашествие) — во вкладке <button className="linkBtn" id="gotoServers1" onClick={() => setMenuTab('servers')}>🖥️ Сервера →</button>.</small></div>
                {roomsList.filter((r) => !r.official).length > 0 ? roomsList.filter((r) => !r.official).map((r) => (
                  <div className="srow" key={r.id}>
                    <span>{modeIcon(r.mode)} {r.name} · {r.id} · 👥 {r.count}/{modeCap(r.mode)}{(r.restartIn ?? 0) > 0 ? ` · ♻️ ${fmtRestart(r.restartIn ?? 0)}` : ''}</span>
                    <button className="wbtn" id={`join-${r.id}`} onClick={() => joinRoom(r.id)}>ВОЙТИ</button>
                  </div>
                )) : <div>Пока пусто — создай первую! Или жми <button className="linkBtn" id="gotoServers2" onClick={() => setMenuTab('servers')}>🖥️ К СЕРВЕРАМ →</button></div>}
                <button className="wclose" id="roomsRefresh" onClick={refreshRooms}>🔄 ОБНОВИТЬ</button>
              </>
            )}
          </div>
          </div>
          <div className={'mtab' + (menuTab === 'servers' ? ' show' : '')}>
          <div className="board" id="serversSec">
            <h3>🖥️ Сервера</h3>
            {restartKick && <div id="kickBanner">♻️ Сервер перезагрузился — все вылетели в меню. Заходи заново!</div>}
            <div className="srow">
              <span>API 42 LIVE:</span>
              <b>{apiPing >= 0 ? `🟢 ${apiPing} мс` : '🔴 нет связи'}</b>
              <button className="wbtn" id="serversRefresh" onClick={() => { pingApi(); refreshRooms(); }}>🔄 ОБНОВИТЬ</button>
            </div>
            <div>🟢 Онлайн: <b>{gstats?.online ?? '…'}</b> · 🖥️ Серверов: <b>{roomsList.length}</b></div>
            {roomsList.length > 0 ? roomsList.map((r) => {
              const cap = modeCap(r.mode);
              const pct = Math.min(100, Math.round((r.count / cap) * 100));
              return (
              <div className="srvcard" key={r.id}>
                <div className="srvname">{modeIcon(r.mode)} {r.name}{r.official ? ' ✅' : ''}</div>
                <div className="srvdesc">{modeDesc(r.mode)}</div>
                <div className="srvmeta">👥 {r.count}/{cap}{r.started ? ' · ▶️ идёт' : ''}{(r.restartIn ?? 0) > 0 ? ` · ♻️ ${fmtRestart(r.restartIn ?? 0)}` : ''}</div>
                <div className="srvbar"><div className="srvfill" style={{ width: `${pct}%` }} /></div>
                {!roomId && <button className="wbtn srvjoin" id={`srv-${r.id}`} onClick={() => joinRoom(r.id)}>ВОЙТИ В БОЙ</button>}
              </div>
              );
            }) : <div>Сервер пуст — создай комнату во вкладке 🌐!</div>}
          </div>
          </div>
          <div className={'mtab' + (menuTab === 'tops' ? ' show' : '')}>
          {scores.length > 0 && (
            <div className="board">
              <h3>🏆 Топ братух</h3>
              <ol>{scores.slice(0, 5).map((s, i) => (
                <li key={i}>{s.nick} — {s.score} 🏆</li>
              ))}</ol>
            </div>
          )}
          <div className="board" id="duelTop">
            <h3>⚔️ Топ дуэлянтов 1×1</h3>
            {duelTop.length > 0 ? (
              <ol>{duelTop.slice(0, 5).map((d, i) => (
                <li key={i}>{d.login} — {d.wins} 👑</li>
              ))}</ol>
            ) : <div>Пока пусто — выиграй первый раунд!</div>}
          </div>
          {gstats && (
            <div className="board" id="gstats">
              <h3>📊 Статистика игры</h3>
              <div>🎮 Всего сыграно: <b>{gstats.games}</b> · 🏆 Рекорд: <b>{gstats.best}</b> · 🟢 Онлайн: <b>{gstats.online}</b></div>
            </div>
          )}
          </div>
          <div className={'mtab' + (menuTab === 'settings' ? ' show' : '')}>
          <div className="board" id="setSec">
            <h3>⚙️ Настройки</h3>
            <div className="srow">
              <span>🔊 Звук</span>
              <button id="m-soundBtn" className="wbtn" onClick={toggleSound}>{sound ? 'ВЫКЛ' : 'ВКЛ'}</button>
            </div>
            <div className="srow">
              <span>🎚️ Громкость: {Math.round(volume * 100)}%</span>
            </div>
            <input
              id="m-volRange"
              type="range" min={0} max={1} step={0.05} value={volume}
              onChange={(e) => changeVolume(Number(e.target.value))}
            />
            <div className="srow">
              <span>👀 Чувствительность: {sens.toFixed(1)}</span>
            </div>
            <input
              id="m-sensRange"
              type="range" min={0.3} max={2.5} step={0.1} value={sens}
              onChange={(e) => changeSens(Number(e.target.value))}
            />
            <div className="srow">
              <span>🎨 Графика</span>
              <button id="m-qualityBtn" className="wbtn" onClick={toggleQuality}>
                {qualityName(quality)}
              </button>
            </div>
            <div className="srow">
              <span>🔭 Дальность: {drawDist}м</span>
            </div>
            <input
              id="m-drawRange"
              type="range" min={80} max={500} step={20} value={drawDist}
              onChange={(e) => changeDrawDist(Number(e.target.value))}
            />
            <div><small>Меньше — выше FPS (даль не рисуется).</small></div>
            <div><small>Клавиши — в бою кнопкой ⚙️ (там же сброс).</small></div>
          </div>
          </div>
          {admin !== null && (
            <div className="board" id="adminSec">
              <h3>📊 Онлайн (только для тебя)</h3>
              <div>👥 В игре: <b>{admin.totalPlayers}</b> · Комнат: <b>{admin.rooms.length}</b></div>
              {admin.rooms.map((r) => (
                <div key={r.id} className="srow">
                  <span>{r.mode === 'duel' ? '⚔️' : '🌍'} <b>{r.name}</b> ({r.id}) {r.started ? '▶️ идёт' : '⏳ лобби'} · раунд {r.round}</span>
                </div>
              ))}
              {admin.rooms.map((r) => (
                <div key={`p-${r.id}`}>
                  {r.players.map((m, i) => (
                    <div key={i}>· {m.char === 'krysa' ? '🐀' : '🕶️'} {m.nick}{m.login ? `(@${m.login})` : ''} — ❤️{m.hp} 🏆{m.score} 💀{m.kills} 🌊{m.wave} 📍{m.x},{m.z}</div>
                  ))}
                  {r.pending.map((m, i) => (
                    <div key={`q-${i}`}>· 🙋 {m.nick}{m.login ? `(@${m.login})` : ''} — ждёт приёма</div>
                  ))}
                </div>
              ))}
              <button className="wclose" onClick={() => { setAdminOpen(false); setAdmin(null); }}>ЗАКРЫТЬ</button>
            </div>
          )}
          {adminOpen && admin === null && <div className="board">Загрузка онлайна…</div>}
          </div>
        </div>
      )}
      {/* DEV-панель: баннер сбоку + сама панель (пока пустая, наполним по команде) */}
      {devUnlocked && !devOpen && (
        <button id="devBanner" onClick={() => setDevOpen(true)} title="Панель разработчика">
          🛠️
        </button>
      )}
      {devUnlocked && devOpen && (
        <div id="devPanel">
          <div id="devPanelHead">
            <span>🛠️ Панель разработчика</span>
            <button id="devClose" onClick={() => setDevOpen(false)}>✕</button>
          </div>
          <div id="devPanelBody">Пока пусто.</div>
        </div>
      )}
    </>
  );
}
