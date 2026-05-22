import { getGalleryImages } from '~/server-only/dal/gallery'
import GalleryPageComponent from './page.client'

export default async function GalleryPage() {
  const images = await getGalleryImages()

  return (
    <GalleryPageComponent storedImages={images} />
  )
}
