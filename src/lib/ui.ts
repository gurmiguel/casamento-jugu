import { cx } from 'class-variance-authority'
import { ClassNameValue, extendTailwindMerge } from 'tailwind-merge'

const twMerge = extendTailwindMerge({})

export const cn = (...classValues: ClassNameValue[]) => {
  return twMerge(cx(classValues))
}
