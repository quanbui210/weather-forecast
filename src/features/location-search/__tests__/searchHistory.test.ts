import { useLocationSearch } from "../hooks/useLocationSearch";
import { searchLocations } from "../api";
import type { GeocodingApiLocation } from "../types";
import { act, renderHook, waitFor } from "@testing-library/react";


vi.mock("../api") // mock the whole module to avoid real network calls (mock search locations)
const mockData: GeocodingApiLocation[] = [
      {
        id: 1,
        name: 'London',
        latitude: 51.5074,
        longitude: -0.1278,
        elevation: 0,
        feature_code: 'city',
        country_code: 'GB',
        admin1_id: 123,
        timezone: 'Europe/London',
        country_id: 123,
        country: 'United Kingdom',
        admin1: 'London',
        population: 8618000,
      },
]


describe("test hook", () => {
  beforeEach(() => {// clean testing environment
    vi.useFakeTimers() // delays for debounce search, fake timers instead of relying on real delay
    vi.clearAllMocks()  // reset call counts, resetAllMocks when want full isolation and different mock behavior per test
  })
  afterEach(() => {
    vi.useRealTimers() //r restore real timers to avoid leaking fake timer behavior into other tests
  })

  it("should fetch when condition is fulfilled, wait for delay and return location data when success", async () => {
    // mock so test does not hit real network, we don't want to test the backend but the hook behavior
    vi.mocked(searchLocations).mockResolvedValue(mockData) 

    // simulate a component using the hook
    // control the hook input and re-render like React wwhen prop changes
    const {result, rerender} = renderHook((({query}) => useLocationSearch(query)), {
      initialProps: {query: ""}
    })

    rerender({query: "L"}) // simulate user typing, should not being called because condition is query length > 2
    await act(async () => {
      vi.advanceTimersByTime(350)
    })
    expect(searchLocations).not.toHaveBeenCalled() // not being called even after delay
    rerender({query: "London"})

    await act(async () => {
      vi.advanceTimersByTime(350)
    })
    expect(searchLocations).toHaveBeenCalledTimes(1)
    expect(searchLocations).toHaveBeenCalledWith({
      query: "London",
      signal: expect.any(AbortSignal)
    })
    vi.useRealTimers()
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
    expect(result.current.locations).toEqual(mockData)
  })

  it("should stop fetching if component unmount", () => {
    const abortSpy = vi.spyOn(AbortController.prototype, "abort")

    vi.mocked(searchLocations).mockImplementation(
      () => new Promise(() => {}) // never resolves
    )
    const {unmount} = renderHook(() => useLocationSearch("London"))

    unmount()
    expect(abortSpy).toHaveBeenCalled()
  })
}) 

