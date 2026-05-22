'use client'

import { Progress as ProgressPrimitive, ProgressRootState } from '@base-ui/react/progress'

import { cn } from '~/lib/ui'

function Progress({
  className,
  children,
  value,
  ...props
}: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root
      value={value}
      data-slot="progress"
      className={clsx('flex flex-wrap gap-3', className)}
      {...props}
    >
      {children}
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  )
}

const ProgressTrack = ProgressPrimitive.Track

function ProgressIndicator({
  className,
  ...props
}: ProgressPrimitive.Indicator.Props) {
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      className={clsx('h-full bg-primary transition-all', className)}
      {...props}
    />
  )
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return (
    <ProgressPrimitive.Label
      className={clsx('text-xs font-semibold tracking-wide uppercase', className)}
      data-slot="progress-label"
      {...props}
    />
  )
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return (
    <ProgressPrimitive.Value
      className={clsx(
        'ml-auto text-sm text-muted-foreground tabular-nums',
        className,
      )}
      data-slot="progress-value"
      {...props}
    />
  )
}

export {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
}

function clsx(baseClassName: string, classNameProp?: string | ((state: ProgressRootState) => string | undefined)) {
  return (state: ProgressRootState) => cn(baseClassName, typeof classNameProp === 'string' ? classNameProp : classNameProp?.(state))
}
