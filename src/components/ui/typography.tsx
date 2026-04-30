import { JSX } from 'react'
import { cn } from '~/lib/ui'

export const H1 = (props: JSX.IntrinsicElements['h1']) => <h1 {...props} className={cn('text-4xl leading-8 lg:text-6xl lg:leading-12 -tracking-wider', props.className)} />
export const H2 = (props: JSX.IntrinsicElements['h2']) => (
  <h2 {...props} className={cn('relative text-4xl font-medium tracking-tight', props.className)}>
    {props.children}
    <span className="absolute abs-center-x top-full mt-2 opacity-40 w-20 h-px bg-[currentColor]" />
  </h2>
)
export const H3 = (props: JSX.IntrinsicElements['h3']) => <h3 {...props} className={cn('', props.className)} />
export const H4 = (props: JSX.IntrinsicElements['h4']) => <h4 {...props} className={cn('text-xl lg:text-2xl leading-tight', props.className)} />
export const P = (props: JSX.IntrinsicElements['p']) => <p {...props} className={cn('', props.className)} />
