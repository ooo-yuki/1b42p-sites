// Артефакты по качествам 1-4.
import { useState } from 'react';
import { ARTS, QUALITY_NAMES, SYNS, CHARACTERS, artCost, buyArt } from '../../game/zapoi/index';
import type { ZapoiState } from '../../game/zapoi/index';
import type { MutateFn } from '../../hooks/useZapoiState';

interface ArtifactsProps {
  z: ZapoiState;
  mutate: MutateFn;
}

const QUALITIES = [1, 2, 3, 4];

export default function Artifacts({ z, mutate }: ArtifactsProps) {
  // Складывающиеся секции, чтобы не занимали место. По умолчанию всё свернуто.
  const [openQ, setOpenQ] = useState<Record<number, boolean>>({});
  const ownedArts = ARTS.filter((a) => z.arts[a.id]).length;

  return (
    <>
      <h3 style={{ color: 'gold' }}><img src="arts/logo.png" alt="Артефакты" style={{ width: 34, height: 34, verticalAlign: 'middle', borderRadius: 8, marginRight: 8 }} />Артефакты по качествам ({ownedArts}/{ARTS.length})</h3>
      <div>
        {QUALITIES.map((q) => {
          const list = ARTS.filter((a) => (a.q || 3) === q);
          const owned = list.filter((a) => z.arts[a.id]).length;
          const open = !!openQ[q];
          return (
            <div key={q}>
              <div onClick={() => setOpenQ((p) => ({ ...p, [q]: !p[q] }))} style={{ color: 'gold', fontWeight: 'bold', margin: '8px 0 4px', fontSize: 14, cursor: 'pointer', userSelect: 'none' }}>
                {open ? '▼' : '▶'} <img src={`quals/q${q}.png`} alt={'Качество ' + q} style={{ width: 30, height: 30, verticalAlign: 'middle', borderRadius: 8, marginRight: 6 }} />{QUALITY_NAMES[q]} <span className="hint">({owned}/{list.length})</span>
              </div>
              {open && list.map((a) => {
                const isOwned = !!z.arts[a.id];
                const price = artCost(z, a);
                const locked = !!a.req && !(z.completed && z.completed[a.req]);
                const reqName = a.req ? (CHARACTERS.find((c) => c.id === a.req) as { name: string } | undefined)?.name || a.req : '';
                return (
                  <div className="art" key={a.id}>
                    <img src={`arts/${a.id}.png`} alt={a.name} style={{ width: 44, height: 44, borderRadius: 10, border: '2px solid gold', verticalAlign: 'middle', marginRight: 8, opacity: locked ? 0.4 : 1 }} />
                    <b>{a.name}</b> — {a.desc}{' '}
                    {locked && <span className="hint">🔒 закрой: {reqName}</span>}
                    <button disabled={isOwned || locked || z.m < price} onClick={() => mutate((n) => {
                      const syns = buyArt(n, a.id);
                      if (syns === false) return '';
                      if (n._lastArtBlank) return `🎰 Пустышка! Деньги возвращены (${price} 🍾), крути снова!`;
                      if (syns.length > 0) {
                        const names = syns.map((id) => (SYNS.find((s) => s.id === id) as { name: string }).name).join(', ');
                        return `${names} — синергия!`;
                      }
                      return `🏺 Артефакт: ${a.name} — имба активирована!`;
                    }, 900)}>{isOwned ? 'ВЗЯТ ✅' : `Взять за ${price}`}</button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
}
