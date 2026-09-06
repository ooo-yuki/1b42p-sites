---
name: sasha-tracker
version: 1.1.0
description: 'Use when registering a new site in the sasha tracker.'
---

# Саша-трекер: новый сайт в трекер

Приказ Саши⁴²: каждый новый сайт батальона добавляется в трекер на sasha.bratuxa.zomb.top.
Четыре шага (пример — ключ `pampers`, сайт `pampers.bratuxa.zomb.top`):

## 1. Маяк онлайна на новом сайте

В `index.html` нового сайта перед `</body>` — инлайн-скрипт (образец: `sites/pampers.bratuxa.zomb.top/index.html`, хвост файла):
`var SITE='<ключ>'` + чтение/создание `t42_sid` в localStorage + `fetch('https://hub.bratuxa.zomb.top/api/track', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({site:SITE,sid:s}), keepalive:true})` сразу и раз в 30 сек (`setInterval(b,30000)`). Всё в try/catch, молча.

## 1b. Allowlist онлайна + пересборка трекера (иначе POST вернёт 400 `bad`)

Трекер живёт в докере `infra-tracker-api-1`, allowlist — `hub.bratuxa.zomb.top/server-tracker.js`, массив `SITES`. Добавить ключ туда и пересобрать:

```bash
cd /root/sites/infra && docker compose -f compose.apps.yml build tracker-api && docker compose -f compose.apps.yml up -d tracker-api
```

Проверка приёма: `curl -X POST http://127.0.0.1:8093/api/track -H 'Content-Type: application/json' -d '{"site":"<ключ>","sid":"<32 hex>"}'` ждёт `{"ok":true}`.

## 2. Метрики кода: `sasha.bratuxa.zomb.top/metrics/collect.mjs`

Добавить строку в `SITES`: `'<ключ>': '<сайт>.bratuxa.zomb.top',`.

## 3. Страница статы: `sasha.bratuxa.zomb.top/src/Stats.tsx`

Три места: отображаемое имя (map ключ→имя), цвет (map ключ→hex — hex обязан быть новым, без дублей палитры), ключ в конец `ORDER` (`ORDER` также крутит пики онлайна — без ключа сайт не покажется нигде). Если папка сайта не совпадает с ключом, в `collect.mjs` маппить явно (раньше так было с `laiv42` → `42laiv.bratuxa.zomb.top`, ключ убран по приказу Саши⁴²).

## 4. Пересборка Саши (по AGENTS.md проекта)

```bash
cd /root/sites/sasha.bratuxa.zomb.top
npm run typecheck && npm run build
```

Сборка сама гоняет `collect.mjs` в конце — отдельно его запускать не надо. Живая проверка — в публичный домен (прямой `curl -sk -H "Host: …" https://127.0.0.1/` мёртв: на 443 сидит Caddy со SNI-маршрутизацией):

```bash
curl -s -o /dev/null -w "%{http_code}" https://sasha.bratuxa.zomb.top/stats.html
```

Затем коммит+пуш `origin master` (dist/ коммитится; сироты хешированных бандлов чистятся по референсам из html).

Особый случай: сайт за отдельным сервисом (как `shturm` на `:8081`) — маяк в корне репо может не стрелять; проверить, что отдаёт прод, и маяк ставить туда, где реально живёт `index.html`.

## Проверки

- Новый сайт шлёт POST на `/api/track` (лог/таблица онлайна).
- `dist/metrics.json` содержит ключ нового сайта.
- Страница статы показывает сайт с именем и цветом.
