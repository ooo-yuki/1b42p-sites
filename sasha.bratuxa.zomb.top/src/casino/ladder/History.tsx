import { Num } from '../shared';
import { cn } from '@/lib/utils';

/* Лента сигнала: заходы, срывы, лучший подъём. */

export type LEntry = {
  id: number; stake: number; height: number;
  mult: number; ret: number; profit: number; t: number;
};

export const LHIST_KEY = 'sasha_ladder_hist';
export const LHIST_CAP = 30;

export function loadLHist(): LEntry[] {
  try {
    const raw = localStorage.getItem(LHIST_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as LEntry[];
    return Array.isArray(arr) ? arr.filter(e => typeof e?.mult === 'number').slice(0, LHIST_CAP) : [];
  } catch { return []; }
}

export function saveLHist(es: LEntry[]): void {
  try { localStorage.setItem(LHIST_KEY, JSON.stringify(es.slice(0, LHIST_CAP))); } catch { /* приватный режим */ }
}

export default function LHistory({ entries, onClear }: { entries: LEntry[]; onClear: () => void }): JSX.Element {
  if (entries.length === 0) {
    return <p className="hist-empty">Сигнал чист — первого подъёма ещё не было.</p>;
  }
  const spent = entries.reduce((s, e) => s + e.stake, 0);
  const back = entries.reduce((s, e) => s + e.ret, 0);
  const profit = back - spent;
  const best = entries.reduce((a, b) => (b.height > a.height ? b : a), entries[0]);
  return (
    <section className="ld-book" aria-label="Лента сигнала">
      <div className="book-total">
        <div><dt>заходов</dt><dd><Num>{entries.length}</Num></dd></div>
        <div><dt>Потрачено</dt><dd><Num>{spent}</Num></dd></div>
        <div><dt>Выиграно</dt><dd><Num>{back}</Num></dd></div>
        <div className={profit >= 0 ? 'plus' : 'minus'}>
          <dt>Итог</dt><dd>{profit >= 0 ? '+' : ''}<Num>{profit}</Num></dd>
        </div>
        <div><dt>Выше всех</dt><dd className="best">ступень <Num>{best.height + 1}</Num> ×<Num>{best.mult}</Num></dd></div>
        <button className="book-clear" onClick={onClear} title="Стереть ленту">Стереть</button>
      </div>
      <ul>
        {entries.map(e => (
          <li key={e.id} className={cn(e.profit >= 0 ? 'plus' : 'miss', e.height >= 6 && e.profit >= 0 && 'jack')}>
            <span className="h-label">ступень {e.height + 1}</span>
            <span className="h-amount">×<Num>{e.mult}</Num> +<Num>{e.ret}</Num></span>
            <span className="h-profit">{e.profit >= 0 ? `+${e.profit}` : `${e.profit}`}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
