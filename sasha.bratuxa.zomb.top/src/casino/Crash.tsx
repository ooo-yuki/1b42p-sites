import { useEffect, useMemo, useRef, useState } from 'react';
import { Api, Log, Num, parseStake } from './shared';
import { ItemIcon } from '../casino-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sfx } from './sound';
import './crash.css';

/* ЗАЛ «КРАШ» — ночной стартовый комплекс 42.
   Сцена: небо, звёзды, луна, облака, город, площадка с башней, заправщик,
   флаг, прожекторы, птицы, дым, телеметрия честных данных, лента истории.
   Системы: зажигание, статистика сессии, ачивки, торжество, звуки.
   Правила святы: формула точки, 3%, скорость, выплаты. */

type Phase = 'idle' | 'ignite' | 'live' | 'dead';
type Puff = { id: number; x: number; dx: number; size: number };
type Bird = { x: number; y: number; dur: number; delay: number; size: number };
type Star = { x: number; y: number; s: number; d: number };
type Stat = { flights: number; cashed: number; wonTotal: number; best: number; sum: number };
type AchId = 'first' | 'five' | 'ten' | 'pilot';

const STAT_KEY = 'sasha_crash_stats';
const ACH_KEY = 'sasha_crash_ach';
const PRESETS = [10, 50, 100, 500];
const ACH: Array<{ id: AchId; name: string; desc: string }> = [
  { id: 'first', name: 'Первый старт', desc: 'поднять ракету в небо' },
  { id: 'five', name: 'Стратосфера', desc: 'забрать на ×5 и выше' },
  { id: 'ten', name: 'Орбита', desc: 'забрать на ×10 и выше' },
  { id: 'pilot', name: 'Пилот', desc: '25 полётов за всё время' },
];

let puffId = 0;

function loadStat(): Stat {
  const d: Stat = { flights: 0, cashed: 0, wonTotal: 0, best: 1, sum: 0 };
  try {
    const o = JSON.parse(localStorage.getItem(STAT_KEY) || '{}') as Partial<Stat>;
    for (const k of Object.keys(d) as Array<keyof Stat>) {
      const v = o[k];
      if (typeof v === 'number' && isFinite(v) && v >= 0) d[k] = v;
    }
  } catch { /* чистая ведомость */ }
  return d;
}

function saveStat(s: Stat): void {
  try {
    localStorage.setItem(STAT_KEY, JSON.stringify(s));
  } catch { /* не влезло */ }
}

function loadAch(): AchId[] {
  try {
    const a = JSON.parse(localStorage.getItem(ACH_KEY) || '[]') as unknown;
    if (Array.isArray(a)) return a.filter((x): x is AchId => typeof x === 'string' && (ACH as Array<{ id: string }>).some(y => y.id === x));
  } catch { /* пустая полка */ }
  return [];
}

function makeStars(n: number, seed: number): Star[] {
  let s = seed;
  const rnd = (): number => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  return Array.from({ length: n }, () => ({
    x: rnd() * 100, y: rnd() * 62, s: 1 + rnd() * 2.4, d: rnd() * 3,
  }));
}

function makeBirds(): Bird[] {
  return [
    { x: -12, y: 12, dur: 31, delay: 2, size: 9 },
    { x: -20, y: 20, dur: 43, delay: 9, size: 7 },
    { x: -8, y: 8, dur: 37, delay: 17, size: 11 },
  ];
}

function Sky({ stars, birds }: { stars: Star[]; birds: Bird[] }): JSX.Element {
  return (
    <div className="sky" aria-hidden>
      {stars.map((st, i) => (
        <i key={i} className="star" style={{
          left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s,
          animationDelay: `${st.d}s`,
        }} />
      ))}
      <div className="moon" />
      <div className="moon-halo" />
      <div className="cloud c1" />
      <div className="cloud c2" />
      <div className="cloud c3" />
      {birds.map((b, i) => (
        <span key={i} className="bird" style={{
          top: `${b.y}%`, ['--dur' as string]: `${b.dur}s`,
          animationDelay: `${b.delay}s`, width: b.size * 2, height: b.size,
        }} />
      ))}
      <svg className="city" viewBox="0 0 400 60" preserveAspectRatio="none">
        <path d="M0,60 L0,38 L18,38 L18,26 L30,26 L30,38 L52,38 L52,18 L60,18 L60,10 L68,18 L76,18 L76,38 L104,38 L104,30 L124,30 L124,44 L150,44 L150,22 L170,22 L170,44 L200,44 L200,34 L226,34 L226,44 L258,44 L258,16 L268,16 L268,8 L278,16 L288,16 L288,44 L318,44 L318,30 L340,30 L340,44 L366,44 L366,26 L384,26 L384,44 L400,44 L400,60 Z" />
        <g className="win" fill="#ffd23f">
          {Array.from({ length: 26 }, (_, i) => (
            <rect key={i} x={8 + (i * 37) % 380} y={24 + ((i * 53) % 22)} width="4" height="5" opacity={0.25 + ((i * 29) % 60) / 100} />
          ))}
        </g>
        <g className="beacon" fill="#E31E25">
          <circle cx="64" cy="8" r="3" />
          <circle cx="273" cy="6" r="3" />
        </g>
      </svg>
    </div>
  );
}

