import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ['.cache/', '.git/', '.github/', 'node_modules'],
  },
  {
    languageOptions: {
      globals: globals.node,
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prefer-const': 'error',
      'prettier/prettier': ['error'],
    },
  },
  eslintConfigPrettier,
  pluginJs.configs.recommended,
];
