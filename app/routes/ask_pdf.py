from fastapi import APIRouter
from app.services.pdf_parser import PdfParser
from app.db.db import database
from app.models.schemas import AskPdf
from app.rag.cache import load_document
from app.rag.embeddings import create_embedding
from fastapi import HTTPException
from app.rag.retriever import build_retreiver
from app.core.prompts import structured_prompt
from app.services.llm import ask_llm

router = APIRouter()

@router.post("/ask-pdf")
async def ask_pdf(data: AskPdf):
    document_id = data.document_id
    question = data.question
    question_embedding = create_embedding(question)
    document = database.get_document(document_id)
    doc = load_document(document_id)
    if document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
    )
    
    retriever= build_retreiver(document_id,doc)
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