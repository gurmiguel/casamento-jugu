import { cx } from 'class-variance-authority'
import { ClassNameValue, extendTailwindMerge } from 'tailwind-merge'

export const twMerge = extendTailwindMerge({})

export const cn = (...classValues: ClassNameValue[]) => {
  return twMerge(cx(classValues))
}

export function isElementInViewport(element: HTMLElement, viewport: Window | HTMLElement = window) {
  const rect = element.getBoundingClientRect()

  const vwHeight = viewport instanceof Window
    ? viewport.innerHeight
    : viewport.offsetHeight
  const vwWidth = viewport instanceof Window
    ? viewport.innerWidth
    : viewport.offsetWidth

  return (
    rect.top < vwHeight &&
    rect.bottom > 0 &&
    rect.left < vwWidth &&
    rect.right > 0
  )
}
