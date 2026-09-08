import { useEffect, useState } from 'react';
import { WEAPONS, WEAPON_META, SLOT_ORDER, type Slot } from '../sim/weapons';
import { ENEMIES, ENEMY_META, ATTACK_RANGE, type EnemyType } from '../sim/enemies';
import { MAP_META, MAP_ORDER, type MapId } from '../sim/maps';
import { WikiViewer, type ViewerSel } from './wikiViewer';

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div style={{ flex: 1, height: 7, borderRadius: 4, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
      <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, height: '100%', background: color }} />
    </div>
  );
}

function Stat({ label, value, max, color, hint }: { label: string; value: number; max: number; color: string; hint?: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
        <span style={{ width: 118, opacity: 0.85 }}>{label}</span>
        <Bar value={value} max={max} color={color} />
        <span style={{ width: 56, textAlign: 'right', fontWeight: 700 }}>{value}</span>
      </div>
      {hint && <div style={{ fontSize: 12, opacity: 0.65, marginLeft: 126, marginTop: 2 }}>{hint}</div>}
    </div>
  );
}

const ENEMY_ORDER: EnemyType[] = ['runner', 'shooter', 'tank', 'boss'];
const reachOf = (t: EnemyType) =>
  t === 'shooter' ? ATTACK_RANGE.shooter : t === 'tank' ? ATTACK_RANGE.tank : t === 'boss' ? ATTACK_RANGE.boss : ATTACK_RANGE.melee;

type Tab = 'weapons' | 'enemies' | 'maps';

