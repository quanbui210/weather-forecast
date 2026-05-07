import { useMemo, useState } from 'react'

import { StateView } from '../../../shared/components/StateView/StateView'
import type { GeocodingApiLocation } from '../../location-search'
import { getInitialSelectedDate, selectHourlyForDate } from '../model/selectors'
import { useForecast } from '../hooks/useForecast'
import { CurrentWeatherCard } from './CurrentWeatherCard'
import { ForecastDays } from './ForecastDays'
import { HourlyForecast } from './HourlyForecast'
import styles from './WeatherView.module.scss'

type WeatherViewProps = {
  location: GeocodingApiLocation | null
}

function formatLocationLabel(location: GeocodingApiLocation): string {
  return [location.name, location.admin1, location.country].filter(Boolean).join(', ')
}

function LoadingView() {
  return (
    <div className={styles.loadingGrid}>
      <div className={styles.skeletonPanel} />
      <div className={styles.skeletonPanel} />
    </div>
  )
}

export function WeatherView({ location }: WeatherViewProps) {
  const { forecast, loading, error } = useForecast(location)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const activeSelectedDate = useMemo(() => {
    if (!forecast) {
      return null
    }

    if (selectedDate && forecast.days.some((day) => day.date === selectedDate)) {
      return selectedDate
    }

    return getInitialSelectedDate(forecast.days)
  }, [forecast, selectedDate])

  const hourlyItems = useMemo(() => {
    if (!forecast || !activeSelectedDate) {
      return []
    }

    return selectHourlyForDate(forecast.hourly, activeSelectedDate)
  }, [forecast, activeSelectedDate])

  if (!location) {
    return (
      <StateView
        eyebrow="Forecast"
        title="Choose a location"
        message="Search for a city above or use your current location to open the weather panels."
      />
    )
  }

  if (loading && !forecast) {
    return <LoadingView />
  }

  if (error && !forecast) {
    return (
      <StateView
        eyebrow="Forecast"
        title="Unable to load the forecast"
        message={error.message}
      />
    )
  }

  if (!forecast) {
    return null
  }

  return (
    <section className={styles.section}>
      <CurrentWeatherCard
        weather={forecast.current}
        locationLabel={formatLocationLabel(location)}
        timezone={forecast.timezone}
      />

      <ForecastDays
        days={forecast.days}
        selectedDate={activeSelectedDate}
        onSelectDate={setSelectedDate}
      />

      <HourlyForecast items={hourlyItems} selectedDate={activeSelectedDate} />
    </section>
  )
}
