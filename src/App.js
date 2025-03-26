import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CityList from './components/CityList';
import WeatherDetail from './components/WeatherDetail';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CityList />} />
        <Route path="/city/:cityName" element={<WeatherDetail />} />
      </Routes>
    </Router>
  );
};

export default App;