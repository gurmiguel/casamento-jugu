import { JSX, PropsWithChildren, useMemo } from 'react'
import { useIntersectionObserver } from 'usehooks-ts'

type Props = JSX.IntrinsicElements['div'] & IntersectionObserverInit & {
  disabled?: boolean
  onIntersect(entry: IntersectionObserverEntry): void
}

export function ViewAwareContainer({ children, rootMargin, threshold, root, onIntersect, disabled = false, ...props }: PropsWithChildren<Props>) {
  const observerOptions = useMemo<IntersectionObserverInit>(() => ({
    rootMargin,
    threshold,
    root,
  }), [root, rootMargin, threshold])

  const [containerRef] = useIntersectionObserver({
    initialIsIntersecting: false,
    onChange(_, entry) {
      if (disabled) return

      onIntersect(entry)
    },
    ...observerOptions,
  })

  return (
    <div ref={containerRef} {...props}>
      {children}
    </div>
  )
}
