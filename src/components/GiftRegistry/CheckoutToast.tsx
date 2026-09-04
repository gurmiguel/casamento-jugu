'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

interface Props {
  checkoutSuccess?: boolean
}

export function CheckoutToast({ checkoutSuccess }: Props) {
  const hasTriggered = useRef(false)

  useEffect(() => {
    if (checkoutSuccess && !hasTriggered.current) {
      hasTriggered.current = true
      toast.success('Muito obrigado pelo seu presente!', {
        description: 'Ficamos muito felizes e agradecidos com o seu carinho.',
        duration: 8000,
      })

      // Clean query parameter without page reload
      const url = new URL(window.location.href)
      url.searchParams.delete('checkout')
      window.history.replaceState({}, '', url.pathname + (url.search ? url.search : '') + url.hash)
    }
  }, [checkoutSuccess])

  return null
}
