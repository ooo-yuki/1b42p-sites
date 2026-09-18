# CHANGELOG — mtt.bratuxa.zomb.top

> Все изменения файлов проекта с таймстэмпами для отката.

## Формат
```
## [дата] — описание
- файл: что изменено
- коммит: хеш
```

---

## [2026-09-18] — Удалены настройки прорисовки + оптимизация

**Коммит**: `257d585`

### engine.ts
- Удалены: `quality`, `drawDist`, `skyMesh`, `fogOrig`, `lowT`
- Удалены методы: `getQuality`, `cycleQuality`, `setQuality`, `loadQuality`, `applyQuality`, `getDrawDist`, `setDrawDist`, `loadDrawDist`, `applyDrawDist`
- Удалена авто-понижение качества при просадке FPS
- Renderer захардкожен: `pixelRatio=1`, `shadows=off`, `toneMapping=ACES`, `exposure=1.15`
- Чацыцы удара: без质量-масштабирования (всегда n штук)
- Лес: убран `castShadow` + `shadowMap 2048×2048`, убран дублирующий `scene.add(sun)`, убран дублирующий `toneMapping`
- Убрана белая сфера неба (масштабировалась под drawDist → становилась видимой)

### App.tsx
- Удалены state: `quality`, `drawDist`
- Удалены: `toggleQuality`, `qualityName`, `changeDrawDist`
- Удалены UI-элементы: кнопка «Графика», слайдер «Дальность» (в обоих местах)
- Удалён импорт `Quality` типа

---

## [2026-09-18] — Приватная карта «Лес» + оптимизация

**Коммиты**: `3be318b`, `54ba41d`, `46fe9a8`

### engine.ts
- Добавлен тип `'forest'` в `MapId`
- Добавлен `🌲 Лес` в `MAPS` (админ-фильтр через `canSee`)
- Новый метод `buildForest()` (~245 строк):
  - Плоскость 300×300 м с vertex-color биомами (густой лес, тёмный лес, болота, выжженный лес, озёра, дороги)
  - Озёра с водой и берегами
  - Деревья 7–10 м (ствол + крона)
  - Обугленные стволы, камыши, камни
  - Жёлтая метка спавна (-130, 0, 130)
  - Стены по периметру 12 м
- Конструктор: `half=150` для forest
- `buildWorld()` dispatch для forest
- `waveClearCheck()` для forest

### Оптимизация (lag fix)
- Деревья: `InstancedMesh` вместо отдельных мешей (1 draw call на стволы + 1 на кроны)
- Стволы: 1 `InstancedMesh` вместо ~40 отдельных
- Камыши: 1 `InstancedMesh` вместо ~60 отдельных
- Камни: 1 `InstancedMesh` вместо ~30 отдельных
- **Итого: ~6000 draw calls → ~6**

### App.tsx
- Фильтр карт в обоих местах: `🌲 Лес` виден только для `canSee(authed, devUnlocked)`
- Кнопка `🌲 НА ЛЕС` в DEV-панели (рядом с `🗺️ НА SZEGED`)

### dist/
- Пересобран (серверная сборка через `/root/.bun/bin/bun build`)

---

## [2026-09-18] — Baseline: текущее состояние проекта

**Состояние**: оригинальный код из `ooo-yuki/1b42p-sites` (коммит `7233233`)
**Ключевые файлы**:
- `src/game/engine.ts` — 6505 строк, 3D-движок (Three.js)
- `src/App.tsx` — 3123 строки, React UI
- `server.ts` — 1030 строк, Bun API
- `shared/szeged-gate.ts` — 8 строк, логика доступа
- `tests/` — 11 тестов (Playwright + szeged)

**Сейвы (НЕ ТРОГАТЬ)**:
- `mtt_shop_v1` — фантики/стволы
- `mtt_keys_v1` — ремап клавиш
- `mtt_char` — боец
- `mtt_xp_v1` — опыт
- `mtt_token` — сессия

**Промокоды**:
- `G1PRT` → 2500 фантиков
- `ALLTT` → все бойцы
- `MTT` → 999999 фантиков (один на сервер)
- `LXX42P2ILX` → DEV-панель (один на сервер)

**Персонажи**: МТТ (120HP), Крыса (90HP), Ивангой (105HP), Чума (100HP), Гидроксис (95HP), Санстрайк (100HP), Арбузиха (100HP)

**Оружие**: fists → bat(300) → axe(800) → pistol(1200) → shotgun(1500)

**Режимы**: arena(8), duel(2), pvp(12), endless(10), invasion(10), boss(7), szeged

**Дизайн**: Courier New, тени 4px 4px 0 #000, виньетка, ствол XXL, прицел mix-blend-mode:difference

---
