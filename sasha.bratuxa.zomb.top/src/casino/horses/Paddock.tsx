import { useRef } from 'react';
import { cn } from '@/lib/utils';
import { ItemIcon } from '../../casino-icons';
import { Num } from '../shared';
import { payout, type Horse } from './data';
import { Badge } from '@/components/ui/badge';
import './paddock.css';

/* Паддок: четыре лошади, наклон за курсором, форма по реальной истории,
   живой превью выплаты под текущую ставку. */

type Props = {
  horses: Horse[];
  selId: string;
  stake: number;
  racing: boolean;
  form: Record<string, boolean[]>;
  onPick: (id: string) => void;
};

function MountCard({ h, sel, stake, racing, last, onPick }: {
  h: Horse; sel: boolean; stake: number; racing: boolean;
  last: boolean[]; onPick: (id: string) => void;
}): JSX.Element {
  const ref = useRef<HTMLElement | null>(null);
  const tilt = (e: React.MouseEvent): void => {
    const el = ref.current;
    if (!el || racing) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--tilt-x', `${(-py * 6).toFixed(2)}deg`);
    el.style.setProperty('--tilt-y', `${(px * 8).toFixed(2)}deg`);
  };
  const untilt = (): void => {
    ref.current?.style.setProperty('--tilt-x', '0deg');
    ref.current?.style.setProperty('--tilt-y', '0deg');
  };
  const key = (e: React.KeyboardEvent): void => {
    if ((e.key === 'Enter' || e.key === ' ') && !racing) { e.preventDefault(); onPick(h.id); }
  };
  const wins = last.filter(Boolean).length;

  return (
    <article
      ref={ref as React.RefObject<HTMLElement>}
      className={cn('mount', sel && 'sel', racing && 'locked')}
      style={{ ['--silks' as string]: h.silks }}
      onClick={() => { if (!racing) onPick(h.id); }}
      onMouseMove={tilt}
      onMouseLeave={untilt}
      onKeyDown={key}
      tabIndex={0}
      role="button"
      aria-pressed={sel}
      aria-label={`${h.name}, кэф ${h.odds}`}>
      <span className="m-art"><ItemIcon name={h.icon} /></span>
      <b>{h.name}</b>
      <Badge variant="secondary">×{h.odds}</Badge>
      <span className="m-pay">
        {stake > 0 ? <>за <Num>{stake}</Num> → +<Num>{payout(stake, h.odds)}</Num></> : 'ставка ниже'}
      </span>
      <span className="m-form" title={last.length > 0 ? `Побед ${wins} из ${last.length} — твоя история` : 'Дебют — истории пока нет'}>
        {last.length === 0
          ? <em>дебют</em>
          : last.map((w, i) => <i key={i} className={w ? 'w' : 'l'} />)}
      </span>
    </article>
  );
}

export default function Paddock({ horses, selId, stake, racing, form, onPick }: Props): JSX.Element {
  return (
    <div className="paddock" role="list" aria-label="Лошади заезда">
      {horses.map(h => (
        <MountCard key={h.id} h={h} sel={selId === h.id} stake={stake}
          racing={racing} last={form[h.id] ?? []} onPick={onPick} />
      ))}
    </div>
  );
}
