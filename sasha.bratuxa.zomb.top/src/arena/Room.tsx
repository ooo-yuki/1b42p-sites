import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Num } from '../casino/shared';
import { DiceFace } from './dice';
import { arenaClick, chatPop } from './sound';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { RoomView } from './proto';

/* Комната: бойцы, стол костей, чат, кнопки хоста. */

export type ChatLine = { id: string; name: string; text: string };
export type FeedLine = { k: number; text: string; hot?: boolean };

type Props = {
  me: string;
  room: RoomView;
  feed: FeedLine[];
  chat: ChatLine[];
  myRolled: boolean;
  secsLeft: number | null;
  onRoll: () => void;
  onLeave: () => void;
  onStart: () => void;
  onRematch: () => void;
  onChat: (t: string) => void;
};

export default function Room({ me, room, feed, chat, myRolled, secsLeft, onRoll, onLeave, onStart, onRematch, onChat }: Props): JSX.Element {
  const [draft, setDraft] = useState('');
  const feedRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const amHost = room.host === me;
  const playing = room.phase === 'play';
  const over = room.phase === 'over';
  const iAlive = room.alive.includes(me);
  const canRoll = playing && iAlive && !myRolled;
  const winner = room.players.find(p => p.id === room.winner);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
  }, [feed.length]);
  useEffect(() => {
    if (chat.length > 0) chatPop();
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [chat.length]);

  const say = (): void => {
    const t = draft.trim();
    if (!t) return;
    onChat(t);
    setDraft('');
  };

  return (
    <div className="arena-room">
      <div className="ar-head">
        <span className="ar-code tnum" title="Код комнаты — диктуй братухам">{room.code}</span>
        <span className={cn('ar-phase', room.phase)}>
          {room.phase === 'lobby' ? 'сбор' : room.phase === 'play' ? `раунд ${room.round}` : 'бой окончен'}
        </span>
        <span className="ar-game">{room.gameLabel}</span>
        <span className="sp" />
        <Button variant="outline" size="sm" onClick={() => { arenaClick(); onLeave(); }}>Покинуть</Button>
      </div>

      <ul className="ar-fighters" aria-label="Бойцы">
        {room.players.map(p => {
          const roll = room.rolls[p.id];
          const out = playing && !p.alive;
          const lead = playing && p.alive && roll !== undefined &&
            roll === Math.max(...room.alive.map(id => room.rolls[id] ?? -1));
          return (
            <li key={p.id} className={cn('fighter', out && 'out', lead && 'lead', p.id === me && 'me')}>
              <span className="f-dice">{roll !== undefined ? <DiceFace v={roll} hot={lead} /> : <span className="f-wait">?</span>}</span>
              <span className="f-name">{p.name}{p.id === room.host ? ' · хост' : ''}{p.id === me ? ' · ты' : ''}</span>
              {out && <span className="f-out">выбит</span>}
            </li>
          );
        })}
      </ul>

      <div className="ar-table">
        {room.phase === 'lobby' && (
          <div className="ar-lounge">
            <p>Ждём братух: <b className="tnum">{room.players.length}/5</b>. {room.private
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
              <Button onClick={() => { arenaClick(); onRematch(); }}>
                {room.private && !amHost ? 'Ждём хоста' : 'Реванш'}
              </Button>
            </div>
          </div>
        )}
        <div className="ar-feed" ref={feedRef} aria-live="polite">
          {feed.map(f => <p key={f.k} className={cn(f.hot && 'hot')}>{f.text}</p>)}
        </div>
      </div>

      <div className="ar-chat">
        <div className="ar-lines" ref={chatRef}>
          {chat.length === 0 && <p className="idle">Тихо… договоритесь, кто первый падает.</p>}
          {chat.map((c, i) => (
            <p key={i}><b>{c.name}:</b> {c.text}</p>
          ))}
        </div>
        <div className="crow">
          <Input value={draft} maxLength={140} placeholder="В комнату…"
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') say(); }}
            aria-label="Сообщение в комнату" />
          <Button size="sm" onClick={say}>Сказать</Button>
        </div>
      </div>

      <p className="afoot tnum">комната {room.code} · <Num>{room.players.length}</Num> братух</p>
    </div>
  );
}
