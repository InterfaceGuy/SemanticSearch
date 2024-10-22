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
        setLoadingStatus({ isLoading: true, progress: 5, message: 'Preparing to load model...' });
        
        // Simulate initial loading steps
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoadingStatus({ isLoading: true, progress: 10, message: 'Starting model download...' });
        
        const loadedModel = await use.load((progress) => {
          const adjustedProgress = Math.round(progress * 80) + 10;
          setLoadingStatus({ 
            isLoading: true, 
            progress: adjustedProgress, 
            message: `Downloading model: ${adjustedProgress}%`
          });
        });

        setLoadingStatus({ isLoading: true, progress: 95, message: 'Finalizing...' });
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate finalization
        setModel(loadedModel);
        setLoadingStatus({ isLoading: true, progress: 100, message: 'Model loaded successfully!' });
        await new Promise(resolve => setTimeout(resolve, 500)); // Show 100% briefly
        setLoadingStatus({ isLoading: false, progress: 100, message: 'Ready!' });
      } catch (error) {
        setLoadingStatus({ isLoading: false, progress: 0, message: `Error loading model: ${error.message}` });
      }
    }
    loadModel();
  }, []);

  return (
    <div className="App">
      {loadingStatus.isLoading ? (
        <LoadingScreen status={loadingStatus} />
      ) : (
        <>
          <h1>Semantic Search</h1>
          <SearchComponent model={model} />
        </>
      )}
    </div>
  );
}

export default App;
