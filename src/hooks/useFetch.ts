import { useCallback, useEffect, useRef, useState } from 'react'
import type { FetchStatus } from '../types'

/**
 * Generic data-fetching hook with abort-on-unmount, status flags and retry.
 * `fetcher` must be stable (wrap in useCallback at the call site).
 */
export function useFetch<T>(fetcher: (signal: AbortSignal) => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [status, setStatus] = useState<FetchStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const run = useCallback(() => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setStatus('loading')
    setError(null)
    fetcher(controller.signal)
      .then((result) => {
        if (controller.signal.aborted) return
        setData(result)
        setStatus('success')
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setError(err instanceof Error ? err.message : 'Something went wrong')
        setStatus('error')
      })
  }, [fetcher])

  useEffect(() => {
    run()
    return () => abortRef.current?.abort()
  }, [run])

  return { data, status, error, retry: run }
}
