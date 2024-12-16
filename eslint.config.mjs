import antfu from '@antfu/eslint-config'

const files = [
  'packages/**/*.ts',
  'api/**/*.ts',
  'apps/backend/**/*.ts',
  'apps/designer/**/*.{ts, mts}',
  'apps/designer/**/*.vue',
  'docs/**/*.md',
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
    languageOptions: {
      globals: {
        API: 'readonly',
      },
    },
    rules: {
      'no-undef': ['error'],
      'no-console': ['error', { allow: ['error', 'warn'] }],
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
      'apps/backend/**/*.ts',
    ],
    languageOptions: {
      globals: {
        process: 'readonly',
      },
    },
    rules: {
      'ts/consistent-type-imports': ['error', { prefer: 'no-type-imports' }],
    },
  },
  {
    files: [
      'apps/backend/**/*.spec.ts',
      'apps/backend/**/*.e2e-spec.ts',
    ],
    languageOptions: {
      globals: {
        process: 'readonly',
        jest: 'readonly',
        describe: 'readonly',
        beforeEach: 'readonly',
        it: 'readonly',
        expect: 'readonly',
      },
    },
  },
)
