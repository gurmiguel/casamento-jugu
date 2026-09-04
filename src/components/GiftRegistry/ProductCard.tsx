/* eslint-disable @next/next/no-img-element */
'use client'

import type { Product } from '~/server/dal/products'
import { Gift } from 'lucide-react'
import { H4 } from '../ui/typography'

interface Props {
  product: Product
  onClick(): void
}

export function ProductCard({ product, onClick }: Props) {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price / 100)

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative flex flex-col overflow-hidden
        rounded-xl border border-border/80 bg-card text-left
        transition-all duration-300
        hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
        cursor-pointer
      `}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted/30">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`
              h-full w-full object-cover transition-transform duration-500
              group-hover:scale-105
            `}
            loading="lazy"
          />
        ) : (
          <div className={`
            flex h-full w-full flex-col items-center
            justify-center gap-3 bg-secondary/10 text-muted-foreground transition-colors
            group-hover:bg-secondary/15
          `}>
            <Gift className={`
              size-12 stroke-[1.25] text-secondary/70 transition-transform duration-300
              group-hover:scale-110
            `} />
            <span className="text-xs uppercase tracking-widest text-muted-foreground/80 font-sans">
              Presente
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <H4 variant="h5" className={`
          -mt-1 line-clamp-2 font-serif text-card-foreground
          group-hover:text-primary
          transition-colors
        `}>
          {product.name}
        </H4>

        <div className={`
          mt-3 flex items-baseline justify-between border-t
          border-border/40 pt-3
        `}>
          <span />
          <span className="font-serif text-lg font-semibold text-foreground">
            {formattedPrice}
          </span>
        </div>
      </div>
    </button>
  )
}
