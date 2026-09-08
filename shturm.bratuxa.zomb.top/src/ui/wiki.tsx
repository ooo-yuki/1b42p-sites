import { useState } from 'react';
import { WEAPONS, WEAPON_META, SLOT_ORDER } from '../sim/weapons';
import { ENEMIES, ENEMY_META, ATTACK_RANGE, type EnemyType } from '../sim/enemies';
import { GunIcon } from './hud';

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div style={{ flex: 1, height: 7, borderRadius: 4, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, height: '100%', background: color }} />
    </div>
  );
}

function Stat({ icon, label, value, max, color }: { icon: string; label: string; value: number; max: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
      <span style={{ width: 22, textAlign: 'center' }}>{icon}</span>
      <span style={{ width: 108, opacity: 0.85 }}>{label}</span>
      <Bar value={value} max={max} color={color} />
      <span style={{ width: 52, textAlign: 'right', fontWeight: 700 }}>{value}</span>
    </div>
  );
}

const ORDER: EnemyType[] = ['runner', 'shooter', 'tank', 'boss'];
const reachOf = (t: EnemyType) =>
  t === 'shooter' ? ATTACK_RANGE.shooter : t === 'tank' ? ATTACK_RANGE.tank : t === 'boss' ? ATTACK_RANGE.boss : ATTACK_RANGE.melee;

export function Wiki({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'weapons' | 'enemies'>('weapons');
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(5,7,14,0.88)', color: '#fff', fontFamily: 'system-ui', padding: 16,
      }}
    >
      <div style={{ width: 'min(860px, 96vw)', maxHeight: '90vh', overflowY: 'auto', background: 'rgba(16,20,32,0.97)', borderRadius: 16, padding: '20px 22px', border: '1px solid rgba(255,209,102,0.35)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>📖 Вики ШТУРМ-43</h2>
          <button onClick={onClose} style={btnSm}>✕</button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button onClick={() => setTab('weapons')} style={tab === 'weapons' ? btnActive : btn}>🔫 Оружие</button>
          <button onClick={() => setTab('enemies')} style={tab === 'enemies' ? btnActive : btn}>👾 Враги</button>
        </div>

        {tab === 'weapons' && (
          <div style={{ display: 'grid', gap: 12 }}>
            {SLOT_ORDER.map((s) => {
              const w = WEAPONS[s];
              const m = WEAPON_META[s];
              const perSec = Math.round((w.dmg * w.pellets / w.interval) * 10) / 10;
              return (
                <div key={s} style={card}>
                  <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                    <div style={{ color: '#ffd166' }}><GunIcon slot={s} size={72} /></div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{m.name} <span style={keyBadge}>{m.key}</span></div>
                      <div style={{ opacity: 0.85, fontSize: 13, marginTop: 2 }}>{m.desc}</div>
                      <div style={{ color: '#ffd166', fontSize: 13, marginTop: 4 }}>💡 {m.tip}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: 6, marginTop: 12 }}>
                    <Stat icon="💥" label="Урон × темп/с" value={perSec} max={160} color="#ff7043" />
                    <div style={{ fontSize: 12, opacity: 0.7, marginLeft: 30 }}>
                      {w.pellets > 1 ? `${w.pellets} дробин × ${w.dmg}` : `${w.dmg}`} за выстрел • {Math.round(1 / w.interval * 10) / 10} выстр/с
                    </div>
                    <Stat icon="🎯" label="Дальность" value={w.range} max={80} color="#4fc3f7" />
                    <Stat icon="📦" label="Магазин" value={w.mag} max={30} color="#ffd166" />
                    <Stat icon="🎒" label="Запас" value={w.reserve} max={210} color="#aed581" />
                    <Stat icon="⟳" label="Перезарядка, с" value={w.reload} max={2.5} color="#ba68c8" />
                    <Stat icon="🌀" label="Разброс" value={w.spread} max={5} color="#90a4ae" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab === 'enemies' && (
          <div style={{ display: 'grid', gap: 12 }}>
            {ORDER.map((t) => {
              const e = ENEMIES[t];
              const m = ENEMY_META[t];
              return (
                <div key={t} style={card}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 40 }}>{m.icon}</span>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 800 }}>{m.name}</div>
                      <div style={{ opacity: 0.85, fontSize: 13 }}>{m.desc}</div>
                      <div style={{ color: '#ffd166', fontSize: 13, marginTop: 4 }}>💡 {m.tactic}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gap: 6, marginTop: 12 }}>
                    <Stat icon="❤" label="HP" value={e.hp} max={1200} color="#e57373" />
                    <Stat icon="👟" label="Скорость" value={e.speed} max={5} color="#4fc3f7" />
                    <Stat icon="💥" label="Урон" value={e.dmg} max={25} color="#ff7043" />
                    <Stat icon="📏" label="Дальность атаки" value={reachOf(t)} max={18} color="#aed581" />
                  </div>
                </div>
              );
            })}
            <div style={{ fontSize: 12, opacity: 0.65 }}>Сложность масштабирует HP и урон: Боец ×0.8 • Ветеран ×1.0 • Легенда-42 ×1.25. Босс на 7-й волне призывает 2 бегунов раз в 12с.</div>
          </div>
        )}
      </div>
    </div>
  );
}

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 12, padding: '14px 16px',
};
const btn: React.CSSProperties = {
  padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.3)',
  background: 'rgba(20,20,30,0.6)', color: '#fff', fontSize: 15, cursor: 'pointer',
};
const btnActive: React.CSSProperties = { ...btn, border: '2px solid #ffd166', background: 'rgba(60,50,20,0.8)' };
const btnSm: React.CSSProperties = { ...btn, padding: '6px 12px', fontSize: 15 };
const keyBadge: React.CSSProperties = {
  display: 'inline-block', border: '1px solid #ffd166', borderRadius: 5, padding: '0 7px',
  fontSize: 13, color: '#ffd166', marginLeft: 6,
};
