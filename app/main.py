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
from app.rag.embeddings import create_embedding
from app.rag.retriever import build_retreiver
from app.db.db import Database
# Load environment variables
database = Database()
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
    # generating uid
    document_id = str(uuid.uuid4())
    database.store_document(document_id,file.filename,len(reader.pages),text)
    return {
        "document_id": document_id
    }
@app.post("/ask-pdf")
async def ask_pdf(data: AskPdf):
    document_id = data.document_id
    question = data.question
    question_embedding = create_embedding(question)
    document = database.get_document(document_id)
    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
    )
    text = document["text"]
    retriever= build_retreiver(document_id,text)
    retreived_chunks = retriever.retrieve(question_embedding)
    history = database.get_history(document_id)
    history_text = database.format_history(history)
    prompt = structured_prompt(history_text,retreived_chunks,question)
    answer = ask_llm(prompt)
    database.store_history(document_id,question,answer)
    return {
    "question": question,
    "answer": answer,
    "filename": document["filename"],
    "pages": document["pages"],
    "characters" : len(retreived_chunks)
}