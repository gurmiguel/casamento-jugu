import { JSX } from 'react'
import Ornament from '~/assets/wedding_ornament.svg'
import { cn } from '~/lib/ui'

export function OrnamentDivider({ svgProps, ...props}: JSX.IntrinsicElements['div'] & { svgProps?: JSX.IntrinsicElements['svg'] }) {
  return (

    <div {...props} className={cn('bg-background py-8', props.className)}>
      <Ornament {...svgProps} className={cn('mx-auto block h-18 drop-shadow-xs', svgProps?.className)} />
    </div>
  )
}
