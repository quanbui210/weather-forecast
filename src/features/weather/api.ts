import { generalFetcher } from '../../api/client'
import type { ForecastApiResponse } from './types'

const WEATHER_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const defaultParams = {
  current: 'is_day,temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
  daily: 'temperature_2m_max,temperature_2m_min,weather_code',
  hourly: 'weather_code,temperature_2m,relative_humidity_2m,wind_speed_10m',
  forecast_days: 7,
  timezone: 'auto',
}

export const getWeatherForecast = async (
  params: {
    latitude: number
    longitude: number
  },
  signal?: AbortSignal,
) => {
  const data = await generalFetcher<ForecastApiResponse>(
    WEATHER_FORECAST_URL,
    { ...defaultParams, ...params },
    signal,
  )
  return data
}
