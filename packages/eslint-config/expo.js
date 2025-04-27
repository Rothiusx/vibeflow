import { antfu } from '@antfu/eslint-config'
import { reactOptionsConfig, reactLinterConfigs } from './react.js'

/** @type {import('@antfu/eslint-config').OptionsConfig & Omit<import('@antfu/eslint-config').TypedFlatConfigItem, 'files'} */
export const expoOptionsConfig = {
  ...reactOptionsConfig,
  plugins: {
    ...reactOptionsConfig.plugins,
  },
  typescript: {
    ...reactOptionsConfig.typescript,
    overridesTypeAware: {
      ...reactOptionsConfig.typescript.overridesTypeAware,
      'ts/no-require-imports': 'off',
      'ts/no-use-before-define': 'off',
    },
  },
  react: {
    overrides: {
      ...reactOptionsConfig.react.overrides,
    },
  },
  rules: {
    'node/prefer-global/process': 'off',
  },
}

/** @type {import("eslint").Linter.Config} */
export const expoLinterConfigs = [...reactLinterConfigs]

export const expoConfig = antfu(expoOptionsConfig, ...expoLinterConfigs)
