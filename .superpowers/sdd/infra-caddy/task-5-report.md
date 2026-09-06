# Task 5 — Ночь X: CUTOVER-OK

Дата (UTC): 2026-09-06. Git: `96c5980 infra: план чинен по репетиции, restart вместо stop 🏆`. Коммитов не делали (конфиг уже в git).

## Даунтайм: ~1 мин (окно 5–10 мин соблюдено)

| Событие | UTC |
|---|---|
| T0 бекап `router.py` → `/tmp/router.prod-backup.py` (md5 `a95d3c6d…` совпал) | 00:42:33 |
| `cp infra/Caddyfile → /etc/caddy/Caddyfile` (diff: идентичен) | 00:42:35 |
| `systemctl restart chaev-site` — :80/:443 свободны, тыл на 127.0.0.1:8080+8443 (pid 68497) | 00:42:35 |
| `systemctl enable --now caddy` — **fail**: `open /var/log/caddy/access.log: permission denied` (файл от ручной репетиции, владелец root) | 00:42:48 |
| Фикс: `chown -R caddy:caddy /var/log/caddy` + `systemctl start caddy` → **active**, :80/:443 держит `caddy` (pid 68793) | 00:42:58 |
| Матрица 20/20 × 200 | 00:43:20 |

Отклонение от брифа дословно: `stop chaev-site` НЕ выполняли — по исправленному плану (коммит 96c5980) роутер нужен как тыл :8080, делали `restart`.

## Кто держит порты (после)

- `:80`, `:443` → `caddy` (pid 68793)
- `127.0.0.1:8080` (+8443) → `python3` тыл-роутер (pid 68497, `chaev-site` active)
- `127.0.0.1:8081` → `docker-proxy`, контейнер `shturm` Up, не трогали (замечен рестарт контейнера ~00:42 — не наш, на результат не повлиял: штурм 200, бой идёт)
- `:8091–8095` → Bun/API-бэкенды, живы

## curl-матрица HTTPS: 20/20 × 200 (без -k, валидный LE-сертификат)

`1b42p, 42laiv, 42vs, ai-714ef0, brohacho, chaev, denis, doom, evaelph, gtaevv, hub, miqqil, mtt, pampers, sasha, setden, skitons, smolgrad, svyatoslav, shturm` — все `-> 200` с первого прохода (00:43:20).
Бонус: `miqqil /api/health` через Caddy → 200 (прокси /api до Bun работает). Сертификат: `Let's Encrypt YE2, notAfter Dec 4 2026`.

## Браузер (через Caddy-HTTPS)

- **shturm**: меню рендерится (скрин: ШТУРМ-43, карты, «В бой!»), клик «В бой!» → canvas 780×437 жив, ресурсов 5, битых 0. Скрины боя не снялись — CDP-screenshot виснет при активном game-loop (лимит харнеса, не сайта); distinguisher: меню-скрин OK, состояние canvas подтверждено JS.
- **chaev**: title «🐴 ЧАЕВ 42», body 9030, ресурсов 8, битых 0, скрин OK.
- **hub**: title «🐴 ИГРЫ 1Б42П GAMES», body 19150, ресурсов 7; единственная битая — `favicon.ico` 404 (отдаёт тыл-роутер, поведение доб-cutover, косметика, не JS-ошибка). Скрин OK.
- **miqqil**: title «🐴 MIQQIL TANKS», body 52361, ресурсов 12, битых кроме того же `favicon.ico` 404 — 0. Скрин не снялся (тот же game-loop лимит харнеса).
- JS-ошибок консоли, ломающих рендер: 0 (все 4 страницы отрендерились, все XHR/ресурсы кроме пре-existing favicon — OK).

## Итог

**CUTOVER-OK** — матрица 20/20 + браузер чистый. Откат не потребовался. Бекап тыла: `/tmp/router.prod-backup.py`.
