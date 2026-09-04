// Синергии артефактов: список открытых/закрытых.
import { useState } from 'react';
import { SYNS } from '../../game/zapoi/index';
import type { ZapoiState } from '../../game/zapoi/index';

export default function Synergies({ z }: { z: ZapoiState }) {
  const [openSyn, setOpenSyn] = useState(false);
  const activeSyns = SYNS.filter((s) => z.syn[s.id]).length;

  return (
    <>
      <h3 style={{ color: 'gold' }}>✨ Синергии артефактов ({activeSyns}/{SYNS.length})</h3>
      <div onClick={() => setOpenSyn((v) => !v)} style={{ color: 'gold', fontSize: 14, cursor: 'pointer', userSelect: 'none', marginBottom: 4 }}>
        {openSyn ? '▼ Скрыть список' : '▶ Показать список'}
      </div>
      {openSyn && (
        <div style={{ fontSize: 14 }}>
          {SYNS.map((s) => {
            const on = !!z.syn[s.id];
            return (
              <div className={on ? 'syn on' : 'syn'} key={s.id}>
                <img src={`syns/${s.id}.png`} alt={s.name} style={{ width: 40, height: 40, borderRadius: 10, border: on ? '2px solid #7f7' : '2px solid #666', verticalAlign: 'middle', marginRight: 8, opacity: on ? 1 : 0.55 }} />
                {on ? '✅ ' : '🔒 '}<b>{s.name}</b> — {s.desc}
                {!on && <span className="hint"> [{s.need.join('+')}]</span>}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
