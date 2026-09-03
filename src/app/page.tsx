import { Suspense } from 'react'
import { AboutUs } from '~/components/AboutUs'
import { Countdown, CountdownFallback } from '~/components/Countdown'
import { AddToCalendar } from '~/components/Countdown/AddToCalendar'
import { Gallery, GalleryFallback } from '~/components/Gallery'
import { Location } from '~/components/Location'
import { MainHero, MainHeroFallback } from '~/components/MainHero'
import { OrnamentDivider } from '~/components/ui/ornament-divider'
import { ADDRESS, DATE, DURATION_HOURS } from '~/config/data'
import { getGalleryImages } from '~/server/dal/gallery'
import { Footer } from '~/components/Footer'
import { RSVP } from '~/components/RSVP'
import { getInviteData, updateInviteStatus } from '~/server/dal/invites'
import { getProductsList } from '~/server/dal/products'
import { GiftRegistry } from '~/components/GiftRegistry'

export default async function Home({ searchParams }: PageProps<'/'>) {
  const images = getGalleryImages()
  const products = getProductsList()
  let { code: rsvpCode } = await searchParams
  rsvpCode = Array.isArray(rsvpCode) ? rsvpCode[0] : rsvpCode

  return (
    <div className="main relative">
      <Suspense fallback={<MainHeroFallback />}>
        <MainHero date={DATE} address={ADDRESS} />
      </Suspense>

      <div className="relative">
        <AboutUs />

        <Suspense fallback={<CountdownFallback />}>
          <Countdown target={DATE}>
            <AddToCalendar datetime={DATE} durationInHours={DURATION_HOURS} address={ADDRESS} />
          </Countdown>
        </Suspense>

        <OrnamentDivider className="mt-8" />

        <Location date={DATE} address={ADDRESS} />

        <RSVP
          date={DATE}
          code={rsvpCode}
          loadInvitees={getInviteData}
          onSubmit={updateInviteStatus}
        />

        <Suspense fallback={<GalleryFallback />}>
          <Gallery images={images} />
        </Suspense>

        <Suspense>
          <GiftRegistry products={products} />
        </Suspense>

        <Footer />
      </div>
    </div>
  )
}
