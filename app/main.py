from fastapi import UploadFile, File
from pypdf import PdfReader
from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi import HTTPException
from app.services.llm import ask_llm
import uuid
from app.services.pdf_parser import parser
from app.core.prompts import structured_prompt
from app.models.schemas import AskPdf
from app.db.database import *
from app.rag.chunker import chunk_text
from app.rag.embeddings import create_embeddings,create_embedding
from app.rag.retriever import Retriever
# Load environment variables
load_dotenv()
# FastAPI app
app = FastAPI(
    title="Ask Anything AI",
    description="A simple AI-powered API using Gemini",
    version="1.0"
)

# Home route
@app.get("/")
def home():
    return {
        "message": "Welcome to Ask Anything AI!",
        "docs": "/docs"
    }
@app.get("/help")
def help():
    return {
        "message": "How may i help u!",
        "docs": "/docs"
    }


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    reader = PdfReader(file.file)
    text = parser(reader)
    #get chunks
    chunks = chunk_text(text)
    # convert chunks to embeddings
    embeddings = create_embeddings(chunks)
    # retreiver
    retriever= Retriever(chunks,embeddings)
    # generating uid
    document_id = str(uuid.uuid4())
    store_document(document_id,file,reader,text,retriever)
    return {
        "document_id": document_id
    }
@app.post("/ask-pdf")
async def ask_pdf(data: AskPdf):
    document_id = data.document_id
    question = data.question
    question_embedding = create_embedding(question)
    document = get_document(document_id)
    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
    )
    retriever= document["retriever"]
    retreived_chunks = retriever.retrieve(question_embedding)
    history = get_history(document)
    history_text = format_history(history)
    prompt = structured_prompt(history_text,retreived_chunks,question)
    answer = ask_llm(prompt)
    store_history(document_id,question,answer)
    return {
    "question": question,
    "answer": answer,
    "filename": document["filename"],
    "pages": document["pages"],
    "characters" : len(retreived_chunks)
}