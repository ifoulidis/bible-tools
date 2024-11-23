import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import svelte from 'eslint-plugin-svelte'
import unusedImports from 'eslint-plugin-unused-imports'
import globals from 'globals'
import ts from 'typescript-eslint'

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // TS config
  {
    files: ['**/*.ts'],
    plugins: { '@typescript-eslint': ts.plugin },
    languageOptions: {
      parser: ts.parser,
      parserOptions: { project: true },
    },
  },
  js.configs.recommended,
  // Include the non-type-info configs for all files (for JS and Svelte)
  ...ts.configs.strict,
  // Include the rules that require type info for TS files only
  ...ts.configs.strictTypeChecked.map(config => ({
    ...config,
    files: ['**/*.ts'],
  })),
  // We use TS config only for TS files
  ...ts.configs.stylisticTypeChecked.map(config => ({
    ...config,
    files: ['**/*.ts'],
  })),
  ...svelte.configs['flat/recommended'],
  prettier,
  ...svelte.configs['flat/prettier'],
  // Custom rules for all files
  {
    rules: {
      'object-shorthand': 'error',
    },
  },
  // Custom rules in TS files only
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': [
        'error',
        // Can plausibly compare to false but can't compare to true as it's truthy
        { allowComparingNullableBooleansToTrue: false },
      ],
    },
  },
  // More config
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // Custom rules for TS and Svelte files
  // Can include TS ESLint rules, just not the ones that require type info
  {
    files: ['**/*.ts', '**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
    plugins: { 'unused-imports': unusedImports },
    rules: {
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
    },
  },
  { ignores: ['build/', '.svelte-kit/', 'dist/'] },
]
