'use client'

import { DialogRootProps, Dialog as BaseDialog } from '@base-ui/react'
import { createContext, PropsWithChildren, ReactNode, useCallback, useContext, useLayoutEffect, useMemo, useState } from 'react'
import { Dialog, DialogHandle } from '~/components/ui/dialog'

const dialogContext = createContext({} as DialogContext)

export function DialogProvider({ children }: PropsWithChildren) {
  const { dialogs, ...state} = useDialogState()

  useLayoutEffect(() => {
    if (dialogs.length === 0) return

    const last = dialogs[dialogs.length - 1]
    const rest = dialogs.slice(0, dialogs.length - 1)

    rest.forEach(dialog => dialog.handle.close())
    last.handle.open(null)
  }, [dialogs])

  return (
    <dialogContext.Provider value={state}>
      {children}
      {dialogs.map(dialog => (
        <Dialog
          key={dialog.id}
          {...dialog}
          defaultOpen={false}
        />
      ))}
    </dialogContext.Provider>
  )
}

function useDialogState() {
  const [dialogs, setDialogs] = useState(new Array<{id: string, handle: DialogHandle} & Omit<DialogRootProps, 'open'>>())

  const open = useCallback((children: ReactNode, { onClose, handle, ...props}: Omit<DialogRootProps, 'open' | 'onOpenChange' | 'children'> & { id?: string, onClose?: () => void } = {}) => {
    const id = props.id ?? crypto.randomUUID()
    handle ??= BaseDialog.createHandle()
    const dialog: typeof dialogs[number] & { handle: DialogHandle } = {
      id,
      ...props,
      handle,
      children,
      onOpenChangeComplete(open) {
        props.onOpenChangeComplete?.(open)
        if (!open) {
          onClose?.()

          setDialogs(prev => prev.filter(dialog => dialog.id !== id))
        }
      },
    }

    setDialogs(prev => [...prev, dialog])
    return dialog
  }, [])

  const close = useCallback((id: string) => {
    const dialog = dialogs.find(dialog => dialog.id === id)

    dialog?.handle!.close()
  }, [dialogs])

  return useMemo(() => ({
    dialogs,
    open,
    close,
  }), [close, dialogs, open])
}

type DialogContext = Omit<ReturnType<typeof useDialogState>, 'dialogs'>

export function useDialog() {
  return useContext(dialogContext)
}
