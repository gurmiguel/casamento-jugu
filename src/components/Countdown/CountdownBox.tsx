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
    <div className="flex-1 flex flex-col justify-center items-center rounded-3xl bg-secondary/10 border-2 border-muted-foreground/30 text-center aspect-square">
      <div className="text-3xl sm:text-7xl font-times font-thin">{seconds >= 0 ? String(Math.floor(time)).padStart(2, '0') : <br/>}</div>

      <span className="mt-0.5 -mb-2 md:mt-1 md:-mb-3 font-sans text-xs md:text-base font-bold uppercase opacity-70 tracking-wider">{counterLabels[type]}</span>
    </div>
  )
}
