'use server'

import { cacheLife, cacheTag, updateTag } from 'next/cache'
import { z } from '~/lib/zod'
import { authActionClient } from '~/server/adapters/http/server-actions'
import { InvitesRepository } from '~/server/repositories/invites.repository'
import { createInviteSchema, inviteSchema } from './schemas'

export const getInviteAction = authActionClient
  .metadata({})
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) => {
    'use cache'

    cacheLife('hours')
    cacheTag(`invites.${id}`)

    const repo = new InvitesRepository()
    return await repo.findById(id)
  })

export const createInviteAction = authActionClient
  .metadata({})
  .inputSchema(createInviteSchema)
  .action(async ({ parsedInput: { label, invitees } }) => {
    const repo = new InvitesRepository()
    const [invite] = await repo.createInvite(label)

    const inviteesToCreate = invitees.map(inv => ({
      inviteId: invite.id,
      name: inv.name,
      inviteeType: inv.inviteeType,
    }))

    await repo.addInvitees(invite.id, ...inviteesToCreate)

    updateTag('invites')
    return { success: true }
  })

export const updateInviteAction = authActionClient
  .metadata({})
  .inputSchema(inviteSchema.extend({ id: z.uuid() }))
  .action(async ({ parsedInput: { id, label, invitees } }) => {
    const invitesRepo = new InvitesRepository()

    // update label
    await invitesRepo.updateInviteLabel(id, label)

    // fetch current invitees to diff
    const invite = await invitesRepo.findById(id)
    const existingInvitees = invite?.invitees ?? []

    const submittedIds = new Set(invitees.map(i => i.id).filter(id => id !== undefined))

    // Find what to add, update, and remove
    const inviteesToAdd = invitees.filter(i => i.id === undefined).map(inv => ({
      inviteId: id,
      name: inv.name,
      inviteeType: inv.inviteeType,
    }))

    const inviteesToUpdate = invitees.filter(i => i.id !== undefined)

    const inviteesToRemove = existingInvitees.filter(i => !submittedIds.has(i.id)).map(i => i.id)

    if (inviteesToAdd.length > 0) {
      await invitesRepo.addInvitees(id, ...inviteesToAdd)
    }

    for (const item of inviteesToUpdate) {
      if (item.id !== undefined) {
        await invitesRepo.updateInvitee(item.id, { name: item.name, inviteeType: item.inviteeType })
      }
    }

    if (inviteesToRemove.length > 0) {
      await invitesRepo.removeInvitees(...inviteesToRemove)
    }

    updateTag('invites')
    updateTag(`invites.${id}`)

    return { success: true }
  })

export const deleteInviteAction = authActionClient
  .metadata({})
  .inputSchema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id } }) => {
    const repo = new InvitesRepository()
    await repo.deleteInvite(id)
    updateTag('invites')
    return { success: true }
  })

export const getCountDetailsAction = authActionClient
  .metadata({})
  .action(async () => {
    'use cache'

    cacheLife('hours')
    cacheTag('invites')

    const repo = new InvitesRepository()
    return await repo.countDetails()
  })
