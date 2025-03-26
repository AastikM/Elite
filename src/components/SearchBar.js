import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleSearch = async () => {
    if (!isOnline) {
      alert('You are offline. Search is not available.');
      return;
    }

    const newCity = { name: query, temperature: null };
    onSearch(newCity);
    setQuery('');
  };

  // Listen for online/offline events
  window.addEventListener('online', () => setIsOnline(true));
  window.addEventListener('offline', () => setIsOnline(false));

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter city name"
        disabled={!isOnline}
      />
      <button onClick={handleSearch} disabled={!isOnline}>
        Search
      </button>
      {!isOnline && <p>You are offline. Search is not available.</p>}
    </div>
  );
};

export default SearchBar;