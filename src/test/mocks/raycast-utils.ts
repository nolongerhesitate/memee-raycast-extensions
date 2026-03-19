import { useState, useEffect } from 'react'

// Mock Raycast utils hooks
export function useFetch<T>(url: string, options?: any) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Mock implementation
    setIsLoading(true)
    setTimeout(() => {
      setData(null as T)
      setIsLoading(false)
    }, 100)
  }, [url])

  return { data, isLoading, error, revalidate: () => {} }
}

export function usePromise<T>(promiseFn: () => Promise<T>, deps: any[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    setIsLoading(true)
    promiseFn()
      .then(setData)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, deps)

  return { data, isLoading, error }
}

export function useCachedState<T>(key: string, initialValue: T) {
  return useState<T>(initialValue)
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  return useState<T>(initialValue)
}
