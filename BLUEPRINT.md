# Actuarial GPT: Production System Blueprint

## 1. One-Page Product Spec (Technical)

**System Name:** Actuarial GPT (AGPT)
**Core Value:** Deterministic, document-grounded symbolic math solving for high-stakes actuarial exams.
**Architecture:** Hybrid RAG (Vector + Graph) + Symbolic Compute Engine (SymPy) + Cinematic Frontend.

**Key Features:**
*   **Ingestion:** Multi-format (PDF/TEX/IMG) -> MathPix OCR -> Semantic Chunking.
*   **Intelligence:** 
    *   *Router:* Classifies query -> (Compute | Retrieval | Hybrid).
    *   *Solver:* SymPy/NumPy layer for ground-truth calculation.
    *   *Synthesis:* LLM (GPT-4) wraps provenance & reasoning around symbolic results.
*   **Knowledge Graph (KG):** Neo4j storage of theorems, formulas, and their dependencies.
*   **Frontend:** Next.js + Framer Motion. "Bloomberg for Actuaries" aesthetic.
*   **Auth:** Role-based (Student/Pro/Institution).

**Success Metrics:**
*   **Accuracy:** >95% Symbolic Correctness on Benchmark.
*   **Latency:** <2s for Compute, <5s for RAG+Synthesis.
*   **Retention:** >40% DAU/MAU ratio.

---

## 2. System Architecture & Data Flow

```mermaid
graph TD
    User[Student] -->|Upload/Query| FE[Frontend (Next.js/Framer)]
    FE -->|API Gateway| API[Node.js / Express]
    
    subgraph "Ingestion Pipeline"
    API -->|Raw File| S3[Object Storage]
    S3 -->|Trigger| OCR[MathPix API]
    OCR -->|LaTeX + Text| Parser[Text/Math Parser]
    Parser -->|Chunks| Embed[OpenAI text-embedding-3]
    Embed -->|Vectors| Pinecone[Vector DB]
    Parser -->|Entities| Neo4j[Knowledge Graph]
    end

    subgraph "Reasoning Engine"
    API -->|Query| Router{Query Classifier}
    
    Router -->|Computational| SymPy[Python Symbolic Engine]
    Router -->|Concept/Search| Hybrid[Hybrid Retrieval]
    
    Hybrid -->|1. Dense Search| Pinecone
    Hybrid -->|2. Graph Traversal| Neo4j
    
    SymPy -->|Result| Synthesizer[LLM Synthesizer]
    Hybrid -->|Ctx + Snippets| Synthesizer
    
    Synthesizer -->|JSON Resp| API
    end

    subgraph "Analytics & feedback"
    API -->|Log Interaction| Postgres[Relational DB]
    Postgres -->|Aggregations| Dashboard[Analytics View]
    end
```

---

## 3. Database Schema Recommendations

### Relational (PostgreSQL) - User & Metadata
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  role VARCHAR(20) CHECK (role IN ('free', 'pro', 'institution')),
  institution_id UUID,
  created_at TIMESTAMP
);

CREATE TABLE documents (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  s3_key VARCHAR(255),
  title VARCHAR(255),
  parsing_status VARCHAR(20),
  math_density_score FLOAT, -- For routing decisions
  is_public BOOLEAN DEFAULT FALSE
);

