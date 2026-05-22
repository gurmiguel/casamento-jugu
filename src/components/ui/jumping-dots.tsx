import { JSX } from 'react'
import { cn } from '~/lib/ui'

type Props = JSX.IntrinsicElements['div'] & {
  amount?: number
  dotClassName?: string
}

export function JumpingDotsLoader({ amount = 3, className, dotClassName, ...props }: Props) {
  return (
    <div className={cn('flex items-center justify-center gap-4', className)} {...props}>
      {[...Array(amount)].map((_, i) => (
        <div
          key={i}
          className={cn('size-3 animate-bounce rounded-full bg-secondary', dotClassName)}
          style={{
            animationFillMode: 'both',
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.6s',
            animationTimingFunction: 'ease-in-out',
          }}
        />
      ))}
    </div>
  )
}
