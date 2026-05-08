import { useMemo, useState } from 'react'

import { StateView } from '../../../shared/components/StateView/StateView'
import type { GeocodingApiLocation, UserLocation } from '../../location-search'
import { getInitialSelectedDate, selectHourlyForDate } from '../model/selectors'
import { useForecast } from '../hooks/useForecast'
import { CurrentWeatherCard } from './CurrentWeatherCard'
import { ForecastDays } from './ForecastDays'
import { HourlyForecast } from './HourlyForecast'
import styles from './WeatherView.module.scss'

type WeatherViewProps = {
  location: GeocodingApiLocation | UserLocation | null
  onSelectLocation: (location: GeocodingApiLocation | UserLocation | null) => void
}

const EUROPE_DESTINATIONS: Array<{ name: string; latitude: number; longitude: number }> = [
  { name: 'Helsinki', latitude: 60.1699, longitude: 24.9384 },
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Amsterdam', latitude: 52.3676, longitude: 4.9041 },
  { name: 'Vienna', latitude: 48.2082, longitude: 16.3738 },
  { name: 'Lisbon', latitude: 38.7223, longitude: -9.1393 },
]

function formatLocationLabel(location: GeocodingApiLocation | UserLocation | null): string {
  if (!location) {
    return ''
  }

  if ('name' in location) {
    return [location.name, location.admin1, location.country].filter(Boolean).join(', ')
  }

  return location.label ?? ''
}

function LoadingView() {
  return (
    <div className={styles.loadingGrid}>
      <div className={styles.skeletonPanel} />
      <div className={styles.skeletonPanel} />
    </div>
  )
}

export function WeatherView({ location, onSelectLocation }: WeatherViewProps) {
  const { forecast, loading, error } = useForecast(location as GeocodingApiLocation)
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
        action={
          <div className={styles.emptyStateAction}>
            <p className={styles.emptyStateLabel}></p>
            <div className={styles.emptyStateChips}>
              {EUROPE_DESTINATIONS.map((city) => (
                <button
                  key={city.name}
                  className={styles.emptyStateChip}
                  type="button"
                  onClick={() =>
                    onSelectLocation({
                      latitude: city.latitude,
                      longitude: city.longitude,
                      label: city.name,
                    })
                  }
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        }
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
