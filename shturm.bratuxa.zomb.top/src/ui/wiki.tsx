import { useState } from 'react';
import { WEAPONS, WEAPON_META, SLOT_ORDER, type Slot } from '../sim/weapons';
import { ENEMIES, ENEMY_META, ATTACK_RANGE, type EnemyType } from '../sim/enemies';
import { MAPS, MAP_LORE, type MapId } from '../sim/maps';
import { WikiViewer } from './wikiViewer';

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
const MAP_ORDER: MapId[] = ['yard', 'island', 'neon'];
const reachOf = (t: EnemyType) =>
  t === 'shooter' ? ATTACK_RANGE.shooter : t === 'tank' ? ATTACK_RANGE.tank : t === 'boss' ? ATTACK_RANGE.boss : ATTACK_RANGE.melee;

export function Wiki({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'weapons' | 'enemies' | 'maps'>('weapons');
  const [selGun, setSelGun] = useState<Slot>('auto');
  const [selMob, setSelMob] = useState<EnemyType>('tank');
  const [selMap, setSelMap] = useState<MapId>('yard');
  const w = WEAPONS[selGun];
  const wm = WEAPON_META[selGun];
  const perSec = Math.round((w.dmg * w.pellets / w.interval) * 10) / 10;
  const e = ENEMIES[selMob];
  const em = ENEMY_META[selMob];
  const lore = MAP_LORE[selMap];
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(5,7,14,0.88)', color: '#fff', fontFamily: 'system-ui', padding: 16,
      }}
    >
      <div style={{ width: 'min(980px, 96vw)', maxHeight: '90vh', overflowY: 'auto', background: 'rgba(16,20,32,0.97)', borderRadius: 16, padding: '20px 22px', border: '1px solid rgba(255,209,102,0.35)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h2 style={{ margin: 0 }}>📖 Вики ШТУРМ-43</h2>
          <button onClick={onClose} style={btnSm}>✕</button>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button onClick={() => setTab('weapons')} style={tab === 'weapons' ? btnActive : btn}>🔫 Оружие</button>
          <button onClick={() => setTab('enemies')} style={tab === 'enemies' ? btnActive : btn}>👾 Враги</button>
          <button onClick={() => setTab('maps')} style={tab === 'maps' ? btnActive : btn}>🗺 Карты</button>
        </div>

        {tab === 'weapons' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {SLOT_ORDER.map((s) => (
                <button key={s} onClick={() => setSelGun(s)} style={selGun === s ? btnActive : btn}>{WEAPON_META[s].short}</button>
              ))}
            </div>
            <div style={grid2}>
              <div><WikiViewer kind="gun" id={selGun} /></div>
              <div style={card}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{wm.name} <span style={keyBadge}>{wm.key}</span></div>
                <div style={{ opacity: 0.85, fontSize: 13, marginTop: 2 }}>{wm.desc}</div>
                <div style={{ color: '#ffd166', fontSize: 13, marginTop: 4 }}>💡 {wm.tip}</div>
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
            </div>
          </div>
        )}

        {tab === 'enemies' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {ORDER.map((t) => (
                <button key={t} onClick={() => setSelMob(t)} style={selMob === t ? btnActive : btn}>{ENEMY_META[t].name}</button>
              ))}
            </div>
            <div style={grid2}>
              <div><WikiViewer kind="mob" id={selMob} /></div>
              <div style={card}>
                <div style={{ fontSize: 18, fontWeight: 800 }}>{em.name}</div>
                <div style={{ opacity: 0.85, fontSize: 13 }}>{em.desc}</div>
                <div style={{ color: '#ffd166', fontSize: 13, marginTop: 4 }}>💡 {em.tactic}</div>
                <div style={{ display: 'grid', gap: 6, marginTop: 12 }}>
                  <Stat icon="❤" label="HP" value={e.hp} max={1200} color="#e57373" />
                  <Stat icon="👟" label="Скорость" value={e.speed} max={5} color="#4fc3f7" />
                  <Stat icon="💥" label="Урон" value={e.dmg} max={25} color="#ff7043" />
                  <Stat icon="📏" label="Дальность атаки" value={reachOf(selMob)} max={18} color="#aed581" />
                </div>
              </div>
            </div>
            <div style={{ fontSize: 12, opacity: 0.65, marginTop: 10 }}>Сложность масштабирует HP и урон: Боец ×0.8 • Ветеран ×1.0 • Легенда-42 ×1.25. Босс на 7-й волне призывает 2 бегунов раз в 12с.</div>
          </div>
        )}

        {tab === 'maps' && (
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              {MAP_ORDER.map((m) => (
                <button key={m} onClick={() => setSelMap(m)} style={selMap === m ? btnActive : btn}>{MAP_LORE[m].name}</button>
              ))}
            </div>
            <div style={card}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{lore.name} <span style={keyBadge}>{MAPS[selMap].size}×{MAPS[selMap].size}</span></div>
              <div style={{ opacity: 0.85, fontSize: 13, marginTop: 6 }}>👁 {lore.look}</div>
              <div style={{ fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>📜 {lore.lore}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) minmax(280px, 1fr)', gap: 12 };
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
