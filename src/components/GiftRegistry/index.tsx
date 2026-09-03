/* eslint-disable @next/next/no-img-element */
'use client'

import { use } from 'react'
import type { Product } from '~/server/dal/products'
import { H2 } from '../ui/typography'
import { OrnamentDivider } from '../ui/ornament-divider'

interface Props {
  products: Promise<Product[]>
}

export function GiftRegistry({ products: productsPromise }: Props) {
  const products = use(productsPromise)

  // TODO: implement gift registry (products listing) cards design
  // TODO: implement checkout redirection flow

  return (
    <>
      <OrnamentDivider className="-mt-4 mb-6" />

      <section className={`
        container mx-auto mb-12 flex flex-col
        justify-center items-center
      `}>
        <H2 className="mb-8">Lista de Presentes</H2>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <li key={product.id} className="flex flex-col items-center text-center">
              {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full aspect-square rounded-lg shadow-lg" />}
              {product.name}<br/>
              {product.description}<br/>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(product.price / 100)}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
