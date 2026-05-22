
'use client'

import { BanIcon, Loader2Icon, Trash2Icon } from 'lucide-react'
import { useEffect, useEffectEvent, useState } from 'react'
import { useDialog } from '~/components/Dialog/context'
import { Button } from '~/components/ui/button'
import { createHandle, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader } from '~/components/ui/dialog'
import { PreloadedImage } from '~/components/ui/preloaded-image'
import { H4 } from '~/components/ui/typography'
import { removeImage } from '../actions'

export type SelectedPhoto = google.PickerMediaItem & {
  downloaded?: { url: string, blob: Blob } | Error
}

type UploadedPhoto = {
  id: number,
  providerId: string | null,
  path: string,
}

type PickerPhoto = SelectedPhoto | UploadedPhoto

interface Props {
  photo: PickerPhoto
  onRemove(id: number, onFinish: ()=> Promise<void>): void
}

export function GalleryImage({ photo, onRemove }: Props) {
  const dialog = useDialog()

  const [isDeleting, setIsDeleting] = useState(false)
  const [state, setState] = useState<'loading' | 'loaded'>('loading')

  const uploadedPhoto = typeof photo.id === 'number' ? photo as UploadedPhoto : null
  const selectedPhoto = typeof photo.id === 'string' ? photo as SelectedPhoto : null

  const downloaded = selectedPhoto?.downloaded instanceof Error ? null : selectedPhoto?.downloaded

  const url = downloaded?.url ?? uploadedPhoto?.path ?? ''
  const filename = selectedPhoto?.mediaFile.filename ?? uploadedPhoto?.providerId

  const onImageChangeEvent = useEffectEvent((_url: string | undefined) => {
    if (state === 'loading') return

    setState('loading')
  })

  useEffect(() => {
    onImageChangeEvent(url)
  }, [url])

  async function handleRemovePhoto() {
    const { id } = photo
    if (typeof id !== 'number') return

    const handle = createHandle()
    const confirmed = await new Promise<boolean>(res => dialog.open((
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogDescription><H4 as="span">Deseja realmente remover esta foto?</H4></DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancelar</Button>} />
          <Button variant="destructive" className="bg-transparent border-destructive" onClick={() => res(true)}>Remover</Button>
        </DialogFooter>
      </DialogContent>
    ), {
      handle,
      onClose: () => res(false),
    }))

    if (!confirmed) return

    handle.close()

    onRemove(id, () => new Promise(async res => {
      setIsDeleting(true)
      await removeImage(id)
      res()
    }))
  }

  if (selectedPhoto?.downloaded instanceof Error)
    return <BanIcon className="size-14" />

  return (
    <div className="relative">
      <PreloadedImage src={url} alt={filename ?? ''}
        loading="lazy"
        data-removing={isDeleting}
        className="object-cover h-80 transition-all data-[removing=true]:grayscale-75 data-[removing=true]:scale-95"
        onLoad={() => setState('loaded')}
      />
      {state === 'loaded' && uploadedPhoto && (
        <Button variant="ghost"
          size="icon-sm"
          className={'absolute rounded-full top-0 right-0'}
          onClick={() => handleRemovePhoto()}
          disabled={isDeleting}
        >{isDeleting
            ? <Loader2Icon className="animate-spin" />
            : <Trash2Icon color="var(--destructive)" className="drop-shadow-xs drop-shadow-black/40" />}</Button>
      )}
    </div>
  )
}
