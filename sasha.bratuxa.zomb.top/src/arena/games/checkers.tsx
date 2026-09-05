import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { arenaClick } from '../sound';
import { legalFrom as engineLegalFrom, type CheckersState, type Color } from '../../../arena/checkers';
import type { CheckerPiece, CheckersPublic } from '../proto';
import type { GameViewProps } from './index';

/* Шашки русские — доска клуба: выбор шашки, путь тапами (двойники/тройники
   набираются по точкам), сдача, мировая. Подсветка — тем же движком, что судит
   сервер (импорт, не дубль). Сервер всё равно истина: бить надо по максимуму. */

const FILES = 'abcdefgh';
const sqName = (i: number): string => `${FILES[i % 8]}${8 - Math.floor(i / 8)}`;

export default function CheckersBoard({ me, room, secsLeft, onMove }: GameViewProps): JSX.Element {
  const [sel, setSel] = useState<number | null>(null);
  const [trail, setTrail] = useState<number[]>([]);
  const g = room.gdata as unknown as CheckersPublic;
  const board: CheckerPiece[] = Array.isArray(g?.board) ? g.board : new Array(64).fill(null);
  const myColor = g?.white === me ? 'w' : g?.black === me ? 'b' : null;
  const myTurn = room.phase === 'play' && myColor !== null && g?.turn === myColor;
  const nameOf = (id: string): string => room.players.find(p => p.id === id)?.name ?? '???';
  const order = myColor === 'b' ? [...board.keys()].reverse() : [...board.keys()];

  const engineState = (): CheckersState | null => {
    if (!g || !Array.isArray(g.board) || g.board.length !== 64) return null;
    return {
      board: g.board.map(p => (p && (p.c === 'w' || p.c === 'b') && (p.k === 'm' || p.k === 'k')
        ? { c: p.c as Color, k: p.k as 'm' | 'k' } : null)),
      turn: (g.turn === 'b' ? 'b' : 'w') as Color,
      white: g.white ?? '', black: g.black ?? '',
      phase: 'play', winner: null, reason: null,
      last: null, drawOffer: null, posCounts: {}, history: [],
    };
  };
  // кандидаты с префиксом trail; следующие точки — distinct продолжение
  const seqs = (() => {
    if (sel === null || !myTurn) return [];
    const st = engineState();
    if (!st) return [];
    const all = engineLegalFrom(st, me, sel);
    return all.filter(m => trail.every((sq, i) => m.path[i] === sq));
  })();
  const nexts = new Map<number, boolean>(); // sq -> взятие?
  for (const s of seqs) {
    const nx = s.path[trail.length];
    if (nx !== undefined && !trail.includes(nx)) {
      const isCap = s.via.length > 0;
      nexts.set(nx, nexts.get(nx) || isCap);
    }
  }

  const isMine = (i: number): boolean => {
    const p = board[i];
    return !!p && myTurn && p.c === myColor;
  };
  const reset = (): void => { setSel(null); setTrail([]); };
  const send = (path: number[]): void => {
    arenaClick();
    onMove({ kind: 'checkers', path });
    reset();
  };
  const clickSq = (i: number): void => {
    if (!myTurn) return;
    if (sel === null) {
      if (isMine(i)) { arenaClick(); setSel(i); setTrail([i]); }
      return;
    }
    if (i === sel && trail.length === 1) { reset(); return; }
    if (isMine(i) && trail.length === 1) { arenaClick(); setSel(i); setTrail([i]); return; }
    if (!nexts.has(i)) return; // мимо точек — молча
    const nt = [...trail, i];
    // путь завершён, если какая-то кандидатная ветка кончается здесь
    const done = seqs.some(m => m.path.length === nt.length && m.path.every((sq, k) => sq === nt[k]));
    const longer = seqs.some(m => m.path.length > nt.length && nt.every((sq, k) => m.path[k] === sq));
    if (done && !longer) send(nt);
    else setTrail(nt);
  };

  return (
    <div className="dr-wrap">
      <div className="dr-top" aria-label="Чей ход">
        <span className="dr-turn">
          {room.phase === 'play'
            ? (myTurn ? `Твой ход${secsLeft !== null ? ` · ${secsLeft}с` : ''}` : `Ходит: ${nameOf(g?.turn === 'w' ? g?.white ?? '' : g?.black ?? '')}`)
            : 'Бой окончен'}
        </span>
        <span className="dr-count tnum" title="Шашки на доске">
          {board.filter(p => p?.c === 'w').length}:{board.filter(p => p?.c === 'b').length}
        </span>
      </div>

      <div className="dr-board" role="grid" aria-label="Шашечная доска">
        {order.map(i => {
          const p = board[i];
          const f = i % 8;
          const r = Math.floor(i / 8);
          const dark = (f + r) % 2 === 1;
          const isLast = g?.last !== null && g?.last !== undefined && (i === g.last.from || i === g.last.to);
          const inTrail = trail.includes(i);
          const isTgt = nexts.has(i);
          const isCap = nexts.get(i) === true;
          return (
            <button key={i} type="button" role="gridcell"
              aria-label={`${sqName(i)}${p ? `: ${p.c === 'w' ? 'белая' : 'чёрная'} ${p.k === 'k' ? 'дамка' : 'шашка'}` : ''}`}
              className={cn('dr-sq', dark && 'dk', isLast && 'last', inTrail && 'sel', isTgt && (isCap ? 'tcap' : 'tgt'))}
              onClick={() => clickSq(i)}>
              {p && <span className={cn('dr-pc', p.c === 'w' ? 'ww' : 'bb', p.k === 'k' && 'king')} aria-hidden="true" />}
              {f === (myColor === 'b' ? 7 : 0) && <i className="dr-coord rank">{8 - r}</i>}
              {r === (myColor === 'b' ? 0 : 7) && <i className="dr-coord file">{FILES[f]}</i>}
            </button>
          );
        })}
      </div>

      {trail.length > 1 && (
        <div className="crow">
          <Button size="sm" onClick={() => send(trail)}>Бью: {trail.map(sqName).join('-')}</Button>
          <Button variant="outline" size="sm" onClick={reset}>Заново</Button>
        </div>
      )}

      {room.phase === 'play' && myColor && (
        <div className="crow dr-actions">
          <Button variant="outline" size="sm" onClick={() => { arenaClick(); onMove({ kind: 'resign' }); }}>
            Сдаться
          </Button>
          {g?.drawOffer && g.drawOffer !== myColor ? (
            <Button size="sm" onClick={() => { arenaClick(); onMove({ kind: 'accept' }); }}>
              Принять мировую
            </Button>
          ) : (
            <Button variant="secondary" size="sm" disabled={g?.drawOffer === myColor}
              onClick={() => { arenaClick(); onMove({ kind: 'draw' }); }}>
              {g?.drawOffer === myColor ? 'Мировая предложена…' : 'Предложить мировую'}
            </Button>
          )}
        </div>
      )}
      {myTurn && (
        <p className="dr-hint">Бить обязательно и по максимуму — точки покажут. Двойник набирается тапами, кнопка «Бью» — досрочно.</p>
      )}
      {!myTurn && room.phase === 'play' && (
        <p className="dr-hint">Не твой ход — смотришь.</p>
      )}

      {g?.history && g.history.length > 0 && (
        <p className="dr-hist tnum" aria-label="Запись партии">{g.history.slice(-12).join(' ')}</p>
      )}
    </div>
  );
}
