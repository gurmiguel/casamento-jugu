'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '~/contexts/auth/auth.context'
import { setAuth } from '../utils'

export default function LogoutPage() {
  const router = useRouter()
  const { auth } = useAuth()

  if (auth.token.access_token) {
    google.accounts.oauth2.revoke(auth.token.access_token, () => {
      setAuth(null)
    })
  }

  router.replace('/')
}
