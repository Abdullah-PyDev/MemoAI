from fastapi import UploadFile
from pypdf import PdfReader
from app.rag.retriever import Retriever
documents = {}

def store_document(document_id: str, file: UploadFile, reader: PdfReader, text: str, retreiver:Retriever):
    documents[document_id] = {
        "filename": file.filename,
        "text": text,
        "pages": len(reader.pages),
        "retriever": retreiver,
        "history": []
    }

def get_document(document_id: str):
    return documents.get(document_id)
def get_text(document):
    return document["text"]
def get_history(document):
    return document["history"]
def format_history(history):
    #converting history into plain text
    history_text = ""
    for chat in history:
        history_text+=f"{chat['role']}:{chat['content']}\n"
    return history_text
def store_history(document_id,question,answer):
    document = get_document(document_id)
    history = get_history(document)
    history.append({"role": "user","content": question})
    history.append({"role":"Assistant", "content" :answer})
