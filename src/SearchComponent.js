import React, { useState, useEffect } from 'react';
const { ipcRenderer } = window.require('electron');

function SearchComponent() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [customNames, setCustomNames] = useState('');
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

  const handleSaveNames = async () => {
    const names = customNames.split(',').map(name => name.trim());
    try {
      await ipcRenderer.invoke('save-names', names);
      alert('Names saved successfully!');
    } catch (error) {
      console.error('Error saving names:', error);
      alert('Error saving names. Please try again.');
    }
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
        <textarea
          value={customNames}
          onChange={(e) => setCustomNames(e.target.value)}
          placeholder="Enter custom names, separated by commas"
        />
        <button onClick={handleSaveNames}>Save Names</button>
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
