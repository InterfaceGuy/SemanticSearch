import React from 'react';
import './LoadingScreen.css';

function LoadingScreen({ status }) {
  const { progress, message } = status;

  return (
    <div className="loading-screen">
      <h2>Loading Semantic Search Model</h2>
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
      <p>{progress}% Complete</p>
      <p>{message}</p>
    </div>
  );
}

export default LoadingScreen;
