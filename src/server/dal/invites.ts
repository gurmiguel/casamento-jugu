'use server'

import { cacheLife, cacheTag, updateTag } from 'next/cache'
import { InvitesRepository } from '../repositories/invites.repository'
import { actionClient } from '../adapters/http/server-actions'
import { z } from '~/lib/zod'
import { ConfirmationStatus } from '../adapters/data/schemas'
import { returnValidationErrors } from 'next-safe-action'
import sanitizeHtml from 'sanitize-html'
import { INVITE_CODE_SIZE } from '~/config/data'

export async function getInvites() {
  'use cache'

  cacheLife('days')
  cacheTag('invites')

  const invitesRepo = new InvitesRepository()
  return await invitesRepo.findAll()
}

const getInviteDataInputSchema = z.object({
  code: z.string()
    .length(INVITE_CODE_SIZE, 'Código do convite inválido')
    .regex(/[a-z\d]+/i, 'Código do convite inválido'),
})
export const getInviteData = actionClient
  .metadata({})
  .inputSchema(getInviteDataInputSchema)
  .action(async ({ parsedInput: { code } }) => {
    'use cache'

    const invitesRepo = new InvitesRepository()
    const invite = await invitesRepo.findByCode(code)

    if (!invite) {
      // TODO: handle issue involving next-safe-action and 'use cache' sending this as a generic server error
      return returnValidationErrors(getInviteDataInputSchema, {
        code: { _errors: ['Código do convite inválido.'] },
      })
    }

    cacheTag(`invites.${invite.id}`)

    return invite
  })

const updateInviteStatusInputSchema = z.object({
  code: z.string(),
  invitees: z.array(
    z.object({
      id: z.number(),
      confirmationStatus: z.enum(ConfirmationStatus),
    }),
  ),
  notes: z.string().trim().transform(str => sanitizeHtml(str)),
})

export const updateInviteStatus = actionClient
  .metadata({})
  .inputSchema(updateInviteStatusInputSchema)
  .action(async ({ parsedInput: { code, invitees, notes } }) => {
    const invitesRepo = new InvitesRepository()
    const invite = await invitesRepo.findByCode(code)

    if (!invite) return returnValidationErrors(updateInviteStatusInputSchema, {
      code: { _errors: ['Código do convite inválido.'] },
    })

    try {
      await invitesRepo.updateInviteConfirmation(invite.id, notes, ...invitees)

      updateTag('invites')
      updateTag(`invites.${invite.id}`)

      return { success: true }
    } catch (err) {
      console.error(err)
      return {
        success: false,
        message: 'Ocorreu um erro inesperador ao atualizar confirmação.',
      }
    }
  })
