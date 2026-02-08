import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  // ignore build output
  { ignores: ['dist/**', 'node_modules/**'] },

  // base JS recommended
  js.configs.recommended,

  // TS/TSX parsing + sensible rules (not overly strict)
  ...tseslint.configs.recommended,

  // React / JSX basics
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // Hooks correctness
      ...reactHooks.configs.recommended.rules,

      // Vite HMR safety
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Keep it practical
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',

      // TS recommended includes no-unused-vars; it can be noisy with leading underscores
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // React 17+ JSX transform: don’t require React in scope
      'react/react-in-jsx-scope': 'off',
    },
  },
];
