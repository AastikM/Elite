import axios from 'axios';
import localforage from 'localforage';

const API_KEY = '975ea31eb7f84aba802172832251403'; // Replace with your API key from weatherstack.com
const BASE_URL = 'http://api.weatherapi.com/v1/current.json';

export const fetchWeather = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${city}`);
    console.log('API Response:', response.data);

    // Cache the response in localforage
    await localforage.setItem(`weather_${city}`, response.data);

    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);

    // If offline, try to load cached data
    const cachedData = await localforage.getItem(`weather_${city}`);
    if (cachedData) {
      console.log('Using cached data for:', city);
      return cachedData;
    } else {
      return null;
    }
  }
};