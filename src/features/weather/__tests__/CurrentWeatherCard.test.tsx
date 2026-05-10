import {render, screen} from '@testing-library/react'
import { CurrentWeatherCard } from '../components/CurrentWeatherCard'
import { describe, it, expect } from 'vitest'


const mockCurrentWeather = {
        humidity: 59,
        isDay: true,
        temperature: 14,
        time: "2025-05-10T16:00",
        weatherCode: 3, 
        windSpeed: 19.4
}

describe("render the component", () => {
    it("should show current card", () => {
        render(
            <CurrentWeatherCard weather={mockCurrentWeather} locationLabel={"Helsinki"} timezone={"Europe/Helsinki"} />
        );
        expect(screen.getByText("Helsinki")).toBeInTheDocument()
        expect(screen.getByText("Humidity 59%")).toBeInTheDocument()
        expect(screen.getByText("Wind 19 km/h")).toBeInTheDocument()
    })
})