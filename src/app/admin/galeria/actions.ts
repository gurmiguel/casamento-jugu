'use server'

import { revalidateTag, updateTag } from 'next/cache'
import { z } from '~/lib/zod'
import { authActionClient } from '~/server/adapters/http/server-actions'
import { GalleryRepository } from '~/server/repositories/gallery.repository'
import { ImageUploader } from '~/server/services/image-uploader'

export const refreshImages = authActionClient
  .metadata({})
  .action(async () => {
    updateTag('gallery')
  })

export const saveUploadedImages = authActionClient
  .metadata({})
  .inputSchema(z.object({
    images: z.array(z.object({
      path: z.string(),
      id: z.string(),
    })),
  }))
  .action(async ({ parsedInput: { images } }) => {
    const uploader = new ImageUploader()
    const galleryRepo = new GalleryRepository()

    const existingImages = await galleryRepo.findAll()

    await galleryRepo.saveAll(images.map((img, index) => ({ ...img, order: index })))

    await uploader.removeFiles(existingImages.map(x => x.providerId).filter((x): x is string => x != null))
    await galleryRepo.removeMany(existingImages.map(x => x.id))

    updateTag('gallery')

    return { success: true }
  })

export const getImageUploadSignedUrl = authActionClient
  .metadata({})
  .inputSchema(z.object({
    params: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  }))
  .action(async ({ parsedInput: { params } }) => {
    const uploader = new ImageUploader()

    const { timestamp, signature, url, apiKey } = await uploader.getFileSignedUrl(params)

    return { timestamp, signature, url, apiKey }
  })

export const removeImage = authActionClient
  .metadata({})
  .inputSchema(z.object({ id: z.number() }))
  .action(async ({ parsedInput: { id } }) => {
    const galleryRepo = new GalleryRepository()
    const uploader = new ImageUploader()

    const image = await galleryRepo.findById(id)

    if (!image) return { success: false }

    await galleryRepo.remove(id)
    if (image.providerId)
      await uploader.removeFile(image.providerId)

    revalidateTag('gallery', 'max')

    return { success: true }
  })
