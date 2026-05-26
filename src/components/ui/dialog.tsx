'use client'

import * as React from 'react'
import { DialogDescriptionState, DialogPopupState, Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import { cn } from '~/lib/ui'
import { Button } from '~/components/ui/button'
import { XIcon } from 'lucide-react'

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={clsx(
        `
          fixed inset-0 isolate z-50 bg-black/20
          duration-100
          supports-backdrop-filter:backdrop-blur-sm
          data-open:animate-in data-open:fade-in-0
          data-closed:animate-out data-closed:fade-out-0
        `,
        className,
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={clsx(
          `
            fixed top-1/2 left-1/2 z-50 grid
            w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6
            bg-popover text-sm text-popover-foreground shadow-md ring-1
            ring-foreground/10 duration-100 outline-none
            sm:max-w-md
            rounded-md
            data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95
            data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95
          `,
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-2 right-2 rounded-full"
                size="icon-sm"
              />
            }
          >
            <XIcon
            />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn('flex flex-col gap-2 p-4 rounded-t-md', className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  showCloseButton?: boolean
}) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        `
          flex flex-col-reverse gap-2 border-t bg-muted/20
          p-4 rounded-b-md
          sm:flex-row sm:justify-end
        `,
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="outline" />}>
          Close
        </DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={clsx(
        'text-lg leading-none font-semibold tracking-wider uppercase',
        className,
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={clsx(
        `
          mt-2 text-sm leading-none text-muted-foreground
          *:[a]:underline *:[a]:underline-offset-3
          *:[a]:hover:text-foreground
        `,
        className,
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}

export const createHandle = DialogPrimitive.createHandle.bind(DialogPrimitive)

export type DialogHandle<T = unknown> = DialogPrimitive.Handle<T>

function clsx<T extends DialogPopupState | DialogDescriptionState>(baseClassName: string, classNameProp?: string | ((state: T) => string | undefined)) {
  return (state: T) => cn(baseClassName, typeof classNameProp === 'string' ? classNameProp : classNameProp?.(state))
}
