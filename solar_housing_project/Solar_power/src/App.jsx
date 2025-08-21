import React, { useState } from 'react';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchBar from './components/SearchBar.jsx';
import Map from './components/Map.jsx';

function App() {
  const [location, setLocation] = useState(null);
  
  const handleSearch = async (searchTerm) => {
    try {
      const apiKey = 'YOUR_OPENCAGE_API_KEY'; 
      const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(searchTerm)}&key=${apiKey}&countrycode=us&bounds=-79.76,40.50,-71.86,45.01`);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setLocation({ lat, lng });
      } else {
        console.error('Location not found');
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };
  
  return (
    <>
    <SearchBar onSearch={handleSearch} />
    <Map location={location} />
    </>
  );
}

export default App
