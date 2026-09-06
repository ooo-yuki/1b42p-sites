import * as THREE from 'three';

// Оригинальный пул трассеров (main.tsx: tracers.fire(from, dir) + update(dt)) — не ломать.
export function makeTracerPool(scene: THREE.Scene, n = 43) {
  const pool: THREE.Line[] = [];
  for (let i = 0; i < n; i++) {
    const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3(0, 0, -5)]);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffe066, transparent: true, opacity: 0 }));
    scene.add(line); pool.push(line);
  }
  let k = 0;
  return {
    fire(from: THREE.Vector3, dir: THREE.Vector3) { const l = pool[k++ % pool.length]; l.position.copy(from); l.lookAt(from.clone().add(dir)); (l.material as THREE.LineBasicMaterial).opacity = 1; l.visible = true; },
    /** Tracer fade: вызывать каждый кадр — дешёвый минор Task 10. */
    update(dt: number) {
      const decay = dt * 6;
      for (const l of pool) {
        const m = l.material as THREE.LineBasicMaterial;
        if (m.opacity > 0) {
          m.opacity = Math.max(0, m.opacity - decay);
          if (m.opacity === 0) l.visible = false;
        }
      }
    },
  };
}

// Task 7: пулы эффектов без аллокаций в кадре.
// Стиль API как у makeTracerPool: каждый пул { fire(pos, opts?), update(dt) }.

function radialTex(inner: string, outer: string, size = 64): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  const g = (ctx as unknown as { createRadialGradient?: (...a: number[]) => CanvasGradient }).createRadialGradient?.(
    size / 2, size / 2, 1, size / 2, size / 2, size / 2,
  );
  if (g) {
    g.addColorStop(0, inner);
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
  } else {
    ctx.fillStyle = inner; // headless-стаб canvas в bun test: без градиента
  }
  ctx.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

let puffTex: THREE.CanvasTexture | null = null;
function getPuffTex(): THREE.CanvasTexture {
  if (!puffTex) puffTex = radialTex('rgba(255,244,214,1)', 'rgba(255,120,20,0)');
  return puffTex;
}

let coreTex: THREE.CanvasTexture | null = null;
function getCoreTex(): THREE.CanvasTexture {
  if (!coreTex) coreTex = radialTex('rgba(255,255,246,1)', 'rgba(255,190,60,0)');
  return coreTex;
}

let smokeTex: THREE.CanvasTexture | null = null;
function getSmokeTex(): THREE.CanvasTexture {
  if (!smokeTex) smokeTex = radialTex('rgba(200,200,200,0.85)', 'rgba(120,120,120,0)');
  return smokeTex;
}

