---
version: alpha
name: Sasha42
description: Красно-синяя территория Саши ⁴² — ночной неон, летящие цифры 42, золотая пилюля и ракета ZOV. Мы уже победили.
colors:
  primary: "#ff3b3b"
  secondary: "#3b82ff"
  gold: "#ffd23f"
  gold-ink: "#231a00"
  ink: "#070b18"
  panel: "#0d1428"
  paper: "#e8edff"
  dim: "#8a93c9"
  muted: "#c6cdf2"
  win: "#37d67a"
  danger: "#ff4d4d"
  cream: "#fff3b0"
typography:
  display:
    fontFamily: Segoe UI
    fontSize: 15rem
    fontWeight: 900
    lineHeight: 0.85
    letterSpacing: "-0.02em"
  h1:
    fontFamily: Segoe UI
    fontSize: 2rem
    fontWeight: 800
    lineHeight: 1.2
  body-md:
    fontFamily: Segoe UI
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.55
  caption:
    fontFamily: Segoe UI
    fontSize: 0.8125rem
    fontWeight: 400
    lineHeight: 1.4
rounded:
  sm: 10px
  md: 16px
  lg: 18px
  pill: 999px
spacing:
  sm: 8px
  md: 16px
  lg: 24px
components:
  pill-solid:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.gold-ink}"
    rounded: "{rounded.pill}"
    padding: 26px
  pill-ghost:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: 26px
  casino-btn:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.gold-ink}"
    rounded: "{rounded.pill}"
    padding: 18px
  casino-btn-ghost:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: 18px
  card-panel:
    backgroundColor: "#141c38"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    padding: 18px
  score-chip:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.gold}"
    rounded: "{rounded.pill}"
    padding: 26px
  digit-blue:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: 10px
  alert-win:
    backgroundColor: "{colors.win}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 18px
  alert-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 18px
  chip-dim:
    backgroundColor: "{colors.dim}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: 10px
  chip-muted:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: 10px
  mark-cream:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: 10px
---

## Overview

Сайт Саши ⁴² — ночная красно-синяя территория батальона: почти чёрный фон,
гигантские контурные цифры «42» (красная 4, синяя 2, обе светятся), поверх —
золотой HUD из пилюль. В воздухе летят цифры (canvas-дождь 42), клики
разлетаются кольцами, счёт копится до 1764 — и стартует ракета ZOV с сальтухой.
Казино — та же ночь, но сукно и золото: панели, краш-график, слоты.

## Colors

- **Primary (#ff3b3b):** красная четвёрка, ракета ZOV, акценты азарта.
- **Secondary (#3b82ff):** синяя двойка, вторая половина территории.
- **Gold (#ffd23f):** главный интерактив — пилюли, кнопки, счёт, баланс.
  Текст на золоте — всегда gold-ink (#231a00) для контраста.
- **Ink (#070b18) / Panel (#0d1428):** ночь и панели; текст — paper (#e8edff),
  вторичный — dim (#8a93c9) и muted (#c6cdf2).
- **Win (#37d67a) / Danger (#ff4d4d):** выигрыш и крэш, без полутонов.
- **Cream (#fff3b0):** тёплые подсветки в казино.
- Градиент неба: красное свечение слева сверху + синее справа снизу на ink —
  держит красно-синий раскол даже без цифр.

## Typography

Системный Segoe UI во всём. Дисплейная цифра — 900 вес, прозрачная заливка,
обводка 2px currentColor + неоновое свечение (красное/синее). Подзаголовки —
до 60 символов в строке, спокойный интерлиньяж 1.55. Кикер над заголовком —
капс с трекингом и золотым именем «Саша ⁴²».

## Layout

Лендинг и игра — один центрированный столбец (до 680px) по середине экрана,
HUD поверх canvas-слоёв (небо, дождь, вуаль). Казино — столбец до 760px,
липкая верхняя плашка с балансом, секции-карточки друг под другом:
краш → кейсы → лошади → рулетка → мины → блэкджек → слоты.

## Elevation & Depth

Глубина — свечением, не тенями: цифры светятся красным/синим, золото —
тёплым ореолом. Вуаль-радиал затемняет края экрана к центру внимания.
3D-ракета летит поверх всего в отдельном canvas; белая вспышка — на пике.

## Shapes

Пилюля (999px) — единственная форма интерактива: кнопки, счёт, баланс.
Карточки — 12–18px. Кольца кликов иcanvas-круги — чистый 50%.
Никаких острых углов у кнопок, никаких блюр-теней.

## Components

- `pill-solid` — золотое действие: играть, депнуть, крутить.
- `pill-ghost` — тёмная пилюля: счёт, статистика, второстепенные ссылки.
- `casino-btn` / `casino-btn-ghost` — ставки и навигация казино.
- `card-panel` — секция игры казино на градиенте ночи.
- `score-chip` — счёт с золотыми цифрами и пульсом при клике.

## Motion & Effects

- Дождь цифр 42 на canvas — постоянный фон, отключается при
  prefers-reduced-motion.
- Клик: золотое кольцо + пульс счёта; каждые 210 очков — вылет сальтухи.
- Секрет на 1764 (42×42): 3D-ракета ZOV, вспышка, экран «Ты нашёл все 42».
- Слоты/кейсы/краш анимируются кривыми GSAP; спин честно крутит ленту.
- Сниппет «42 спрятаны… ищи» и ввод «42» с клавиатуры — пасхалки, не убирать.

## Do's and Don'ts

- Делай: красно-синий раскол, золото только для интерактива, пилюли,
  летящие 42, сальтуху за достижения.
- Не делай: дневной свет, скругления-капли вместо пилюль, золото для
  обычного текста, mise en place без цифр 42 — цифры должны быть везде.
