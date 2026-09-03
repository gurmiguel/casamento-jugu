'use server'
import { updateTag } from 'next/cache'

export async function refreshProducts() {
  updateTag('products')
}
