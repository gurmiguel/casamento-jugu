import { getInvites } from '~/server/dal/invites'
import { InvitesPagesComponent } from './page.client'

export default async function InvitesPages() {
  const invites = await getInvites()

  return <InvitesPagesComponent invites={invites} />
}
