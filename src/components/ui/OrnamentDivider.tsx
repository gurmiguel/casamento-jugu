import { JSX } from 'react'
import Ornament from '~/assets/wedding_ornament.svg'
import { cn } from '~/lib/ui'

export function OrnamentDivider({ svgProps, ...props}: JSX.IntrinsicElements['div'] & { svgProps?: JSX.IntrinsicElements['svg'] }) {
  return (

    <div {...props} className={cn('py-8 bg-background', props.className)}>
      <Ornament {...svgProps} className={cn('block h-18 mx-auto drop-shadow-xs', svgProps?.className)} />
    </div>
  )
}
