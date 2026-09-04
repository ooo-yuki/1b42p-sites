import { cn } from '@/lib/utils';
import { Num } from '../shared';
import { RED, bustChance, handValue, isSoft, rank, type Card } from './data';
import { Badge } from '@/components/ui/badge';
import './hand.css';

/* Место за столом: карты со staggered-сдачей, рубашка, мягкие/перебор. */

function PCard({ c, back, anim, delay }: {
  c?: Card; back?: boolean; anim: boolean; delay: number;
}): JSX.Element {
  if (back || !c) {
    return <span className={cn('pcard back', anim && 'deal')} style={anim ? { animationDelay: `${delay}ms` } : undefined} aria-label="Закрытая карта" />;
  }
  return (
    <span className={cn('pcard', RED.has(c.s) && 'red', anim && 'deal')}
      style={anim ? { animationDelay: `${delay}ms` } : undefined}>
      <b>{rank(c.r)}</b><i>{c.s}</i><em>{c.s}</em>
    </span>
  );
}

type Props = {
  label: string;
  cards: Card[];
  hideHole: boolean;
  roundId: number;
  ghost: string;
  dim?: boolean;
};

export default function Hand({ label, cards, hideHole, roundId, ghost, dim }: Props): JSX.Element {
  const shown = cards.length > 0;
  const v = handValue(cards);
  const bust = shown && v > 21;
  const soft = shown && !bust && isSoft(cards);
  const risk = shown && !bust ? bustChance(cards) : 0;
  return (
    <div className={cn('seat', dim && 'dimmed')}>
      <div className="seat-tag">
        {label}{' '}
        {shown && !hideHole && (
          <Badge variant="secondary"><Num>{v}</Num></Badge>
        )}
        {shown && !hideHole && bust && <Badge variant="destructive">перебор</Badge>}
        {shown && !hideHole && soft && <Badge variant="outline">мягкие</Badge>}
      </div>
      <div className="hand">
        {!shown && <span className="ghost">{ghost}</span>}
        {cards.map((c, i) => (
          <PCard key={`${roundId}-${i}`} c={c}
            back={hideHole && i === 1} anim={roundId > 0} delay={i * 90} />
        ))}
      </div>
      {shown && !hideHole && !bust && risk > 0 && (
        <small className="bust-hint tnum">добор сгорит с шансом {risk.toFixed(0)}%</small>
      )}
    </div>
  );
}
