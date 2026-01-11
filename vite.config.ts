import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Polyfill process.env để code cũ (dùng process.env.API_KEY) hoạt động được trên trình duyệt
      'process.env': {
        API_KEY: JSON.stringify(env.API_KEY || "AIzaSyCsxDe3_34RPDtzT7uSWubg6PDiAtZaxiE"),
        DATABASE_URL: JSON.stringify(env.DATABASE_URL)
      }
    },
    build: {
      outDir: 'dist',
    }
  };
});