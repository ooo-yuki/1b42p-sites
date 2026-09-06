# Task 1 review — установка Caddy

**Вердикт Spec: ✅** (все пункты брифа выполнены, проверено живьём)
**Quality: высокая** (отчёт честный, расхождений с фактом нет)

## Проверено живьём (2026-09-06 UTC)
- `caddy version` → `v2.11.4 h1:XKxkMTgNSizEvKG6QHue6cAsFOteU2qA61w2tKkCWi0=` ✅ (2.x)
- `systemctl is-enabled caddy` → `disabled` ✅
- `systemctl status caddy` → `Loaded: loaded (...; disabled; ...)`, `Active: failed (exit-code)`, причина: `listening on :80: bind: address already in use` — Caddy не запущен, порты не держит ✅
- `ss -tlnp | grep -E ':80 |:443 '` → только `python3 (pid 47072)` на обоих портах ✅ (прод-роутер на месте)
- `systemctl is-active chaev-site` → `active` ✅ (прод не тронут)
- `infra/Caddyfile` на диске — 11 строк, побайтово совпадает с брифом и диффом ✅
- `caddy validate --config infra/Caddyfile --adapter caddyfile` → `Valid configuration` ✅
- Коммит `6f0bfc4` в истории: только `infra/Caddyfile` (11 строк, +11/-0) ✅; новых коммитов поверх (85563a0) файл не задет

## Findings

### Critical
- Нет.

### Important
- Нет.

### Minor
- `systemctl status caddy` показывает `Active: failed`, а не `inactive (dead)` — след автостарта пакета при установке (упал на занятом :80). Сервис остановлен и отключён, прод-порты целы; на Spec не влияет. Опционально: `systemctl reset-failed caddy` для чистого статуса. Отчёт это честно раскрыл (раздел Concerns), претензий нет. — `caddy.service`
