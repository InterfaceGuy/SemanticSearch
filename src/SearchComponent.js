import React, { useState, useEffect, useMemo } from 'react';

function SearchComponent({ model }) {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);
  const [customNames, setCustomNames] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const targets = useMemo(() => [
    "Dream interpretation", "Lucid dreaming techniques", "Nightmare analysis",
    "Sleep patterns and dreams", "Symbolism in dreams", "Recurring dream meanings",
    "Dream journaling methods", "Psychological aspects of dreaming",
    "Cultural perspectives on dreams", "Dreams and memory consolidation",
    "Prophetic dreams", "Daydreaming and creativity", "Dream-inspired art",
    "Sleep disorders and dreaming", "Meditation and dream quality"
  ], []);

  useEffect(() => {
    async function embedTargets() {
      if (model) {
        await model.embed(targets);
      }
    }
    embedTargets();
  }, [model, targets]);

  async function calculateSemanticSimilarity(input, targetList) {
    const inputEmbedding = await model.embed([input]);
    const targetEmbeddings = await model.embed(targetList);
    
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
    if (!model) {
      alert("Model is not ready yet. Please wait a moment and try again.");
      return;
    }

    setIsSearching(true);
    try {
      const customNameList = customNames.split('\n').filter(name => name.trim() !== '');
      const allTargets = [...targets, ...customNameList];

      const similarities = await calculateSemanticSimilarity(input, allTargets);
      const searchResults = allTargets.map((target, index) => ({
        name: target,
        similarity: similarities[index]
      }));
      setResults(searchResults.sort((a, b) => b.similarity - a.similarity));
    } catch (error) {
      console.error("Search error:", error);
      alert("An error occurred during the search. Please try again.");
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter search term"
      />
      <button onClick={handleSearch} disabled={isSearching}>
        {isSearching ? 'Searching...' : 'Search'}
      </button>
      <div>
        <h3>Custom Names (one per line):</h3>
        <textarea
          value={customNames}
          onChange={(e) => setCustomNames(e.target.value)}
          placeholder="Enter custom names, one per line"
          rows={5}
          cols={30}
        />
      </div>
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
