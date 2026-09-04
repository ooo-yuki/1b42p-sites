import { useEffect, useRef, useState } from 'react';
import { Cake, Dices, House, PartyPopper, Trophy, Users } from 'lucide-react';
import './style.css';
import './tw.out.css';

/* Промо-открытка: день рождения @tapo4ek_v2.
   Ночь DESIGN.md, палитра Саши, конфетти на canvas, иконки Lucide, ноль эмодзи. */

const CONFETTI = ['#0060AA', '#E31E25', '#FFFFFF', '#808080', '#4da3e0', '#ff7a7e'];

type Flake = { x: number; y: number; vx: number; vy: number; w: number; h: number; rot: number; vr: number; c: string };

function useConfetti(ref: React.RefObject<HTMLCanvasElement | null>): void {
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let flakes: Flake[] = [];
    const resize = (): void => {
      cv.width = Math.floor(window.innerWidth * window.devicePixelRatio);
      cv.height = Math.floor(window.innerHeight * window.devicePixelRatio);
    };
    const spawn = (): void => {
      const W = cv.width;
      flakes.push({
        x: Math.random() * W,
        y: -20,
        vx: (Math.random() - 0.5) * 1.2 * window.devicePixelRatio,
        vy: (1.5 + Math.random() * 2.5) * window.devicePixelRatio,
        w: (5 + Math.random() * 6) * window.devicePixelRatio,
        h: (8 + Math.random() * 8) * window.devicePixelRatio,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.15,
        c: CONFETTI[Math.floor(Math.random() * CONFETTI.length)],
      });
    };
    let tick = 0;
    const frame = (): void => {
      tick++;
      if (tick % 3 === 0 && flakes.length < 220) spawn();
      ctx.clearRect(0, 0, cv.width, cv.height);
      const H = cv.height;
      flakes = flakes.filter(f => f.y < H + 40);
      for (const f of flakes) {
        f.x += f.vx + Math.sin((f.y + tick * 8) / 90) * 0.6;
        f.y += f.vy;
        f.rot += f.vr;
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rot);
        ctx.fillStyle = f.c;
        ctx.fillRect(-f.w / 2, -f.h / 2, f.w, f.h);
        ctx.restore();
      }
      raf = requestAnimationFrame(frame);
    };
    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [ref]);
}

const WISHES = [
  'Пусть криты всегда заходят, а мимо — только чужие.',
  'Здоровья на 42 богатыря, фарта — на 42 рейда.',
  'Чтобы сальтуха получалась с первого раза. Мы уже победили.',
];

export default function Tapo4ek(): JSX.Element {
  const cvRef = useRef<HTMLCanvasElement | null>(null);
  useConfetti(cvRef);
  const [wish, setWish] = useState(0);
  return (
    <>
      <div id="sky" />
      <canvas id="cv" ref={cvRef} />
      <div id="veil" />
      <a id="homeBtn" href="index.html">
        <House data-icon="inline-start" /> Саша ⁴²
      </a>
      <main>
        <div className="gridcol">
          <div className="kicker">
            промо-открытка · <b>1Б42П</b>
          </div>
          <p className="sub" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Cake data-icon="inline-start" aria-hidden /> С днём рождения
          </p>
          <h1 className="mega" style={{ fontSize: 'min(13vw,120px)' }}>
            <span className="r fill">@tapo4ek_v2</span>
          </h1>
          <p className="sub">
            Тапочек, батальон поздравляет: живи бодро, играй дерзко,
            а счёт пусть всегда останавливается на <b>42</b>.
          </p>
          <p className="sub" aria-live="polite">
            <PartyPopper data-icon="inline-start" aria-hidden /> {WISHES[wish]}
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button type="button" className="pill solid" onClick={() => setWish(w => (w + 1) % WISHES.length)}>
              <PartyPopper data-icon="inline-start" /> Ещё пожелание
            </button>
            <a className="pill ghost" href="arena.html" style={{ textDecoration: 'none' }}>
              <Users data-icon="inline-start" /> Обмыть на арене
            </a>
            <a className="pill ghost" href="casino.html" style={{ textDecoration: 'none' }}>
              <Dices data-icon="inline-start" /> Казино
            </a>
            <a className="pill ghost" href="https://hub.bratuxa.zomb.top" style={{ textDecoration: 'none' }}>
              <Trophy data-icon="inline-start" /> Хаб
            </a>
          </div>
        </div>
      </main>
      <div id="hint">
        открытка от Саши ⁴² · мы уже победили
      </div>
    </>
  );
}