CREATE TABLE queries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  query_text TEXT,
  query_type VARCHAR(20), -- 'symbolic', 'retrieval'
  latency_ms INTEGER,
  feedback_score INTEGER -- 1-5 stars
);
```

### Knowledge Graph Schema (Neo4j)
*   **Nodes labels:** `Concept`, `Formula`, `Theorem`, `Exam` (e.g., "Exam P"), `DocumentChunk`.
*   **Relationships:**
    *   `(Formula)-[:DERIVED_FROM]->(Theorem)`
    *   `(Concept)-[:TESTED_IN]->(Exam)`
    *   `(DocumentChunk)-[:MENTIONS]->(Concept)`
    *   `(Formula)-[:DEPENDS_ON]->(Variable)`

---

## 4. API Route Examples

### `POST /api/solve` (The Math Router)
```typescript
{
  "query": "Calculate variance of a 10-year deferred annuity due",
  "context_doc_ids": ["doc_123"]
}
```
**Logic:**
1.  **Classifier:** Detects "Calculate", "variance", "annuity". -> Route: **Hybrid**.
2.  **Symbolic:** Calls Python microservice: `curtate_variance(deferred=10, type='due')`.
3.  **Retrieval:** Fetches definitions from `doc_123` to confirm notation ($i$ vs $\delta$).
4.  **Response:** Returns standard JSON with `steps[]`.

### `POST /api/graph/explore` (Visual Explorer)
```typescript
{
  "concept": "Survival Function",
  "depth": 2
}
```
**Response:** Nodes and edges connecting "Survival Function" -> "Force of Mortality" -> "Life Table".

---

## 5. Math Solver Integration Plan

**Stack:** Python (FastAPI) + SymPy + Actuarial-specific libraries (`lifelib`).

**Library Structure:**
*   `agpt.life_contingencies`: `check_survival(x, t)`, `commutation_functions`.
*   `agpt.financial_math`: `annuity_due(n, i)`, `bond_price(yield, coupon)`.
*   `agpt.loss_models`: `aggregate_loss_variance(freq_dist, sev_dist)`.

**Workflow:**
1.  LLM generates **Python Code** based on the query (e.g., `solve(Eq(Price, 1000*v^n), n)`).
2.  **Sandbox Execution:** Run code in a secure, timeout-restricted environment.
3.  **Output:** Capture `stdout` and Latex-formatted return value.

---

## 6. Vector Retrieval Strategy (Hybrid)

1.  **Semantic Search:** `text-embedding-3-small` for broad concept matching.
2.  **Keyword Boost:** BM25 on extracted formulas (e.g., specifically matching "$$\ddot{a}_{x}$$").
3.  **Graph Expansion:** If user searches "Ruin Probability", also fetch chunks linked to "Cramér-Lundberg Model" via the Knowledge Graph.
4.  **Re-ranking:** Cohere Rerank to prioritize chunks from "Trusted Authorities" (e.g., SOA Syllabus docs) over random uploads.

---

## 7. Cost Modeling (Per 1,000 Active Users)

**Assumptions:**
*   User makes 10 queries/day.
*   Avg input: 500 tokens. Avg output: 1k tokens.

**Estimated Monthly Costs:**
1.  **LLM (OpenAI GPT-4o):**
    *   $5.00 / 1M input tokens * 15M tokens = $75
    *   $15.00 / 1M output tokens * 30M tokens = $450
2.  **MathPix OCR:**
    *   100 docs/mo * 10 pages * $0.002 = $2.00
3.  **Vector DB (Pinecone):** Starter Tier (~$70/mo).
4.  **Compute (Vercel/AWS):** ~$50.

**Total Est:** ~$650/month for 1k users ($0.65/user).
**Revenue:** Pro Plan @ $15/mo = $15,000.
**Margin:** ~95%.

---

## 8. Evaluation Framework (Harness)

**Python Script Outline (`eval_harness.py`):**
1.  Load `benchmark_questions.json`: `{ "q": "...", "ground_truth_latex": "..." }`.
2.  Run `agpt_solver(q)`.
3.  **Symbolic Check:** use SymPy to simplify `(generated_answer - ground_truth)`. If 0, Pass.
4.  **Citation Check:** Verify if returned Document ID exists in the "Gold Standard" list for that topic.

---

## 9. Monetization & Security Model

**Tiers:**
*   **Free:** 3 uploads (indexed but volatile). 10 Math queries/day.
*   **Pro ($15/mo):** Unlimited. Knowledge Graph Explorer. Notebook Mode.
*   **Institution:** SSO. Admin Dashboard. "Professor Mode" (upload authoritative answer keys).

**Security:**
*   **Encryption:** AES-256 for parsed text stored in DB.
*   **Presigned URLs:** S3 links expire after 15 minutes.
*   **Provenance:** Every answer block has a content hash of the source chunk.

---

## 10. Cinematic UI Implementation Guide

**Nano Banana → Framer Workflow:**
1.  **Nano Banana:** Generate "Flowing Probability Cloud" 3D asset.
2.  **Export:** `high_res_cloud.webm` (video with alpha channel).
3.  **Framer:**
    *   Import video as background.
    *   Add `ScrollTransform` to rotate the cloud as user reads.
    *   Overlay glass cards with `backdrop-filter: blur(20px)`.
4.  **Export Code:** Copy React component code (`framer-motion` variants) into `src/components/Hero.tsx`.

---

This blueprint provides the exact roadmap to move from MVP (Sprint 2/3) to the fully realized "Bloomberg for Actuaries" product.
