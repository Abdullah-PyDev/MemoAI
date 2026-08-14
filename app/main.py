from fastapi import FastAPI
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from app.routes.upload import router as upload_pdf
from app.routes.ask_pdf import router as ask_pdf
from app.routes.transcribe import router as transcribe_pdf
from app.routes.system import router as system_route
from app.routes.conversation import router as conversation_route
# Load environment
load_dotenv()
# FastAPI app
app = FastAPI(
    title="Ask Anything AI",
    description="A simple AI-powered API using Gemini",
    version="1.0"
)

# Development CORS: allow requests from other local/dev origins (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(system_route)
app.include_router(upload_pdf)
app.include_router(ask_pdf)
app.include_router(transcribe_pdf)
app.include_router(conversation_route)
