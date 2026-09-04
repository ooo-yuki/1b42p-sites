---
version: alpha
name: Evvgrad
description: Уютный low-poly эльфоград батальона 1Б42П — мягкое сказочное 3D, кавайные мордочки и игрушечный HUD. Мы уже победили.
colors:
  primary: "#2f5d3a"
  cream: "#fffdf4"
  berry: "#ff7bac"
  leaf: "#58b368"
  gold: "#ffd23f"
  sky: "#cdeffd"
  fog-pink: "#ffd9ec"
  wood: "#8b5e3c"
  bark: "#6b3a1f"
  crimson: "#c00040"
  violet: "#5d4a7a"
  ice: "#bfe8ff"
  blush: "#ff8fbf"
  skin: "#ffd9b3"
  sun-warm: "#ffe9c4"
  button-ink: "#5d4a00"
typography:
  h1:
    fontFamily: Baloo 2
    fontSize: 1.75rem
    fontWeight: 800
    lineHeight: 1.2
  body-md:
    fontFamily: Baloo 2
    fontSize: 1rem
    fontWeight: 700
    lineHeight: 1.4
  caption:
    fontFamily: Baloo 2
    fontSize: 0.75rem
    fontWeight: 700
    lineHeight: 1.3
rounded:
  sm: 16px
  md: 20px
  lg: 22px
  pill: 999px
spacing:
  sm: 8px
  md: 12px
  lg: 18px
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.button-ink}"
    rounded: "{rounded.sm}"
    padding: 12px
  chip-resource:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: 12px
  panel-card:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: 12px
  tool-active:
    backgroundColor: "#ffe9f2"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: 10px
  scene-fog:
    backgroundColor: "{colors.fog-pink}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: 10px
  scene-sunlight:
    backgroundColor: "{colors.sun-warm}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: 10px
  building-wood:
    backgroundColor: "{colors.wood}"
    textColor: "{colors.cream}"
    rounded: "{rounded.sm}"
    padding: 10px
  building-bark:
    backgroundColor: "{colors.bark}"
    textColor: "{colors.cream}"
    rounded: "{rounded.sm}"
    padding: 10px
  npc-skin:
    backgroundColor: "{colors.skin}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: 10px
  npc-blush:
    backgroundColor: "{colors.blush}"
    textColor: "#12351f"
    rounded: "{rounded.pill}"
    padding: 10px
  accent-berry:
    backgroundColor: "{colors.berry}"
    textColor: "#12351f"
    rounded: "{rounded.pill}"
    padding: 10px
  accent-leaf:
    backgroundColor: "{colors.leaf}"
    textColor: "#12351f"
    rounded: "{rounded.pill}"
    padding: 10px
  accent-sky:
    backgroundColor: "{colors.sky}"
    textColor: "{colors.primary}"
    rounded: "{rounded.pill}"
    padding: 10px
  alert-crimson:
    backgroundColor: "{colors.crimson}"
    textColor: "{colors.cream}"
    rounded: "{rounded.sm}"
    padding: 10px
  magic-violet:
    backgroundColor: "{colors.violet}"
    textColor: "{colors.cream}"
    rounded: "{rounded.sm}"
    padding: 10px
  magic-ice:
    backgroundColor: "{colors.ice}"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: 10px
---

## Overview

Эввград — уютный low-poly 3D-город эльфов: мягкое тёплое освещение, пастельная
палитра, кавайные мордочки на домах и жителях, парящие сердечки над городом.
HUD — «игрушечный»: кремовые плашки с толстой тёмно-зелёной обводкой и жёсткой
тенью-кнопкой. Настроение: добрая сказка батальона, никакой мрачности.

## Colors

- **Primary (#2f5d3a):** тёмная еловая зелень — текст, обводки, HUD-контуры.
- **Cream (#fffdf4):** тёплые сливки — фон плашек и панелей.
- **Gold (#ffd23f):** фирменное золото 42 — главные кнопки, пряжки, монетки.
- **Berry (#ff7bac):** ягодный — акцент активного инструмента, помпоны, румянец.
- **Leaf (#58b368):** листва — деревья, кнопка игрока, жизнь.
- **Sky (#cdeffd):** небо и вода — воздух и свежесть.
- **Fog-pink (#ffd9ec):** розовый туман сцены (40–95) — сказочная дымка.
- **Wood (#8b5e3c) / Bark (#6b3a1f):** дерево и кора — домики, заборы, Рейки.
- **Blush (#ff8fbf) / Skin (#ffd9b3):** румянец и кожа жителей.
- Тёмные служебные: violet (#5d4a7a, сапожки), crimson (#c00040, тревога),
  ice (#bfe8ff, светлячки). Держать их точечно, не заливать сцену.
- Deep-pine (#12351f): затемнённый primary только для текста на ярких
  плашках (berry/leaf/blush) — держит контраст WCAG AA 4.5:1.

## Typography

Baloo 2 — округлый, дружелюбный; фолбэки Trebuchet MS, Segoe UI, Arial.
Весь HUD — жирный (700–800), мелкий текст не меньше 11–12px. Имена NPC —
таблички-спрайты: зелёная плашка, золотая рамка, белый текст.

## Layout

Камера смотрит на центр города (0, 0.8, 0), зум 14–46. HUD по краям не
перекрывает стройку: ресурсы сверху, тулбар снизу, инспектор справа.
Внутри зданий — тёплый точечный свет сверху (0xfff2d0), разговорный бабл NPC
по центру над головами.

## Elevation & Depth

Мягкие тени PCFSoft, тонемаппинг ACES, выход sRGB. Свет: полусфера
(небо 0xfff4fa / земля 0x8fd694, 1.05) + тёплое солнце (0xffe9c4, 1.6).
В 2D — жёсткая «игрушечная» тень плашек: `0 3px 0 rgba(47,93,58,.3)`,
у кнопок — `0 3px 0` в тон obводки. Никаких блюров и неона.

## Shapes

Low-poly: `flatShading: true`, базовый материал шероховатый
(roughness 0.85, metalness 0.02). Геометрия — боксы, конусы, икосаэдры,
октаэдры; скруглений в 3D нет, милота — за счёт пропорций чиби и мордочек.
В 2D — крупные радиусы (16–22px) и пилюли (999px), обводка всегда 3px solid
primary. Эмодзи — только в тексте и фразах NPC, никогда вместо иконок.

## Components

- `button-primary` — золотая кнопка действия (улучшить, построить).
- `chip-resource` — кремовая пилюля ресурса с обводкой.
- `panel-card` — кремовая панель (инспектор, карточка здания).
- `tool-active` — розовая подсветка выбранного инструмента.
- Жители-братухи: чиби-роблокс (сапожки с подошвой, воротничок, пуговки 42,
  эмблема на кепке, эльфийские ушки), лицо — белые глаза с бликом, бровки,
  румянец, улыбка. Полный рост ~1.6, малыши — масштаб 0.82.

## Do's and Don'ts

- Делай: пастель, тёплый свет, кавайные мордочки, сердечки, золотые акценты 42.
- Не делай: тёмное готическое освещение, реалистичные пропорции, неон,
  блюр-тени, эмодзи вместо иконок, сексуализацию персонажей — город семейный.
