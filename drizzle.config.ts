import { config as dotenv } from 'dotenv'

import type { Config } from 'drizzle-kit'

dotenv()

const drizzleConfig = {
  schema: './src/server-only/adapters/data/schemas.ts',
  out: './src/server-only/adapters/data/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  casing: 'snake_case',
  introspect: {
    casing: 'camel',
  },
} satisfies Config

export default drizzleConfig
