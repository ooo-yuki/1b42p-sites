import { useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { Log, parseStake, type Api } from './shared';
import Wheel from './roulette/Wheel';
import Cloth from './roulette/Cloth';
import RHistory, { hotNumbers, loadRHist, saveRHist, type REntry } from './roulette/History';
import {
  DEFAULT_BET, DEFAULT_CHOICE, MIN_STAKE, N,
  TICKS, TICK_MS, TICK_MS_REDUCED, choiceLabel, settle, validateRoulette,
} from './roulette/data';
import { ballTick, chipClick, salonLose, salonWin } from './roulette/jingle';
import './roulette.css';
import './roulette/wheel.css';
import './roulette/cloth.css';
import './roulette/rhist.css';

/* ЗАЛ «РУЛЕТКА» — салон. Оркестрация: колесо → сукно → журнал.
   Правила святы: европейская, зеро ×35, цвет ×2, число ×35, минималка 10. */

export default function Roulette({ api }: { api: Api }): JSX.Element {
  const [rbet, setRbet] = useState(DEFAULT_BET);
  const [rchoice, setRchoice] = useState(DEFAULT_CHOICE);
  const [rnum, setRnum] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [ballDeg, setBallDeg] = useState(0);
  const [won, setWon] = useState<boolean | null>(null);
  const [hist, setHist] = useState<REntry[]>(() => loadRHist());
  const [seq, setSeq] = useState(() => Date.now());
  const ballTween = useRef<gsap.core.Tween | null>(null);

  useMemo(() => {
    const bad = validateRoulette();
    if (bad.length > 0) console.error('[roulette] святыня нарушена:', bad.join('; '));
  }, []);

  const hot = useMemo(() => hotNumbers(hist), [hist]);
  const raw = Math.floor(Number(rbet));
  const stakeNum = Number.isFinite(raw) && raw > 0 ? raw : 0;

  const spin = (): void => {
    if (spinning) return;
    const stake = parseStake(rbet, MIN_STAKE, api);
    if (stake === null) return;
    chipClick();
    setSpinning(true);
    setWon(null);
    const angleFinal = angle + 360 * 4 + Math.random() * 360;
    setAngle(angleFinal);
    // шарик: два круга против хода и остановка у иглы
    ballTween.current?.kill();
    if (!api.reduced) {
      const o = { v: 0 };
      ballTween.current = gsap.to(o, {
        v: -(360 * 2 + Math.random() * 360),
        duration: (TICKS * TICK_MS) / 1000,
        ease: 'power3.out',
        onUpdate: () => setBallDeg(o.v),
      });
    }
    let ticks = 0;
    const ms = api.reduced ? TICK_MS_REDUCED : TICK_MS;
    const timer = window.setInterval(() => {
      ticks++;
      setRnum(Math.floor(Math.random() * N));
      if (!api.reduced) ballTick(ticks / TICKS);
      if (ticks >= TICKS) {
        window.clearInterval(timer);
        ballTween.current?.kill();
        setBallDeg(0);
        const n = Math.floor(Math.random() * N);
        setRnum(n);
        setSpinning(false);
        const win = settle(rchoice, n, stake);
        const hit = win > 0;
        setWon(hit);
        if (hit) {
          api.credit(win);
          api.say(`Выпало ${n}! Забрал +${win}`, 'win');
          if (!api.reduced) salonWin();
        } else {
          api.say(`Выпало ${n}. Мимо, минус ${stake}`, 'lose');
          if (!api.reduced) salonLose();
        }
        setHist(prev => {
          const next = [{
            id: seq, choice: rchoice, n, stake,
            ret: win, profit: win - stake, t: Date.now(),
          }, ...prev].slice(0, 30);
          saveRHist(next);
          return next;
        });
        setSeq(s => s + 1);
      }
    }, ms);
  };

  return (
    <section className="roulette-hall">
      <Log msg={api.msg} tone={api.tone} />
      <div className="rl-grid">
        <Wheel spinning={spinning} angle={angle} ballDeg={ballDeg} rnum={rnum} won={won} />
        <Cloth rchoice={rchoice} rbet={rbet} spinning={spinning} stake={stakeNum}
          hot={hot} onChoice={setRchoice} onBet={setRbet} onSpin={spin} />
      </div>
      <p className="rl-pick" role="status">
        Ставишь: <b>{choiceLabel(rchoice)}</b>
      </p>
      <RHistory entries={hist} onClear={() => { setHist([]); saveRHist([]); }} />
    </section>
  );
}