function Pad({ height, live, dead, ignite }: { height: number; live: boolean; dead: boolean; ignite: boolean }): JSX.Element {
  return (
    <div className="pad" aria-hidden>
      <div className="beam b1" />
      <div className="beam b2" />
      <div className="fence">
        {Array.from({ length: 18 }, (_, i) => <i key={i} />)}
      </div>
      <div className="tower">
        <i /><i /><i /><i />
        <span className="cab" />
        <span className={`mast-light${ignite || live ? ' on' : ''}`} />
      </div>
      <div className="mast">
        {[0, 1, 2].map(i => (
          <span key={i} className={`mlamp${ignite ? ' hot' : ''}`} style={{ animationDelay: `${i * 0.22}s` }} />
        ))}
      </div>
      <div className="truck">
        <span className="tank" />
        <span className="cab2" />
        <span className="wheel w1" />
        <span className="wheel w2" />
        <span className="hose" />
      </div>
      <div className="flagpole">
        <span className="cloth42">42</span>
      </div>
      <div className="ground" />
      <div className="strip-lights">
        {Array.from({ length: 12 }, (_, i) => <i key={i} style={{ animationDelay: `${(i % 6) * 0.25}s` }} />)}
      </div>
      <div className={`rocket${live ? ' fly' : ''}${dead ? ' gone' : ''}${ignite ? ' shake2' : ''}`}
        style={{ bottom: `calc(10% + ${height}% * 0.72)` }}>
        <ItemIcon name="rocket" />
        {(live || ignite) && <span className="flame" />}
      </div>
    </div>
  );
}

