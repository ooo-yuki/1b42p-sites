import { useEffect, useRef, useState, useCallback } from 'react';
import { Game, WEAPONS, type HudState } from './game/engine';
import oruzh1Url from './assets/oruzh1.png';
import oruzh2Url from './assets/oruzh2.png';

interface ScoreRow {
  nick: string;
  score: number;
  coins: number;
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

const NICK_KEY = 'mtt_nick';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const joyRef = useRef<HTMLDivElement>(null);
  const joyKnob = useRef<HTMLDivElement>(null);
  const weaponRef = useRef<HTMLDivElement>(null);
  const joyId = useRef(-1);
  const gameRef = useRef<Game | null>(null);
  const [menu, setMenu] = useState(true);
  const [hud, setHud] = useState<HudState>({ hp: 100, maxhp: 100, score: 0, kills: 0, enemies: 0, wave: 1, dead: false, fantiki: 0, weapon: 'fists', owned: ['fists'], moving: false });
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [shopOpen, setShopOpen] = useState(false);
  const [setOpen, setSetOpen] = useState(false);
  const [sound, setSound] = useState(true);
  const [sens, setSens] = useState(1);
  const [waveBanner, setWaveBanner] = useState(0);
  const prevWave = useRef(0);
  const [nick, setNick] = useState(() => {
    try { return localStorage.getItem(NICK_KEY) || 'Братуха'; } catch { return 'Братуха'; }
  });
  const hudRef = useRef(hud);
  hudRef.current = hud;

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
    });
    gameRef.current = game;
    setSound(game.getSound());
    setSens(game.getSens());
    (window as unknown as { __mtt?: object }).__mtt = {
      pos: () => game.debugPos(),
      attack: () => game.debugAttack(),
      hp: () => game.debugHp(),
      spots: () => game.debugSpots(),
      solids: () => game.debugSolids(),
      give: (n: number) => game.debugGive(n),
      hurt: (n: number) => game.debugHurt(n),
      revive: () => game.debugRevive(),
      setWave: (n: number) => game.debugSetWave(n),
      joy: (x: number, y: number) => game.setJoy(x, y),
      look: (dx: number, dy: number) => game.addLook(dx, dy),
    };
    const swing = () => {
      const w = weaponRef.current;
      if (!w) return;
      w.classList.remove('swing');
      void w.offsetWidth;
      w.classList.add('swing');
    };
    const kd = (e: KeyboardEvent) => {
      game.input[e.code] = true;
      if (e.code === 'Space' || e.code === 'KeyJ') { e.preventDefault(); swing(); }
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

  const onBustedShown = useRef(false);
  // плашка нового раунда: всплывает на каждую смену волны
  useEffect(() => {
    if (menu || hud.wave === prevWave.current) return;
    prevWave.current = hud.wave;
    setWaveBanner(hud.wave);
    const t = window.setTimeout(() => setWaveBanner(0), 2600);
    return () => window.clearTimeout(t);
  }, [hud.wave, menu]);
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

  const hpFrac = Math.max(0, hud.hp / hud.maxhp);
  const wname = WEAPONS.find((w) => w.id === hud.weapon)?.name ?? '👊 Кулаки';

  return (
    <>
      <canvas id="c" ref={canvasRef} />
      {!menu && (
        <div id="hud">
          <div id="hpWrap">
            <span>❤️ {hud.hp}/{hud.maxhp}</span>
            <div id="hpBar"><div id="hpFill" style={{ width: `${hpFrac * 100}%` }} /></div>
          </div>
          <div id="hudRow">🌊 Волна {hud.wave} · 👹 {hud.enemies} · 💀 {hud.kills} · 🏆 {hud.score}</div>
          <div id="hudRow2">🎟️ {hud.fantiki} · {wname}</div>
          <small id="hint">WASD — идти · клик по экрану — захват мыши · Пробел/J — удар · Shift — бег</small>
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
            onPointerDown={() => {
              gameRef.current?.attack();
              const w = weaponRef.current;
              if (w) { w.classList.remove('swing'); void w.offsetWidth; w.classList.add('swing'); }
            }}
          >
            👊<span>УДАР</span>
          </button>
          <div id="weapon" ref={weaponRef} className={hud.moving ? 'walk' : ''}><img src={WIMG[hud.weapon] ?? oruzh1Url} alt="оружие" /></div>
          {waveBanner > 0 && (
            <div id="waveBanner" key={waveBanner}>🌊 ВОЛНА {waveBanner}</div>
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
            <button className="wclose" onClick={() => setSetOpen(false)}>ЗАКРЫТЬ</button>
          </div>
        </div>
      )}
      {menu && (
        <div id="menu">
          <h1>👊 МТТ VI 💥</h1>
          <p>Арена МТТ от первого лица: машешься с волнами врагов, у каждого полоска HP.
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
          <button id="goBtn" onClick={go}>▶️ ПОГНАЛИ</button>
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
