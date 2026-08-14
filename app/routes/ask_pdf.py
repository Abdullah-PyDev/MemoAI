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
    conversation_id = data.conversation_id
    question = data.question
    active_document_id = database.get_active_document_id(conversation_id)
    question_embedding = create_embedding(question)
    active_document = database.get_document(active_document_id)
    doc = load_document(active_document_id)
    if active_document is None:
        raise HTTPException(
            status_code=404,
            detail="Document not found."
    )
    
    retriever= build_retreiver(active_document_id,doc)
    retreived_chunks = retriever.retrieve(question_embedding)
    history = database.get_history(conversation_id)
    history_text = database.format_history(history)
    prompt = structured_prompt(history_text,retreived_chunks,question)
    answer = ask_llm(prompt)
    database.store_history(conversation_id,active_document_id,question,answer)
    return {
    "question": question,
    "answer": answer,
    "filename": active_document["filename"],
    "pages": active_document["pages"],
    "characters" : len(retreived_chunks)
}