import { useEffect, useRef, useState } from 'react';
import { Api, Log, Num, parseStake } from './shared';
import { ItemIcon } from '../casino-icons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import './crash.css';

/* ЗАЛ «КРАШ» — ночной старт. Ракета уходит вверх, пока жив множитель.
   Правила святы: крэш-точка, формула и кд не менялись. */

export default function Crash({ api }: { api: Api }): JSX.Element {
  const [bet, setBet] = useState('50');
  const [phase, setPhase] = useState<'idle' | 'live' | 'dead'>('idle');
  const [mult, setMult] = useState(1);
  const st = useRef({ live: false, m: 1, stake: 0, raf: 0 });
  const cvRef = useRef<HTMLCanvasElement | null>(null);

  const draw = (m: number, dead: boolean): void => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const W = (cv.width = cv.clientWidth * 2);
    const H = (cv.height = 440);
    ctx.clearRect(0, 0, W, H);
    // сетка телеметрии
    ctx.strokeStyle = 'rgba(55,214,122,.14)';
    ctx.lineWidth = 2;
    for (let g = 1; g < 5; g++) {
      const y = (H / 5) * g;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    ctx.strokeStyle = dead ? '#ff3b3b' : '#37d67a';
    ctx.lineWidth = 6;
    ctx.shadowColor = dead ? 'rgba(255,59,59,.7)' : 'rgba(55,214,122,.7)';
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
    api.say(`Ракета пошла! Жми «Забрать», пока не бахнуло`);
    const t0 = performance.now();
    const speed = api.reduced ? 0.9 : 0.32;
    const step = (t: number): void => {
      if (!s.live) return;
      s.m = Math.exp(((t - t0) / 1000) * speed);
      if (s.m >= point) {
        s.live = false;
        setMult(point); setPhase('dead');
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

  return (
    <section className={`crash-hall${dead ? ' shake' : ''}`}>
      <div className="lamp-row">
        <span className={`lamp ${phase}`}>
          {phase === 'idle' ? 'Ожидание' : phase === 'live' ? 'Полёт' : 'Крэш'}
        </span>
      </div>
      <Log msg={api.msg} tone={api.tone} />
      <div className="ch-grid">
        <div className="pad" aria-hidden>
          {Array.from({ length: 24 }, (_, i) => (
            <i key={i} className="star" style={{
              left: `${(i * 41) % 100}%`, top: `${(i * 29) % 100}%`,
              animationDelay: `${(i % 7) * 0.4}s`,
            }} />
          ))}
          <div className="moon" />
          <div className="ground" />
          <div className={`rocket${live ? ' fly' : ''}`} style={{ bottom: `calc(12% + ${height}% * 0.7)` }}>
            <ItemIcon name="rocket" />
            {live && <span className="flame" />}
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
          <p className="fine">Мгновенный крэш ×1.00 случается — это честные 3%.</p>
        </div>
      </div>
    </section>
  );
}
