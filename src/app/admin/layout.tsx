import { headers } from 'next/headers'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import { Button } from '~/components/ui/button'
import { auth } from '~/lib/auth'
import { cn } from '~/lib/ui'

export default async function AdminLayout({ children }: PropsWithChildren) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <>
      <div className={`
        relative h-screen w-full overflow-auto flex
        flex-col
      `}>
        <div className={`
          sticky flex justify-between container mx-auto
          sm:justify-center
          -top-px z-10 bg-background
        `}>
          <Button className={cn(session ? 'sm:absolute top-0 left-0' : 'ml-0 mr-auto')} variant="outline" render={<Link href="/"/>} nativeButton={false}>
              Voltar ao site
          </Button>

          {!!session && (
            <Button variant="secondary" render={<Link href="/admin/logout"/>} nativeButton={false}>
              Logout
            </Button>
          )}
        </div>

        <div className={`
          flex-1 flex flex-col justify-center items-center
          mt-8
        `}>
          {children}
        </div>
      </div>
    </>
  )
}
