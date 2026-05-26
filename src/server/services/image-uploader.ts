import cloudinary from '../adapters/storage/cloudinary'

export class ImageUploader {
  public async getFileSignedUrl(params: Record<string, unknown>) {
    const timestamp = Math.round(Date.now() / 1000)
    const signature = cloudinary.utils.api_sign_request({ ...params, timestamp }, process.env.CLOUDINARY_API_SECRET!)

    const url = cloudinary.utils.api_url('upload')
    const apiKey = cloudinary.config().api_key!

    return { timestamp, signature, url, apiKey }
  }

  public async removeFile(publicId: string) {
    return await cloudinary.uploader.destroy(publicId, { resource_type: 'image' })
  }

  public async removeFiles(publicIds: string[]) {
    return await cloudinary.api.delete_resources(publicIds, { resource_type: 'image' })
  }
}
