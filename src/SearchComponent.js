import React, { useState } from 'react';

function SearchComponent({ model }) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);

  const targets = [
    "dream", "nightmare", "sleep", "awake", "lucid", "subconscious",
    "REM", "interpretation", "symbolism", "recurring", "vivid",
    "daydream", "premonition", "surreal", "analysis", "memory"
  ];

  async function calculateSemanticSimilarity(input, targets) {
    const inputEmbedding = await model.embed([input]);
    const targetEmbeddings = await model.embed(targets);
    
    const similarities = targetEmbeddings.map(targetEmb => 
      cosineSimilarity(inputEmbedding[0], targetEmb)
    );
    
    return similarities;
  }

  function cosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, _, i) => sum + a[i] * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
  }

  async function handleSearch() {
    const similarities = await calculateSemanticSimilarity(input, targets);
    const searchResults = targets.map((target, index) => ({
      name: target,
      similarity: similarities[index]
    }));
    setResults(searchResults.sort((a, b) => b.similarity - a.similarity));
  }

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter search term"
      />
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map((result, index) => (
          <li key={index}>
            {result.name} - Similarity: {result.similarity.toFixed(4)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchComponent;
