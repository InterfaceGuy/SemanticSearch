import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import time
import json
import re

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

# Load targets from JSON file
def load_targets():
    with open('names.json', 'r') as f:
        names = json.load(f)
        return {camel_case_to_sentence(name).lower(): name for name in names}

# Example usage
if __name__ == "__main__":
    targets = load_targets()
    
    while True:
        query = input("Enter your search query (or 'quit' to exit): ")
        if query.lower() == 'quit':
            break
        
        results = semantic_search(query, list(targets.keys()), targets)
        
        print("\nSearch results:")
        for original_name, similarity in results:
            print(f"{original_name}: {similarity:.4f}")
        print()
        
        # Save semantic distances to JSON file
        semantic_distances = {name: float(similarity) for name, similarity in results}
        with open('semantic_distances.json', 'w') as f:
            json.dump(semantic_distances, f, indent=2)
        print("Semantic distances saved to semantic_distances.json")
