import { defineConfig } from '@playwright/test';

// Локально: channel chrome (Chrome уже установлен). На сервере: CHROME_BIN=/usr/local/bin/chromium.
const bin = process.env.CHROME_BIN;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 90000,
  retries: 0,
  workers: 1,
  reporter: 'line',
  use: {
    baseURL: process.env.BASE_URL || 'http://127.0.0.1:8096',
    ...(bin
      ? {
          launchOptions: {
            executablePath: bin,
            args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
          },
        }
      : { channel: 'chrome' }),
  },
});
