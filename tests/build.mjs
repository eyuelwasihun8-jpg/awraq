/** Bundles the JSDOM test harness. Output is gitignored. */
import { build } from 'esbuild';

await build({
  entryPoints: ['tests/harness-entry.tsx'],
  outfile: 'tests/.build/bundle.js',
  bundle: true,
  format: 'iife',
  jsx: 'automatic',
  target: 'es2022',
  logLevel: 'error',
  define: { 'process.env.NODE_ENV': '"development"' },
});
