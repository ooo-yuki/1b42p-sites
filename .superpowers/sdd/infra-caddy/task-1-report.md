# Task 1 — отчёт: установка Caddy на хост

**Статус: DONE**
**Коммит:** `6f0bfc4` — `infra: Caddy установлен, скелет конфига 🏆`
**Дата:** 2026-09-06 UTC

## Что сделано
1. Добавлен официальный репозиторий Caddy (Cloudsmith stable) + ключ, установлен пакет `caddy`.
2. `systemctl stop caddy; systemctl disable caddy` — автозапуск запрещён до ночи X.
3. Создан `infra/Caddyfile` — скелет дословно из брифа (глобал + заглушка, хосты добавит Task 3), закоммичен.

## Версии / проверки
- `caddy version` → **v2.11.4** (`h1:XKxkMTgNSizEvKG6QHue6cAsFOteU2qA61w2tKkCWi0=`)
- `systemctl is-enabled caddy` → **disabled**
- `systemctl status caddy` → `Loaded: loaded (...; disabled; ...)`; Active на момент старта пакета — `failed (exit-code)`, причина из журнала: `listening on :80: bind: address already in use` — т.е. прод-роутер порты не отдал, что и требовалось.
- `ss -tlnp | grep -E ':80 |:443 '` → только `python3 (pid 47072)` — прод (`router.py`) на месте, Caddy порты не держит.
- `caddy validate --config infra/Caddyfile --adapter caddyfile` → **Valid configuration**.
- `git show --stat HEAD` → 1 файл: `infra/Caddyfile` (11 строк).

## Concerns
- При установке пакет попытался автостартовать и упал на занятом :80 — это штатное подтверждение «порты заняты продом», а не ошибка. Сервис остановлен и отключён.
- `systemctl status` показывает `Active: failed` (след автостарта при установке), а не `inactive (dead)`. Для Task 1 это приемлемо (сервис не запущен, disabled), но если перфекционизм — `systemctl reset-failed caddy` уберёт флаг failed. Не делал, чтобы не маскировать историю.
- В `git status` висят предсуществующие незакоммиченные изменения (`mtt.../mtt.spec.ts`, `.superpowers/`, `.last-run.json`) — не мои, не трогал.
