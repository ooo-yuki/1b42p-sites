// Финал забега: разбитая бутылка за 50000 — всё скуплено + Делирий.
import { BASE_ARTS, BOTTLE_COST, LAST_LVL, LEVELS, SYNS, isAllBought } from '../../game/zapoi/index';
import type { ZapoiState } from '../../game/zapoi/index';

interface BottleProps {
  z: ZapoiState;
  charName: string;
  onShatter: () => void;
}

export default function Bottle({ z, charName, onShatter }: BottleProps) {
  const readyForBottle = z.char != null && isAllBought(z);
  const onLast = (z.lvl ?? 0) >= LAST_LVL;
  return (
    <>
      <h3 style={{ color: 'gold' }}>💥 ФИНАЛ ЗАБЕГА: РАЗБИТАЯ БУТЫЛКА</h3>
      {readyForBottle && onLast ? (
        <div style={{ border: '3px solid red', borderRadius: 12, padding: 12, margin: '8px 0' }}>
          <p>Всё скуплено, все синергии собраны! Самый дорогой предмет ждёт…</p>
          <button onClick={onShatter} disabled={z.m < BOTTLE_COST} style={{ fontSize: 20, background: 'linear-gradient(180deg,#c00,#700)', color: '#fff', padding: '12px 30px' }}>
            🍾💥 РАЗБИТЬ БУТЫЛКУ за {BOTTLE_COST.toLocaleString('ru-RU')}
          </button>
          <p className="hint">Бутылка разобьётся, забег завершится, {charName} будет закрыт ✅</p>
        </div>
      ) : (
        <p className="hint">🔒 Бутылка появится, когда скупишь всё (древо MAX + {BASE_ARTS.length} базовых артефактов + {SYNS.length} синергий, именные не нужны), дойдёшь до «{LEVELS[LAST_LVL].emoji} {LEVELS[LAST_LVL].name}» и накопишь {BOTTLE_COST.toLocaleString('ru-RU')} бухла.</p>
      )}
    </>
  );
}
