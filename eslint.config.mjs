import antfu from '@antfu/eslint-config'

const files = [
  'packages/**/*.ts',
  'api/**/*.ts',
  'apps/backend/**/*.ts',
  'apps/designer/**/*.ts',
  'apps/designer/**/*.vue',
]

export default antfu(
  {
    vue: {
      vueVersion: 3,
      sfcBlocks: true,
    },
    formatters: {
      css: true,
    },
  },
  {
    rules: {
      'no-undef': ['error'],
      'no-console': 'warn',
      'semi': [2, 'always'],
      'style/semi': [2, 'always'],
      'curly': ['error', 'multi-line'],
      'vue/no-mutating-props': [
        'error',
        {
          shallowOnly: true,
        },
      ],
    },
    files,
  },
  {
    files: [
      'apps/backend/**/*.spec.ts',
      'apps/backend/**/*.e2e-spec.ts',
    ],
    languageOptions: {
      globals: {
        describe: 'readonly',
        beforeEach: 'readonly',
        it: 'readonly',
        expect: 'readonly',
      },
    },
  },
)
