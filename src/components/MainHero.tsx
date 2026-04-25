'use client'

import Image from 'next/image'
import Badge from '~/assets/badge-semi-transparent.png'
import { CalendarIcon, MapPinIcon } from 'lucide-react'
import { cn } from '~/lib/ui'

import { useMediaQuery } from '@uidotdev/usehooks'
import { screens } from '~/config/theme'

const IMAGE_SIZE = {
  large: 480,
  small: 275,
}

export function MainHero() {
  const isLarge = useMediaQuery(`only screen and (min-width: ${screens.lg}px)`)
  const isSmallHeight = useMediaQuery('only screen and (max-height: 520px)')

  return (

    <div className="relative z-1 flex flex-col items-center justify-center h-dvh bg-primary text-primary-foreground">
      <div
        className="absolute top-0 right-0 -z-1 h-full pointer-events-none select-none"
        style={{
          width: isLarge ? `${500/7}%` : '100%',
        }}
      >
        <Image src="/topo-default.jpg" alt="" fill objectFit="cover" className="saturate-120 blur-xs xl:blur-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-black/35 mix-blend-darken"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-orange-200 mix-blend-darken"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-rose-200 mix-blend-darken"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-black/40 mix-blend-darken lg:hidden"></div>
      </div>
      <div
        className="flex flex-col lg:flex-row mr-0 ml-auto items-center justify-start gap-4 lg:gap-16 px-4"
        style={{
          width: isLarge ? `min(100%, calc(${500/7}% + 1rem + ${IMAGE_SIZE.large/2}px))` : '100%',
        }}
      >
        <div
          className={cn('relative rounded-full aspect-square shadow-2xl', isSmallHeight && 'hidden')}
          style={{ height: isLarge ? `${IMAGE_SIZE.large}px` : `min(30vh, ${IMAGE_SIZE.small}px)` }}
        >
          <Image src="/topo-main.jpg" alt="" fill objectFit="cover" className="saturate-120 rounded-[inherit]" />
        </div>
        <div className="flex flex-col gap-4 text-shadow-lg items-center lg:items-baseline">
          <Image src={Badge} alt="Brasão do casal" height={148} className="mt-4 lg:-mt-18 drop-shadow-xl" />
          <div className="text-4xl leading-8 lg:text-6xl lg:leading-12 -tracking-wider mb-4 text-center lg:text-left">
            Juliana<br/>
            <span className="font-calligraphy mr-4">& </span>
            Gustavo
          </div>
          <div className="flex flex-col gap-2 text-xl lg:text-2xl leading-tight">
            <div>
              <CalendarIcon className="drop-shadow-xl mr-3" />
              21 de abril de 2027
            </div>
            <a href="https://maps.app.goo.gl/FvKZwyKCrfNzngXx6" target="_blank" className="flex group">
              <MapPinIcon className="drop-shadow-xl mt-1 mr-3" />
              <div>
                <span className="border-b border-transparent group-hover:border-primary-foreground">Recanto Flor da Vila</span>
                <span className="hidden lg:block border-b border-transparent group-hover:border-primary-foreground">Est. Maria Cristina, 630 - Eldorado, Diadema - SP</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
