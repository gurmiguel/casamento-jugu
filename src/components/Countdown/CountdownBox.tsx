'use client'

import { CountdownType } from './types'

const counterLabels: Record<CountdownType, string> = {
  [CountdownType.DAYS]: 'Dias',
  [CountdownType.HOURS]: 'Horas',
  [CountdownType.MINUTES]: 'Minutos',
  [CountdownType.SECONDS]: 'Segundos',
}

interface Props {
  type: CountdownType
  seconds: number
}

const counters: Record<CountdownType, (seconds: number) => number> = {
  [CountdownType.DAYS]: (secs) => Math.floor(secs / (60 * 60 * 24)),
  [CountdownType.HOURS]: (secs) => Math.floor((secs / (60 * 60)) % 24),
  [CountdownType.MINUTES]: (secs) => Math.floor((secs / 60) % 60),
  [CountdownType.SECONDS]: (secs) => Math.floor(secs % 60),
}

export function CountdownBox({ type, seconds }: Props) {
  const time = counters[type](seconds)

  return (
    <div className={`
      flex aspect-square flex-1 flex-col items-center
      justify-center rounded-3xl border-2 border-muted-foreground/30 bg-secondary/10
      text-center
    `}>
      <div className="font-times text-3xl font-thin sm:text-7xl">{seconds >= 0 ? String(Math.floor(time)).padStart(2, '0') : <br/>}</div>

      <span className={`
        mt-0.5 -mb-2 font-sans text-xs font-bold
        tracking-wider uppercase opacity-70
        md:mt-1 md:-mb-3 md:text-base
      `}>{counterLabels[type]}</span>
    </div>
  )
}
