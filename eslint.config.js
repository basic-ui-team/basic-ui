import js from '@eslint/js';
import globals from 'globals';
import reactPlugin from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist', 'build', 'coverage', 'node_modules', '.next'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'react-hooks/exhaustive-deps': 'warn',
    },
    plugins: {
      'react-hooks': reactPlugin,
      'react-refresh': reactRefresh,
    },
  },
];
