import { useCallback, useMemo, useSyncExternalStore } from 'react'

export function useLocalStorage<T>(key: string) {
  const store = useMemo(() => {
    const listeners = new Array<() => void>()
    return {
      subscribe(listener: () => void) {
        listeners.push(listener)
        return () => listeners.splice(listeners.indexOf(listener), 1)
      },
      getSnapshot() {
        const value = localStorage.getItem(key)
        return value !== null ? value : null
      },
      dispatch() {
        listeners.forEach(l => l())
      },
    }}, [key])

  const value = useSyncExternalStore(store.subscribe, store.getSnapshot, () => undefined)
  const parsedValue = useMemo(() => value ? JSON.parse(value) as T : value as null | undefined, [value])

  const setValue = useCallback((newValue: T | null) => {
    if (newValue === null)
      localStorage.removeItem(key)
    else
      localStorage.setItem(key, JSON.stringify(newValue))
    store.dispatch()
  }, [key, store])

  return [parsedValue, setValue] as const
}
