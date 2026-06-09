import { cva, type VariantProps } from 'class-variance-authority'
import { JSX } from 'react'

const dotsVariants = cva('rounded-full bg-secondary animate-bounce', {
  variants: {
    size: {
      lg: 'size-3',
      md: 'size-2',
      sm: 'size-1',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})

type DotsVariantsProps = VariantProps<typeof dotsVariants>

const wrapperVariants = cva('flex items-center justify-center', {
  variants: {
    size: {
      lg: 'gap-4',
      md: 'gap-2',
      sm: 'gap-1',
    },
  },
  defaultVariants: {
    size: 'lg',
  },
})

type Props = JSX.IntrinsicElements['div'] & {
  amount?: number
  dotClassName?: string
} & DotsVariantsProps

export function JumpingDotsLoader({ amount = 3, className, dotClassName, size = 'lg', ...props }: Props) {
  return (
    <div className={wrapperVariants({ size, className })} {...props}>
      {[...Array(amount)].map((_, i) => (
        <div
          key={i}
          className={dotsVariants({ size, className: dotClassName })}
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
