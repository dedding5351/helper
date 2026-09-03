# Autonomous Vision & Voice IT Helpdesk Agent

An end-to-end, real-time multimodal AI support agent that "sees" a user's screen, diagnoses system and network errors, verbally guides users through resolution steps via RAG, and automatically escalates complex issues to an IT dashboard.

---

## 💡 System Architecture
[ User Browser ] (Next.js / LiveKit WebRTC)
│
├─── (Screen Share & Audio Stream) ───► [ LiveKit Cloud ]
│
▼
[ GCP Compute Engine VM ]
(Python livekit-agents)
│               │
(Multimodal Screen     │               │ (Voice Loop /
& Error Analysis)     ▼               ▼  Tool Calling)
Gemini 3.1 Pro Preview   Gemini 3 Flash
│               │
└───┬───────────┘
│
▼
[ ChromaDB (Vector Store) ]
│
(On Escalation Trigger)
│
▼
[ Cloud Run Webhook ]
│
▼
[ Next.js IT Escalation Dashboard ]


---

## ⚡ Key Features

* **Real-time Screen & Audio Analysis:** Combines continuous visual screen inspection with zero-friction voice interaction over WebRTC.
* **RAG-Powered Troubleshooting:** Leverages a vector-embedded knowledge base (ChromaDB) to deliver contextual IT support.
* **Proactive Path Correction:** Detects when a user strays from instructions (e.g., opening the wrong setting menu) and corrects them in real time.
* **Context-Aware Escalation:** Automatically compiles issue summaries, attempted troubleshooting steps, and final error screenshots into an actionable ticket for human admins.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js, Firebase Hosting, `@livekit/components-react`
* **Real-Time Communication:** LiveKit Cloud (WebRTC)
* **Agent Engine:** Python (`livekit-agents`), Compute Engine (`e2-standard-4` VM)
* **AI Models:** Vertex AI (`gemini-3.1-pro-preview` for vision/reasoning, `gemini-3-flash` for voice loop)
* **RAG & Knowledge Base:** ChromaDB (In-Memory Vector Store)
* **Backend Services:** GCP Cloud Run (Webhook Receiver)

---

## 📖 Live Demo Scenario

1. **Connect:** Remote employee experiences a connection failure and joins the LiveKit room with mic and screen sharing enabled.
2. **Diagnose:** `gemini-3.1-pro-preview` detects an `ERR_CERT_AUTHORITY_INVALID` error on the user's screen.
3. **Guide:** The agent queries ChromaDB for the relevant VPN troubleshooting steps and uses `gemini-3-flash` to walk the user through them verbally.
4. **Correct:** If the user opens the wrong settings menu, the agent notices via visual feedback and provides live correction.
5. **Escalate:** Upon hitting an unresolvable error ("Account Locked"), the agent invokes the `escalate_ticket` tool, sending full diagnostic context and a final screenshot directly to the IT Escalation Dashboard.

---

## 🏃 Project Structure

* `/frontend`: Next.js application containing the user-facing WebRTC client (`/user`), IT Specialist escalation dashboard (`/it`), and Tauri overlay configuration.
* `/backend`: FastAPI service (`/backend/app`), ChromaDB vector store for RAG, and the LiveKit real-time voice agent worker (`/backend/workers`).

---

## 🚀 Quickstart Guide

### 1. Backend Setup
```bash
cd backend
cp .env.example .env.local   # Configure your GEMINI_API_KEY, LIVEKIT credentials
uv venv
uv pip install -r requirements.txt

# Start the FastAPI server
uv run uvicorn app.main:app --reload

# In a separate terminal, start the voice agent worker
uv run python -m workers.agent dev
```

### 2. Frontend Setup
```bash
cd frontend
cp .env.example .env.local   # Configure LIVEKIT and NEXT_PUBLIC_API_URL
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.