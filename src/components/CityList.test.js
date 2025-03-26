const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
const CityList = require('./CityList').default;
const { DEFAULT_CITIES } = require('../utils/constants');
// const { Link } = require('react-router-dom');
import { Link } from 'react-router-dom';


// Mock fetchWeather function
jest.mock('../utils/weatherAPI', () => ({
  fetchWeather: jest.fn(() => Promise.resolve({ current: { temperature: 25 } })),
}));

describe('CityList Component', () => {
  it('renders the default cities', async () => {
    render(<CityList />);
    for (const city of DEFAULT_CITIES) {
      expect(await screen.findByText(city)).toBeInTheDocument();
    }
  });

  it('allows adding a new city', async () => {
    render(<CityList />);
    const input = screen.getByPlaceholderText('Enter city name');
    const button = screen.getByText('Search');

    fireEvent.change(input, { target: { value: 'London' } });
    fireEvent.click(button);

    expect(await screen.findByText('London')).toBeInTheDocument();
  });
});