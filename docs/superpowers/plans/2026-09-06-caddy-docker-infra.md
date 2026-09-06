# Инфра 1Б42П: Caddy + Docker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Перевести 20 сайтов батальона с router.py на Caddy, штурм — в Docker, добавить метрики/алерты/дашборд, удалить роутер.

**Architecture:** Цепочка-пилот: Caddy единственный хозяин 80/443; штурм нативно в контейнер :8081; остальные 19 проксируются в router.py на 127.0.0.1:8080; миграция по хосту graceful-reload; финал — роутер удалён.

**Tech Stack:** Caddy 2 (apt), Docker 29 + Compose v5, caddy:alpine, Prometheus + Alertmanager + Grafana, LE auto-TLS.

**Spec:** `/root/sites/docs/superpowers/specs/2026-09-06-caddy-docker-infra-design.md`

## Global Constraints

- Прод трогаем только в ночь X и только по шагам Task 5; репетиция — на локальных портах.
- Перед каждым рестартом сервиса: `caddy validate --config` обязан быть зелёным.
- Коммиты: префикс `infra:` + эмодзи; конфиги в git (`infra/`, сайт штурма).
- Откат любого шага <1 мин (стоп Caddy → старт chaev-site); юниты и серты храним до финала.
- Проверка в браузере обязательна после кат over (штурм + 3 соседа, консоль 0 ошибок), иначе 0/10.

---

### Task 1: Установка Caddy на хост

**Files:**
- Create: `infra/Caddyfile` (скелет: глобал + заглушка, полный текст — Task 3)
- Modify: нет.

**Interfaces:**
- Consumes: ничего.
- Produces: `caddy version` отвечает 2.x; `systemctl status caddy` существует но НЕ запущен (порты заняты роутером).

- [ ] **Step 1: Поставить официальный репозиторий и пакет**

```bash
apt-get install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/gpg.key | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt | tee /etc/apt/sources.list.d/caddy-stable.list
apt-get update && apt-get install -y caddy
caddy version
```

- [ ] **Step 2: Запретить автозапуск до ночи X и проверить**

```bash
systemctl stop caddy; systemctl disable caddy
systemctl status caddy --no-pager | head -n 3
ss -tlnp | grep -E ':80 |:443 ' | head
```

Expected: caddy установлен, остановлен; 80/443 держит только python3 router.py.

- [ ] **Step 3: Скелет Caddyfile в git + commit**

```caddy
{
	email admin@bratuxa.zomb.top
	log {
		output file /var/log/caddy/access.log {
			roll_size 50MiB
			roll_keep 10
		}
		format json
	}
}
# Хосты добавит Task 3. До ночи X этот файл НЕ активен.
```

```bash
mkdir -p /root/sites/infra
git add infra/Caddyfile
git commit -m "infra: Caddy установлен, скелет конфига 🏆"
```

### Task 2: Штурм в Docker (пилот)

**Files:**
- Create: `shturm.bratuxa.zomb.top/Dockerfile`
- Create: `shturm.bratuxa.zomb.top/Caddyfile.container`
- Create: `shturm.bratuxa.zomb.top/compose.yml`

**Interfaces:**
- Consumes: `shturm.bratuxa.zomb.top/dist/` (уже собран, проверен в проде).
- Produces: контейнер `shturm` отвечает 200 на `127.0.0.1:8081` (index с хешем сборки + GLB 200).

- [ ] **Step 1: Три файла дословно**

```dockerfile
# Dockerfile
FROM caddy:alpine
COPY dist /srv
COPY Caddyfile.container /etc/caddy/Caddyfile
```

```caddy
# Caddyfile.container
:80 {
	root * /srv
	file_server
	try_files {path} /index.html
	header /*.html Cache-Control no-cache
}
```

```yaml
# compose.yml
services:
  shturm:
    build: .
    image: shturm-43:latest
    container_name: shturm
    restart: unless-stopped
    ports:
      - "127.0.0.1:8081:80"
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "3"
```

- [ ] **Step 2: Build + локальная проверка**

```bash
cd /root/sites/shturm.bratuxa.zomb.top
docker compose up -d --build
sleep 3
curl -s -o /dev/null -w 'index: %{http_code}\n' http://127.0.0.1:8081/
curl -s -o /dev/null -w 'glb: %{http_code}\n' http://127.0.0.1:8081/models/Meshy_AI_shuba_biped_Animation_Walking_withSkin.glb
curl -s http://127.0.0.1:8081/ | head -c 120; echo
```

Expected: оба 200, тело — dist-index штурма с хешем `index-qLSdhfSw.js`.

- [ ] **Step 3: Commit**

```bash
git add shturm.bratuxa.zomb.top/Dockerfile shturm.bratuxa.zomb.top/Caddyfile.container shturm.bratuxa.zomb.top/compose.yml
git commit -m "infra: штурм в Docker, compose в git 🐳"
```

### Task 3: Caddyfile хоста + роутер в тыл

**Files:**
- Modify: `infra/Caddyfile` (полный пилот-конфиг, ниже)
- Modify: `router.py` (bind на 127.0.0.1:8080 — 2 строки в serve_http/serve_https)
- Test: `caddy validate --config /root/sites/infra/Caddyfile`

