# Task 3 report: Caddyfile хоста + роутер в тыл — DONE

**Status:** DONE
**Commit:** c1dc133 `infra: пилот-Caddyfile + роутер в тыл 8080 🏆` (3 files, +20/−6)
**Date:** 2026-09-06 UTC

## Что сделано
1. **infra/Caddyfile** — полный пилот-конфиг: global (email + json-лог в /var/log/caddy/access.log),
   snippet (common), `shturm→127.0.0.1:8081`, 19 хостов→127.0.0.1:8080, комментарий про /api→809X.
2. **router.py** — только binds: `serve_http` 0.0.0.0:80 → 127.0.0.1:8080,
   `serve_https` 0.0.0.0:443 → 127.0.0.1:8443. Логика не тронута.
3. **docs/superpowers/plans/2026-09-06-caddy-docker-infra.md** — закоммичен вместе (был modified в рабочей копии).

## Проверки
- `tls`-блока в Caddyfile **нет** (рулинг леджера: `tls { dns off }` невалиден, удалён из плана/брифа/файла) — grep по файлу: совпадений `tls` ноль.
- Брифу соответствует дословно **за вычетом** удалённого tls-блока (бриф-файл ещё содержит старый блок с tls, файл — уже без него, это и есть правильное состояние).
- `python3 -c "import ast; ..."`: **syntax OK**.
- `caddy validate --config /root/sites/infra/Caddyfile` (caddy v2.11.4):
  ```
  {"level":"info","ts":...,"msg":"using config from file","file":"/root/sites/infra/Caddyfile"}
  {"level":"info","ts":...,"msg":"adapted config to JSON","adapter":"caddyfile"}
  {"level":"info","ts":...,"msg":"redirected default logger","from":"stderr","to":"/var/log/caddy/access.log"}
  Valid configuration
  ```
  exit=0.

## Concerns
- Бриф-файл `task-3-brief.md` до сих пор содержит блок `tls { dns off }` в Step 1 — расходится с рулингом и с фактическим Caddyfile. Не правил (бриф — чужой артефакт), но следующему исполнителю стоит обновить бриф.
- Caddy не запускался / прод не трогался (по брифу). Порты 80/443 после миграции займёт Caddy — до `systemctl reload caddy` роутер на 8080/8443 трафик не получает.
- Untracked `.superpowers/` в /root/sites остался вне коммита (по задаче коммитились только 3 файла).
