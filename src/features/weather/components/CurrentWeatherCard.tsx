import type { CurrentWeather } from '../types'
import { formatMonthDay } from '../../../shared/lib/date'
import { formatHumidity, formatTemperature, formatWindSpeed } from '../../../shared/lib/format'
import styles from './WeatherView.module.scss'

type CurrentWeatherCardProps = {
  weather: CurrentWeather
  locationLabel: string
  timezone: string
}

export function CurrentWeatherCard({ weather, locationLabel, timezone }: CurrentWeatherCardProps) {
  return (
    <section className={styles.panel}>
      <p className={styles.eyebrow}>Current</p>
      <h2 className={styles.panelTitle}>{locationLabel}</h2>
      <p className={styles.panelMeta}>
        {formatMonthDay(weather.time.slice(0, 10))} · {timezone.replace('_', ' ')}
      </p>

      <p className={styles.currentTemp}>{formatTemperature(weather.temperature)}</p>

      <div className={styles.currentDetails}>
        <span className={styles.detailPill}>Humidity {formatHumidity(weather.humidity)}</span>
        <span className={styles.detailPill}>Wind {formatWindSpeed(weather.windSpeed)}</span>
      </div>
    </section>
  )
}
