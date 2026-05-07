import type { GeocodingApiLocation } from '../types'
import styles from './LocationSearch.module.scss'

type SearchResultsProps = {
  results: GeocodingApiLocation[]
  isLoading: boolean
  error: string | null
  hasQuery: boolean
  isMinLength: boolean
  onSelect: (location: GeocodingApiLocation) => void
}

function formatResultLabel(location: GeocodingApiLocation): string {
  return [location.name, location.admin1, location.country].filter(Boolean).join(', ')
}

function getResultKey(location: GeocodingApiLocation): string {
  if (location.id) {
    return String(location.id)
  }

  return `${location.latitude}:${location.longitude}:${location.name}`
}

export function SearchResults({ results, isLoading, error, hasQuery, isMinLength, onSelect }: SearchResultsProps) {
  if (!hasQuery) {
    return null
  }

  return (
    <div className={styles.dropdown} role="listbox" aria-label="Location results">
      {!isMinLength ? <p className={styles.empty}>Type at least 2 characters.</p> : null}
      {isMinLength && isLoading ? <p className={styles.empty}>Searching...</p> : null}
      {isMinLength && !isLoading && error ? <p className={styles.empty}>{error}</p> : null}
      {isMinLength && !isLoading && !error && results.length === 0 ? (
        <p className={styles.empty}>No matching cities.</p>
      ) : null}
      {isMinLength && !isLoading && !error && results.length > 0 ? (
        <ul className={styles.resultsList}>
          {results.map((location) => (
            <li key={getResultKey(location)}>
              <button
                className={styles.resultButton}
                type="button"
                role="option"
                onMouseDown={() => onSelect(location)}
              >
                <span className={styles.resultPrimary}>{formatResultLabel(location)}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
