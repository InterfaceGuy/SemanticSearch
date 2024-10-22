import tensorflow as tf
import tensorflow_hub as hub
import numpy as np
import time
import sys

print("Downloading and loading the Universal Sentence Encoder model...")
start_time = time.time()

# Custom progress function
def print_progress(value):
    sys.stdout.write(f"\rProgress: {value*100:.1f}%")
    sys.stdout.flush()

# Load the Universal Sentence Encoder Lite model
model_url = "https://tfhub.dev/google/universal-sentence-encoder-lite/2"
model = hub.load(model_url)

# Create a TensorFlow session
session = tf.compat.v1.Session()

# Initialize the model
session.run(tf.compat.v1.global_variables_initializer())
session.run(tf.compat.v1.tables_initializer())

# Define the encoding function
def encode(texts):
    input_placeholder = tf.compat.v1.placeholder(tf.string, shape=[None])
    encodings = model(input_placeholder)
    return session.run(encodings, feed_dict={input_placeholder: texts})

end_time = time.time()
print(f"\nModel loaded successfully in {end_time - start_time:.2f} seconds.")

# The encode function is now defined above, near the model initialization

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
