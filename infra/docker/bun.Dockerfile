# Общий Bun-образ для API батальона (miqqil/mtt/sasha-arena).
# Контекст сборки — папка сайта; старт-файл задаётся через compose `command`.
FROM oven/bun:1.4.1
WORKDIR /app
COPY package.json bun.lock* ./
RUN if [ -f bun.lock ]; then bun install --production --frozen-lockfile; else bun install --production; fi
COPY . .
CMD ["bun", "run", "server.ts"]
