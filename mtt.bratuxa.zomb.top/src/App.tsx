import { useEffect, useRef, useState, useCallback } from 'react';
import { Game, WEAPONS, CHARS, MAPS, KEY_ACTIONS, DEFAULT_KEYS, UPG_MAX, upgCost, superCd, superRange, CASE_PRICE, type HudState, type KeyMap, type Quality, type MapId, type CustomMap, type UpgState, type CaseDrop } from './game/engine';
import oruzh1Url from './assets/oruzh1.png';
import oruzh2Url from './assets/oruzh2.png';
import pistolUrl from './assets/pistol.png';
import shotgunUrl from './assets/shotgun.png';
import batUrl from './assets/bat.png';
import charMttUrl from './assets/char-mtt.png';
import charKrysaUrl from './assets/char-krysa.png';

const CHARIMG: Record<string, string> = { mtt: charMttUrl, krysa: charKrysaUrl };

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
}

interface LobbyInfo {
  name: string;
  mode: MapId;
  started: boolean;
  owner: boolean;
  count: number;
  players: RoomMate[];
  pending?: RoomMate[];
  accepted?: boolean;
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
  const [hud, setHud] = useState<HudState>({ hp: 100, maxhp: 100, score: 0, kills: 0, enemies: 0, wave: 1, dead: false, fantiki: 0, weapon: 'fists', owned: ['fists'], moving: false, dash: 0, kick: 0, med: 0, lvl: 1, boss: 0 });
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
  const [quality, setQuality] = useState<Quality>('fast');
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
  interface ReelItem { kind: CaseDrop['kind']; label: string; sub: string; }
  const REEL_N = 42;
  const REEL_WIN = 34;
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
  const dropToReel = (d: CaseDrop): ReelItem => {
    const v = reelLabel(d.kind);
    if (d.kind === 'char') return { kind: 'char', label: '🐀 СТЕЙСИ', sub: 'ТВОЯ!' };
    return { kind: d.kind, label: v.label, sub: v.sub };
  };
  const [caseDrop, setCaseDrop] = useState<CaseDrop | null>(null);
  const [caseTick, setCaseTick] = useState(0);
  const [reel, setReel] = useState<ReelItem[]>([]);
  const [spin, setSpin] = useState(false);
  const [spinX, setSpinX] = useState(0);
  const [winOn, setWinOn] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const spinTimer = useRef(0);
  const overTimer = useRef(0);
  const closeOverlay = useCallback(() => {
    window.clearTimeout(overTimer.current);
    setOverlayOpen(false);
  }, []);
  const openCase = useCallback(() => {
    const g = gameRef.current;
    if (!g || spin) return;
    const d = g.openCase();
    if (!d.ok && d.kind === 'empty') { setCaseDrop(d); return; }
    // барабан: филлер + реальный дроп строго под прицелом — на весь экран
    const items: ReelItem[] = Array.from({ length: REEL_N }, () => {
      const k = fillerKind();
      const v = reelLabel(k);
      return { kind: k, label: v.label, sub: v.sub };
    });
    items[REEL_WIN] = dropToReel(d);
    setReel(items);
    setCaseDrop(null);
    setWinOn(false);
    setSpin(true);
    setOverlayOpen(true);
    setSpinX(0);
    // два кадра — дать DOM встать, потом едем справа налево
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setSpinX(REEL_WIN * CARD_W - 140 + CARD_W / 2);
    }));
    window.clearTimeout(spinTimer.current);
    window.clearTimeout(overTimer.current);
    spinTimer.current = window.setTimeout(() => {
      setWinOn(true);
      setSpin(false);
      setCaseDrop(d);
      setCaseTick((t) => t + 1);
      if (d.kind === 'char') setUpgTick((t) => t + 1);
      // выиграл — полюбовался — оверлей сам уходит, результат остаётся во вкладке
      overTimer.current = window.setTimeout(() => setOverlayOpen(false), 8000);
    }, 4500);
  }, [spin]);
  useEffect(() => () => { window.clearTimeout(spinTimer.current); window.clearTimeout(overTimer.current); }, []);
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
  const [roomDraft, setRoomDraft] = useState('');
  const [draftMode, setDraftMode] = useState<MapId>('arena');
  const [roomsList, setRoomsList] = useState<RoomInfo[]>([]);
  const [mates, setMates] = useState<RoomMate[]>([]);
  // лобби: владелец/заявки/старт. isOwner — я создал; waiting — моя заявка висит; lobby — свежий состав
  const [isOwner, setIsOwner] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [lobby, setLobby] = useState<LobbyInfo | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [passOld, setPassOld] = useState('');
  const [passNew, setPassNew] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [adminOpen, setAdminOpen] = useState(false);
  const [admin, setAdmin] = useState<null | { rooms: Array<{ id: string; name: string; mode: string; started: boolean; round: number; players: Array<{ nick: string; login: string; char: string; score: number; kills: number; wave: number; hp: number; x: number; z: number }> ; pending: Array<{ nick: string; login: string }> }>; totalPlayers: number }>(null);
  const [profile, setProfile] = useState<{ login: string; games: number; best: number; coins: number } | null>(null);
  const [mapChoice, setMapChoice] = useState<MapId>('arena');
  // вкладки меню в стиле TWD: каждая кнопка слева — своя вкладка справа
  type TabId = 'play' | 'fighter' | 'cases' | 'maps' | 'editor' | 'rooms' | 'servers' | 'settings' | 'tops';
  const [menuTab, setMenuTab] = useState<TabId>('play');
  // мирный режим: врагов нет, можно гулять по карте
  const [noEnemies, setNoEnemies] = useState(false);
  // чат комнаты: T — открыть, Enter — отправить
  const [chatOpen, setChatOpen] = useState(false);
  const [chatLog, setChatLog] = useState<Array<{ nick: string; text: string; t: number }>>([]);
  const [chatText, setChatText] = useState('');
  const chatLast = useRef(0);
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
  const [authMsg, setAuthMsg] = useState('');
  const hudRef = useRef(hud);
  hudRef.current = hud;
  // ник в рефах: пульс и переподключение живут в []-эффекте и видят только протухшее замыкание
  const nickRef = useRef(nick);
  nickRef.current = nick;

  // замах: дёргаем ствол (вызывает движок через onSwing при каждом реальном ударе).
  // Важно через React-state: прямые classList движок React сносит при каждом апдейте HUD.
  const [swingTick, setSwingTick] = useState(0);
  const swing = useCallback(() => { setSwingTick((t) => t + 1); }, []);

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
      onHud: (h) => setHud(h),
      onBusted: () => undefined,
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
    }, mapChoice, { enemies: !noEnemies, custom: mapChoice === 'custom' ? customsRef.current[customSel ?? ''] ?? null : undefined });
    gameRef.current = game;
    setSound(game.getSound());
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
      solidAt: (x: number, z: number, y: number) => game.debugSolidAt(x, z, y),
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
      dash: () => game.debugDash(),
      playing: () => game.debugPlaying(),
      atkcd: () => game.debugAtkCd(),
      netsync: () => game.debugNetSync(),
      netmobs: () => game.debugNetMobs(),
      resetcd: () => game.debugResetCd(),
      doDash: () => game.dash(),
      wall: () => game.debugWall(),
      kick: () => game.debugKick(),
      map: () => game.debugMap(),
      duelHp: (hp: number) => game.setDuelHp(hp),
      teleport: (x: number, z: number, yaw?: number) => game.debugTeleport(x, z, yaw),
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
  }, [mapChoice, noEnemies, customSel, customRev, menu]);

  const go = useCallback(() => {
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
    window.setTimeout(() => {
      const g = gameRef.current;
      if (!g) return;
      const sp = spawnRef.current;
      if (sp && roomMode === 'duel') g.debugTeleport(sp.x, sp.z, sp.yaw);
      g.start();
    }, 50);
    loadScores().then(setScores);
  }, [nick, roomMode, isOwner]);

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

  const createRoom = useCallback(async () => {
    try {
      const r = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nick, name: roomDraft, char: gameRef.current?.getChar() ?? 'mtt', mode: draftMode, token: token() }),
      });
      if (!r.ok) return;
      const d = (await r.json()) as { id: string; sid: string; mode: MapId; spawn: { x: number; z: number; yaw: number } | null };
      roomRef.current = { id: d.id, sid: d.sid, mode: d.mode };
      setRoomId(d.id);
      setRoomName(roomDraft || `Комната ${nick}`);
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
      const d = (await r.json()) as { sid: string; name: string; mode: MapId; pending?: boolean };
      roomRef.current = { id, sid: d.sid, mode: d.mode };
      setRoomId(id);
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
      refreshRooms();
    } catch { /* noop */ }
  }, [nick, refreshRooms]);

  const leaveRoom = useCallback(async () => {
    const { id, sid } = roomRef.current;
    roomRef.current = { id: '', sid: '', mode: '' };
    setRoomId('');
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

  // пульс комнаты 2 раза в секунду: шлём себя, забираем сокомнатников (без задержек) + дуэль
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
        // зависший запрос не должен клинить пульс навсегда: рвём через 8с
        const ctl = new AbortController();
        const to = window.setTimeout(() => ctl.abort(), 8000);
        let r: Response;
        try {
          r = await fetch(`/api/rooms/${id}/beat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sid, char: g.getChar(), x: p.x, z: p.z, yaw: p.yaw, hp: h.hp, score: h.score, kills: h.kills, wave: h.wave, weapon: pr.weapon, py: pr.py, atk: pr.atk, dead: pr.dead }),
            signal: ctl.signal,
          });
        } finally { window.clearTimeout(to); }
        if (r.status === 404) { leaveRoom(); return; }
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
                if (jr.status === 404) { leaveRoom(); return; }
                const jd = (await jr.json()) as { sid?: string };
                if (typeof jd.sid === 'string' && jd.sid) roomRef.current = { ...roomRef.current, sid: jd.sid };
              } catch { /* noop */ }
            }
          }
          return;
        }
        const d = (await r.json()) as { players: RoomMate[]; duel?: DuelInfo; chat?: Array<{ nick: string; text: string; t: number }>; mobs?: Array<{ id: number; kind: string; x: number; z: number; hp: number; dead: boolean; wave: number }>; owner?: boolean; t?: number };
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
        // общие мобы: хост заливает слепок, гость ставит кукол (только в бою на моб-карте)
        const mobMap = roomRef.current.mode === 'arena' || roomRef.current.mode === 'backrooms';
        const amOwner = d.owner === true;
        const inGame = (() => { try { return g.debugPlaying(); } catch { return false; } })();
        g.setNetSync(!!id && inGame && !amOwner && mobMap);
        if (inGame && mobMap && amOwner) {
          try {
            await fetch(`/api/rooms/${id}/mobpush`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ sid, mobs: g.debugMobs() }),
            });
          } catch { /* noop */ }
        } else if (inGame && mobMap && !amOwner && Array.isArray(d.mobs)) {
          g.setRemoteMobs(d.mobs);
        }
        // чат: добираем только новое по метке времени
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
    }, 500);
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
    if (g) setQuality(g.setQuality(g.getQuality() === 'nice' ? 'fast' : 'nice'));
  }, []);

  const hpFrac = Math.max(0, hud.hp / hud.maxhp);
  const wname = WEAPONS.find((w) => w.id === hud.weapon)?.name ?? '👊 Кулаки';

  return (
    <>
      <canvas id="c" ref={canvasRef} />
      {!menu && <div id="vig" />}
      {!menu && (
        <div id="hud">
          <div id="hpWrap">
            <span>❤️ {hud.hp}/{hud.maxhp}</span>
            <div id="hpBar"><div id="hpFill" style={{ width: `${hpFrac * 100}%` }} /></div>
          </div>
          <div id="hudRow">{noEnemies ? '🕊️ МИРНЫЙ РЕЖИМ · ' : `🌊 Волна ${hud.wave} · 👹 ${hud.enemies} · `}💀 {hud.kills} · 🏆 {hud.score}</div>
          <div id="hudRow2">🎟️ {hud.fantiki} · 💊 {hud.med}/3 · ⭐ {hud.lvl} · {wname}{char === 'mtt' && (hud.dash > 0 ? ` · ⚡ ${hud.dash.toFixed(1)}с` : ' · ⚡ рывок готов')}{char === 'krysa' && (hud.kick > 0 ? ` · 🌀 ${hud.kick.toFixed(1)}с` : ' · 🌀 вол-кик готов')}</div>
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
          <button id="menuBtn" onClick={toMenu}>🏠 В МЕНЮ</button>
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
          <div id="weapon" key={`weapon-${swingTick}`} ref={weaponRef} className={(hud.moving ? 'walk' : '') + (swingTick > 0 ? ' swing' : '') + (hud.weapon === 'pistol' || hud.weapon === 'shotgun' ? ' ' + hud.weapon : '')}>
            <img src={WIMG[hud.weapon] ?? oruzh1Url} alt="оружие" />
          </div>
          {roomId && (
            <div id="roomBadge">
              🌐 {roomId} · {mates.length + 1}
              <button id="roomLeave" onClick={leaveRoom}>✕</button>
              {mates.length > 0 && (
                <div id="roomMates">{mates.map((m) => `${WEAPONS.find((w) => w.id === m.weapon)?.name ?? '👊'} ${m.nick}${m.login ? `(@${m.login})` : ''} ${m.score}🏆`).join(' · ')}</div>
              )}
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
          {waveBanner > 0 && (
            <div id="waveBanner" key={`wave-${waveBanner}`}>🌊 ВОЛНА {waveBanner}</div>
          )}
          {bossBanner && (
            <div id="bossBanner" key="boss">👑 БОСС-ГОПНИК 🍺</div>
          )}
        </>
      )}
      {hud.dead && !menu && (
        <div id="busted" style={{ display: 'flex' }}>
          <div id="deadPanel">
            <div>ЗАВАЛЕН! 👊</div>
            <div id="deadScore">{hud.score} 🏆 · {hud.kills} 💀</div>
            <button id="reviveBtn" onClick={() => gameRef.current?.revive()}>💚 ВОЗРОДИТЬСЯ (−100 🏆)</button>
            <button id="retryBtn" onClick={() => window.location.reload()}>🔄 ЗАНОВО</button>
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
                {quality === 'nice' ? '✨ КРАСИВО' : '⚡ БЫСТРО'}
              </button>
            </div>
            <div className="wdesc">Быстро — без теней, чёткий fps. Красиво — тени и сглаживание.</div>
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
      {menu && (
        <div id="menu" className="twd">
          <div id="menuBalance" title="Твои фантики">🎟️ {hud.fantiki}</div>
          <div id="menuNav">
            <h1>👊 42 LIVE 💥</h1>
            {([['play', '▶ ИГРАТЬ'], ['fighter', '🎭 БОЕЦ'], ['cases', '🎰 КЕЙСЫ'], ['maps', '🗺️ КАРТЫ'], ['editor', '🧩 РЕДАКТОР'], ['rooms', '🌐 КОМНАТЫ'], ['servers', '🖥️ СЕРВЕРА'], ['settings', '⚙️ НАСТРОЙКИ'], ['tops', '🏆 ТОПЫ']] as Array<[TabId, string]>).map(([id, label]) => (
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
                      <div className={'rarity ' + (c.rarity === 'Легендарный' ? 'leg' : 'base')} id={`rarity-${c.id}`}>
                        {c.rarity === 'Легендарный' ? '🌟 Редкость: Легендарный' : '⚪ Редкость: Базовый'}
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
                      <div className="cupgLine"><small>🔧 Прокачка: ❤️×{u.hp} 💪×{u.dmg} 💨×{u.spd} {c.id === 'mtt' ? '⚡' : '🌀'}×{u.sup} · кд супера {g?.superCdOf(c.id) ?? (c.id === 'mtt' ? 3 : 5)}с</small></div>
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
                            ['sup', c.id === 'mtt' ? '⚡ Супер: рывок' : '🌀 Супер: вол-кик', `кд → мин 1.7с (сейчас ${g?.superCdOf(c.id)}с) · дальность ×${superRange(u.sup)} (+15%/ур)`],
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
              <div className="mdesc">Внутри — боец! Шанс выбить 🌟 Стейси Крысу (Легендарный) — 20%. Не повезло — утешительный приз: фантики, опыт или аптечка.</div>
              <ul className="cabilityList">
                <li>⚪ МТТ — у тебя уже есть (Базовый)</li>
                <li>🌟 Стейси Крыса — только из кейса (Легендарный)</li>
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
              {overlayOpen && reel.length > 0 && (
                <div id="caseOverlay" onClick={() => { if (winOn) closeOverlay(); }}>
                  <div id="caseFull" onClick={(e) => e.stopPropagation()}>
                    <h3>🎰 КЕЙС БОЙЦА</h3>
                    <div id="caseRoulette">
                      <div id="casePointer">▼</div>
                      <div id="caseWin">
                        <div
                          id="caseTrack"
                          style={{ transform: `translateX(${-spinX}px)`, transitionDuration: spin || !winOn ? '4.2s' : '0.3s' }}
                        >
                          {reel.map((it, i) => (
                            <div
                              key={i}
                              className={'rcard ' + it.kind + (winOn && i === REEL_WIN ? ' win' : '')}
                              id={winOn && i === REEL_WIN ? 'caseWinCard' : undefined}
                            >
                              {it.kind === 'char'
                                ? <img src={CHARIMG.krysa} alt="Стейси" />
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
            </div>
          </div>
          </div>
          <div className={'mtab' + (menuTab === 'play' ? ' show' : '')}>
          <p>Арена 42 LIVE от первого лица: машешься с волнами врагов, у каждого полоска HP.
            Джойстик слева — движение, кнопка справа — удар. Фантики с врагов трать в 🛒 оружейке,
            завал — жми 💚 возродиться!</p>
          {!authed && (
            <div className="board" id="authBox">
              <h3>🔐 Вход</h3>
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
                type="password"
                value={authPass}
                maxLength={64}
                onChange={(e) => setAuthPass(e.target.value)}
                placeholder="Пароль"
                autoComplete="current-password"
              />
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
            <h3>👹 Враги</h3>
            <div className="srow">
              <button id="foeBtn" className={'wbtn' + (!noEnemies ? ' cur' : '')} onClick={() => setNoEnemies((v) => !v)}>
                {noEnemies ? '🕊️ ВЫКЛ — просто гуляю' : '👹 ВКЛ — будет махач'}
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
            <h3>🚀 В бой</h3>
          <input
            id="nick"
            value={nick}
            maxLength={20}
            onChange={(e) => setNick(e.target.value)}
            placeholder="Твой ник"
          />
          <button id="charBtn" className="wbtn" onClick={() => setMenuTab('fighter')}>
            🎭 БОЕЦ: {char === 'krysa' ? '🐀 Стейси' : '🕶️ МТТ'} — ВЫБРАТЬ
          </button>
          {(roomId && !isOwner) || waiting ? (
            <button id="goBtn" disabled title="Ждём старта от создателя">⏳ ЖДУ СТАРТА…</button>
          ) : (
            <button id="goBtn" onClick={go}>{(() => { const gm = roomId ? roomMode : mapChoice; return gm === 'duel' ? '⚔️ В ДУЭЛЬ' : gm === 'backrooms' ? '🟨 В БЭКРУМС' : gm === 'custom' ? '🧩 НА СВОЮ' : gm === 'random' ? '🎲 НА СЛУЧАЙНУЮ' : '▶️ ПОГНАЛИ'; })()}</button>
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
                    <div>🎭 Боец: {char === 'krysa' ? '🐀 Стейси' : '🕶️ МТТ'} · ⭐ Ур. {hud.lvl} · Ник: {nick}</div>
                    <h3>🔑 Сменить пароль</h3>
                    <input
                      id="passOld"
                      type="password"
                      value={passOld}
                      maxLength={64}
                      onChange={(e) => setPassOld(e.target.value)}
                      placeholder="Старый пароль"
                      autoComplete="current-password"
                    />
                    <input
                      id="passNew"
                      type="password"
                      value={passNew}
                      maxLength={64}
                      onChange={(e) => setPassNew(e.target.value)}
                      placeholder="Новый пароль (от 4 символов)"
                      autoComplete="new-password"
                    />
                    {passMsg && <div id="passMsg">{passMsg}</div>}
                    <button className="wbtn" id="passBtn" onClick={changePass}>СМЕНИТЬ ПАРОЛЬ</button>
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
                <div>Сидишь в <b>{roomName || roomId}</b> ({roomId}) {roomMode === 'duel' ? '⚔️ ДУЭЛЬ 1×1' : roomMode === 'backrooms' ? '🟨 БЭКРУМС' : roomMode === 'custom' ? '🧩 СВОЯ' : '🌍 Арена'}{isOwner ? ' · 👑 ты создатель' : ''} — сокомнатники на карте полными телами: виден ствол, удары, прыжки.</div>
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
                  <button className="wbtn" id="roomCreate" onClick={createRoom}>СОЗДАТЬ</button>
                </div>
                <div className="srow">
                  <span>Режим</span>
                  {MAPS.map((m) => (
                    <button key={m.id} className={'wbtn' + (draftMode === m.id ? ' cur' : '')} id={`mode-${m.id}`} onClick={() => setDraftMode(m.id)}>{m.name}</button>
                  ))}
                </div>
                {roomsList.length > 0 ? roomsList.map((r) => (
                  <div className="srow" key={r.id}>
                    <span>{r.mode === 'duel' ? '⚔️' : r.mode === 'backrooms' ? '🟨' : '🌍'} {r.name} · {r.id} · 👥 {r.count}{r.mode === 'duel' ? '/2' : ''}</span>
                    <button className="wbtn" id={`join-${r.id}`} onClick={() => joinRoom(r.id)}>ВОЙТИ</button>
                  </div>
                )) : <div>Пока пусто — создай первую!</div>}
                <button className="wclose" onClick={refreshRooms}>🔄 ОБНОВИТЬ</button>
              </>
            )}
          </div>
          </div>
          <div className={'mtab' + (menuTab === 'servers' ? ' show' : '')}>
          <div className="board" id="serversSec">
            <h3>🖥️ Сервера</h3>
            <div className="srow">
              <span>API 42 LIVE:</span>
              <b>{apiPing >= 0 ? `🟢 ${apiPing} мс` : '🔴 нет связи'}</b>
              <button className="wbtn" id="serversRefresh" onClick={() => { pingApi(); refreshRooms(); }}>🔄 ОБНОВИТЬ</button>
            </div>
            <div>🟢 Онлайн: <b>{gstats?.online ?? '…'}</b> · 🌐 Комнат открыто: <b>{roomsList.length}</b></div>
            {roomsList.length > 0 ? roomsList.map((r) => (
              <div className="srow" key={r.id}>
                <span>{r.mode === 'duel' ? '⚔️' : r.mode === 'backrooms' ? '🟨' : '🌍'} {r.name} · 👥 {r.count}{r.mode === 'duel' ? '/2' : ''}{r.started ? ' · ▶️ идёт' : ''}</span>
              </div>
            )) : <div>Сервер пуст — создай комнату во вкладке 🌐!</div>}
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
                {quality === 'nice' ? '✨ КРАСИВО' : '⚡ БЫСТРО'}
              </button>
            </div>
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
    </>
  );
}
