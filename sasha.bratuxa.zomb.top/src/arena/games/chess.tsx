import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { arenaClick } from '../sound';
import { legalFrom as engineLegalFrom, type ChessState, type Color, type Kind, type Move as EngineMove } from '../../../arena/chess';
import type { ChessPiece, ChessPublic } from '../proto';
import type { GameViewProps } from './index';

/* Шахматы — доска клуба: выбор фигуры, ход, превращение, сдача, мировая.
   Подсветка — тем же движком, что судит сервер (импорт, не дубль):
   точки — тихие ходы, кольца — взятия. Сервер всё равно истина. */

const GLYPH: Record<string, string> = {
  wp: '♙', wn: '♘', wb: '♗', wr: '♖', wq: '♕', wk: '♚',
  bp: '♟', bn: '♞', bb: '♝', br: '♜', bq: '♛', bk: '♚',
};
const FILES = 'abcdefgh';
const sqName = (i: number): string => `${FILES[i % 8]}${8 - Math.floor(i / 8)}`;
const fmtClock = (ms: number): string => {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};
const PROMOS = [
  { k: 'q', g: '♕', label: 'Ферзь' },
  { k: 'r', g: '♖', label: 'Ладья' },
  { k: 'b', g: '♗', label: 'Слон' },
  { k: 'n', g: '♘', label: 'Конь' },
];

