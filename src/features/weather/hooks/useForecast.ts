import { useEffect, useState } from 'react';
import { getWeatherForecast } from '../api';
import { mapForecast } from '../model/mappers';
import type { ForecastViewModel } from '../types';

export const useForecast = (location: {
    latitude: number
    longitude: number
} | null): {
    forecast: ForecastViewModel | null
    error: Error | null
    loading: boolean
} => {
    const [forecast, setForecast] = useState<ForecastViewModel | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    
    useEffect(() => {
        if (!location) {
            return
        }

        const controller = new AbortController()
        const fetch = async () => {
            try {
                setLoading(true)
                setError(null)
                const response = await getWeatherForecast({
                latitude: location.latitude,
                longitude: location.longitude,
            }, controller.signal);
        setForecast(mapForecast(response));
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                return
            }

            setForecast(null)
            setError(error instanceof Error ? error : new Error('Unknown error'))
        } finally {
            if (!controller.signal.aborted) {
                setLoading(false)
            }
        }
        }
        void fetch()

        return () => controller.abort()
    }, [location])
    return {
        forecast,
        error,
        loading
    }
}
