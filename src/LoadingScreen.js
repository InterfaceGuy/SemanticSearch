import React from 'react';
import './LoadingScreen.css';

function LoadingScreen({ status }) {
  const { progress, message, downloadProgress } = status;

  return (
    <div className="loading-screen">
      <h2>Loading Semantic Search Model</h2>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <p>{progress}% Complete</p>
      <p>{message}</p>
      <h3>Downloading Model</h3>
      <div className="progress-bar download-bar">
        <div className="progress" style={{ width: `${downloadProgress}%` }}></div>
      </div>
      <p>{downloadProgress}% Downloaded</p>
    </div>
  );
}

export default LoadingScreen;
