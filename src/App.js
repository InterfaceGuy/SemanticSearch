import React, { useState, useEffect } from 'react';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import SearchComponent from './SearchComponent';
import LoadingScreen from './LoadingScreen';

function App() {
  const [model, setModel] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState({ isLoading: true, progress: 0, message: 'Initializing...' });

  useEffect(() => {
    async function loadModel() {
      try {
        setLoadingStatus({ isLoading: true, progress: 10, message: 'Starting model download...' });
        
        const loadedModel = await use.load((progress) => {
          setLoadingStatus({ 
            isLoading: true, 
            progress: Math.round(progress * 90) + 10, 
            message: `Downloading model: ${Math.round(progress * 100)}%`
          });
        });

        setLoadingStatus({ isLoading: true, progress: 100, message: 'Finalizing...' });
        setModel(loadedModel);
        setLoadingStatus({ isLoading: false, progress: 100, message: 'Model loaded successfully!' });
      } catch (error) {
        setLoadingStatus({ isLoading: false, progress: 0, message: `Error loading model: ${error.message}` });
      }
    }
    loadModel();
  }, []);

  if (loadingStatus.isLoading) {
    return <LoadingScreen status={loadingStatus} />;
  }

  return (
    <div className="App">
      <h1>Semantic Search</h1>
      <SearchComponent model={model} />
    </div>
  );
}

export default App;
