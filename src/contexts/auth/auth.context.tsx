'use client'

import { createContext, PropsWithChildren, useContext } from 'react'
import { AuthState } from '~/app/admin/utils'

interface AuthProps {
  auth: AuthState
}

function useAuthState({ auth }: AuthProps) {
  return { auth }
}

export type AuthContext = ReturnType<typeof useAuthState>

const authContext = createContext({} as AuthContext)

export function AuthProvider({ children, ...props }: PropsWithChildren<AuthProps>) {
  return <authContext.Provider value={useAuthState(props)}>{children}</authContext.Provider>
}

export function useAuth() {
  return useContext(authContext)
}
