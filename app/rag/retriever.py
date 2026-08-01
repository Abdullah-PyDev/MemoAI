import faiss
import numpy as np
from app.rag.chunker import chunk_text
from app.rag.embeddings import create_embeddings
class Retriever:
    def __init__(self, chunks, embeddings):
        self.chunks = chunks
        dimension = embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(np.array(embeddings, dtype="float32"))
    def retrieve(self, question_embedding, top_k=10):
        distance,indices = self.index.search(np.array([question_embedding],dtype="float32"),top_k)
        results = []
        for index in indices[0]:
            results.append(self.chunks[index])
        return results
def build_retreiver(text):
    chunks = chunk_text(text)
    # convert chunks to embeddings
    embeddings = create_embeddings(chunks)
    return Retriever(chunks,embeddings)