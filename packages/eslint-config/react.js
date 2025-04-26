import { antfu } from '@antfu/eslint-config'
import compiler from 'eslint-plugin-react-compiler'
import query from '@tanstack/eslint-plugin-query'
import { baseOptionsConfig, baseLinterConfigs } from './base.js'

/** @type {import('@antfu/eslint-config').OptionsConfig & Omit<import('@antfu/eslint-config').TypedFlatConfigItem, 'files'} */
export const reactOptionsConfig = {
  ...baseOptionsConfig,
  plugins: {
    ...baseOptionsConfig.plugins,
    'react-compiler': compiler,
  },
  react: {
    overrides: {
      'react/no-array-index-key': 'off',
      'react-hooks-extra/no-direct-set-state-in-use-effect': 'off',
      'react-compiler/react-compiler': 'error',
    },
  },
}

/** @type {import("eslint").Linter.Config} */
export const reactLinterConfigs = [
  ...query.configs['flat/recommended'],
  {
    files: ['src/components/ui/**/*.tsx'],
    rules: {
      'ts/strict-boolean-expressions': 'off',
      'react/no-unstable-context-value': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
  ...baseLinterConfigs,
]

export const reactConfig = antfu(reactOptionsConfig, ...reactLinterConfigs)
