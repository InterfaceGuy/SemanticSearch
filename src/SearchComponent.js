import React, { useState, useEffect } from 'react';

function SearchComponent({ model }) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [embeddings, setEmbeddings] = useState(null);

  const targets = [
    "Dream interpretation", "Lucid dreaming techniques", "Nightmare analysis",
    "Sleep patterns and dreams", "Symbolism in dreams", "Recurring dream meanings",
    "Dream journaling methods", "Psychological aspects of dreaming",
    "Cultural perspectives on dreams", "Dreams and memory consolidation",
    "Prophetic dreams", "Daydreaming and creativity", "Dream-inspired art",
    "Sleep disorders and dreaming", "Meditation and dream quality"
  ];

  useEffect(() => {
    async function embedTargets() {
      if (model) {
        const targetEmbeddings = await model.embed(targets);
        setEmbeddings(targetEmbeddings);
      }
    }
    embedTargets();
  }, [model]);

  async function calculateSemanticSimilarity(input) {
    const inputEmbedding = await model.embed([input]);
    
    const similarities = embeddings.map(targetEmb => 
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
    if (!embeddings) {
      alert("Embeddings are not ready yet. Please wait a moment and try again.");
      return;
    }
    const similarities = await calculateSemanticSimilarity(input);
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
      <button onClick={handleSearch} disabled={!embeddings}>Search</button>
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
