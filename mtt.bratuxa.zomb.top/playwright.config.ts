import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 90000,
  retries: 0,
  reporter: 'line',
  use: {
    baseURL: 'https://mtt.bratuxa.zomb.top',
    launchOptions: {
      executablePath: '/usr/local/bin/chromium',
      args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-gpu-sandbox', '--no-sandbox'],
    },
  },
});
