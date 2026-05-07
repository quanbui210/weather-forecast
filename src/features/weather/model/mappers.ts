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
    temperature: response.current.temperature_2m,
    humidity: response.current.relative_humidity_2m,
    windSpeed: response.current.wind_speed_10m,
  };
}

export function mapDailyForecast(response: ForecastApiResponse): ForecastDay[] {
  const { time, temperature_2m_max, temperature_2m_min } = response.daily;
  const length = Math.min(time.length, temperature_2m_max.length, temperature_2m_min.length);

  const days: ForecastDay[] = [];
  for (let i = 0; i < length; i += 1) {
    days.push({
      date: time[i],
      minTemp: temperature_2m_min[i],
      maxTemp: temperature_2m_max[i],
    });
  }

  return days;
}

export function mapHourlyForecast(response: ForecastApiResponse): HourlyForecastItem[] {
  const { time, temperature_2m } = response.hourly;
  const length = Math.min(time.length, temperature_2m.length);

  const humidity = response.hourly.relative_humidity_2m;
  const windSpeed = response.hourly.wind_speed_10m;

  const hourly: HourlyForecastItem[] = [];
  for (let i = 0; i < length; i += 1) {
    const iso = time[i];

    hourly.push({
      time: iso,
      date: getDateKey(iso),
      hourLabel: getHourLabel(iso),
      temperature: temperature_2m[i],
      humidity: humidity?.[i],
      windSpeed: windSpeed?.[i],
    });
  }

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
