import React, { useState, useEffect } from 'react';
import SearchComponent from './SearchComponent';
const { ipcRenderer } = window.require('electron');

function App() {
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [directoryPath, setDirectoryPath] = useState('');
  const [maxResults, setMaxResults] = useState(5);

  useEffect(() => {
    ipcRenderer.invoke('read-file', 'config.json')
      .then(JSON.parse)
      .then(config => setDirectoryPath(config.directoryPath))
      .catch(console.error);
  }, []);

  const handleSearch = async (input) => {
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
  };

  const handleDirectorySelect = async () => {
    const result = await ipcRenderer.invoke('select-directory');
    if (result) {
      setDirectoryPath(result);
      await ipcRenderer.invoke('write-file', 'config.json', JSON.stringify({ directoryPath: result }));
    }
  };

  return (
    <div className="App">
      <h1>Semantic Search</h1>
      <div>
        <input
          type="text"
          value={directoryPath}
          readOnly
          placeholder="Select directory"
        />
        <button onClick={handleDirectorySelect}>Select Directory</button>
        <input
          type="number"
          value={maxResults}
          onChange={(e) => setMaxResults(Math.max(1, parseInt(e.target.value) || 1))}
          min="1"
          placeholder="Max results"
        />
      </div>
      <SearchComponent onSearch={handleSearch} />
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

export default App;
