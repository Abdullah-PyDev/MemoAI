# MemoAI

## Architecture

![MemoAI Architecture](assets/architecture.png)



# MemoAI

AI-powered research assistant for interacting with PDF documents using Retrieval-Augmented Generation (RAG).

MemoAI allows users to upload research papers and ask questions about them using natural language. It retrieves relevant sections from the document and uses an LLM to generate grounded answers.

## Features

- PDF document upload and processing
- Structured PDF text extraction (with OCR fallback)
- Intelligent document chunking
- Semantic embeddings
- Vector-based retrieval
- Retrieval-Augmented Generation (RAG)
- Conversational chat with document context
- Voice input for English queries
- Speech-to-text using Whisper through Groq
- FastAPI backend
- React frontend

## Voice Input

MemoAI supports voice-based queries.

The flow is:

```
Browser microphone
  → Audio recording
  → FastAPI /transcribe
  → Whisper large-v3-turbo via Groq
  → Transcribed text
  → Existing RAG pipeline
  → Answer
```

Voice input does not require any changes to the existing RAG pipeline. The audio is simply converted into text before being processed as a normal query.

### Voice Benchmark

We initially tested running Whisper locally using `faster-whisper`.

**Model tested:** `Whisper large-v3-turbo`

The local approach worked, but running the model directly on CPU introduced several problems:

- Large model download (~1.6 GB)
- Model loading/startup overhead
- Relatively slow CPU transcription
- Windows/Hugging Face cache and symlink issues
- Higher local resource requirements

We then tested Whisper through Groq's API.

For a 27-second English recording:

| Approach | Result |
|---|---:|
| Local Whisper on CPU | ~19–35 seconds |
| Groq Whisper API | ~5.7 seconds |

The Groq-based approach provided significantly better latency for MemoAI's current architecture.

## Architecture

```
                    ┌──────────────────────┐
                    │  React + TypeScript  │
                    │       Frontend       │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │        FastAPI       │
                    │        Backend       │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                 │
              ▼                ▼                 ▼
        PDF Processing        RAG          Speech-to-Text
              │                │                 │
          PyMuPDF          Embeddings           Groq
          RapidOCR           FAISS            Whisper
              │                │                 │
              └────────────────┼─────────────────┘
                               │
                               ▼
                          Groq LLM
                       Llama 3.3 70B
                               │
                               ▼
                            Answer
```

### RAG Pipeline

```
PDF → PDF Parsing → Text Extraction → Chunking → Embeddings
    → Vector Retrieval → Relevant Context → LLM → Answer
```

### Voice Query Pipeline

```
Voice → Whisper → Text → RAG Pipeline → Answer
```

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Lucide React

### Backend
- Python
- FastAPI
- Uvicorn
- Pydantic

### Document Processing
- PyMuPDF (fitz)
- RapidOCR
- Custom document/block/page models
- Custom chunking pipeline

### RAG
- Sentence Transformers
- `all-MiniLM-L6-v2`
- FAISS
- Custom semantic retrieval pipeline

### AI / LLM
- Groq API
- Llama 3.3 70B Versatile
- Whisper large-v3-turbo via Groq (speech-to-text)

### Storage
- SQLite
- File-based document/chunk storage

### Development & Tools
- Git
- GitHub
- VS Code
- Python virtual environments

### Core Technologies Overview

| Component | Technology |
|---|---|
| Frontend | React + TypeScript |
| Styling | Tailwind CSS |
| Backend | FastAPI |
| PDF Parsing | PyMuPDF |
| OCR | RapidOCR |
| Embeddings | all-MiniLM-L6-v2 |
| Vector Search | FAISS |
| LLM | Llama 3.3 70B Versatile |
| Speech-to-Text | Whisper large-v3-turbo |
| AI API | Groq |
| Database | SQLite |
| Version Control | Git + GitHub |

## API

### `POST /upload`
Uploads and processes a PDF document.

### `POST /ask`
Accepts a question and generates an answer using the document's retrieved context.

### `POST /transcribe`
Accepts an audio file and returns its transcription.

**Example response:**

```json
{
  "text": "What methodology was used in this research paper?",
  "transcription_time": 5.7
}
```

## Current Status

MemoAI currently supports:

- PDF-based question answering
- RAG-based document retrieval
- Conversational interaction
- English voice queries
- Fast speech-to-text through Groq

## Upcoming

- Production deployment
- Improved voice UX
- Voice recording cancellation
- Better error handling
- Multilingual voice input
- RAG evaluation and benchmarking
- Improved document processing and retrieval

## Project Goal

MemoAI is being developed as an AI research assistant focused on making research papers easier to understand, explore, and interact with.

The project is also being developed as a practical exploration of modern AI engineering concepts including RAG, embeddings, vector retrieval, LLMs, speech-to-text, evaluation, and AI application architecture.

## Author

**Abdullah Shafiq**

BS Artificial Intelligence  
FAST National University of Computer and Emerging Sciences

GitHub: https://github.com/Abdullah-PyDev


