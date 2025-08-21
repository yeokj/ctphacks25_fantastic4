import React from 'react';
import './App.css'; 
import SearchBar from './search_bar.js'; 

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Find the best location for solar energy.
        </p>
        {/* Render the search bar component here */}
        <SearchBar /> 
      </header>
    </div>
  );
}

export default App;