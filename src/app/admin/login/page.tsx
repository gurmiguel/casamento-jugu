import LoginPageComponent from './page.client'

export default async function LoginPage({ searchParams }: PageProps<'/admin/login'>) {
  let { error } = await searchParams
  error = Array.isArray(error) ? error[0] : error

  return <LoginPageComponent error={error ?? null} />
}
