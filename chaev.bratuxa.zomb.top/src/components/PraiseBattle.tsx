import { useEffect, useRef, useState } from 'react';
import { scoreText } from '../battle/scoring';
import { loadTop, addToTop, type TopRow } from '../battle/top';

type Tab = 'battle' | 'solo' | 'top';

const box: React.CSSProperties = {
  background: '#14141c', color: '#fff', borderRadius: 16, padding: 20,
  margin: '16px auto', maxWidth: 640, border: '2px solid #E31E25',
};
const btn: React.CSSProperties = {
  background: '#E31E25', color: '#fff', border: 'none', borderRadius: 12,
  padding: '14px 22px', fontSize: 18, fontWeight: 700, cursor: 'pointer', minHeight: 52,
};
const tabBtn = (active: boolean): React.CSSProperties => ({
  ...btn, background: active ? '#E31E25' : '#2a2a35', flex: 1,
});
const area: React.CSSProperties = {
  width: '100%', minHeight: 90, borderRadius: 10, padding: 10,
  fontSize: 16, background: '#1e1e28', color: '#fff', border: '1px solid #444', boxSizing: 'border-box',
};
const input: React.CSSProperties = {
  width: '100%', borderRadius: 10, padding: '12px 10px', fontSize: 16,
  background: '#1e1e28', color: '#fff', border: '1px solid #444', boxSizing: 'border-box',
};

export default function PraiseBattle() {
  const [tab, setTab] = useState<Tab>('battle');
  // battle
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [left, setLeft] = useState(60);
  const [running, setRunning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const s1 = scoreText(p1);
  const s2 = scoreText(p2);

  const start = () => {
    setRunning(true); setWinner(null); setLeft(60);
    if (timer.current) window.clearInterval(timer.current);
    timer.current = window.setInterval(() => {
      setLeft((v) => {
        if (v <= 1) {
          if (timer.current) window.clearInterval(timer.current);
          setRunning(false);
          const a = scoreText(p1Ref.current);
          const b = scoreText(p2Ref.current);
          setWinner(a === b ? 'Ничья! Оба хороши 🤝' : a > b ? 'Победил Игрок 1! 🏆' : 'Победил Игрок 2! 🏆');
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  };

  // refs чтобы финал считал актуальный текст
  const p1Ref = useRef(p1);
  const p2Ref = useRef(p2);
  p1Ref.current = p1; p2Ref.current = p2;

  useEffect(() => () => { if (timer.current) window.clearInterval(timer.current); }, []);

  const replay = () => { setP1(''); setP2(''); setWinner(null); setLeft(60); };

  // solo
  const [name, setName] = useState('');
  const [praise, setPraise] = useState('');
  const [saved, setSaved] = useState<string | null>(null);
  const soloScore = scoreText(praise);
  const toTop = () => {
    const n = name.trim() || 'Безымянный хвалитель';
    addToTop(n, soloScore);
    setSaved(`«${n}» — ${soloScore} очков в топе!`);
  };

  // top
  const [rows, setRows] = useState<TopRow[]>([]);
  useEffect(() => { if (tab === 'top') setRows(loadTop()); }, [tab]);

  return (
    <section style={box} data-testid="praise-battle">
      <h2 style={{ margin: '0 0 12px', fontSize: 24 }}>⚔️ Хвалебный баттл</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button style={tabBtn(tab === 'battle')} onClick={() => setTab('battle')}>Баттл 1 на 1</button>
        <button style={tabBtn(tab === 'solo')} onClick={() => setTab('solo')}>Соло</button>
        <button style={tabBtn(tab === 'top')} onClick={() => setTab('top')}>Топ</button>
      </div>

      {tab === 'battle' && (
        <div>
          <p style={{ fontSize: 20, fontWeight: 700 }}>⏱ Осталось: {left} с</p>
          <label>Игрок 1 ({s1} очков)</label>
          <textarea style={area} value={p1} onChange={(e) => setP1(e.target.value)} placeholder="Игрок 1: хвали Чаева…" disabled={!!winner} />
          <div style={{ height: 8 }} />
          <label>Игрок 2 ({s2} очков)</label>
          <textarea style={area} value={p2} onChange={(e) => setP2(e.target.value)} placeholder="Игрок 2: хвали Чаева…" disabled={!!winner} />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            {!running && !winner && <button style={btn} onClick={start}>Начать баттл (60 с)</button>}
            {winner && <button style={btn} onClick={replay}>Ещё раз</button>}
          </div>
          {winner && <p style={{ fontSize: 22, fontWeight: 800, marginTop: 12 }}>{winner}</p>}
        </div>
      )}

      {tab === 'solo' && (
        <div>
          <label>Твоё имя</label>
          <input style={input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Как тебя звать?" />
          <div style={{ height: 8 }} />
          <label>Похвала ({soloScore} очков)</label>
          <textarea style={area} value={praise} onChange={(e) => setPraise(e.target.value)} placeholder="Напиши, как хорош Чаев…" />
          <div style={{ marginTop: 12 }}>
            <button style={btn} onClick={toTop}>В топ!</button>
          </div>
          {saved && <p style={{ marginTop: 10 }}>{saved}</p>}
        </div>
      )}

      {tab === 'top' && (
        <div>
          {rows.length === 0
            ? <p>Топ пока пуст. Стань первым!</p>
            : <ol>{rows.map((r, i) => <li key={i}>{r.name} — {r.score}</li>)}</ol>}
          <button style={btn} onClick={() => setRows(loadTop())}>Обновить</button>
        </div>
      )}
    </section>
  );
}
