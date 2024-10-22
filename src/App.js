import React, { useState, useEffect } from 'react';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import SearchComponent from './SearchComponent';
import LoadingScreen from './LoadingScreen';

function App() {
  const [model, setModel] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState({ 
    isLoading: true, 
    progress: 0, 
    downloadProgress: 0, 
    message: 'Initializing...' 
  });

  useEffect(() => {
    async function loadModel() {
      try {
        setLoadingStatus({ 
          isLoading: true, 
          progress: 0, 
          downloadProgress: 0, 
          message: 'Preparing to load model...' 
        });
        
        const loadedModel = await use.load((progress) => {
          const adjustedProgress = Math.round(progress * 100);
          setLoadingStatus(prevStatus => ({ 
            ...prevStatus,
            downloadProgress: adjustedProgress, 
            message: `Downloading model: ${adjustedProgress}%`
          }));
        });

        setLoadingStatus(prevStatus => ({ 
          ...prevStatus,
          progress: 50, 
          downloadProgress: 100, 
          message: 'Model downloaded, now loading...' 
        }));

        await loadedModel.embed(['Test sentence to initialize the model']);

        setModel(loadedModel);
        setLoadingStatus({ 
          isLoading: false, 
          progress: 100, 
          downloadProgress: 100, 
          message: 'Model loaded successfully!' 
        });
      } catch (error) {
        setLoadingStatus({ 
          isLoading: false, 
          progress: 0, 
          downloadProgress: 0, 
          message: `Error loading model: ${error.message}` 
        });
      }
    }
    loadModel();
  }, []);

  return (
    <div className="App">
      <h1>Semantic Search</h1>
      {loadingStatus.isLoading ? (
        <LoadingScreen status={loadingStatus} />
      ) : (
        <SearchComponent model={model} loadingStatus={loadingStatus} />
      )}
    </div>
  );
}

export default App;
