import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 90000,
  retries: 0,
  // 4 ядра: 2 воркера с 60-фпс играми давали load 6 и роняли rAF до ~13 fps —
  // плодили флаки (glide, замах, синхрон). Один воркер — кадры ровные
  workers: 1,
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