export function Wiki({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>('weapons');
  const [slot, setSlot] = useState<Slot>('auto');
  const [enemy, setEnemy] = useState<EnemyType>('tank');
  const [map, setMap] = useState<MapId>('yard');

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.code === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);

  const sel: ViewerSel = tab === 'weapons' ? { kind: 'gun', id: slot } : { kind: 'mob', id: enemy };
  const w = WEAPONS[slot];
  const wm = WEAPON_META[slot];
  const perSec = Math.round((w.dmg * w.pellets / w.interval) * 10) / 10;
  const e = ENEMIES[enemy];
  const em = ENEMY_META[enemy];
  const mm = MAP_META[map];

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(4,6,12,0.9)', color: '#fff', fontFamily: 'system-ui', padding: 16,
      }}
    >
      <div style={{ width: 'min(980px, 96vw)', maxHeight: '92vh', overflowY: 'auto', background: '#0b0e17', borderRadius: 18, padding: '20px 22px', border: '1px solid rgba(255,209,102,0.35)', boxShadow: '0 20px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <h2 style={{ margin: 0, fontSize: 22 }}>Вики ШТУРМ-43 <span style={{ color: '#00e5ff', fontSize: 13, letterSpacing: 2 }}>SHOWCASE</span></h2>
          <button onClick={onClose} style={btnSm} aria-label="Закрыть">✕</button>
        </div>
        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 12 }}>Витрина как в экшен-играх: модель из боя парит на стенде и крутится, статы — рядом.</div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }} role="tablist">
          {([['weapons', 'Оружие'], ['enemies', 'Враги'], ['maps', 'Карты']] as [Tab, string][]).map(([id, name]) => (
            <button key={id} onClick={() => setTab(id)} style={tab === id ? btnActive : btn} aria-selected={tab === id} role="tab">{name}</button>
          ))}
        </div>

        {tab !== 'maps' && (
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 14 }}>
            <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
              {(tab === 'weapons' ? SLOT_ORDER : ENEMY_ORDER).map((id) => {
                const active = tab === 'weapons' ? id === slot : id === enemy;
                const title = tab === 'weapons' ? WEAPON_META[id as Slot].name : ENEMY_META[id as EnemyType].name;
                const sub = tab === 'weapons' ? `клавиша ${WEAPON_META[id as Slot].key}` : `${ENEMIES[id as EnemyType].hp} HP`;
                return (
                  <button
                    key={id}
                    onClick={() => (tab === 'weapons' ? setSlot(id as Slot) : setEnemy(id as EnemyType))}
                    style={active ? pickActive : pick}
                  >
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{title}</div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>{sub}</div>
                  </button>
                );
              })}
              <div style={{ fontSize: 11, opacity: 0.55, marginTop: 4 }}>
                {tab === 'weapons' ? 'Модели — те же, что в бою: затвор, рожок, помпа.' : 'Модели — те же, что в бою. Босс показан чайкой Рукрасии.'}
              </div>
            </div>
            <div style={card}>
              <WikiViewer key={`${sel.kind}-${sel.id}`} sel={sel} />
              {tab === 'weapons' ? (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 19, fontWeight: 800 }}>{wm.name} <span style={keyBadge}>{wm.key}</span></div>
                  <div style={{ opacity: 0.85, fontSize: 13, marginTop: 2 }}>{wm.desc}</div>
                  <div style={{ color: '#ffd166', fontSize: 13, marginTop: 4 }}>Совет: {wm.tip}</div>
                  <div style={{ display: 'grid', gap: 7, marginTop: 12 }}>
                    <Stat label="Урон × темп/с" value={perSec} max={160} color="#ff7043" hint={w.pellets > 1 ? `${w.pellets} дробин × ${w.dmg} за выстрел • ${Math.round(1 / w.interval * 10) / 10} выстр/с` : `${w.dmg} за выстрел • ${Math.round(1 / w.interval * 10) / 10} выстр/с`} />
                    <Stat label="Дальность" value={w.range} max={80} color="#4fc3f7" />
                    <Stat label="Магазин" value={w.mag} max={30} color="#ffd166" />
                    <Stat label="Запас" value={w.reserve} max={210} color="#aed581" />
                    <Stat label="Перезарядка, с" value={w.reload} max={2.5} color="#ba68c8" />
                    <Stat label="Разброс" value={w.spread} max={5} color="#90a4ae" />
                  </div>
                </div>
              ) : (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 19, fontWeight: 800 }}>{em.name}</div>
                  <div style={{ opacity: 0.85, fontSize: 13, marginTop: 2 }}>{em.desc}</div>
                  <div style={{ color: '#ffd166', fontSize: 13, marginTop: 4 }}>Тактика: {em.tactic}</div>
                  <div style={{ display: 'grid', gap: 7, marginTop: 12 }}>
                    <Stat label="HP" value={e.hp} max={1200} color="#e57373" />
                    <Stat label="Скорость" value={e.speed} max={5} color="#4fc3f7" />
                    <Stat label="Урон" value={e.dmg} max={25} color="#ff7043" />
                    <Stat label="Дальность атаки" value={reachOf(enemy)} max={18} color="#aed581" />
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.65, marginTop: 8 }}>Сложность масштабирует HP и урон: Боец ×0.8 • Ветеран ×1.0 • Легенда-42 ×1.25. Босс на 7-й волне призывает 2 бегунов раз в 12с.</div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'maps' && (
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 14 }}>
            <div style={{ display: 'grid', gap: 8, alignContent: 'start' }}>
              {MAP_ORDER.map((id) => (
                <button key={id} onClick={() => setMap(id)} style={id === map ? pickActive : pick}>
                  <div style={{ fontWeight: 800, fontSize: 14 }}>{MAP_META[id].name}</div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>{MAP_META[id].size}×{MAP_META[id].size} м</div>
                </button>
              ))}
            </div>
            <div style={card}>
              <div style={{
                height: 200, borderRadius: 14, border: '1px solid rgba(0,229,255,0.3)',
                background: 'radial-gradient(ellipse 90% 80% at 50% 30%, #14203a 0%, #0b0e17 65%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ width: mapScale(mm.size), height: mapScale(mm.size), border: '2px solid #ffd166', borderRadius: 8, position: 'relative', background: 'rgba(255,209,102,0.06)' }}>
                  <span style={{ position: 'absolute', top: -20, left: 0, fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{mm.size}×{mm.size} м</span>
                  <span style={{ position: 'absolute', left: '50%', top: '50%', width: 8, height: 8, borderRadius: '50%', background: '#00e5ff', transform: 'translate(-50%,-50%)', boxShadow: '0 0 10px #00e5ff' }} />
                  <span style={{ position: 'absolute', left: 8, top: 8, width: 6, height: 6, borderRadius: '50%', background: '#ff5252' }} />
                  <span style={{ position: 'absolute', right: 8, top: 8, width: 6, height: 6, borderRadius: '50%', background: '#ff5252' }} />
                </div>
                <div style={{ position: 'absolute', bottom: 8, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>схема: спавны красным, центр — циан</div>
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 19, fontWeight: 800 }}>{mm.name} <span style={keyBadge}>{mm.size} м</span></div>
                <div style={{ opacity: 0.85, fontSize: 13, marginTop: 4 }}>{mm.desc}</div>
                <div style={{ fontSize: 13, marginTop: 6, color: '#00e5ff' }}>Фишка: {mm.feature}</div>
                <div style={{ color: '#ffd166', fontSize: 13, marginTop: 4 }}>Тактика: {mm.tactic}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const mapScale = (size: number) => Math.round(120 + (size - 42) * 2.2);

const card: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: 14, padding: '14px 16px',
};
const btn: React.CSSProperties = {
  padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.3)',
  background: 'rgba(20,20,30,0.6)', color: '#fff', fontSize: 15, cursor: 'pointer',
};
const btnActive: React.CSSProperties = { ...btn, border: '2px solid #ffd166', background: 'rgba(60,50,20,0.8)' };
const btnSm: React.CSSProperties = { ...btn, padding: '6px 12px', fontSize: 15 };
const pick: React.CSSProperties = {
  textAlign: 'left', padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
  border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.04)', color: '#fff',
};
const pickActive: React.CSSProperties = { ...pick, border: '2px solid #ffd166', background: 'rgba(60,50,20,0.6)' };
const keyBadge: React.CSSProperties = {
  display: 'inline-block', border: '1px solid #ffd166', borderRadius: 5, padding: '0 7px',
  fontSize: 13, color: '#ffd166', marginLeft: 6,
};
