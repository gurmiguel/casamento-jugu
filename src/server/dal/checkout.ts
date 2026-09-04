'use server'

import { headers } from 'next/headers'
import { z } from '~/lib/zod'
import { actionClient } from '../adapters/http/server-actions'
import { ProductsRepository } from '../repositories/products.repository'

const createCheckoutSessionInputSchema = z.object({
  productId: z.string().min(1, 'ID do produto é obrigatório'),
})

export const createCheckoutSession = actionClient
  .metadata({
    serverErrorMessage: 'Não foi possível iniciar o checkout. Tente novamente mais tarde.',
  })
  .inputSchema(createCheckoutSessionInputSchema)
  .action(async ({ parsedInput: { productId } }) => {
    const headersList = await headers()
    const origin =
      headersList.get('origin') ||
      headersList.get('referer')?.split('/').slice(0, 3).join('/') ||
      process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
      'http://localhost:3000'

    const productsRepo = new ProductsRepository()
    const checkoutUrl = await productsRepo.createCheckoutSession(productId, origin)

    if (!checkoutUrl) {
      throw new Error('Falha ao gerar link de pagamento no Stripe.')
    }

    return { checkoutUrl }
  })
