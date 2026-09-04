import { useEffect, useMemo, useRef, useState } from 'react';
import { Api, Log, Num, parseStake } from './shared';
import { ItemIcon } from '../casino-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import './crash.css';

/* ЗАЛ «КРАШ» — ночной стартовый комплекс 42.
   Сцена: небо, звёзды, луна, город, площадка с башней, прожекторы,
   дым, телеметрия, лента истории точек. Правила святы. */

type Puff = { id: number; x: number; dx: number; size: number; delay: number };
let puffId = 0;

type Star = { x: number; y: number; s: number; d: number };
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

function Sky({ stars }: { stars: Star[] }): JSX.Element {
  return (
    <div className="sky" aria-hidden>
      {stars.map((st, i) => (
        <i key={i} className="star" style={{
          left: `${st.x}%`, top: `${st.y}%`, width: st.s, height: st.s,
          animationDelay: `${st.d}s`,
        }} />
      ))}
      <div className="moon" />
      <div className="cloud c1" />
      <div className="cloud c2" />
      <svg className="city" viewBox="0 0 400 60" preserveAspectRatio="none">
        <path d="M0,60 L0,38 L18,38 L18,26 L30,26 L30,38 L52,38 L52,18 L60,18 L60,10 L68,18 L76,18 L76,38 L104,38 L104,30 L124,30 L124,44 L150,44 L150,22 L170,22 L170,44 L200,44 L200,34 L226,34 L226,44 L258,44 L258,16 L268,16 L268,8 L278,16 L288,16 L288,44 L318,44 L318,30 L340,30 L340,44 L366,44 L366,26 L384,26 L384,44 L400,44 L400,60 Z" />
        <g className="win" fill="#ffd23f">
          {Array.from({ length: 26 }, (_, i) => (
            <rect key={i} x={8 + (i * 37) % 380} y={24 + ((i * 53) % 22)} width="4" height="5" opacity={0.25 + ((i * 29) % 60) / 100} />
          ))}
        </g>
      </svg>
    </div>
  );
}

function Pad({ height, live, dead }: { height: number; live: boolean; dead: boolean }): JSX.Element {
  return (
    <div className="pad" aria-hidden>
      <div className="beam b1" />
      <div className="beam b2" />
      <div className="tower">
        <i /><i /><i /><i />
        <span className="cab" />
      </div>
      <div className="ground" />
      <div className={`rocket${live ? ' fly' : ''}${dead ? ' gone' : ''}`}
        style={{ bottom: `calc(10% + ${height}% * 0.72)` }}>
        <ItemIcon name="rocket" />
        {live && <span className="flame" />}
      </div>
    </div>
  );
}

