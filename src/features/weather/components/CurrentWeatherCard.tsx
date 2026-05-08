import type { CurrentWeather } from '../types'
import { formatMonthDay } from '../../../shared/lib/date'
import { formatHumidity, formatTemperature, formatWindSpeed } from '../../../shared/lib/format'
import { getWeatherVisual } from '../model/weatherCode'
import styles from './WeatherView.module.scss'

type CurrentWeatherCardProps = {
  weather: CurrentWeather
  locationLabel: string
  timezone: string
}

export function CurrentWeatherCard({ weather, locationLabel, timezone }: CurrentWeatherCardProps) {
  const visual = getWeatherVisual(weather.weatherCode, weather.isDay)
  const locationName = locationLabel ? locationLabel : "Current location"
  return (
    <section className={`${styles.panel} ${styles.currentCard}`}>
      <div className={styles.currentHeader}>
        <div>
          <p className={styles.eyebrow}>Current</p>
          <h2 className={styles.panelTitle}>{locationName}</h2>
          <p className={styles.panelMeta}>
            {formatMonthDay(weather.time.slice(0, 10))} · {timezone.replace('_', ' ')}
          </p>
          <p className={styles.conditionText}>{visual.description}</p>
        </div>

        <img className={styles.weatherIcon} src={visual.image} alt={visual.description} />
      </div>

      <div className={styles.currentBody}>
        <p className={styles.currentTemp}>{formatTemperature(weather.temperature)}</p>

        <div className={styles.currentDetails}>
          <span className={styles.detailPill}>Humidity {formatHumidity(weather.humidity)}</span>
          <span className={styles.detailPill}>Wind {formatWindSpeed(weather.windSpeed)}</span>
        </div>
      </div>
    </section>
  )
}
