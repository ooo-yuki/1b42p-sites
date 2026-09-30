import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 90000,
  retries: 0,
  // мало ядер на CI-коробке — больше двух воркеров душат друг друга и плодят флаки
  workers: 2,
  reporter: 'line',
  use: {
    baseURL: 'https://mtt.bratuxa.zomb.top',
    launchOptions: {
      executablePath: '/usr/local/bin/chromium',
      // --disable-quic: HTTP/3 сыпал ERR_QUIC_PROTOCOL_ERROR на больших GLB —
      // preload вис на битом ресурсе и тест валился в «ЗАГРУЗКА БОЯ… 100%»
      args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--no-sandbox', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding', '--disable-quic'],
    },
  },
});
