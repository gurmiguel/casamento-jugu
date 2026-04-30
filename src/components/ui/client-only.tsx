'use client'

import { PropsWithChildren, ReactNode, Suspense, useLayoutEffect, useState } from 'react'

export function ClientOnly({ children, fallback = <></> }: PropsWithChildren<{ fallback?: ReactNode }>) {
  const [isMounted, setIsMounted] = useState(false)

  useLayoutEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted)
    return fallback

  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  )
}
