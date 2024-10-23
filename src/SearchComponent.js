import React, { useState } from 'react';
import './SearchComponent.css';
const { ipcRenderer } = window.require('electron');

function SearchComponent({ maxResults, directoryPath }) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      setIsSearching(true);
      try {
        const command = `python python/semantic_search.py "${input}" "${directoryPath}"`;
        await ipcRenderer.invoke('run-command', command);
        
        const searchResults = await ipcRenderer.invoke('read-file', 'semantic_distances.json');
        const parsedResults = JSON.parse(searchResults);
        
        setResults(Object.entries(parsedResults).sort((a, b) => b[1] - a[1]).slice(0, maxResults));
      } catch (error) {
        console.error('Error during search:', error);
        setResults([['Error', error.message]]);
      }
      setIsSearching(false);
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
      {isSearching ? (
        <p>Searching...</p>
      ) : (
        <div>
          <h2>Results:</h2>
          {results.map(([name, similarity]) => (
            <div key={name}>
              {name}: {similarity.toFixed(4)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchComponent;
