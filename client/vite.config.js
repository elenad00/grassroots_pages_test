import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
    },
    server: {
      host: "127.0.0.1",
      port: 3000,
      proxy: {
        "/api/v1": "http://127.0.0.1:8080"
      }
    },
    plugins: [react()],
  };
});