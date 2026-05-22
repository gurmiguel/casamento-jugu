import { GalleryRepository } from '~/server-only/repositories/gallery.repository'
import GalleryPageComponent from './page.client'
import { cacheTag } from 'next/cache'

export default async function GalleryPage() {
  const images = await fetchStoredImages()

  return (
    <GalleryPageComponent storedImages={images} />
  )
}

async function fetchStoredImages() {
  'use cache'

  cacheTag('gallery')

  const galleryRepo = new GalleryRepository()
  const images = await galleryRepo.findAll()
  return images.map(img => ({
    id: img.id,
    providerId: img.providerId,
    path: img.path,
  }))
}
