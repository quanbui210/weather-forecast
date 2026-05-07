import { generalFetcher } from "../../api/client"
import type { ForecastApiResponse } from "./types"

const WEATHER_FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const defaultParams = {
    current: "temperature_2m,wind_speed_10m,weather_code",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
    forecast_days: 1,
    timezone: "auto"
}

export const getWeatherForecast = async (params: {
    latitude: number
    longitude: number
    unit: string
}, signal?: AbortSignal) => {
    const data = await generalFetcher<ForecastApiResponse>(WEATHER_FORECAST_URL, {...defaultParams, ...params}, signal)
    return data
}