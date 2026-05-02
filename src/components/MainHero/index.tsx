'use client'

import { CalendarIcon, MapPinIcon } from 'lucide-react'
import Image from 'next/image'
import Badge from '~/assets/badge-semi-transparent.png'
import { cn } from '~/lib/ui'

import { useMediaQuery } from 'usehooks-ts'
import { screens } from '~/config/theme'
import { H1, H4 } from '~/components/ui/typography'
import { IAddress } from '~/config/types'
import { formatAddress } from '~/lib/address'
import { MouseEvent } from 'react'

const IMAGE_SIZE = {
  large: 480,
  small: 275,
}

interface Props {
  date: Date
  address: IAddress
}

export function MainHero({ date, address }: Props) {
  const isLarge = useMediaQuery(`only screen and (min-width: ${screens.lg}px)`, { defaultValue: true, initializeWithValue: false })
  const isSmallHeight = useMediaQuery('only screen and (max-height: 520px)', { defaultValue: false, initializeWithValue: false })

  function handleAddressClick(e: MouseEvent) {
    e.preventDefault()
    const target = e.currentTarget.getAttribute('href')
    if (!target) return

    const element = document.querySelector(target)
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  return (
    <div className="
      relative z-1 flex h-dvh flex-col items-center justify-center bg-primary
      text-primary-foreground
    ">
      <div
        className="
          pointer-events-none absolute top-0 right-0 -z-1 h-full select-none
        "
        style={{
          width: isLarge ? `${500/7}%` : '100%',
        }}
      >
        <Image src="/topo-default.jpg" loading="eager" alt="" fill className="
          bg-primary object-cover blur-xs saturate-120
          xl:blur-none
          darkreader:blur-none!
        " />
        <div className="darkreader:hidden">
          <div className="
            absolute top-0 left-0 size-full bg-black/35 mix-blend-darken
          "></div>
          <div className="
            absolute top-0 left-0 size-full bg-orange-200 mix-blend-darken
          "></div>
          <div className="
            absolute top-0 left-0 size-full bg-rose-200 mix-blend-darken
          "></div>
          <div className="
            absolute top-0 left-0 size-full bg-black/40 mix-blend-darken
            lg:hidden
          "></div>
        </div>
        {/* support darkreader extension */}
        <div className="
          opacity-60
          not-darkreader:hidden
        ">
          <div className="
            absolute top-0 left-0 size-full bg-black/85 mix-blend-darken
          "></div>
          <div className="
            absolute top-0 left-0 size-full bg-orange-200/10 mix-blend-darken
          "></div>
          <div className="
            absolute top-0 left-0 size-full bg-rose-200/10 mix-blend-darken
          "></div>
          <div className="
            absolute top-0 left-0 size-full bg-black/40 mix-blend-darken
            lg:hidden
          "></div>
        </div>
      </div>
      <div
        className="
          mr-0 ml-auto flex flex-col items-center justify-start gap-4 px-4
          lg:flex-row lg:gap-16
        "
        style={{
          width: isLarge ? `min(100%, calc(${500/7}% + 1rem + ${IMAGE_SIZE.large/2}px))` : '100%',
        }}
      >
        <div
          className={cn('relative aspect-square rounded-full shadow-2xl', isSmallHeight && `
            hidden
          `)}
          style={{ height: isLarge ? `${IMAGE_SIZE.large}px` : `min(30vh, ${IMAGE_SIZE.small}px)` }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/topo-main.jpg" loading="eager" alt="" className="
            absolute abs-center-xy size-full rounded-[inherit] bg-primary
            object-cover saturate-120
          " />
        </div>
        <div className="
          flex flex-col items-center gap-4 text-shadow-lg
          lg:items-baseline
        ">
          <Image src={Badge} alt="Brasão do casal" height={148} className="
            mt-4 w-auto drop-shadow-xl
            lg:-mt-18
          " />
          <H1 className="
            mb-4 text-center
            lg:text-left
          ">
            Juliana<br/>
            <span className="mr-4 font-calligraphy">& </span>
            Gustavo
          </H1>
          <H4 className="flex flex-col gap-2 font-normal">
            <div>
              <CalendarIcon className="mr-3 drop-shadow-xl" />
              {new Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'long',
              }).format(date)}
            </div>
            <a href="#map"className="group flex" onClick={handleAddressClick}>
              <MapPinIcon className="mt-1 mr-3 drop-shadow-xl" />
              <div>
                <span className="
                  border-b border-transparent
                  group-hover:border-primary-foreground
                ">{address.label}</span>
                <span className="
                  hidden border-b border-transparent
                  group-hover:border-primary-foreground
                  lg:block
                ">{formatAddress(address, 'full')}</span>
              </div>
            </a>
          </H4>
        </div>
      </div>
    </div>
  )
}

export const MainHeroFallback = () => <div className="
  relative z-1 h-dvh bg-primary
" />
