import { cn } from '@/lib/utils';
import { Num } from '../shared';
import { MIN_STAKE, type Card } from './data';
import Hand from './Hand';
import Shoe from './Shoe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import './table.css';

/* Сукно: дуга, шуза, места дилера и игрока, лента исхода, касса. */

type Props = {
  bjp: Card[];
  bjd: Card[];
  phase: 'idle' | 'player' | 'done';
  ribbon: string;
  ribbonKind: '' | 'win' | 'lose' | 'push';
  bjbet: string;
  dealToken: number;
  stake: number;
  onBet: (v: string) => void;
  onDeal: () => void;
  onHit: () => void;
  onStand: () => void;
};

const PRESETS = [10, 50, 100, 500];

export default function Table({ bjp, bjd, phase, ribbon, ribbonKind, bjbet,
  dealToken, stake, onBet, onDeal, onHit, onStand }: Props): JSX.Element {
  const raw = Math.floor(Number(bjbet));
  const stakeNum = Number.isFinite(raw) && raw > 0 ? raw : 0;
  const playing = phase === 'player';
  return (
    <div className="felt">
      <div className="felt-arc" aria-hidden="true" />
      <Shoe dealToken={dealToken} idle={phase === 'idle'} />
      <Hand label="Дилер" cards={bjd} hideHole={playing} roundId={dealToken}
        ghost="место дилера" dim={phase === 'done' && bjp.length > 0} />
      {ribbon && (
        <div key={ribbon} className={cn('ribbon', ribbonKind && `r-${ribbonKind}`)} role="status">{ribbon}</div>
      )}
      <Hand label="Ты" cards={bjp} hideHole={false} roundId={dealToken}
        ghost="твоё место — жми «Раздать»" />
      <div className="felt-bar">
        <div className="presets" role="group" aria-label="Быстрая ставка">
          {PRESETS.map(p => (
            <button key={p} type="button" disabled={playing}
              className={cn('preset', stakeNum === p && 'sel')}
              onClick={() => onBet(String(p))}>
              <Num>{p}</Num>
            </button>
          ))}
        </div>
        <div className="crow">
          <Input value={bjbet} onChange={e => onBet(e.target.value)}
            inputMode="numeric" aria-label="Ставка на блэкджек" disabled={playing} />
          {playing
            ? <><Button onClick={onHit}>Ещё</Button><Button variant="outline" onClick={onStand}>Хватит</Button></>
            : <Button onClick={onDeal}
                onMouseDown={e => e.currentTarget.classList.add('press')}
                onMouseUp={e => e.currentTarget.classList.remove('press')}>Раздать</Button>}
          <span className="preview tnum" role="status">
            {stake > 0 && playing ? `в игре ${stake}` : `ставка от ${MIN_STAKE} фишек`}
          </span>
        </div>
      </div>
      <p className="fine">Дилер тянет до 17. Блэкджек с раздачи ×2.5, победа ×2, ничья — возврат.</p>
    </div>
  );
}
