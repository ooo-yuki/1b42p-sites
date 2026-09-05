import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { arenaClick } from '../sound';
import { BOARD } from '../../../arena/monopoly';
import type { MonoPublic } from '../proto';
import type { GameViewProps } from './index';

/* Монополия 42 — поле клуба: периметр 11×11, центр-панель (кубики, покупка,
   стройка, тюрьма), фишки братух, дома пипсами. Сервер — истина и кубики. */

const TOKEN = ['#0060AA', '#E31E25', '#3ddc84', '#c678dd', '#f7922c'];
const GROUP_C: Record<string, string> = {
  brown: '#8d5a2b', lblue: '#7ec8e3', pink: '#d93a96', orange: '#f7922c',
  red: '#E31E25', yellow: '#ffd23f', green: '#3ddc84', blue: '#0060AA',
};

/** Позиция клетки i (0–39) на сетке 11×11. */
function cellPos(i: number): { r: number; c: number } {
  if (i <= 10) return { r: 10, c: 10 - i };
  if (i <= 20) return { r: 20 - i, c: 0 };
  if (i <= 30) return { r: 0, c: i - 20 };
  return { r: i - 30, c: 10 };
}

const shortName = (n: string): string =>
  n.replace('Электростанция 42', 'Эл-ство').replace('Водокачка 42', 'Вода')
    .replace('Саша-территория', 'Саша').replace('Вокзал ', 'Вкз. ');

