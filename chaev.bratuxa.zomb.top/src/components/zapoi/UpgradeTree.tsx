// Огромное древо прокачки: 4 ветки, цены base×growth^ур.
import { useMemo, useState } from 'react';
import { TREE, charDiscount, upgradeCost, buyUpgrade } from '../../game/zapoi/index';
import type { ZapoiState } from '../../game/zapoi/index';
import type { MutateFn } from '../../hooks/useZapoiState';

interface UpgradeTreeProps {
  z: ZapoiState;
  mutate: MutateFn;
}

export default function UpgradeTree({ z, mutate }: UpgradeTreeProps) {
  const branches = useMemo(() => {
    const groups: { header: string; defs: typeof TREE }[] = [];
    for (const b of TREE) {
      let g = groups.find((x) => x.header === b.br);
      if (!g) { g = { header: b.br, defs: [] }; groups.push(g); }
      g.defs.push(b);
    }
    return groups;
  }, []);

  // Складывающиеся секции, чтобы не занимали место. По умолчанию всё свернуто.
  const [openBr, setOpenBr] = useState<Record<string, boolean>>({});

  return (
    <>
      <h3 style={{ color: 'gold' }}>🌳 Огромное древо прокачки</h3>
      <div>
        {branches.map((g) => {
          const maxed = g.defs.filter((d) => (z.up[d.id] || 0) >= d.max).length;
          const open = !!openBr[g.header];
          return (
            <div key={g.header}>
              <div className="branch" onClick={() => setOpenBr((p) => ({ ...p, [g.header]: !p[g.header] }))} style={{ cursor: 'pointer', userSelect: 'none' }}>
                {open ? '▼' : '▶'} {g.header} <span className="hint">(MAX {maxed}/{g.defs.length})</span>
              </div>
              {open && g.defs.map((b) => {
                const l = z.up[b.id] || 0;
                const isMaxed = l >= b.max;
                const c = upgradeCost(b, l, charDiscount(z));
                return (
                  <div className="upg" key={b.id}>
                    <b>{b.name}</b> ур.{l}/{b.max} — {b.desc}{' '}
                    <span className="hint">[{b.base}×{b.g}^ур]</span>{' '}
                    <button disabled={isMaxed || z.m < c} onClick={() => mutate((n) => {
                      buyUpgrade(n, b.id);
                      return '';
                    }, 600 + l * 150)}>{isMaxed ? 'MAX' : `Купить ${c}`}</button>
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
