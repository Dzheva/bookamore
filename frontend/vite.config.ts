import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: true,
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      port: 3000,
      host: 'localhost',
    },
    proxy: {
      '/api/v1': {
        target: 'https://bookamore-dev.alt-web.biz.ua',
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader(
              'Origin',
              'https://bookamore-dev.alt-web.biz.ua'
            );
          });
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@app': path.resolve(__dirname, './src/app'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@types': path.resolve(__dirname, './src/types'),
      '@store': path.resolve(__dirname, './src/store'),
      '@api': path.resolve(__dirname, './src/store/api'),
    },
  },
});
