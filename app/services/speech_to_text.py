import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def transcribe_audio(audio_path: str) -> str:

    with open(audio_path, "rb") as audio:
        transcription = client.audio.transcriptions.create(
            file=audio,
            model="whisper-large-v3-turbo",
            language="en",
            response_format="json",
            temperature=0.0,
        )

    return transcription.text