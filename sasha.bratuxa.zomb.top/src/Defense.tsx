import { useEffect, useRef, useState } from 'react';
import { Coins, Heart, Home, Lock, Pause, Play, RotateCcw, Swords, Trophy, Waves } from 'lucide-react';
import {
  CARDS, CARD_GATES, MEDAL_GATES, PATH, TURRETS, WAVE_NAMES, applyCard, createGame, finishWave, offerCards,
  placeTurret, sellTurret, spawnWave, tick, type GameState,
} from './defense/engine';
import { TEX, DefenseTex, pixToDataUri, type TexName } from './defense/textures';
import { readBest, writeBest, type Best } from './defense/save';
import GameTop from './lib/GameTop';
import AccountBar from './lib/AccountBar';
import AdReward from './lib/AdReward';
import Ads from './lib/Ads';

/* Оборона штаба 42: canvas tower-defense на 10 волн.
   Вьюха только рисует и шлёт команды движку; симуляция — engine.ts. */

const CELL = 40;
const W = 9 * CELL;
const H = 9 * CELL;

const KIND_LABEL: Record<string, string> = { flood: 'Прожектор', cobalt: 'Кобальт', scarlet: 'Алый', tesla: 'Тесла' };
const CARD_ART: Record<string, TexName> = {
  rate: 'flood', dmg: 'cobalt', pierce: 'scarlet', repair: 'hq', pugs: 'pug', sale: 'sale',
  warhorn: 'pug', live: 'sale', barricade: 'hq', sabotage: 'scarlet',
};
const UNIT_COLOR: Record<string, string> = {
  zevaka: '#c9c9c9', zanuda: '#f0c040', sprinter: '#6bd5ff', director: '#E31E25',
  troll: '#9fd0ff', double: '#ffe9a3',
};
const TURRET_COLOR: Record<string, string> = { flood: '#ffd257', cobalt: '#2e8fff', scarlet: '#ff4d4d', tesla: '#2e8fff' };

/* Витрина пост-пула: что и после какой медали. */
const POOL: Array<{ n: string; d: string; need: number }> = [
  { n: 'Энллесс-режим', d: 'волны 11+ с директором каждую 5-ю', need: MEDAL_GATES.endless },
  { n: 'Тесла-прожектор', d: '400 монет, цепляет троих', need: MEDAL_GATES.tesla },
  { n: 'Тролль и Двойник', d: 'новые враги энллесса', need: MEDAL_GATES.troll },
  { n: 'Мопсий вой / Прямой эфир', d: 'карты поддержки', need: CARD_GATES.warhorn },
  { n: 'Баррикада / Саботаж', d: 'карты обороны', need: CARD_GATES.barricade },
  { n: 'Арсенал 42', d: '+15% урона всем турелям', need: MEDAL_GATES.arsenal },
];

/* Спрайты из textures.tsx: ленивый кэш Image; пока не загрузилось — fallback-фигуры. */
const imgCache = new Map<string, HTMLImageElement>();
function sprite(name: TexName): HTMLImageElement | null {
  let img = imgCache.get(name);
  if (!img) {
    img = new Image();
    img.src = pixToDataUri(TEX[name]);
    imgCache.set(name, img);
  }
  return img.complete && img.naturalWidth > 0 ? img : null;
}
/** Рисует спрайт центром в (cx,cy); вернёт false если картинка ещё не готова (рисуй fallback). */
function drawSprite(ctx: CanvasRenderingContext2D, name: TexName, cx: number, cy: number, size: number): boolean {
  const img = sprite(name);
  if (!img) return false;
  ctx.drawImage(img, cx - size / 2, cy - size / 2, size, size);
  return true;
}

