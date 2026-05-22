export const GOOGLE_AUTH_TOKEN_COOKIE = 'google_auth_token'

export interface AuthState {
  email: string
  displayName: string
  token: google.accounts.TokenResponse
}

const listeners: (() => void)[] = []

export function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
  return undefined
}

export function deleteCookie(name: string) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=;max-age=0;path=/`
}

export function setCookie(name: string, value: string, maxAgeSeconds: number) {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=${value};max-age=${maxAgeSeconds};path=/`
}

export function getSnapshot(cookieVal?: string) {
  if (!cookieVal) {
    if (typeof document === 'undefined') return null
    cookieVal = getCookie(GOOGLE_AUTH_TOKEN_COOKIE)
    cookieVal = cookieVal ? cookieVal : undefined
  }
  return cookieVal ?? null
}

export function encodeSnapshot(auth: AuthState) {
  return Buffer.from(JSON.stringify(auth)).toString('base64')
}

export function decodeSnapshot(snapshot: string | null) {
  if (!snapshot) return null
  try {
    return JSON.parse(Buffer.from(snapshot, 'base64').toString('utf-8')) as AuthState
  } catch {
    return null
  }
}

export function subscribe(listener: () => void) {
  listeners.push(listener)
  return () => {
    listeners.splice(listeners.indexOf(listener), 1)
  }
}

export function setAuth(newState: AuthState | null) {
  if (newState === null)
    deleteCookie(GOOGLE_AUTH_TOKEN_COOKIE)
  else
    setCookie(GOOGLE_AUTH_TOKEN_COOKIE, encodeSnapshot(newState), 3600) // 1 hour expiration

  listeners.forEach(l => l())
}

export function decodeJwt(jwt: string) {
  const [, payload] = jwt.split('.')
  return JSON.parse(Buffer.from(payload, 'base64').toString('utf-8')) as google.accounts.TokenPayload
}
