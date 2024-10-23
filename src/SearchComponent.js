import React, { useState } from 'react';
import './SearchComponent.css';

function SearchComponent({ onSearch }) {
  const [input, setInput] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input);
    }
  };

  return (
    <div className="search-component">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search..."
          className="search-input"
        />
      </form>
    </div>
  );
}

export default SearchComponent;
