import { cacheLife, cacheTag } from 'next/cache'
import { GalleryRepository } from '../repositories/gallery.repository'

export async function getGalleryImages() {
  'use cache'

  cacheLife('max')
  cacheTag('gallery')

  const galleryRepo = new GalleryRepository()
  const images = await galleryRepo.findAll()
  return images.map(img => ({
    id: img.id,
    providerId: img.providerId,
    path: img.path,
  }))
}
