import {expect, describe, it} from 'vitest'
import { mapDailyForecast, mapHourlyForecast } from '../model/mappers'
import type { ForecastApiResponse } from '../types'

const exampleResponse: ForecastApiResponse = {
    latitude: 52.52,
    longitude: 13.419998,
    timezone: "GMT",
    current: {
        time: "2023-01-01T00:00:00Z",
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
    }

}

describe("map daily forecast data to a more UI friendly format", () => {
    it("should map the daily data to a more UI friendly format", () => {
        const days = mapDailyForecast(exampleResponse)
        expect(days).toEqual([
            {
                date: '2023-05-09',
                minTemp: 18,
                maxTemp: 20,
                weatherCode: 20,
            },
            {
                date: '2023-05-10',
                minTemp: 20,
                maxTemp: 22,
                weatherCode: 21,
            },
        ])
    })

    it("should map the hourly data to a more UI friendly format", () => {
        const hours = mapHourlyForecast(exampleResponse)
        expect(hours).toEqual([
            {
                time: '2023-01-01T00:00:00Z',
                date: '2023-01-01',
                hourLabel: "00:00",
                isDay: false,
                temperature: 20,
                weatherCode: 20,
                humidity: 50,
                windSpeed: 20,
            },
            {
                time: '2023-01-01T01:00:00Z',
                date: '2023-01-01',
                hourLabel: "01:00",
                isDay: false,
                temperature: 22,
                weatherCode: 21,
                humidity: 52,
                windSpeed: 22,
            },
        ])
    })
})
