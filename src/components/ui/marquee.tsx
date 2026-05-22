'use client'

import { PropsWithChildren } from 'react'
import FastMarquee, { MarqueeProps } from 'react-fast-marquee'

type Props = MarqueeProps

export function Marquee({ children, ...props }: PropsWithChildren<Props>) {
  return <FastMarquee {...props}>{children}</FastMarquee>
}
