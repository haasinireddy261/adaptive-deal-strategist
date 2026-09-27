# ⚡ Adaptive Deal Strategist
> **Theme:** *"AI Agents That Learn Using Hindsight"* — Microsoft / Devnovate Hackathon

**Adaptive Deal Strategist** is an autonomous AI sales intelligence agent that learns from customer interactions and deal outcomes across time using **Hindsight**, dynamically transforming accumulated historical experience into evolved sales strategies for upcoming executive meetings.

---

### 💡 The Core Differentiator

> **"Most assistants remember what happened.**  
> **Our agent learns what to do differently because of what happened."**

Most CRM assistants simply summarize notes. **Adaptive Deal Strategist learns from what worked and failed**, evolving its tactical game plan through a 7-stage cognitive loop:

```
[ 1. EXPERIENCE ]           Customer remarks, objections, and technical constraints
        ↓
[ 2. HINDSIGHT MEMORY ]     Persistent vector & relational memory bank (deal_acme-corp)
        ↓
[ 3. OUTCOME ]              Sales approaches attempted & what happened (win vs rejected)
        ↓
[ 4. LEARNING ]             Inferred behavioral rules and patterns from outcomes
        ↓
[ 5. STRATEGY EVOLUTION ]   Visual progression: What We Thought → What Happened → What Changed
        ↓
[ 6. NEXT ACTION ]          Concrete executive meeting strategy, talking points & avoidances
        ↓
[ 7. WHY / EVIDENCE ]       Verifiable memory attribution linking every action to Hindsight
```

---

## 🌟 Signature Features

### 1. Strategy Evolution Journey (Centerpiece)
Visually demonstrates the learning arc over time:
- **WHAT WE THOUGHT:** Feature-first pitch with generic capability decks.
- **WHAT HAPPENED:** Proposal rejected because it felt off-the-shelf and lacked technical substance.
- **WHAT WE LEARNED:** Acme responds far better to concrete technical depth than generic feature messaging.
- **WHAT CHANGED:** Pivoted strategy to lead with API architecture, webhook reliability, and integration boundaries.
- **WHAT WE DO NOW:** Conduct dedicated 15-minute architecture deep-dive; defer commercial discount haggling.

### 2. Deal Chronology & Experience Timeline
Chronologically separates **Action Attempted** from **Observed Outcome**:
- ✕ **Generic Feature Proposal:** Rejected as too generic & lacking technical substance.
- ✓ **Architecture Walkthrough:** CTO responded enthusiastically and validated engineering approach.
- ⚡ **Operational Update:** CTO prioritized production deployment reliability & zero-downtime rollbacks.

### 3. Causal Memory Attribution ("Why This Recommendation?")
Zero hallucinations, zero fake citations. Every tactical recommendation links to an actual recalled Hindsight memory unit with an explanation of how it shaped the plan.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────┐
│               React + Vite Frontend                    │
│  - Real-time 7-Step Cognitive Pipeline Visualizer      │
│  - Strategy Evolution Journey (5-Stage Visualizer)     │
│  - Chronological Deal Timeline (Action vs Outcome)     │
│  - Verified Hindsight Status Indicator                 │
│  - Multi-category Logger with 1-Click Demo Presets    │
│  - Memory Attribution Trace (Recalled Evidence)        │
└───────────────────────────▲────────────────────────────┘
                            │ REST API (JSON)
┌───────────────────────────▼────────────────────────────┐
│                  FastAPI Backend                       │
│  - /api/interactions (POST) -> Hindsight aretain       │
│  - /api/deals/{id}/memories (GET) -> Hindsight arecall │
│  - /api/deals/{id}/briefing (POST) -> Agent reasoning  │
│  - /api/deals/demo-seed (POST) -> Clean Acme seeding   │
└─────────────┬───────────────────────────┬──────────────┘
              │                           │
              ▼                           ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│ Hindsight Memory Engine  │  │         Groq LLM         │
