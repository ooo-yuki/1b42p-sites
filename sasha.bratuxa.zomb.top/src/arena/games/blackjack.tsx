import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { bustChance, handValue, isSoft, rank, type Card } from '../../casino/bj/data';
import { arenaClick } from '../sound';
import type { BjPublic } from '../proto';
import type { GameViewProps } from './index';

/* Блэкджек 21 — стол клуба: дилер с закрытой дыркой, руки всех открыты,
   ход по очереди, 2 игрока — дуэль сильнейших, 3+ — перебор вылетает.
   Подсчёт и шансы — общие с казино, фишек нет: победа — в летопись. */

const RED = new Set(['♥', '♦']);

function MiniCard({ c, hole }: { c?: Card; hole?: boolean }): JSX.Element {
  if (hole || !c) return <span className="bj-card hole" aria-hidden="true">?</span>;
  return (
    <span className={cn('bj-card', RED.has(c.s) && 'red')}>
      <b>{rank(c.r)}</b><i>{c.s}</i>
    </span>
  );
}

export default function BjTable({ me, room, secsLeft, onMove, onRematch }: GameViewProps): JSX.Element {
  const g = room.gdata as unknown as BjPublic;
  const hands = g?.hands ?? {};
  const status = g?.status ?? {};
  const natural = g?.natural ?? {};
  const dealer = g?.dealer ?? [];
  const holeHidden = g?.holeHidden ?? true;
  const turn = g?.turn ?? null;
  const over = room.phase === 'over';
  const iTurn = !over && turn === me;
  const myHand = hands[me] ?? [];
  const myVal = handValue(myHand);
  const chance = !over && status[me] === 'play' ? bustChance(myHand) : null;
  const nameOf = (id: string): string => room.players.find(p => p.id === id)?.name ?? '???';

  return (
    <div className="bj-wrap">
      <div className="bj-row dealer">
        <span className="bj-who">Дилер{!holeHidden && dealer.length > 0 ? ` · ${handValue(dealer)}` : ''}</span>
        <span className="bj-cards">
          {dealer.map((c, i) => <MiniCard key={i} c={c} />)}
          {holeHidden && <MiniCard hole />}
        </span>
      </div>
      {room.players.map(p => {
        const h = hands[p.id] ?? [];
        const st = status[p.id] ?? 'play';
        const v = handValue(h);
        return (
          <div key={p.id} className={cn('bj-row', p.id === me && 'me', turn === p.id && !over && 'turn')}>
            <span className="bj-who">
              {p.name}
              {h.length > 0 && (
                <b className={cn('tnum', st === 'bust' && 'bust')}>
                  {' '}· {v}{isSoft(h) && st === 'play' ? ' мягк.' : ''}
                </b>
              )}
              {natural[p.id] && <i className="bj-nat">натуральный</i>}
              {st === 'bust' && <i className="bj-out">перебор</i>}
              {st === 'stand' && !over && <i className="bj-stand">стоит</i>}
            </span>
            <span className="bj-cards">
              {h.map((c, i) => <MiniCard key={i} c={c} />)}
            </span>
          </div>
        );
      })}
      <div className="bj-bar" aria-live="polite">
        {over ? (
          <>
            <span>
              {room.winner
                ? `Чемпион — ${nameOf(room.winner)}. Мы уже победили.`
                : 'Ничья — все сгорели или руки равны.'}
            </span>
            <Button size="sm" onClick={() => { arenaClick(); onRematch(); }}>Реванш</Button>
          </>
        ) : iTurn ? (
          <>
            <Button size="sm" onClick={() => { arenaClick(); onMove({ kind: 'hit' }); }}>Ещё</Button>
            <Button size="sm" variant="outline" onClick={() => { arenaClick(); onMove({ kind: 'stand' }); }}>Хватит</Button>
            <span className="bj-meta tnum">
              у тебя {myVal}{chance !== null && chance > 0 ? ` · перебор ${Math.round(chance)}%` : ''}
              {secsLeft !== null ? ` · ${secsLeft}с` : ''}
            </span>
          </>
        ) : (
          <span>Ходит {turn ? nameOf(turn) : '…'}
            {secsLeft !== null ? <b className="tnum"> · {secsLeft}с</b> : ''}</span>
        )}
      </div>
      <p className="fine">Дилер тянет до 17. Дырка закрыта, пока все не отходят. Перебор — вылет.</p>
    </div>
  );
}
