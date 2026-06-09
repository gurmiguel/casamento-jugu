'use client'

import { Separator as SeparatorPrimitive, type SeparatorState } from '@base-ui/react/separator'

import { cn } from '~/lib/ui'

function Separator({
  className,
  orientation = 'horizontal',
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={clsx(
        `
          shrink-0 bg-border
          data-horizontal:h-px data-horizontal:w-full
          data-vertical:w-px data-vertical:self-stretch
        `,
        className,
      )}
      {...props}
    />
  )
}

function clsx(baseClassName: string, classNameProp?: string | ((state: SeparatorState) => string | undefined)) {
  return (state: SeparatorState) => cn(baseClassName, typeof classNameProp === 'string' ? classNameProp : classNameProp?.(state))
}

export { Separator }
