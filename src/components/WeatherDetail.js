import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWeather } from '../utils/weatherAPI';
import localforage from 'localforage';
import './WeatherDetail.css';

const WeatherDetail = () => {
  const { cityName } = useParams();
  const navigate = useNavigate(); // Add useNavigate
  const [weather, setWeather] = useState(null);
  const [note, setNote] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchWeather(cityName);
      if (data) {
        setWeather(data);
      } else {
        alert('Failed to fetch weather data.');
      }
    };
  
    const loadNote = async () => {
      const savedNote = await localforage.getItem(`note_${cityName}`);
      if (savedNote) {
        setNote(savedNote);
      }
    };
  
    fetchData();
    loadNote();
  }, [cityName]);

  const handleSaveNote = async () => {
    await localforage.setItem(`note_${cityName}`, note);
    setIsEditing(false);
    alert('Note saved!');
  };

  const handleDeleteNote = async () => {
    await localforage.removeItem(`note_${cityName}`);
    setNote('');
    alert('Note deleted!');
  };

  if (!weather) return <div>Loading...</div>;

  return (
    <div>
      <div className="header">
        <button onClick={() => navigate('/')} className="back-button">
          ←
        </button>
        <h1 className="city-name">{cityName}</h1>
      </div>
      <p>Temperature: {weather.current.temp_c}°C</p>
      <p>Condition: {weather.current.condition.text}</p>
      <p>Humidity: {weather.current.humidity}%</p>
      <p>Wind Speed: {weather.current.wind_kph} km/h</p>

      <h2>Notes</h2>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows="5"
        cols="50"
        placeholder="Enter your notes here..."
        disabled={!isEditing}
      />
      <br />
      {isEditing ? (
        <>
          <button onClick={handleSaveNote}>Save Note</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <button onClick={() => setIsEditing(true)}>Edit Note</button>
          <button onClick={handleDeleteNote}>Delete Note</button>
        </>
      )}
    </div>
  );
};

export default WeatherDetail;