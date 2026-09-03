import { useEffect, useState } from 'react';
import { blip } from './DinoGame.jsx';

const DEFAULT_LOVERS = ['тюленька'];
const LS_KEY = 'chaev42_lovers';

function loadLocal() {
  try {
    const s = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    if (Array.isArray(s)) return [...DEFAULT_LOVERS, ...s.filter((n) => !DEFAULT_LOVERS.includes(n))];
  } catch (e) { /* тихо */ }
  return [...DEFAULT_LOVERS];
}

export default function Lovers() {
  const [lovers, setLovers] = useState(loadLocal);
  const [form, setForm] = useState(false);
  const [nick, setNick] = useState('');
  const [ph, setPh] = useState('Твой ник, красавчик 😎');

  // Подтянуть с бэкенда, если он жив; иначе localStorage.
  useEffect(() => {
    let dead = false;
    fetch('/api/lovers', { headers: { Accept: 'application/json' } })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d || dead || !Array.isArray(d.lovers)) return;
        const merged = [...DEFAULT_LOVERS, ...d.lovers.filter((n) => !DEFAULT_LOVERS.includes(n))];
        setLovers(merged);
      })
      .catch(() => { /* бэкенда нет — живём на localStorage */ });
    return () => { dead = true; };
  }, []);

  const persist = (list) => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(list)); } catch (e) { /* тихо */ }
    fetch('/api/lovers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lovers: list.filter((n) => !DEFAULT_LOVERS.includes(n)) }),
    }).catch(() => { /* бэкенда нет — не страшно */ });
  };

  const confirm = () => {
    const name = (nick || '').trim().slice(0, 30);
    if (!name) { setPh('Сначала впиши ник! 😏'); return; }
    if (!lovers.includes(name)) {
      const next = [...lovers, name];
      setLovers(next);
      persist(next);
    }
    setNick('');
    setForm(false);
    try { blip(800); } catch (e) { /* тихо */ }
  };

  return (
    <div className="card">
      <h2>❤️ СПИСОК ЛЮБОВНИКОВ ЧАЕВА ❤️</h2>
      <p className="hint">Хочешь в легенду? Жми кнопку, вписывай ник — и ты в списке! Мы уже победили 🏆</p>
      <ul className="lovers">
        {lovers.length
          ? lovers.map((n) => <li key={n}>💖 {n} <span style={{ color: 'gold' }}>любит Чаева</span></li>)
          : <li className="hint">Пока пусто… стань первым! 😎</li>}
      </ul>
      {form && (
        <div style={{ marginTop: 10 }}>
          <input className="love-input" maxLength={30} placeholder={ph} value={nick}
            onChange={(e) => setNick(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') confirm(); }} autoFocus />
          <br /><br />
          <button onClick={confirm}>ПОДТВЕРДИТЬ 💖</button>
        </div>
      )}
      {!form && <button onClick={() => setForm(true)} style={{ fontSize: 20, marginTop: 8 }}>ПОЛЮБИТЬ ЧАЕВА 💖</button>}
      <p className="hint">{lovers.length ? `Всего любовников: ${lovers.length} 🏆` : ''}</p>
    </div>
  );
}
