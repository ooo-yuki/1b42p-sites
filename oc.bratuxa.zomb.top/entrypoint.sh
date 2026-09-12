#!/bin/sh
# Держит управляемый сервер OpenCode живым внутри ящика.
# Пароль фиксированный: service.json сеется из OPENCODE_PASSWORD один раз
# (дальше живёт в volume oc-home и переживает пересборки).
# Перезапускает только по статусу `stopped` — повторный `service start`
# по живому серверу его роняет, поэтому никаких слепых рестартов по таймеру.
set -e
export HOME=/home/oc
export PATH="/root/.bun/bin:$PATH"
CFG="$HOME/.config/opencode/service.json"
if [ ! -f "$CFG" ]; then
  mkdir -p "$(dirname "$CFG")"
  : "${OPENCODE_PASSWORD:?OPENCODE_PASSWORD is required on first boot}"
  printf '{"hostname":"0.0.0.0","port":4096,"password":"%s"}\n' \
    "$OPENCODE_PASSWORD" > "$CFG"
  chmod 600 "$CFG"
fi
cd /sites
while true; do
  st=$(opencode service status 2>&1 | head -n 1)
  if [ "$st" = "stopped" ]; then
    echo "oc-entrypoint: server stopped, starting..."
    opencode service start || true
    sleep 60
  else
    sleep 20
  fi
done
