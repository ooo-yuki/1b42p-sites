import { useEffect, useRef, useState, useCallback } from 'react';
import { Game, WEAPONS, CHARS, KEY_ACTIONS, DEFAULT_KEYS, type HudState, type KeyMap, type Quality, type MapId } from './game/engine';
import oruzh1Url from './assets/oruzh1.png';
import oruzh2Url from './assets/oruzh2.png';
import pistolUrl from './assets/pistol.png';
import charMttUrl from './assets/char-mtt.png';
import charKrysaUrl from './assets/char-krysa.png';

const CHARIMG: Record<string, string> = { mtt: charMttUrl, krysa: charKrysaUrl };

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
}

interface DuelFoe {
  nick: string;
  login: string;
  char: string;
  x: number;
  z: number;
  hp: number;
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
  mode: 'arena' | 'duel';
  count: number;
  started?: boolean;
}

interface LobbyInfo {
  name: string;
  mode: 'arena' | 'duel';
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

const WIMG: Record<string, string> = { fists: oruzh1Url, bat: oruzh1Url, axe: oruzh2Url, pistol: pistolUrl };

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

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const joyRef = useRef<HTMLDivElement>(null);
  const joyKnob = useRef<HTMLDivElement>(null);
  const weaponRef = useRef<HTMLDivElement>(null);
  const joyId = useRef(-1);
  const gameRef = useRef<Game | null>(null);
  const [menu, setMenu] = useState(true);
  const [hud, setHud] = useState<HudState>({ hp: 100, maxhp: 100, score: 0, kills: 0, enemies: 0, wave: 1, dead: false, fantiki: 0, weapon: 'fists', owned: ['fists'], moving: false, dash: 0, kick: 0, med: 0, lvl: 1 });
  const [scores, setScores] = useState<ScoreRow[]>([]);
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
  const [keys, setKeys] = useState<KeyMap>({ ...DEFAULT_KEYS });
  const [capturing, setCapturing] = useState<keyof KeyMap | null>(null);
  const [waveBanner, setWaveBanner] = useState(0);
  const prevWave = useRef(0);
  const [nick, setNick] = useState(() => {
    try { return localStorage.getItem(NICK_KEY) || 'Братуха'; } catch { return 'Братуха'; }
  });
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomMode, setRoomMode] = useState<'arena' | 'duel'>('arena');
  const [roomDraft, setRoomDraft] = useState('');
  const [draftMode, setDraftMode] = useState<'arena' | 'duel'>('arena');
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
  // экраны меню: main — главная, chars — отдельный выбор бойца
  const [menuScreen, setMenuScreen] = useState<'main' | 'chars'>('main');
  const [duel, setDuel] = useState<DuelInfo | null>(null);
  const roomRef = useRef({ id: '', sid: '' });
  const duelRef = useRef<DuelInfo | null>(null);
  const matesRef = useRef<RoomMate[]>([]);
  const prevRound = useRef(0);
  const spawnRef = useRef<{ x: number; z: number; yaw: number } | null>(null);
  // аккаунт: '' — неизвестно, 'guest' — гость, иначе логин
  const [authed, setAuthed] = useState('');
  const [authLogin, setAuthLogin] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authMsg, setAuthMsg] = useState('');
  const hudRef = useRef(hud);
  hudRef.current = hud;

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
    if (!menu || !canvasRef.current) return;
    if (gameRef.current) { gameRef.current.destroy(); gameRef.current = null; }
    const game = new Game(canvasRef.current, null, {
      onHud: (h) => setHud(h),
      onBusted: () => undefined,
      onSwing: () => { swing(); tryDuelHit(); },
    }, mapChoice);
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
      doDash: () => game.dash(),
      wall: () => game.debugWall(),
      kick: () => game.debugKick(),
      map: () => game.debugMap(),
      duelHp: (hp: number) => game.setDuelHp(hp),
      teleport: (x: number, z: number, yaw?: number) => game.debugTeleport(x, z, yaw),
      charaSet: (id: string) => game.setChar(id),
      switchW: () => game.switchWeapon(),
      medBuy: () => game.buyMedkit(),
      medUse: () => game.useMedkit(),
      level: () => game.level(),
      spawnKind: (kind: 'walk' | 'fly') => game.debugSpawn(kind),
      flyers: () => game.debugFlyers(),
      remoteList: () => game.debugRemoteList(),
    };
    const kd = (e: KeyboardEvent) => {
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
  }, [mapChoice]);

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
  const refreshRooms = useCallback(() => { loadRooms().then(setRoomsList); void loadStats(); }, []);
  useEffect(() => { refreshRooms(); }, [refreshRooms]);

  const createRoom = useCallback(async () => {
    try {
      const r = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nick, name: roomDraft, char: gameRef.current?.getChar() ?? 'mtt', mode: draftMode, token: token() }),
      });
      if (!r.ok) return;
      const d = (await r.json()) as { id: string; sid: string; mode: 'arena' | 'duel'; spawn: { x: number; z: number; yaw: number } | null };
      roomRef.current = { id: d.id, sid: d.sid };
      setRoomId(d.id);
      setRoomName(roomDraft || `Комната ${nick}`);
      setRoomMode(d.mode);
      setMapChoice(d.mode === 'duel' ? 'duel' : 'arena');
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
      const d = (await r.json()) as { sid: string; name: string; mode: 'arena' | 'duel'; pending?: boolean };
      roomRef.current = { id, sid: d.sid };
      setRoomId(id);
      setRoomName(d.name);
      setRoomMode(d.mode);
      setMapChoice(d.mode === 'duel' ? 'duel' : 'arena');
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
    roomRef.current = { id: '', sid: '' };
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
      try {
        const p = g.debugPos();
        const h = hudRef.current;
        const r = await fetch(`/api/rooms/${id}/beat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sid, char: g.getChar(), x: p.x, z: p.z, yaw: p.yaw, hp: h.hp, score: h.score, kills: h.kills, wave: h.wave }),
        });
        if (!r.ok) return;
        const d = (await r.json()) as { players: RoomMate[]; duel?: DuelInfo };
        setMates(d.players ?? []);
        matesRef.current = d.players ?? [];
        g.setRemotes(d.players ?? []);
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
      } catch { /* noop */ }
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

  // захват клавиши для переназначения управления
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
          <div id="hudRow">🌊 Волна {hud.wave} · 👹 {hud.enemies} · 💀 {hud.kills} · 🏆 {hud.score}</div>
          <div id="hudRow2">🎟️ {hud.fantiki} · 💊 {hud.med}/3 · ⭐ {hud.lvl} · {wname}{char === 'mtt' && (hud.dash > 0 ? ` · ⚡ ${hud.dash.toFixed(1)}с` : ' · ⚡ рывок готов')}{char === 'krysa' && (hud.kick > 0 ? ` · 🌀 ${hud.kick.toFixed(1)}с` : ' · 🌀 вол-кик готов')}</div>
          <small id="hint">WASD — идти · Space — прыжок · клик/J — удар · Shift — бег · E — смена ствола · X — аптечка · I — во весь экран{char === 'mtt' ? ' · C — рывок (вверх — полёт)' : ' · стена + прыжок — вол-кик'}</small>
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
          <div id="cross"><i></i><i></i></div>
          <div
            id="joy"
            ref={joyRef}
            onPointerDown={joyStart}
            onPointerMove={joyMove}
            onPointerUp={joyEnd}
            onPointerCancel={joyEnd}
          >
            <div id="joyKnob" ref={joyKnob} />
          </div>
          <button
            id="hitBtn"
            onPointerDown={() => { gameRef.current?.attack(); }}
          >
            👊<span>УДАР</span>
          </button>
          <div id="weapon" key={`weapon-${swingTick}`} ref={weaponRef} className={(hud.moving ? 'walk' : '') + (swingTick > 0 ? ' swing' : '') + (hud.weapon === 'pistol' ? ' pistol' : '')}>
            <img src={WIMG[hud.weapon] ?? oruzh1Url} alt="оружие" />
          </div>
          {roomId && (
            <div id="roomBadge">
              🌐 {roomId} · {mates.length + 1}
              <button id="roomLeave" onClick={leaveRoom}>✕</button>
              {mates.length > 0 && (
                <div id="roomMates">{mates.map((m) => `${m.nick}${m.login ? `(@${m.login})` : ''} ${m.score}🏆`).join(' · ')}</div>
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
        <div id="menu">
          <h1>👊 42 LIVE 💥</h1>
          {menuScreen === 'chars' ? (
            <div className="board" id="charSec">
              <h3>🎭 Выбор бойца</h3>
              <div className="charRow">
                {CHARS.map((c) => (
                  <button
                    key={c.id}
                    id={`char-${c.id}`}
                    className={'charCard' + (char === c.id ? ' sel' : '')}
                    onClick={() => pickChar(c.id)}
                  >
                    <img src={CHARIMG[c.id]} alt={c.name} />
                    <div className="cname">{c.name}</div>
                    <div className="cdesc">{c.desc}</div>
                    <div className="cstats">❤️ {c.hp} · 💨 {c.spd}× · ⭐ Ур. {gameRef.current?.levelOf(c.id) ?? 1}</div>
                    <div className="cability">{c.id === 'mtt' ? '⚡ Рывок на C — можно вверх, в полёте' : '🌀 Вол-кик у стены + прыжок ×3'}</div>
                  </button>
                ))}
              </div>
              <div className="srow">
                <button className="wclose" id="charBack" onClick={() => setMenuScreen('main')}>← НАЗАД</button>
                <button className="wbtn" id="charGo" onClick={() => setMenuScreen('main')}>ИГРАТЬ ЭТИМ ✔</button>
              </div>
            </div>
          ) : (
          <>
          <p>Арена 42 LIVE от первого лица: машешься с волнами врагов, у каждого полоска HP.
            Джойстик слева — движение, кнопка справа — удар. Фантики с врагов трать в 🛒 оружейке,
            завал — жми 💚 возродиться!
            <br /><a id="hubLink" href="https://hub.bratuxa.zomb.top">← Хаб 1Б42П</a></p>
          {!authed ? (
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
          ) : (
            <>
              <div id="authWho">
                {authed === 'guest' ? '👤 Гость' : `🔐 ${authed}`}
                {' · '}
                {authed !== 'guest' && <button id="profileBtn" onClick={openProfile}>👤 ПРОФИЛЬ</button>}
                {' · '}
                {authed !== 'guest' && <button id="adminBtn" onClick={async () => { if (await loadAdmin()) setAdminOpen(true); }}>📊 ОНЛАЙН</button>}
                {' · '}
                <button id="authOut" onClick={authOut}>{authed === 'guest' ? 'войти' : 'выйти'}</button>
              </div>
          <div className="menuArt">
            <img src={oruzh1Url} alt="кулаки" />
            <img src={oruzh2Url} alt="секира" />
          </div>
          <input
            id="nick"
            value={nick}
            maxLength={20}
            onChange={(e) => setNick(e.target.value)}
            placeholder="Твой ник"
          />
          <button id="charBtn" className="wbtn" onClick={() => setMenuScreen('chars')}>
            🎭 БОЕЦ: {char === 'krysa' ? '🐀 Крыса' : '🕶️ МТТ'} — ВЫБРАТЬ
          </button>
          {(roomId && !isOwner) || waiting ? (
            <button id="goBtn" disabled title="Ждём старта от создателя">⏳ ЖДУ СТАРТА…</button>
          ) : (
            <button id="goBtn" onClick={go}>{roomMode === 'duel' ? '⚔️ В ДУЭЛЬ' : '▶️ ПОГНАЛИ'}</button>
          )}
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
                    <div>🎭 Боец: {char === 'krysa' ? '🐀 Крыса' : '🕶️ МТТ'} · ⭐ Ур. {hud.lvl} · Ник: {nick}</div>
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
          <div className="board" id="roomSec">
            <h3>🌐 Комнаты</h3>
            {roomId ? (
              <>
                <div>Сидишь в <b>{roomName || roomId}</b> ({roomId}) {roomMode === 'duel' ? '⚔️ ДУЭЛЬ 1×1' : '🌍 Арена'}{isOwner ? ' · 👑 ты создатель' : ''} — сокомнатники появятся на карте призраками.</div>
                {(lobby?.players?.length ?? 0) > 0 && (
                  <div id="lobbyList">
                    <b>👥 В комнате ({(lobby?.players?.length ?? 0) + 1}):</b>
                    <div>👑 {nick} (ты)</div>
                    {(lobby?.players ?? []).map((m, i) => (
                      <div className="srow" key={i}>
                        <span>{m.char === 'krysa' ? '🐀' : '🕶️'} {m.nick}{m.login ? `(@${m.login})` : ''} · {m.score}🏆</span>
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
                  <button className={'wbtn' + (draftMode === 'arena' ? ' cur' : '')} id="mode-arena" onClick={() => setDraftMode('arena')}>🌍 АРЕНА</button>
                  <button className={'wbtn' + (draftMode === 'duel' ? ' cur' : '')} id="mode-duel" onClick={() => setDraftMode('duel')}>⚔️ 1×1</button>
                </div>
                {roomsList.length > 0 ? roomsList.map((r) => (
                  <div className="srow" key={r.id}>
                    <span>{r.mode === 'duel' ? '⚔️' : '🌍'} {r.name} · {r.id} · 👥 {r.count}{r.mode === 'duel' ? '/2' : ''}</span>
                    <button className="wbtn" id={`join-${r.id}`} onClick={() => joinRoom(r.id)}>ВОЙТИ</button>
                  </div>
                )) : <div>Пока пусто — создай первую!</div>}
                <button className="wclose" onClick={refreshRooms}>🔄 ОБНОВИТЬ</button>
              </>
            )}
          </div>
          {scores.length > 0 && (
            <div className="board">
              <h3>🏆 Топ братух</h3>
              <ol>{scores.slice(0, 5).map((s, i) => (
                <li key={i}>{s.nick} — {s.score} 🏆</li>
              ))}</ol>
            </div>
          )}
          {gstats && (
            <div className="board" id="gstats">
              <h3>📊 Статистика игры</h3>
              <div>🎮 Всего сыграно: <b>{gstats.games}</b> · 🏆 Рекорд: <b>{gstats.best}</b> · 🟢 Онлайн: <b>{gstats.online}</b></div>
            </div>
          )}
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
            </>
          )}
          </>
          )}
        </div>
      )}
    </>
  );
}
