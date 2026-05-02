'use client'

import { PropsWithChildren } from 'react'
import { useCountdown } from '~/hooks/use-countdown'
import { H2 } from '../ui/typography'
import { CountdownBox } from './CountdownBox'
import { CountdownType } from './types'

interface Props {
  target: Date
}

export function Countdown({ target, children }: PropsWithChildren<Props>) {
  const remainingSeconds = useCountdown(target)

  return (
    <div className="bg-primary px-6 py-16 text-primary-foreground md:py-24">
      <div className={`
        container mx-auto flex flex-col items-center
        gap-4 text-center
      `}>
        <H2>Contagem Regressiva</H2>

        <div className={`
          mx-auto my-10 flex w-full max-w-3xl
          justify-center gap-2
          sm:gap-8
        `}>
          <CountdownBox type={CountdownType.DAYS} seconds={remainingSeconds} />
          <CountdownBox type={CountdownType.HOURS} seconds={remainingSeconds} />
          <CountdownBox type={CountdownType.MINUTES} seconds={remainingSeconds} />
          <CountdownBox type={CountdownType.SECONDS} seconds={remainingSeconds} />
        </div>

        {children}
      </div>
    </div>
  )
}

export function CountdownFallback() {
  return <div className="bg-primary py-24 text-primary-foreground" />
}
