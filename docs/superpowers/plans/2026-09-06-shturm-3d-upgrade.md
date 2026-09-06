# ШТУРМ-43 3D-апгрейд Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Заменить кубы-примитивы на детализированных риг-мобов, оживить карты, оружие и эффекты.

**Architecture:** Новый `src/three/textures.ts` (процедурный canvas + кэш) питает все материалы;
новый `src/three/rig.ts` (кости + SkinnedMesh + кодовые клипы) — основа `mobs.ts`;
`main.tsx` правится точечно: контроллер анима на врага, смерть с задержкой, bloom только на неоне.

**Tech Stack:** three@0.170.0, bun test, vite build, harness-chrome :9222.

**Spec:** `/root/sites/docs/superpowers/specs/2026-09-06-shturm-3d-upgrade-design.md`

## Global Constraints

- Правила боя живут только в `src/sim` — three/ только рендер снапшота.
- PBR MeshStandardMaterial, ACESFilmicToneMapping, pixelRatio<=2 (моб<=1.5).
- 42+ FPS, ≤120 draw calls, тени 1024 моб / 2048 деск.
- Коммиты: префикс `shturm:`, эмодзи в конце, UI-тексты по-русски.
- Проверка в браузере обязательна (harness-chrome :9222), иначе 0/10.
- `Enemy.mesh` остаётся `THREE.Group` (main.tsx задаёт position/rotation.y напрямую).
- `scene.fog` остаётся `THREE.Fog` (applyMapMood в main.tsx опирается на near/far).

---

