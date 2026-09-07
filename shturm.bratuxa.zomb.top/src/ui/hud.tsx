import { WEAPONS, WEAPON_META, SLOT_ORDER, type Slot } from '../sim/weapons';

/** Миниатюрные силуэты стволов (SVG, без картинок). */
export function GunIcon({ slot, size = 44 }: { slot: Slot; size?: number }) {
  const common = {
    width: size,
    height: Math.round(size * 0.5),
    viewBox: '0 0 48 24',
    fill: 'currentColor',
  } as const;
  if (slot === 'pistol')
    return (
      <svg {...common}>
        <rect x="6" y="7" width="22" height="6" rx="1.5" />
        <rect x="26" y="8" width="6" height="4" rx="1" />
        <rect x="11" y="13" width="6" height="8" rx="1" transform="rotate(-12 14 17)" />
        <rect x="4" y="9" width="3" height="3" rx="1" />
      </svg>
    );
  if (slot === 'auto')
    return (
      <svg {...common}>
        <rect x="4" y="8" width="30" height="5" rx="1.5" />
        <rect x="30" y="9" width="9" height="3" rx="1" />
        <rect x="14" y="13" width="5" height="8" rx="1" transform="rotate(-14 16 17)" />
        <rect x="26" y="13" width="4" height="6" rx="1" />
        <rect x="6" y="5" width="10" height="3" rx="1" />
        <rect x="37" y="9.5" width="7" height="2" rx="1" />
      </svg>
    );
  return (
    <svg {...common}>
      <rect x="4" y="8" width="32" height="7" rx="2" />
      <rect x="34" y="9" width="10" height="5" rx="1.5" />
      <rect x="12" y="15" width="6" height="6" rx="1" />
      <rect x="24" y="15" width="5" height="5" rx="1" />
    </svg>
  );
}

/** Патрон-иконка: гильза. Пустой магазин — тусклая. */
function Bullet({ spent, small }: { spent?: boolean; small?: boolean }) {
  return (
    <svg
      width={small ? 7 : 9}
      height={small ? 15 : 20}
      viewBox="0 0 9 20"
      style={{ opacity: spent ? 0.22 : 1, filter: spent ? 'grayscale(1)' : 'drop-shadow(0 0 3px rgba(255,209,102,0.8))' }}
    >
      <rect x="2" y="7" width="5" height="12" rx="1" fill={spent ? '#555' : '#c98a2b'} />
      <rect x="2" y="7" width="5" height="3" fill={spent ? '#444' : '#ffd166'} />
      <path d="M2 7 L4.5 0 L7 7 Z" fill={spent ? '#555' : '#ffe9a8'} />
    </svg>
  );
}

export interface HudProps {
  hp: number;
  maxHp: number;
  stamina: number;
  wave: number;
  slot: Slot;
  mag: number;
  reserve: number;
  kills: number;
  enemies: number;
  fps: number;
  map: string;
  message: string;
  hurtAt: number;
  hurtDir: number;
  healAt: number;
  /** Мобильная раскладка: кластер по центру, всё мельче, без десктоп-подсказки. */
  compact: boolean;
}

const uiFont = 'system-ui, sans-serif';

