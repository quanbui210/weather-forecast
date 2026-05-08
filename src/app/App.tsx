import styles from './App.module.scss'
import { LocationSearch, type GeocodingApiLocation, type UserLocation } from '../features/location-search'
import { WeatherView } from '../features/weather'
import { useState } from 'react'

function App() {
  const [selectedLocation, setSelectedLocation] = useState<GeocodingApiLocation | UserLocation | null>(null)
  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Weather Forecast</h1>
        </header>

        <section className={styles.searchPanel}>
          <LocationSearch
            selectedLocation={selectedLocation}
            onSelectLocation={setSelectedLocation}
            onClearSelection={() => setSelectedLocation(null)}
          />
        </section>

        <WeatherView location={selectedLocation} onSelectLocation={setSelectedLocation} />
      </main>
    </div>
  )
}

export default App
