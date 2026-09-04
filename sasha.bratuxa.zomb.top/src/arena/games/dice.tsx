import { cn } from '@/lib/utils';
import { DiceFace } from '../dice';
import { Button } from '@/components/ui/button';
import type { GameViewProps } from './index';

/* Кости на выбывание — чистый стол: бойцы и кнопка броска.
   Лобби, финал, лента и чат — платформа в Room. */

export default function DiceTable({ me, room, myRolled, secsLeft, onRoll }: GameViewProps): JSX.Element {
  const playing = room.phase === 'play';
  const iAlive = room.alive.includes(me);
  const canRoll = playing && iAlive && !myRolled;

  return (
    <>
      <ul className="ar-fighters" aria-label="Бойцы">
        {room.players.map(p => {
          const roll = room.rolls[p.id];
          const out = playing && !p.alive;
          const lead = playing && p.alive && roll !== undefined &&
            roll === Math.max(...room.alive.map(id => room.rolls[id] ?? -1));
          return (
            <li key={p.id} className={cn('fighter', out && 'out', lead && 'lead', p.id === me && 'me')}>
              <span className="f-dice">{roll !== undefined
                ? <span className="f-pop" key={roll}><DiceFace v={roll} hot={lead} /></span>
                : <span className="f-wait">?</span>}</span>
              <span className="f-name">{p.name}{p.id === room.host ? ' · хост' : ''}{p.id === me ? ' · ты' : ''}</span>
              {out && <span className="f-out">выбит</span>}
            </li>
          );
        })}
      </ul>

      {playing && (
        <div className="ar-table">
          <div className="ar-round">
            <Button size="lg" disabled={!canRoll} onClick={() => { onRoll(); }}>
              {myRolled ? 'Кость брошена' : secsLeft !== null ? `Кинуть! (${secsLeft}с)` : 'Кинуть!'}
            </Button>
            {!iAlive && <p className="ar-dead">Ты выбит — смотришь с трибуны.</p>}
          </div>
        </div>
      )}
    </>
  );
}
