import React, { useState, useEffect } from 'react';
import './SearchComponent.css';
import * as tf from '@tensorflow/tfjs';
import * as use from '@tensorflow-models/universal-sentence-encoder';

function SearchComponent({ maxResults, targets, onSearchStart, onSearchComplete }) {
  const [input, setInput] = useState('');
  const [model, setModel] = useState(null);

  useEffect(() => {
    loadModel();
  }, []);

  const loadModel = async () => {
    const loadedModel = await use.load();
    setModel(loadedModel);
  };

  const cosineSimilarity = (a, b) => {
    const dotProduct = tf.sum(tf.mul(a, b));
    const normA = tf.norm(a);
    const normB = tf.norm(b);
    return dotProduct.div(tf.mul(normA, normB));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (input.trim() && model && targets.length > 0) {
      onSearchStart();
      try {
        const queryEmbedding = await model.embed(input.trim());
        const targetEmbeddings = await model.embed(targets);

        const similarities = tf.tidy(() => {
          const results = targets.map((target, i) => {
            const similarity = cosineSimilarity(queryEmbedding, targetEmbeddings.slice([i, 0], [1, -1]));
            return [target, similarity.dataSync()[0]];
          });
          return results.sort((a, b) => b[1] - a[1]).slice(0, maxResults);
        });

        onSearchComplete(similarities);
      } catch (error) {
        console.error('Error during search:', error);
        onSearchComplete([['Error', error.message]]);
      }
    }
  };

  return (
    <div className="search-component">
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search..."
          className="search-input"
        />
      </form>
    </div>
  );
}

export default SearchComponent;
