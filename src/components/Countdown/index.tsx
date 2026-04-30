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
    <div className="bg-primary text-primary-foreground py-16 md:py-24 px-6">
      <div className="container mx-auto text-center flex flex-col items-center gap-4">
        <H2>Contagem Regressiva</H2>

        <div className="flex justify-center gap-2 sm:gap-8 w-full max-w-3xl mx-auto my-10">
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
  return <div className="bg-primary text-primary-foreground py-24" />
}
