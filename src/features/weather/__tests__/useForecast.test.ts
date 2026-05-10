import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useForecast } from '../hooks/useForecast'
import { getWeatherForecast } from '../api'
import { mapForecast } from '../model/mappers'
import type { ForecastApiResponse, ForecastViewModel } from '../types'
// Mock the external dependencies
vi.mock('../api', () => ({
  getWeatherForecast: vi.fn(),
}))

vi.mock('../model/mappers', () => ({
  mapForecast: vi.fn(),
}))

describe('useForecast', () => {
  const mockLocation = { latitude: 50.1109, longitude: 8.6821 }
  const mockRawData: ForecastApiResponse = {
    latitude: 52.52,
    longitude: 13.419998,
    timezone: 'GMT',
    current: {
      time: '2023-01-01T00:00:00Z',
      is_day: 1,
      temperature_2m: 20,
      relative_humidity_2m: 50,
      weather_code: 20,
      wind_speed_10m: 20,
    },
    daily: {
      time: ['2023-05-09', '2023-05-10'],
      temperature_2m_max: [20, 22],
      temperature_2m_min: [18, 20],
      weather_code: [20, 21],
    },
    hourly: {
      time: ['2023-01-01T00:00:00Z', '2023-01-01T01:00:00Z'],
      temperature_2m: [20, 22],
      weather_code: [20, 21],
      relative_humidity_2m: [50, 52],
      wind_speed_10m: [20, 22],
    },
  }
  const mockMappedData: ForecastViewModel = {
    timezone: 'auto',
    current: {
      time: '2026-05-10T17:45',
      isDay: true,
      temperature: 20,
      humidity: 50,
      weatherCode: 3,
      windSpeed: 20,
    },
    days: [
      {
        date: '2026-05-10',
        minTemp: 18,
        maxTemp: 22,
        weatherCode: 3,
      },
    ],
    hourly: [
      {
        date: '2026-05-10',
        time: '2026-05-10T17:45',
        isDay: true,
        temperature: 20,
        humidity: 50,
        weatherCode: 3,
        windSpeed: 20,
        hourLabel: '00:00',
      },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch and map forecast data successfully', async () => {
    vi.mocked(getWeatherForecast).mockResolvedValueOnce(mockRawData)
    vi.mocked(mapForecast).mockReturnValueOnce(mockMappedData as ForecastViewModel)

    const { result } = renderHook(() => useForecast(mockLocation))

    expect(result.current.loading).toBe(true)

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.forecast).toEqual(mockMappedData)
    expect(result.current.error).toBeNull()
    expect(getWeatherForecast).toHaveBeenCalledWith(mockLocation, expect.any(AbortSignal))
  })

  it('should not update state if the component is unmounted (AbortError)', async () => {
    let resolveRequest: (value: ForecastApiResponse) => void
    const promise = new Promise((resolve) => {
      resolveRequest = resolve
    })

    vi.mocked(getWeatherForecast).mockReturnValueOnce(promise as Promise<ForecastApiResponse>)

    const { unmount } = renderHook(() => useForecast(mockLocation))

    unmount()
    resolveRequest!(mockRawData as ForecastApiResponse)
    expect(mapForecast).not.toHaveBeenCalled()
  })
})
