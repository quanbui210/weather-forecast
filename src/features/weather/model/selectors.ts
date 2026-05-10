import type { ForecastDay, HourlyForecastItem } from '../types'

export function getInitialSelectedDate(days: ForecastDay[]): string | null {
  if (days.length === 0) {
    return null
  }

  const todayKey = new Date().toISOString().slice(0, 10)
  const today = days.find((day) => day.date === todayKey)
  return today ? today.date : days[0].date
}

export function selectHourlyForDate(
  items: HourlyForecastItem[],
  date: string,
): HourlyForecastItem[] {
  return items.filter((item) => item.date === date)
}
