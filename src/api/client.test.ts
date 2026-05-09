import { describe, it, expect, vi, afterEach } from "vitest";
import { buildQueryParams, generalFetcher } from "./client";


describe("buildQueryParams", () => {
  it("should build query params", () => {
    const queryParams = buildQueryParams({
        latitude: 52.520008,
        longitude: 13.405005,
        hours: 24,
    })
    expect(queryParams).toBe("latitude=52.520008&longitude=13.405005&hours=24");
  });
  it("should ignore empty and null params", () => {
    const queryParams = buildQueryParams({
        latitude: 52.520008,
        hourly:undefined,
        longitude: 13.405005,
        daily: "",
        timezone: null,
    })
    expect(queryParams).toBe("latitude=52.520008&longitude=13.405005");
  })
});



describe("generalFetcher", () => {
  it('calls fetch with correct url and returns json', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ results: [] }),
    })))
  
    const data = await generalFetcher('https://geocoding-api.open-meteo.com/v1/search', {
      name: 'Helsinki',
      count: 1,
      language: 'en',
    })
  
    expect(data).toEqual({ results: [] })
    const calledUrl = fetch.mock.calls[0][0] as string
    const url = new URL(calledUrl)
    expect(url.searchParams.get('name')).toBe('Helsinki')
  })

})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})