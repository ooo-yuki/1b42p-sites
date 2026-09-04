import { useEffect, useRef, useState } from 'react';
import { createDinoState, stepDino, jumpDino, GROUND_Y, FLOOR_Y, W, H } from '../game/dinoEngine.js';

// WebAudio-бипы без файлов — 1-в-1 из legacy.html.
let AC = null;
function beep(f0, f1, dur, type, vol) {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = type || 'square';
    o.frequency.setValueAtTime(f0, AC.currentTime);
    o.frequency.exponentialRampToValueAtTime(Math.max(f1, 1), AC.currentTime + dur);
    g.gain.setValueAtTime(vol || 0.08, AC.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + dur);
    o.connect(g); g.connect(AC.destination);
    o.start(); o.stop(AC.currentTime + dur);
  } catch (e) { /* тихо */ }
}
const sndJump = () => beep(300, 700, 0.15, 'square', 0.07);
const sndLose = () => { beep(400, 80, 0.5, 'sawtooth', 0.1); setTimeout(() => beep(300, 60, 0.5, 'sawtooth', 0.08), 120); };
const sndLevel = () => beep(500, 1000, 0.12, 'square', 0.06);

export function blip(f) {
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
    const o = AC.createOscillator(), g = AC.createGain();
    o.type = 'square'; o.frequency.value = f;
    g.gain.setValueAtTime(0.12, AC.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + 0.15);
    o.connect(g); g.connect(AC.destination);
    o.start(); o.stop(AC.currentTime + 0.16);
  } catch (e) { /* тихо */ }
}

export default function DinoGame() {
  const canvasRef = useRef(null);
  const stateRef = useRef(createDinoState());
  const [hud, setHud] = useState({ score: 0, record: 0, level: 1, alive: true });

  useEffect(() => {
    const cv = canvasRef.current;
    const ctx = cv.getContext('2d');
    const s = stateRef.current;
    s.record = +(localStorage.getItem('chaev42') || 0);
    const dinoImg = new Image();
    dinoImg.src = 'dino.png';
    let dinoOk = false;
    dinoImg.onload = () => { dinoOk = true; };
    const naxImg = new Image();
    naxImg.src = 'nax.png';
    let naxOk = false;
    naxImg.onload = () => { naxOk = true; };

    const doJump = () => {
      const wasDead = !s.alive;
      jumpDino(s);
      if (wasDead) setHud((h) => ({ ...h, alive: true }));
      else sndJump();
    };
    const onKey = (e) => {
      if (e.code === 'Space') { e.preventDefault(); doJump(); }
    };
    document.addEventListener('keydown', onKey);
    cv.addEventListener('pointerdown', doJump);

    let raf = 0;
    let lastHud = 0;
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#222';
      ctx.fillRect(0, FLOOR_Y, W, 15);
      ctx.fillStyle = 'gold';
      for (let i = 0; i < 15; i++) ctx.fillRect(i * 42 - ((s.t * s.speed) % 42), 183, 20, 2);

      const ev = stepDino(s);
      if (ev === 'levelup') sndLevel();
      if (ev === 'death') {
        sndLose();
        if (s.score > s.record) {
          s.record = s.score;
          try { localStorage.setItem('chaev42', s.record); } catch (e) { /* тихо */ }
        }
      }
      if (s.alive && s.score > s.record) {
        s.record = s.score;
        try { localStorage.setItem('chaev42', s.record); } catch (e) { /* тихо */ }
      }

      if (s.level >= 4) {
        ctx.fillStyle = 'rgba(204,0,0,.5)';
        ctx.fillRect(s.dino.x - 3, s.dino.y - 3, s.dino.w + 6, s.dino.h + 6);
      }
      if (dinoOk) ctx.drawImage(dinoImg, s.dino.x - 5, s.dino.y - 5, s.dino.w + 10, s.dino.h + 10);
      else {
        ctx.fillStyle = 'gold';
        ctx.fillRect(s.dino.x, s.dino.y, s.dino.w, s.dino.h);
        ctx.fillStyle = '#000';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('42', s.dino.x + 5, s.dino.y + 25);
      }
      ctx.fillStyle = 'red';
      for (const o of s.obstacles) {
        const oh = FLOOR_Y - o.h;
        if (naxOk) ctx.drawImage(naxImg, o.x, oh, o.w, o.h);
        else {
          ctx.fillRect(o.x, oh, o.w, o.h);
          ctx.fillStyle = '#fff';
          ctx.font = '12px Arial';
          ctx.fillText('НАХ', o.x, oh + 15);
          ctx.fillStyle = 'red';
        }
      }
      if (!s.alive) {
        ctx.fillStyle = 'rgba(0,0,0,.65)';
        ctx.fillRect(0, 0, W, H);
        if (s.flash > 0) {
          ctx.fillStyle = `rgba(204,0,0,${s.flash / 20})`;
          ctx.fillRect(0, 0, W, H);
        }
        ctx.fillStyle = '#c00'; ctx.fillRect(110, 40, 380, 120);
        ctx.fillStyle = 'gold'; ctx.fillRect(110, 40, 380, 120);
        ctx.fillStyle = '#c00'; ctx.fillRect(114, 44, 372, 112);
        ctx.fillStyle = 'gold'; ctx.textAlign = 'center';
        ctx.font = 'bold 26px Arial'; ctx.fillText('💀 НАХ ДОГНАЛ!', 300, 75);
        ctx.font = '16px Arial'; ctx.fillText(`Счёт ${s.score} • Рекорд ${s.record} • Уровень ${s.level}`, 300, 100);
        ctx.font = 'bold 18px Arial'; ctx.fillText('МЫ УЖЕ ПОБЕДИЛИ 🏆', 300, 126);
        ctx.font = '14px Arial'; ctx.fillText('пробел / клик — реванш', 300, 146);
        ctx.textAlign = 'left';
      }
      if (s.t - lastHud > 10 || ev) {
        lastHud = s.t;
        setHud({ score: s.score, record: s.record, level: s.level, alive: s.alive });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      cv.removeEventListener('pointerdown', doJump);
    };
  }, []);

  const reset = () => {
    Object.assign(stateRef.current, createDinoState());
    stateRef.current.record = hud.record;
    setHud((h) => ({ ...h, score: 0, level: 1, alive: true }));
  };

  return (
    <div className="card">
      <h2>🦖 ДИНО-ИГРА 42: ЧАЕВ БЕЖИТ 🦖</h2>
      <p>Пробел / клик / тап — прыжок, <b>двойной прыжок</b> — ещё раз в воздухе. Увернись от сквада НАХ!</p>
      <div className="score">
        <span>{hud.alive ? `СЧЁТ: ${hud.score} • РЕКОРД: ${hud.record}` : `💀 КРИНЖ! СЧЁТ ${hud.score} • РЕКОРД ${hud.record}`}</span>
        <span className="lvl">УРОВЕНЬ {hud.level}{hud.alive ? '' : ' • ЖМИ ЧТОБЫ РЕВАНШ'}</span>
      </div>
      <canvas id="dino" ref={canvasRef} width={W} height={H}></canvas><br /><br />
      <button onClick={reset}>ЗАНОВО 🔄</button>
      <p className="hint">Скорость растёт с каждым уровнем • звук: 🔊 вкл (WebAudio, без файлов)</p>
    </div>
  );
}
