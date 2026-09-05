import { MULTS, STEPS } from './data';
import { cn } from '@/lib/utils';

/* Сцена «Сигнала»: 8 ступеней снизу вверх. Текущая высота горит синим,
   пройденные — серым, вершина — алая. Сорванная подсвечивается падением. */

export default function Steps({ height, fallen, cashed }: {
  height: number; fallen: boolean; cashed: boolean;
}): JSX.Element {
  return (
    <ol className="ld-steps" aria-label={`Высота ${height} из ${STEPS}`}>
      {Array.from({ length: STEPS }, (_, i) => {
        const h = STEPS - 1 - i;
        const past = h < height;
        const cur = h === height && !fallen;
        const top = h === STEPS - 1;
        return (
          <li key={h}
            className={cn('ld-step', top && 'top', past && 'past', cur && 'cur', fallen && h === height && 'fell', cashed && cur && 'won')}
            aria-current={cur ? 'step' : undefined}>
            <span className="ld-h">Ступень {h + 1}</span>
            <span className="ld-mult">×<span className="tnum">{MULTS[h]}</span></span>
            {top && <span className="ld-flag" aria-hidden="true">42</span>}
          </li>
        );
      })}
    </ol>
  );
}
