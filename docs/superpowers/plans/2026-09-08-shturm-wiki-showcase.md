# Вики-витрина 3D + карты Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Заменить иконки Вики на крутящуюся 3D-модель на стенде и добавить таб карт с лором.

**Architecture:** Отдельные детализированные showcase-билдеры (бой не трогаем); один `wikiViewer.tsx` со студийной сценой (стенд, парение, авто+drag); `wiki.tsx` — табы Оружие/Враги/Карты, слева вьювер, справа статы; `MAP_LORE` в `maps.ts`.

**Tech Stack:** React 18, three ^0.170.0, vite ^5.4.0, bun test, tsc --noEmit.

**Spec:** `/root/sites/docs/superpowers/specs/2026-09-08-shturm-wiki-showcase-design.md`

## Global Constraints

- workdir для всех команд — `/root/sites/shturm.bratuxa.zomb.top`.
- Чужие файлы монорепо не трогать; свои коммитить сразу.
- Боевые файлы (`guns.ts`, `mobs/*`, `weapons.ts`-числа, `enemies.ts`-числа) не менять.
- Эмодзи/SVG в витрине запрещены — только 3D.
- `bun.lock` менять только через `bun add/remove/update`, не руками.
- Typecheck только `tsc --noEmit`; сборка `bunx --bun vite build`.

---

### Task 1: MAP_LORE + тест лора карт

**Files:**
- Modify: `src/sim/maps.ts` (добавить `MapLore` + `MAP_LORE` после `MAPS`)
- Test: `tests/wiki.test.ts` (новый)

**Interfaces:**
- Consumes: `MAPS`, `MapId` из `src/sim/maps.ts`.
- Produces: `MAP_LORE: Record<MapId, { name, look, lore }>` для Task 4.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from 'bun:test';
import { MAPS, MAP_LORE, type MapId } from '../src/sim/maps';

const IDS = Object.keys(MAPS) as MapId[];

