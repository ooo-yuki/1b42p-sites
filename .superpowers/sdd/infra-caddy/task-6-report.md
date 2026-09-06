# Task 6 — Наблюдаемость: DONE. Вахту несу я сам (решения Miqqil — ботов нет)

Дата (UTC): 2026-09-06. Git:
- `22f6c85 infra: Prometheus алерты Grafana, фарш готов 📊` (первый подъём фарша)
- `06ed096 infra: вахта Amigo вместо ботов + честные метрики ядра 📊` (канал доставки + фиксы)

## Канал доставки — Я (без отдельного бота)
- Крон `infra-watch-42` (`39ace863e76c`), каждые 5 мин, `no_agent` (тихий вотчдог):
  скрипт `infra/watch.py` опрашивает `:9090/api/v1/rules` (firing) + `/api/v1/targets`
  (down), сверяет со стейтом `/root/.hermes/profiles/keshiu/infra-watch.state`,
  печатает ТОЛЬКО новые проблемы/recoveries. Пустой stdout = тишина в чат.
- `deliver=origin` → постит сюда, в тред батальона; `failure_deliver=local` (шум поломок тика — не в чат).
- Обёртка `/root/.hermes/profiles/keshiu/scripts/infra-watch-42.py` — только `exec()`
  каноникала из git. Важно: раннер крона ищет скрипт именно в папке профиля
  (`~/.hermes/profiles/keshiu/scripts/`), а НЕ в `~/.hermes/scripts/` — первый
  ручной прогон упал с `Script not found`, чинено копированием туда.
- Пробный запуск крона выполнен; ручной прогон `watch.py` — пусто (базлайн чист).
- `alertmanager.yml`: receiver пустой + коммент (Amigo-вахта — основной канал;
  telegram_configs оставлен закомментированным как запасной).

## Фарш (проверки живьём)
- 5 контейнеров Up: `:9090` Healthy, `:9093` готов, Grafana `/login` 200,
  дашборд «1Б42П — инфра» в search API, datasource provisioned.
- Таргеты 24/24 up (20 сайтов, 3 TLS, node). Правила 4/4 ok, все inactive.
- Серты min ~90 дней. `POST /api/v2/alerts` → 200 (тракт алертов жив).

## Rulings (дефекты плана/брифа, найдены проверкой)
1. Модуля `caddy/v2/modules/caddyprometheus` НЕ существует (xcaddy: does not contain
   package). `miekg/caddy-prometheus` — плагин Caddy **v1** 2019 года, в v2 мёртв.
   Перепроверенных живых v2-модулей per-request метрик не нашлось → бинарь
   `/usr/local/bin/caddy-metrics` пересобран **стоком** (ядро уже содержит
   `http.handlers.metrics` + admin `/metrics`). Статус: rebuild запущен (см. ниже).
2. Ядро отдают только admin/Go-метрики, per-request НЕТ (проверено тестовым запуском
   с `handle /metrics { metrics }`: только `caddy_admin_*` + `go_*`). Поэтому:
   - `UpstreamDown` переписан на сигнатуру «≥3 сайтов down» через пробы;
   - дашборд: панель 5 = count down, панель 6 = `probe_http_status_code` (502 = тыл лёг);
   - выдуманных `caddy_http_*` в правилах/дашборде больше нет.
3. Скрейп Caddy-админки (`:2019`) и тыла (`:8080`) из контейнеров невозможен —
   оба забиндены на 127.0.0.1 (host-gateway → refused). Прод-Caddyfile ради этого
   не трогаем; caddy-job из prometheus.yml удалён. Падение тыла видно как 502
   в пробах → ловят SiteDown/UpstreamDown.
4. Атомарная запись файлов меняет inode при живом бинд-маунте → после правок
   нужен `up -d --force-recreate` (иначе контейнер видит старый инод).

## Concerns
1. ~~Rebuild стокового бинаря был в работе~~ DONE: `/usr/local/bin/caddy-metrics` —
   сток v2.11.4, `http.handlers.metrics` + `admin.api.metrics` на месте, мёртвой
   v1-зависимости нет. Миграция юнита на него — отдельный шаг (не T6).
2. Образы `:latest` без пина (как в брифе; пин — follow-up).
3. В копии чужой мусор `mtt.*` (modified + ассеты) — не трогал, в коммиты не попало.
