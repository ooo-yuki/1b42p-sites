# Task 2 report: Штурм в Docker (пилот)

Status: DONE

## Files (дословно из брифа, §Step 1)
- `shturm.bratuxa.zomb.top/Dockerfile` — FROM caddy:alpine, COPY dist /srv, COPY Caddyfile.container
- `shturm.bratuxa.zomb.top/Caddyfile.container` — :80, root /srv, file_server, try_files → /index.html, no-cache для *.html
- `shturm.bratuxa.zomb.top/compose.yml` — сервис shturm, image shturm-43:latest, порт `127.0.0.1:8081:80`, json-file логи 10m×3

## Commit
- `b16f8b5` — «infra: штурм в Docker, compose в git 🐳» (3 files, +25)

## Curl-выводы (127.0.0.1:8081)
- `index: 200` — `curl -s -o /dev/null -w 'index: %{http_code}\n' http://127.0.0.1:8081/`
- `glb: 200` — `curl ... /models/Meshy_AI_shuba_biped_Animation_Walking_withSkin.glb` (442592 байт)
- Тело index: `<!doctype html><html lang="ru">...`, скрипт `/assets/index-qLSdhfSw.js` — хеш сборки совпал с dist
- SPA-fallback: `/nonexistent-route` отдаёт index (try_files работает)
- Порт: `LISTEN 127.0.0.1:8081` (docker-proxy) — только localhost
- Контейнер: `shturm ... 127.0.0.1:8081->80/tcp Up`

## Прод не тронут
- `chaev-site`: active
- `curl http://127.0.0.1:80/` → 200

## Concerns
- Нет. Образ `caddy:alpine` тянулся из docker.io без пина версии — для воспроизводимости можно запинить digest позже (не в скоупе Task 2).
