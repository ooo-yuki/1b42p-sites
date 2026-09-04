import { cn } from '@/lib/utils';
import { ItemIcon } from '../../casino-icons';
import { Num } from '../shared';
import { COST, type WinKind } from './data';
import { Button } from '@/components/ui/button';
import './cabinet.css';

/* Корпус «Семёрки»: гирлянда, окна с поочерёдным стопом,
   рычаг, джекпот-торжество, кнопка спина. */

type Props = {
  reels: string[];
  spinning: boolean;
  locked: number;
  pulled: boolean;
  lastKind: WinKind | null;
  onSpin: () => void;
  onLever: () => void;
};

function pairIdx(reels: string[]): Set<number> {
  const [a, b, c] = reels;
  if (a === b && b === c) return new Set([0, 1, 2]);
  if (a === b) return new Set([0, 1]);
  if (b === c) return new Set([1, 2]);
  if (a === c) return new Set([0, 2]);
  return new Set();
}

export default function Cabinet({ reels, spinning, locked, pulled, lastKind, onSpin, onLever }: Props): JSX.Element {
  const hot = !spinning && lastKind !== null && lastKind !== 'miss' ? pairIdx(reels) : new Set<number>();
  const jackpot = !spinning && lastKind === 'jackpot';
  return (
    <div className={cn('cabinet', jackpot && 'jackpot')}>
      {jackpot && <div className="cab-rays" aria-hidden="true" />}
      <div className="marquee" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => <i key={i} style={{ animationDelay: `${(i % 7) * 0.2}s` }} />)}
      </div>
      <div className="cab-title">СЕМЁРКА · 42</div>
      <div className="windows" role="img" aria-label={`Барабаны: ${reels.join(', ')}`}>
        {reels.map((r, i) => (
          <div className={cn('window', spinning && locked <= i && 'blur', hot.has(i) && 'hot')} key={i}>
            <ItemIcon name={r} />
          </div>
        ))}
      </div>
      {jackpot && (
        <div className="jack-banner" role="status">
          <b>777</b><small>джекпот · +<Num>1000</Num></small>
        </div>
      )}
      <div className="deck">
        <Button disabled={spinning} onClick={onSpin}>
          {spinning ? 'Крутится…' : `Крутить за ${COST}`}
        </Button>
        <button className={cn('lever', pulled && 'down')} onClick={onLever} disabled={spinning}
          aria-label="Дёрнуть рычаг">
          <span className="stick" /><span className="knob" />
        </button>
      </div>
      <p className="spin-cost">спин — <Num>{COST}</Num> фишек, выигрыш падает сразу на баланс</p>
    </div>
  );
}
