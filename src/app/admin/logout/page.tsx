'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { authClient } from '~/lib/auth-client'
import { DefaultFallback } from '~/lib/ssr'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    authClient.signOut()
      .then(() => router.replace('/admin/login'))
  }, [router])

  return <DefaultFallback />
}
