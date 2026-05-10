import { useEffect, useState } from 'react'

import { useLocationSearch } from '../hooks/useLocationSearch'
import type { GeocodingApiLocation, SearchHistoryItem, UserLocation } from '../types'
import { SearchResults } from './SearchResults'
import styles from './LocationSearch.module.scss'
import locationIcon from '../../../assets/my-location.svg'
import SearchHistoryList from './SearchHistoryList'

type LocationSearchProps = {
  selectedLocation?: GeocodingApiLocation | null | UserLocation
  onSelectLocation: (location: GeocodingApiLocation | UserLocation | null) => void
  onClearSelection?: () => void
}

function formatResultLabel(location: GeocodingApiLocation | UserLocation): string {
  if ((location as GeocodingApiLocation).name) {
    return [
      (location as GeocodingApiLocation).name,
      (location as GeocodingApiLocation).admin1,
      (location as GeocodingApiLocation).country,
    ]
      .filter(Boolean)
      .join(', ')
  }
  return (location as UserLocation).label ?? ''
}

function loadSearchHistory(): SearchHistoryItem[] {
  if (typeof window === 'undefined') {
    return []
  }
  const raw = localStorage.getItem('weather.searchHistory')
  if (!raw) return []
  const parsed = JSON.parse(raw) as SearchHistoryItem[]
  return Array.isArray(parsed) ? parsed.slice(0, 5) : []
}

export function LocationSearch({
  selectedLocation,
  onSelectLocation,
  onClearSelection,
}: LocationSearchProps) {
  const [query, setQuery] = useState(selectedLocation ? formatResultLabel(selectedLocation) : '')
  const [isFocused, setIsFocused] = useState(false)
  const { locations, loading, error } = useLocationSearch(query)
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(loadSearchHistory)
  const hasQuery = query.trim().length > 0
  const isMinLength = query.trim().length >= 2
  const shouldShowResults = isFocused && hasQuery
  const shouldShowHistory = isFocused && !hasQuery

  function buildHistoryItem(location: GeocodingApiLocation): SearchHistoryItem {
    const label = formatResultLabel(location)
    const key = location.id
      ? String(location.id)
      : `${location.latitude}:${location.longitude}:${location.name}`
    return {
      key,
      label,
      latitude: location.latitude,
      longitude: location.longitude,
      savedAt: Date.now(),
    }
  }

  function addToHistory(location: GeocodingApiLocation) {
    const nextItem = buildHistoryItem(location)
    setSearchHistory((previous) => {
      const deduped = previous.filter((item) => item.key !== nextItem.key)
      return [nextItem, ...deduped].slice(0, 5)
    })
  }

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        onSelectLocation({ latitude: latitude, longitude: longitude, label: 'Current location' })
      })
    }
  }
  function handleSelect(location: GeocodingApiLocation) {
    const formattedResult = formatResultLabel(location)
    addToHistory(location)
    onSelectLocation(location)
    setQuery(formattedResult)
    setIsFocused(false)
  }

  function handleHistorySelect(item: SearchHistoryItem) {
    onSelectLocation({
      latitude: item.latitude,
      longitude: item.longitude,
      label: item.label,
    })
    setQuery(item.label)
    setIsFocused(false)
  }

  function handleRemoveHistory(key: string) {
    setSearchHistory((previous) => previous.filter((item) => item.key !== key))
  }

  function handleClear() {
    onClearSelection?.()
    setQuery('')
    setIsFocused(false)
  }

  useEffect(() => {
    localStorage.setItem('weather.searchHistory', JSON.stringify(searchHistory))
  }, [searchHistory])

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
        <button
          className={styles.locationButton}
          type="button"
          title="Use current location"
          aria-label="Use current location"
          onClick={() => {
            getUserLocation()
            setQuery('')
          }}
        >
          <img className={styles.locationButtonIcon} src={locationIcon} alt="" aria-hidden="true" />
        </button>
        {shouldShowHistory ? (
          <SearchHistoryList
            searchHistory={searchHistory}
            onSelectHistory={handleHistorySelect}
            onRemoveHistory={handleRemoveHistory}
          />
        ) : null}
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
