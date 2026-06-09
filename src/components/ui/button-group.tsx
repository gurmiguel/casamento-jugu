import { mergeProps } from '@base-ui/react/merge-props'
import { useRender } from '@base-ui/react/use-render'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '~/lib/ui'
import { Separator } from '~/components/ui/separator'
import type { SeparatorState } from '@base-ui/react'

const buttonGroupVariants = cva(
  `
    flex w-fit items-stretch
    *:focus-visible:relative *:focus-visible:z-10
    has-[>[data-slot=button-group]]:gap-2
    *:data-[slot=input]:px-4
    has-[>[data-variant=outline]]:*:data-[slot=input-group]:border-border has-[>[data-variant=outline]]:*:data-[slot=input-group]:px-2.5
    has-[>[data-variant=outline]]:*:data-[slot=select-trigger]:border-border
    has-[>[data-variant=outline]]:*:[[role=combobox]]:px-2.5
    has-[>[data-variant=outline]]:[&>[data-slot=input-group]:has(:focus-visible)]:border-ring
    has-[>[data-variant=outline]]:[&>[data-slot=select-trigger]:focus-visible]:border-ring
    has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-none
    [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit
    [&>input]:flex-1
    has-[>[data-variant=outline]]:[&>input]:border-border
    has-[>[data-variant=outline]]:[&>input:focus-visible]:border-ring
  `,
  {
    variants: {
      orientation: {
        horizontal:
          '[&>[data-slot]~[data-slot]]:border-l-0',
        vertical:
          'flex-col [&>[data-slot]~[data-slot]]:border-t-0',
      },
      rounded: {
        false: '',
        true: '',
        full: '',
      },
    },
    compoundVariants: [
      {
        orientation: 'horizontal',
        rounded: true,
        className: 'rounded [&>[data-slot]:first-child]:rounded-l-sm [&>[data-slot]:last-child]:rounded-r-sm',
      },
      {
        orientation: 'horizontal',
        rounded: 'full',
        className: 'rounded [&>[data-slot]:first-child]:rounded-l-full [&>[data-slot]:last-child]:rounded-r-full',
      },
      {
        orientation: 'vertical',
        rounded: true,
        className: 'rounded [&>[data-slot]:first-child]:rounded-t-sm [&>[data-slot]:last-child]:rounded-b-sm',
      },
      {
        orientation: 'vertical',
        rounded: 'full',
        className: 'rounded [&>[data-slot]:first-child]:rounded-t-full [&>[data-slot]:last-child]:rounded-b-full',
      },
    ],
    defaultVariants: {
      orientation: 'horizontal',
      rounded: false,
    },
  },
)

function ButtonGroup({
  className,
  orientation,
  rounded = false,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation, rounded }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<'div'>) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>(
      {
        className: cn(
          `
            flex items-center gap-2 border border-transparent
            border-b-input bg-transparent px-2.5 text-xs font-semibold
            uppercase
            group-has-[>[data-variant=outline]]/button-group:border-border
            [&_svg]:pointer-events-none
            [&_svg:not([class*='size-'])]:size-3.5
          `,
          className,
        ),
      },
      props,
    ),
    render,
    state: {
      slot: 'button-group-text',
    },
  })
}

function ButtonGroupSeparator({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={clsx(
        `
          relative self-stretch bg-input
          data-horizontal:mx-px data-horizontal:w-auto
          data-vertical:my-px data-vertical:h-auto
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

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
