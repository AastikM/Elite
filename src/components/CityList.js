import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchWeather } from '../utils/weatherAPI';
import { DEFAULT_CITIES } from '../utils/constants';
import SearchBar from './SearchBar';
import useLocalStorage from '../hooks/useLocalStorage';
import localforage from 'localforage';
import './CityList.css';
// const [notes, setNotes] = useState({}); // Add this line

const CityList = () => {
  const [cities, setCities] = useState([]);
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  const [locationError, setLocationError] = useState('');
  const [notes, setNotes] = useState({}); // Store notes for each city
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialWeather = async () => {
      const weatherData = await Promise.all(
        DEFAULT_CITIES.map(async (city) => {
          const data = await fetchWeather(city);
          if (!data || !data.current) {
            // If offline or API fails, try to load cached data
            const cachedData = await localforage.getItem(`weather_${city}`);
            if (cachedData && cachedData.current) {
              return { name: city, temperature: cachedData.current.temp_c };
            } else {
              return null;
            }
          }
          return { name: city, temperature: data.current.temp_c };
        })
      );
      setCities(weatherData.filter((city) => city !== null));
    };
    const loadNotes = async () => {
      const notesData = {};
      for (const city of DEFAULT_CITIES) {
        const note = await localforage.getItem(`note_${city}`);
        if (note) {
          notesData[city] = note;
        }
      }
      setNotes(notesData);
    };
  
    fetchInitialWeather();
    loadNotes();

  }, []);

  const fetchCityFromCoordinates = async (latitude, longitude) => {
    try {
      // Use a reverse geocoding API to get the city name from coordinates
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      const cityName = data.city;

      if (cityName) {
        // Redirect to the city details page
        navigate(`/city/${cityName}`);
      }
    } catch (error) {
      console.error('Error fetching city from coordinates:', error);
      setLocationError('Unable to fetch your location.');
    }
  };

  const handleRequestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCityFromCoordinates(latitude, longitude);
        },
        (error) => {
          setLocationError('Unable to retrieve your location.');
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  };

  const handleAddCity = async (newCity) => {
    const data = await fetchWeather(newCity.name);
    if (data && data.current) {
      setCities((prevCities) => [{ name: newCity.name, temperature: data.current.temp_c }, ...prevCities]);
    } else {
      // If offline or API fails, try to load cached data
      const cachedData = await localforage.getItem(`weather_${newCity.name}`);
      if (cachedData && cachedData.current) {
        setCities((prevCities) => [
          { name: newCity.name, temperature: cachedData.current.temp_c },
          ...prevCities,
        ]);
      } else {
        alert('You are offline, and no cached data is available for this city.');
      }
    }
  };

  const toggleFavorite = (cityName) => {
    if (favorites.includes(cityName)) {
      setFavorites(favorites.filter((city) => city !== cityName));
    } else {
      setFavorites([...favorites, cityName]);
    }
  };

  const handleRemoveCity = (cityName) => {
    setCities((prevCities) => prevCities.filter((city) => city.name !== cityName));
  };

  return (
    <div>
      <div className="header">
      <h1>Weather App</h1>
      <button onClick={handleRequestLocation}>Get My Location</button>
      </div>
      {locationError && <p>{locationError}</p>}
      <SearchBar onSearch={handleAddCity} />
      <h2>Favorites</h2>
      <ul>
        {favorites.map((city, index) => (
          <li key={index} className="city-item">
            <Link to={`/city/${city}`}>{city}</Link>
            <button onClick={() => toggleFavorite(city)}>Remove from Favorites</button>
          </li>
        ))}
      </ul>
      <h2>All Cities</h2>
      <ul>
        {cities.map((city, index) => (
          <li key={index} className="city-item">
            <Link to={`/city/${city.name}`}>
              {city.name}: {city.temperature}°C
              {notes[city.name] && <span className="note-indicator"> 📝</span>} {/* Add this line */}
            </Link>
            <div>
              <button onClick={() => toggleFavorite(city.name)}>
                {favorites.includes(city.name) ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
              <button className="remove" onClick={() => handleRemoveCity(city.name)}>Remove</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CityList;