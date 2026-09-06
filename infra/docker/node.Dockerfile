# Общий Node-образ для API батальона (evaelph/tracker). Node 24 как на хосте.
# Контекст сборки — папка сайта; старт-файл задаётся через compose `command`.
FROM node:24.20.0-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev 2>/dev/null || npm install --omit=dev
COPY . .
CMD ["node", "server.js"]