export function Hud(p: HudProps) {
  const pct = Math.max(0, Math.min(1, p.hp / p.maxHp));
  const low = pct <= 0.3;
  const compact = p.compact;
  const magSize = WEAPONS[p.slot].mag;
  const pips = Array.from({ length: magSize }, (_, i) => i < p.mag);
  const wavePips = Array.from({ length: 7 }, (_, i) => i < p.wave);
  const dmgDeg = (p.hurtDir * 180) / Math.PI;
  // Компакт-геометрия (телефон-ландшафт): уже и мельче, стики по краям не задевают.
  const HP_W = compact ? 220 : 300;
  const SLOT_W = compact ? 62 : 92;
  const GUN = compact ? 34 : 52;
  const PIP_W = compact ? 220 : 300;
  const FONT = compact ? 12 : 14;

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 5, fontFamily: uiFont }}>
      <style>{`
        @keyframes shturmHit { 0% { opacity: 0.85; } 100% { opacity: 0; } }
        @keyframes shturmLow { 0%,100% { opacity: 0.35; } 50% { opacity: 0.7; } }
        @keyframes shturmHeal { 0% { opacity: 0.5; } 100% { opacity: 0; } }
        @keyframes shturmDir { 0% { opacity: 0.95; transform: translate(-50%,-50%) scale(1); } 100% { opacity: 0; transform: translate(-50%,-50%) scale(1.25); } }
      `}</style>

      {/* Красная вспышка входящего урона */}
      {p.hurtAt > 0 && (
        <div
          key={p.hurtAt}
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(200,0,0,0) 42%, rgba(210,10,10,0.55) 100%)',
            animation: 'shturmHit 0.55s ease-out forwards',
          }}
        />
      )}
      {/* Пульс низкого HP */}
      {low && (
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(200,0,0,0) 48%, rgba(200,0,0,0.5) 100%)',
            animation: 'shturmLow 1.1s ease-in-out infinite',
          }}
        />
      )}
      {/* Зелёная вспышка хила */}
      {p.healAt > 0 && (
        <div
          key={`h${p.healAt}`}
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at center, rgba(0,200,80,0) 55%, rgba(0,220,100,0.4) 100%)',
            animation: 'shturmHeal 0.6s ease-out forwards',
          }}
        />
      )}
      {/* Маркер направления урона: красный сектор со стороны атаки */}
      {p.hurtAt > 0 && (
        <div
          key={`d${p.hurtAt}`}
          style={{
            position: 'absolute', left: '50%', top: '50%',
            width: 190, height: 190, margin: 0,
            transform: 'translate(-50%,-50%)',
            animation: 'shturmDir 0.7s ease-out forwards',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, transform: `rotate(${dmgDeg}deg)` }}>
            <svg viewBox="0 0 100 100" width="190" height="190">
              <path d="M50 2 A48 48 0 0 1 78 12 L68 30 A28 28 0 0 0 50 22 Z" fill="rgba(255,30,30,0.9)" />
            </svg>
          </div>
        </div>
      )}

      {/* Верх-центр: волны • фраги • мобы */}
      <div style={{ position: 'absolute', top: compact ? 6 : 10, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: compact ? 3 : 5 }}>
        <div style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.5)', padding: compact ? '4px 8px' : '6px 10px', borderRadius: 10 }}>
          {wavePips.map((on, i) => (
            <div
              key={i}
              title={`Волна ${i + 1}`}
              style={{
                width: compact ? 15 : 26, height: compact ? 6 : 8, borderRadius: 4,
                background: on ? (i === 6 ? '#ff5252' : '#ffd166') : 'rgba(255,255,255,0.18)',
                boxShadow: on ? '0 0 6px rgba(255,209,102,0.7)' : 'none',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#fff', fontSize: FONT }}>
          <span style={{ background: 'rgba(0,0,0,0.5)', padding: '3px 10px', borderRadius: 8 }}>💀 {p.kills}</span>
          <span style={{ background: 'rgba(0,0,0,0.5)', padding: '3px 10px', borderRadius: 8 }}>👾 {p.enemies}</span>
          <span style={{ background: 'rgba(0,0,0,0.5)', padding: '3px 10px', borderRadius: 8, fontSize: compact ? 11 : 12, opacity: 0.9 }}>
            {p.fps} FPS • {p.map}
          </span>
        </div>
        {p.message && (
          <div style={{ color: '#ffd166', fontSize: FONT, background: 'rgba(0,0,0,0.55)', padding: '4px 12px', borderRadius: 8 }}>
            {p.message}
          </div>
        )}
      </div>

      {/* Низ-справа (десктоп) / низ-центр (мобила): HP + патроны-иконки + инвентарь — как в фортнайте */}
      <div style={compact
        ? { position: 'absolute', left: '50%', transform: 'translateX(-50%)', bottom: 6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }
        : { position: 'absolute', right: 14, bottom: 14, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        {/* Патроны иконками */}
        <div
          title="Магазин"
          style={{
            display: 'flex', gap: 3, alignItems: 'flex-end', flexWrap: 'wrap', justifyContent: 'flex-end',
            maxWidth: PIP_W, background: 'rgba(0,0,0,0.5)', padding: compact ? '5px 8px' : '8px 10px', borderRadius: 10,
            border: p.mag === 0 ? '1px solid #ff5252' : '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {p.mag === 0 && <span style={{ color: '#ff8a80', fontSize: 13, marginRight: 4 }}>R ⟳</span>}
          {pips.map((full, i) => (
            <Bullet key={i} spent={!full} small={compact} />
          ))}
          <span style={{ color: '#fff', fontSize: FONT, marginLeft: 6, opacity: 0.95 }}>📦 {p.reserve}</span>
        </div>

        {/* Слоты оружия */}
        <div style={{ display: 'flex', gap: compact ? 5 : 8 }}>
          {SLOT_ORDER.map((s) => {
            const active = s === p.slot;
            const m = WEAPON_META[s];
            return (
              <div
                key={s}
                title={`${m.name} — ${WEAPONS[s].dmg} ур.`}
                style={{
                  width: SLOT_W,
                  background: active ? 'linear-gradient(180deg, rgba(80,60,10,0.92), rgba(30,24,8,0.92))' : 'rgba(0,0,0,0.55)',
                  border: active ? '2px solid #ffd166' : '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 10, color: active ? '#ffd166' : 'rgba(255,255,255,0.65)',
                  padding: compact ? '4px 4px 3px' : '6px 6px 5px', textAlign: 'center',
                  transform: active ? 'translateY(-3px)' : 'none',
                  boxShadow: active ? '0 0 12px rgba(255,209,102,0.45)' : 'none',
                }}
              >
                <div style={{ fontSize: compact ? 9 : 10, opacity: 0.8, display: 'flex', justifyContent: 'space-between', padding: '0 2px' }}>
                  <span style={{ border: '1px solid currentColor', borderRadius: 4, padding: '0 4px' }}>{m.key}</span>
                  <span>{m.short}</span>
                </div>
                <GunIcon slot={s} size={GUN} />
                <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', marginTop: 2 }}>
                  <div
                    style={{
                      width: `${(s === p.slot ? p.mag : WEAPONS[s].mag) / WEAPONS[s].mag * 100}%`,
                      height: '100%', borderRadius: 2,
                      background: active ? '#ffd166' : 'rgba(255,255,255,0.35)',
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Полоска здоровья */}
        <div
          title="Здоровье"
          style={{
            width: HP_W, background: 'rgba(0,0,0,0.55)', borderRadius: 12, padding: compact ? '5px 8px 6px' : '8px 10px 9px',
            border: low ? '2px solid #ff5252' : '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: compact ? 5 : 8 }}>
            <span style={{ fontSize: compact ? 16 : 20 }}>{low ? '🆘' : '❤'}</span>
            <div style={{ flex: 1, height: compact ? 13 : 16, borderRadius: 8, background: 'rgba(255,255,255,0.14)', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${pct * 100}%`, height: '100%', borderRadius: 8,
                  background: pct > 0.55 ? 'linear-gradient(90deg,#37d67a,#7bf59b)' : pct > 0.3 ? 'linear-gradient(90deg,#ffb300,#ffd166)' : 'linear-gradient(90deg,#d32f2f,#ff5252)',
                  transition: 'width 0.25s ease',
                }}
              />
            </div>
            <span style={{ color: '#fff', fontSize: compact ? 15 : 17, fontWeight: 700, minWidth: compact ? 32 : 40, textAlign: 'right' }}>{Math.max(0, Math.round(p.hp))}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: compact ? 4 : 6 }}>
            <span style={{ fontSize: 12 }}>⚡</span>
            <div style={{ flex: 1, height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (p.stamina / 43) * 100)}%`, height: '100%', background: '#4fc3f7', transition: 'width 0.25s ease' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Низ-слева: компактная подсказка иконками — только десктоп, на таче кнопки и так со значками */}
      {!compact && (
        <div
          style={{
            position: 'absolute', left: 12, bottom: 12, color: 'rgba(255,255,255,0.75)', fontSize: 12,
            background: 'rgba(0,0,0,0.4)', padding: '5px 10px', borderRadius: 8,
          }}
        >
          V 👁 • 1/2/3 🔫 • R ⟳ • Space ⤒ • C ⤓ • Shift ⚡
        </div>
      )}
    </div>
  );
}
