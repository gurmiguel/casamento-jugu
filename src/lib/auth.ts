import { dash } from '@better-auth/infra'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { nextCookies } from 'better-auth/next-js'
import { admin } from 'better-auth/plugins'
import * as schema from '~/server-only/adapters/data/schemas/auth'
import db from '~/server-only/adapters/data/db'

export const auth = betterAuth({
  appName: 'Casamento Juliana & Gustavo',
  plugins: [dash(), admin(), nextCookies()],
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    schema,
  }),
  session: {
    cookieCache: {
      enabled: true,
      strategy: 'jwe',
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
      allowUnlinkingAll: true,
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      scope: [
        'https://www.googleapis.com/auth/photospicker.mediaitems.readonly',
      ],
      accessType: 'offline',
      prompt: 'consent',
      disableImplicitSignUp: true,
    },
  },
  onAPIError: {
    errorURL: '/admin/login',
  },
})
