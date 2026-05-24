'use client'

import { use, useRef, useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
import { screens } from '~/config/theme'
import { cn } from '~/lib/ui'
import { Marquee } from '../ui/marquee'
import { PreloadedImage } from '../ui/preloaded-image'
import { H2, H5 } from '../ui/typography'
import { ViewAwareContainer } from '../ViewAwareContainer'
import { OrnamentDivider } from '../ui/ornament-divider'

interface ImageItem {
  id: number
  path: string
}

interface Props {
  images: Promise<ImageItem[]>
}

const GALLERY_ROWS = 3

export function Gallery({ images: useImages }: Props) {
  const images = chunkArray(use(useImages), GALLERY_ROWS)

  const [velocity, setVelocity] = useState(1)

  const [visible, setVisible] = useState(false)

  if (!images[0]?.length)
    return <></>

  return (
    <>
      <OrnamentDivider />

      <div className="overflow-hidden text-center mt-6">
        <div className="px-6">
          <div className="container mx-auto">
            <H2 className="mb-6">Galeria</H2>
            <H5 className="text-secondary">Um pouco dos nossos momentos juntos</H5>
          </div>
        </div>

        <ViewAwareContainer className={cn('relative overflow-hidden my-10 no-scrollbar', velocity === 1 && 'hover:*:*:paused!')}
          onMouseEnter={() => setVelocity(0)}
          onMouseLeave={() => setVelocity(1)}
          onTouchStart={() => setVelocity(0)}
          onTouchEnd={() => setVelocity(1)}
          onContextMenuCapture={e => e.preventDefault()}
          onIntersect={() => setVisible(true)}
          disabled={visible}
          rootMargin="200px 0px"
        >
          {visible && (
            <div className={`
              flex flex-wrap justify-center items-center grow
              pointer-events-none gap-2
            `}>
              {images.map((row, i) => (
                <GalleryRow key={i} images={row} velocity={velocity} rows={GALLERY_ROWS} />
              ))}
            </div>
          )}
        </ViewAwareContainer>
      </div>
    </>
  )
}

interface RowProps {
  images: ImageItem[]
  velocity: number
  rows: number
}

function GalleryRow({ images, velocity, rows }: RowProps) {
  const imagesLoadedCount = useRef(0)
  const isLarge = useMediaQuery(`only screen and (min-width: ${screens.lg+1}px)`, { defaultValue: false, initializeWithValue: false })
  const isHandheld = useMediaQuery(`only screen and (max-width: ${screens.sm}px)`, { defaultValue: false, initializeWithValue: false })
  const [hidden, setHidden] = useState(true)

  function onImageLoad() {
    imagesLoadedCount.current += 1

    if (imagesLoadedCount.current === images.length) {
      setHidden(false)
    }
  }

  return (
    <div className="w-full group -my-px" data-paused={velocity === 0 ? true : undefined}>
      <Marquee className={cn(`
        transition-opacity duration-500
        [&>.rfm-overlay]:before:transition-all
        [&>.rfm-overlay]:after:transition-all
        group-data-[paused=true]:[&_.rfm-overlay]:before:-translate-x-full
        [&_.rfm-overlay]:before:duration-500
        group-data-[paused=true]:[&_.rfm-overlay]:after:translate-x-full
        [&_.rfm-overlay]:after:duration-500
      `, hidden && 'opacity-0')}
      autoFill
      speed={50}
      play={velocity > 0}
      gradient={!isHandheld}
      gradientWidth={isLarge ? 160 : 70}
      gradientColor="color-mix(in srgb, var(--background) 60%, transparent)"
      pauseOnHover={false}
      >
        {images.map(img => (
          <PreloadedImage key={img.id} src={img.path} alt=""
            className={`
              min-h-48 w-auto max-w-none select-none mx-1
              shadow/30
            `}
            onLoad={onImageLoad}
            onError={onImageLoad}
            style={{
              height: `calc(${100 / rows}dvh - ${7.75/(rows-1)}rem)`,
            }}
          />
        ))}
      </Marquee>
    </div>
  )
}

export function GalleryFallback() {
  return <div className="" />
}

function chunkArray<T>(arr: T[], chunks: number) {
  const chunkSize = Math.ceil(arr.length / chunks)

  return Array.from({ length: chunks }, (_, i) => arr.slice(i * chunkSize, (i + 1) * chunkSize))
}
