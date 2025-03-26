import { useState, useEffect } from 'react';
import localforage from 'localforage';

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(initialValue);

  useEffect(() => {
    const loadValue = async () => {
      const value = await localforage.getItem(key);
      if (value !== null) setStoredValue(value);
    };
    loadValue();
  }, [key]);

  const setValue = async (value) => {
    setStoredValue(value);
    await localforage.setItem(key, value);
  };

  return [storedValue, setValue];
};

export default useLocalStorage;