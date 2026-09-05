import { Num } from '../shared';
import { cn } from '@/lib/utils';
import type { Risk } from './data';

/* Лента водопада: броски, лунки, лучший заход. */

export type PEntry = {
  id: number; stake: number; risk: Risk; bin: number;
  mult: number; ret: number; profit: number; t: number;
};

export const PHIST_KEY = 'sasha_plinko_hist';
export const PHIST_CAP = 30;

export function loadPHist(): PEntry[] {
  try {
    const raw = localStorage.getItem(PHIST_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as PEntry[];
    return Array.isArray(arr) ? arr.filter(e => typeof e?.mult === 'number').slice(0, PHIST_CAP) : [];
  } catch { return []; }
}

export function savePHist(es: PEntry[]): void {
  try { localStorage.setItem(PHIST_KEY, JSON.stringify(es.slice(0, PHIST_CAP))); } catch { /* приватный режим */ }
}

const RISK_SHORT: Record<Risk, string> = { low: 'заводь', mid: 'река', high: 'водопад' };

export default function PHistory({ entries, onClear }: { entries: PEntry[]; onClear: () => void }): JSX.Element {
  if (entries.length === 0) {
    return <p className="hist-empty">Водопад тихий — первого шарика ещё не было.</p>;
  }
  const spent = entries.reduce((s, e) => s + e.stake, 0);
  const back = entries.reduce((s, e) => s + e.ret, 0);
  const profit = back - spent;
  const best = entries.reduce((a, b) => (b.mult > a.mult ? b : a), entries[0]);
  return (
    <section className="pl-book" aria-label="Лента водопада">
      <div className="book-total">
        <div><dt>бросков</dt><dd><Num>{entries.length}</Num></dd></div>
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
          <li key={e.id} className={cn(e.profit >= 0 ? 'plus' : 'miss', e.mult >= 10 && 'jack')}>
            <span className="h-label">{RISK_SHORT[e.risk]} · лунка {e.bin}</span>
            <span className="h-amount">×<Num>{e.mult}</Num> +<Num>{e.ret}</Num></span>
            <span className="h-profit">{e.profit >= 0 ? `+${e.profit}` : `${e.profit}`}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
