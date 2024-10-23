import React, { useState, useEffect } from 'react';
import SearchComponent from './SearchComponent';
import './App.css';
const { ipcRenderer } = window.require('electron');

function App() {
  const [directoryPath, setDirectoryPath] = useState('');
  const [maxResults, setMaxResults] = useState(5);

  useEffect(() => {
    ipcRenderer.invoke('read-file', 'config.json')
      .then(JSON.parse)
      .then(config => setDirectoryPath(config.directoryPath))
      .catch(console.error);
  }, []);

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
      <SearchComponent maxResults={maxResults} directoryPath={directoryPath} />
    </div>
  );
}

export default App;
