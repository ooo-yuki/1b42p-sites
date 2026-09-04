import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ItemIcon } from '../../casino-icons';
import { Num } from '../shared';
import { CELL_STEP, targetX, type Drop } from './data';
import { needlePing, reelTick } from './jingle';
import './strip.css';

/* Тикет-лента: витрина с иглой, тики с ростом тона, слоу-мо у финиша. */

type Props = {
  cells: Drop[] | null;
  hit: number;
  spinToken: number;
  spinning: boolean;
  reduced: boolean;
  onDone: () => void;
};

export default function Strip({ cells, hit, spinToken, spinning, reduced, onDone }: Props): JSX.Element {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);
  const needleRef = useRef<HTMLSpanElement | null>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const lastTick = useRef(-1);
  const lastPing = useRef(-1);

  useEffect(() => {
    if (spinToken <= 0 || !cells) return;
    const strip = stripRef.current;
    const wrap = wrapRef.current;
    if (!strip || !wrap) { doneRef.current(); return; }
    lastTick.current = -1;
    lastPing.current = -1;
    const target = targetX(wrap.clientWidth || 600);
    gsap.set(strip, { x: 0 });
    const tw = gsap.fromTo(strip, { x: 0 }, {
      x: target,
      duration: reduced ? 0.3 : 3.4,
      ease: 'power3.out',
      onUpdate: () => {
        if (reduced) return;
        const x = gsap.getProperty(strip, 'x') as number;
        const passed = Math.min(cells.length - 1, Math.max(0, Math.round(-x / CELL_STEP)));
        const total = Math.abs(target) || 1;
        const prog = Math.min(1, Math.abs(x) / total);
        if (passed !== lastTick.current) {
          lastTick.current = passed;
          reelTick(prog);
          if (passed % 3 === 0 && passed !== lastPing.current) {
            lastPing.current = passed;
            needlePing();
            needleRef.current?.classList.remove('ping');
            void needleRef.current?.offsetWidth;
            needleRef.current?.classList.add('ping');
          }
        }
        const near = Math.abs(passed - hit) <= 2;
        strip.classList.toggle('slowmo', prog > 0.82 && near);
      },
      onComplete: () => {
        strip.classList.remove('slowmo');
        doneRef.current();
      },
    });
    return () => { tw.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinToken]);

  return (
    <div id="stripWrap" ref={wrapRef} className={`${cells ? 'open' : ''}${spinning ? ' live' : ''}`}>
      <div className="ticket-edge" aria-hidden="true" />
      <div id="strip" ref={stripRef}>
        {cells?.map((d, i) => (
          <div className={`cell${i === hit ? ' hit' : ''}${spinning && i < hit + 3 && i > hit - 3 ? ' near' : ''}`} key={i}>
            <span className="e"><ItemIcon name={d.icon} /></span>
            <Num>{d.amount}</Num>
          </div>
        ))}
      </div>
      <div className="ticket-edge" aria-hidden="true" />
      <span className="needle" ref={needleRef} aria-hidden="true" />
      {spinning && <span className="strip-glare" aria-hidden="true" />}
    </div>
  );
}
