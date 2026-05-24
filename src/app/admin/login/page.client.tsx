'use client'

import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { authClient } from '~/lib/auth-client'
import GoogleIcon from '~/assets/google-icon.svg'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface Props {
  error: string | null
}

export default function LoginPageComponent({ error }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function onSubmit(event: React.SubmitEvent) {
    event.preventDefault()
    setIsLoading(true)
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/admin',
    })
  }

  useEffect(() => {
    if (!error) return

    switch (error) {
      case 'signup_disabled':
        toast.error('Este usuário não está cadastrado')
        break
      default:
        toast.error(`Erro inesperado: ${error}`)
        break
    }

    router.replace('/admin/login')
  }, [error, router])

  return (
    <div className="flex items-center justify-center h-full">
      <form onSubmit={onSubmit} className="space-y-4">
        <Button
          type="submit"
          disabled={isLoading}
          size="xl"
          className="text-xl"
        >
          <GoogleIcon className="size-7 -ml-3 mr-2" />{isLoading ? 'Redirecionando...' : 'Entre com o Google'}
        </Button>
      </form>
    </div>
  )
}
