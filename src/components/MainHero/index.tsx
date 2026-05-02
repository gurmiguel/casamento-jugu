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

  return (
    <div className="relative z-1 flex flex-col items-center justify-center h-dvh bg-primary text-primary-foreground">
      <div
        className="absolute top-0 right-0 -z-1 h-full pointer-events-none select-none"
        style={{
          width: isLarge ? `${500/7}%` : '100%',
        }}
      >
        <Image src="/topo-default.jpg" loading="eager" alt="" fill className="saturate-120 blur-xs xl:blur-none darkreader:blur-none! bg-primary object-cover" />
        <div className="darkreader:hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-black/35 mix-blend-darken"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-orange-200 mix-blend-darken"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-rose-200 mix-blend-darken"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-black/40 mix-blend-darken lg:hidden"></div>
        </div>
        {/* support darkreader extension */}
        <div className="not-darkreader:hidden opacity-60">
          <div className="absolute top-0 left-0 w-full h-full bg-black/85 mix-blend-darken"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-orange-200/10 mix-blend-darken"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-rose-200/10 mix-blend-darken"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-black/40 mix-blend-darken lg:hidden"></div>
        </div>
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/topo-main.jpg" loading="eager" alt="" className="absolute abs-center-xy w-full h-full saturate-120 rounded-[inherit] bg-primary object-cover" />
        </div>
        <div className="flex flex-col gap-4 text-shadow-lg items-center lg:items-baseline">
          <Image src={Badge} alt="Brasão do casal" height={148} className="mt-4 lg:-mt-18 drop-shadow-xl w-auto" />
          <H1 className="mb-4 text-center lg:text-left">
            Juliana<br/>
            <span className="font-calligraphy mr-4">& </span>
            Gustavo
          </H1>
          <H4 className="flex flex-col gap-2 font-normal">
            <div>
              <CalendarIcon className="drop-shadow-xl mr-3" />
              {new Intl.DateTimeFormat('pt-BR', {
                dateStyle: 'long',
              }).format(date)}
            </div>
            <a href={address.url} target="_blank" className="flex group" rel="noreferrer">
              <MapPinIcon className="drop-shadow-xl mt-1 mr-3" />
              <div>
                <span className="border-b border-transparent group-hover:border-primary-foreground">{address.label}</span>
                <span className="hidden lg:block border-b border-transparent group-hover:border-primary-foreground">{formatAddress(address, 'full')}</span>
              </div>
            </a>
          </H4>
        </div>
      </div>
    </div>
  )
}

export const MainHeroFallback = () => <div className="relative z-1 h-dvh bg-primary" />
