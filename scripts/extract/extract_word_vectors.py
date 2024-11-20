"""        
    Extracts word vectors found by default in gensim. 
""" 
from gensim import downloader as api 
import sys 
import os 
import array

# --- extract CLI arguments --- # 
GROUP               = sys.argv[1]   # e.g. glove 
MODEL_NAME          = sys.argv[2]   # e.g. glove-wiki-gigaword-300

# --- load model --- # 
print("Loading model.") 
model = api.load(MODEL_NAME) 

# --- get vocabulary list --- # 
vocabulary = list(model.key_to_index.keys()) 

# --- create output folder --- # 
os.makedirs(f"./data/point-sets/{GROUP}/", exist_ok=True) 

# --- load output file --- # 
outfile = open(f"./data/point-sets/{GROUP}/{MODEL_NAME}.bin", "wb")

# --- loop through each word append to output file --- # 
i = 0 
n = len(vocabulary)
for word in vocabulary: 
    print(f"Extracting word {i + 1} of {n}.", end="\r")

    # --- get vector from model --- # 
    vector = model[word]

    # --- turn vector to bytes array --- # 
    vector_b = array.array("f", vector).tobytes() 

    # --- write vector to outfile -- # 
    outfile.write(vector_b)
    
    i += 1

print()

# --- close output file --- #
print("Closing output file.")
outfile.close() 