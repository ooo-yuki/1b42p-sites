import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ItemIcon } from '../../casino-icons';
import { Num } from '../shared';
import type { Drop } from './data';
import { Button } from '@/components/ui/button';
import './pedestal.css';

/* Пьедестал: count-up суммы, печать окупаемости, конфетти-пушка. */

type Props = {
  win: Drop;
  price: number;
  reduced: boolean;
  onAgain: () => void;
};

const CONFETTI = ['#0060AA', '#E31E25', '#FFFFFF', '#808080', '#2f9e44', '#004578'];

function useCountUp(target: number, dur = 900): number {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number): void => {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      const next = Math.round(target * e);
      setV(prev => (prev === next ? prev : next));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, dur]);
  return v;
}

export default function Pedestal({ win, price, reduced, onAgain }: Props): JSX.Element {
  const shown = useCountUp(win.amount);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stampRef = useRef<HTMLDivElement | null>(null);
  const profit = win.amount - price;
  const ok = profit >= 0;
  const mult = (win.amount / price).toFixed(win.amount >= price * 5 ? 1 : 2);

  useEffect(() => {
    if (stampRef.current && !reduced) {
      const tw = gsap.fromTo(stampRef.current, { scale: 2.4, rotate: -14, autoAlpha: 0 },
        { scale: 1, rotate: -8, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.6)', delay: 0.35, overwrite: 'auto' });
      return () => { tw.kill(); };
    }
    return undefined;
  }, [win, reduced]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || reduced) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = (cv.width = 520 * dpr);
    const H = (cv.height = 160 * dpr);
    const g = cv.getContext('2d');
    if (!g) return;
    g.scale(dpr, dpr);
    type P = { x: number; y: number; vx: number; vy: number; s: number; r: number; vr: number; c: string };
    const ps: P[] = Array.from({ length: 110 }, (_, i) => ({
      x: 260 + (Math.random() - 0.5) * 60,
      y: 80 + (Math.random() - 0.5) * 20,
      vx: (Math.random() - 0.5) * 9,
      vy: -3 - Math.random() * 6,
      s: 3 + Math.random() * 5,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      c: CONFETTI[i % CONFETTI.length],
    }));
    let raf = 0;
    const t0 = performance.now();
    const step = (t: number): void => {
      const life = (t - t0) / 1600;
      if (life >= 1) { g.clearRect(0, 0, 520, 160); return; }
      g.clearRect(0, 0, 520, 160);
      for (const p of ps) {
        p.x += p.vx; p.y += p.vy; p.vy += 0.22; p.r += p.vr;
        g.save();
        g.translate(p.x, p.y);
        g.rotate(p.r);
        g.globalAlpha = 1 - life;
        g.fillStyle = p.c;
        g.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
        g.restore();
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [win, reduced]);

  return (
    <div className={`pedestal${ok ? ' ok' : ' miss'}`} role="status">
      <div className="rays" aria-hidden="true" />
      <canvas ref={canvasRef} className="boom-canvas" width={520} height={160} aria-hidden="true" />
      <span className="p-art"><ItemIcon name={win.icon} /></span>
      <div className="p-body">
        <b>{win.label}</b>
        <span className="p-amount">+<Num>{shown}</Num> фишек</span>
        <span className="p-mult">×{mult} от цены сейфа</span>
      </div>
      <div ref={stampRef} className={`stamp${reduced ? ' still' : ''}`}>
        {ok ? `В ПЛЮСЕ +${profit}` : 'БЫВАЕТ'}
      </div>
      <Button size="sm" className="again" onClick={onAgain}>Открыть ещё</Button>
    </div>
  );
}
