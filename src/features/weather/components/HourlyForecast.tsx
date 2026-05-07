import type { HourlyForecastItem } from '../types'
import { formatMonthDay } from '../../../shared/lib/date'
import { formatHumidity, formatTemperature, formatWindSpeed } from '../../../shared/lib/format'
import styles from './WeatherView.module.scss'

type HourlyForecastProps = {
  items: HourlyForecastItem[]
  selectedDate: string | null
}

function getFillWidth(value: number, min: number, max: number): string {
  if (max === min) {
    return '100%'
  }

  const percentage = ((value - min) / (max - min)) * 100
  return `${Math.max(10, Math.min(100, percentage))}%`
}

export function HourlyForecast({ items, selectedDate }: HourlyForecastProps) {
  if (!selectedDate || items.length === 0) {
    return null
  }

  const temperatures = items.map((item) => item.temperature)
  const min = Math.min(...temperatures)
  const max = Math.max(...temperatures)

  return (
    <section className={`${styles.panel} ${styles.hourlyPanel}`}>
      <div className={styles.hourlyHeader}>
        <div>
          <p className={styles.eyebrow}>Hourly</p>
          <h2 className={styles.panelTitle}>Temperature through the day</h2>
        </div>
        <p className={styles.hourlyDate}>{formatMonthDay(selectedDate)}</p>
      </div>

      <div className={styles.hourlyList}>
        {items.map((item) => (
          <div key={item.time} className={styles.hourlyRow}>
            <div className={styles.hourlyInfo}>
              <span className={styles.hourlyTime}>{item.hourLabel}</span>
              <span className={styles.hourlyMeta}>
                {item.humidity !== undefined ? `Hum ${formatHumidity(item.humidity)}` : null}
                {item.humidity !== undefined && item.windSpeed !== undefined ? ' · ' : null}
                {item.windSpeed !== undefined ? `Wind ${formatWindSpeed(item.windSpeed)}` : null}
              </span>
            </div>
            <div className={styles.hourlyBar} aria-hidden="true">
              <div
                className={styles.hourlyBarFill}
                style={{ width: getFillWidth(item.temperature, min, max) }}
              />
            </div>
            <span className={styles.hourlyTemp}>{formatTemperature(item.temperature)}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
