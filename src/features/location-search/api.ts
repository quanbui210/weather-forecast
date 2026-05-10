import { generalFetcher } from '../../api/client'
import type { GeocodingApiLocation, LocationSearchResponse } from './types'

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'

export const searchLocations = async (params: {
  query: string
  count?: number
  language?: string
  signal: AbortSignal
}): Promise<GeocodingApiLocation[]> => {
  const { query, count = 5, language = 'en', signal } = params
  const data = await generalFetcher<LocationSearchResponse>(
    GEOCODING_URL,
    { name: query, count, language },
    signal,
  )

  return data.results ?? []
}
