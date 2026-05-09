import type { SearchHistoryItem } from '../types'
import styles from './LocationSearch.module.scss'
import historyIcon from '../../../assets/history.svg'
import deleteIcon from '../../../assets/delete-icon.svg'

type SearchHistoryListProps = {
  searchHistory: SearchHistoryItem[]
  onSelectHistory: (item: SearchHistoryItem) => void
  onRemoveHistory: (key: string) => void
}

export default function SearchHistoryList({
  searchHistory,
  onSelectHistory,
  onRemoveHistory,
}: SearchHistoryListProps) {
  return (
    <div className={styles.dropdown} role="listbox" aria-label="Search history">
      <p className={styles.historyHeading}>Recent searches</p>
      {searchHistory.length === 0 ? (
        <p className={styles.empty}>No recent searches yet.</p>
      ) : (
        <ul className={styles.historyList}>
          {searchHistory.map((item) => (
            <li key={item.key} className={styles.historyItem}>
              <button
                className={styles.historyButton}
                type="button"
                role="option"
                onMouseDown={() => onSelectHistory(item)}
              >
                <img className={styles.historyIcon} src={historyIcon} alt="" aria-hidden="true" />
                <span className={styles.historyLabel}>{item.label}</span>
              </button>

              <button
                className={styles.historyRemoveButton}
                type="button"
                aria-label={`Remove ${item.label} from search history`}
                onMouseDown={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  onRemoveHistory(item.key)
                }}
              >
                <img className={styles.trashIcon} src={deleteIcon} alt="" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
