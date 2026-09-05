import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { DiceFace } from './dice';
import { arenaClick } from './sound';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { GameDef, PoolView } from './proto';

/* Центр клуба: выбор игры голосами, поиск, пул, ожидание, доп-лобби. */

type Props = {
  me: string;
  online: number | null;
  pool: PoolView | null;
  games: Record<string, GameDef>;
  searching: boolean;
  busy: boolean;
  myVote: string;
  onVoteGame: (g: string) => void;
  onSearch: () => void;
  onStop: () => void;
  onVoteEnter: (yes: boolean) => void;
  onVoteWait: (yes: boolean) => void;
  onCreate: (game: string) => void;
  onJoin: (code: string) => void;
};

function fmtElapsed(since: number, now: number): string {
  const s = Math.max(0, Math.floor((now - since) / 1000));
  const m = Math.floor(s / 60);
  return m > 0 ? `${m} мин ${s % 60} с` : `${s} с`;
}

export default function Lobby({ me, online, pool, games, searching, busy, myVote,
  onVoteGame, onSearch, onStop, onVoteEnter, onVoteWait, onCreate, onJoin }: Props): JSX.Element {
  const [code, setCode] = useState('');
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!searching) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [searching]);
  const go = (): void => {
    const c = code.trim().toUpperCase();
    if (c.length >= 3) { arenaClick(); onJoin(c); }
  };
  const ids = Object.keys(games);
  const members = pool?.members ?? [];
  const myEnter = members.find(m => m.id === me)?.enter ?? false;
  const yesEnter = members.filter(m => m.enter).length;
  const canEnter = members.length >= 2;
  const wait = pool?.wait;
  const waitVotes = wait?.votes ? Object.values(wait.votes) : [];
  const yesWait = waitVotes.filter(Boolean).length;
  const enterPct = members.length > 0 ? Math.round((yesEnter / members.length) * 100) : 0;
  const waitPct = waitVotes.length > 0 ? Math.round((yesWait / waitVotes.length) * 100) : 0;

  return (
    <div className="arena-lobby">
      <h1 className="aneon" aria-label="Арена 42">
        <span className="n-red">Арена</span> <span className="n-blue">42</span>
      </h1>
      <div className="aticker" role="status">
        <span className="tk-dot" />
        <span className="tk-label">в клубе сейчас</span>
        <b className="tk-num tnum">{online === null ? '…' : online}</b>
      </div>

      <ToggleGroup type="single" value={myVote}
        onValueChange={v => { arenaClick(); onVoteGame(v === '' ? 'any' : v); }}
        className="agames" aria-label="Выбор игры голосованием">
        {ids.map(id => {
          const g = games[id];
          const v = members.filter(m => m.vote === id).length;
          return (
            <ToggleGroupItem key={id} value={id} disabled={busy}
              className="gcard" aria-label={`Голос за ${g.label}`}>
              {g.icon === 'cards'
                ? <span className="minicard" aria-hidden="true"><i>Т♠</i><i className="red">К♥</i></span>
                : g.icon === 'chess'
                  ? <span className="minicard chess" aria-hidden="true"><i className="knight">♞</i></span>
                  : g.icon === 'checkers'
                    ? <span className="minicard draughts" aria-hidden="true"><i className="wd" /><i className="bd" /></span>
                    : g.icon === 'mono'
                      ? <span className="minicard mono" aria-hidden="true"><i className="house">⌂</i></span>
                      : <DiceFace v={5} hot={myVote === id} />}
              <b>{g.label}</b>
              <small>{g.min === g.max ? (g.max === 2 ? 'дуэль' : `${g.max} игрока`) : `${g.min}–${g.max} игроков`} · голосов: <span className="tnum">{v}</span></small>
            </ToggleGroupItem>
          );
        })}
        <ToggleGroupItem value="any" disabled={busy} className="gcard any" aria-label="Голос за любую игру">
          <span className="qmark">?</span>
          <b>Любая</b>
          <small>доверяюсь клубу · голосов: <span className="tnum">{members.filter(m => m.vote === 'any').length}</span></small>
        </ToggleGroupItem>
      </ToggleGroup>
      <p className="avote-note">Игра с большинством голосов — в бой. Все на «любой» — решит рандом.</p>

      {!searching ? (
        <Button size="lg" disabled={busy} className="afight"
          onClick={() => { arenaClick(); onSearch(); }}>
          Искать бой
        </Button>
      ) : (
        <div className="asearch-live">
          <p className="asearch-t">Ищем братух… <b className="tnum">{fmtElapsed(pool?.since ?? now, now)}</b></p>
          <Button variant="outline" onClick={onStop}>Выйти из поиска</Button>
        </div>
      )}

      {searching && (
        <div className="apool" aria-label="В поиске">
          {members.map(m => (
            <span key={m.id} className={cn('pmem', m.enter && 'in', m.id === me && 'me')}>
              <b>{m.name}</b>
              <small>{m.vote === 'any' ? 'любая' : games[m.vote]?.label ?? 'любая'}</small>
              {m.enter && <i className="go" title="голосует за заход">за!</i>}
            </span>
          ))}
          {members.length === 0 && <p className="idle">Пока один… клуб уже свистит братухам.</p>}
        </div>
      )}

      {searching && canEnter && (
        <div className="aenter">
          <p>Нас <b className="tnum">{members.length}</b>, за заход — <b className="tnum">{yesEnter}</b>. Больше половины «за» — и в бой!</p>
          <span className="quorum" aria-hidden="true"><i style={{ width: `${enterPct}%` }} /></span>
          <div className="crow">
            <Button disabled={myEnter} onClick={() => onVoteEnter(true)}>За!</Button>
            <Button variant="outline" disabled={!myEnter} onClick={() => onVoteEnter(false)}>Погожу</Button>
          </div>
        </div>
      )}

      {searching && wait?.open && (
        <div className="await" role="alert">
          <p>Ищем уже долго. Ждём ещё или в бой тем, что есть? За ожидание — <b className="tnum">{yesWait}</b>.</p>
          <span className="quorum wait" aria-hidden="true"><i style={{ width: `${waitPct}%` }} /></span>
          <div className="crow">
            <Button onClick={() => onVoteWait(true)}>Ждать ещё</Button>
            <Button variant="secondary" onClick={() => onVoteWait(false)}>В бой!</Button>
          </div>
        </div>
      )}

      <details className="aprivate">
        <summary>Своя комната — доп-функция</summary>
        <div className="aroom-row">
          <Input value={code} maxLength={8} placeholder="Код комнаты"
            onChange={e => setCode(e.target.value.toUpperCase())}
            onKeyDown={e => { if (e.key === 'Enter') go(); }}
            aria-label="Код комнаты" disabled={busy} />
          <Button variant="outline" disabled={busy || code.trim().length < 3} onClick={go}>Войти</Button>
          <Button variant="secondary" disabled={busy}
            onClick={() => { arenaClick(); onCreate(myVote !== 'any' && games[myVote] ? myVote : 'dice'); }}>
            Создать{myVote !== 'any' && games[myVote] ? `: ${games[myVote].label}` : ''}
          </Button>
        </div>
      </details>

      <ol className="arules">
        <li>Голосуй за игру, жми поиск — клуб соберёт пати.</li>
        <li>Нас двое+ — голосуй «за», и бой начнётся.</li>
        <li>Кости на выбывание: низший падает, ничья за вылет — переброс.</li>
        <li>Дурак подкидной: отбивайся или бери, скинул всё — чемпион.</li>
        <li>Шахматы — дуэль: белые и чёрные по жребию, на ход минута, флаг — поражение.</li>
        <li>Шашки русские — дуэль: бить обязательно и по максимуму, дамка летает.</li>
        <li>Монополия 42 — пати 2–5: купи, застрой, сажай соперников на мель.</li>
        <li>Блэкджек 21 — дуэль при двоих, выбывание при троих+: бери или стой, дилер тянет до 17.</li>
      </ol>
    </div>
  );
}
