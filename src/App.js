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
        setLoadingStatus({ isLoading: true, progress: 0, message: 'Preparing to load lite model...' });
        
        const loadedModel = await use.loadQnA((progress) => {
          const adjustedProgress = Math.round(progress * 100);
          setLoadingStatus({ 
            isLoading: true, 
            progress: adjustedProgress, 
            message: `Loading lite model: ${adjustedProgress}%`
          });
        });

        setModel(loadedModel);
        setLoadingStatus({ isLoading: false, progress: 100, message: 'Lite model loaded successfully!' });
      } catch (error) {
        setLoadingStatus({ isLoading: false, progress: 0, message: `Error loading model: ${error.message}` });
      }
    }
    loadModel();
  }, []);

  return (
    <div className="App">
      <h1>Semantic Search</h1>
      <SearchComponent model={model} loadingStatus={loadingStatus} />
    </div>
  );
}

export default App;
