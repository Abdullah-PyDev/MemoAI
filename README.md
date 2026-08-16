# MemoAI

An AI-powered document assistant that lets you upload PDFs, ask natural language questions, transcribe audio, and maintain conversation history with intelligent retrieval-augmented generation (RAG).

---

## ✨ Features

- 📄 **Upload & Process PDFs** - Upload PDF documents for analysis
- 💬 **Ask Questions** - Ask natural language questions about document content
- 🎤 **Audio Transcription** - Transcribe audio files to text
- 🧠 **Retrieval-Augmented Generation (RAG)** - Intelligent context retrieval for accurate answers
- 💭 **Conversation History** - Maintain multi-turn conversations with context awareness
- 🚀 **Fast & Scalable** - Built with FastAPI for high performance

---

## 🛠 Tech Stack

**Backend:**
- Python 3
- FastAPI
- FAISS (vector similarity search)
- Sentence Transformers (embeddings)
- PyPDF (PDF parsing)
- Google Genai (LLM)

**Frontend:**
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Axios (HTTP client)
- React Markdown

**Storage:**
- File-based document storage
- Vector database caching

---

## 📁 Project Structure

```
MemoAI/
│
├── app/
│   ├── core/               # Core prompts and configurations
│   ├── db/                 # Database and storage layer
│   ├── models/             # Data models and schemas
│   ├── rag/                # RAG pipeline and caching
│   ├── routes/             # API endpoints
│   │   ├── upload.py       # PDF upload endpoint
│   │   ├── ask_pdf.py      # Query answering endpoint
│   │   ├── transcribe.py   # Audio transcription endpoint
│   │   ├── conversation.py # Conversation management
│   │   └── system.py       # System endpoints
│   ├── services/           # Business logic services
│   └── main.py             # FastAPI application
│
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service clients
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── storage/                # Document and conversation storage
├── archive/                # Archived/legacy code
├── docs/                   # Documentation
├── assets/                 # Static assets
│
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
├── .gitignore
└── README.md
```

---

# Installation & Setup

## Backend Setup

### 1. Create a virtual environment

**Windows:**
```bash
python -m venv .venv
```

Activate it:

**Command Prompt:**
```bash
.venv\Scripts\activate
```

**PowerShell:**
```powershell
.venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_api_key_here
```

### 4. Start the FastAPI backend

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at:
- **API:** http://127.0.0.1:8000
- **API Documentation:** http://127.0.0.1:8000/docs
- **Alternative Docs:** http://127.0.0.1:8000/redoc

## Frontend Setup

### 1. Navigate to frontend directory

```bash
cd frontend
```

### 2. Install Node dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The frontend will be available at http://localhost:3000

### 4. Build for production

```bash
npm run build
```

---

## 🚀 Usage

1. **Start the backend** - Run the FastAPI server (see Backend Setup step 4)
2. **Start the frontend** - Run the Vite dev server (see Frontend Setup step 3)
3. **Upload a PDF** - Use the frontend to upload a PDF document
4. **Ask Questions** - Query the document using natural language
5. **Transcribe Audio** - Upload audio files for transcription
6. **View History** - Access your conversation history

---

## 📡 API Endpoints

- `POST /upload` - Upload a PDF document
- `POST /ask` - Ask a question about an uploaded document
- `POST /transcribe` - Transcribe audio to text
- `GET /conversation/<id>` - Retrieve conversation history
- `POST /conversation` - Create a new conversation

---

## 🔧 Configuration

### Environment Variables

Key environment variables that can be configured in `.env`:

```env
# Google Genai API
GOOGLE_API_KEY=your_api_key_here

# Server Configuration
SERVER_HOST=0.0.0.0
SERVER_PORT=8000

# Frontend Configuration
REACT_APP_API_URL=http://localhost:8000
```

---

## 🔄 How It Works

### Document Processing Pipeline

```
1. PDF Upload
       │
       ▼
2. Extract Text Content
       │
       ▼
3. Split into Chunks
       │
       ▼
4. Generate Embeddings (Sentence Transformers)
       │
       ▼
5. Store in FAISS Vector Index
       │
       ▼
6. Cache for Fast Retrieval
```

### Query Processing Pipeline

```
1. User Question
       │
       ▼
2. Generate Question Embedding
       │
       ▼
3. Search FAISS Index (Semantic Search)
       │
       ▼
4. Retrieve Relevant Document Chunks
       │
       ▼
5. Build Context with Chat History
       │
       ▼
6. Construct Prompt
       │
       ▼
7. Query Google Genai LLM
       │
       ▼
8. Return AI Response
```

---

## 🎯 Features in Detail

### PDF Processing
- Extracts text from PDFs with accurate page tracking
- Maintains document metadata
- Stores raw content for context

### Semantic Search
- Uses Sentence Transformers for embeddings
- FAISS for efficient vector similarity search
- Retrieves most relevant document sections

### Conversation Management
- Maintains multi-turn conversation history
- Includes chat context in prompts for coherent responses
- Supports multiple concurrent conversations

### Audio Transcription
- Transcribes audio files to text
- Temporary file handling for security
- Supports multiple audio formats

---

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**
```bash
# Use a different port
uvicorn app.main:app --reload --port 8001
```

**Module not found errors:**
- Ensure virtual environment is activated
- Run `pip install -r requirements.txt` again

### Frontend Issues

**Cannot connect to backend:**
- Verify backend is running on http://localhost:8000
- Check CORS configuration in `app/main.py`
- Update API URL in frontend configuration if needed

**Port 3000 already in use:**
```bash
npm run dev -- --port 3001
```

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

---