describe('вики: лор карт', () => {
  test('лор есть для каждой карты из MAPS', () => {
    for (const id of IDS) {
      expect(MAP_LORE[id].name.length).toBeGreaterThan(0);
      expect(MAP_LORE[id].look.length).toBeGreaterThan(10);
      expect(MAP_LORE[id].lore.length).toBeGreaterThan(10);
    }
  });
  test('yard/island/neon на месте', () => {
    expect(Object.keys(MAP_LORE).sort()).toEqual(['island', 'neon', 'yard']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `/root/.bun/bin/bun test tests/wiki.test.ts`
Expected: FAIL with "MAP_LORE is not defined" (или Cannot find export).

- [ ] **Step 3: Write minimal implementation**

```ts
export interface MapLore { name: string; look: string; lore: string; }
export const MAP_LORE: Record<MapId, MapLore> = {
  yard: {
    name: 'Двор-42',
    look: 'Закрытый двор 42×42: будка, покрышки, ящики, пруд в центре.',
    lore: 'Первый рубеж ШТУРМа — учебный двор батальона 42. Новобранцы держат круг у пруда, пока чайки Рукрасии кружат над забором.',
  },
  island: {
    name: 'Остров Дениса',
    look: 'Большой остров 60×60: пальмы, камни, мешки, ящики.',
    lore: 'Дальний форпост у воды. Отряд держит песчаный плацдарм, отбивая волны с двух берегов, пока катер с большой земли не пробьётся сквозь туман.',
  },
  neon: {
    name: 'Неон',
    look: 'Ночная площадка 50×50: стойки с неоном, бочки, контейнер.',
    lore: 'Ночной терминал на краю города. Разгрузка идёт под неоном, тени между контейнерами шевелятся: Рукрасия уже внутри периметра.',
  },
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `/root/.bun/bin/bun test tests/wiki.test.ts`
Expected: PASS (2 pass).

- [ ] **Step 5: Commit**

```bash
git add src/sim/maps.ts tests/wiki.test.ts
git commit -m "shturm: MAP_LORE + тест лора карт 🏆"
```

### Task 2: showcase.ts — детализированные витринные билдеры

**Files:**
- Create: `src/three/showcase.ts`
- Test: `tests/showcase.test.ts` (новый)

**Interfaces:**
- Consumes: `three`, `GunSlot` из `./guns`, `MobKind` из `./mobs/index`.
- Produces: `makeShowcaseGun(slot: GunSlot): THREE.Group`, `makeShowcaseMob(kind: MobKind): THREE.Group`, `stepYaw(yaw: number, vel: number, dt: number): { yaw, vel }` для Task 3.

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, test } from 'bun:test';
import { makeShowcaseGun, makeShowcaseMob, stepYaw } from '../src/three/showcase';

describe('витрина: билдеры', () => {
  test('пушки строятся и не пустые', () => {
    for (const s of ['pistol', 'auto', 'shotgun'] as const) {
      const g = makeShowcaseGun(s);
      expect(g.children.length).toBeGreaterThan(3);
    }
  });
  test('мобы строятся и не пустые', () => {
    for (const k of ['runner', 'shooter', 'tank', 'seagull'] as const) {
      const g = makeShowcaseMob(k);
      expect(g.children.length).toBeGreaterThan(2);
    }
  });
  test('stepYaw гасит скорость', () => {
    const r = stepYaw(0, 3, 1);
    expect(r.yaw).toBeCloseTo(3, 6);
    expect(Math.abs(r.vel)).toBeLessThan(3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `/root/.bun/bin/bun test tests/showcase.test.ts`
Expected: FAIL with "Cannot find module '../src/three/showcase'".

- [ ] **Step 3: Write minimal implementation**

```ts
import * as THREE from 'three';
import { makeGun, type GunSlot } from './guns';
import { makeMob, type MobKind } from './mobs/index';

const detail = (g: THREE.Group): THREE.Group => {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.55, 0.03, 24, 72),
    new THREE.MeshStandardMaterial({ color: 0xffd166, emissive: 0xff9d2e, emissiveIntensity: 1.2, metalness: 0.6, roughness: 0.3 }),
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = -0.9;
  g.add(ring);
  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(0.72, 0.015, 16, 72),
    new THREE.MeshBasicMaterial({ color: 0x4fc3f7 }),
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -0.92;
  g.add(rim);
  return g;
};

export function makeShowcaseGun(slot: GunSlot): THREE.Group {
  const g = makeGun(slot);
  g.scale.setScalar(1.15);
  return detail(g);
}

export function makeShowcaseMob(kind: MobKind): THREE.Group {
  const g = makeMob(kind);
  g.scale.setScalar(kind === 'seagull' ? 0.8 : 1.0);
  return detail(g);
}

export function stepYaw(yaw: number, vel: number, dt: number): { yaw: number; vel: number } {
  const nv = vel * Math.exp(-2.2 * dt);
  return { yaw: yaw + nv * dt, vel: Math.abs(nv) < 0.001 ? 0 : nv };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `/root/.bun/bin/bun test tests/showcase.test.ts`
Expected: PASS (3 pass).

- [ ] **Step 5: Commit**

```bash
git add src/three/showcase.ts tests/showcase.test.ts
git commit -m "shturm: showcase-билдеры + stepYaw 🏆"
```

### Task 3: wikiViewer.tsx — студийная сцена со стендом

**Files:**
- Create: `src/ui/wikiViewer.tsx`
- Consumes: `makeShowcaseGun`, `makeShowcaseMob`, `stepYaw` из `../three/showcase`.
- Produces: `WikiViewer({ kind: 'gun' | 'mob', id: string })` для Task 4.

- [ ] **Step 1: Write the component**

```tsx
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { makeShowcaseGun, makeShowcaseMob, stepYaw } from '../three/showcase';
import type { GunSlot } from '../three/guns';
import type { MobKind } from '../three/mobs/index';

const MOB_OF: Record<string, MobKind> = { runner: 'runner', shooter: 'shooter', tank: 'tank', boss: 'seagull' };

export function WikiViewer({ kind, id }: { kind: 'gun' | 'mob'; id: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current!;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    el.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    cam.position.set(0, 1.4, 4.2);
    cam.lookAt(0, 0.3, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.DirectionalLight(0xffe0b3, 1.6);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x4fc3f7, 1.1);
    rim.position.set(-4, 2, -3);
    scene.add(rim);
    const disc = new THREE.Mesh(
      new THREE.CylinderGeometry(1.0, 1.15, 0.12, 48),
      new THREE.MeshStandardMaterial({ color: 0x141824, metalness: 0.7, roughness: 0.35 }),
    );
    disc.position.y = -1.0;
    scene.add(disc);

    let yaw = 0;
    let vel = 1.1;
    let drag = false;
    let px = 0;
    const onDown = (e: PointerEvent) => { drag = true; px = e.clientX; };
    const onMove = (e: PointerEvent) => { if (drag) { yaw += (e.clientX - px) * 0.01; px = e.clientX; vel = 0; } };
    const onUp = () => { drag = false; vel = 0.9; };
    renderer.domElement.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    let raf = 0;
    let t = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      if (!drag) {
        const s = stepYaw(yaw, vel === 0 ? 0.55 : vel, dt);
        yaw = s.yaw;
        vel = s.vel === 0 ? 0.55 : s.vel;
      }
      model.rotation.y = yaw;
      model.position.y = Math.sin(t * 1.6) * 0.08;
      const w = el.clientWidth || 300;
      const h = el.clientHeight || 300;
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      renderer.render(scene, cam);
      raf = requestAnimationFrame(tick);
    };
    const model = kind === 'gun'
      ? makeShowcaseGun(id as GunSlot)
      : makeShowcaseMob(MOB_OF[id] ?? 'runner');
    model.position.y = 0.2;
    scene.add(model);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      renderer.domElement.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) {
          m.geometry.dispose();
          const mt = m.material as THREE.Material | THREE.Material[];
          (Array.isArray(mt) ? mt : [mt]).forEach((x) => x.dispose());
        }
      });
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [kind, id]);

  return <div ref={ref} style={{ width: '100%', height: 320, cursor: 'grab', borderRadius: 12, background: 'radial-gradient(circle at 50% 35%, rgba(255,209,102,0.14), rgba(5,7,14,0) 70%)' }} />;
}
```

- [ ] **Step 2: Typecheck**

Run: `/root/.bun/bin/bunx --bun tsc --noEmit`
Expected: PASS (нет ошибок в `wikiViewer.tsx`).

- [ ] **Step 3: Run full test suite**

Run: `/root/.bun/bin/bun test`
Expected: PASS (все тесты зелёные).

- [ ] **Step 4: Commit**

```bash
git add src/ui/wikiViewer.tsx
git commit -m "shturm: wikiViewer — стенд, парение, авто+drag 🏆"
```

### Task 4: wiki.tsx — табы, вьювер слева, статы справа, карты

**Files:**
- Modify: `src/ui/wiki.tsx` (табы weapons/enemies/maps; левая колонка WikiViewer, правая — имя/описание/совет + Stat; карты из MAP_LORE)
- Test: `tests/wiki.test.ts` (дописать проверку мета)

**Interfaces:**
- Consumes: `WikiViewer`, `MAP_LORE`, `WEAPONS`/`WEAPON_META`/`SLOT_ORDER`, `ENEMIES`/`ENEMY_META`.

- [ ] **Step 1: Add regression guard (static imports, must pass)**

```ts
import { WEAPONS, WEAPON_META, SLOT_ORDER } from '../src/sim/weapons';
import { ENEMIES, ENEMY_META } from '../src/sim/enemies';

test('мета оружия и врагов консистентны', () => {
  for (const s of SLOT_ORDER) {
    expect(WEAPONS[s].dmg).toBeGreaterThan(0);
    expect(WEAPON_META[s].name.length).toBeGreaterThan(0);
  }
  for (const t of ['runner', 'shooter', 'tank', 'boss'] as const) {
    expect(ENEMIES[t].hp).toBeGreaterThan(0);
    expect(ENEMY_META[t].name.length).toBeGreaterThan(0);
  }
});
```

- [ ] **Step 2: Run tests**

Run: `/root/.bun/bin/bun test tests/wiki.test.ts`
Expected: PASS (регресс-сторож; TDD-цикл этой задачи — typecheck+build в шаге 4).

- [ ] **Step 3: Rework wiki.tsx (полный файл)**

```tsx
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
```

- [ ] **Step 4: Typecheck + tests**

Run: `/root/.bun/bin/bunx --bun tsc --noEmit && /root/.bun/bin/bun test`
Expected: PASS везде.

- [ ] **Step 5: Commit**

```bash
git add src/ui/wiki.tsx tests/wiki.test.ts
git commit -m "shturm: вики — вьювер + статы + карты 🏆"
```

### Task 5: Сборка, проверка, финальный коммит

**Files:** без изменений кода; проверка артефактов.

- [ ] **Step 1: Build**

Run: `/root/.bun/bin/bunx --bun vite build`
Expected: `built in` без ошибок TS.

- [ ] **Step 2: Serve + curl**

Run: `nohup /root/.bun/bin/bunx --bun vite preview --port 8099 & sleep 2; curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8099/; kill %1`
Expected: `200`.

- [ ] **Step 3: Final test suite**

Run: `/root/.bun/bin/bun test`
Expected: PASS.

- [ ] **Step 4: Push-готовность**

Run: `git log --oneline -6 && git status --short`
Expected: 5 новых коммитов вики поверх базы; чужих файлов нет.
