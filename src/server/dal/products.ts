import { cacheLife, cacheTag } from 'next/cache'
import { ProductsRepository } from '../repositories/products.repository'

export type { Product } from '../repositories/products.repository'

export async function getProductsList() {
  'use cache'

  cacheLife('days')
  cacheTag('products')

  const productsRepo = new ProductsRepository()
  return await productsRepo.findAll()
}
