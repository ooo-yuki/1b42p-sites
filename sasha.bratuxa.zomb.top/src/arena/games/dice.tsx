import { cn } from '@/lib/utils';
import { DiceFace } from '../dice';
import { arenaClick } from '../sound';
import { Button } from '@/components/ui/button';
import type { RoomView } from '../proto';

/* Кости на выбывание — вьюха игры: бойцы, стол, кнопки. Платформа (шапка, чат,
   лента, пикер игры) живёт в Room; сюда игра получает только свой стол. */

type Props = {
  me: string;
  room: RoomView;
  amHost: boolean;
  myRolled: boolean;
  secsLeft: number | null;
  maxPlayers: number;
  onRoll: () => void;
  onStart: () => void;
  onRematch: () => void;
};

export default function DiceTable({ me, room, amHost, myRolled, secsLeft, maxPlayers, onRoll, onStart, onRematch }: Props): JSX.Element {
  const playing = room.phase === 'play';
  const over = room.phase === 'over';
  const iAlive = room.alive.includes(me);
  const canRoll = playing && iAlive && !myRolled;
  const winner = room.players.find(p => p.id === room.winner);

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

      <div className="ar-table">
        {room.phase === 'lobby' && (
          <div className="ar-lounge">
            <p>Ждём братух: <b className="tnum">{room.players.length}/{maxPlayers}</b>. {room.private
              ? (amHost ? 'Ты хост — давай старт, когда все в сборе.' : 'Старт даст хост.')
              : 'Бой начнётся сам.'}</p>
            {room.private && amHost && (
              <Button disabled={room.players.length < 2} onClick={() => { arenaClick(); onStart(); }}>
                К бою!
              </Button>
            )}
          </div>
        )}
        {playing && (
          <div className="ar-round">
            <Button size="lg" disabled={!canRoll} onClick={() => { onRoll(); }}>
              {myRolled ? 'Кость брошена' : secsLeft !== null ? `Кинуть! (${secsLeft}с)` : 'Кинуть!'}
            </Button>
            {!iAlive && <p className="ar-dead">Ты выбит — смотришь с трибуны.</p>}
          </div>
        )}
        {over && winner && (
          <div className="ar-over">
            <b>{winner.id === me ? 'Ты забрал бой!' : `${winner.name} забрал бой!`}</b>
            <div className="crow">
              <Button disabled={room.private && !amHost} onClick={() => { arenaClick(); onRematch(); }}>
                {room.private && !amHost ? 'Ждём хоста' : 'Реванш'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
