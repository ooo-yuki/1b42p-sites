# Task 6 brief (single source of truth)

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


