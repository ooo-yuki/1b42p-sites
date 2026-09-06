import { useEffect, useRef, useState } from 'react';
import { Coins, Heart, Home, Pause, Play, RotateCcw, Shield, Swords, Trophy, Waves } from 'lucide-react';
import {
  CARDS, PATH, TURRETS, applyCard, createGame, finishWave, offerCards,
  placeTurret, sellTurret, spawnWave, tick, type GameState,
} from './defense/engine';

/* Оборона штаба 42: canvas tower-defense на 10 волн.
   Вьюха только рисует и шлёт команды движку; симуляция — engine.ts. */

const SAVE_KEY = 'sasha_def42_v1';
const CELL = 40;
const W = 9 * CELL;
const H = 9 * CELL;

const KIND_LABEL: Record<string, string> = { flood: 'Прожектор', cobalt: 'Кобальт', scarlet: 'Алый' };
const UNIT_COLOR: Record<string, string> = {
  zevaka: '#c9c9c9', zanuda: '#f0c040', sprinter: '#6bd5ff', director: '#E31E25',
};
const TURRET_COLOR: Record<string, string> = { flood: '#ffd257', cobalt: '#2e8fff', scarlet: '#ff4d4d' };

type Best = { stars: number; wave: number };

function readBest(): Best {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { stars: 0, wave: 0 };
    const p = JSON.parse(raw) as Partial<Best>;
    return { stars: Number(p.stars) || 0, wave: Number(p.wave) || 0 };
  } catch {
    return { stars: 0, wave: 0 };
  }
}

function cellCenter(seg: number, pos: number): { x: number; y: number } {
  const a = PATH[Math.max(0, Math.min(seg, PATH.length - 1))];
  const b = PATH[Math.min(seg + 1, PATH.length - 1)];
  return { x: (a.x + (b.x - a.x) * pos) * CELL + CELL / 2, y: (a.y + (b.y - a.y) * pos) * CELL + CELL / 2 };
}

function draw(ctx: CanvasRenderingContext2D, g: GameState): void {
  ctx.fillStyle = '#070b18';
  ctx.fillRect(0, 0, W, H);
  const pathSet = new Set(PATH.map((c) => `${c.x},${c.y}`));
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      const onPath = pathSet.has(`${x},${y}`);
      const hq = x === 8 && y === 8;
      ctx.fillStyle = hq ? '#12305e' : onPath ? '#16213c' : '#0b1226';
      ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2);
      if (hq) {
        ctx.fillStyle = '#2e8fff';
        ctx.font = 'bold 20px system-ui,sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('42', x * CELL + CELL / 2, y * CELL + CELL / 2);
      }
    }
  }
  for (const t of g.turrets) {
    ctx.fillStyle = TURRET_COLOR[t.kind] ?? '#fff';
    ctx.beginPath();
    ctx.arc(t.x * CELL + CELL / 2, t.y * CELL + CELL / 2, CELL * 0.32, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#070b18';
    ctx.font = 'bold 11px system-ui,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((KIND_LABEL[t.kind] ?? t.kind).slice(0, 1), t.x * CELL + CELL / 2, t.y * CELL + CELL / 2 + 1);
  }
  // Юниты: только живые (!dead) — трупы не рисуем
  for (const u of g.units) {
    if (u.dead) continue;
    const { x, y } = cellCenter(u.seg, Math.max(0, u.pos));
    ctx.fillStyle = UNIT_COLOR[u.kind] ?? '#fff';
    const r = u.kind === 'director' ? 10 : u.kind === 'zanuda' ? 7 : 5;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    const frac = Math.max(0, u.hp / u.maxHp);
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(x - 10, y - r - 7, 20, 3);
    ctx.fillStyle = frac > 0.5 ? '#37e05c' : '#E31E25';
    ctx.fillRect(x - 10, y - r - 7, 20 * frac, 3);
  }
}

