import { useState, useEffect } from 'react'
import type { GeocodingApiLocation } from '../types'
import { useDebouncedValue } from '../../../shared/hooks/useDebouncedValue'
import { searchLocations } from '../api'

export const useLocationSearch = (query: string) => {
  const [locations, setLocations] = useState<GeocodingApiLocation[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const debouncedValue = useDebouncedValue(query.trim(), 350)
  const isSearchReady = debouncedValue.length >= 2

  useEffect(() => {
    if (!isSearchReady) {
      return
    }

    const controller = new AbortController()

    const search = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await searchLocations({ query: debouncedValue, signal: controller.signal })
        setLocations(data)
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return
        }
        setError(error instanceof Error ? error.message : 'Unknown error')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void search()
    return () => controller.abort()
  }, [debouncedValue, isSearchReady])

  return {
    locations: isSearchReady ? locations : [],
    loading: isSearchReady ? loading : false,
    error: isSearchReady ? error : null,
  }
}
