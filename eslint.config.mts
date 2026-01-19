import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      'semi': ['warn', 'never'],
      'indent': ['error', 2, {
        SwitchCase: 1,
      }],
      'comma-dangle': ['warn', 'always-multiline'],
      'comma-spacing': ['warn', { before: false, after: true }],
      'quotes': ['error', 'single'],
      'eol-last': ['error', 'always'],
      'jsx-quotes': ['warn', 'prefer-double'],
      'key-spacing': ['warn', {
        beforeColon: false,
        afterColon: true,
        mode: 'strict',
      }],
      'no-multi-spaces': ['warn', {
        ignoreEOLComments: true,
      }],
      'no-multiple-empty-lines': ['warn', {
        max: 1,
        maxBOF: 2,
        maxEOF: 0,
      }],
      'no-trailing-spaces': ['warn'],
      'quote-props': ['error', 'consistent-as-needed', {
        numbers: true,
      }],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
])

export default eslintConfig
