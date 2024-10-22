import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import time
import json

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

def semantic_search(query, targets):
    # Encode the query and targets
    query_embedding = encode([query])
    target_embeddings = encode(targets)
    
    # Calculate similarities
    similarities = np.inner(query_embedding, target_embeddings)[0]
    
    # Sort results
    results = sorted(zip(targets, similarities), key=lambda x: x[1], reverse=True)
    
    return results

# Load targets from JSON file
def load_targets():
    with open('names.json', 'r') as f:
        return json.load(f)

# Example usage
if __name__ == "__main__":
    targets = load_targets()
    
    while True:
        query = input("Enter your search query (or 'quit' to exit): ")
        if query.lower() == 'quit':
            break
        
        results = semantic_search(query, targets)
        
        print("\nSearch results:")
        for target, similarity in results:
            print(f"{target}: {similarity:.4f}")
        print()