// ---------- ВЗРЫВ: ядро-спрайт + аддитивный пуф + PointLight без теней + 8 осколков ----------
export interface BoomOpts { big?: boolean }
export function makeBoomPool(scene: THREE.Scene, n = 4) {
  interface Slot {
    sprite: THREE.Sprite; core: THREE.Sprite; light: THREE.PointLight; shards: THREE.Mesh[];
    vel: THREE.Vector3[]; base: THREE.Vector3[]; rot: THREE.Vector3[];
    t: number; dur: number; big: boolean; active: boolean;
  }
  // Осколки-комья: ребро 0.12 (~50% линейно мельче сырных 0.43), форма/размер — разбросом scale на меше.
  const shardGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
  const slots: Slot[] = [];
  for (let i = 0; i < n; i++) {
    const mat = new THREE.SpriteMaterial({
      map: getPuffTex(), blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.visible = false;
    scene.add(sprite);
    const coreMat = new THREE.SpriteMaterial({
      map: getCoreTex(), blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false,
    });
    const core = new THREE.Sprite(coreMat);
    core.visible = false;
    scene.add(core);
    const light = new THREE.PointLight(0xffa040, 0, 22, 1.8);
    light.castShadow = false;
    scene.add(light);
    const shards: THREE.Mesh[] = [];
    const vel: THREE.Vector3[] = [];
    const base: THREE.Vector3[] = [];
    const rot: THREE.Vector3[] = [];
    // Тёмная база (комья земли/металл) + оранжевый emissive: читается и в тени, и в пересвете ядра.
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x2b1d12, emissive: 0xff5a14, emissiveIntensity: 1.1, roughness: 0.95, metalness: 0.1,
    });
    for (let s = 0; s < 8; s++) {
      const m = new THREE.Mesh(shardGeo, shardMat);
      m.visible = false;
      scene.add(m);
      shards.push(m);
      vel.push(new THREE.Vector3());
      base.push(new THREE.Vector3(1, 1, 1));
      rot.push(new THREE.Vector3());
    }
    slots.push({ sprite, core, light, shards, vel, base, rot, t: 0, dur: 0.5, big: false, active: false });
  }
  let k = 0;
  return {
    fire(pos: THREE.Vector3, opts: BoomOpts = {}) {
      const s = slots[k++ % slots.length];
      const big = opts.big === true;
      s.big = big; s.t = 0; s.dur = big ? 0.8 : 0.5; s.active = true;
      s.sprite.position.copy(pos);
      s.sprite.position.y = Math.max(0.6, pos.y);
      s.sprite.visible = true;
      s.core.position.copy(s.sprite.position);
      s.core.visible = true;
      s.light.position.copy(s.sprite.position);
      s.light.position.y += 0.5;
      s.light.intensity = big ? 320 : 180;
      for (let i = 0; i < s.shards.length; i++) {
        const m = s.shards[i];
        m.position.copy(s.sprite.position);
        m.visible = true;
        // Разлёт по сфере с подъёмом; детерминированный разброс по индексу + джиттер.
        const a = (i / s.shards.length) * Math.PI * 2;
        const sp = (big ? 9 : 6) * (0.7 + 0.3 * ((i * 37) % 10) / 10);
        s.vel[i].set(Math.cos(a) * sp, 4 + ((i * 53) % 5), Math.sin(a) * sp);
        // Неправильный комок: разброс размера/формы и стартового разворота, детерминирован по индексу.
        m.rotation.set((i * 1.7) % Math.PI, (i * 2.3) % Math.PI, (i * 0.9) % Math.PI);
        s.base[i].set(
          0.55 + (((i * 37) % 10) / 10) * 0.6,
          0.45 + (((i * 53) % 10) / 10) * 0.6,
          0.55 + (((i * 71) % 10) / 10) * 0.6,
        );
        m.scale.copy(s.base[i]);
        s.rot[i].set(3 + ((i * 41) % 8), 2 + ((i * 59) % 9), 1 + ((i * 23) % 7));
      }
    },
    update(dt: number) {
      for (const s of slots) {
        if (!s.active) continue;
        s.t += dt;
        const kq = Math.min(1, s.t / s.dur);
        const ease = 1 - (1 - kq) * (1 - kq); // easeOut
        const maxR = s.big ? 5 : 3;
        const r = 0.5 + (maxR - 0.5) * ease;
        s.sprite.scale.setScalar(r);
        (s.sprite.material as THREE.SpriteMaterial).opacity = 1 - kq;
        // Ядро компактнее пуфа и держит яркость дольше (корень — медленный спад).
        s.core.scale.setScalar(Math.max(0.01, r * 0.55));
        (s.core.material as THREE.SpriteMaterial).opacity = Math.pow(1 - kq, 0.6);
        s.light.intensity = (s.big ? 320 : 180) * (1 - kq);
        for (let i = 0; i < s.shards.length; i++) {
          const m = s.shards[i];
          s.vel[i].y -= 18 * dt;
          m.position.addScaledVector(s.vel[i], dt);
          if (m.position.y < 0.06) { m.position.y = 0.06; s.vel[i].set(0, 0, 0); }
          m.rotation.x += dt * s.rot[i].x; m.rotation.y += dt * s.rot[i].y; m.rotation.z += dt * s.rot[i].z;
          const sh = Math.max(0.01, 1 - kq);
          m.scale.set(s.base[i].x * sh, s.base[i].y * sh, s.base[i].z * sh);
        }
        if (kq >= 1) {
          s.active = false;
          s.sprite.visible = false;
          s.core.visible = false;
          s.light.intensity = 0;
          for (const m of s.shards) m.visible = false;
        }
      }
    },
  };
}