function cellCenter(seg: number, pos: number): { x: number; y: number } {
  const a = PATH[Math.max(0, Math.min(seg, PATH.length - 1))];
  const b = PATH[Math.min(seg + 1, PATH.length - 1)];
  return { x: (a.x + (b.x - a.x) * pos) * CELL + CELL / 2, y: (a.y + (b.y - a.y) * pos) * CELL + CELL / 2 };
}

function draw(ctx: CanvasRenderingContext2D, g: GameState): void {
  ctx.imageSmoothingEnabled = false;
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
        drawSprite(ctx, 'hq', x * CELL + CELL / 2, y * CELL + CELL / 2, CELL - 2);
      }
    }
  }
  for (const t of g.turrets) {
    const cx = t.x * CELL + CELL / 2, cy = t.y * CELL + CELL / 2;
    if (drawSprite(ctx, (t.kind in TEX ? t.kind : 'flood') as TexName, cx, cy, CELL * 0.95)) continue;
    ctx.fillStyle = TURRET_COLOR[t.kind] ?? '#fff';
    ctx.beginPath();
    ctx.arc(cx, cy, CELL * 0.32, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#070b18';
    ctx.font = 'bold 11px system-ui,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((KIND_LABEL[t.kind] ?? t.kind).slice(0, 1), cx, cy + 1);
  }
  // Юниты: только живые (!dead) — трупы не рисуем
  for (const u of g.units) {
    if (u.dead) continue;
    const { x, y } = cellCenter(u.seg, Math.max(0, u.pos));
    const size = u.kind === 'director' ? CELL * 1.1 : u.kind === 'zanuda' ? CELL * 0.9 : CELL * 0.75;
    if (!drawSprite(ctx, (u.kind in TEX ? u.kind : 'zevaka') as TexName, x, y, size)) {
      ctx.fillStyle = UNIT_COLOR[u.kind] ?? '#fff';
      const r = u.kind === 'director' ? 10 : u.kind === 'zanuda' ? 7 : 5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const frac = Math.max(0, u.hp / u.maxHp);
    const hr = size / 2;
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(x - 10, y - hr - 7, 20, 3);
    ctx.fillStyle = frac > 0.5 ? '#37e05c' : '#E31E25';
    ctx.fillRect(x - 10, y - hr - 7, 20 * frac, 3);
  }
}

export default function Defense(): JSX.Element {
  const [g0] = useState<GameState>(() => {
    const g = createGame();
    try {
      g.medals = readBest(localStorage).medals;
    } catch { /* сейв не критичен */ }
    return g;
  });
  const gRef = useRef<GameState>(g0);
  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const [snap, setSnap] = useState<GameState>(() => ({ ...gRef.current }));
  const [kind, setKind] = useState('flood');
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const [cards, setCards] = useState<string[] | null>(null);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [best, setBest] = useState<Best>(() => readBest(localStorage));
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
        if (g.lives <= 0 || !g.units.some((u) => !u.dead)) break;
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
        if (g.wave > 9) {
          const waveNum = g.wave + 1;
          setBest((prev) => {
            const next = { ...prev, bestEndless: Math.max(prev.bestEndless, waveNum) };
            writeBest(localStorage, next);
            return next;
          });
        }
        return;
      }
      if (!g.units.some((u) => !u.dead)) {
        runRef.current = false;
        setRunning(false);
        const lostNow = Math.max(0, waveStartLives.current - g.lives);
        const total = lostRef.current + lostNow;
        lostRef.current = total;
        setTotalLost(total);
        if (g.wave === 9) {
          finishWave(g, total);
          setSnap({ ...g });
          endRef.current = true;
          setWon(true);
          const prev = readBest(localStorage);
          const next = {
            stars: Math.max(prev.stars, g.stars || 1), wave: 10,
            medals: prev.medals, bestEndless: prev.bestEndless,
          };
          writeBest(localStorage, next);
          setBest(next);
        } else if (g.wave > 9) {
          const waveNum = g.wave + 1;
          setBest((prev) => {
            const next = { ...prev, bestEndless: Math.max(prev.bestEndless, waveNum) };
            writeBest(localStorage, next);
            return next;
          });
          const offered = offerCards(g, g.medals);
          cardsRef.current = offered;
          setCards(offered);
        } else {
          const offered = offerCards(g, g.medals);
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

  // Первичная отрисовка (вход — CSS, без GSAP) + догрузка спрайтов с перерисовкой
  useEffect(() => {
    let alive = true;
    (Object.keys(TEX) as TexName[]).forEach((n) => {
      const img = new Image();
      img.onload = () => { if (alive) redraw(); };
      img.src = pixToDataUri(TEX[n]);
      imgCache.set(n, img);
    });
    redraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => { alive = false; };
  }, []);

  const startWave = () => {
    const g = gRef.current;
    if (g.over || won || lost || running || cards || g.units.some((u) => !u.dead)) return;
    if (g.wave >= 10 && g.medals < MEDAL_GATES.endless) return;
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
      if (kind === 'tesla' && g.medals < MEDAL_GATES.tesla) return;
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

  const restart = (medals?: number) => {
    const keep = medals ?? gRef.current.medals;
    gRef.current = createGame();
    gRef.current.medals = keep;
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

  /* Новая смена: медаль +1, рекорд энллесса в сейв, поле с нуля. */
  const newShift = () => {
    const g = gRef.current;
    if (g.wave < 9 || !won) return;
    const prev = readBest(localStorage);
    const next: Best = {
      stars: Math.max(prev.stars, g.stars || 0), wave: 10,
      medals: prev.medals + 1, bestEndless: prev.bestEndless,
    };
    writeBest(localStorage, next);
    setBest(next);
    setKind('flood');
    restart(next.medals);
  };

  /* Энллесс-рейд: та же смена идёт на волны 11+. */
  const goEndless = () => {
    const g = gRef.current;
    if (!won || g.wave !== 9 || g.medals < MEDAL_GATES.endless) return;
    g.wave = 10;
    setWon(false);
    endRef.current = false;
    waveStartLives.current = g.lives;
    spawnWave(g, g.wave);
    runRef.current = true;
    setRunning(true);
    redraw();
    setSnap({ ...g });
  };

  const g = snap;
  const endless = g.wave > 9;
  const waveTitle = endless ? `Энллесс ${g.wave + 1}` : `Волна ${g.wave + 1}: ${WAVE_NAMES[g.wave]}`;

  return (
    <main id="df-col">
      <p className="kicker">Саша ⁴² — <b>оборона штаба</b></p>
      <AccountBar />
      <AdReward game="defense" />
      <div id="df-hud">
        <div className="pill ghost"><Waves data-icon="inline-start" /> {waveTitle}</div>
        <div className={`pill ${g.lives <= 3 ? 'solid risk' : 'ghost'}`}><Heart data-icon="inline-start" /> {g.lives}</div>
        <div className="pill ghost"><Coins data-icon="inline-start" /> {g.coins}</div>
        {best.medals > 0 && <div className="pill ghost"><Trophy data-icon="inline-start" /> Медали: {best.medals}</div>}
        <button
          type="button"
          className="pill ghost"
          onClick={() => setPaused((p) => !p)}
          disabled={!running}
          aria-label={paused ? 'Продолжить' : 'Пауза'}
        >
          {paused ? <Play data-icon="inline-start" /> : <Pause data-icon="inline-start" />}
          {paused ? ' Вперёд' : ' Пауза'}
        </button>
      </div>
      <p className="mg-note">Рекорд энллесса: {best.bestEndless > 0 ? `волна ${best.bestEndless}` : '—'}</p>
      <GameTop game="defense" />

      <canvas
        ref={cvRef}
        id="df-field"
        width={W}
        height={H}
        onClick={onTap}
        role="img"
        aria-label="Поле обороны 9 на 9. Тап по клетке ставит турель, повторный тап продаёт."
      />

      {!running && !cards && !won && !lost && (
        <button type="button" id="df-wave" className="pill solid" onClick={startWave}>
          <Swords data-icon="inline-start" /> {endless ? `Энллесс ${g.wave + 1}!` : `Волна ${g.wave + 1}!`}
        </button>
      )}
      <div id="df-shop" role="group" aria-label="Выбор турели">
        {Object.entries(TURRETS).map(([id, t]) => {
          if (id === 'tesla' && best.medals < MEDAL_GATES.tesla) {
            return (
              <span key={id} className="pill ghost lock">
                <Lock data-icon="inline-start" size={14} /> Тесла — после {MEDAL_GATES.tesla}-й медали
              </span>
            );
          }
          return (
            <button
              key={id}
              type="button"
              className={`pill ${kind === id ? 'solid' : 'ghost'}`}
              onClick={() => setKind(id)}
              disabled={g.coins < t.cost}
            >
              <DefenseTex art={id as TexName} /> {KIND_LABEL[id] ?? id} · {t.cost}
            </button>
          );
        })}
      </div>
      <div id="df-pool" role="group" aria-label="Пост-пул смены">
        {POOL.map((p) => (
          <span key={p.n} className="pill ghost" title={p.d}>
            {best.medals >= p.need ? <Trophy data-icon="inline-start" size={14} /> : <Lock data-icon="inline-start" size={14} />}
            {' '}{p.n}{best.medals < p.need ? ` — после ${p.need}-й медали` : ''}
          </span>
        ))}
      </div>
      <p className="mg-note">Тап по клетке — поставить, тап по турели — продать за 70%. Тап по дороге не строит.</p>
      {paused && !won && !lost && <p className="mg-note">Пауза. Турели держат строй.</p>}

      {cards && (
        <div id="df-cards" role="dialog" aria-modal="true" aria-label="Выбор карты-баффа">
          <h2><Trophy data-icon="inline-start" /> Волна отбита! Бери карту</h2>
          <div id="df-cards-row">
            {cards.map((id) => (
              <button key={id} type="button" className="pill ghost df-card" onClick={() => pickCard(id)}>
                <DefenseTex art={CARD_ART[id] ?? 'flood'} /> <b>{CARDS[id]?.name ?? id}</b>
                <span>{CARDS[id]?.desc ?? ''}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {lost && (
        <div id="df-end" role="alert">
          <h2>Штаб захвачен скукой</h2>
          <p>Держались до {endless ? `энллесса ${g.wave + 1}` : `волны ${g.wave + 1} из 10`}. {best.stars > 0 && `Рекорд: ${best.stars} ★.`}{best.bestEndless > 0 && ` Энллесс-рекорд: волна ${best.bestEndless}.`}</p>
          <button type="button" className="pill solid" onClick={() => restart()}>
            <RotateCcw data-icon="inline-start" /> Ещё раз
          </button>
        </div>
      )}

      {won && (
        <div id="df-end" role="status">
          <h2>{'★'.repeat(Math.max(1, g.stars))} Мы уже победили</h2>
          <p>Штаб выстоял 10 волн, потеряно жизней: {totalLost}.</p>
          <button type="button" className="pill solid" onClick={newShift}>
            <Trophy data-icon="inline-start" /> Новая смена (медалей: {best.medals + 1})
          </button>
          {best.medals >= MEDAL_GATES.endless ? (
            <button type="button" className="pill solid" onClick={goEndless} style={{ marginLeft: 8 }}>
              <Swords data-icon="inline-start" /> Энллесс-рейд
            </button>
          ) : (
            <p className="mg-note">Энллесс-рейд — после 1-й медали.</p>
          )}
        </div>
      )}

      <a id="dfHome" className="pill ghost" href="./minigames.html">
        <Home data-icon="inline-start" /> К витрине
      </a>
      <Ads />
    </main>
  );
}
