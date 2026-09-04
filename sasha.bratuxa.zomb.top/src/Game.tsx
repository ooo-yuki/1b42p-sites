import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useRain, useIntro, useBeacon, domRing, pulseScore } from './hooks';
import { launchRocket } from './lib/rocket';
import saltoSticker from './salto-sticker.jpg';

function popSalto(x: number, y: number): void {
  if (reduced) return;
  const el = document.getElementById('salto-pop');
  if (!el) return;
  gsap.killTweensOf(el);
  gsap.set(el, { x, y, scale: 0.4, rotation: -30, autoAlpha: 1 });
  gsap.to(el, { scale: 1.15, rotation: 360, duration: 0.55, ease: 'back.out(1.4)' });
  gsap.to(el, { autoAlpha: 0, y: '-=40', duration: 0.4, delay: 0.55, ease: 'power2.in' });
}

const GOAL = 42 * 42;
const reduced =
  typeof matchMedia !== 'undefined' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function Game(): JSX.Element {
  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const r3dRef = useRef<HTMLCanvasElement | null>(null);
  const flashRef = useRef<HTMLDivElement | null>(null);
  const rainRef = useRain(cvRef);
  useIntro();
  useBeacon();
  const [score, setScore] = useState(0);
  const [secret, setSecret] = useState(false);
  const scoreRef = useRef(0);
  scoreRef.current = score;

  const showSecret = useCallback(() => {
    setSecret(true);
    if (!reduced) {
      requestAnimationFrame(() => {
        gsap.fromTo(
          '#secret .big',
          { scale: 0.4, rotation: -12, autoAlpha: 0 },
          { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.8, ease: 'back.out(1.6)' },
        );
        gsap.fromTo(
          '#secret h2',
          { y: 26, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.5, delay: 0.25, ease: 'power2.out' },
        );
      });
    }
  }, []);

  const fireRocket = useCallback(
    (x: number, y: number) => {
      if (reduced || !r3dRef.current || !flashRef.current) {
        showSecret();
        return;
      }
      void launchRocket(x, y, {
        canvas: r3dRef.current,
        flash: flashRef.current,
        domRing: () => domRing(window.innerWidth / 2, window.innerHeight / 2),
      }).then(() => showSecret());
    },
    [showSecret],
  );

  const burst = useCallback(
    (x: number, y: number) => {
      if (reduced) return;
      rainRef.current?.burst(x, y);
      const next = scoreRef.current + 42;
      scoreRef.current = next;
      setScore(next);
      pulseScore('#score');
      domRing(x, y);
      if (next % (42 * 5) === 0) popSalto(x, y);
      if (next >= GOAL) fireRocket(x, y);
    },
    [fireRocket, rainRef],
  );

  const deposit = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (reduced) {
        scoreRef.current += 42000;
        setScore(scoreRef.current);
        showSecret();
        return;
      }
      let raw: string | null = null;
      try {
        raw = prompt('Сколько депнешь? Впиши ВСЮ зарплату:', '42000');
      } catch {
        raw = null;
      }
      if (raw === null) return;
      let amt = Math.floor(Number(String(raw).replace(/\s/g, '')));
      if (!isFinite(amt) || amt < 1) amt = 42;
      amt = Math.min(amt, 999999999);
      const next = scoreRef.current + amt;
      scoreRef.current = next;
      setScore(next);
      gsap.fromTo('#depBtn', { scale: 1 }, { scale: 1.15, duration: 0.14, yoyo: true, repeat: 1, ease: 'power2.out' });
      const b = document.getElementById('depBtn');
      const r = b?.getBoundingClientRect();
      const cx = r ? r.left + r.width / 2 : window.innerWidth / 2;
      const cy = r ? r.top : window.innerHeight / 2;
      domRing(cx, cy);
      fireRocket(cx, cy);
    },
    [fireRocket, showSecret],
  );

  useEffect(() => {
    const onDown = (e: PointerEvent): void => {
      const t = e.target as HTMLElement | null;
      if (t?.closest?.('#secret')) return;
      burst(e.clientX, e.clientY);
    };
    let seq = '';
    const onKey = (e: KeyboardEvent): void => {
      seq = (seq + e.key).slice(-2);
      if (seq === '42') showSecret();
      if ((e.key === 'Enter' || e.key === ' ') && (e.target as HTMLElement)?.id === 'score') {
        burst(window.innerWidth / 2, window.innerHeight / 2);
      }
    };
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [burst, showSecret]);

  useEffect(() => {
    (window as unknown as { __sasha42?: unknown }).__sasha42 = {
      score: () => scoreRef.current,
      three: () => typeof window !== 'undefined' && 'WebGLRenderingContext' in window,
    };
  }, []);

  return (
    <>
      <div id="sky" />
      <canvas id="cv" ref={cvRef} />
      <div id="veil" />
      <main>
        <div className="gridcol" id="gridcol">
          <div className="kicker" id="kicker">
            личная страница · <b>Саша ⁴²</b>
          </div>
          <h1 className="mega" id="mega">
            <span className="r">4</span>
            <span className="b">2</span>
          </h1>
          <p className="sub" id="sub">
            Красно-синяя территория батальона. <b>Тыкай куда угодно</b> — цифры разлетаются, а
            счётчик копит очки. Доберись до <b>1764</b> — откроется секрет.
          </p>
          <div id="score" className="pill ghost" role="button" tabIndex={0} title="Тыкай по экрану">
            счёт · <b id="scoreNum">{score}</b>
          </div>
          <button id="depBtn" className="pill solid" title="Вся зарплата — в счёт!" onClick={deposit}>
            💰 Депнуть всю зарплату
          </button>
        </div>
      </main>
      <canvas id="rocket3d" ref={r3dRef} />
      <div id="flash" ref={flashRef} />
      <div id="ring" />
      <a id="homeBtn" href="index.html" title="На главную" onPointerDown={e => e.stopPropagation()}>🏠 Главная</a>
      <img id="salto-pop" src={saltoSticker} alt="Сальтуха!" />
      <div id="hint">а ещё 42 спрятаны… ищи 👀</div>
      <div
        id="secret"
        className={secret ? 'open' : ''}
        onClick={() => {
          setSecret(false);
          scoreRef.current = 0;
          setScore(0);
        }}
      >
        <img className="sticker" src={saltoSticker} alt="Сальтуха 42" />
        <div className="big">4️⃣2️⃣</div>
        <h2>Ты нашёл все 42, Саша!</h2>
        <p>Мы уже победили 🏆</p>
      </div>
    </>
  );
}
