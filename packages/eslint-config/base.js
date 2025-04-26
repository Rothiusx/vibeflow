import { antfu } from '@antfu/eslint-config'
import turbo from 'eslint-config-turbo/flat'
import prettier from 'eslint-plugin-prettier/recommended'

/** @type {import('@antfu/eslint-config').OptionsConfig & Omit<import('@antfu/eslint-config').TypedFlatConfigItem, 'files'} */
export const baseOptionsConfig = {
  formatters: true,
  javascript: {
    overrides: {
      'no-console': 'off',
    },
  },
  typescript: {
    tsconfigPath: './tsconfig.json',
    overridesTypeAware: {
      'ts/no-floating-promises': 'off',
      'ts/no-misused-promises': 'off',
      'ts/prefer-nullish-coalescing': [
        'error',
        {
          ignorePrimitives: true,
        },
      ],
      'ts/strict-boolean-expressions': 'off',
      'ts/switch-exhaustiveness-check': [
        'error',
        {
          considerDefaultExhaustiveForUnions: true,
        },
      ],
    },
  },
  rules: {
    'antfu/consistent-chaining': 'off',
  },
  ignores: ['node_modules', 'dist'],
}

/** @type {import("eslint").Linter.Config} */
export const baseLinterConfigs = [
  ...turbo,
  {
    files: ['package.json', 'tsconfig.json'],
    rules: {
      'jsonc/sort-keys': 'off',
    },
  },
  {
    files: ['**/*.{ts,tsx,mjs,js,json}'],
    ...prettier,
  },
]

export const baseConfig = antfu(baseOptionsConfig, ...baseLinterConfigs)
