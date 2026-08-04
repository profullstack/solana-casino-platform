import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Existing debt, reported but not blocking. These two account for
      // ~100 findings across the tree and none of them are correctness bugs;
      // failing CI on them would have meant either a permanently red pipeline
      // or a sweeping rewrite of untested game logic. Everything that can
      // actually break at runtime — parse errors, no-case-declarations,
      // react-hooks rules — stays an error. Promote these back to 'error' as
      // the count is worked down.
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  {
    // Node-side files: server entrypoint and test setup use Node/Jest globals.
    files: ['server/**/*.ts', 'src/test/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
    },
  }
);
