import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocationSearch } from '../components/LocationSearch'
import { vi } from 'vitest'


vi.mock('../hooks/useLocationSearch', () => ({
  useLocationSearch: () => ({ locations: [], loading: false, error: null }),
}))


it ("shows history from localStorage when input focused and query is empty", async () => {
    // const input = screen.getByRole('textarea')
    const user = userEvent.setup()
    localStorage.setItem('weather.searchHistory', JSON.stringify([
        { key: '1', label: 'Helsinki', latitude: 1, longitude: 2, savedAt: 1 },
    ]))
    render(<LocationSearch onSelectLocation={vi.fn()} />)

    await user.click(screen.getByLabelText('Search locations'))
    expect(screen.getByText('Recent searches')).toBeInTheDocument()
    expect(screen.getByText('Helsinki')).toBeInTheDocument()
})