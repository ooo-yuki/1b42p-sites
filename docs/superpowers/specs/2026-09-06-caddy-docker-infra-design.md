# Инфра 1Б42П: Caddy + Docker (спек)

Дата: 2026-09-06. Статус: дизайн согласован, ждёт ревью спека.
Мотто: Мы уже победили 🏆. Костылям — нет, взрослому подходу — да.

## 1. Цель и успех
Заменить самопальный `router.py` (Python http.server: TLS + статика + API-прокси) на взрослый стек:
Caddy на хосте + Docker-контейнеры (пилот — штурм). Успех: 20/20 хостов 200 по HTTPS,
0 ошибок консоли в браузере, серты авто-продлеваются, метрики/алерты/дашборд живут,
`router.py` удалён из git. Даунтайм — только ночь переключения, минуты.

## 2. Подход (утверждён): цепочка-пилот A
Caddy — единственный хозяин 80/443. День 1: `shturm` нативно (в контейнер),
остальные 19 — проксируются в старый роутер на `127.0.0.1:8080` (тихий тыл).
Миграция по хосту в день graceful-перезагрузкой Caddy (без обрыва соединений).
Финал: роутер удалён. Отвергнуты: big-bang (риск ночью), nginx+certbot руками (новый костыль).

## 3. Целевой стек
- Caddy 2 (официальный apt-пакет, systemd-юнит из пакета) — 80/443, авто-TLS, логи, reverse_proxy.
- Docker 29.7.2 + Compose v5.5.1 (уже на сервере).
- Штурм: образ `caddy:alpine` + `COPY dist` + инлайн-Caddyfile (SPA-fallback, no-cache html).
- Наблюдаемость: Caddy JSON-логи + logrotate, Prometheus + Alertmanager (алерты в Telegram),
  Grafana-дашборд. Железо проверено: 7.8G RAM, свободно 4.6G — хватает с запасом.

## 4. Штурм в Docker (пилот)
Файлы в git рядом с игрой (`shturm.bratuxa.zomb.top/`):
- `Dockerfile`: `FROM caddy:alpine`, `COPY dist /srv`, `COPY Caddyfile.container /etc/caddy/Caddyfile`.
- `Caddyfile.container` (5 строк): `root * /srv`, `file_server`, `try_files {path} /index.html`,
  `header *.html Cache-Control no-cache`.
- `compose.yml`: build из исходников, `restart: unless-stopped`, порт только localhost
  (`127.0.0.1:8081:80`), лимиты логов (`max-size 10m, max-file 3`).
Подъём: `docker compose up -d --build`. Два уровня конфигов: большой Caddyfile хоста
(все сайты, reverse_proxy) + маленький внутри контейнера (только раздача файлов).

## 5. Caddyfile хоста (`infra/Caddyfile` в git)
- Глобал: `admin off` (или localhost), `log` JSON, `email` для LE.
- Сниппет статики: `root * /root/sites/<host>/dist`, `file_server`, `try_files`,
  `header /*.html Cache-Control no-cache`, HSTS (как сейчас).
- Сниппет API: `reverse_proxy /api/* 127.0.0.1:809X` (WS — нативно, туннель-костыль умирает).
- Фаза пилота: `shturm → reverse_proxy 127.0.0.1:8081`, остальные 19 → `reverse_proxy 127.0.0.1:8080`
  (роутер с `BASE` тот же, слушает только localhost — правится 2 строками: адрес bind).
- Проверка конфига до рестарта: `caddy validate --config`.

## 6. Серты (TLS)
Авто-выпуск Caddy по HTTP-01 пачками по 5 хостов (уважаем лимиты LE, 50 заказов/неделю с запасом).
Старые файлы `/etc/letsencrypt/.../chaev.bratuxa.zomb.top` — в архив `/root/infra-backup/`, не удаляем
до победы. ECDSA оставляем по умолчанию Caddy.

## 7. Наблюдаемость (фарш)
- Логи: `log { output file /var/log/caddy/access.log, format json }` + logrotate (ежедневно, 14 дней).
- Метрики: сборка Caddy с prometheus-плагином через xcaddy (один раз, бинарь в `/usr/local/bin`),
  Prometheus скрапит `:2019/metrics` (или отдельный порт), ретеншн 30 дней.
- Алерты (Alertmanager → Telegram): сайт не 200 >2 мин, серт моложе 14 дней, апстрим down,
  место <15%, OOM контейнеров. Chat ID при выполнении взять из существующих конфигов
  ботов на сервере, если нет — запросить у Босса.
- Grafana: RPS/5xx/задержки по хостам, здоровье апстримов 8091–8095 и :8081, сроки сертов.

## 8. Катовер и откат
Репетиция: весь стек на локальных портах (Caddy :8080/:8443 с самоподписанным), curl-матрица 20 хостов.
Ночь X: стоп chaev-site → старт Caddy на 80/443 → curl 20/20 + браузер-скрины штурма и 3 соседей.
Откат на любом шаге (<1 мин): стоп Caddy → старт chaev-site (юнит и конфиг хранятся до финала).
Финал после 19 миграций: `git rm router.py`, удалить юнит chaev-site, закрыть 8080.

## 9. Приёмка
- `curl` 20/20 HTTPS 200 + корректные тела (shturm — dist-index с хешем сборки).
- Браузер: меню/бой штурма + 3 соседа, консоль 0 ошибок (иначе 0/10).
- `docker ps`: shturm-контейнер healthy, рестарт-политика проверена (`docker restart` + ребут-тест по возможности).
- Grafana показывает трафик, тестовый алерт доходит в Telegram.
- `router.py` отсутствует в git, порты 80/443 — только Caddy (`ss -tlnp`).

## 10. Риски
LE-лимиты — митигация пачками + staging при репетиции. Память под Prometheus/Grafana —
замерено, запас 4.6G. Ночной даунтайм — окно 5–10 мин согласовано. Параллельный коммит в
router.py во время пилота — правим только bind-адрес, конфликтов минимум.
