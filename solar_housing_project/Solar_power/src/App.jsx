import React, { useState } from 'react';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Title from './components/title'
import SearchBar from './components/SearchBar.jsx';
import Map from './components/Map.jsx';
import SelectRadius from './components/SelectRadius';
import AboutUs from './components/about_us'
import ContactUs from './components/contact_us'
import Results from "./components/results"
import Legends from "./components/legends"

function App() {
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState(10);
  
  const handleSearch = async (searchTerm) => {
    try {
      const apiKey = 'aDbZPhVJ-WCBKef9CkpQf5jyTn4'; 
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

    <Title />
    <SearchBar onSearch={handleSearch} />
    <Map location={location} />
    <SelectRadius
        selectedRadius={radius}
        onRadiusChange={setRadius}
      />
    <Results />
    <Legends />
    <AboutUs />
    <ContactUs />
    
    
    </>
  );
}

export default App
