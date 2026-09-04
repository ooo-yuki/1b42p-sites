import { Bomb, Gem } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CELLS, SIZE, blastDist } from './data';
import './field.css';

/* Поле 5×5: клёпаные плитки, переворот, волна от эпицентра. */

type Props = {
  field: boolean[] | null;
  open: boolean[];
  dead: boolean;
  blast: number;
  glow: number;
  onOpen: (i: number) => void;
};

export default function Field({ field, open, dead, blast, glow, onOpen }: Props): JSX.Element {
  return (
    <div className={cn('field', dead && 'dead')} role="group" aria-label="Минное поле 5 на 5">
      {open.map((op, i) => {
        const mine = field?.[i] ?? false;
        const delay = dead ? `${(blastDist(i, blast >= 0 ? blast : 12) * 45).toFixed(0)}ms` : '0ms';
        return (
          <button key={i}
            className={cn('tile', op && (mine ? 'boom' : 'gem'))}
            style={{ transitionDelay: delay, ['--gem-glow' as string]: glow.toFixed(2) }}
            onClick={() => onOpen(i)}
            disabled={!field || op}
            aria-label={op ? (mine ? 'Мина' : 'Кристалл') : `Закрытая клетка ${i + 1}, ряд ${Math.floor(i / SIZE) + 1}`}>
            {op ? (
              mine
                ? <Bomb aria-hidden data-icon="inline" />
                : <Gem aria-hidden data-icon="inline" />
            ) : (
              <span className="rivet" aria-hidden="true"><i /><i /><i /><i /></span>
            )}
          </button>
        );
      })}
      {dead && <span className="shock" aria-hidden="true" />}
    </div>
  );
}
