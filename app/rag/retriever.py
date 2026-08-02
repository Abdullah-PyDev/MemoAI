import faiss
import numpy as np
from app.rag.chunker import chunk_text
from app.rag.embeddings import create_embeddings
from app.rag.cache import get_document_folder,load_chunks,save_chunks,save_index,read_index
class Retriever:
    def __init__(self, chunks, index):
        self.chunks = chunks
        self.index = index
        
    def retrieve(self, question_embedding, top_k=10):
        distance,indices = self.index.search(np.array([question_embedding],dtype="float32"),top_k)
        results = []
        for index in indices[0]:
            results.append(self.chunks[index])
        return results
def build_retreiver(document_id,text):
    folder = get_document_folder(document_id)
    chunks_file = (folder/"chunk.pkl").exists()
    index_file = (folder/"faiss.index").exists()
    if chunks_file and index_file:
        chunks = load_chunks(document_id)
        index = read_index(document_id)
        return Retriever(chunks,index)
    
    chunks = chunk_text(text)
    save_chunks(document_id,chunks)
    embeddings = create_embeddings(chunks)
    dimension = embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(embeddings.astype("float32"))
    save_index(document_id, index)
    return Retriever(chunks,index)