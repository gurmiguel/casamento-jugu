'use client'

import { Checkbox as CheckboxPrimitive, CheckboxRootState } from '@base-ui/react/checkbox'

import { cn } from '~/lib/ui'
import { CheckIcon } from 'lucide-react'

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={clsx(
        `
          peer relative flex size-4.5 shrink-0
          bg-white items-center justify-center rounded-xs border
          border-input transition-shadow outline-none
          group-has-disabled/field:opacity-50
          after:absolute after:-inset-x-3 after:-inset-y-2
          focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30
          disabled:cursor-not-allowed disabled:opacity-50
          aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20
          aria-invalid:aria-checked:border-primary
          data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground
        `,
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon
        />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }

function clsx(baseClassName: string, classNameProp?: string | ((state: CheckboxRootState) => string | undefined)) {
  return (state: CheckboxRootState) => cn(baseClassName, typeof classNameProp === 'string' ? classNameProp : classNameProp?.(state))
}
