import { Suspense } from 'react'
import { AboutUs } from '~/components/AboutUs'
import { Countdown, CountdownFallback } from '~/components/Countdown'
import { AddToCalendar } from '~/components/Countdown/AddToCalendar'
import { Gallery, GalleryFallback } from '~/components/Gallery'
import { Location } from '~/components/Location'
import { MainHero, MainHeroFallback } from '~/components/MainHero'
import { OrnamentDivider } from '~/components/ui/ornament-divider'
import { ADDRESS, DATE, DURATION_HOURS } from '~/config/data'
import { getGalleryImages } from '~/server-only/dal/gallery'

export default async function Home() {
  const images = getGalleryImages()

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

      <OrnamentDivider className="mt-8" />

      <Location date={DATE} address={ADDRESS} />

      <Suspense fallback={<GalleryFallback />}>
        <Gallery images={images} />
      </Suspense>

      {/* TODO: implement RSVP section with CTA button */}

      {/* TODO: implement Gift Registry */}

      {/* TODO: implement Footer with copyright */}
    </div>
  )
}
