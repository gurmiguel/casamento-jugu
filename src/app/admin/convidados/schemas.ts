import { z } from '~/lib/zod'
import { InviteeType } from '~/server/adapters/data/schemas/rsvp'

export const inviteeSchema = z.object({
  id: z.coerce.number().optional().transform(id => id === 0 ? undefined : id),
  name: z.coerce.string().nonempty({ error: 'Preencha o nome do convidado' }),
  inviteeType: z.enum(InviteeType),
})

export const inviteSchema = z.object({
  label: z.coerce.string().nonempty({ error: 'Preencha o nome do convite' }),
  invitees: z.array(inviteeSchema).min(1).describe('Convidados'),
})

export const createInviteSchema = inviteSchema