// ---------- КРОВЬ: 12 Points с гравитацией + тёмные декали-пятна (пул 20, fade 10с) ----------
export function makeBloodPool(scene: THREE.Scene, n = 12) {
  const COUNT = 12;
  interface Burst {
    pts: THREE.Points; vel: Float32Array; t: number; dur: number; active: boolean;
  }
  const bursts: Burst[] = [];
  const posAttr: THREE.BufferAttribute[] = [];
  for (let i = 0; i < n; i++) {
    const geo = new THREE.BufferGeometry();
    const arr = new Float32Array(COUNT * 3);
    const attr = new THREE.BufferAttribute(arr, 3);
    geo.setAttribute('position', attr);
    posAttr.push(attr);
    const mat = new THREE.PointsMaterial({
      color: 0xa01010, size: 0.16, transparent: true, opacity: 0, depthWrite: false, sizeAttenuation: true,
    });
    const pts = new THREE.Points(geo, mat);
    pts.visible = false;
    pts.frustumCulled = false;
    scene.add(pts);
    bursts.push({ pts, vel: new Float32Array(COUNT * 3), t: 0, dur: 0.6, active: false });
  }
  // Декали-пятна: пул плоскостей на земле.
  const decalGeo = new THREE.PlaneGeometry(0.9, 0.9);
  decalGeo.rotateX(-Math.PI / 2);
  interface Decal { mesh: THREE.Mesh; t: number; active: boolean }
  const decals: Decal[] = [];
  for (let i = 0; i < 20; i++) {
    const mat = new THREE.MeshBasicMaterial({
      color: 0x4a0808, transparent: true, opacity: 0, depthWrite: false,
    });
    const mesh = new THREE.Mesh(decalGeo, mat);
    mesh.visible = false;
    mesh.position.y = 0.02;
    mesh.renderOrder = 1;
    scene.add(mesh);
    decals.push({ mesh, t: 0, active: false });
  }
  let kb = 0; let kd = 0;
  return {
    fire(pos: THREE.Vector3) {
      const b = bursts[kb++ % bursts.length];
      b.t = 0; b.active = true;
      b.pts.visible = true;
      (b.pts.material as THREE.PointsMaterial).opacity = 1;
      const attr = posAttr[bursts.indexOf(b)];
      for (let i = 0; i < COUNT; i++) {
        attr.setXYZ(i, pos.x, pos.y, pos.z);
        const a = (i / COUNT) * Math.PI * 2;
        const sp = 1.5 + ((i * 41) % 10) / 10 * 2.5;
        b.vel[i * 3] = Math.cos(a) * sp;
        b.vel[i * 3 + 1] = 2.5 + ((i * 29) % 7) / 7 * 3;
        b.vel[i * 3 + 2] = Math.sin(a) * sp;
      }
      attr.needsUpdate = true;
      // Пятно на земле.
      const d = decals[kd++ % decals.length];
      d.t = 0; d.active = true;
      d.mesh.visible = true;
      d.mesh.position.set(pos.x, 0.02 + (kd % 5) * 0.001, pos.z); // сдвиг y против z-fighting
      d.mesh.rotation.y = ((kd * 137) % 360) * Math.PI / 180;
      d.mesh.scale.setScalar(0.7 + ((kd * 31) % 10) / 10 * 0.8);
      (d.mesh.material as THREE.MeshBasicMaterial).opacity = 0.85;
    },
    update(dt: number) {
      for (const b of bursts) {
        if (!b.active) continue;
        b.t += dt;
        const kq = Math.min(1, b.t / b.dur);
        const attr = posAttr[bursts.indexOf(b)];
        for (let i = 0; i < COUNT; i++) {
          b.vel[i * 3 + 1] -= 12 * dt;
          attr.setXYZ(i,
            attr.getX(i) + b.vel[i * 3] * dt,
            Math.max(0.03, attr.getY(i) + b.vel[i * 3 + 1] * dt),
            attr.getZ(i) + b.vel[i * 3 + 2] * dt,
          );
        }
        attr.needsUpdate = true;
        (b.pts.material as THREE.PointsMaterial).opacity = 1 - kq;
        if (kq >= 1) { b.active = false; b.pts.visible = false; }
      }
      for (const d of decals) {
        if (!d.active) continue;
        d.t += dt;
        if (d.t > 10) {
          d.active = false; d.mesh.visible = false;
          (d.mesh.material as THREE.MeshBasicMaterial).opacity = 0;
        } else if (d.t > 8) {
          // Плавный fade последние 2с.
          (d.mesh.material as THREE.MeshBasicMaterial).opacity = 0.85 * (1 - (d.t - 8) / 2);
        }
      }
    },
  };
}

