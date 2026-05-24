import { JSX, PropsWithChildren, useEffect, useEffectEvent, useMemo, useRef } from 'react'

type Props = JSX.IntrinsicElements['div'] & IntersectionObserverInit & {
  disabled?: boolean
  onIntersect(entry: IntersectionObserverEntry): void
}

export function ViewAwareContainer({ children, rootMargin, threshold, root, onIntersect, disabled = false, ...props }: PropsWithChildren<Props>) {
  const containerRef = useRef<HTMLDivElement>(null)

  const observerOptions = useMemo<IntersectionObserverInit>(() => ({
    rootMargin,
    threshold,
    root,
  }), [root, rootMargin, threshold])

  const onInitEvent = useEffectEvent((observerOptions: IntersectionObserverInit, disabled: boolean) => {
    if (disabled) return

    const container = containerRef.current

    if (!container) return

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        onIntersect(entries[0])
      }
    }, observerOptions)

    observer.observe(container)
    return () => observer.disconnect()
  })

  useEffect(() => onInitEvent(observerOptions, disabled), [disabled, observerOptions])

  return (
    <div ref={containerRef} {...props}>
      {children}
    </div>
  )
}
