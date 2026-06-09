import { createSafeActionClient } from 'next-safe-action'
import { betterAuth } from '@next-safe-action/adapter-better-auth'
import { auth } from '~/lib/auth'
import z from 'zod'

export const actionClient = createSafeActionClient({
  defaultValidationErrorsShape: 'flattened',
  defineMetadataSchema: () => z.object({
    serverErrorMessage: z.string().optional(),
  }).optional(),
  handleServerError(error, { metadata }) {
    console.error(error)

    return metadata?.serverErrorMessage ?? 'Ocorreu um erro inesperado'
  },
})
export const authActionClient = actionClient
  .use(betterAuth(auth))
