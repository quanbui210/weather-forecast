export type GeocodingApiLocation = {
    id: number,
    name: string,
    latitude: number,
    longitude: number,
    elevation: number,
    feature_code: string,
    country_code: string,
    admin1_id: number,
    timezone: string,
    population: number,
    country_id: number,
    country: string,
    admin1: string
}

export type UserLocation = {
  latitude: number,
  longitude: number,
  label?: string,
}

export type LocationSearchResponse = {
  results?: GeocodingApiLocation[]
}