// ---------- ИСКРЫ рикошета: 6 жёлтых Points, life 0.3с ----------
export function makeSparkPool(scene: THREE.Scene, n = 10) {
  const COUNT = 6;
  interface Burst { pts: THREE.Points; vel: Float32Array; t: number; active: boolean }
  const bursts: Burst[] = [];
  const attrs: THREE.BufferAttribute[] = [];
  for (let i = 0; i < n; i++) {
    const geo = new THREE.BufferGeometry();
    const arr = new Float32Array(COUNT * 3);
    const attr = new THREE.BufferAttribute(arr, 3);
    geo.setAttribute('position', attr);
    attrs.push(attr);
    const mat = new THREE.PointsMaterial({
      color: 0xffd24a, size: 0.1, transparent: true, opacity: 0, depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const pts = new THREE.Points(geo, mat);
    pts.visible = false;
    pts.frustumCulled = false;
    scene.add(pts);
    bursts.push({ pts, vel: new Float32Array(COUNT * 3), t: 0, active: false });
  }
  let k = 0;
  return {
    fire(pos: THREE.Vector3) {
      const b = bursts[k++ % bursts.length];
      b.t = 0; b.active = true;
      b.pts.visible = true;
      (b.pts.material as THREE.PointsMaterial).opacity = 1;
      const attr = attrs[bursts.indexOf(b)];
      for (let i = 0; i < COUNT; i++) {
        attr.setXYZ(i, pos.x, pos.y, pos.z);
        const a = (i / COUNT) * Math.PI * 2;
        const sp = 3 + ((i * 47) % 10) / 10 * 4;
        b.vel[i * 3] = Math.cos(a) * sp;
        b.vel[i * 3 + 1] = 1.5 + ((i * 23) % 5);
        b.vel[i * 3 + 2] = Math.sin(a) * sp;
      }
      attr.needsUpdate = true;
    },
    update(dt: number) {
      for (const b of bursts) {
        if (!b.active) continue;
        b.t += dt;
        const kq = Math.min(1, b.t / 0.3);
        const attr = attrs[bursts.indexOf(b)];
        for (let i = 0; i < COUNT; i++) {
          b.vel[i * 3 + 1] -= 9 * dt;
          attr.setXYZ(i,
            attr.getX(i) + b.vel[i * 3] * dt,
            attr.getY(i) + b.vel[i * 3 + 1] * dt,
            attr.getZ(i) + b.vel[i * 3 + 2] * dt,
          );
        }
        attr.needsUpdate = true;
        (b.pts.material as THREE.PointsMaterial).opacity = 1 - kq;
        if (kq >= 1) { b.active = false; b.pts.visible = false; }
      }
    },
  };
}

// ---------- СЛЕД ракеты ZOV: пул дымных спрайтов, спавн каждые 0.05с в течение 1с ----------
export function makeRocketTrail(scene: THREE.Scene, n = 40) {
  interface Puff { sprite: THREE.Sprite; t: number; life: number; active: boolean; rise: number }
  const puffs: Puff[] = [];
  for (let i = 0; i < n; i++) {
    const mat = new THREE.SpriteMaterial({
      map: getSmokeTex(), transparent: true, opacity: 0, depthWrite: false,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.visible = false;
    scene.add(sprite);
    puffs.push({ sprite, t: 0, life: 0.9, active: false, rise: 1 });
  }
  interface Emitter { active: boolean; t: number; acc: number; pos: THREE.Vector3 }
  // Один эмиттер за раз (залп — редкое событие); повторный fire перезапускает.
  const emitter: Emitter = { active: false, t: 0, acc: 0, pos: new THREE.Vector3() };
  let k = 0;
  function spawnOne(p: THREE.Vector3) {
    const q = puffs[k++ % puffs.length];
    q.t = 0; q.life = 0.9; q.active = true; q.rise = 0.8 + Math.random() * 0.6;
    q.sprite.position.copy(p);
    q.sprite.position.x += (Math.random() - 0.5) * 0.3;
    q.sprite.position.z += (Math.random() - 0.5) * 0.3;
    q.sprite.scale.setScalar(0.4);
    q.sprite.visible = true;
  }
  return {
    fire(pos: THREE.Vector3) {
      emitter.active = true; emitter.t = 0; emitter.acc = 0;
      emitter.pos.copy(pos);
      spawnOne(pos);
    },
    update(dt: number) {
      if (emitter.active) {
        emitter.t += dt;
        emitter.acc += dt;
        emitter.pos.y += dt * 6; // ракета уходит вверх
        while (emitter.acc >= 0.05) {
          emitter.acc -= 0.05;
          spawnOne(emitter.pos);
        }
        if (emitter.t >= 1) emitter.active = false;
      }
      for (const q of puffs) {
        if (!q.active) continue;
        q.t += dt;
        const kq = Math.min(1, q.t / q.life);
        q.sprite.position.y += q.rise * dt;
        q.sprite.scale.setScalar(0.4 + kq * 1.6);
        (q.sprite.material as THREE.SpriteMaterial).opacity = 0.7 * (1 - kq);
        if (kq >= 1) { q.active = false; q.sprite.visible = false; }
      }
    },
  };
}
