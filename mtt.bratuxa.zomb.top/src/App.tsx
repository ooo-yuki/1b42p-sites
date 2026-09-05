import { useEffect, useRef, useState, useCallback } from 'react';
import { Game, type HudState } from './game/engine';
import oruzh1Url from './assets/oruzh1.png';
import oruzh2Url from './assets/oruzh2.png';

interface ScoreRow {
  nick: string;
  score: number;
  coins: number;
}

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

// маяк трекера
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
  const mmRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [menu, setMenu] = useState(true);
  const [hud, setHud] = useState<HudState>({ coins: 0, speed: 0, score: 0, stars: 0, nitro: 100, busted: false, inCar: true });
  const [scores, setScores] = useState<ScoreRow[]>([]);
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
    if (!menu || !canvasRef.current || !mmRef.current || gameRef.current) return;
    const game = new Game(canvasRef.current, mmRef.current, {
      onHud: (h) => setHud(h),
      onBusted: () => undefined,
    });
    gameRef.current = game;
    (window as unknown as { __mtt?: object }).__mtt = {
      drive: (s: boolean) => game.debugDrive(s),
      nitro: (s: boolean) => game.debugNitro(s),
      pos: () => game.debugPos(),
      nitroLeft: () => game.debugNitroLeft(),
    };
    const kd = (e: KeyboardEvent) => {
      game.input[e.code] = true;
      if (e.code === 'KeyE') game.toggleCar();
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

  const setFlag = useCallback((code: string, v: boolean) => {
    if (gameRef.current) gameRef.current.input[code] = v;
  }, []);

  const onBustedShown = useRef(false);
  useEffect(() => {
    if (hud.busted && !onBustedShown.current) {
      onBustedShown.current = true;
      submitScore(nick, hud.score, hud.coins);
      window.setTimeout(() => {
        onBustedShown.current = false;
        loadScores().then(setScores);
      }, 2400);
    }
  }, [hud.busted, hud.score, hud.coins, nick]);

  const isTouch = 'ontouchstart' in window;

  return (
    <>
      <canvas id="c" ref={canvasRef} />
      {!menu && (
        <div id="hud">
          🪙 {hud.coins} · 🚗 {hud.speed} км/ч<br />
          <span id="stars">{'★'.repeat(hud.stars)}{'☆'.repeat(5 - hud.stars)}</span> · 🏆 {hud.score}<br />
          <div id="nitroWrap"><div id="nitroBar" style={{ width: hud.nitro + '%' }} /></div>
          <small id="hint">WASD — ехать/идти · E — сесть/выйти · Space — ручник · Shift — НИТРО</small>
        </div>
      )}
      <canvas id="mm" width={140} height={140} ref={mmRef} style={{ display: menu ? 'none' : undefined }} />
      {!menu && (
        <div id="touch" style={{ display: isTouch ? 'flex' : 'none' }}>
          <div className="tgrp">
            <button className="tbtn" onPointerDown={() => setFlag('ArrowLeft', true)} onPointerUp={() => setFlag('ArrowLeft', false)} onPointerLeave={() => setFlag('ArrowLeft', false)}>◀</button>
            <button className="tbtn" onPointerDown={() => setFlag('ArrowRight', true)} onPointerUp={() => setFlag('ArrowRight', false)} onPointerLeave={() => setFlag('ArrowRight', false)}>▶</button>
          </div>
          <div className="tgrp">
            <button className="tbtn" onClick={() => gameRef.current?.toggleCar()}>E</button>
            <button className="tbtn" onPointerDown={() => setFlag('ShiftLeft', true)} onPointerUp={() => setFlag('ShiftLeft', false)} onPointerLeave={() => setFlag('ShiftLeft', false)}>🔥</button>
            <button className="tbtn" onPointerDown={() => setFlag('ArrowUp', true)} onPointerUp={() => setFlag('ArrowUp', false)} onPointerLeave={() => setFlag('ArrowUp', false)}>▲</button>
            <button className="tbtn" onPointerDown={() => setFlag('ArrowDown', true)} onPointerUp={() => setFlag('ArrowDown', false)} onPointerLeave={() => setFlag('ArrowDown', false)}>▼</button>
          </div>
        </div>
      )}
      {hud.busted && !menu && <div id="busted" style={{ display: 'flex' }}>ПОЙМАН! 👮</div>}
      {menu && (
        <div id="menu">
          <h1>🏎️ МТТ VI 💨</h1>
          <p>Личный ночной город МТТ с RTX-погодой: мокрый асфальт, неон, тени и фары.
            Угоняй тачку, жги нитро, собирай монеты — но не попадись копам!
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
                <li key={i}>{s.nick} — {s.score} 🏆 · {s.coins} 🪙</li>
              ))}</ol>
            </div>
          )}
        </div>
      )}
    </>
  );
}
