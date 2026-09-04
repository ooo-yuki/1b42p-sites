import { Num } from '../shared';
import { cn } from '@/lib/utils';
import type { Outcome } from './data';
import './bhist.css';

/* Счета салона: раздачи, серии, итоги. */

export type BJEntry = {
  id: number; stake: number; pv: number; dv: number;
  outcome: Outcome; ret: number; profit: number; t: number;
};

export const BHIST_KEY = 'sasha_bj_hist';
export const BHIST_CAP = 30;

export function loadBjHist(): BJEntry[] {
  try {
    const raw = localStorage.getItem(BHIST_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as BJEntry[];
    return Array.isArray(arr) ? arr.filter(e => typeof e?.stake === 'number').slice(0, BHIST_CAP) : [];
  } catch { return []; }
}

export function saveBjHist(es: BJEntry[]): void {
  try { localStorage.setItem(BHIST_KEY, JSON.stringify(es.slice(0, BHIST_CAP))); } catch { /* приватный режим */ }
}

const OUTCOME_RU: Record<Outcome, string> = {
  natural: 'блэкджек', win: 'победа', push: 'ничья', lose: 'дилер', bust: 'перебор',
};

/** Текущая серия: плюс — победы, минус — поражения (ничьи не рвут). */
export function streakOf(entries: BJEntry[]): number {
  let s = 0;
  for (const e of entries) {
    if (e.outcome === 'push') continue;
    const w = e.profit > 0;
    if (s === 0) s = w ? 1 : -1;
    else if ((s > 0) === w) s += w ? 1 : -1;
    else break;
  }
  return s;
}

export default function BjHistory({ entries, onClear }: { entries: BJEntry[]; onClear: () => void }): JSX.Element {
  if (entries.length === 0) {
    return <p className="hist-empty">Салон пуст — дилер тасует шузу.</p>;
  }
  const staked = entries.reduce((s, e) => s + e.stake, 0);
  const back = entries.reduce((s, e) => s + e.ret, 0);
  const profit = back - staked;
  const streak = streakOf(entries);
  return (
    <section className="bj-book" aria-label="Счета салона">
      <div className="book-total">
        <div><dt>Раздач</dt><dd><Num>{entries.length}</Num></dd></div>
        <div><dt>Поставлено</dt><dd><Num>{staked}</Num></dd></div>
        <div><dt>Возврат</dt><dd><Num>{back}</Num></dd></div>
        <div className={profit >= 0 ? 'plus' : 'minus'}>
          <dt>Итог</dt><dd>{profit >= 0 ? '+' : ''}<Num>{profit}</Num></dd>
        </div>
        <div><dt>Серия</dt><dd className={cn(streak > 0 && 'plus', streak < 0 && 'minus')}>
          {streak > 0 ? `+${streak}` : streak < 0 ? `${streak}` : '—'}
        </dd></div>
        <button className="book-clear" onClick={onClear} title="Стереть счета">Стереть</button>
      </div>
      <ul>
        {entries.map(e => (
          <li key={e.id} className={e.profit > 0 ? 'plus' : e.profit < 0 ? 'minus' : 'even'}>
            <span className="h-label">{OUTCOME_RU[e.outcome]} <Num>{e.pv}:{e.dv}</Num>
              <small>ставка <Num>{e.stake}</Num></small></span>
            <span className="h-amount">+<Num>{e.ret}</Num></span>
            <span className="h-profit">{e.profit > 0 ? `+${e.profit}` : e.profit < 0 ? `${e.profit}` : 'возврат'}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
