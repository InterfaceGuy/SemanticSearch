import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import time

print("Downloading and loading the Universal Sentence Encoder model...")
start_time = time.time()

# Custom progress callback
class ProgressBar:
    def __init__(self, total_size):
        self.progbar = tf.keras.utils.Progbar(total_size)
        self.last_value = 0

    def __call__(self, value):
        delta = value - self.last_value
        self.progbar.add(delta)
        self.last_value = value

# Load the Universal Sentence Encoder model with progress tracking
model_url = "https://tfhub.dev/google/universal-sentence-encoder/4"
model_size = 988649472  # Approximate size in bytes
progress_bar = ProgressBar(model_size)

model = hub.load(model_url, callbacks=[progress_bar])

end_time = time.time()
print(f"\nModel loaded successfully in {end_time - start_time:.2f} seconds.")

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
