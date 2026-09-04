import { Num } from '../shared';
import { choiceLabel, pocketOf } from './data';
import { cn } from '@/lib/utils';
import './rhist.css';

/* Журнал салона: ставки, лента последних шаров, итоги. */

export type REntry = {
  id: number; choice: string; n: number; stake: number;
  ret: number; profit: number; t: number;
};

export const RHIST_KEY = 'sasha_roulette_hist';
export const RHIST_CAP = 30;

export function loadRHist(): REntry[] {
  try {
    const raw = localStorage.getItem(RHIST_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as REntry[];
    return Array.isArray(arr) ? arr.filter(e => typeof e?.n === 'number').slice(0, RHIST_CAP) : [];
  } catch { return []; }
}

export function saveRHist(es: REntry[]): void {
  try { localStorage.setItem(RHIST_KEY, JSON.stringify(es.slice(0, RHIST_CAP))); } catch { /* приватный режим */ }
}

/** Жар чисел по твоим шарам: топ-3 частоты из последних 30. */
export function hotNumbers(entries: REntry[]): Set<number> {
  const freq = new Map<number, number>();
  for (const e of entries.slice(0, 30)) freq.set(e.n, (freq.get(e.n) ?? 0) + 1);
  return new Set(
    [...freq.entries()]
      .sort((a, b) => b[1] - a[1] || a[0] - b[0])
      .slice(0, 3)
      .filter(([, c]) => c >= 2)
      .map(([n]) => n),
  );
}

export default function RHistory({ entries, onClear }: { entries: REntry[]; onClear: () => void }): JSX.Element {
  const last = entries.slice(0, 12);
  const staked = entries.reduce((s, e) => s + e.stake, 0);
  const back = entries.reduce((s, e) => s + e.ret, 0);
  const profit = back - staked;
  return (
    <section className="rl-book" aria-label="Журнал рулетки">
      {last.length > 0 && (
        <div className="last-balls" aria-label="Последние шары">
          {last.map(e => (
            <span key={e.id} className={cn('lball', pocketOf(e.n))} title={`Шар ${e.n}`}>
              <Num>{e.n}</Num>
            </span>
          ))}
        </div>
      )}
      {entries.length === 0 ? (
        <p className="hist-empty">Салон ждёт первого шара — крути.</p>
      ) : (
        <>
          <div className="book-total">
            <div><dt>Шаров</dt><dd><Num>{entries.length}</Num></dd></div>
            <div><dt>Поставлено</dt><dd><Num>{staked}</Num></dd></div>
            <div><dt>Возврат</dt><dd><Num>{back}</Num></dd></div>
            <div className={profit >= 0 ? 'plus' : 'minus'}>
              <dt>Итог</dt><dd>{profit >= 0 ? '+' : ''}<Num>{profit}</Num></dd>
            </div>
            <button className="book-clear" onClick={onClear} title="Стереть журнал">Стереть</button>
          </div>
          <ul>
            {entries.map(e => (
              <li key={e.id} className={e.profit >= 0 ? 'plus' : 'minus'}>
                <span className={cn('lball sm', pocketOf(e.n))}><Num>{e.n}</Num></span>
                <span className="h-label">{choiceLabel(e.choice)}<small>ставка <Num>{e.stake}</Num></small></span>
                <span className="h-amount">+<Num>{e.ret}</Num></span>
                <span className="h-profit">{e.profit >= 0 ? `+${e.profit}` : `${e.profit}`}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
