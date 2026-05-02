import { ESLint } from 'eslint'

/**
 * temporary workaround while react-compiler causes hydration bug due to line-break in classNames
 * - React Compiler Issue: https://github.com/facebook/react/issues/35481
 * - Original proposal workaround: https://github.com/schoero/eslint-plugin-better-tailwindcss/issues/269#issuecomment-3724158959
 */
const classNamesPreferTemplate: ESLint.Plugin = {
  rules: {
    'multiline-classname': {
      meta: {
        type: 'suggestion',
        fixable: 'code',
        schema: [],
      },
      create(context) {
        const escapeForTemplateLiteral = (str: string) =>
          str.replace(/`/g, '\\`').replace(/\$\{/g, '\\${')

        return {
          JSXAttribute(node) {
            if (node.name?.type !== 'JSXIdentifier') return
            if (node.name.name !== 'className') return

            // Only handle: className="...multiline..."
            if (
              node.value?.type === 'Literal' &&
              typeof node.value.value === 'string' &&
              node.value.value.includes('\n')
            ) {
              const raw = node.value.value

              context.report({
                node: node.value,
                message:
                  'Multiline className strings can cause hydration errors. Use a template literal/expression instead.',
                fix(fixer) {
                  const escaped = escapeForTemplateLiteral(raw)
                  return fixer.replaceText(node.value, `{\`${escaped}\`}`)
                },
              })
            }
          },
        }
      },
    },
  },
}

export default classNamesPreferTemplate
