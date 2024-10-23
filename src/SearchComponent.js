import React, { useState, useEffect } from 'react';
import path from 'path';
import './SearchComponent.css';
const { ipcRenderer } = window.require('electron');

function SearchComponent({ maxResults, directoryPath, onSearchStart, onSearchComplete }) {
  const [input, setInput] = useState('');
  const [pythonPath, setPythonPath] = useState('');

  useEffect(() => {
    setupPythonEnvironment();
  }, []);

  const setupPythonEnvironment = async () => {
    const componentDir = __dirname;
    const venvPath = path.join(componentDir, '..', 'venv');
    const venvPythonPath = path.join(venvPath, 'bin', 'python');
    const requirementsPath = path.join(componentDir, '..', 'requirements.txt');

    try {
      // Create virtual environment
      await ipcRenderer.invoke('run-command', `python3 -m venv ${venvPath}`);
      console.log('Virtual environment created successfully');

      // Upgrade pip
      await ipcRenderer.invoke('run-command', `${venvPythonPath} -m pip install --upgrade pip`);
      console.log('Pip upgraded successfully');

      // Install requirements
      await ipcRenderer.invoke('run-command', `${venvPythonPath} -m pip install -r ${requirementsPath}`);
      console.log('Requirements installed successfully');

      setPythonPath(venvPythonPath);
    } catch (error) {
      console.error('Error setting up virtual environment:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (input.trim() && pythonPath) {
      onSearchStart();
      try {
        const componentDir = __dirname;
        const pythonScriptPath = path.join(componentDir, '..', 'python', 'semantic_search.py');
        const command = `"${pythonPath}" "${pythonScriptPath}" "${input}" "${directoryPath}"`;
        await ipcRenderer.invoke('run-command', command);
        
        const resultsPath = path.join(componentDir, '..', 'semantic_distances.json');
        const searchResults = await ipcRenderer.invoke('read-file', resultsPath);
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
