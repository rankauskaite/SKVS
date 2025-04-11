import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import plugin from '@vitejs/plugin-react';

// ⚠️ Backend paleistas be HTTPS, todėl naudok HTTP
const target = 'http://localhost:5153';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [plugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 59917,
    proxy: {
      '^/api': {
        target,
        changeOrigin: true,
        secure: false,
      },
      '^/weatherforecast': {
        target,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
