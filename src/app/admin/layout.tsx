import { cookies } from 'next/headers'
import { GOOGLE_AUTH_TOKEN_COOKIE } from './utils'
import { AdminLayoutComponent } from './layout.client'
import { PropsWithChildren } from 'react'
import { withSuspense } from '~/lib/ssr'

export default withSuspense(async function AdminLayout({ children }: PropsWithChildren) {
  const cookieStore = await cookies()

  const cookie = cookieStore.get(GOOGLE_AUTH_TOKEN_COOKIE)?.value

  return <AdminLayoutComponent initialToken={cookie}>{children}</AdminLayoutComponent>
})
