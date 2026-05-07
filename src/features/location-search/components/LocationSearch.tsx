import { useMemo, useState } from 'react'

import { useLocationSearch } from '../hooks/useLocationSearch'
import type { GeocodingApiLocation } from '../types'
import { SearchResults } from './SearchResults'
import styles from './LocationSearch.module.scss'

type LocationSearchProps = {
  selectedLocation?: GeocodingApiLocation | null
  onSelectLocation: (location: GeocodingApiLocation) => void
  onClearSelection?: () => void
}

function formatResultLabel(location: GeocodingApiLocation): string {
  return [location.name, location.admin1, location.country].filter(Boolean).join(', ')
}

export function LocationSearch({ selectedLocation, onSelectLocation, onClearSelection }: LocationSearchProps) {
  const [query, setQuery] = useState(selectedLocation ? formatResultLabel(selectedLocation) : '')
  const [isFocused, setIsFocused] = useState(false)

  const { locations, loading, error } = useLocationSearch(query)

  const hasQuery = query.trim().length > 0
  const isMinLength = query.trim().length >= 2
  const shouldShowResults = isFocused && hasQuery

  const results = useMemo(() => locations ?? [], [locations])

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

        {shouldShowResults ? (
          <SearchResults
            results={results}
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
