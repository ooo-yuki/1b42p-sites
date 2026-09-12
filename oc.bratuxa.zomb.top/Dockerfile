# OpenCode Web (opencode.ai/v2, web UI) — всегда включён.
# Фиксированный пароль держится через управляемый сервис:
# entrypoint сеет service.json из OPENCODE_PASSWORD и держит
# `opencode service start` живым. Конфиг/ключи/база — в volume oc-home.
FROM oven/bun:1.4.1
RUN apt-get update && apt-get install -y --no-install-recommends curl \
  && rm -rf /var/lib/apt/lists/* \
  && bun install -g --trust @opencode/cli
ENV PATH="/root/.bun/bin:$PATH" HOME=/home/oc
WORKDIR /sites
COPY entrypoint.sh /usr/local/bin/oc-entrypoint.sh
RUN chmod +x /usr/local/bin/oc-entrypoint.sh
EXPOSE 4096
ENTRYPOINT ["/usr/local/bin/oc-entrypoint.sh"]
