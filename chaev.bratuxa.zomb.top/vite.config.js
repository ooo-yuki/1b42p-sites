import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  test: {
    include: ['tests/**/*.test.{js,ts}'],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:8092',
    },
  },
});
