import { cacheLife, cacheTag } from 'next/cache'
import { InvitesRepository } from '../repositories/invites.repository'

export async function getInvites() {
  'use cache'

  cacheLife('days')
  cacheTag('invites')

  const invitesRepo = new InvitesRepository()
  return await invitesRepo.findAll()
}