### Task 1: Процедурные текстуры + кэш

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/three/textures.ts`
- Test: `shturm.bratuxa.zomb.top/tests/textures.test.ts`

**Interfaces:**
- Consumes: ничего (только three + DOM canvas).
- Produces: `getTex(kind: TexKind): THREE.CanvasTexture` (кэш по kind, repeat/wrap настроены);
  `TexKind = 'fur' | 'camo' | 'rust' | 'fabric' | 'sand' | 'asphalt' | 'sign' | 'wood' | 'palm'`;
  `roughFrom(canvas): CanvasTexture` (grayscale-версия для roughnessMap).
  Позже используют Task 3 (мобы), Task 5 (карты), Task 6 (оружие).

- [ ] **Step 1: Failing test кэша и размеров**

```ts
// tests/textures.test.ts
import { describe, expect, test } from 'bun:test';
import { getTex } from '../src/three/textures';
describe('textures', () => {
  test('возвращает 256 canvas и кэширует по kind', () => {
    const a = getTex('fur');
    expect(a.image.width).toBe(256);
    expect(getTex('fur')).toBe(a);
  });
});
```

- [ ] **Step 2: Run, убедиться что падает**

Run: `cd /root/sites/shturm.bratuxa.zomb.top && ~/.bun/bin/bun test tests/textures.test.ts`
Expected: FAIL (модуля нет).

- [ ] **Step 3: Минимальная реализация**

```ts
import * as THREE from 'three';
export type TexKind = 'fur' | 'camo' | 'rust' | 'fabric' | 'sand' | 'asphalt' | 'sign' | 'wood' | 'palm';
const cache = new Map<TexKind, THREE.CanvasTexture>();
function canvas(n: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas'); c.width = c.height = n;
  return [c, c.getContext('2d')!];
}
function noise(ctx: CanvasRenderingContext2D, n: number, a: string, b: string) {
  ctx.fillStyle = a; ctx.fillRect(0, 0, n, n);
  for (let i = 0; i < n * 12; i++) {
    ctx.fillStyle = Math.random() < 0.5 ? a : b;
    ctx.fillRect(Math.random() * n, Math.random() * n, 2, 2);
  }
}
const painters: Record<TexKind, (ctx: CanvasRenderingContext2D, n: number) => void> = {
  fur: (ctx, n) => { noise(ctx, n, '#6b4a2f', '#4a3120'); ctx.strokeStyle = '#3a2617';
    for (let i = 0; i < 900; i++) { const x = Math.random()*n, y = Math.random()*n;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 3, y + 6); ctx.stroke(); } },
  camo: (ctx, n) => { noise(ctx, n, '#3a5a2e', '#3a5a2e'); ctx.fillStyle = '#2b4222';
    for (let i = 0; i < 14; i++) { ctx.beginPath();
      ctx.ellipse(Math.random()*n, Math.random()*n, 12+Math.random()*22, 8+Math.random()*14, Math.random()*3, 0, 7); ctx.fill(); } },
  rust: (ctx, n) => { noise(ctx, n, '#5a3a22', '#7a4a22'); ctx.fillStyle = '#8a3a10';
    for (let i = 0; i < 40; i++) { ctx.globalAlpha = 0.5;
      ctx.fillRect(Math.random()*n, Math.random()*n, 3+Math.random()*10, 2+Math.random()*5); } ctx.globalAlpha = 1; },
  fabric: (ctx, n) => { noise(ctx, n, '#4a4a52', '#4a4a52'); ctx.strokeStyle = '#3a3a42';
    for (let y = 0; y < n; y += 4) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(n, y); ctx.stroke(); } },
  sand: (ctx, n) => { noise(ctx, n, '#c2a35e', '#a8894a'); },
  asphalt: (ctx, n) => { noise(ctx, n, '#23242a', '#2e2f36'); },
  sign: (ctx, n) => { ctx.fillStyle = '#0b0e1a'; ctx.fillRect(0, 0, n, n);
    ctx.fillStyle = '#00f0ff'; ctx.font = `bold ${n/5}px sans-serif`;
    ctx.fillText('ШТУРМ-43', n/10, n/2); },
  wood: (ctx, n) => { noise(ctx, n, '#7a4a21', '#6a3d1a'); ctx.strokeStyle = '#5a3315';
    for (let y = 0; y < n; y += 7) { ctx.beginPath(); ctx.moveTo(0, y);
      ctx.bezierCurveTo(n/3, y+4, 2*n/3, y-4, n, y); ctx.stroke(); } },
  palm: (ctx, n) => { noise(ctx, n, '#2e6b2e', '#245a24'); ctx.strokeStyle = '#1d4a1d';
    for (let i = 0; i < 60; i++) { const x = Math.random()*n;
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x+6, n); ctx.stroke(); } },
};
export function getTex(kind: TexKind, size = 256): THREE.CanvasTexture {
  const hit = cache.get(kind);
  if (hit) return hit;
  const [c, ctx] = canvas(size);
  painters[kind](ctx, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  cache.set(kind, t);
  return t;
}
export function roughFrom(src: HTMLCanvasElement): THREE.CanvasTexture {
  const [c, ctx] = canvas(src.width);
  ctx.filter = 'grayscale(1)';
  ctx.drawImage(src, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
```

- [ ] **Step 4: Run, убедиться что зелёный**

Run: `cd /root/sites/shturm.bratuxa.zomb.top && ~/.bun/bin/bun test tests/textures.test.ts`
Expected: PASS (4 pass с соседними? нет — только этот файл: 1 pass).

- [ ] **Step 5: Commit**

```bash
cd /root/sites && git add shturm.bratuxa.zomb.top/src/three/textures.ts shturm.bratuxa.zomb.top/tests/textures.test.ts
git commit -m "shturm: процедурные текстуры + кэш 🎨"
```

---

### Task 2: Костяной риг + кодовые клипы

**Files:**
- Create: `shturm.bratuxa.zomb.top/src/three/rig.ts`
- Test: `shturm.bratuxa.zomb.top/tests/rig.test.ts`

**Interfaces:**
- Consumes: three.
- Produces: `buildHumanoid(): { root: THREE.Group; bones: Record<string, THREE.Bone> }`
  (кости: hips, spine, head, shoulderL/R, elbowL/R, handL/R, hipL/R, kneeL/R, footL/R);
  `buildWings(root): { wingL: THREE.Bone[]; wingR: THREE.Bone[] }` (плечо/локоть/кисть крыла);
  `skinBox(w: number, h: number, d: number, bones: THREE.Bone[], weights: number[]): THREE.SkinnedMesh`
  (бокс, привязанный к костям с весами);
  `makeClips(kind: 'biped' | 'wings'): Record<'idle'|'walk'|'attack'|'death', THREE.AnimationClip>`
  (клипы по именам костей; death 0.8с LoopOnce).
  Потребляет Task 3 (мобы).

Ключевая механика клипов: треки `QuaternionKeyframeTrack` на `.bones[name].quaternion`
не работают напрямую — вместо этого клипы таргетят ноды по именам через
`mixer.clipAction(clip, root)`? Нет: AnimationClip резолвит пути относительно root ми
ксера (`THREE.PropertyBinding`). Клип создаётся с путями вида `shoulderL.quaternion`,
миксер — `new THREE.AnimationMixer(root)`, где root содержит именованные Object3D.
Кости THREE.Bone — это Object3D с именами, резолвинг штатный. SkinnedMesh внутри root.

- [ ] **Step 1: Failing test скелета и клипов**

```ts
// tests/rig.test.ts
import { describe, expect, test } from 'bun:test';
import { buildHumanoid, makeClips } from '../src/three/rig';
describe('rig', () => {
  test('гуманоид: 15 костей с именами', () => {
    const { bones } = buildHumanoid();
    expect(Object.keys(bones).length).toBe(15);
    expect(bones.kneeL.name).toBe('kneeL');
  });
  test('клипы: 4 шт, death короче 1с', () => {
    const clips = makeClips('biped');
    expect(Object.keys(clips).sort()).toEqual(['attack', 'death', 'idle', 'walk']);
    expect(clips.death.duration).toBeLessThan(1);
  });
});
```

- [ ] **Step 2: Run, убедиться что падает**

Run: `cd /root/sites/shturm.bratuxa.zomb.top && ~/.bun/bin/bun test tests/rig.test.ts`
Expected: FAIL (модуля нет).

- [ ] **Step 3: Минимальная реализация**

```ts
import * as THREE from 'three';
export type RigKind = 'biped' | 'wings';
function bone(name: string, parent: THREE.Object3D, x = 0, y = 0, z = 0): THREE.Bone {
  const b = new THREE.Bone(); b.name = name; b.position.set(x, y, z); parent.add(b); return b;
}
export function buildHumanoid(): { root: THREE.Group; bones: Record<string, THREE.Bone> } {
  const root = new THREE.Group(); root.name = 'rig';
  const bones: Record<string, THREE.Bone> = {};
  bones.hips = bone('hips', root, 0, 1.1, 0);
  bones.spine = bone('spine', bones.hips, 0, 0.35, 0);
  bones.head = bone('head', bones.spine, 0, 0.45, 0);
  for (const s of ['L', 'R'] as const) {
    const sg = s === 'L' ? -1 : 1;
    bones[`shoulder${s}`] = bone(`shoulder${s}`, bones.spine, 0.28 * sg, 0.3, 0);
    bones[`elbow${s}`] = bone(`elbow${s}`, bones[`shoulder${s}`], 0, -0.35, 0);
    bones[`hand${s}`] = bone(`hand${s}`, bones[`elbow${s}`], 0, -0.3, 0);
    bones[`hip${s}`] = bone(`hip${s}`, bones.hips, 0.12 * sg, -0.1, 0);
    bones[`knee${s}`] = bone(`knee${s}`, bones[`hip${s}`], 0, -0.45, 0);
    bones[`foot${s}`] = bone(`foot${s}`, bones[`knee${s}`], 0, -0.45, 0);
  }
  return { root, bones };
}
export function buildWings(root: THREE.Group): { wingL: THREE.Bone[]; wingR: THREE.Bone[] } {
  const mk = (s: 'L' | 'R') => {
    const sg = s === 'L' ? -1 : 1;
    const a = bone(`wingA${s}`, root, 0.3 * sg, 0.2, 0);
    const b = bone(`wingB${s}`, a, 0.7 * sg, 0, 0);
    const c = bone(`wingC${s}`, b, 0.7 * sg, 0, 0);
    return [a, b, c];
  };
  return { wingL: mk('L'), wingR: mk('R') };
}
/** Бокс, скиннованный к костям: вершины делятся по Y между boneA(верх)/boneB(низ). */
export function skinBox(w: number, h: number, d: number, boneA: THREE.Bone, boneB: THREE.Bone): THREE.SkinnedMesh {
  const g = new THREE.BoxGeometry(w, h, d, 1, 4, 1);
  const pos = g.attributes.position;
  const idx = new THREE.BufferAttribute(new Uint16Array(pos.count * 4), 4);
  const wgt = new THREE.BufferAttribute(new Float32Array(pos.count * 4), 4);
  // Индексы костей в skeleton: 0 = boneA, 1 = boneB (порядок задаёт вызывающий через Skeleton).
  for (let i = 0; i < pos.count; i++) {
    const t = THREE.MathUtils.clamp(0.5 - pos.getY(i) / h, 0, 1);
    idx.setXYZW(i, 0, 1, 0, 0);
    wgt.setXYZW(i, 1 - t, t, 0, 0);
  }
  g.setAttribute('skinIndex', idx);
  g.setAttribute('skinWeight', wgt);
  const m = new THREE.SkinnedMesh(g, new THREE.MeshStandardMaterial({ roughness: 0.8 }));
  m.castShadow = true;
  m.add(boneA); // кости должны быть в графе меша для updateMatrixWorld
  return m;
}
function q(axis: 'x' | 'z', deg: number): number[] {
  const e = new THREE.Euler(axis === 'x' ? THREE.MathUtils.degToRad(deg) : 0, 0, axis === 'z' ? THREE.MathUtils.degToRad(deg) : 0);
  const q = new THREE.Quaternion().setFromEuler(e);
  return [q.x, q.y, q.z, q.w];
}
function swing(name: string, axis: 'x' | 'z', amp: number, dur: number): THREE.QuaternionKeyframeTrack {
  return new THREE.QuaternionKeyframeTrack(`${name}.quaternion`, [0, dur / 2, dur],
    [...q(axis, -amp), ...q(axis, amp), ...q(axis, -amp)]);
}
export function makeClips(kind: RigKind): Record<'idle' | 'walk' | 'attack' | 'death', THREE.AnimationClip> {
  const idle = new THREE.AnimationClip('idle', 2, [
    new THREE.VectorKeyframeTrack('spine.position', [0, 1, 2], [0,0,0, 0,0.03,0, 0,0,0]),
  ]);
  const legL = kind === 'wings' ? 'wingAL.quaternion' : 'hipL.quaternion';
  void legL;
  const walk = new THREE.AnimationClip('walk', 0.6, [
    swing('hipL', 'x', 30, 0.6), swing('hipR', 'x', 30, 0.6),
    swing('kneeL', 'x', 40, 0.6), swing('kneeR', 'x', 40, 0.6),
    swing('shoulderL', 'x', 25, 0.6), swing('shoulderR', 'x', 25, 0.6),
  ]);
  const attack = new THREE.AnimationClip('attack', 0.4, [
    new THREE.QuaternionKeyframeTrack('shoulderR.quaternion', [0, 0.2, 0.4],
      [...q('x', 0), ...q('x', -120), ...q('x', 0)]),
  ]);
  const death = new THREE.AnimationClip('death', 0.8, [
    new THREE.QuaternionKeyframeTrack('hips.quaternion', [0, 0.8], [...q('x', 0), ...q('x', -90)]),
    new THREE.VectorKeyframeTrack('hips.position', [0, 0.8], [0,0,0, 0,-0.9,0]),
  ]);
  return { idle, walk, attack, death };
}
```

Примечание исполнителю: противофаза ног (L/R со сдвигом) — через `walk` длительностью 0.6 и
отрицательный phase-offset второй ноги задаётся в Task 4 (action.time): `actL.startAt?` —
проще: два одинаковых трека hipL/hipR уже в противофазе, если один сдвинуть:
в Task 4 при создании экшенов `walkR.time = 0.3`. Треки выше симметричны — сдвиг делает
миксер через стартовое время экшена второй копии клипа. Для крыльев чайки Task 4 строит
отдельный взмах из `buildWings` (sin по wingA/B/C), клип walk чайке не применяется.

- [ ] **Step 4: Run, убедиться что зелёный**

Run: `cd /root/sites/shturm.bratuxa.zomb.top && ~/.bun/bin/bun test tests/rig.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd /root/sites && git add shturm.bratuxa.zomb.top/src/three/rig.ts shturm.bratuxa.zomb.top/tests/rig.test.ts
git commit -m "shturm: костяной риг + кодовые клипы 🦴"
```

---

### Task 3: Мобы на риге + детали + вертушка

**Files:**
- Modify: `shturm.bratuxa.zomb.top/src/three/mobs.ts` (полный перепил, сигнатуры сохранить)
- Create (временно, удалить в Task 8): `shturm.bratuxa.zomb.top/preview.html`

**Interfaces:**
- Consumes: Task 1 (`getTex`), Task 2 (`buildHumanoid`, `buildWings`, `skinBox`, `makeClips`).
- Produces: `makeMob(kind)` — как раньше возвращает THREE.Group (внутри root рига +
  SkinnedMesh + детали + mixer в `group.userData.mixer`, экшены в `userData.actions`);
  `setMobLightDetail(root, low)` — без изменений сигнатуры;
  `updateMob(mesh, state: { speed: number; attacking: boolean; dying: boolean; dt: number })` —
  НОВОЕ: блендинг idle/walk по скорости, attack поверх, death один раз.
  Потребляет Task 4 (main.tsx).

Детали по видам (shared-материалы модуля, ≤5к треугольников):
- runner: тощий торс (fur тёмный), голова с глазами (emissive), пасть, когти-лапы;
- shooter: torso fabric-камуфляж, подсумки-боксы на поясе, фонарь с линзой + SpotLight (как было);
- tank: торс-броня (rust металл), наплечники, шлем с прорезью, кулаки-цилиндры;
- seagull: тело-бокс со скин-весом на spine, крылья из 3 плоскостей с feather-текстурой
  (canvas-полосы), клюв-конус, глаза.

- [ ] **Step 1: Перепил mobs.ts** (сохранить `makeMob`, `setMobLightDetail`, добавить `updateMob`;
  SkinnedMesh: собрать `new THREE.Skeleton([boneA, boneB])`, `mesh.bind(skeleton)`,
  кости добавить в сцену-граф меша через `mesh.add(root)`).

- [ ] **Step 2: Typecheck + build**

Run: `cd /root/sites/shturm.bratuxa.zomb.top && ~/.bun/bin/bun run build`
Expected: dist собран без ошибок TS.

- [ ] **Step 3: Вертушка — временная страница и скрины 4 видов**

```html
<!-- preview.html (временно, удалить в Task 8) -->
<!doctype html><html><body>
<script type="module">
import * as THREE from '/src/three/preview-scene.ts';
</script></body></html>
```

Проще без нового модуля: исполнитель пишет `src/three/preview-scene.ts` (временно):
сцена + свет + земля, `makeMob(kind)` по `?kind=runner`, медленное вращение root.
Проверка через vite preview:
Run: `cd /root/sites/shturm.bratuxa.zomb.top && ~/.bun/bin/bunx vite preview --port 4173 &`
Затем browser_exec: открыть `http://127.0.0.1:4173/preview.html?kind=<вид>`,
4 скриншота (0°/90°/180°/270° — через js поворот root), проверить силуэты со всех сторон.
Expected: все 4 вида узнаваемы, без дыр/вывернутых нормалей. Найти косяк → чинить → повтор.

- [ ] **Step 4: Commit** (без preview-файлов)

```bash
cd /root/sites && git add shturm.bratuxa.zomb.top/src/three/mobs.ts
git commit -m "shturm: мобы на костях, детали по видам 🦴"
```

---

### Task 4: Интеграция мобов в main.tsx (контроллер + смерть с задержкой)

**Files:**
- Modify: `shturm.bratuxa.zomb.top/src/main.tsx` (spawnOne ~строки 195-203, хитскан-смерть ~405-408, кадр ~584-588)

**Interfaces:**
- Consumes: Task 3 (`updateMob`).
- Produces: играбельная сцена с анимированными мобами; смерт
ь — death-клип 0.8с, потом remove.

- [ ] **Step 1: Контроллер при спавне + скорость/атака в кадре**

В `spawnOne` после `scene.add(mesh)` добавить поле контроллера:
`sim.enemies.push({ ..., anim: { dying: false, dieT: 0 } })` — тип Enemy расширить
полем `anim` (файл типов рядом, где объявлен Enemy — найти grep'ом `interface Enemy`).
В кадровом цикле (бывшие строки 584-588) заменить bob-качание на:
```ts
for (const e of sim.enemies) {
  const v = base_speed_of(e); // скорость из ENEMIES[e.type].speed, 0 если стоит
  updateMob(e.mesh, { speed: v, attacking: e.cd > 0.6, dying: e.anim.dying, dt });
  e.mesh.position.set(e.x, 0, e.z);
  e.mesh.rotation.y = Math.atan2(p.x - e.x, p.z - e.z);
}
```
Скорость стоящего моба: вычислить из прошлого кадра (`e.px/e.pz`, добавить поля,
`speed = hypot(dx,dz)/dt`). Противофаза ног: внутри updateMob два экшена walk,
второму `action.time = 0.3`.

- [ ] **Step 2: Смерть с задержкой вместо мгновенного remove**

Блок `if (best.hp <= 0)` (строки ~405-408): вместо `scene.remove` выставить
`best.anim.dying = true; best.anim.dieT = 0.8;` и НЕ удалять из массива.
В кадровом цикле: `if (e.anim.dying) { e.anim.dieT -= dt; if (e.anim.dieT <= 0) {
scene.remove(e.mesh); sim.enemies.splice(...); } }` (счёт kills — в момент удара,
как было). Мёртвый моб не ходит/не бьёт: в ИИ-цикле пропускать `if (e.anim.dying) continue`.

- [ ] **Step 3: Браузер — бой со скринами действий**

browser_exec: `__shturm.start('yard','normal')`, `__shturm.wave(1)`, подождать спавна,
`__shturm.aimNearest()`, `__shturm.fire(true)` 3с; скрины: idle-моб, идущий, атака, смерть.
Expected: клипы видны, смерть падает и исчезает через ~0.8с, консоль 0 ошибок.

- [ ] **Step 4: Commit**

```bash
cd /root/sites && git add shturm.bratuxa.zomb.top/src/main.tsx
git commit -m "shturm: контроллер анима мобов, смерть с задержкой 🎬"
```

---

### Task 5: Карты — объекты, текстуры, атмосфера

**Files:**
- Modify: `shturm.bratuxa.zomb.top/src/three/mapsVisual.ts`
- Modify: `shturm.bratuxa.zomb.top/src/main.tsx` (applyMapMood ~строки 243-262: плотности тумана)

**Interfaces:**
- Consumes: Task 1 (`getTex`).
- Produces: те же `buildMapVisual(map)` / `disposeMapVisual` (сигнатуры без изменений).

Наборы (всё merged, текстуры из Task 1):
- yard: забор-доски по периметру (вместо глухих стен — доски с щелями через alphaTest-текстуру),
  будка, покрышки (торы), ящики, лужи (plane, roughness 0.1 + envMapIntensity 1.5).
- island: пальмы (цилиндр-ствол + 6 плоскостей-крона с palm-текстурой, DoubleSide),
  камни (додекаэдры со sand), вода-кольцо по краю (transparent, opacity 0.8).
- neon: билборды (боксы + sign-текстура emissive), трубы (цилиндры вдоль стен),
  голограммы (аддитивные плоскости, opacity 0.25), асфальт (asphalt, roughness 0.4).
- applyMapMood: island fogFar 110→90 (туман заметнее), neon fogNear 12→8/far 70→55.

- [ ] **Step 1: Реализация наборов** (хелперы merge как сейчас: box/cyl + plane/deca/torus).

- [ ] **Step 2: Build**

Run: `cd /root/sites/shturm.bratuxa.zomb.top && ~/.bun/bin/bun run build`
Expected: без ошибок.

- [ ] **Step 3: Браузер — 3 карты со скринами**

browser_exec: старт каждой карты (`__shturm.start('yard'|'island'|'neon','normal')`),
скрин + облет (поворот камеры через js: 4 ракурса). Expected: объекты узнаваемы,
туман на острове/неоне виден, консоль 0 ошибок.

- [ ] **Step 4: Commit**

```bash
cd /root/sites && git add shturm.bratuxa.zomb.top/src/three/mapsVisual.ts shturm.bratuxa.zomb.top/src/main.tsx
git commit -m "shturm: карты с объектами и атмосферой 🗺️"
```

---

### Task 6: Оружие в деталях

**Files:**
- Modify: `shturm.bratuxa.zomb.top/src/three/guns.ts` (перепил, сигнатура `makeGun(slot)` та же)

**Interfaces:**
- Consumes: Task 1 (`getTex`: wood, rust).
- Produces: `makeGun(slot)` — Group, дуло строго -Z, точка дула `group.userData.muzzle: THREE.Vector3`
  (main.tsx использует для tracers.fire — найти использование gunMesh и подставить muzzle).

Детали (1-3к треугольников): ствол (цилиндр 16 сегментов) + мушка (бокс) + затвор +
магазин (автомат — изогнутый: 3 сегмента под углом) + скоба + рукоять/приклад (wood) +
прицел (кольцо-тор). Материалы: металл (metalness 0.9, roughness 0.35, rust-roughnessMap),
дерево (map wood), пластик (roughness 0.7). Отдача: `kick gunMesh` — в main уже есть?
Нет: добавить в Task 6 пружину `gunKick` в main.tsx (2 строки в tick + применение в кадре) —
ИЛИ оставить: вспышка есть (flash). Исполнитель: добавить `userData.kick()` метод на группу
(замыкание с пружиной), main вызывает при выстреле (строка ~381, рядом с tracers.fire).

- [ ] **Step 1: Перепил guns.ts** (3 builder-функции + muzzle + kick).

- [ ] **Step 2: Подключение muzzle/kick в main.tsx** (2 правки около tracers.fire).

- [ ] **Step 3: Вертушка стволов** (тот же preview-подход Task 3: `?gun=pistol|auto|shotgun`,
  скрины спереди/сбоку/сзади + выстрел со вспышкой).

- [ ] **Step 4: Commit**

```bash
cd /root/sites && git add shturm.bratuxa.zomb.top/src/three/guns.ts shturm.bratuxa.zomb.top/src/main.tsx
git commit -m "shturm: детальное оружие с отдачей 🔫"
```

---

### Task 7: Эффекты — взрывы, кровь, туман, искры, след ракеты

**Files:**
- Modify: `shturm.bratuxa.zomb.top/src/three/effects.ts` (расширить, `makeTracerPool` не ломать)
- Modify: `shturm.bratuxa.zomb.top/src/main.tsx` (вызовы: смерть моба → кровь+взрыв малый;
  смерть босса → большой взрыв; попадание в танка → искры; выстрел ракеты ZOV → след)

**Interfaces:**
- Consumes: Task 1 (текстуры спрайтов: radial-градиент canvas — добавить kind 'puff' в Task 1?
  Нет: спрайт рисуется внутри effects.ts своим canvas 64px, без правок Task 1).
- Produces: `makeBoomPool(scene, n)`, `makeBloodPool(scene, n)`, `makeSparkPool(scene, n)`,
  каждый `{ fire(pos, opts), update(dt) }` — тот же стиль API, что makeTracerPool.
  Туман: без кода (настройки в Task 5). Bloom неона — Task 8.

Взрыв: спрайт (аддитив, скейл 0.5→3 по easeOut) + PointLight intensity 60→0 + 8 осколков-боксов.
Кровь: 12 Points (velocity + gravity, life 0.6с) + декаль-плоскость на земле (пул 20, fade 10с).
Искры: 6 Points жёлтых, life 0.3с. След ракеты: пул дымных спрайтов, спавн каждые 0.05с 1с.

- [ ] **Step 1: Пулы эффектов** (код по образцу makeTracerPool).

- [ ] **Step 2: Врезка вызовов в main.tsx** (4 точки: хит-попадание, смерть, смерть босса, выстрел).

- [ ] **Step 3: Браузер — скрины взрыв/кровь/искры** (волна с танком + босс, fire + aimNearest).

- [ ] **Step 4: Commit**

```bash
cd /root/sites && git add shturm.bratuxa.zomb.top/src/three/effects.ts shturm.bratuxa.zomb.top/src/main.tsx
git commit -m "shturm: взрывы кровь искры 💥"
```

---

### Task 8: Неон-bloom + финалка (build, тесты, приёмка, чистка)

**Files:**
- Modify: `shturm.bratuxa.zomb.top/src/main.tsx` (composer только для neon)
- Delete: `shturm.bratuxa.zomb.top/preview.html`, `src/three/preview-scene.ts`

**Interfaces:**
- Consumes: всё выше.
- Produces: готовый dist, коммит v2.

Bloom: `EffectComposer + RenderPass + UnrealBloomPass(strength 0.6, radius 0.4, threshold 0.85)`
создавать лениво при первом старте neon; рендер: `if (mapId==='neon' && composer) composer.render()
else renderer.render(scene, camera)`. Resize: `composer.setSize` рядом с applySize
(найти функцию applySize в main.tsx). Проверка FPS: если leads to <42 — strength 0.4.

- [ ] **Step 1: Composer + удаление preview-файлов**

- [ ] **Step 2: bun test + build**

Run: `cd /root/sites/shturm.bratuxa.zomb.top && ~/.bun/bin/bun test && ~/.bun/bin/bun run build && ls dist/`
Expected: все тесты PASS (старые player/waves/weapons + новые textures/rig), dist собран.

- [ ] **Step 3: Финальная браузер-приёмка (меню/бой × 3 карты)**

browser_exec: каждая карта — старт, волна, бой 5с со скринами, консоль 0 ошибок;
сверить FPS (hud fps) и draw calls (`renderer.info.render.calls` через js — вывести в лог,
лимит ≤120). Expected: всё зелёное.

- [ ] **Step 4: Финальный коммит**

```bash
cd /root/sites && git add shturm.bratuxa.zomb.top/dist shturm.bratuxa.zomb.top/src && git status --short -- shturm.bratuxa.zomb.top/ | grep -v '^ M' || true
git commit -m "shturm: 3D-апгрейд v2, мобы карты оружие эффекты 🏆"
```

---

## Self-Review

1. **Spec coverage:** §мобы→T3+T4; §текстуры→T1; §карты→T5; §оружие→T6; §эффекты→T7;
   §перфоманс/приёмка→T8; вертушка/скрины действий→T3/T6/T8. Все покрыты.
2. **Placeholder scan:** нет TBD/TODO; код-блоки конкретные; имена (buildHumanoid,
   makeClips, updateMob, getTex, пулы) едины во всех тасках.
3. **Type consistency:** `updateMob(mesh, {speed, attacking, dying, dt})` — T3 производит,
   T4 потребляет, сигнатура совпадает; `makeMob`/`setMobLightDetail`/`makeGun`/
   `buildMapVisual`/`makeTracerPool` сигнатуры не меняют — main.tsx правится только
   в указанных местах.
```

---

Исполнитель: после сохранения плана предложить выбор (subagent-driven / inline).
