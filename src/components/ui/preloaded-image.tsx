'use client'

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { JSX, useEffect, useEffectEvent, useLayoutEffect, useState } from 'react'
import { cn } from '~/lib/ui'

type Props = Omit<JSX.IntrinsicElements['img'], 'src' | 'onLoad' | 'onError'> & {
  src: string
  fallback?: JSX.Element
  decoding?: HTMLImageElement['decoding']
  onLoad?: () => void
  onError?: (event: Event | string) => void
}

const FALLBACK_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export function PreloadedImage({ src, onLoad, onError, decoding, fallback, className, ...props }: Props) {
  const [loadedSrc, setLoadedSrc] = useState<string>()

  const handleImageLoadEvent = useEffectEvent((src: string) => {
    if (!src || loadedSrc === src) return

    if (loadedSrc !== undefined)
      setLoadedSrc(undefined)

    const image = new Image()
    if (decoding) image.decoding = decoding
    image.onload = () => {
      setLoadedSrc(src)
      onLoad?.()
    }
    image.onerror = (event) => {
      onError?.(event)
    }
    image.src = src
  })

  useLayoutEffect(() => handleImageLoadEvent(src), [src])

  const handleSendLoadEvent = useEffectEvent((loadedSrc: string | undefined) => {
    if (loadedSrc === undefined) return

    onLoad?.()
  })

  useEffect(() => handleSendLoadEvent(loadedSrc), [loadedSrc])

  return (
    <>
      {!loadedSrc && fallback}
      <img src={loadedSrc ?? FALLBACK_PIXEL} {...props} className={cn(!loadedSrc && fallback && 'invisible', className)} />
    </>
  )
}
