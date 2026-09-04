import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { arenaClick } from '../sound';
import type { DCard, DurakPublic } from '../proto';
import type { GameViewProps } from './index';

/* Дурак подкидной — стол: пары атак, рука, козырь, кнопки ролей.
   Сервер — истина (отбивает кривые ходы ошибкой), здесь — подсветка
   легального: роль + ранг стола + локальный beats() для прицела. */

const SUIT_GLYPH: Record<string, string> = { S: '♠', H: '♥', D: '♦', C: '♣' };
const RANK_LABEL: Record<number, string> = { 11: 'В', 12: 'Д', 13: 'К', 14: 'Т' };
const RED = new Set(['H', 'D']);

export const cardText = (c: DCard): string =>
  `${RANK_LABEL[c.r] ?? c.r}${SUIT_GLYPH[c.s] ?? c.s}`;
const cardKey = (c: DCard): string => `${c.r}${c.s}`;

function beatsLocal(a: DCard, d: DCard, trump: string): boolean {
  if (d.s === a.s) return d.r > a.r;
  return d.s === trump && a.s !== trump;
}

function DCardView({ c, sel, dim, onPick }: {
  c: DCard; sel?: boolean; dim?: boolean; onPick?: () => void;
}): JSX.Element {
  return (
    <button type="button" disabled={!onPick}
      className={cn('dcard', RED.has(c.s) && 'red', sel && 'sel', dim && 'dim')}
      onClick={onPick} aria-label={`Карта ${cardText(c)}`}>
      <b>{RANK_LABEL[c.r] ?? c.r}</b>
      <i>{SUIT_GLYPH[c.s] ?? c.s}</i>
    </button>
  );
}

export default function DurakTable({ me, room, hand, onMove }: GameViewProps): JSX.Element {
  const [sel, setSel] = useState<string | null>(null);
  const g = room.gdata as unknown as DurakPublic;
  const table = g?.table ?? [];
  const trump = g?.trump ?? 'S';
  const iAtk = g?.attacker === me;
  const iDef = g?.defender === me;
  const uncovered = table.filter(t => t.d === null);
  const allCovered = table.length > 0 && uncovered.length === 0;
  const ranks = new Set(table.flatMap(t => [t.a.r, ...(t.d ? [t.d.r] : [])]));
  const nameOf = (id: string): string => room.players.find(p => p.id === id)?.name ?? '???';

  const canThrow = (c: DCard): boolean => {
    if (iDef || table.length >= 6) return false;
    if (table.length === 0) return iAtk;
    return ranks.has(c.r);
  };
  const canCover = (c: DCard, target: DCard): boolean =>
    iDef && uncovered.some(t => t.a.r === target.r && t.a.s === target.s) && beatsLocal(target, c, trump);

  const clickHand = (c: DCard): void => {
    if (iDef) {
      if (uncovered.length === 1) {
        const t = uncovered[0].a;
        if (beatsLocal(t, c, trump)) { arenaClick(); onMove({ kind: 'defend', card: c, target: t }); }
        return;
      }
      const s = sel ? uncovered.find(t => cardKey(t.a) === sel)?.a : undefined;
      if (s && beatsLocal(s, c, trump)) {
        arenaClick();
        onMove({ kind: 'defend', card: c, target: s });
        setSel(null);
      }
      return;
    }
    if (canThrow(c)) { arenaClick(); onMove({ kind: 'attack', card: c }); }
  };

  return (
    <div className="du-wrap">
      <div className="du-top" aria-label="Стол и колода">
        <span className={cn('du-trump', RED.has(trump) && 'red')} title="Козырная масть">
          козырь {SUIT_GLYPH[trump] ?? trump}
        </span>
        <span className="du-deck tnum" title="Карт в колоде">колода {g?.deckN ?? 0}</span>
      </div>

      <div className="du-foes" aria-label="Руки соперников">
        {room.players.filter(p => p.id !== me).map(p => (
          <span key={p.id} className={cn('du-foe', p.id === g?.attacker && 'atk', p.id === g?.defender && 'def')}>
            <i className="du-back" aria-hidden="true" />
            <b>{p.name}</b>
            <small className="tnum">{g?.handN?.[p.id] ?? 0}</small>
            {p.id === g?.attacker && <em>атака</em>}
            {p.id === g?.defender && <em>оборона</em>}
          </span>
        ))}
      </div>

      <div className="du-table" aria-label="Карты на столе">
        {table.length === 0 && (
          <p className="idle">{iAtk ? 'Ты заходишь — жми карту.' : `Ждём захода: ${nameOf(g?.attacker ?? '')}.`}</p>
        )}
        {table.map((t, i) => (
          <span key={i} className="du-pair">
            <button type="button" disabled={!iDef || t.d !== null}
              className={cn('dcard atk', t.d === null && sel === cardKey(t.a) && 'sel')}
              onClick={() => t.d === null && setSel(s => (s === cardKey(t.a) ? null : cardKey(t.a)))}
              aria-label={`Атака ${cardText(t.a)}`}>
              <b>{RANK_LABEL[t.a.r] ?? t.a.r}</b>
              <i className={cn(RED.has(t.a.s) && 'red')}>{SUIT_GLYPH[t.a.s] ?? t.a.s}</i>
            </button>
            {t.d !== null && <DCardView c={t.d} />}
          </span>
        ))}
      </div>

      {(iAtk || iDef) && table.length > 0 && (
        <div className="crow du-actions">
          {iAtk && (
            <Button disabled={!allCovered}
              onClick={() => { arenaClick(); onMove({ kind: 'done' }); }}>
              {allCovered ? 'Отбой — бита!' : `Ждём покрытия (${uncovered.length})`}
            </Button>
          )}
          {iDef && (
            <Button variant="secondary" onClick={() => { arenaClick(); onMove({ kind: 'take' }); }}>
              Взять ({table.length})
            </Button>
          )}
        </div>
      )}
      {iDef && uncovered.length > 1 && !sel && (
        <p className="du-hint">Ткни карту атаки, потом свою — чем бить.</p>
      )}

      <div className="du-hand" aria-label="Твоя рука">
        {hand.map((c, i) => (
          <DCardView key={`${cardKey(c)}-${i}`} c={c}
            dim={!iDef && !canThrow(c)}
            onPick={(iDef || canThrow(c)) ? () => clickHand(c) : undefined} />
        ))}
        {hand.length === 0 && <p className="idle">Карт нет — смотришь.</p>}
      </div>
      {iAtk && <p className="du-role">Ты атакуешь. Первый ход — любая, дальше — ранги стола.</p>}
      {iDef && <p className="du-role">Ты отбиваешься. Старшая в масть или козырь.</p>}
    </div>
  );
}
