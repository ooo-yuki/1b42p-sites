import { useRef } from 'react';
import { ItemIcon } from '../../casino-icons';
import { Num } from '../shared';
import { CASES, chancePct, evOf, type CaseDef } from './data';
import { vaultSelect } from './jingle';
import { Button } from '@/components/ui/button';
import './vaults.css';

/* Сейфы арсенала: наклон за курсором, кодовый лимб, честные шансы барами. */

type Props = {
  selId: string;
  busy: boolean;
  onPick: (c: CaseDef) => void;
  onOpen: (c: CaseDef) => void;
};

function Dial({ seed, active }: { seed: number; active: boolean }): JSX.Element {
  const ticks = Array.from({ length: 24 }, (_, i) => i);
  return (
    <svg className={`dial${active ? ' spin' : ''}`} viewBox="0 0 48 48" aria-hidden="true"
      style={{ ['--dial-from' as string]: `${(seed * 137) % 360}deg` }}>
      <circle cx="24" cy="24" r="21" className="dial-ring" />
      {ticks.map(t => {
        const a = (t / ticks.length) * Math.PI * 2;
        const x1 = 24 + Math.cos(a) * 17;
        const y1 = 24 + Math.sin(a) * 17;
        const x2 = 24 + Math.cos(a) * (t % 6 === 0 ? 12 : 14.5);
        const y2 = 24 + Math.sin(a) * (t % 6 === 0 ? 12 : 14.5);
        return <line key={t} x1={x1} y1={y1} x2={x2} y2={y2} className={t % 6 === 0 ? 'tick big' : 'tick'} />;
      })}
      <circle cx="24" cy="24" r="5.5" className="dial-hub" />
      <line x1="24" y1="24" x2="24" y2="11" className="dial-hand" />
    </svg>
  );
}

function VaultCard({ c, sel, busy, index, onPick, onOpen }: {
  c: CaseDef; sel: boolean; busy: boolean; index: number;
  onPick: (c: CaseDef) => void; onOpen: (c: CaseDef) => void;
}): JSX.Element {
  const ref = useRef<HTMLElement | null>(null);

  const tilt = (e: React.MouseEvent): void => {
    const el = ref.current;
    if (!el || busy) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--tilt-x', `${(-py * 7).toFixed(2)}deg`);
    el.style.setProperty('--tilt-y', `${(px * 9).toFixed(2)}deg`);
  };
  const untilt = (): void => {
    ref.current?.style.setProperty('--tilt-x', '0deg');
    ref.current?.style.setProperty('--tilt-y', '0deg');
  };
  const key = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(c); }
  };

  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className={`vault${sel ? ' sel' : ''}${busy ? ' locked' : ''}`}
      onClick={() => { if (!busy) { vaultSelect(); onPick(c); } }}
      onMouseMove={tilt}
      onMouseLeave={untilt}
      onKeyDown={key}
      tabIndex={0}
      role="button"
      aria-pressed={sel}
      aria-label={`${c.name}, ${c.price} фишек`}>
      <span className="v-lock" aria-hidden="true"><Dial seed={index + 1} active={busy && sel} /></span>
      <span className="v-art"><ItemIcon name={c.icon} /></span>
      <b>{c.name}</b>
      <small>{c.desc}</small>
      <ul className="v-drops">
        {c.drops.map(d => {
          const p = chancePct(c, d);
          return (
            <li key={d.label} title={`${d.label} — шанс ${p.toFixed(p < 10 ? 1 : 0)}%, выигрыш ${d.amount}`}>
              <ItemIcon name={d.icon} />
              <i className="bar"><i style={{ width: `${Math.max(4, p)}%` }} /></i>
              <span><Num>{d.amount}</Num> · {p.toFixed(p < 10 ? 1 : 0)}%</span>
            </li>
          );
        })}
      </ul>
      <div className="v-meta">
        <span className="ev" title="Средний возврат за открытие">~{Math.round(evOf(c))} средн.</span>
      </div>
      <div className="v-buy">
        <span className="cprice"><Num>{c.price}</Num> фишек</span>
        <Button
          size="sm"
          disabled={busy}
          onClick={e => { e.stopPropagation(); onOpen(c); }}
          onMouseDown={e => e.currentTarget.classList.add('press')}
          onMouseUp={e => e.currentTarget.classList.remove('press')}>
          {busy && sel ? 'Крутится…' : 'Открыть'}
        </Button>
      </div>
    </article>
  );
}

export default function Vaults({ selId, busy, onPick, onOpen }: Props): JSX.Element {
  return (
    <div className="vaults" role="list">
      {CASES.map((c, i) => (
        <VaultCard key={c.id} c={c} index={i} sel={selId === c.id} busy={busy} onPick={onPick} onOpen={onOpen} />
      ))}
    </div>
  );
}
