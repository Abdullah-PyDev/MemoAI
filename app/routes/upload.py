from fastapi import APIRouter
from fastapi import UploadFile,File
import uuid
from app.services.pdf_parser import PdfParser
from app.rag.cache import save_document
from app.db.db import database
from app.services.pdf_parser import parser
from app.validatefile import validate_pdf

router = APIRouter()

@router.post("/upload")
async def upload_pdf(conversation_id:str,file: UploadFile = File(...)):
    
    validate_pdf(file.filename)

    pdf_bytes = await file.read()

    document = parser.parse_pdf(pdf_bytes)

    text = ""
    
    for page in document.pages:
        for block in page.blocks:
            text += block.text + "\n"
    document_id = str(uuid.uuid4())
    database.set_active_document(conversation_id,document_id)
    database.store_document(
        document_id,
        file.filename,
        len(document.pages),
        text
    )
    save_document(document_id,document)
    return {
        "document_id": document_id
    }