│  - Embedded Postgres pg0 │  │  - Llama 3.3 70B         │
│  - Cross-encoder rerank  │  │  - Structured briefing   │
│  - TEMPR multi-strategy  │  │    with memory citations │
│    retrieval             │  └──────────────────────────┘
└──────────────────────────┘
```

- **Persistent Memory Core:** Real **Hindsight** memory engine (`hindsight-client` + `hindsight-all`) running embedded PostgreSQL (`pg0`) and local cross-encoder model.
- **Backend:** Python 3.12 + FastAPI + Uvicorn + Pydantic.
- **LLM Reasoning:** Groq API (`llama-3.3-70b-versatile`) with deterministic memory synthesis fallback for 100% demo uptime.
- **Frontend:** React + Vite + Lucide Icons + Dark Glassmorphic Theme.

---

## ⚡ Quick Start Guide

### 1. Backend Setup

```bash
# In the project root directory
# Activate the virtual environment:
.\venv\Scripts\Activate.ps1    # On Windows PowerShell
# or: source venv/bin/activate # On macOS/Linux

# (Optional) Add your Groq API key in .env:
# GROQ_API_KEY=gsk_your_key_here

# Start the FastAPI server:
python -m uvicorn backend.app.main:app --reload --port 8000
```
Backend API docs will be live at: `http://localhost:8000/docs`

### 2. Frontend Setup

```bash
# In a new terminal, navigate to frontend:
cd frontend

# Start the Vite development server:
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🎬 60-Second Demo Sequence for Judges

1. **0–10 sec: The Value Proposition**
   - Point to the header: **Adaptive Deal Strategist**.
   - Note the **Verified Hindsight Status** (`● Active | X experiences recalled`).
   - Highlight the 7-step loop: `EXPERIENCE → MEMORY → OUTCOME → LEARNING → STRATEGY EVOLUTION → NEXT ACTION → WHY`.

2. **10–25 sec: Load Acme Demo Story**
   - Click **"Load Acme Demo Story"**.
   - Observe Hindsight populate with Facts, Outcomes, and Learned Strategies.
   - Note that the initial **Strategy Evolution** appears immediately (Feature-First → Architecture-First).

3. **25–40 sec: Inspect Strategy Evolution & Deal Timeline**
   - Review the 5 stages of evolution: What We Thought → What Happened → What We Learned → What Changed → What We Do Now.
   - Inspect the **Deal Timeline** showing the failed generic proposal vs the validated architecture deep-dive.

4. **40–55 sec: The Proof of Learning (Add New Interaction)**
   - Click the quick preset: **"⚡ DEMO STEP 5: CTO Reliability Concern"** (`"Acme's CTO is now primarily concerned about deployment reliability and rollback safety."`).
   - Click **"Retain in Hindsight"**.
   - Notice the **MEMORY UPDATED** badge appear.

5. **55–70 sec: See the Strategy Evolve Dynamically**
   - Watch the briefing re-synthesize with the updated Hindsight memory context.
   - The **Strategy Evolution** adapts to **Resilience & SLAs**!
   - Recommended actions pivot from initial architecture to automated zero-downtime deployment demonstrations and enterprise SLAs.

6. **70–85 sec: Open "Why This Recommendation?"**
   - Expand the attribution trace.
   - Show how the newly retained CTO reliability memory directly triggered the tactical pivot.
   - Conclude: *"Most assistants remember what happened. Our agent learns what to do differently because of what happened."*

---

## 🧪 Testing & Verification

Run the test suite to verify Hindsight integration:

```bash
# 1. Hindsight Smoke Test
python test_hindsight_smoke.py

# 2. FastAPI Backend Integration Test
python test_backend_api.py

# 3. End-to-End Strategy Evolution Test
python test_e2e.py

# 4. Frontend Production Build
cd frontend && npm run build
```
