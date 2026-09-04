import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Num } from '../casino/shared';
import { arenaClick, chatPop } from './sound';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { gameView } from './games';
import type { GameDef, RoomView } from './proto';

/* Комната — платформа: шапка, вьюха игры из реестра, лента, чат, пикер хоста. */

export type ChatLine = { id: string; name: string; text: string };
export type FeedLine = { k: number; text: string; hot?: boolean };

type Props = {
  me: string;
  room: RoomView;
  games: Record<string, GameDef>;
  feed: FeedLine[];
  chat: ChatLine[];
  myRolled: boolean;
  secsLeft: number | null;
  onRoll: () => void;
  onLeave: () => void;
  onStart: () => void;
  onRematch: () => void;
  onPickGame: (g: string) => void;
  onChat: (t: string) => void;
};

export default function Room({ me, room, games, feed, chat, myRolled, secsLeft,
  onRoll, onLeave, onStart, onRematch, onPickGame, onChat }: Props): JSX.Element {
  const [draft, setDraft] = useState('');
  const feedRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const amHost = room.host === me;
  const View = gameView(room.game);
  const ids = Object.keys(games);
  const maxPlayers = games[room.game]?.max ?? 5;

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

      {room.private && room.phase === 'lobby' && amHost && ids.length > 1 && (
        <div className="apick" aria-label="Игра комнаты">
          <span>Игра:</span>
          <ToggleGroup type="single" value={room.game}
            onValueChange={v => { if (v) { arenaClick(); onPickGame(v); } }}
            className="apick-group" aria-label="Выбор игры комнаты">
            {ids.map(id => (
              <ToggleGroupItem key={id} value={id} className="apick-item">
                {games[id].label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      )}

      {View ? (
        <View me={me} room={room} amHost={amHost} myRolled={myRolled} secsLeft={secsLeft}
          maxPlayers={maxPlayers} onRoll={onRoll} onStart={onStart} onRematch={onRematch} />
      ) : (
        <div className="ar-table"><p className="idle">Такой игры клуб ещё не знает — жди завоза.</p></div>
      )}

      <div className="ar-feed" ref={feedRef} aria-live="polite">
        {feed.map(f => <p key={f.k} className={cn(f.hot && 'hot')}>{f.text}</p>)}
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
