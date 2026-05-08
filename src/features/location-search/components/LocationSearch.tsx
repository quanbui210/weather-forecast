import { useState } from 'react'

import { useLocationSearch } from '../hooks/useLocationSearch'
import type { GeocodingApiLocation, UserLocation } from '../types'
import { SearchResults } from './SearchResults'
import styles from './LocationSearch.module.scss'
import locationIcon from '../../../../public/my-location.svg'

type LocationSearchProps = {
  selectedLocation?: GeocodingApiLocation | null | UserLocation
  onSelectLocation: (location: GeocodingApiLocation | UserLocation | null) => void
  onClearSelection?: () => void
}

function formatResultLabel(location: GeocodingApiLocation | UserLocation): string {
  if ((location as GeocodingApiLocation).name) {
    return [(location as GeocodingApiLocation).name, (location as GeocodingApiLocation).admin1, (location as GeocodingApiLocation).country].filter(Boolean).join(', ')
  }

  return (location as UserLocation).label ?? ''
}

export function LocationSearch({ selectedLocation, onSelectLocation, onClearSelection }: LocationSearchProps) {
  const [query, setQuery] = useState(selectedLocation ? formatResultLabel(selectedLocation) : '')
  const [isFocused, setIsFocused] = useState(false)
  const { locations, loading, error } = useLocationSearch(query)
  const hasQuery = query.trim().length > 0
  const isMinLength = query.trim().length >= 2
  const shouldShowResults = isFocused && hasQuery
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
        const {latitude,longitude} = position.coords
        console.log("latitude: ",latitude)
        console.log("longitude: ",longitude)
        onSelectLocation({latitude:latitude,longitude:longitude, label: 'Current location'})
      })
    }
  }
  function handleSelect(location: GeocodingApiLocation) {
    onSelectLocation(location)
    setQuery(formatResultLabel(location))
    setIsFocused(false)
  }

  function handleClear() {
    onClearSelection?.()
    setQuery('')
    setIsFocused(true)
  }

  return (
    <div className={styles.search}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Location</p>
          <h2 className={styles.title}>Find a city</h2>
        </div>
        {selectedLocation ? (
          <button className={styles.clearButton} type="button" onClick={handleClear}>
            Clear
          </button>
        ) : null}
      </div>

      <div className={styles.field}>
        <input
          className={styles.input}
          type="text"
          value={query}
          placeholder="Search a city"
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            window.setTimeout(() => {
              setIsFocused(false)
            }, 120)
          }}
          aria-label="Search locations"
          autoComplete="off"
          inputMode="search"
        />
        <button className={styles.locationButton} type="button" onClick={() => {
          getUserLocation()
          setQuery('')
          setIsFocused(true)
        }}><i><img src={locationIcon} alt="location icon" /></i></button>
        {shouldShowResults ? (
          <SearchResults
            results={locations}
            isLoading={loading}
            error={error ?? null}
            hasQuery={hasQuery}
            isMinLength={isMinLength}
            onSelect={handleSelect}
          />
        ) : null}
      </div>
    </div>
  )
}
