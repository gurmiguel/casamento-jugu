'use client'

/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { JSX, useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '~/lib/ui'

type Props = Omit<JSX.IntrinsicElements['img'], 'src' | 'onLoad' | 'onError'> & {
  src: string
  fallback?: JSX.Element
  decoding?: HTMLImageElement['decoding']
  onLoad?: () => void
  onError?: (event: Event | string) => void
  intersectionOptions?: IntersectionObserverInit
}

const FALLBACK_PIXEL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export function PreloadedImage({ src, onLoad, onError, decoding, fallback, className, loading = 'eager', intersectionOptions, ...props }: Props) {
  const imgRef = useRef<HTMLImageElement>(null)
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
    if (loading === 'eager')
      image.src = src
    else {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          image.src = src
          observer.disconnect()
        }
      }, {
        rootMargin: '200px 0px',
        threshold: 0.1,
        ...intersectionOptions,
      })
      observer.observe(imgRef.current!)
      return () => observer.disconnect()
    }
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
      <img ref={imgRef} src={loadedSrc ?? FALLBACK_PIXEL} {...props} className={cn(!loadedSrc && fallback && 'invisible', className)} />
    </>
  )
}
