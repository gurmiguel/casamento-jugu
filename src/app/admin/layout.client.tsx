'use client'

import Script from 'next/script'
import { PropsWithChildren, useMemo, useState, useSyncExternalStore } from 'react'
import { Button } from '~/components/ui/button'
import { decodeSnapshot, getSnapshot, setAuth, subscribe } from './utils'
import { AuthProvider } from '~/contexts/auth/auth.context'
import Link from 'next/link'

export function AdminLayoutComponent({ children, initialToken }: PropsWithChildren<{ initialToken: string | undefined }>) {
  const [state, setState] = useState<'finished' | 'pending'>('finished')
  const authStr = useSyncExternalStore(subscribe, getSnapshot, () => getSnapshot(initialToken))
  const auth = decodeSnapshot(authStr)

  const googleOAuth = useMemo(() => {
    let client: google.accounts.TokenClient
    return {
      getClient() {
        client ??= google.accounts.oauth2.initTokenClient({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
          scope: [
            'https://www.googleapis.com/auth/photospicker.mediaitems.readonly',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile',
          ].join(' '),
          async callback(response) {
            const profile = await fetch('https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses', {
              headers: {
                authorization: `Bearer ${response.access_token}`,
              },
            }).then(res => res.json())
            const { value: email } = profile.emailAddresses[0] as { value: string }
            const { displayName } = profile.names[0] as { displayName: string }
            setAuth({
              email,
              displayName,
              token: response,
            })
            setState('finished')
          },
        })
        return client
      },
    }
  }, [])

  async function handleInitGoogleAuth() {
    googleOAuth.getClient().requestAccessToken({ prompt: '' })
  }

  return (
    <>
      <div className="relative h-screen w-full overflow-auto">
        {state === 'pending' && !auth && <span>Aguardando autenticação...</span>}
        {state === 'finished' && !auth && (
          <div className={`
            w-full h-full flex flex-col justify-center
            items-center
          `}>
            <Button onClick={handleInitGoogleAuth}>Acessar com o Google</Button>
          </div>
        )}
        {!!auth && (
          <div className={`
            sticky flex justify-between
            sm:justify-center
            -top-px z-10 bg-background
          `}>
            <Button className="sm:absolute top-0 left-0" variant="outline" render={<Link href="/"/>} nativeButton={false}>
              Voltar ao site
            </Button>

            <Button variant="secondary" disabled={state === 'pending'} render={<Link href="/admin/logout"/>} nativeButton={false}>
              {state === 'finished' ? 'Desconectar do Google' : 'Desconectando...'}
            </Button>
          </div>
        )}

        {!!auth && (
          <AuthProvider auth={auth}>
            <div className="flex-1 flex flex-col justify-center items-center">{children}</div>
          </AuthProvider>
        )}
      </div>
      <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />
    </>
  )
}
