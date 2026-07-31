from sentence_transformers import SentenceTransformer
model = SentenceTransformer("all-MiniLM-L6-v2")
def create_embeddings(chunks:list):
    embeddings = model.encode(chunks)
    return embeddings
def create_embedding(text:str):
    embeddings = model.encode(text)
    return embeddings