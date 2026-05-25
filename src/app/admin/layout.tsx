import { headers } from 'next/headers'
import Link from 'next/link'
import { PropsWithChildren } from 'react'
import { Button } from '~/components/ui/button'
import { H4, NoWrap, Strong } from '~/components/ui/typography'
import { auth } from '~/lib/auth'

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
          sticky grid grid-cols-3 justify-between
          md:container
          w-full
          max-md:grid-cols-2
          mx-auto -mt-px -top-px z-10 bg-background
          mb-4
        `}>
          <div>
            <Button variant="outline" render={<Link href="/"/>} nativeButton={false}>
              Voltar ao site
            </Button>
          </div>

          {!!session && (
            <>
              <H4 className={`
                font-normal text-center leading-none
                max-md:row-start-2 max-md:row-end-2 max-md:col-span-2
              `}><NoWrap>Autenticado como</NoWrap> <br/><Strong>{session.user.name}</Strong></H4>

              <div className="flex justify-end">
                <Button variant="outline" render={<Link href="/admin"/>} nativeButton={false}>
                  Voltar ao início
                </Button>
                <Button variant="secondary" render={<Link href="/admin/logout"/>} nativeButton={false}>
                  Logout
                </Button>
              </div>
            </>
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
