import React, { useState } from 'react';
const { ipcRenderer } = window.require('electron');

function SearchComponent() {
  const [input, setInput] = useState('');
  const [maxResults, setMaxResults] = useState(5);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      await ipcRenderer.invoke('run-search', input);
      const searchResults = await ipcRenderer.invoke('get-results', maxResults);
      setResults(Object.entries(searchResults).sort((a, b) => b[1] - a[1]).slice(0, maxResults));
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
        <input
          type="number"
          value={maxResults}
          onChange={(e) => setMaxResults(Math.max(1, parseInt(e.target.value) || 1))}
          min="1"
          placeholder="Max results"
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
