import styles from './App.module.scss'
import { LocationSearch, type GeocodingApiLocation } from '../features/location-search'
import { useState } from 'react'
function App() {
  const [selectedLocation, setSelectedLocation] = useState<GeocodingApiLocation | null>(null)
  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <h1>Weather</h1>
        <LocationSearch
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
          onClearSelection={() => setSelectedLocation(null)}
        />
       
      </main>
    </div>
  )
}

export default App
