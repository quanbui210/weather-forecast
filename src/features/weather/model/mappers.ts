import type {
  CurrentWeather,
  ForecastApiResponse,
  ForecastDay,
  ForecastViewModel,
  HourlyForecastItem,
} from '../types';
import { getDateKey, getHourLabel } from '../../../shared/lib/date';

export function mapCurrentWeather(response: ForecastApiResponse): CurrentWeather {
  return {
    time: response.current.time,
    isDay: response.current.is_day === 1,
    temperature: response.current.temperature_2m,
    humidity: response.current.relative_humidity_2m,
    weatherCode: response.current.weather_code,
    windSpeed: response.current.wind_speed_10m,
  };
}

export function mapDailyForecast(response: ForecastApiResponse): ForecastDay[] {
  const { temperature_2m_max, temperature_2m_min, weather_code } = response.daily;
  const days = response.daily.time.map((day, index) => ({
    date: day,
    minTemp: temperature_2m_min[index],
    maxTemp: temperature_2m_max[index],
    weatherCode: weather_code[index],
  }))

  return days;
}

export function mapHourlyForecast(response: ForecastApiResponse): HourlyForecastItem[] {
  const { time, temperature_2m, weather_code, relative_humidity_2m: humidity, wind_speed_10m: windSpeed } = response.hourly;
  // const humidity = response.hourly.relative_humidity_2m;
  // const windSpeed = response.hourly.wind_speed_10m;
  console.log(response.hourly.weather_code)
  const hourly = time.map((iso, index) => ({
    time: iso,
    date: getDateKey(iso),
    hourLabel: getHourLabel(iso),
    temperature: temperature_2m[index],
    humidity: humidity?.[index],
    windSpeed: windSpeed?.[index],
    weatherCode: weather_code[index],
  }))

  return hourly;
}

export function mapForecast(response: ForecastApiResponse): ForecastViewModel {
  return {
    timezone: response.timezone,
    current: mapCurrentWeather(response),
    days: mapDailyForecast(response),
    hourly: mapHourlyForecast(response),
  };
}
