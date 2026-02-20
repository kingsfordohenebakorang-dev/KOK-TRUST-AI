# KOK TRUST AI: Architecture & Logic Overview

**KOK TRUST AI** is an "Academic Intelligence Infrastructure" designed to solve complex actuarial problems with 100% mathematical precision. Unlike standard chatbots (ChatGPT), it is built on a **Neuro-Symbolic Architecture** that combines the creativity of Large Language Models (LLMs) with the rigorous accuracy of symbolic math engines (Python/SymPy).

---

## 1. Core Logic: The "Trust Layer"

The system does not just "guess" the answer. It follows a strict 3-step verification process for every query:

### Step 1: Intent & Formulation (The LLM)
*   **Input**: User asks, "Calculate the present value of a 10-year annuity-due of 1000 with i=5%."
*   **Role**: The LLM (e.g., GPT-4o) parses the natural language and identifies the actuarial concept (`annuity_due`), variables (`n=10`, `pmt=1000`, `i=0.05`), and the required formula.
*   **Output**: It generates a structured **Python script** instead of a text answer.

### Step 2: Symbolic Execution (The Math Engine)
*   **Action**: The system executes this Python code in a secure, sandboxed environment using `SymPy` (a symbolic mathematics library).
*   **Why**: LLMs are bad at arithmetic (they hallmark numbers). Python is perfect at it.
*   **Result**: The code returns the exact numerical value (e.g., `8107.82`) and the LaTeX intermediate steps.

### Step 3: Synthesis & Provenance (The Response)
*   **Final Output**: The LLM takes the verified number and wraps it in a natural language explanation.
*   **Citation**: It scans the user's uploaded vector database to find the source of the formula (e.g., "Verified from Life Contingencies, Page 42").

---

## 2. Institutional Workflow (The 6 Layers)

The platform is structured into 6 strategic layers to serve the entire university ecosystem:

1.  **Lecturer Layer**: Validates the content. Lecturers upload official syllabi, creating a "Ground Truth" for the AI.
2.  **Institutional Dashboard**: Aggregates data. Department heads see which topics students are failing (Weakness Heatmaps) to adjust curriculum.
3.  **Predictive Analytics**: Forecasting. Using historical trends to tell a student, "You have a 68% chance of passing Exam P."
4.  **Timed Simulation**: Realism. A mock exam engine that mimics the pressure of real SOA/CAS exams with countdowns and auto-submission.
5.  **Retention Tools**: Habit building. Offline flashcards (PWA) and spaced repetition algorithms ensure long-term memory.
6.  **Growth Mechanics**: Scaling. Built-in referral systems and peer benchmarking ("You are in the top 10% of your cohort").

---

## 3. Technical Stack (The "How")

*   **Frontend**: Next.js 14 (React) for a cinematic, responsive UI. Framer Motion for premium animations.
*   **Backend**: Node.js/Deepgram (for voice) + Python (for math).
*   **Database**: 
    *   **PostgreSQL (Prisma)**: Stores user profiles, exam history, and subscription tiers.
    *   **Vector DB (Pinecone)**: Stores millions of chunks of textbook text for RAG (Retrieval-Augmented Generation).
*   **Auth**: Secure JWT-based authentication supporting Institutional SSO.

---

## Summary for Code Review

**"KOK TRUST AI is not a wrapper around ChatGPT. It is a vertically integrated academic platform that offloads mathematical reasoning to a symbolic engine and grounds every response in verified institutional data. It prioritizes precision (for the student) and analytics (for the university)."**
