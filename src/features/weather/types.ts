export type TemperatureUnit = 'celsius' | 'fahrenheit';

export interface ForecastRequestParams {
  latitude: number;
  longitude: number;
  forecastDays?: number;
  temperatureUnit?: TemperatureUnit;
  timezone?: string;
}

export interface ForecastApiResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  
  current_units: CurrentUnits;
  current: CurrentWeatherApi;

  daily_units: DailyUnits;
  daily: DailyWeatherApi;

  hourly_units: HourlyUnits;
  hourly: HourlyWeatherApi;
}

export interface CurrentUnits {
  time: string;
  interval: string;
  temperature_2m: string;
  wind_speed_10m: string;
  weather_code: string;
}

export interface CurrentWeatherApi {
  time: string;
  interval: number;
  temperature_2m: number;
  wind_speed_10m: number;
  weather_code: number;
}

export interface DailyUnits {
  time: string;
  weather_code: string;
  temperature_2m_max: string;
  temperature_2m_min: string;
}

export interface DailyWeatherApi {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

export interface HourlyUnits {
  time: string;
  temperature_2m: string;
}

export interface HourlyWeatherApi {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  wind_speed_10m: number[];
}