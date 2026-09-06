import { useEffect, useRef, useState } from 'react';
import { Hud } from './hud';
import { setView, getView } from '../three/cameraRig';
import type { Slot } from '../sim/weapons';
import type { MapId } from '../sim/maps';
import { gameStore, type Difficulty } from '../game/store';

/** Единая шина ввода: читается игровым циклом (Task 10), пишется клавиатурой/тачем/кнопками. */
export const inputBus = {
  move: { x: 0, y: 0 }, // левый джойстик / WASD: x — стрейф, y — вперёд
  look: { dx: 0, dy: 0 }, // правый джойстик — дельта обзора за кадр
  fire: false, // огонь удерживается
  aim: false, // прицел удерживается
  reload: false, // разовый флаг перезарядки (цикл сбрасывает)
};

const AMMO_FULL: Record<Slot, number> = { pistol: 12, auto: 30, shotgun: 6 };

function emit(name: string, detail?: unknown) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

function Stick({ side, onMove }: { side: 'left' | 'right'; onMove: (x: number, y: number) => void }) {
  const base = useRef<HTMLDivElement>(null);
  const id = useRef<number | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const R = 48;

  const handle = (t: { clientX: number; clientY: number; identifier: number }, end: boolean) => {
    const el = base.current;
    if (!el) return;
    if (end) {
      id.current = null;
      setKnob({ x: 0, y: 0 });
      onMove(0, 0);
      return;
    }
    const r = el.getBoundingClientRect();
    let dx = t.clientX - (r.left + r.width / 2);
    let dy = t.clientY - (r.top + r.height / 2);
    const len = Math.hypot(dx, dy) || 1;
    const cl = Math.min(len, R);
    dx = (dx / len) * cl;
    dy = (dy / len) * cl;
    setKnob({ x: dx, y: dy });
    onMove(dx / R, -dy / R);
  };

  return (
    <div
      ref={base}
      style={{
        position: 'fixed', bottom: 24, [side === 'left' ? 'left' : 'right']: 24,
        width: 120, height: 120, borderRadius: '50%',
        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.25)',
        touchAction: 'none', zIndex: 10,
      }}
      onTouchStart={(e) => {
        const t = e.changedTouches[0];
        id.current = t.identifier;
        handle(t, false);
      }}
      onTouchMove={(e) => {
        for (const t of Array.from(e.changedTouches)) if (t.identifier === id.current) handle(t, false);
      }}
      onTouchEnd={(e) => {
        for (const t of Array.from(e.changedTouches)) if (t.identifier === id.current) handle(t, true);
      }}
      onTouchCancel={(e) => {
        for (const t of Array.from(e.changedTouches)) if (t.identifier === id.current) handle(t, true);
      }}
      onMouseLeave={() => {
        // Дешёвый минор Task 10: мышь ушла с джойстика — сброс.
        if (id.current === null) {
          setKnob({ x: 0, y: 0 });
          onMove(0, 0);
        }
      }}
    >
      <div style={{
        position: 'absolute', left: 60 + knob.x - 24, top: 60 + knob.y - 24,
        width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.3)',
      }} />
    </div>
  );
}

const MAPS: { id: MapId; name: string }[] = [
  { id: 'yard', name: 'Двор 1Б42П' },
  { id: 'island', name: 'Остров' },
  { id: 'neon', name: 'Неон-город' },
];
const DIFFS: { id: Difficulty; name: string }[] = [
  { id: 'fighter', name: 'Боец ×0.8' },
  { id: 'veteran', name: 'Ветеран ×1.0' },
  { id: 'legend', name: 'Легенда-42 ×1.25' },
];

