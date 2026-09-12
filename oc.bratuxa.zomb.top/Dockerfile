# OpenCode Web (opencode.ai/v2, web UI) — всегда включён.
# Фиксированный пароль держится через управляемый сервис:
# entrypoint сеет service.json из OPENCODE_PASSWORD и держит
# `opencode service start` живым. Конфиг/ключи/база — в volume oc-home.
FROM oven/bun:1.4.1
# Тулчейн агента: node LTS + npm/npx (MCP, скрипты), git, python3,
# ripgrep/fd (поиск), jq/unzip/ssh, сборка (нативные модули), curl (сторож).
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates curl git python3 ripgrep fd-find jq unzip \
    openssh-client build-essential pkg-config \
  && rm -rf /var/lib/apt/lists/* \
  && ln -sf "$(command -v fdfind)" /usr/local/bin/fd \
  && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
  && apt-get install -y --no-install-recommends nodejs \
  && rm -rf /var/lib/apt/lists/* \
  && bun install -g --trust @opencode/cli
ENV PATH="/root/.bun/bin:$PATH" HOME=/home/oc
WORKDIR /sites
COPY entrypoint.sh /usr/local/bin/oc-entrypoint.sh
RUN chmod +x /usr/local/bin/oc-entrypoint.sh
EXPOSE 4096
ENTRYPOINT ["/usr/local/bin/oc-entrypoint.sh"]
