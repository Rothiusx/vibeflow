declare module '@vibeflow/eslint-config/base' {
  import type { antfu } from '@antfu/eslint-config'
  export const baseConfig: ReturnType<typeof antfu>
}

declare module '@vibeflow/eslint-config/react' {
  import type { antfu } from '@antfu/eslint-config'
  export const reactConfig: ReturnType<typeof antfu>
}
