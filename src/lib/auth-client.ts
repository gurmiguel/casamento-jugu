import { createAuthClient } from 'better-auth/react'
import { dashClient } from '@better-auth/infra/client'
import { adminClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  plugins: [dashClient(), adminClient()],
})

export const useSession = authClient.useSession
export const getSession = authClient.getSession
