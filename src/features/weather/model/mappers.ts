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
    windSpeed: response.current.wind_speed_10m,
    weatherCode: response.current.weather_code,
  };
}

export function mapDailyForecast(response: ForecastApiResponse): ForecastDay[] {
  const { time, temperature_2m_max, temperature_2m_min, weather_code } = response.daily;
  const length = Math.min(time.length, temperature_2m_max.length, temperature_2m_min.length, weather_code.length);

  const days: ForecastDay[] = [];
  for (let i = 0; i < length; i += 1) {
    const code = weather_code[i];
    days.push({
      date: time[i],
      minTemp: temperature_2m_min[i],
      maxTemp: temperature_2m_max[i],
      weatherCode: code,
    });
  }

  return days;
}

export function mapHourlyForecast(response: ForecastApiResponse): HourlyForecastItem[] {
  const { time, temperature_2m } = response.hourly;
  const length = Math.min(time.length, temperature_2m.length);

  const humidity = response.hourly.relative_humidity_2m;
  const windSpeed = response.hourly.wind_speed_10m;
  const weatherCode = response.hourly.weather_code;

  const hourly: HourlyForecastItem[] = [];
  for (let i = 0; i < length; i += 1) {
    const iso = time[i];
    const code = weatherCode?.[i];

    hourly.push({
      time: iso,
      date: getDateKey(iso),
      hourLabel: getHourLabel(iso),
      temperature: temperature_2m[i],
      humidity: humidity?.[i],
      windSpeed: windSpeed?.[i],
      weatherCode: code,
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