export default function ChessBoard({ me, room, onMove }: GameViewProps): JSX.Element {
  const [sel, setSel] = useState<number | null>(null);
  const [promo, setPromo] = useState<{ from: number; to: number } | null>(null);
  const g = room.gdata as unknown as ChessPublic;
  // живой тик часов: перерендер дважды в секунду, пока бой идёт
  const [, setTick] = useState(0);
  useEffect(() => {
    if (room.phase !== 'play') return;
    const id = window.setInterval(() => setTick(t => t + 1), 500);
    return () => window.clearInterval(id);
  }, [room.phase, room.code]);
  const liveClock = (c: 'w' | 'b'): number => {
    const base = g?.clock?.[c] ?? (g?.tcMin ?? 5) * 60000;
    if (room.phase !== 'play' || g?.turn !== c || typeof g?.stamp !== 'number') return base;
    return Math.max(0, base - (Date.now() - g.stamp));
  };
  const board: ChessPiece[] = Array.isArray(g?.board) ? g.board : new Array(64).fill(null);
  const myColor = g?.white === me ? 'w' : g?.black === me ? 'b' : null;
  const myTurn = room.phase === 'play' && myColor !== null && g?.turn === myColor;
  // состояние для движка собираем из открытого среза сервера
  const engineState = (): ChessState | null => {
    if (!g || !Array.isArray(g.board) || g.board.length !== 64) return null;
    const kinds = new Set(['p', 'n', 'b', 'r', 'q', 'k']);
    return {
      board: g.board.map(p => (p && (p.c === 'w' || p.c === 'b') && kinds.has(p.k)
        ? { c: p.c as Color, k: p.k as Kind } : null)),
      turn: (g.turn === 'b' ? 'b' : 'w') as Color,
      castling: g.castling ?? { wk: false, wq: false, bk: false, bq: false },
      ep: typeof g.ep === 'number' ? g.ep : null,
      half: 0, full: g.full ?? 1,
      white: g.white ?? '', black: g.black ?? '',
      phase: 'play', winner: null, reason: null,
      last: null, check: !!g.check, drawOffer: null, posCounts: {}, history: [],
      tc: (g.tcMin ?? 5) * 60000,
      clock: { w: g.clock?.w ?? (g.tcMin ?? 5) * 60000, b: g.clock?.b ?? (g.tcMin ?? 5) * 60000 },
      stamp: null,
    };
  };
  // цели выбранной фигуры — легальные ходы движка
  const targets = new Map<number, boolean>(); // to -> взятие?
  if (sel !== null && myTurn) {
    const st = engineState();
    if (st) {
      for (const m of engineLegalFrom(st, me, sel)) {
        const t = board[m.to];
        targets.set(m.to, (!!t && t.c !== myColor) || (m as EngineMove).ep === true);
      }
    }
  }
  const kingSq = board.findIndex(p => p && p.c === g?.turn && p.k === 'k');
  const checkSq = g?.check ? kingSq : -1;
  const nameOf = (id: string): string => room.players.find(p => p.id === id)?.name ?? '???';
  // чёрные смотрят с своей стороны
  const order = myColor === 'b' ? [...board.keys()].reverse() : [...board.keys()];

  const isMine = (i: number): boolean => {
    const p = board[i];
    return !!p && myTurn && p.c === myColor;
  };
  const isPromoRank = (i: number): boolean => {
    const p = sel !== null ? board[sel] : null;
    if (!p || p.k !== 'p') return false;
    const r = Math.floor(i / 8);
    return (p.c === 'w' && r === 0) || (p.c === 'b' && r === 7);
  };
  const send = (from: number, to: number, promote?: string): void => {
    arenaClick();
    onMove(promote ? { kind: 'chess', from, to, promote } : { kind: 'chess', from, to });
    setSel(null);
    setPromo(null);
  };
  const clickSq = (i: number): void => {
    if (!myTurn) return;
    if (promo) return;
    if (sel === null) {
      if (isMine(i)) { arenaClick(); setSel(i); }
      return;
    }
    if (i === sel) { setSel(null); return; }
    if (isMine(i)) { arenaClick(); setSel(i); return; }
    if (!targets.has(i)) return; // мимо точек — молча, сервер не дёргаем
    // цель: пешка на последней — спросить в кого
    if (isPromoRank(i) && board[i]?.c !== myColor) { setPromo({ from: sel, to: i }); return; }
    send(sel, i);
  };

  return (
    <div className="ch-wrap">
      <div className="ch-top" aria-label="Чей ход">
        <span className={cn('ch-turn', g?.turn === 'w' && 'ww', g?.turn === 'b' && 'bb')}>
          {room.phase === 'play'
            ? (myTurn ? 'Твой ход' : `Ходит: ${nameOf(g?.turn === 'w' ? g?.white ?? '' : g?.black ?? '')}`)
            : 'Бой окончен'}
        </span>
        {g?.check && room.phase === 'play' && <em className="ch-check">шах!</em>}
        <span className="ch-full tnum" title="Ход партии">ход {g?.full ?? 1}</span>
      </div>
      <div className="ch-clocks tnum" aria-label={`Контроль ${g?.tcMin ?? 5} минут на партию`}>
        {(['w', 'b'] as const).map(c => {
          const live = liveClock(c);
          const active = room.phase === 'play' && g?.turn === c;
          return (
            <span key={c} className={cn('ch-clock', active && 'on', room.phase === 'play' && live <= 10000 && 'low')}>
              {c === 'w' ? '○' : '●'} {nameOf(c === 'w' ? g?.white ?? '' : g?.black ?? '')} · {fmtClock(live)}
            </span>
          );
        })}
      </div>

      <div className="ch-board" role="grid" aria-label="Шахматная доска">
        {order.map(i => {
          const p = board[i];
          const f = i % 8;
          const r = Math.floor(i / 8);
          const light = (f + r) % 2 === 1;
          const isLast = g?.last !== null && g?.last !== undefined && (i === g.last.from || i === g.last.to);
          const isTgt = targets.has(i);
          const isCap = targets.get(i) === true;
          return (
            <button key={i} type="button" role="gridcell"
              aria-label={`${sqName(i)}${p ? `: ${p.c === 'w' ? 'белая' : 'чёрная'} ${PROMOS.find(x => x.k === p.k)?.label ?? p.k}` : ''}`}
              className={cn('ch-sq', light && 'lt', isLast && 'last', i === checkSq && 'chk', sel === i && 'sel', isTgt && (isCap ? 'tcap' : 'tgt'))}
              onClick={() => clickSq(i)}>
              {p && <span className={cn('ch-pc', p.c === 'w' && 'ww')}>{GLYPH[`${p.c}${p.k}`] ?? '?'}</span>}
              {f === (myColor === 'b' ? 7 : 0) && <i className="ch-coord rank">{8 - r}</i>}
              {r === (myColor === 'b' ? 0 : 7) && <i className="ch-coord file">{FILES[f]}</i>}
            </button>
          );
        })}
      </div>

      {promo && (
        <div className="ch-promo" role="dialog" aria-label="В кого превращаем пешку">
          <p>Пешка дошла! В кого превращаем?</p>
          <div className="crow">
            {PROMOS.map(x => (
              <Button key={x.k} onClick={() => send(promo.from, promo.to, x.k)} aria-label={x.label}>
                <span className="ch-pc ww" aria-hidden>{x.g}</span>
              </Button>
            ))}
            <Button variant="outline" onClick={() => setPromo(null)}>Отмена</Button>
          </div>
        </div>
      )}

      {room.phase === 'play' && myColor && (
        <div className="crow ch-actions">
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
      {!myTurn && room.phase === 'play' && (
        <p className="ch-hint">
          {myColor === null ? 'Смотришь чужой бой.' : 'Не твой ход — смотришь.'} Легальность судит сервер: кривой ход вернётся ошибкой.
        </p>
      )}

      {g?.history && g.history.length > 0 && (
        <p className="ch-hist tnum" aria-label="Запись партии">{g.history.slice(-12).join(' ')}</p>
      )}
    </div>
  );
}
