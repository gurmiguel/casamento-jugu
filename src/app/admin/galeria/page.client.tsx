
'use client'

import type { UploadResponse } from 'cloudinary/client'
import { Loader2Icon } from 'lucide-react'
import { useEffect, useEffectEvent, useRef, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Progress, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue } from '~/components/ui/progress'
import { H4, H5, P, Strong } from '~/components/ui/typography'
import { useAuth } from '~/contexts/auth/auth.context'
import { useLocalStorage } from '~/hooks/use-local-storage'
import { getImageUploadSignedUrl, refreshImages, saveUploadedImages } from './actions'
import { GalleryImage, SelectedPhoto } from './components/gallery-image'

interface Props {
  storedImages: { id: number, providerId: string | null, path: string }[]
}

export default function GalleryPageComponent({ storedImages }: Props) {
  const { auth } = useAuth()
  const [pickerSession, setPickerSession] = useLocalStorage<google.PickingSession | null>('picker-session')
  const [selectedPhotos, setSelectedPhotos] = useState<Array<SelectedPhoto> | null>(null)
  const [isStartingSession, startSessionTransition] = useTransition()
  const [isSubmitting, startSubmission] = useTransition()
  const [uploadedCount, setUploadedCount] = useState(0)

  const photos = selectedPhotos ?? storedImages

  const showStoredImages = pickerSession === null && selectedPhotos === null && storedImages.length > 0

  const downloadedCount = selectedPhotos?.filter(p => p.downloaded).length ?? 0
  const hasFinishedSelection = (selectedPhotos?.length ?? 0) > 0
  const hasFinishedDownloading = downloadedCount === selectedPhotos?.length

  useEffect(() => {
    // expire pickerSession
    if (isSessionExpired(pickerSession))
      setPickerSession(null)
  }, [pickerSession, setPickerSession])

  const initSessionPolling = useEffectEvent((session: google.PickingSession | null | undefined, hasFinishedSelection: boolean) => {
    if (!session || hasFinishedSelection) return

    const abort = new AbortController()

    let pollPicked = false
    async function pollPickerSession() {
      if (document.visibilityState !== 'visible' || pollPicked) return

      const currentSession: google.PickingSession = await fetch(`https://photospicker.googleapis.com/v1/sessions/${session?.id}`, {
        headers: {
          'accept-encoding': 'gzip',
          'authorization': `Bearer ${auth.token.access_token}`,
        },
      }).then(res => res.json())

      if (!currentSession.mediaItemsSet) return

      pollPicked = true

      const resources: google.MediaItemsResponse = await fetch(`https://photospicker.googleapis.com/v1/mediaItems?sessionId=${currentSession.id}&pageSize=100`, {
        headers: {
          'accept-encoding': 'gzip',
          'authorization': `Bearer ${auth.token.access_token}`,
        },
      }).then(res => res.json())

      setSelectedPhotos(resources.mediaItems)
      setPickerSession(null)

      resources.mediaItems.forEach(async (item) => {
        const { baseUrl, mediaFileMetadata: { height: h, width: w } } = item.mediaFile

        const ratio = parseInt(h) / parseInt(w)
        const maxWidth = 1920
        const maxHeight = 1920
        const dimensions: [string, number][] = [
          ['w', Math.min(maxWidth, parseInt(w))],
          ['h', Math.min(maxHeight, parseInt(h))],
        ]
        if (ratio > 1) dimensions.reverse()

        dimensions[1][1] = Math.round(dimensions[0][1] / ratio)

        if (ratio > 1) dimensions.reverse()

        const response = await fetch(baseUrl + `=${dimensions.map(([d, size]) => `${d}${size}`).join('-')}`, {
          headers: {
            'accept-encoding': 'gzip',
            'authorization': `Bearer ${auth.token.access_token}`,
          },
        })

        let downloaded: NonNullable<NonNullable<typeof selectedPhotos>[number]['downloaded']>
        if (!response.ok)
          downloaded = new Error('Failed to download photo', { cause: response.statusText })
        else {
          const blob = await response.blob()
          downloaded = {
            blob,
            url: URL.createObjectURL(blob),
          }
        }

        setSelectedPhotos(photos => {
          photos ??= []
          const idx = photos.findIndex(p => p.id === item.id)
          photos[idx].downloaded = downloaded
          return [...photos]
        })
      })
    }

    document.addEventListener('visibilitychange', pollPickerSession, { signal: abort.signal })

    pollPickerSession()

    const interval = setInterval(pollPickerSession, Number(session.pollingConfig.pollInterval.replace(/s$/, '')) * 1000)

    abort.signal.addEventListener('abort', () => clearInterval(interval))

    return () => abort.abort()
  })

  useEffect(() => {
    return initSessionPolling(pickerSession, hasFinishedSelection)
  }, [pickerSession, hasFinishedSelection])

  function handlePickerInit() {
    setPickerSession(null)

    startSessionTransition(async () => {
      setSelectedPhotos(null)
      const session: google.PickingSession = await fetch('https://photospicker.googleapis.com/v1/sessions', {
        method: 'POST',
        headers: {
          'accept-encoding': 'gzip',
          'authorization': `Bearer ${auth.token.access_token}`,
        },
      }).then(res => res.json())

      setPickerSession(session)
    })
  }

  async function handleCancelSession() {
    if (!pickerSession) return

    await fetch(`https://photospicker.googleapis.com/v1/sessions/${pickerSession.id}`, {
      method: 'DELETE',
      headers: {
        'accept-encoding': 'gzip',
        'authorization': `Bearer ${auth.token.access_token}`,
      },
    })

    setPickerSession(null)
  }

  function handleOpenPickerWindow() {
    if (isSessionExpired(pickerSession))
      return setPickerSession(null)

    window.open(pickerSession!.pickerUri + '/autoclose', '_blank')
  }

  async function handleSubmitPhotos() {
    if (!selectedPhotos) return

    startSubmission(async () => {
      const { url, signature, timestamp, apiKey } = await getImageUploadSignedUrl({ folder: 'casamento-jugu/galeria' })
      const uploadedPhotos = new Array<UploadResponse>()

      const tasks = new Array<Promise<void>>()
      for (const photo of selectedPhotos) {
        if (!photo.downloaded) continue
        if (photo.downloaded instanceof Error) continue

        const { blob } = photo.downloaded
        const formData = new FormData()
        formData.append('file', blob)
        formData.append('folder', 'casamento-jugu/galeria')
        formData.append('api_key', apiKey)
        formData.append('timestamp', timestamp.toString())
        formData.append('signature', signature)

        const task = fetch(url, { method: 'POST', body: formData })
          .then(async response => {
            if (!response.ok) return

            const data: UploadResponse = await response.json()

            uploadedPhotos.push(data)
            setUploadedCount(prev => prev + 1)
          })

        tasks.push(task)
      }

      await Promise.allSettled(tasks)

      if (uploadedPhotos.length > 0) {
        await saveUploadedImages(uploadedPhotos.map(x => ({
          id: x.public_id,
          path: x.secure_url,
        })))

        setTimeout(() => {
          setPickerSession(null)
          setSelectedPhotos(null)
          setUploadedCount(0)
        }, 500)
      }

      const failedCount = selectedPhotos.length - uploadedPhotos.length
      if (failedCount > 0)
        toast.warning(`Não foi possível fazer o upload de ${failedCount} fotos.`)
    })
  }

  const pendingRemovalsRef = useRef<Set<number>>(new Set())

  async function handleRemoveImage(id: number, onFinish: () => Promise<void>) {
    pendingRemovalsRef.current.add(id)
    await onFinish()
    pendingRemovalsRef.current.delete(id)

    if (pendingRemovalsRef.current.size === 0) {
      await refreshImages()
      toast.success('Fotos removidas com sucesso!')
    }
  }

  return (
    <div className="flex flex-col items-center flex-1 pt-8">
      <div className="flex flex-col items-center justify-center mt-4">
        <H4 className="font-normal mb-4">Autenticado como <Strong>{auth.displayName}</Strong></H4>

        {pickerSession === null && !isStartingSession && (
          <Button onClick={handlePickerInit}
            className="[data-hidden]:invisible"
            data-hidden={!hasFinishedDownloading}
          >Selecionar {(hasFinishedSelection || showStoredImages) ? 'novas' : ''} fotos</Button>
        )}
        {isStartingSession && <Button disabled>Aguarde um instante...</Button>}
      </div>

      {!!pickerSession && (
        <>
          <P className="text-center">Sessão válida até: <Strong>{new Date(pickerSession?.expireTime).toLocaleString('pt-BR')}</Strong></P>

          <Button className="mt-4" onClick={handleCancelSession}>Cancelar a sessão</Button>

          <div className="flex flex-1 text-center my-8 gap-8">
            <div className={`
              flex-1/2 flex justify-center items-center aspect-square
              border rounded-2xl
            `}>
              <H5>Acesse com o celular scaneando o QR Code abaixo</H5>
            </div>
            <div className={`
              flex-1/2 flex flex-col justify-center items-center
              aspect-square border rounded-2xl
            `}>
              <H5 className="mb-4">Ou clique no botão para adicionar fotos pelo computador</H5>
              <Button onClick={handleOpenPickerWindow}>Adicionar fotos</Button>
            </div>
          </div>
        </>
      )}

      {(hasFinishedSelection || showStoredImages) && (
        <div className="container mx-auto my-8">
          <div className={`
            flex flex-row flex-wrap gap-2 p-2
            justify-center
          `}>
            {!hasFinishedDownloading && !showStoredImages && (
              <div className={`
                flex shrink-0 w-full justify-center items-center
                mb-8
              `}>
                <Progress value={(downloadedCount / (selectedPhotos?.length ?? 0)) * 100} className="items-center max-w-sm w-full">
                  <ProgressLabel>
                    <H5>Carregando fotos</H5>
                  </ProgressLabel>
                  <ProgressValue render={<span>{downloadedCount}/{selectedPhotos?.length ?? 0}</span>} />
                  <ProgressTrack className="w-full h-0.5 bg-muted">
                    <ProgressIndicator />
                  </ProgressTrack>
                </Progress>
              </div>
            )}
            {(hasFinishedDownloading || showStoredImages) && (
              <>
                {photos.map(photo => <GalleryImage key={photo.id} photo={photo} onRemove={handleRemoveImage} />)}

                {!showStoredImages && (
                  <div className={`
                    flex flex-col justify-center items-center w-full
                    mt-8
                  `}>
                    {isSubmitting && (
                      <Progress value={(uploadedCount / (selectedPhotos?.length ?? 0)) * 100} className="items-center max-w-sm w-full">
                        <ProgressLabel>
                          <H5>Enviando fotos</H5>
                        </ProgressLabel>
                        <ProgressValue render={<span>{uploadedCount}/{selectedPhotos?.length ?? 0}</span>} />
                        <ProgressTrack className="w-full h-0.5 bg-muted">
                          <ProgressIndicator />
                        </ProgressTrack>
                      </Progress>
                    )}

                    <Button className="text-lg relative" size="lg" onClick={handleSubmitPhotos} disabled={isSubmitting}>
                      Salvar fotos
                      {isSubmitting && <div className="absolute inset-0 abs-center-y bg-inherit"><Loader2Icon className="animate-spin" /></div>}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function isSessionExpired(session: google.PickingSession | null | undefined) {
  return session && new Date(session.expireTime).getTime() <= Date.now()
}
