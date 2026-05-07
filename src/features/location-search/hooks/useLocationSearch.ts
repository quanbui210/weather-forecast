import { useState, useEffect } from "react"
import type { GeocodingApiLocation } from "../types"
import { useDebouncedValue } from "../../../shared/hooks/useDebouncedValue"
import { searchLocations } from "../api"

export const useLocationSearch = (query: string) => {
    const [locations, setLocations] = useState<GeocodingApiLocation[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const debouncedValue = useDebouncedValue(query.trim(), 350)
    console.log("location: ", locations)
    useEffect(() => {
      if (debouncedValue.length === 0) return
      const controller = new AbortController()
      const search = async() => {
        setLoading(true)
        try {
          const data = await searchLocations({query: debouncedValue, signal: controller.signal})
          setLocations(data)
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Unknown error')
        } finally {
          setLoading(false)
        }
      }
      void search()
      return () => controller.abort()
    }, [debouncedValue])   

    return {
      locations,
      loading,
      error,
    }
}