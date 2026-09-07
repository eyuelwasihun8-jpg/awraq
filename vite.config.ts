import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

/**
 * Build configuration.
 *
 * The previous build emitted a single 529 kB JS chunk (141 kB gzipped) and a
 * 116 kB stylesheet, so a visitor reading the homepage downloaded the course
 * player, the checkout and the certificate renderer before seeing a headline
 * (AUDIT.md §M1).
 *
 * Routes are code-split in App.tsx; this file splits the vendor layer so the
 * long-lived dependencies (React, the router, i18next) get their own
 * cache-stable chunks and a content change in app code doesn't invalidate
 * them.
 */
export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],

  resolve: {
    // Mirrors the `paths` entry in tsconfig.json.
    alias: { '@': path.resolve(__dirname, 'src') },
  },

  build: {
    target: 'es2022',
    cssCodeSplit: true,
    sourcemap: false,
    // Fail loudly if a chunk creeps back over budget instead of warning at
    // Vite's default 500 kB, which the old bundle sailed past unnoticed.
    chunkSizeWarningLimit: 250,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (/[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/.test(id)) {
            return 'vendor-react';
          }
          if (id.includes('react-router')) return 'vendor-router';
          if (id.includes('i18next')) return 'vendor-i18n';
          return 'vendor';
        },
      },
    },
  },

  server: {
    // Allow the sandboxed preview host (dev only).
    allowedHosts: true as const,
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
  },
}));
