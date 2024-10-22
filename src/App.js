import React, { useState, useEffect } from 'react';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import SearchComponent from './SearchComponent';
import LoadingScreen from './LoadingScreen';

import React, { useState, useEffect } from 'react';
import LoadingScreen from './LoadingScreen';
import SearchComponent from './SearchComponent';

const { ipcRenderer } = window.require('electron');

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState({
    progress: 0,
    message: 'Initializing...'
  });

  useEffect(() => {
    async function initializeApp() {
      try {
        setLoadingStatus({
          progress: 50,
          message: 'Loading application...'
        });
        
        // Simulate initialization process
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing app:', error);
        setLoadingStatus({
          progress: 100,
          message: 'Error: ' + error.message
        });
      }
    }

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingScreen status={loadingStatus} />;
  }

  return (
    <div className="App">
      <h1>Semantic Search</h1>
      <SearchComponent />
    </div>
  );
}

export default App;
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
