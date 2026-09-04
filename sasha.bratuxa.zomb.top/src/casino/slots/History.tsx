import { ItemIcon } from '../../casino-icons';
import { Num } from '../shared';
import { cn } from '@/lib/utils';
import type { WinKind } from './data';
import './shist.css';

/* Лента автомата: спины, итоги, лучший заход. */

export type SEntry = {
  id: number; reels: [string, string, string]; kind: WinKind;
  ret: number; profit: number; t: number;
};

export const SHIST_KEY = 'sasha_slots_hist';
export const SHIST_CAP = 30;

export function loadSHist(): SEntry[] {
  try {
    const raw = localStorage.getItem(SHIST_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as SEntry[];
    return Array.isArray(arr) ? arr.filter(e => Array.isArray(e?.reels)).slice(0, SHIST_CAP) : [];
  } catch { return []; }
}

export function saveSHist(es: SEntry[]): void {
  try { localStorage.setItem(SHIST_KEY, JSON.stringify(es.slice(0, SHIST_CAP))); } catch { /* приватный режим */ }
}

const KIND_RU: Record<WinKind, string> = {
  jackpot: 'джекпот 777', trips: 'три', pair: 'пара', miss: 'мимо',
};

export default function SHistory({ entries, onClear }: { entries: SEntry[]; onClear: () => void }): JSX.Element {
  if (entries.length === 0) {
    return <p className="hist-empty">Автомат греется — первого спина ещё не было.</p>;
  }
  const spent = entries.length * 50;
  const back = entries.reduce((s, e) => s + e.ret, 0);
  const profit = back - spent;
  const best = entries.reduce((a, b) => (b.ret > a.ret ? b : a), entries[0]);
  return (
    <section className="sl-book" aria-label="Лента автомата">
      <div className="book-total">
        <div><dt>спинов</dt><dd><Num>{entries.length}</Num></dd></div>
        <div><dt>Потрачено</dt><dd><Num>{spent}</Num></dd></div>
        <div><dt>Выиграно</dt><dd><Num>{back}</Num></dd></div>
        <div className={profit >= 0 ? 'plus' : 'minus'}>
          <dt>Итог</dt><dd>{profit >= 0 ? '+' : ''}<Num>{profit}</Num></dd>
        </div>
        <div><dt>Лучший</dt><dd className="best">
          {best.reels.map((r, i) => <ItemIcon key={i} name={r} />)} <Num>{best.ret}</Num>
        </dd></div>
        <button className="book-clear" onClick={onClear} title="Стереть ленту">Стереть</button>
      </div>
      <ul>
        {entries.map(e => (
          <li key={e.id} className={cn(e.kind === 'miss' ? 'miss' : 'plus', e.kind === 'jackpot' && 'jack')}>
            <span className="s-reels">{e.reels.map((r, i) => <ItemIcon key={i} name={r} />)}</span>
            <span className="h-label">{KIND_RU[e.kind]}</span>
            <span className="h-amount">+<Num>{e.ret}</Num></span>
            <span className="h-profit">{e.profit >= 0 ? `+${e.profit}` : `${e.profit}`}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
