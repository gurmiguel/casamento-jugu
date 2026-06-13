'use client'

import * as React from 'react'
import { Popover as PopoverPrimitive, type PopoverPopupState, type PopoverTitleState } from '@base-ui/react/popover'

import { cn } from '~/lib/ui'

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({ delay = 100, ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} delay={delay} />
}

function PopoverContent({
  className,
  align = 'center',
  alignOffset = 0,
  side = 'top',
  sideOffset = 6,
  children,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    'align' | 'alignOffset' | 'side' | 'sideOffset'
  >) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={clsx(
            `
              z-50 inline-flex w-fit max-w-xs origin-(--transform-origin)
              items-center gap-1.5 rounded-none bg-foreground px-3
              py-1.5 text-sm text-background
              has-data-[slot=kbd]:pr-1.5
              data-[side=bottom]:slide-in-from-top-2
              data-[side=inline-end]:slide-in-from-left-2
              data-[side=inline-start]:slide-in-from-right-2
              data-[side=left]:slide-in-from-right-2
              data-[side=right]:slide-in-from-left-2
              data-[side=top]:slide-in-from-bottom-2
              **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-none
              data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95
              data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95
              data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95
              font-sans
            `,
            className,
          )}
          {...props}
        >
          {children}
          <PopoverPrimitive.Arrow className={`
            z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-none
            bg-foreground fill-foreground
            data-[side=bottom]:top-1
            data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:translate-x-[1.5px] data-[side=inline-end]:-translate-y-1/2
            data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:translate-x-[-1.5px] data-[side=inline-start]:-translate-y-1/2
            data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2
            data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2
            data-[side=top]:-bottom-2.5
          `}/>
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  )
}

function PopoverHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="popover-header"
      className={cn('flex flex-col gap-1 text-sm', className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return (
    <PopoverPrimitive.Title
      data-slot="popover-title"
      className={clsx('text-xs font-semibold uppercase', className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: PopoverPrimitive.Description.Props) {
  return (
    <PopoverPrimitive.Description
      data-slot="popover-description"
      className={clsx(
        'mt-0.5 text-sm leading-relaxed text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

function clsx<T extends PopoverTitleState | PopoverPopupState>(baseClassName: string, classNameProp?: string | ((state: T) => string | undefined)) {
  return (state: T) => cn(baseClassName, typeof classNameProp === 'string' ? classNameProp : classNameProp?.(state))
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
