from fastapi import APIRouter
from fastapi import UploadFile,File
import os
import tempfile
from fastapi.concurrency import run_in_threadpool
from app.services.speech_to_text import transcribe_audio
router = APIRouter()

@router.post("/transcribe")
async def transcribe(file:UploadFile = File(...)):
    suffix = os.path.splitext(file.filename or "")[1] or ".webm"
    #save audio in a temp file
    #idea of temp file is to later delete it rather than keeping random audio in storage
    with tempfile.NamedTemporaryFile(
        delete=False,
        suffix=suffix
    ) as temp_file:

        temp_file.write(await file.read())
        temp_path = temp_file.name

    try:
        # transcription
        text = await run_in_threadpool(
            transcribe_audio,
            temp_path
        )

        return {
          "text": text,
    }

    finally:
        os.remove(temp_path)
