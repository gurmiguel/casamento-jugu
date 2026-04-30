import { Suspense } from 'react'
import { AboutUs } from '~/components/AboutUs'
import { Countdown, CountdownFallback } from '~/components/Countdown'
import { AddToCalendar } from '~/components/Countdown/AddToCalendar'
import { MainHero, MainHeroFallback } from '~/components/MainHero'
import { OrnamentDivider } from '~/components/OrnamentDivider'
import { ADDRESS, DATE, DURATION_HOURS } from '~/config/data'

export default function Home() {
  return (
    <div className="main">
      <Suspense fallback={<MainHeroFallback />}>
        <MainHero date={DATE} address={ADDRESS} />
      </Suspense>

      <OrnamentDivider />

      <Suspense fallback={<CountdownFallback />}>
        <Countdown target={DATE}>
          <AddToCalendar datetime={DATE} durationInHours={DURATION_HOURS} address={ADDRESS} />
        </Countdown>
      </Suspense>

      <AboutUs />

      <OrnamentDivider />

      <div className="h-dvh bg-background">

      </div>
    </div>
  )
}