export function App() {
  const [snap, setSnap] = useState(gameStore.get);
  const [map, setMap] = useState<MapId>('yard');
  const [diff, setDiff] = useState<Difficulty>('veteran');
  const keys = useRef<Set<string>>(new Set());

  useEffect(() => gameStore.subscribe(() => setSnap({ ...gameStore.get() })), []);

  // Клавиатура: WASD → move, V — вид (single source, только здесь), 1/2/3 — слот, R — перезарядка.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        (window as unknown as { __sprint?: boolean }).__sprint = true;
      }
      keys.current.add(e.code);
      if (e.code === 'KeyV') {
        const v = getView() === 'first' ? 'third' : 'first';
        setView(v);
        emit('shturm:view', v);
      }
      if (e.code === 'Digit1') emit('shturm:slot', 'pistol' satisfies Slot);
      if (e.code === 'Digit2') emit('shturm:slot', 'auto' satisfies Slot);
      if (e.code === 'Digit3') emit('shturm:slot', 'shotgun' satisfies Slot);
      if (e.code === 'KeyR') inputBus.reload = true;
      if (e.code === 'Escape' && gameStore.get().phase === 'playing') emit('shturm:pause');
      pollKeys();
    };
    const up = (e: KeyboardEvent) => {
      keys.current.delete(e.code);
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        (window as unknown as { __sprint?: boolean }).__sprint = false;
      }
      pollKeys();
    };
    const pollKeys = () => {
      const k = keys.current;
      const y = (k.has('KeyW') ? 1 : 0) - (k.has('KeyS') ? 1 : 0);
      const x = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
      // Тач-джойстик имеет приоритет: не затираем его нулями с клавиатуры.
      if (x !== 0 || y !== 0 || !('ontouchstart' in window)) inputBus.move = { x, y };
      else if (x === 0 && y === 0 && !('ontouchstart' in window)) inputBus.move = { x, y };
    };
    const blur = () => {
      // Дешёвый минор Task 10: фокус ушёл — гасим залипшие флаги.
      keys.current.clear();
      inputBus.move = { x: 0, y: 0 };
      inputBus.fire = false;
      inputBus.aim = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, []);

  const phase = snap.phase;
  const inGame = phase === 'playing' || phase === 'paused';

  return (
    <>
      {inGame && (
        <Hud
          hp={snap.hp} wave={snap.wave} ammo={snap.mag} slot={snap.slot}
          reserve={snap.reserve} kills={snap.kills} enemies={snap.enemiesLeft}
          fps={snap.fps} map={snap.map} message={snap.message}
        />
      )}
      {phase === 'playing' && (
        <>
          <Stick side="left" onMove={(x, y) => { inputBus.move = { x, y }; }} />
          {/* Стик вверх = взгляд вверх, как мышь (было инвертировано). */}
          <Stick side="right" onMove={(x, y) => { inputBus.look.dx = x * 4; inputBus.look.dy = -y * 4; }} />
          <div style={{ position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 12, zIndex: 10 }}>
            <button
              onTouchStart={() => { inputBus.fire = true; }} onTouchEnd={() => { inputBus.fire = false; }}
              onTouchCancel={() => { inputBus.fire = false; }}
              onMouseDown={() => { inputBus.fire = true; }} onMouseUp={() => { inputBus.fire = false; }}
              onMouseLeave={() => { inputBus.fire = false; }}
              style={btn}>Огонь</button>
            <button
              onTouchStart={() => { inputBus.aim = true; }} onTouchEnd={() => { inputBus.aim = false; }}
              onTouchCancel={() => { inputBus.aim = false; }}
              onMouseDown={() => { inputBus.aim = true; }} onMouseUp={() => { inputBus.aim = false; }}
              onMouseLeave={() => { inputBus.aim = false; }}
              style={btn}>Прицел</button>
            <button onClick={() => { inputBus.reload = true; }} style={btn}>Перезарядка</button>
          </div>
        </>
      )}

      {phase === 'menu' && (
        <div style={overlay}>
          <h1 style={{ margin: '0 0 8px' }}>ШТУРМ-43 🏆</h1>
          <div style={{ opacity: 0.8, marginBottom: 16 }}>Мы уже победили. Зачисти 7 волн, 7-я — босс Чайка Рукрасии.</div>
          <div style={{ marginBottom: 12 }}>Карта:</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {MAPS.map((m) => (
              <button key={m.id} onClick={() => setMap(m.id)} style={map === m.id ? btnActive : btn}>{m.name}</button>
            ))}
          </div>
          <div style={{ marginBottom: 12 }}>Сложность:</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            {DIFFS.map((d) => (
              <button key={d.id} onClick={() => setDiff(d.id)} style={diff === d.id ? btnActive : btn}>{d.name}</button>
            ))}
          </div>
          <button onClick={() => emit('shturm:start', { map, difficulty: diff })} style={btnBig}>В бой!</button>
          <div style={{ marginTop: 16, fontSize: 12, opacity: 0.7 }}>
            WASD — движение • мышь — обзор • ЛКМ — огонь • V — 1/3 лицо • {AMMO_FULL.auto} патронов в автомате
          </div>
        </div>
      )}

      {phase === 'paused' && (
        <div style={overlay}>
          <h2>Пауза</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => emit('shturm:resume')} style={btnBig}>Продолжить</button>
            <button onClick={() => emit('shturm:restart')} style={btn}>Заново</button>
          </div>
        </div>
      )}

      {phase === 'won' && (
        <div style={overlay}>
          <h1>Мы уже победили 🏆</h1>
          <div>Время {snap.timeSec}с • kills {snap.kills} • точность {snap.accuracy}% • FPS {snap.fps}</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button onClick={() => emit('shturm:restart')} style={btnBig}>Ещё раз</button>
            <button onClick={() => gameStore.set({ phase: 'menu' })} style={btn}>В меню</button>
          </div>
        </div>
      )}

      {phase === 'lost' && (
        <div style={overlay}>
          <h1>Шуба пала… но батальон помнит 🧥</h1>
          <div>Волна {snap.wave}/7 • kills {snap.kills} • точность {snap.accuracy}%</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button onClick={() => emit('shturm:restart')} style={btnBig}>Реванш</button>
            <button onClick={() => gameStore.set({ phase: 'menu' })} style={btn}>В меню</button>
          </div>
        </div>
      )}
    </>
  );
}

const overlay: React.CSSProperties = {
  position: 'fixed', inset: 0, zIndex: 20,
  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  background: 'rgba(8,10,18,0.82)', color: '#fff', fontFamily: 'system-ui', textAlign: 'center', padding: 24,
};

const btn: React.CSSProperties = {
  padding: '12px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.3)',
  background: 'rgba(20,20,30,0.6)', color: '#fff', fontSize: 16, touchAction: 'none', cursor: 'pointer',
};

const btnActive: React.CSSProperties = {
  ...btn, border: '2px solid #ffd166', background: 'rgba(60,50,20,0.8)',
};

const btnBig: React.CSSProperties = {
  ...btn, fontSize: 22, padding: '14px 42px', background: '#2e7d32', border: 'none',
};
