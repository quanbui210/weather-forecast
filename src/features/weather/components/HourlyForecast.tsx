import { useEffect, useRef, useState } from 'react'
import type { HourlyForecastItem } from '../types'
import { formatMonthDay } from '../../../shared/lib/date'
import { formatHumidity, formatTemperature, formatWindSpeed } from '../../../shared/lib/format'
import styles from './WeatherView.module.scss'
import { getWeatherVisual } from '../model/weatherCode'

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
  const rowRefs = useRef([])
  const [visibleRows, setVisibleRows] = useState<Record<string, boolean>>({})

  useEffect(() => {


    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          const rowKey = entry.target.getAttribute('data-row-key')
          if (!rowKey) {
            return
          }

          setVisibleRows((previous) => {
            if (previous[rowKey]) {
              return previous
            }

            return {
              ...previous,
              [rowKey]: true,
            }
          })
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )

    rowRefs.current.forEach((row) => {
      if (row) {
        observer.observe(row)
      }
    })

    return () => observer.disconnect()
  }, [items, selectedDate])

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
        {items.map((item, index) => {
          const visual = getWeatherVisual(item.weatherCode, item.isDay)
          const hasMeta = item.humidity !== undefined || item.windSpeed !== undefined
          const rowDelay = index * 36

          return (
            <article
              key={item.time}
              ref={(element) => {
                rowRefs.current[index] = element
              }}
              data-row-key={item.time}
              className={`${styles.hourlyRow} ${visibleRows[item.time] ? styles.hourlyRowVisible : ''}`}
              style={{ animationDelay: `${rowDelay}ms` }}
            >
              <div className={styles.hourlyTop}>
                <div className={styles.hourlyTimeBlock}>
                  <span className={styles.hourlyTime}>{item.hourLabel}</span>
                </div>

                <div className={styles.hourlyVisual}>
                  <img className={styles.hourlyIcon} src={visual.image} alt="" aria-hidden="true" />
                  <div className={styles.hourlyInfo}>
                    <span className={styles.hourlyDescription}>{visual.description}</span>
                    <span className={styles.hourlyMeta}>{item.isDay ? 'Daytime' : 'Night'}</span>
                  </div>
                </div>

                <span className={styles.hourlyTemp}>{formatTemperature(item.temperature)}</span>
              </div>

              <div className={styles.hourlyBottom}>
                <div className={styles.hourlyBarWrap}>
                  <div className={styles.hourlyBar} aria-hidden="true">
                    <div
                      className={`${styles.hourlyBarFill} ${visibleRows[item.time] ? styles.hourlyBarFillVisible : ''}`}
                      style={{
                        width: getFillWidth(item.temperature, min, max),
                        animationDelay: `${rowDelay + 90}ms`,
                      }}
                    />
                  </div>
                </div>

                {hasMeta ? (
                  <div className={styles.hourlyStats}>
                    {item.humidity !== undefined ? (
                      <span className={styles.hourlyStat}>Humidity {formatHumidity(item.humidity)}</span>
                    ) : null}
                    {item.windSpeed !== undefined ? (
                      <span className={styles.hourlyStat}>Wind {formatWindSpeed(item.windSpeed)}</span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
