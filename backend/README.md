# Helper Backend

The backend for Helper IT Helpdesk. It consists of a FastAPI REST API (following the Repository Pattern), ChromaDB for vector-embedded runbook search, and a LiveKit agent worker running Google Gemini realtime audio.

## Architecture

```
backend/
├── app/
│   ├── core/           # Database setup, dependency injection hub, seed script
│   ├── models/         # Pydantic schemas and SQLAlchemy DB models
│   ├── repositories/   # Data access abstraction (SQLite & ChromaDB)
│   ├── services/       # Core business logic and validation
│   └── routes/         # FastAPI endpoints (/api/v1/...)
├── workers/
│   ├── agent.py        # LiveKit realtime voice agent worker
│   └── agent_tools.py  # Agent function tools (knowledge search, tickets)
├── solutions/          # Markdown IT troubleshooting runbooks
└── requirements.txt    # Python dependencies
```

## Setup & Running

### 1. Prerequisites
- Python 3.10+
- [`uv`](https://docs.astral.sh/uv/) (recommended) or standard `venv`

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your `GEMINI_API_KEY`, `LIVEKIT_URL`, `LIVEKIT_API_KEY`, and `LIVEKIT_API_SECRET`.

### 3. Install Dependencies
```bash
uv venv
uv pip install -r requirements.txt
```

### 4. Run FastAPI Server
```bash
uv run uvicorn app.main:app --reload --port 8000
```
Swagger API documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

### 5. Run LiveKit Voice Agent Worker
In a separate terminal:
```bash
uv run python -m workers.agent dev
```
