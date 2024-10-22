import React, { useState } from 'react';
const { ipcRenderer } = window.require('electron');

function SearchComponent() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      await ipcRenderer.invoke('run-search', input);
      const searchResults = await ipcRenderer.invoke('get-results');
      setResults(Object.entries(searchResults).sort((a, b) => b[1] - a[1]));
    } catch (error) {
      console.error('Error during search:', error);
    }
    setIsSearching(false);
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter search query"
        />
        <button onClick={handleSearch} disabled={isSearching}>
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </div>
      <div>
        <h2>Results:</h2>
        {results.map(([name, similarity]) => (
          <div key={name}>
            {name}: {similarity.toFixed(4)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchComponent;
