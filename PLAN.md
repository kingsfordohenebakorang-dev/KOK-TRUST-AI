# AI-Powered Actuarial Study Platform - Project Plan

## 1. High-Level Goals
- Consolidate notes from multiple universities.
- Cinematic, high-fidelity UI (Framer + Next.js).
- Symbolic Math Solving (SymPy + LLM).
- Provenance-backed answers (RAG).

## 2. Tech Stack
- **Frontend**: Next.js (App Router), React, TailwindCSS, Framer Motion.
- **Math**: KaTeX, SymPy (via Python backend or Pyodide).
- **Backend**: Node.js API Routes (Serverless).
- **Database**: Pinecone (Vectors), PostgreSQL (Metadata), S3 (Files).
- **AI**: OpenAI GPT-4o, text-embedding-3-small.

## 3. Sprint Plan (12 Weeks)

### Sprint 1: The Foundation (Weeks 1-4)
**Focus**: Ingestion, Database, and Basic Retrieval.
- [x] Week 1: Initialize Next.js, Theme, Basic UI Components.
- [ ] Week 2: Build file upload endpoint (Drag & Drop) & PDF Text Extraction (PDFMiner/Tika).
- [ ] Week 3: Implement RAG Chunking & Vector Upsert (Pinecone).
- [ ] Week 4: Basic Chat Interface (connect to OpenAI API).

### Sprint 2: The Math & The Magic (Weeks 5-8)
**Focus**: Symbolic Math, LaTeX, and Cinematic Visuals.
- [ ] Week 5: Integrate MathPix API for Image-to-LaTeX.
- [ ] Week 6: Hero Visuals (Nano Banana export -> Framer).
- [ ] Week 7: Implement robust LaTeX rendering (MathBlock component).
- [ ] Week 8: SymPy Logic Integration (Tool Use for LLM).

### Sprint 3: Production & Collaboration (Weeks 9-12)
**Focus**: Citations, Accounts, and Security.
- [ ] Week 9: Enhanced Citation UI (Side-by-side view).
- [ ] Week 10: User Auth (Auth0/Clerk).
- [ ] Week 11: Security Audit & Performance Tuning.
- [ ] Week 12: Launch & Mobile Optimization.

## 4. Architecture
[User Upload] -> [API] -> [S3 Storage]
                     -> [OCR/Text Extract] -> [Embeddings] -> [Vector DB]
                     
[User Question] -> [API] -> [Vector Search] -> [Context Re-ranking]
                        -> [LLM System Prompt] <-> [SymPy Tool]
                        -> [Frontend Display (LaTeX + Text)]
