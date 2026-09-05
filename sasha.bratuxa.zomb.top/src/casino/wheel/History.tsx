import { Num } from '../shared';
import { cn } from '@/lib/utils';

/* Лента фортуны: спины, сектора, лучший клин. */

export type WEntry = {
  id: number; stake: number; sector: number;
  mult: number; ret: number; profit: number; t: number;
};

export const WHIST_KEY = 'sasha_wheel_hist';
export const WHIST_CAP = 30;

export function loadWHist(): WEntry[] {
  try {
    const raw = localStorage.getItem(WHIST_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as WEntry[];
    return Array.isArray(arr) ? arr.filter(e => typeof e?.mult === 'number').slice(0, WHIST_CAP) : [];
  } catch { return []; }
}

export function saveWHist(es: WEntry[]): void {
  try { localStorage.setItem(WHIST_KEY, JSON.stringify(es.slice(0, WHIST_CAP))); } catch { /* приватный режим */ }
}

export default function WHistory({ entries, onClear }: { entries: WEntry[]; onClear: () => void }): JSX.Element {
  if (entries.length === 0) {
    return <p className="hist-empty">Колесо смазано — первого спина ещё не было.</p>;
  }
  const spent = entries.reduce((s, e) => s + e.stake, 0);
  const back = entries.reduce((s, e) => s + e.ret, 0);
  const profit = back - spent;
  const best = entries.reduce((a, b) => (b.mult > a.mult ? b : a), entries[0]);
  return (
    <section className="fw-book" aria-label="Лента фортуны">
      <div className="book-total">
        <div><dt>спинов</dt><dd><Num>{entries.length}</Num></dd></div>
        <div><dt>Потрачено</dt><dd><Num>{spent}</Num></dd></div>
        <div><dt>Выиграно</dt><dd><Num>{back}</Num></dd></div>
        <div className={profit >= 0 ? 'plus' : 'minus'}>
          <dt>Итог</dt><dd>{profit >= 0 ? '+' : ''}<Num>{profit}</Num></dd>
        </div>
        <div><dt>Лучший</dt><dd className="best">×<Num>{best.mult}</Num> <Num>{best.ret}</Num></dd></div>
        <button className="book-clear" onClick={onClear} title="Стереть ленту">Стереть</button>
      </div>
      <ul>
        {entries.map(e => (
          <li key={e.id} className={cn(e.profit >= 0 ? 'plus' : 'miss', e.mult >= 4 && 'jack')}>
            <span className="h-label">клин {e.sector + 1}</span>
            <span className="h-amount">×<Num>{e.mult}</Num> +<Num>{e.ret}</Num></span>
            <span className="h-profit">{e.profit >= 0 ? `+${e.profit}` : `${e.profit}`}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
