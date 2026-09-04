import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Num } from '../casino/shared';
import { Users } from 'lucide-react';
import { DiceCup } from './dice';
import { arenaClick } from './sound';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/* Лобби клуба: онлайн-пилюля, имя, пати 2–5, код комнаты, как играть. */

type Props = {
  online: number | null;
  name: string;
  wins: number;
  busy: boolean;
  queued: { size: number; waiting: number } | null;
  onName: (n: string) => void;
  onQuick: (size: number) => void;
  onCreate: () => void;
  onJoin: (code: string) => void;
};

const PARTY = [2, 3, 4, 5];

export default function Lobby({ online, name, wins, busy, queued, onName, onQuick, onCreate, onJoin }: Props): JSX.Element {
  const [code, setCode] = useState('');
  const go = (): void => {
    const c = code.trim().toUpperCase();
    if (c.length >= 3) { arenaClick(); onJoin(c); }
  };
  return (
    <div className="arena-lobby">
      <h1 className="aneon" aria-label="Арена 42">
        <span className="n-red">Арена</span> <span className="n-blue">42</span>
      </h1>
      <div className="aticker" role="status">
        <span className="tk-dot" />
        <span className="tk-label">в клубе сейчас</span>
        <b className="tk-num tnum">{online === null ? '…' : online}</b>
        {wins > 0 && <span className="tk-wins">побед: <Num>{wins}</Num></span>}
      </div>
      <label className="aname">
        <span>Имя бойца</span>
        <Input value={name} maxLength={24} placeholder="Братуха"
          onChange={e => onName(e.target.value)} aria-label="Имя бойца" />
      </label>
      <div className="aparty" role="group" aria-label="Быстрый бой: размер пати">
        {PARTY.map(n => (
          <button key={n} type="button" disabled={busy}
            className={cn('pcard', queued?.size === n && 'sel')}
            onClick={() => { arenaClick(); onQuick(n); }}>
            <DiceCup n={n} />
            <b>{n} {n === 5 ? 'игроков' : 'игрока'}</b>
            <small>{queued?.size === n ? `ждут: ${queued.waiting}` : 'быстрый бой'}</small>
          </button>
        ))}
      </div>
      <div className="aroom-row">
        <Input value={code} maxLength={8} placeholder="Код комнаты"
          onChange={e => setCode(e.target.value.toUpperCase())}
          onKeyDown={e => { if (e.key === 'Enter') go(); }}
          aria-label="Код комнаты" disabled={busy} />
        <Button variant="outline" disabled={busy || code.trim().length < 3} onClick={go}>
          Войти
        </Button>
        <Button variant="secondary" disabled={busy} onClick={() => { arenaClick(); onCreate(); }}>
          Своя комната
        </Button>
      </div>
      <ol className="arules">
        <li>Жми размер пати — клуб подберёт живых за секунды.</li>
        <li>Кости на выбывание: каждый раунд низший падает, ничья за вылет — переброс.</li>
        <li>Победа пишется в летопись. Фишки тут ни при чём.</li>
      </ol>
      <p className="afoot">
        <Users data-icon="inline-start" /> онлайн живой, без ботов-заглушек.
        Нет соперников — зови братух по коду комнаты.
      </p>
    </div>
  );
}
