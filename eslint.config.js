import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';

/**
 * Lint configuration.
 *
 * The repository had no linter (AUDIT.md §M8). The rules below are chosen to
 * catch the specific defects that actually shipped, not to enforce taste:
 *
 * - `react-hooks/exhaustive-deps` as an ERROR. The dashboard's infinite render
 *   loop (§C1) was a missing/unstable dependency. This rule would have caught
 *   it before it reached a browser.
 * - `jsx-a11y` recommended. Five modals with no dialog role, seven
 *   `<div onClick>` handlers and a missing skip link (§C6, §M6) are all
 *   mechanically detectable.
 * - `no-explicit-any` as an ERROR. `handleOpenItemDetail(item: any)` is how
 *   the structural `'lessonsCount' in item` probes got past review (§M8).
 */
export default tseslint.config(
  { ignores: ['dist', 'tests/.build', 'node_modules'] },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.es2022 },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      'react-hooks/exhaustive-deps': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // Dead links were a recurring bug: seven `href="#"` anchors that looked
      // interactive and did nothing.
      'jsx-a11y/anchor-is-valid': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',

      eqeqeq: ['error', 'smart'],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  {
    /**
     * Context providers legitimately export both a component and its hook.
     * Splitting `useTheme` out of ThemeProvider.tsx to satisfy Fast Refresh
     * would scatter one cohesive unit across two files for a dev-server
     * convenience. Co-location wins; the warning is scoped off here rather
     * than globally so it still applies everywhere else.
     */
    files: [
      'src/theme/ThemeProvider.tsx',
      'src/store/StoreProvider.tsx',
      'src/components/ui/Toast.tsx',
    ],
    rules: { 'react-refresh/only-export-components': 'off' },
  },

  {
    /**
     * `media-has-caption` cannot see caption tracks rendered from an array,
     * which is how the player emits them (`lesson.captions.map(...)`).
     *
     * The support is real — see `CaptionTrack` in src/types.ts — but the
     * catalogue has no .vtt files yet. Transcribing the lessons is a launch
     * requirement, not optional polish: captions are what make a lesson usable
     * on mute, in a noisy shop, and by deaf learners. Track it, don't forget
     * it because a lint rule went quiet.
     */
    files: ['src/pages/PlayerPage.tsx', 'src/pages/CourseDetailPage.tsx'],
    rules: { 'jsx-a11y/media-has-caption': 'off' },
  },

  {
    files: ['tests/**/*.mjs', '*.config.{ts,js,mjs}'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'no-console': 'off' },
  },
);
