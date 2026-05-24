import { ComponentProps, FC, Suspense } from 'react'
import { JumpingDotsLoader } from '~/components/ui/jumping-dots'

export const DefaultFallback = () =>
  <div className={`
    fixed inset-0 flex items-center justify-center
    animate-in fade-in duration-500 delay-1000
  `} style={{ animationFillMode: 'both' }}>
    <JumpingDotsLoader dotClassName="size-6" className="gap-6" />
  </div>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withSuspense<T extends React.ComponentType<any>>(Component: T, fallback?: React.ReactNode) {
  const Wrapped: FC<ComponentProps<T>> = (props) =>
    <Suspense fallback={fallback ?? <DefaultFallback />}>{<Component {...props} />}</Suspense>

  Wrapped.displayName = `Suspended_${Component.displayName ?? Component.name}`

  return Wrapped
}
