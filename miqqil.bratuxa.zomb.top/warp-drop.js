// MIQQIL TANKS — 3D-анимация выпадения «Кейс-ангар 42» (баннер «Прыжок 42»).
// Кейс-ангар падает с неба, ворота открываются, выпавший танк выезжает.
// Чистый three.js + модели из models.js (buildVehicle — та же техника, что в бою).
// Стиль 42: Мы уже победили 🏆
import * as THREE from 'three';
import { buildVehicle, animateVehicle, disposeVehicle } from './models.js';

const STAR_COLORS = { 5: 0xffd700, 4: 0xc084fc, 3: 0x7cc4ff };

let skipFlag = false;
// Кнопка «Пропустить» в баннере дёргает это — анимация мгновенно доигрывается.
export function skipHangarDrop() { skipFlag = true; }

function easeInQuad(t) { return t * t; }
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
function easeOutBack(t) { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }

// Табличка «42» на крышу ангара — рисуем текстом на канве, без картинок из сети.
function makeSignTexture() {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = '#10141d'; g.fillRect(0, 0, 256, 128);
  g.strokeStyle = '#f5c518'; g.lineWidth = 6; g.strokeRect(6, 6, 244, 116);
  g.fillStyle = '#f5c518';
  g.font = '900 84px system-ui, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('42', 128, 68);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function playHangarDrop(stage, spec, { stars = 3 } = {}) {
  skipFlag = false;
  const accent = new THREE.Color(STAR_COLORS[stars] || STAR_COLORS[3]);

  return new Promise((resolve) => {
    const W = () => stage.clientWidth || 2;
    const H = () => stage.clientHeight || 2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W(), H());
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    stage.innerHTML = '';
    stage.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x05060c, 30, 80);
    const camera = new THREE.PerspectiveCamera(55, W() / H(), 0.1, 200);
    const camBase = new THREE.Vector3(10.5, 6.5, 14);
    camera.position.copy(camBase);
    camera.lookAt(0, 2.2, 0);

    scene.add(new THREE.HemisphereLight(0xbfd4f2, 0x3a3018, 0.7));
    const sun = new THREE.DirectionalLight(0xffe4b0, 2.2);
    sun.position.set(12, 18, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 60 });
    sun.shadow.camera.updateProjectionMatrix();
    scene.add(sun);
    // Цветной акцент редкости — подсвечивает сцену в момент выезда.
    const starLight = new THREE.PointLight(accent.getHex(), 0, 40);
    starLight.position.set(0, 4, 6);
    scene.add(starLight);

    // Земля — тёмная плита + светящееся кольцо редкости.
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(30, 48),
      new THREE.MeshStandardMaterial({ color: 0x141821, roughness: 0.95, metalness: 0.05 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(6.2, 6.7, 64),
      new THREE.MeshBasicMaterial({ color: accent.clone(), transparent: true, opacity: 0.0, side: THREE.DoubleSide }),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.02;
    scene.add(ring);

    // ----- Кейс-ангар: пол, крыша, задняя и боковые стены, две ворота спереди (+Z) -----
    const hangar = new THREE.Group();
    scene.add(hangar);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x2a3348, roughness: 0.6, metalness: 0.55 });
    const trimMat = new THREE.MeshStandardMaterial({ color: accent.clone(), roughness: 0.35, metalness: 0.7, emissive: accent.clone(), emissiveIntensity: 0.25 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1c1f26, roughness: 0.8, metalness: 0.3 });
    const HW = 4, HH = 5, HD = 3.5; // полуширина, высота, полуглубина
    function box(w, h, d, mat, x, y, z) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      m.castShadow = m.receiveShadow = true;
      hangar.add(m);
      return m;
    }
    box(HW * 2 + 0.6, 0.4, HD * 2 + 0.6, darkMat, 0, 0.2, 0);          // пол-платформа
    box(HW * 2 + 0.6, 0.5, HD * 2 + 0.6, wallMat, 0, HH + 0.25, 0);    // крыша
    box(HW * 2 + 0.6, HH, 0.4, wallMat, 0, HH / 2 + 0.4, -HD);         // задняя стена
    box(0.4, HH, HD * 2, wallMat, -HW, HH / 2 + 0.4, 0);               // левая стена
    box(0.4, HH, HD * 2, wallMat, HW, HH / 2 + 0.4, 0);                // правая стена
    box(HW * 2 + 0.7, 0.25, 0.25, trimMat, 0, HH - 0.1, HD + 0.05);    // световая балка над воротами
    // Табличка «42» на крыше.
    const sign = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 1.7),
      new THREE.MeshBasicMaterial({ map: makeSignTexture(), transparent: false }),
    );
    sign.position.set(0, HH + 1.4, -0.5);
    sign.rotation.x = -0.15;
    hangar.add(sign);
    // Ворота: две створки на петлях по бокам проёма.
    const gateL = new THREE.Group(), gateR = new THREE.Group();
    gateL.position.set(-HW, 0.4, HD);
    gateR.position.set(HW, 0.4, HD);
    hangar.add(gateL, gateR);
    const gateGeoL = new THREE.BoxGeometry(HW, HH - 0.6, 0.25);
    gateGeoL.translate(HW / 2, (HH - 0.6) / 2, 0);
    const gateGeoR = new THREE.BoxGeometry(HW, HH - 0.6, 0.25);
    gateGeoR.translate(-HW / 2, (HH - 0.6) / 2, 0);
    const doorL = new THREE.Mesh(gateGeoL, wallMat);
    const doorR = new THREE.Mesh(gateGeoR, wallMat);
    doorL.castShadow = doorR.castShadow = true;
    gateL.add(doorL); gateR.add(doorR);
    // Полосы редкости на воротах.
    const stripeGeo = new THREE.BoxGeometry(HW * 0.9, 0.3, 0.28);
    const stripeL = new THREE.Mesh(stripeGeo, trimMat); stripeL.position.set(HW / 2, HH - 1.2, 0); gateL.add(stripeL);
    const stripeR = new THREE.Mesh(stripeGeo, trimMat); stripeR.position.set(-HW / 2, HH - 1.2, 0); gateR.add(stripeR);
    // Свет внутри ангара — включается, когда ворота открываются.
    const innerLight = new THREE.PointLight(0xfff2cc, 0, 20);
    innerLight.position.set(0, 3.5, 0);
    hangar.add(innerLight);

    // ----- Выпавшая техника — та же модель, что в бою -----
    const unit3d = buildVehicle(spec, { isPlayer: false });
    unit3d.grp.position.set(0, 0.4, -0.8);
    unit3d.grp.rotation.y = 0; // нос к воротам (+Z у моделей смотрит... доворачиваем ниже)
    unit3d.grp.rotation.y = Math.PI; // ствол вперёд, на выезд
    hangar.add(unit3d.grp);

    // ----- Пыль приземления и искры редкости (точки, без текстур) -----
    function makePuffs(n, color, size) {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(n * 3);
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.PointsMaterial({ color, size, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending });
      const pts = new THREE.Points(geo, mat);
      pts.visible = false;
      pts.frustumCulled = false;
      scene.add(pts);
      return { pts, vel: Array.from({ length: n }, () => new THREE.Vector3()), life: 0 };
    }
    const dust = makePuffs(60, 0x9a8a68, 0.9);
    const sparks = makePuffs(140, accent.getHex(), 0.45);
    function burst(p, origin, spread, up, life) {
      const arr = p.pts.geometry.attributes.position.array;
      for (let i = 0; i < p.vel.length; i++) {
        arr[i * 3] = origin.x; arr[i * 3 + 1] = origin.y; arr[i * 3 + 2] = origin.z;
        const a = Math.random() * Math.PI * 2;
        const s = spread * (0.4 + Math.random() * 0.9);
        p.vel[i].set(Math.cos(a) * s, up * (0.5 + Math.random()), Math.sin(a) * s);
      }
      p.pts.geometry.attributes.position.needsUpdate = true;
      p.pts.visible = true;
      p.life = life;
    }
    function stepPuffs(p, dt) {
      if (!p.pts.visible) return;
      p.life -= dt;
      const arr = p.pts.geometry.attributes.position.array;
      for (let i = 0; i < p.vel.length; i++) {
        arr[i * 3] += p.vel[i].x * dt;
        arr[i * 3 + 1] += p.vel[i].y * dt;
        arr[i * 3 + 2] += p.vel[i].z * dt;
        p.vel[i].y -= 6 * dt;
        if (arr[i * 3 + 1] < 0.05) arr[i * 3 + 1] = 0.05;
      }
      p.pts.geometry.attributes.position.needsUpdate = true;
      p.pts.material.opacity = Math.max(0, Math.min(0.9, p.life));
      if (p.life <= 0) p.pts.visible = false;
    }

    // ----- Тайминг сценки (секунды) -----
    const T_FALL = 1.15, T_GATES = 2.3, T_DRIVE = 4.3, T_END = 5.3;
    const FALL_H = 26;
    let landed = false, drove = false, sparked = false;
    let shake = 0;
    const clock = new THREE.Clock();
    let t = 0;
    let raf = 0;
    let done = false;

    function finish() {
      if (done) return;
      done = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      scene.remove(unit3d.grp);
      disposeVehicle(unit3d);
      hangar.traverse((o) => { if (o.isMesh) o.geometry.dispose(); });
      sign.material.map.dispose(); sign.material.dispose();
      wallMat.dispose(); trimMat.dispose(); darkMat.dispose();
      ground.geometry.dispose(); ground.material.dispose();
      ring.geometry.dispose(); ring.material.dispose();
      for (const p of [dust, sparks]) { scene.remove(p.pts); p.pts.geometry.dispose(); p.pts.material.dispose(); }
      renderer.dispose();
      stage.innerHTML = '';
      resolve();
    }

    function onResize() {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H());
    }
    window.addEventListener('resize', onResize);

    function frame() {
      if (done) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      // «Пропустить» — мгновенно в финальное состояние и короткий финал.
      if (skipFlag) {
        hangar.position.y = 0;
        gateL.rotation.y = -1.9; gateR.rotation.y = 1.9;
        unit3d.grp.position.set(0, 0.4, 7.5);
        innerLight.intensity = 30;
        starLight.intensity = 60;
        ring.material.opacity = 0.8;
        finish();
        return;
      }
      t += dt;

      if (t < T_FALL) {
        // Падение с неба: ускорение вниз + лёгкое покачивание.
        const k = easeInQuad(t / T_FALL);
        hangar.position.y = FALL_H * (1 - k);
        hangar.rotation.z = Math.sin(t * 9) * 0.03 * (1 - k);
        starLight.intensity = 0;
      } else {
        if (!landed) {
          landed = true;
          hangar.position.y = 0;
          hangar.rotation.z = 0;
          shake = 0.55;
          burst(dust, new THREE.Vector3(0, 0.4, 0), 7, 3.2, 1.1);
        }
        hangar.position.y = 0;
        if (t < T_GATES) {
          // Ворота открываются с оттяжкой.
          const k = easeOutBack(Math.min(1, (t - T_FALL) / (T_GATES - T_FALL)));
          gateL.rotation.y = -1.9 * k;
          gateR.rotation.y = 1.9 * k;
          innerLight.intensity = 30 * k;
        } else if (t < T_DRIVE) {
          gateL.rotation.y = -1.9; gateR.rotation.y = 1.9;
          innerLight.intensity = 30;
          // Выезд танка из ангара к камере.
          const k = easeInOut((t - T_GATES) / (T_DRIVE - T_GATES));
          const z = -0.8 + k * 8.3;
          unit3d.grp.position.set(0, 0.4, z);
          animateVehicle(unit3d, dt, 9);
          starLight.intensity = 60 * k;
          ring.material.opacity = 0.8 * k;
          ring.rotation.z += dt * 0.6;
          if (!drove && k > 0.05) {
            drove = true;
            burst(dust, new THREE.Vector3(0, 0.4, 3), 3, 1.6, 0.9);
          }
          unit3d.tur.rotation.y = Math.sin((t - T_GATES) * 1.5) * 0.25;
        } else {
          if (!sparked) {
            sparked = true;
            burst(sparks, new THREE.Vector3(0, 2.5, 7), 5, 5, 1.2);
          }
          // Финал: танк красуется, камера медленно кружит.
          unit3d.grp.position.set(0, 0.4, 7.5);
          starLight.intensity = 60;
          ring.material.opacity = 0.8;
          ring.rotation.z += dt * 0.6;
          const a = (t - T_DRIVE) * 0.25;
          camera.position.set(camBase.x * Math.cos(a) - camBase.z * Math.sin(a) * 0.15, camBase.y, camBase.z * Math.cos(a * 0.5) + 2);
          camera.lookAt(0, 2.2, 3);
          if (t >= T_END) { finish(); return; }
        }
      }

      // Тряска камеры после приземления — затухает.
      if (shake > 0) {
        shake = Math.max(0, shake - dt * 1.4);
        camera.position.x = camBase.x + (Math.random() - 0.5) * shake * 1.6;
        camera.position.y = camBase.y + (Math.random() - 0.5) * shake * 1.2;
      }

      stepPuffs(dust, dt);
      stepPuffs(sparks, dt);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    }
    hangar.position.y = FALL_H;
    raf = requestAnimationFrame(frame);
  });
}
