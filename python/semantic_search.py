import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import time
import json
import re
import sys
import os

print("Downloading and loading the Universal Sentence Encoder model...")
start_time = time.time()

# Load the Universal Sentence Encoder model
model_url = "https://tfhub.dev/google/universal-sentence-encoder/4"
model = hub.load(model_url)

# Define the encoding function
def encode(texts):
    return model(texts).numpy()

end_time = time.time()
print(f"\nModel loaded successfully in {end_time - start_time:.2f} seconds.")

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def camel_case_to_sentence(text):
    return ' '.join(re.findall(r'[A-Z]?[a-z]+|[A-Z]+(?=[A-Z][a-z]|\d|\W|$)|\d+', text)).strip()

def semantic_search(query, targets, name_mapping):
    # Encode the query and targets
    query_embedding = encode([query])
    target_embeddings = encode(targets)
    
    # Calculate similarities
    similarities = np.inner(query_embedding, target_embeddings)[0]
    
    # Sort results and restore original names
    results = sorted([(name_mapping[target], similarity) for target, similarity in zip(targets, similarities)], key=lambda x: x[1], reverse=True)
    
    return results

# Load targets from directory
def load_targets(directory_path):
    names = [name for name in os.listdir(directory_path) if os.path.isdir(os.path.join(directory_path, name))]
    return {camel_case_to_sentence(name).lower(): name for name in names}

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python semantic_search.py <search_query> <directory_path>")
        sys.exit(1)

    query = sys.argv[1]
    directory_path = sys.argv[2]
    print(f"Received query: {query}")
    print(f"Directory path: {directory_path}")
    
    targets = load_targets(directory_path)
    print(f"Loaded {len(targets)} targets")
    
    results = semantic_search(query, list(targets.keys()), targets)
    
    # Save semantic distances to JSON file
    semantic_distances = {name: float(similarity) for name, similarity in results}
    output_file = 'semantic_distances.json'
    with open(output_file, 'w') as f:
        json.dump(semantic_distances, f, indent=2)
    print(f"Semantic distances saved to {output_file}")
    print(f"Top 5 results: {results[:5]}")
