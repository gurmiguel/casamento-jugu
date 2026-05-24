import { getGalleryImages } from '~/server-only/dal/gallery'
import GalleryPageComponent from './page.client'
import { auth } from '~/lib/auth'
import { headers } from 'next/headers'

export default async function GalleryPage() {
  const [
    images,
    googleProvider,
  ] = await Promise.all([
    getGalleryImages(),
    headers()
      .then(headers => auth.api.getSession({ headers }))
      .then(session => auth.api.getAccessToken({
        body: {
          providerId: 'google',
          userId: session?.session.userId,
        },
      })),
  ])

  return (
    <GalleryPageComponent storedImages={images} googleAccessToken={googleProvider.accessToken} />
  )
}
