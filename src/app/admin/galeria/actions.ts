'use server'

import { revalidateTag, updateTag } from 'next/cache'
import z from 'zod'
import { actionClient } from '~/server-only/adapters/http/server-actions.client'
import { GalleryRepository } from '~/server-only/repositories/gallery.repository'
import { ImageUploader } from '~/server-only/services/image-uploader'

export const refreshImages = actionClient
  .action(async () => {
    updateTag('gallery')
  })

export const saveUploadedImages = actionClient
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

export const getImageUploadSignedUrl = actionClient
  .inputSchema(z.object({
    params: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
  }))
  .outputSchema(z.object({
    timestamp: z.number(),
    signature: z.string(),
    url: z.string(),
    apiKey: z.string(),
  }))
  .action(async ({ parsedInput: { params } }) => {
    const uploader = new ImageUploader()

    const { timestamp, signature, url, apiKey } = await uploader.getFileSignedUrl(params)

    return { timestamp, signature, url, apiKey }
  })

export const removeImage = actionClient
  .inputSchema(z.object({ id: z.number() }))
  .outputSchema(z.object({ success: z.boolean() }))
  .action(async ({ parsedInput: { id } }) => {
    const galleryRepo = new GalleryRepository()
    const uploader = new ImageUploader()

    const image = await galleryRepo.findById(id)

    if (!image) return { success: false }

    await galleryRepo.remove(id)
    if (image.providerId)
      await uploader.removeFile(image.providerId)

    revalidateTag('gallery', 'uploadedImages')

    return { success: true }
  })
