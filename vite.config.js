// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/',

  plugins: [
    react({
      // Enable JSX transform
      jsx: 'automatic',
    }),
  ],

  build: {
    outDir: 'dist',
    sourcemap: true,
  },

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

  // ✅ Critical Fix: Handle .js files with JSX
  optimizeDeps: {
    include: ['react', 'react-dom'],
    esbuildOptions: {
      loader: {
        '.js': 'jsx', // ← This is key
      },
      // Ensure .js files are resolved correctly
      resolveExtensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
  },

  // ✅ Add resolve to help Vite recognize file extensions
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
});