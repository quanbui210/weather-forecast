export interface ForecastApiResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  current: CurrentWeatherApi;
  daily: DailyWeatherApi;
  hourly: HourlyWeatherApi;
}

export interface CurrentWeatherApi {
  time: string;
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
}

export interface DailyWeatherApi {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
}

export interface HourlyWeatherApi {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m?: number[];
  wind_speed_10m?: number[];
}

export type CurrentWeather = {
  time: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
};

export type ForecastDay = {
  date: string;
  minTemp: number;
  maxTemp: number;
};

export type HourlyForecastItem = {
  time: string;
  date: string;
  hourLabel: string;
  temperature: number;
  humidity?: number;
  windSpeed?: number;
};

export type ForecastViewModel = {
  timezone: string;
  current: CurrentWeather;
  days: ForecastDay[];
  hourly: HourlyForecastItem[];
};
