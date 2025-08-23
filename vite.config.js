import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Remove `base` unless you're deploying to a subpath
  base: '/', // ✅ Default — serves from root

  plugins: [react()],

  // Optional: Add build settings
  build: {
    outDir: 'dist', // ✅ Vercel expects this
    sourcemap: true,
  },

  // Only used in dev (localhost)
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});