import { z } from 'zod'
import { pt } from 'zod/locales'

z.config(pt())

export * from 'zod'

export function prettifyError<T extends Record<string, unknown>>(error: z.ZodError<T>) {
  const flattened = Object.values(error.flatten(issue => issue.message).fieldErrors).flat()
  return Array.from(new Set(flattened)).join('\n')
}
