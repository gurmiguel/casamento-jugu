import { useEffect, useState } from 'react'

export function useCountdown(target: Date) {
  const [now, setNow] = useState(-1)

  const remainingSeconds = (target.getTime() - now) / 1000

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now())
    const timer = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return now < 0 ? -1 : remainingSeconds
}
