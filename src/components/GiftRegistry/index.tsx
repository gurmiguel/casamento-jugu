'use client'

import { use, useState } from 'react'
import type { Product } from '~/server/dal/products'
import { H2, P } from '../ui/typography'
import { OrnamentDivider } from '../ui/ornament-divider'
import { ProductCard } from './ProductCard'
import { ProductModal } from './ProductModal'
import { CheckoutToast } from './CheckoutToast'

interface Props {
  products: Promise<Product[]>
  checkoutSuccess?: boolean
}

export function GiftRegistry({ products: productsPromise, checkoutSuccess }: Props) {
  const products = use(productsPromise)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  function handleSelectProduct(product: Product) {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  function handleModalOpenChange(open: boolean) {
    setIsModalOpen(open)
    if (!open) {
      setSelectedProduct(null)
    }
  }

  return (
    <>
      <CheckoutToast checkoutSuccess={checkoutSuccess} />

      <OrnamentDivider className="-mt-4 mb-6" />

      <section id="presentes" className={`
        container mx-auto mb-16 px-4
        sm:px-6
        flex flex-col items-center
      `}>
        <H2 className="mb-4">Lista de Presentes</H2>

        <P className="mb-10 max-w-2xl text-center text-muted-foreground">
          Sua presença é o nosso maior presente! Mas se desejar nos presentear,
          escolha um dos itens abaixo:
        </P>

        {products.length === 0 ? (
          <P className="my-12 text-center text-muted-foreground">
            Nenhum presente disponível no momento.
          </P>
        ) : (
          <div className={`
            grid w-full grid-cols-1
            md:grid-cols-2
            lg:grid-cols-4
            gap-6
            sm:gap-8
            max-w-6xl
          `}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleSelectProduct(product)}
              />
            ))}
          </div>
        )}
      </section>

      <ProductModal
        product={selectedProduct}
        open={isModalOpen}
        onOpenChange={handleModalOpenChange}
      />
    </>
  )
}