export default function Crash({ api }: { api: Api }): JSX.Element {
  const [bet, setBet] = useState('50');
  const [phase, setPhase] = useState<Phase>('idle');
  const [mult, setMult] = useState(1);
  const [hist, setHist] = useState<number[]>([]);
  const [puffs, setPuffs] = useState<Puff[]>([]);
  const [stat, setStat] = useState<Stat>(() => loadStat());
  const [achs, setAchs] = useState<AchId[]>(() => loadAch());
  const [toast, setToast] = useState('');
  const [party, setParty] = useState(0);
  const [miles, setMiles] = useState<number[]>([]);
  const st = useRef({ live: false, m: 1, stake: 0, raf: 0, puffTimer: 0 });
  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const stars = useMemo(() => makeStars(70, 42), []);
  const birds = useMemo(() => makeBirds(), []);
  const toastTimer = useRef(0);

  const draw = (m: number, dead: boolean): void => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const W = (cv.width = cv.clientWidth * 2);
    const H = (cv.height = 440);
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(55,214,122,.14)';
    ctx.lineWidth = 2;
    for (let g = 1; g < 5; g++) {
      const y = (H / 5) * g;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(232,237,255,.45)';
    ctx.font = '22px sans-serif';
    for (let g = 1; g < 5; g++) {
      ctx.fillText(`×${(1 + (m - 1) * (1 - g / 5)).toFixed(1)}`, 10, (H / 5) * g - 8);
    }
    ctx.strokeStyle = dead ? '#E31E25' : '#37d67a';
    ctx.lineWidth = 6;
    ctx.shadowColor = dead ? 'rgba(227,30,37,.7)' : 'rgba(55,214,122,.7)';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    const pts = 60;
    for (let i = 0; i <= pts; i++) {
      const t = i / pts;
      const mm = 1 + (m - 1) * t;
      const x = 20 + t * (W - 40);
      const y = H - 30 - Math.min(1, (mm - 1) / Math.max(0.01, m - 1 || 1)) * (H - 70);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = dead ? '#E31E25' : '#37d67a';
    ctx.beginPath(); ctx.arc(W - 20, H - 30 - Math.min(1, 1) * (H - 70), 10, 0, Math.PI * 2); ctx.fill();
  };

  const showToast = (t: string): void => {
    setToast(t);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(''), 2600);
  };

  const unlock = (id: AchId, cur: AchId[]): AchId[] => {
    if (cur.includes(id)) return cur;
    const a = ACH.find(x => x.id === id);
    if (a) {
      showToast(`Ачивка: ${a.name} — ${a.desc}`);
      sfx.reveal();
    }
    const next = [...cur, id];
    try {
      localStorage.setItem(ACH_KEY, JSON.stringify(next));
    } catch { /* полка забита */ }
    return next;
  };

  const bumpStat = (fn: (s: Stat) => Stat): void => {
    setStat(prev => {
      const next = fn(prev);
      saveStat(next);
      return next;
    });
  };

  const beginFlight = (stake: number, point: number): void => {
    const s = st.current;
    s.live = true; s.m = 1; s.stake = stake;
    setMult(1); setPhase('live'); setMiles([]);
    sfx.rumble(2.2);
    api.say(`Ракета пошла! Жми «Забрать», пока не бахнуло`);
    const t0 = performance.now();
    const speed = api.reduced ? 0.9 : 0.32;
    const hitMiles = new Set<number>();
    s.puffTimer = window.setInterval(() => {
      if (!st.current.live || api.reduced) return;
      const id = ++puffId;
      setPuffs(p => [...p.slice(-34), {
        id, x: 44 + Math.random() * 12, dx: (Math.random() - 0.5) * 60,
        size: 18 + Math.random() * 30,
      }]);
      window.setTimeout(() => setPuffs(p => p.filter(pp => pp.id !== id)), 1400);
    }, 160);
    const step = (t: number): void => {
      if (!s.live) return;
      s.m = Math.exp(((t - t0) / 1000) * speed);
      for (const ms of [2, 5, 10]) {
        if (s.m >= ms && !hitMiles.has(ms)) {
          hitMiles.add(ms);
          setMiles(Array.from(hitMiles));
          sfx.tick();
        }
      }
      if (s.m >= point) {
        s.live = false;
        window.clearInterval(s.puffTimer);
        setMult(point); setPhase('dead');
        setHist(h => [point, ...h].slice(0, 12));
        bumpStat(prev => ({
          flights: prev.flights + 1,
          cashed: prev.cashed,
          wonTotal: prev.wonTotal,
          best: Math.max(prev.best, point),
          sum: prev.sum + point,
        }));
        sfx.boom();
        draw(point, true);
        api.say(`Крэш на ×${point.toFixed(2)}! Минус ${stake}.`, 'lose');
        return;
      }
      setMult(s.m);
      draw(s.m, false);
      s.raf = requestAnimationFrame(step);
    };
    s.raf = requestAnimationFrame(step);
  };

  const start = (): void => {
    if (st.current.live || phase === 'ignite') return;
    const stake = parseStake(bet, 10, api);
    if (stake === null) return;
    const r = Math.random();
    const point = r < 0.03 ? 1 : Math.max(1, (0.97 / (1 - r)) * 0.97 + 0.03);
    setPhase('ignite');
    sfx.click();
    api.say(`Зажигание… ракета уже дрожит`);
    window.setTimeout(() => beginFlight(stake, point), api.reduced ? 150 : 900);
  };

  const cashOut = (): void => {
    const s = st.current;
    if (!s.live) return;
    s.live = false;
    cancelAnimationFrame(s.raf);
    window.clearInterval(s.puffTimer);
    const win = Math.floor(s.stake * s.m);
    const m = s.m;
    api.credit(win);
    setPhase('idle'); setMult(1);
    setHist(h => [m, ...h].slice(0, 12));
    setAchs(prev => {
      let next = unlock('first', prev);
      if (m >= 10) next = unlock('ten', next);
      else if (m >= 5) next = unlock('five', next);
      return next;
    });
    bumpStat(prev => {
      const flights = prev.flights + 1;
      const next = {
        flights,
        cashed: prev.cashed + 1,
        wonTotal: prev.wonTotal + win,
        best: Math.max(prev.best, m),
        sum: prev.sum + m,
      };
      if (flights >= 25) {
        setAchs(prevA => unlock('pilot', prevA));
      }
      return next;
    });
    if (m >= 5) {
      setParty(win);
      sfx.bigwin();
      window.setTimeout(() => setParty(0), 2600);
    } else {
      sfx.win();
    }
    draw(1, false);
    api.say(`Забрал ×${m.toFixed(2)}: +${win}!`, 'win');
  };

  useEffect(() => () => {
    st.current.live = false;
    cancelAnimationFrame(st.current.raf);
    window.clearInterval(st.current.puffTimer);
    window.clearTimeout(toastTimer.current);
  }, []);
  useEffect(() => { draw(1, false); }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
      if (e.code !== 'Space') return;
      e.preventDefault();
      if (st.current.live) cashOut();
      else start();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const live = phase === 'live';
  const dead = phase === 'dead';
  const ignite = phase === 'ignite';
  const height = Math.min(88, (mult - 1) * 26);
  const liveWin = Math.floor(st.current.stake * mult);
  const avg = stat.flights > 0 ? stat.sum / stat.flights : 0;

  return (
    <section className={`crash-hall${dead ? ' shake' : ''}`}>
      <div className="lamp-row">
        <span className="ses-best">Рекорд сессии <Num>×{Math.max(stat.best, 1).toFixed(2)}</Num></span>
        <span className={`lamp ${phase}`}>
          {phase === 'idle' && 'Ожидание'}
          {phase === 'ignite' && 'Зажигание'}
          {phase === 'live' && 'Полёт'}
          {phase === 'dead' && 'Крэш'}
        </span>
      </div>
      <Log msg={api.msg} tone={api.tone} />
      <div className="hist" aria-label="Последние точки">
        {hist.length === 0 && <span className="hist-empty">точек пока нет — лети первым</span>}
        {hist.map((p, i) => (
          <span key={`${i}-${p}`} className={`chip${p >= 10 ? ' gold' : p >= 2 ? ' good' : ' bad'}`}>
            ×<Num>{p.toFixed(2)}</Num>
          </span>
        ))}
      </div>
      <div className="ch-grid">
        <div className="scene">
          <Sky stars={stars} birds={birds} />
          <Pad height={height} live={live} dead={dead} ignite={ignite} />
          <div className="smoke">
            {puffs.map(p => (
              <i key={p.id} className="puff" style={{
                left: `${p.x}%`, ['--dx' as string]: `${p.dx}px`,
                width: p.size, height: p.size,
              }} />
            ))}
            {dead && <span className="boom" />}
            {ignite && <span className="preburn" />}
          </div>
          {party > 0 && (
            <div className="party" role="status">
              <span className="rays" />
              <b>+<Num>{party}</Num></b>
              <small>красивый забор!</small>
            </div>
          )}
          {toast && <div className="ach-toast" role="status">{toast}</div>}
        </div>
        <div className="console">
          <div className={dead ? 'mult dead' : 'mult'}><Num>×{mult.toFixed(2)}</Num></div>
          <canvas className="curve" ref={cvRef} />
          <div className="presets" role="group" aria-label="Быстрая ставка">
            {PRESETS.map(p => (
              <button key={p} className={bet === String(p) ? 'sel' : ''} onClick={() => { setBet(String(p)); sfx.click(); }}>
                {p}
              </button>
            ))}
          </div>
          <div className="crow" style={{ marginTop: 10 }}>
            <Input value={bet} onChange={e => setBet(e.target.value)} inputMode="numeric" aria-label="Ставка на краш" />
            {!live && !ignite
              ? <Button onClick={start}>Погнали <ItemIcon name="rocket" /></Button>
              : <Button variant="secondary" disabled={!live} onClick={cashOut}>
                  {ignite ? 'Зажигание…' : <>Забрать <Num>+{liveWin}</Num></>}
                </Button>}
          </div>
          <div className="ladder-mini" aria-label="Ориентиры">
            {[2, 5, 10].map(x => (
              <span key={x} className={miles.includes(x) || mult >= x ? 'hit' : ''}>×{x}</span>
            ))}
          </div>
          <dl className="statbook">
            <div><dt>Полётов</dt><dd><Num>{stat.flights}</Num></dd></div>
            <div><dt>Забрано</dt><dd><Num>{stat.cashed}</Num></dd></div>
            <div><dt>Выиграно всего</dt><dd><Num>{stat.wonTotal}</Num></dd></div>
            <div><dt>Средняя точка</dt><dd>×<Num>{avg.toFixed(2)}</Num></dd></div>
          </dl>
          <div className="ach-row" aria-label="Ачивки">
            {ACH.map(a => (
              <span key={a.id} title={`${a.name} — ${a.desc}`}
                className={`medal${achs.includes(a.id) ? ' got' : ''}`}>
                {a.name}
              </span>
            ))}
          </div>
          <p className="fine">Мгновенный крэш ×1.00 случается — это честные 3%. Пробел — старт и забор. Статистика и ачивки живут в твоём браузере.</p>
        </div>
      </div>
    </section>
  );
}
