import { useEffect, useRef, useState, useCallback } from 'react';
import { Game, WEAPONS, CHARS, KEY_ACTIONS, DEFAULT_KEYS, type HudState, type KeyMap, type Quality } from './game/engine';
import oruzh1Url from './assets/oruzh1.png';
import oruzh2Url from './assets/oruzh2.png';
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
  char: string;
  x: number;
  z: number;
  hp: number;
  score: number;
  kills: number;
  wave: number;
}

interface RoomInfo {
  id: string;
  name: string;
  count: number;
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

const WIMG: Record<string, string> = { fists: oruzh1Url, bat: oruzh1Url, axe: oruzh2Url };

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
      body: JSON.stringify({ nick, score, coins }),
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
  const [hud, setHud] = useState<HudState>({ hp: 100, maxhp: 100, score: 0, kills: 0, enemies: 0, wave: 1, dead: false, fantiki: 0, weapon: 'fists', owned: ['fists'], moving: false, dash: 0, kick: 0 });
  const [scores, setScores] = useState<ScoreRow[]>([]);
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
  const [roomDraft, setRoomDraft] = useState('');
  const [roomsList, setRoomsList] = useState<RoomInfo[]>([]);
  const [mates, setMates] = useState<RoomMate[]>([]);
  const roomRef = useRef({ id: '', sid: '' });
  const hudRef = useRef(hud);
  hudRef.current = hud;

  // замах: дёргаем ствол + белые полосы (вызывает движок через onSwing при каждом реальном ударе).
  // Важно через React-state: прямые classList движок React сносит при каждом апдейте HUD.
  const [swingTick, setSwingTick] = useState(0);
  const swing = useCallback(() => { setSwingTick((t) => t + 1); }, []);

  useEffect(() => {
    beacon();
    const t = window.setInterval(beacon, 30000);
    loadScores().then(setScores);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!menu || !canvasRef.current || gameRef.current) return;
    const game = new Game(canvasRef.current, null, {
      onHud: (h) => setHud(h),
      onBusted: () => undefined,
      onSwing: () => swing(),
    });
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
      teleport: (x: number, z: number, yaw?: number) => game.debugTeleport(x, z, yaw),
      charaSet: (id: string) => game.setChar(id),
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
  }, []);

  const go = useCallback(() => {
    try { localStorage.setItem(NICK_KEY, nick); } catch { /* noop */ }
    setMenu(false);
    window.setTimeout(() => gameRef.current?.start(), 50);
    loadScores().then(setScores);
  }, [nick]);

  // ---- комнаты ----
  const refreshRooms = useCallback(() => { loadRooms().then(setRoomsList); }, []);
  useEffect(() => { refreshRooms(); }, [refreshRooms]);

  const createRoom = useCallback(async () => {
    try {
      const r = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nick, name: roomDraft, char: gameRef.current?.getChar() ?? 'mtt' }),
      });
      if (!r.ok) return;
      const d = (await r.json()) as { id: string; sid: string };
      roomRef.current = { id: d.id, sid: d.sid };
      setRoomId(d.id);
      setRoomName(roomDraft || `Комната ${nick}`);
      setMates([]);
      refreshRooms();
    } catch { /* noop */ }
  }, [nick, roomDraft, refreshRooms]);

  const joinRoom = useCallback(async (id: string) => {
    try {
      const r = await fetch(`/api/rooms/${id}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nick, char: gameRef.current?.getChar() ?? 'mtt' }),
      });
      if (!r.ok) return;
      const d = (await r.json()) as { sid: string; name: string };
      roomRef.current = { id, sid: d.sid };
      setRoomId(id);
      setRoomName(d.name);
      setMates([]);
      refreshRooms();
    } catch { /* noop */ }
  }, [nick, refreshRooms]);

  const leaveRoom = useCallback(async () => {
    const { id, sid } = roomRef.current;
    roomRef.current = { id: '', sid: '' };
    setRoomId('');
    setRoomName('');
    setMates([]);
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

  // пульс комнаты: шлём себя, забираем сокомнатников
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
        const d = (await r.json()) as { players: RoomMate[] };
        setMates(d.players ?? []);
        g.setRemotes(d.players ?? []);
      } catch { /* noop */ }
    }, 1500);
    return () => window.clearInterval(t);
  }, []);

  const onBustedShown = useRef(false);
  // плашка нового раунда: всплывает на каждую смену волны
  useEffect(() => {
    if (menu || hud.wave === prevWave.current) return;
    prevWave.current = hud.wave;
    setWaveBanner(hud.wave);
    const t = window.setTimeout(() => setWaveBanner(0), 2600);
    return () => window.clearTimeout(t);
  }, [hud.wave, menu]);
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
          <div id="hudRow2">🎟️ {hud.fantiki} · {wname}{char === 'mtt' && (hud.dash > 0 ? ` · ⚡ ${hud.dash.toFixed(1)}с` : ' · ⚡ рывок готов')}{char === 'krysa' && (hud.kick > 0 ? ` · 🌀 ${hud.kick.toFixed(1)}с` : ' · 🌀 вол-кик готов')}</div>
          <small id="hint">WASD — идти · Space — прыжок · клик/J — удар · Shift — бег{char === 'mtt' ? ' · C — рывок' : ' · стена + прыжок — вол-кик'}</small>
        </div>
      )}
      {!menu && (
        <>
          <button id="shopBtn" onClick={() => setShopOpen(true)}>🛒 Магазин</button>
          <button id="setBtn" onClick={() => setSetOpen(true)}>⚙️</button>
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
          <div id="weapon" key={`weapon-${swingTick}`} ref={weaponRef} className={(hud.moving ? 'walk' : '') + (swingTick > 0 ? ' swing' : '')}>
            <img src={WIMG[hud.weapon] ?? oruzh1Url} alt="оружие" />
          </div>
          {roomId && (
            <div id="roomBadge">
              🌐 {roomId} · {mates.length + 1}
              <button id="roomLeave" onClick={leaveRoom}>✕</button>
              {mates.length > 0 && (
                <div id="roomMates">{mates.map((m) => `${m.nick} ${m.score}🏆`).join(' · ')}</div>
              )}
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
          <p>Арена 42 LIVE от первого лица: машешься с волнами врагов, у каждого полоска HP.
            Джойстик слева — движение, кнопка справа — удар. Фантики с врагов трать в 🛒 оружейке,
            завал — жми 💚 возродиться!
            <br /><a id="hubLink" href="https://hub.bratuxa.zomb.top">← Хаб 1Б42П</a></p>
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
          <div className="board" id="charSec">
            <h3>🎭 Боец</h3>
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
                  <div className="cstats">❤️ {c.hp} · 💨 {c.spd}×</div>
                </button>
              ))}
            </div>
          </div>
          <button id="goBtn" onClick={go}>▶️ ПОГНАЛИ</button>
          <div className="board" id="roomSec">
            <h3>🌐 Комнаты</h3>
            {roomId ? (
              <div>Сидишь в <b>{roomName || roomId}</b> ({roomId}) — сокомнатники появятся на арене синими призраками.</div>
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
                {roomsList.length > 0 ? roomsList.map((r) => (
                  <div className="srow" key={r.id}>
                    <span>{r.name} · {r.id} · 👥 {r.count}</span>
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
        </div>
      )}
    </>
  );
}
