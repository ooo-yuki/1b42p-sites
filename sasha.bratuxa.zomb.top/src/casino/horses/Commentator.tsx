import { ItemIcon } from '../../casino-icons';
import { cn } from '@/lib/utils';
import './booth.css';

/* Комментаторская будка: живой голос заезда, последнее — подсвечено. */

export default function Commentator({ lines, racing }: { lines: string[]; racing: boolean }): JSX.Element {
  const shown = lines.slice(-3);
  return (
    <section className={cn('booth', racing && 'live')} aria-live="polite" aria-label="Комментатор">
      <span className="booth-mic"><ItemIcon name="radio" /></span>
      <div className="booth-lines">
        {shown.length === 0 && <p className="idle">Трибуна гудит. Жми «Старт» — комментатор проснётся.</p>}
        {shown.map((s, i) => (
          <p key={`${shown.length}-${i}-${s}`} className={i === shown.length - 1 ? 'fresh' : ''}>{s}</p>
        ))}
      </div>
      <span className={cn('booth-dot', racing && 'on')} aria-hidden="true" />
    </section>
  );
}
