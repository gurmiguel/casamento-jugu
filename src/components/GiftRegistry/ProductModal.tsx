/* eslint-disable @next/next/no-img-element */
'use client'

import { Gift } from 'lucide-react'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { createCheckoutSession } from '~/server/dal/checkout'
import type { Product } from '~/server/dal/products'
import { Button } from '../ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { JumpingDotsLoader } from '../ui/jumping-dots'

interface Props {
  product: Product | null
  open: boolean
  onOpenChange(open: boolean): void
}

export function ProductModal({ product, open, onOpenChange }: Props) {
  const [isPending, startTransition] = useTransition()

  if (!product) return null

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price / 100)

  function handleCheckout() {
    if (!product) return

    startTransition(async () => {
      const response = await createCheckoutSession({ productId: product.id })

      if (response?.serverError) {
        toast.error(response.serverError)
        return
      }

      if (response?.data?.checkoutUrl) {
        window.location.href = response.data.checkoutUrl
      } else {
        toast.error('Não foi possível iniciar o checkout. Tente novamente mais tarde.')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`
        sm:max-w-lg
        p-0 gap-0 overflow-hidden border border-border/80
        bg-popover rounded-2xl shadow-xl
      `}>
        <div className={`
          relative aspect-video
          sm:aspect-4/3
          w-full overflow-hidden bg-muted/30
        `}>
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className={`
              flex h-full w-full flex-col items-center
              justify-center gap-3 bg-secondary/10 text-muted-foreground
            `}>
              <Gift className="size-16 stroke-[1.25] text-secondary/70" />
              <span className="text-xs uppercase tracking-widest text-muted-foreground/80 font-sans">
                Presente de Casamento
              </span>
            </div>
          )}
        </div>

        <DialogHeader className="p-6 pb-4 text-left">
          <div className="flex flex-col gap-2">
            <DialogTitle className={`
              font-serif text-xl
              sm:text-2xl
              font-medium tracking-normal normal-case text-foreground
            `}>
              {product.name}
            </DialogTitle>
            <span className="font-serif text-2xl font-semibold text-primary">
              {formattedPrice}
            </span>
          </div>

          {product.description && (
            <DialogDescription className="mt-4 text-base leading-relaxed text-muted-foreground normal-case">
              {product.description}
            </DialogDescription>
          )}
        </DialogHeader>

        <DialogFooter className={`
          p-6 pt-4 border-t border-border/40 bg-muted/10
          sm:justify-between
          flex-row items-center gap-4
        `}>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Pagamento seguro processado via <br />
            Plataforma de pagamentos Stripe
          </span>

          <Button
            size="lg"
            className={`
              w-full
              sm:w-auto
              min-w-44 rounded-full text-sm font-semibold
            `}
            onClick={handleCheckout}
            disabled={isPending}
          >
            {isPending ? (
              <JumpingDotsLoader size="sm" dotClassName="bg-primary-foreground" />
            ) : (
              <>Presentear</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
