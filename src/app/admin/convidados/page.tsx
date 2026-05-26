import { getInvites } from '~/server-only/dal/invites'
import { InvitesPagesComponent } from './page.client'

export default async function InvitesPages() {
  const invites = await getInvites()

  return <InvitesPagesComponent invites={invites} />
}
