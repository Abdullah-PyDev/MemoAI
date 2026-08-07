from pathlib import Path
import pickle
import faiss
from app.models.document import Document
#storage directory where we will save cached chunks and embeddings
STORAGE_DIR = Path("storage")

#get document folder using document id
def get_document_folder(document_id):
    """this function creates folder -> storage/document_id
        if creates this if parent folder missing or the folder such as 134393(document_id) doesnt exists. If it exists simply dont raise any error
        such as FILE EXISTS ERROR, simply ignores it and return the folder name"""
    
    folder = STORAGE_DIR / document_id
    #parents=True so that if root folder storage doesnt exists, it makes one again
    #exixst_ok checks if the document_id named folder exixsts already dont raise error
    folder.mkdir(parents=True, exist_ok=True)
    return folder
    #folder is used by load chunks/embeddings fucntion
def save_chunks(document_id,chunks):
    folder = get_document_folder(document_id)
    if folder:
        with open(folder/"chunks.pkl",'wb') as file:
            pickle.dump(chunks,file)
def save_document(document_id,document:Document):
    folder = get_document_folder(document_id)
    if folder:
        with open(folder/"document.pkl",'wb') as file:
            pickle.dump(document,file)
def load_chunks(document_id):
    folder = get_document_folder(document_id)
    if folder:
        with open(folder/"chunks.pkl",'rb') as file:
            chunks = pickle.load(file)
    return chunks
def load_document(document_id):
    folder = get_document_folder(document_id)
    if folder:
        with open(folder/"document.pkl",'rb') as file:
            document = pickle.load(file)
    return document
def save_index(document_id,index):
    folder = get_document_folder(document_id)
    path = str(folder/"faiss.index")
    faiss.write_index(index,path)
def read_index(document_id):
    folder = get_document_folder(document_id)
    path = str(folder/"faiss.index")
    index = faiss.read_index(path)
    return index