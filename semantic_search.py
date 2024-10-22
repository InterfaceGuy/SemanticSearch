import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import time

print("Downloading and loading the Universal Sentence Encoder model...")
start_time = time.time()

# Load the Universal Sentence Encoder model
model = hub.load("https://tfhub.dev/google/universal-sentence-encoder/4")

end_time = time.time()
print(f"Model loaded successfully in {end_time - start_time:.2f} seconds.")

def encode(texts):
    return model(texts)

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def semantic_search(query, targets):
    # Encode the query and targets
    query_embedding = encode([query])[0]
    target_embeddings = encode(targets)
    
    # Calculate similarities
    similarities = [cosine_similarity(query_embedding, target_embedding) for target_embedding in target_embeddings]
    
    # Sort results
    results = sorted(zip(targets, similarities), key=lambda x: x[1], reverse=True)
    
    return results

# Example usage
if __name__ == "__main__":
    targets = [
        "Dream interpretation", "Lucid dreaming techniques", "Nightmare analysis",
        "Sleep patterns and dreams", "Symbolism in dreams", "Recurring dream meanings",
        "Dream journaling methods", "Psychological aspects of dreaming",
        "Cultural perspectives on dreams", "Dreams and memory consolidation",
        "Prophetic dreams", "Daydreaming and creativity", "Dream-inspired art",
        "Sleep disorders and dreaming", "Meditation and dream quality"
    ]
    
    while True:
        query = input("Enter your search query (or 'quit' to exit): ")
        if query.lower() == 'quit':
            break
        
        results = semantic_search(query, targets)
        
        print("\nSearch results:")
        for target, similarity in results:
            print(f"{target}: {similarity:.4f}")
        print()