**Interfaces:**
- Consumes: контейнер :8081 (Task 2), бэкенды 8091–8095 живые.
- Produces: валидный Caddyfile: shturm→:8081, 19 хостов→:8080, /api→809X; роутер готов к тылу.

- [ ] **Step 1: Пилот-Caddyfile дословно**

```caddy
{
	email admin@bratuxa.zomb.top
	log {
		output file /var/log/caddy/access.log {
			roll_size 50MiB
			roll_keep 10
		}
		format json
	}
}

(common) {
	header /*.html Cache-Control no-cache
	header -Server
	encode gzip
}

shturm.bratuxa.zomb.top {
	import common
	reverse_proxy 127.0.0.1:8081
	tls {
		dns off
	}
}

1b42p.bratuxa.zomb.top, 42laiv.bratuxa.zomb.top, 42vs.bratuxa.zomb.top, ai-714ef0.bratuxa.zomb.top, brohacho.bratuxa.zomb.top, chaev.bratuxa.zomb.top, denis.bratuxa.zomb.top, doom.bratuxa.zomb.top, evaelph.bratuxa.zomb.top, gtaevv.bratuxa.zomb.top, hub.bratuxa.zomb.top, miqqil.bratuxa.zomb.top, mtt.bratuxa.zomb.top, pampers.bratuxa.zomb.top, sasha.bratuxa.zomb.top, setden.bratuxa.zomb.top, skitons.bratuxa.zomb.top, smolgrad.bratuxa.zomb.top, svyatoslav.bratuxa.zomb.top {
	import common
	reverse_proxy 127.0.0.1:8080
}
# /api/* каждого хоста — до миграции держит роутер в тылу; при миграции хоста
# добавляется блок: reverse_proxy /api/* 127.0.0.1:809X
```

- [ ] **Step 2: Роутер в тыл (только bind, логика не трогается)**

```bash
# в router.py: serve_http ThreadingHTTPServer(("127.0.0.1", 8080)...),
# serve_https ThreadingHTTPServer(("127.0.0.1", 8443)...). Больше ничего.
python3 -c "import ast; ast.parse(open('/root/sites/router.py').read()); print('syntax OK')"
```

- [ ] **Step 3: Validate + commit (без рестарта! прод не трогаем)**

```bash
caddy validate --config /root/sites/infra/Caddyfile
git add infra/Caddyfile router.py
git commit -m "infra: пилот-Caddyfile + роутер в тыл 8080 🏆"
```

Expected: `Valid configuration`.

### Task 4: Репетиция на локальных портах

**Files:** временные, вне git (`/tmp/caddy-rehearse/`).

**Interfaces:**
- Consumes: Caddyfile Task 3, контейнер :8081, роутер-тыл (запустить вручную на 8080 для репетиции, прод-роутер на 80/443 НЕ трогаем).
- Produces: матрица curl 20/20 через Caddy :8080/:8443 с Host-заголовками.

- [ ] **Step 1: Поднять тыл + Caddy на тестовых портах**

```bash
mkdir -p /tmp/caddy-rehearse
sed -e 's/:80/:8080/' -e 's/:443/:8443/' /root/sites/infra/Caddyfile > /tmp/caddy-rehearse/Caddyfile.test
(nohup python3 /root/sites/router.py >/tmp/caddy-rehearse/router.log 2>&1 &) || true
caddy start --config /tmp/caddy-rehearse/Caddyfile.test
sleep 2
```

- [ ] **Step 2: Матрица 20 хостов**

```bash
for d in 1b42p 42laiv 42vs ai-714ef0 brohacho chaev denis doom evaelph gtaevv hub miqqil mtt pampers sasha setden skitons smolgrad svyatoslav shturm; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 -H "Host: $d.bratuxa.zomb.top" http://127.0.0.1:8080/);
  echo "$d -> $code";
done
```

Expected: 20 строк, все 200. Иначе — чинить конфиг, Task 5 запрещён.

- [ ] **Step 3: Прибрать репетицию**

```bash
caddy stop; pkill -f 'python3 /root/sites/router.py'; sleep 1
systemctl is-active chaev-site
```

Expected: прод-роутер active (его не трогали), тестовые процессы мертвы.

### Task 5: Ночь X — катовер (единственный таск с даунтаймом)

**Files:** нет (только команды + проверка).

**Interfaces:**
- Consumes: зелёная матрица Task 4, окно 5–10 мин согласовано.
- Produces: Caddy на 80/443, 20/20 HTTPS 200, браузер чистый.

- [ ] **Step 1: Переключение (секунды)**

```bash
cp /root/sites/infra/Caddyfile /etc/caddy/Caddyfile
systemctl stop chaev-site
systemctl enable --now caddy
sleep 3
ss -tlnp | grep -E ':80 |:443 '
```

Expected: 80/443 держит caddy, не python3.

- [ ] **Step 2: curl 20/20 по HTTPS**