export default function Crash({ api }: { api: Api }): JSX.Element {
  const [bet, setBet] = useState('50');
  const [phase, setPhase] = useState<'idle' | 'live' | 'dead'>('idle');
  const [mult, setMult] = useState(1);
  const [hist, setHist] = useState<number[]>([]);
  const [best, setBest] = useState(1);
  const [puffs, setPuffs] = useState<Puff[]>([]);
  const st = useRef({ live: false, m: 1, stake: 0, raf: 0 });
  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const stars = useMemo(() => makeStars(70, 42), []);

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
    const ex = W - 20;
    const ey = H - 30 - Math.min(1, 1) * (H - 70);
    ctx.beginPath(); ctx.arc(ex, ey, 10, 0, Math.PI * 2); ctx.fill();
  };

  const start = (): void => {
    if (st.current.live) return;
    const stake = parseStake(bet, 10, api);
    if (stake === null) return;
    const r = Math.random();
    const point = r < 0.03 ? 1 : Math.max(1, (0.97 / (1 - r)) * 0.97 + 0.03);
    const s = st.current;
    s.live = true; s.m = 1; s.stake = stake;
    setMult(1); setPhase('live');
    setPuffs([]);
    api.say(`Ракета пошла! Жми «Забрать», пока не бахнуло`);
    const t0 = performance.now();
    const speed = api.reduced ? 0.9 : 0.32;
    const puffTimer = window.setInterval(() => {
      if (!st.current.live || api.reduced) return;
      const id = ++puffId;
      setPuffs(p => [...p.slice(-34), {
        id, x: 44 + Math.random() * 12, dx: (Math.random() - 0.5) * 60,
        size: 18 + Math.random() * 30, delay: 0,
      }]);
      window.setTimeout(() => setPuffs(p => p.filter(pp => pp.id !== id)), 1400);
    }, 160);
    const step = (t: number): void => {
      if (!s.live) return;
      s.m = Math.exp(((t - t0) / 1000) * speed);
      if (s.m >= point) {
        s.live = false;
        window.clearInterval(puffTimer);
        setMult(point); setPhase('dead');
        setBest(b => Math.max(b, point));
        setHist(h => [point, ...h].slice(0, 12));
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

  const cashOut = (): void => {
    const s = st.current;
    if (!s.live) return;
    s.live = false;
    cancelAnimationFrame(s.raf);
    const win = Math.floor(s.stake * s.m);
    api.credit(win);
    setPhase('idle'); setMult(1);
    setBest(b => Math.max(b, s.m));
    setHist(h => [s.m, ...h].slice(0, 12));
    draw(1, false);
    api.say(`Забрал ×${s.m.toFixed(2)}: +${win}!`, 'win');
  };

  useEffect(() => () => {
    st.current.live = false;
    cancelAnimationFrame(st.current.raf);
  }, []);
  useEffect(() => { draw(1, false); }, []);

  const live = phase === 'live';
  const dead = phase === 'dead';
  const height = Math.min(88, (mult - 1) * 26);
  const liveWin = Math.floor(st.current.stake * mult);
  const alt = Math.floor((mult - 1) * 1240);
  const vel = Math.floor(280 + mult * 320);

  return (
    <section className={`crash-hall${dead ? ' shake' : ''}`}>
      <div className="lamp-row">
        <span className="ses-best">Рекорд сессии <Num>×{best.toFixed(2)}</Num></span>
        <span className={`lamp ${phase}`}>
          {phase === 'idle' ? 'Ожидание' : phase === 'live' ? 'Полёт' : 'Крэш'}
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
          <Sky stars={stars} />
          <Pad height={height} live={live} dead={dead} />
          <div className="smoke">
            {puffs.map(p => (
              <i key={p.id} className="puff" style={{
                left: `${p.x}%`, ['--dx' as string]: `${p.dx}px`,
                width: p.size, height: p.size, animationDelay: `${p.delay}s`,
              }} />
            ))}
            {dead && <span className="boom" />}
          </div>
          <div className="tele">
            <div><span>Высота</span><b><Num>{alt}</Num> м</b></div>
            <div><span>Скорость</span><b><Num>{vel}</Num> м/с</b></div>
            <div><span>На борту</span><b><Num>{live ? st.current.stake : 0}</Num></b></div>
          </div>
        </div>
        <div className="console">
          <div className={dead ? 'mult dead' : 'mult'}><Num>×{mult.toFixed(2)}</Num></div>
          <canvas className="curve" ref={cvRef} />
          <div className="crow" style={{ marginTop: 12 }}>
            <Input value={bet} onChange={e => setBet(e.target.value)} inputMode="numeric" aria-label="Ставка на краш" />
            {!live
              ? <Button onClick={start}>Погнали <ItemIcon name="rocket" /></Button>
              : <Button variant="secondary" onClick={cashOut}>Забрать <Num>+{liveWin}</Num></Button>}
          </div>
          <div className="ladder-mini" aria-label="Ориентиры">
            {[2, 5, 10].map(x => (
              <span key={x} className={mult >= x ? 'hit' : ''}>×{x}</span>
            ))}
          </div>
          <p className="fine">Мгновенный крэш ×1.00 случается — это честные 3%. Телеметрия — игровая, считает от множителя.</p>
        </div>
      </div>
    </section>
  );
}
