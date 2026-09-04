// Экран выбора персонажа запоя.
import { CHARACTERS, isUnlocked } from '../../game/zapoi/index';
import type { CharId, ZapoiState } from '../../game/zapoi/index';

interface CharSelectProps {
  z: Pick<ZapoiState, 'completed'>;
  onPick: (id: CharId) => void;
}

export default function CharSelect({ z, onPick }: CharSelectProps) {
  const doneCount = CHARACTERS.filter((c) => z.completed && z.completed[c.id]).length;
  return (
    <div className="card">
      <h2>🎭 ВЫБОР ПЕРСОНАЖА 🎭</h2>
      <p className="hint">Закрыто персонажей: {doneCount}/{CHARACTERS.length}. Разбей бутылку за Владимира — откроются остальные!</p>
      {CHARACTERS.map((c) => {
        const open = isUnlocked(z, c.id);
        const done = z.completed && z.completed[c.id];
        return (
          <div key={c.id} style={{ border: '2px solid ' + (done ? '#7f7' : 'gold'), borderRadius: 12, padding: 12, margin: '8px 0', overflow: 'hidden', background: '#1a1a1a' }}>
            <img src={c.img} alt={c.name} style={{ width: 120, borderRadius: 12, border: '2px solid gold', marginRight: 12, float: 'left' }} />
            <b style={{ fontSize: 19, color: '#fff' }}>{c.emoji} {c.name}</b>{' '}
            {done ? <span style={{ color: '#7f7', fontWeight: 'bold' }}>✅ ЗАКРЫТ</span> : open ? '' : <span style={{ color: '#aaa' }}>🔒 откроется за бутылку Владимира</span>}
            <div style={{ color: 'gold', fontSize: 15, marginTop: 6 }}>{c.desc}</div>
            <div style={{ marginTop: 8 }}>
              {(c.stats || []).map((st) => (
                <div key={st} style={{ color: '#fff', fontSize: 15, marginTop: 4 }}>• {st}</div>
              ))}
            </div>
            <div style={{ color: '#aaa', fontSize: 13, fontStyle: 'italic', marginTop: 6 }}>{c.hint}</div>
            {open && !done && <button onClick={() => onPick(c.id)} style={{ marginTop: 8 }}>ИГРАТЬ ЗА НЕГО ▶</button>}
            {open && done && <button onClick={() => onPick(c.id)} style={{ marginTop: 8 }}>ЕЩЁ РАЗ ▶</button>}
            <div style={{ clear: 'both' }} />
          </div>
        );
      })}
      <p className="hint">Прогресс закрытий сохраняется. Мы уже победили 🏆</p>
    </div>
  );
}
