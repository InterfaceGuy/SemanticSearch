import React, { useState, useEffect } from 'react';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import SearchComponent from './SearchComponent';

function App() {
  const [model, setModel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadModel() {
      const loadedModel = await use.load();
      setModel(loadedModel);
      setIsLoading(false);
    }
    loadModel();
  }, []);

  if (isLoading) {
    return <div>Loading model...</div>;
  }

  return (
    <div className="App">
      <h1>Semantic Search</h1>
      <SearchComponent model={model} />
    </div>
  );
}

export default App;
