import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import tailwindcss from 'eslint-plugin-better-tailwindcss'
import { defineConfig, globalIgnores } from 'eslint/config'
import classNamesPreferTemplate from './src/lib/eslint/classnames-prefer-template'

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    ...tailwindcss.configs['recommended-warn'],
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/app/globals.css',
      },
    },
    rules: {
      'better-tailwindcss/no-unknown-classes': 'off',
      'better-tailwindcss/enforce-consistent-variant-order': ['warn'],
      'better-tailwindcss/enforce-consistent-line-wrapping': ['warn', {
        printWidth: 0,
        classesPerLine: 5,
        preferSingleLine: true,
      }],
    },
  },
  {
    plugins: {
      'classnames-prefer-template': classNamesPreferTemplate,
    },
    rules: {
      'classnames-prefer-template/multiline-classname': ['error'],
    },
  },
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
