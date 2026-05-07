import type { ForecastDay } from '../types'
import { formatMonthDay, formatWeekday } from '../../../shared/lib/date'
import { formatTemperature } from '../../../shared/lib/format'
import styles from './WeatherView.module.scss'

type ForecastDaysProps = {
  days: ForecastDay[]
  selectedDate: string | null
  onSelectDate: (date: string) => void
}

export function ForecastDays({ days, selectedDate, onSelectDate }: ForecastDaysProps) {
  return (
    <section className={styles.panel}>
      <p className={styles.eyebrow}>Outlook</p>
      <h2 className={styles.panelTitle}>7 day forecast</h2>

      <div className={styles.forecastGrid}>
        {days.map((day) => {
          const isActive = selectedDate === day.date

          return (
            <button
              key={day.date}
              type="button"
              className={`${styles.dayButton} ${isActive ? styles.dayButtonActive : ''}`}
              onClick={() => onSelectDate(day.date)}
            >
              <span className={styles.dayName}>{formatWeekday(day.date)}</span>
              <span className={styles.dayDate}>{formatMonthDay(day.date)}</span>
               <span className={styles.tempRange}>
                <span className={styles.tempMax}>{formatTemperature(day.maxTemp)}</span>
                <span className={styles.tempMin}>{formatTemperature(day.minTemp)}</span>
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
