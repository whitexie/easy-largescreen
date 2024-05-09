import antfu from '@antfu/eslint-config'

const files = [
  'api/**/*.ts',
  'packages/designer/**/*.ts',
  'packages/designer/**/*.vue',
  'packages/core/**/*.ts',
  'packages/core/**/*.vue',
  'packages/core/**/*.tsx',
]

export default antfu({
  vue: {
    vueVersion: 3,
    sfcBlocks: true,
  },
  formatters: {
    css: true,
  },
  files,
}, {
  rules: {
    'no-undef': ['error'],
    'no-console': 'warn',
    'semi': [2, 'always'],
    'style/semi': [2, 'always'],
    'vue/no-mutating-props': [
      'error',
      {
        shallowOnly: true,
      },
    ],
    'curly': ['error', 'all'],
  },
  files,
})
