import React, { useState } from 'react';
import { Form, FormControl, Button } from 'react-bootstrap';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (event) => {
    event.preventDefault(); 
    onSearch(searchTerm); 
  };
  
  return (
    <Form className="d-flex" onSubmit={handleSearchSubmit}>
      <FormControl
        type="search"
        placeholder="Search for a location..."
        className="me-2"
        aria-label="Search"
        value={searchTerm}
    
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {}
      <Button variant="outline-success" type="submit">Search</Button>
    </Form>
  );
};

export default SearchBar;
