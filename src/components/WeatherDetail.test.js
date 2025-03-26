const { render, screen, act } = require('@testing-library/react');
import { BrowserRouter as Router } from 'react-router-dom';
const WeatherDetail = require('./WeatherDetail').default;

// Mock fetchWeather function
jest.mock('../utils/weatherAPI', () => ({
  fetchWeather: jest.fn(() =>
    Promise.resolve({
      current: { temperature: 25, weather_descriptions: ['Sunny'], humidity: 60, wind_speed: 10 },
    })
  ),
}));

describe('WeatherDetail Component', () => {
  it('renders weather details for a city', async () => {
    await act(async () => {
      render(
        <Router>
          <WeatherDetail />
        </Router>
      );
    });

    expect(await screen.findByText('Temperature: 25°C')).toBeInTheDocument();
    expect(await screen.findByText('Weather: Sunny')).toBeInTheDocument();
    expect(await screen.findByText('Humidity: 60%')).toBeInTheDocument();
    expect(await screen.findByText('Wind Speed: 10 km/h')).toBeInTheDocument();
  });
});