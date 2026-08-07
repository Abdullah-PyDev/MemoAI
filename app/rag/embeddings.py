from sentence_transformers import SentenceTransformer
import time

model = SentenceTransformer("all-MiniLM-L6-v2")

def create_embeddings(chunks: list):
    start = time.time()

    embeddings = model.encode(
        chunks,
        batch_size = 32,
        show_progress_bar=True,
        convert_to_numpy=True
    )

    print(f"Encoded {len(chunks)} chunks in {time.time() - start:.2f}s")

    return embeddings


def create_embedding(text:str):
    embeddings = model.encode(text)
    return embeddings