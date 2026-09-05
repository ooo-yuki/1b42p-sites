import { useEffect, useRef, useState } from 'react';
import { Hud } from './hud';
import { setView, getView } from '../three/cameraRig';
import type { Slot } from '../sim/weapons';

/** Единая шина ввода: читается игровым циклом (Task 10), пишется клавиатурой/тачем/кнопками. */
export const inputBus = {
  move: { x: 0, y: 0 },   // левый джойстик / WASD: x — стрейф, y — вперёд
  look: { dx: 0, dy: 0 }, // правый джойстик — дельта обзора за кадр
  fire: false,            // огонь удерживается
  aim: false,             // прицел удерживается
  reload: false,          // разовый флаг перезарядки (цикл сбрасывает)
};

const SLOTS: Slot[] = ['pistol', 'auto', 'shotgun'];
const AMMO_FULL: Record<Slot, number> = { pistol: 12, auto: 30, shotgun: 6 };

function Stick({ side, onMove }: { side: 'left' | 'right'; onMove: (x: number, y: number) => void }) {
  const base = useRef<HTMLDivElement>(null);
  const id = useRef<number | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const R = 48;

  const handle = (t: { clientX: number; clientY: number; identifier: number }, end: boolean) => {
    const el = base.current;
    if (!el) return;
    if (end) { id.current = null; setKnob({ x: 0, y: 0 }); onMove(0, 0); return; }
    const r = el.getBoundingClientRect();
    let dx = t.clientX - (r.left + r.width / 2);
    let dy = t.clientY - (r.top + r.height / 2);
    const len = Math.hypot(dx, dy) || 1;
    const cl = Math.min(len, R);
    dx = (dx / len) * cl; dy = (dy / len) * cl;
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
      onTouchStart={(e) => { const t = e.changedTouches[0]; id.current = t.identifier; handle(t, false); }}
      onTouchMove={(e) => {
        for (const t of Array.from(e.changedTouches)) if (t.identifier === id.current) handle(t, false);
      }}
      onTouchEnd={(e) => {
        for (const t of Array.from(e.changedTouches)) if (t.identifier === id.current) handle(t, true);
      }}
      onTouchCancel={(e) => {
        for (const t of Array.from(e.changedTouches)) if (t.identifier === id.current) handle(t, true);
      }}
    >
      <div style={{
        position: 'absolute', left: 60 + knob.x - 24, top: 60 + knob.y - 24,
        width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.3)',
      }} />
    </div>
  );
}

export function App() {
  const [hp] = useState(100);
  const [wave] = useState(1);
  const [slot, setSlot] = useState<Slot>('auto');
  const [ammo, setAmmo] = useState(AMMO_FULL.auto);
  const keys = useRef<Set<string>>(new Set());

  // Клавиатура: WASD → move, V — вид, 1/2/3 — слот, R — перезарядка.
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current.add(e.code);
      if (e.code === 'KeyV') setView(getView() === 'first' ? 'third' : 'first');
      if (e.code === 'Digit1') { setSlot('pistol'); setAmmo(AMMO_FULL.pistol); }
      if (e.code === 'Digit2') { setSlot('auto'); setAmmo(AMMO_FULL.auto); }
      if (e.code === 'Digit3') { setSlot('shotgun'); setAmmo(AMMO_FULL.shotgun); }
      if (e.code === 'KeyR') { inputBus.reload = true; setAmmo(AMMO_FULL[slot]); }
      pollKeys();
    };
    const up = (e: KeyboardEvent) => { keys.current.delete(e.code); pollKeys(); };
    const pollKeys = () => {
      const k = keys.current;
      const y = (k.has('KeyW') ? 1 : 0) - (k.has('KeyS') ? 1 : 0);
      const x = (k.has('KeyD') ? 1 : 0) - (k.has('KeyA') ? 1 : 0);
      // Тач-джойстик имеет приоритет: не затираем его нулями с клавиатуры.
      if (x !== 0 || y !== 0 || (!('ontouchstart' in window))) inputBus.move = { x, y };
      else if (x === 0 && y === 0 && !('ontouchstart' in window)) inputBus.move = { x, y };
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
  }, [slot]);

  return (
    <>
      <Hud hp={hp} wave={wave} ammo={ammo} slot={slot} />
      <Stick side="left" onMove={(x, y) => { inputBus.move = { x, y }; }} />
      <Stick side="right" onMove={(x, y) => { inputBus.look.dx = x * 4; inputBus.look.dy = y * 4; }} />
      <div style={{ position: 'fixed', bottom: 40, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 12, zIndex: 10 }}>
        <button
          onTouchStart={() => { inputBus.fire = true; }} onTouchEnd={() => { inputBus.fire = false; }}
          onMouseDown={() => { inputBus.fire = true; }} onMouseUp={() => { inputBus.fire = false; }}
          style={btn}>Огонь</button>
        <button
          onTouchStart={() => { inputBus.aim = true; }} onTouchEnd={() => { inputBus.aim = false; }}
          onMouseDown={() => { inputBus.aim = true; }} onMouseUp={() => { inputBus.aim = false; }}
          style={btn}>Прицел</button>
        <button onClick={() => { inputBus.reload = true; setAmmo(AMMO_FULL[slot]); }} style={btn}>Перезарядка</button>
      </div>
    </>
  );
}

const btn: React.CSSProperties = {
  padding: '12px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.3)',
  background: 'rgba(20,20,30,0.6)', color: '#fff', fontSize: 16, touchAction: 'none',
};
