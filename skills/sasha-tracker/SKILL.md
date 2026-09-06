---
name: sasha-tracker
version: 1.0.0
description: 'Use when registering a new site in the sasha tracker.'
---

# Саша-трекер: новый сайт в трекер

Приказ Саши⁴²: каждый новый сайт батальона добавляется в трекер на sasha.bratuxa.zomb.top.
Четыре шага (пример — ключ `pampers`, сайт `pampers.bratuxa.zomb.top`):

## 1. Маяк онлайна на новом сайте

В `index.html` нового сайта перед `</body>` — инлайн-скрипт (образец: `sites/pampers.bratuxa.zomb.top/index.html`, хвост файла):
`var SITE='<ключ>'` + чтение/создание `t42_sid` в localStorage + `fetch('https://hub.bratuxa.zomb.top/api/track', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({site:SITE,sid:s}), keepalive:true})` сразу и раз в 30 сек (`setInterval(b,30000)`). Всё в try/catch, молча.

## 2. Метрики кода: `sasha.bratuxa.zomb.top/metrics/collect.mjs`

Добавить строку в `SITES`: `'<ключ>': '<сайт>.bratuxa.zomb.top',`.

## 3. Страница статы: `sasha.bratuxa.zomb.top/src/Stats.tsx`

Три места: отображаемое имя (строка ~18, map ключ→имя), цвет (строка ~25, map ключ→hex), ключ в конец `ORDER` (строка ~27).

## 4. Пересборка Саши (по AGENTS.md проекта)

```bash
cd /root/sites/sasha.bratuxa.zomb.top
bun run typecheck && bun run build && bun ./metrics/collect.mjs
```

Проверить живьём (`curl -sk -H "Host: sasha.bratuxa.zomb.top" https://127.0.0.1/stats.html`), затем коммит+пуш `origin master` (dist/ коммитится).

## Проверки

- Новый сайт шлёт POST на `/api/track` (лог/таблица онлайна).
- `dist/metrics.json` содержит ключ нового сайта.
- Страница статы показывает сайт с именем и цветом.
