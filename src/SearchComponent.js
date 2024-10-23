import React, { useState } from 'react';
import './SearchComponent.css';
const { ipcRenderer } = window.require('electron');

function SearchComponent({ maxResults, directoryPath, onSearchStart, onSearchComplete }) {
  const [input, setInput] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearchStart();
      try {
        const command = `python python/semantic_search.py "${input}" "${directoryPath}"`;
        await ipcRenderer.invoke('run-command', command);
        
        const searchResults = await ipcRenderer.invoke('read-file', 'semantic_distances.json');
        const parsedResults = JSON.parse(searchResults);
        
        const results = Object.entries(parsedResults).sort((a, b) => b[1] - a[1]).slice(0, maxResults);
        onSearchComplete(results);
      } catch (error) {
        console.error('Error during search:', error);
        onSearchComplete([['Error', error.message]]);
      }
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
