import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { useLocationSearch } from '../hooks/useLocationSearch'
import { searchLocations } from '../api'
import type { GeocodingApiLocation } from '../types'

vi.mock('../api', () => ({
  searchLocations: vi.fn(),
}))

describe('useLocationSearch', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('should not search if query is too short', () => {
    const { result } = renderHook(() => useLocationSearch('a'))
    expect(result.current.locations).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(searchLocations).not.toHaveBeenCalled()
  })

  it('should fetch locations when query is valid after debounce', async () => {
    vi.useFakeTimers()
    const mockData: GeocodingApiLocation[] = [
      {
        id: 1,
        name: 'London',
        latitude: 51.5074,
        longitude: -0.1278,
        elevation: 0,
        feature_code: 'city',
        country_code: 'GB',
        admin1_id: 123,
        timezone: 'Europe/London',
        country_id: 123,
        country: 'United Kingdom',
        admin1: 'London',
        population: 8618000,
      },
    ]
    vi.mocked(searchLocations).mockResolvedValue(mockData)
    const { result } = renderHook(({ q }) => useLocationSearch(q), {
      initialProps: { q: 'Lon' },
    })
    act(() => {
      vi.advanceTimersByTime(350)
    })
    expect(result.current.loading).toBe(true)
    vi.useRealTimers()
    await waitFor(() => {
      expect(result.current.locations).toEqual(mockData)
      expect(result.current.loading).toBe(false)
    })
    expect(searchLocations).toHaveBeenCalledWith(expect.objectContaining({ query: 'Lon' }))
  })

  it('should handle API errors', async () => {
    vi.useFakeTimers()
    vi.mocked(searchLocations).mockRejectedValue(new Error('Network Error'))
    const { result } = renderHook(() => useLocationSearch('London'))
    act(() => {
      vi.advanceTimersByTime(350)
    })
    vi.useRealTimers()
    await waitFor(() => {
      expect(result.current.error).toBe('Network Error')
      expect(result.current.loading).toBe(false)
    })
  })
})
