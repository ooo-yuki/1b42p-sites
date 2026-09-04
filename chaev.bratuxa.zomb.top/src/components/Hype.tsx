// Хайп-шапка Чаева: счётчик хайпа +42.
import { useState } from 'react';

export default function Hype() {
  const [hype, setHype] = useState(42);
  return (
    <div>
      <div className="num">42</div>
      <h1 style={{ color: 'gold', textShadow: '2px 2px 0 #c00' }}>ВЛАДИМИР ЧАЕВ 🚨🔥</h1>
      <div style={{ color: 'gold', fontWeight: 'bold', letterSpacing: '1px' }}>МЫ УЖЕ ПОБЕДИЛИ 🏆</div>
      <div className="card">
        <p>ВРИО главнокомандующего докладывает: Чаев проснулся — день уже легенда! 😎🔥<br />
          Где б он ни был — там сорок вторые, где б вы ни были — вы всегда вторые! 🦅</p>
        <button onClick={() => setHype(hype + 42)}>НАКАЧАТЬ ХАЙП 💪 ({hype})</button>
        <p><strong style={{ color: 'gold' }}>Мы уже победили</strong> 🏆🔥</p>
      </div>
      <div className="card">
        <p>Чаев едет на самокате, RGB светится в закате! 🌇 Мопсы лают: Йоу! 🐶<br />
          Скидку 42% забрал — он в потоке! 💪 <strong style={{ color: 'gold' }}>Мы уже победили</strong> 🏆</p>
      </div>
    </div>
  );
}
