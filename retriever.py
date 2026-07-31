import faiss
import numpy as np
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