export default function MonoBoard({ me, room, secsLeft, onMove }: GameViewProps): JSX.Element {
  const [buildCell, setBuildCell] = useState<number | null>(null);
  const g = room.gdata as unknown as MonoPublic;
  const players = Array.isArray(g?.players) ? g.players : [];
  const myIdx = players.findIndex(p => p.id === me);
  const myTurn = room.phase === 'play' && g?.turn === me;
  const nameOf = (id: string): string => room.players.find(p => p.id === id)?.name ?? '???';
  const tokenOf = (id: string): string => {
    const i = players.findIndex(p => p.id === id);
    return TOKEN[Math.max(0, i) % TOKEN.length];
  };
  const owner = (g?.owner ?? {}) as Record<string, string>;
  const houses = (g?.houses ?? {}) as Record<string, number>;
  const awaitingBuy = myTurn && g?.awaiting === 'decide';
  const offer = typeof g?.offerCell === 'number' ? BOARD[g.offerCell] : null;
  const meP = myIdx >= 0 ? players[myIdx] : null;
  // стройка: свои улицы полных групп до броска
  const buildable = (cell: number): boolean => {
    if (!myTurn || !meP || meP.inJail || g?.rolled || g?.awaiting) return false;
    const c = BOARD[cell];
    if (!c || c.kind !== 'street' || owner[String(cell)] !== me) return false;
    if (!BOARD.every((x, i) => x.group !== c.group || owner[String(i)] === me)) return false;
    if ((houses[String(cell)] ?? 0) >= 5) return false;
    return meP.money >= (c.house ?? 0);
  };

  const grid: (number | null)[][] = Array.from({ length: 11 }, () => new Array(11).fill(null));
  for (let i = 0; i < 40; i++) {
    const { r, c } = cellPos(i);
    grid[r][c] = i;
  }
  const flat: { key: string; cell: number | null; r: number; c: number }[] = [];
  grid.forEach((rowArr, r) => rowArr.forEach((cell, c) => {
    if (cell !== null || (r === 1 && c === 1)) flat.push({ key: cell === null ? 'mo-center' : `mo-${cell}`, cell, r, c });
  }));

  return (
    <div className="mo-wrap">
      <div className="mo-top" aria-label="Чей ход">
        <span className="mo-turn">
          {room.phase === 'play'
            ? (myTurn ? `Твой ход${secsLeft !== null ? ` · ${secsLeft}с` : ''}` : `Ходит: ${nameOf(g?.turn ?? '')}`)
            : 'Бой окончен'}
        </span>
        {g?.doubles ? <span className="mo-dbl tnum" title="Дубли подряд">дубли {g.doubles}</span> : null}
      </div>

      <div className="mo-board" role="grid" aria-label="Поле монополии">
        {flat.map(({ key, cell, r, c }) => {
          if (cell === null) {
            return (
              <div key="mo-center" className="mo-center" style={{ gridRow: '2 / 11', gridColumn: '2 / 11' }}>
                  <div className="mo-bank tnum">
                    {players.filter(p => !p.bankrupt).map(p => (
                      <span key={p.id} className={cn(p.id === me && 'me', p.bankrupt && 'out')}>
                        <i style={{ background: tokenOf(p.id) }} />
                        {nameOf(p.id)} · {p.money}
                        {p.inJail ? ' · в тюрьме' : ''}
                      </span>
                    ))}
                  </div>
                  {room.phase === 'play' && myTurn && !g?.rolled && !g?.awaiting && !(meP?.inJail) && (
                    <Button size="lg" className="mo-dice"
                      onClick={() => { arenaClick(); onMove({ kind: 'roll' }); }}>
                      Кинуть кубики
                    </Button>
                  )}
                  {room.phase === 'play' && myTurn && meP?.inJail && (
                    <div className="crow">
                      <Button size="sm" disabled={meP.money < 50}
                        onClick={() => { arenaClick(); onMove({ kind: 'payJail' }); }}>
                        Залог 50
                      </Button>
                      {meP.jailCard && (
                        <Button size="sm" variant="secondary"
                          onClick={() => { arenaClick(); onMove({ kind: 'useCard' }); }}>
                          Карта выхода
                        </Button>
                      )}
                      <Button size="sm" variant="outline"
                        onClick={() => { arenaClick(); onMove({ kind: 'roll' }); }}>
                        Кинуть на дубль
                      </Button>
                    </div>
                  )}
                  {awaitingBuy && offer && (
                    <div className="mo-offer" role="dialog" aria-label="Покупка улицы">
                      <p>«{offer.name}» за <b className="tnum">{offer.price}</b>? У тебя <b className="tnum">{meP?.money ?? 0}</b>.</p>
                      <div className="crow">
                        <Button size="sm" disabled={(meP?.money ?? 0) < (offer.price ?? 0)}
                          onClick={() => { arenaClick(); onMove({ kind: 'buy' }); }}>
                          Беру!
                        </Button>
                        <Button size="sm" variant="outline"
                          onClick={() => { arenaClick(); onMove({ kind: 'pass' }); }}>
                          Пас
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
            );
          }
          const def = BOARD[cell!];
          const o = owner[String(cell)];
          const h = houses[String(cell)] ?? 0;
          const here = players.filter(p => !p.bankrupt && p.pos === cell);
          const canB = buildable(cell!);
          return (
            <button key={key} type="button" role="gridcell"
              style={{ gridRow: r + 1, gridColumn: c + 1 }}
              aria-label={`${cell}: ${def.name}${o ? `, хозяин ${nameOf(o)}` : ''}${h ? `, домов ${h}` : ''}`}
              className={cn('mo-cell', `k-${def.kind}`, o === me && 'mine', buildCell === cell && 'sel')}
              onClick={() => {
                if (!canB || cell === null) return;
                if (buildCell === cell) {
                  arenaClick();
                  onMove({ kind: 'build', cell });
                  setBuildCell(null);
                } else {
                  arenaClick();
                  setBuildCell(cell);
                }
              }}
              title={`${def.name}${def.price ? ` · ${def.price}` : ''}${o ? ` · ${nameOf(o)}` : ''}${h ? ` · домов: ${h}` : ''}`}>
              {def.group && <i className="mo-gbar" style={{ background: GROUP_C[def.group] ?? '#808080' }} />}
              <b>{shortName(def.name)}</b>
              {def.price ? <small className="tnum">{def.price}</small> : null}
              {o && <i className="mo-flag" style={{ background: tokenOf(o) }} title={nameOf(o)} />}
              {h > 0 && (
                <span className="mo-houses" aria-hidden="true">
                  {Array.from({ length: Math.min(5, h) }).map((_, k) => <i key={k} className={cn(h >= 5 && 'hotel')} />)}
                </span>
              )}
              {here.length > 0 && (
                <span className="mo-tokens" aria-hidden="true">
                  {here.map(p => <i key={p.id} style={{ background: tokenOf(p.id) }} />)}
                </span>
              )}
              {canB && <em className="mo-plus" aria-hidden="true">+1</em>}
            </button>
          );
        })}
      </div>

      {room.phase === 'play' && myTurn && (
        <div className="crow mo-actions">
          <Button variant="outline" size="sm" onClick={() => { arenaClick(); onMove({ kind: 'resign' }); }}>
            Сдаться
          </Button>
        </div>
      )}
      <p className="mo-hint">Стройка — до броска, ткни свою улицу полной группы. Без аукциона, без залога: дома сами распродаются за полцены.</p>

      {g?.history && g.history.length > 0 && (
        <p className="mo-hist tnum" aria-label="Летопись партии">{g.history.slice(-6).join(' · ')}</p>
      )}
    </div>
  );
}