```bash
for d in 1b42p 42laiv 42vs ai-714ef0 brohacho chaev denis doom evaelph gtaevv hub miqqil mtt pampers sasha setden skitons smolgrad svyatoslav shturm; do
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 15 https://$d.bratuxa.zomb.top/);
  echo "$d -> $code";
done
```

Expected: все 200. Если >0 не-200 — откат: `systemctl stop caddy; systemctl start chaev-site` (<1 мин), разбираемся днём.

- [ ] **Step 3: Браузер (shturm меню+бой, 3 соседа), консоль 0 ошибок**

```bash
git -C /root/sites log --oneline -1 && echo NIGHT-X-OK
```

Зафиксировать хэш и скрины в отчёт; commit не нужен (конфиг уже в git).

### Task 6: Наблюдаемость — фарш

**Files:**
- Create: `infra/prometheus.yml`, `infra/alertmanager.yml`, `infra/grafana-dashboard.json`
- Create: `infra/compose.yml` (prometheus + alertmanager + grafana)

**Interfaces:**
- Consumes: Caddy на 80/443 (Task 5), Telegram bot для алертов (ID чата — у Босса).
- Produces: `:9090` Prometheus царапает Caddy, `:9093` Alertmanager, `:3000` Grafana с дашбордом; тестовый алерт в Telegram.

- [ ] **Step 1: Caddy с метриками (xcaddy разово)**

```bash
export PATH="$PATH:$HOME/go/bin"
command -v xcaddy || go install github.com/caddyserver/xcaddy/cmd/xcaddy@latest
xcaddy build --with github.com/caddyserver/caddy/v2/modules/caddyprometheus --output /tmp/caddy-metrics
cp /tmp/caddy-metrics /usr/local/bin/caddy-metrics
/usr/local/bin/caddy-metrics version
```

- [ ] **Step 2: Compose фарша + правила алертов**

```yaml
# infra/compose.yml (фрагмент)
services:
  prometheus:
    image: prom/prometheus:latest
    restart: unless-stopped
    ports: ["127.0.0.1:9090:9090"]
    volumes: ["./prometheus.yml:/etc/prometheus/prometheus.yml", "prom-data:/prometheus"]
  alertmanager:
    image: prom/alertmanager:latest
    restart: unless-stopped
    ports: ["127.0.0.1:9093:9093"]
    volumes: ["./alertmanager.yml:/etc/alertmanager/alertmanager.yml"]
  grafana:
    image: grafana/grafana:latest
    restart: unless-stopped
    ports: ["127.0.0.1:3000:3000"]
    volumes: ["grafana-data:/var/lib/grafana"]
volumes: { prom-data:, grafana-data: }
```

Алерты: сайт не 200 >2 мин; серт моложе 14 дней; апстрим down; диск <15%.

- [ ] **Step 3: Тестовый алерт в Telegram + commit**

```bash
docker compose -f /root/sites/infra/compose.yml up -d
sleep 5
curl -s http://127.0.0.1:9090/-/healthy; echo
git add infra/
git commit -m "infra: Prometheus алерты Grafana, фарш готов 📊"
```

Expected: healthy, алерт прилетел Боссу в личку.

### Task 7: Миграция 19 хостов (по одному в день)

**Files:**
- Modify: `infra/Caddyfile` (на каждый хост: свой блок вместо строки в общем списке).

**Interfaces:**
- Consumes: зелёный прод Task 5.
- Produces: хост раздаётся нативно (статика из папки/dist, /api на свой 809X); `caddy reload` без обрывов.

Шаблон блока на хост (пример — танки, dist нет, API 8091):

```caddy
miqqil.bratuxa.zomb.top {
	import common
	root * /root/sites/miqqil.bratuxa.zomb.top
	file_server
	try_files {path} /index.html
	reverse_proxy /api/* 127.0.0.1:8091
}
```

- [ ] **Step 1..N: На хост — блок + reload + curl + браузер-спотчек + commit**

```bash
caddy validate --config /root/sites/infra/Caddyfile
cp /root/sites/infra/Caddyfile /etc/caddy/Caddyfile
systemctl reload caddy
curl -s -o /dev/null -w '<host>: %{http_code}\n' https://<host>.bratuxa.zomb.top/
git add infra/Caddyfile
git commit -m "infra: <host> нативно с Caddy 🏆"
```

Порядок: hub → sasha → mtt → miqqil → evaelph → остальные (API-хосты раньше — там WS проверить).

### Task 8: Снос роутера + финальная приёмка

**Files:**
- Delete: `router.py` (`git rm`), юнит `chaev-site` — disable/stop, порт 8080 закрыть.

- [ ] **Step 1: Снос**

```bash
systemctl stop chaev-site; systemctl disable chaev-site
git rm router.py
git commit -m "infra: router.py под снос, один хозяин Caddy 🏆"
ss -tlnp | grep -E ':8080|:8443' || echo 'тыл закрыт'
```

- [ ] **Step 2: Приёмка по спеку раздел 9**

```bash
docker ps --format '{{.Names}} {{.Status}}'
curl -s http://127.0.0.1:9090/-/healthy; echo
```

Браузер: штурм + 3 соседа, 0 ошибок. Grafana — трафик виден. `ss -tlnp`: 80/443 только caddy.
