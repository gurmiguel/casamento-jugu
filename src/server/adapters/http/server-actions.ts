import { createSafeActionClient } from 'next-safe-action'
import { betterAuth } from '@next-safe-action/adapter-better-auth'
import { auth } from '~/lib/auth'

export const actionClient = createSafeActionClient()
export const authActionClient = actionClient
  .use(betterAuth(auth))