export default function Defense(): JSX.Element {
  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const gRef = useRef<GameState>(createGame());
  const [snap, setSnap] = useState<GameState>(() => ({ ...gRef.current }));
  const [kind, setKind] = useState('flood');
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [cards, setCards] = useState<string[] | null>(null);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [best, setBest] = useState<Best>(readBest);
  const [totalLost, setTotalLost] = useState(0);
  const waveStartLives = useRef(10);

  // Живые флаги для rAF-замыкания
  const runRef = useRef(false);
  runRef.current = running;
  const pauseRef = useRef(false);
  pauseRef.current = paused;
  const cardsRef = useRef<string[] | null>(null);
  cardsRef.current = cards;
  const endRef = useRef(false);
  endRef.current = won || lost;
  const lostRef = useRef(0);
  lostRef.current = totalLost;

  const redraw = () => {
    const ctx = cvRef.current?.getContext('2d');
    if (ctx) draw(ctx, gRef.current);
  };

  // Игровой цикл: requestAnimationFrame, tick движка каждые 100мс
  useEffect(() => {
    let raf = 0;
    let acc = 0;
    let last = performance.now();
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = now - last;
      last = now;
      if (pauseRef.current || !runRef.current || cardsRef.current || endRef.current) {
        acc = 0;
        return;
      }
      const g = gRef.current;
      acc += dt;
      let stepped = false;
      while (acc >= 100) {
        acc -= 100;
        tick(g);
        stepped = true;
        if (g.lives <= 0 || g.units.length === 0) break;
      }
      if (!stepped) return;
      const ctx = cvRef.current?.getContext('2d');
      if (ctx) draw(ctx, g);
      setSnap({ ...g });
      if (g.lives <= 0) {
        g.over = true;
        runRef.current = false;
        setRunning(false);
        setLost(true);
        return;
      }
      if (g.units.length === 0) {
        runRef.current = false;
        setRunning(false);
        const lostNow = Math.max(0, waveStartLives.current - g.lives);
        const total = lostRef.current + lostNow;
        lostRef.current = total;
        setTotalLost(total);
        if (g.wave >= 9) {
          finishWave(g, total);
          setSnap({ ...g });
          endRef.current = true;
          setWon(true);
          try {
            const prev = readBest();
            localStorage.setItem(SAVE_KEY, JSON.stringify({ stars: Math.max(prev.stars, g.stars || 1), wave: 10 }));
          } catch { /* сейв не критичен */ }
          setBest(readBest());
        } else {
          const offered = offerCards(g);
          cardsRef.current = offered;
          setCards(offered);
        }
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Пауза при сворачивании вкладки
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) setPaused(true);
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  // Первичная отрисовка (вход — CSS, без GSAP)
  useEffect(() => {
    redraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startWave = () => {
    const g = gRef.current;
    if (g.over || won || lost || running || cards || g.units.length > 0) return;
    waveStartLives.current = g.lives;
    spawnWave(g, g.wave);
    runRef.current = true;
    setRunning(true);
    redraw();
    setSnap({ ...g });
  };

  const onTap = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const g = gRef.current;
    if (g.over || won || lost || running || cards || paused) return;
    const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * 9);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * 9);
    if (x < 0 || x > 8 || y < 0 || y > 8) return;
    const idx = g.turrets.findIndex((t) => t.x === x && t.y === y);
    if (idx >= 0) {
      sellTurret(g, idx);
    } else {
      placeTurret(g, x, y, kind);
    }
    redraw();
    setSnap({ ...g });
  };

  const pickCard = (id: string) => {
    const g = gRef.current;
    applyCard(g, id);
    g.wave += 1;
    cardsRef.current = null;
    setCards(null);
    setSnap({ ...g });
  };

  const restart = () => {
    gRef.current = createGame();
    waveStartLives.current = 10;
    runRef.current = false;
    cardsRef.current = null;
    endRef.current = false;
    lostRef.current = 0;
    setSnap({ ...gRef.current });
    setRunning(false);
    setCards(null);
    setWon(false);
    setLost(false);
    setTotalLost(0);
    setPaused(false);
    redraw();
  };

  const g = snap;
  const waveLabel = Math.min(g.wave + 1, 10);

  return (
    <main id="df-col">
      <p className="kicker">Саша ⁴² — <b>оборона штаба</b></p>
      <div id="df-hud">
        <div className="pill ghost"><Waves data-icon="inline-start" /> {waveLabel}/10</div>
        <div className={`pill ${g.lives <= 3 ? 'solid risk' : 'ghost'}`}><Heart data-icon="inline-start" /> {g.lives}</div>
        <div className="pill ghost"><Coins data-icon="inline-start" /> {g.coins}</div>
        <button
          type="button"
          className="pill ghost"
          onClick={() => setPaused((p) => !p)}
          aria-label={paused ? 'Продолжить' : 'Пауза'}
        >
          {paused ? <Play data-icon="inline-start" /> : <Pause data-icon="inline-start" />}
          {paused ? ' Вперёд' : ' Пауза'}
        </button>
      </div>

      <canvas
        ref={cvRef}
        id="df-field"
        width={W}
        height={H}
        onClick={onTap}
        role="img"
        aria-label="Поле обороны 9 на 9. Тап по клетке ставит турель, повторный тап продаёт."
      />

      <div id="df-shop" role="group" aria-label="Выбор турели">
        {Object.entries(TURRETS).map(([id, t]) => (
          <button
            key={id}
            type="button"
            className={`pill ${kind === id ? 'solid' : 'ghost'}`}
            onClick={() => setKind(id)}
            disabled={g.coins < t.cost}
          >
            {KIND_LABEL[id] ?? id} · {t.cost}
          </button>
        ))}
      </div>
      <p className="mg-note">Тап по клетке — поставить, тап по турели — продать за 70%. Тап по дороге не строит.</p>

      {!running && !cards && !won && !lost && (
        <button type="button" id="df-wave" className="pill solid" onClick={startWave}>
          <Swords data-icon="inline-start" /> Волна {waveLabel}!
        </button>
      )}
      {paused && !won && !lost && <p className="mg-note">Пауза. Турели держат строй.</p>}

      {cards && (
        <div id="df-cards" role="dialog" aria-modal="true" aria-label="Выбор карты-баффа">
          <h2><Trophy data-icon="inline-start" /> Волна отбита! Бери карту</h2>
          <div id="df-cards-row">
            {cards.map((id) => (
              <button key={id} type="button" className="pill ghost df-card" onClick={() => pickCard(id)}>
                <Shield data-icon="inline-start" /> <b>{CARDS[id]?.name ?? id}</b>
                <span>{CARDS[id]?.desc ?? ''}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {lost && (
        <div id="df-end" role="alert">
          <h2>Штаб захвачен скукой</h2>
          <p>Держались до волны {waveLabel} из 10. {best.stars > 0 && `Рекорд: ${best.stars} ★.`}</p>
          <button type="button" className="pill solid" onClick={restart}>
            <RotateCcw data-icon="inline-start" /> Ещё раз
          </button>
        </div>
      )}

      {won && (
        <div id="df-end" role="status">
          <h2>{'★'.repeat(Math.max(1, g.stars))} Мы уже победили</h2>
          <p>Штаб выстоял 10 волн, потеряно жизней: {totalLost}.</p>
          <button type="button" className="pill solid" onClick={restart}>
            <RotateCcw data-icon="inline-start" /> Ещё раз
          </button>
        </div>
      )}

      <a id="dfHome" className="pill ghost" href="./minigames.html">
        <Home data-icon="inline-start" /> К витрине
      </a>
    </main>
  );
}
