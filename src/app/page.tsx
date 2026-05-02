import { Suspense } from 'react'
import { AboutUs } from '~/components/AboutUs'
import { Countdown, CountdownFallback } from '~/components/Countdown'
import { AddToCalendar } from '~/components/Countdown/AddToCalendar'
import { Location } from '~/components/Location'
import { MainHero, MainHeroFallback } from '~/components/MainHero'
import { OrnamentDivider } from '~/components/ui/OrnamentDivider'
import { ADDRESS, DATE, DURATION_HOURS } from '~/config/data'

export default function Home() {
  return (
    <div className="main">
      <Suspense fallback={<MainHeroFallback />}>
        <MainHero date={DATE} address={ADDRESS} />
      </Suspense>

      <AboutUs />

      <Suspense fallback={<CountdownFallback />}>
        <Countdown target={DATE}>
          <AddToCalendar datetime={DATE} durationInHours={DURATION_HOURS} address={ADDRESS} />
        </Countdown>
      </Suspense>

      <OrnamentDivider />

      <Location date={DATE} address={ADDRESS} />

      <OrnamentDivider />

      {/* TODO: implement Gallery as mosaic */}

      {/* TODO: implement RSVP section with CTA button */}

      {/* TODO: implement Gift Registry */}

      {/* TODO: implement Footer with copyright */}
    </div>
  )
}
