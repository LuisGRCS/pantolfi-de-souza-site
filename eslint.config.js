import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default [
  { ignores: ['dist/', '.vercel/', '.astro/', 'node_modules/'] },
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...astro.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      'no-console': 'error',
    },
  },
];
