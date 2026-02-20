# Syllabus & Exam Intelligence Engine Blueprint

## 1. Core Architecture
The engine operates on a **Upload -> Extract -> Model -> Generate** pipeline. It bridges unstructured teaching materials (slides) and structured assessment patterns (past exams) to create high-fidelity, validated practice problems.

---

## 2. Database Schema Additions (PostgreSQL / Supabase)

```sql
-- Syllabus & Topic Management
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID REFERENCES institutions(id),
    code VARCHAR(50), -- e.g., 'ACTSC 231'
    name VARCHAR(255),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE syllabus_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id),
    parent_id UUID REFERENCES syllabus_topics(id), -- Hierarchy support
    title VARCHAR(255),
    learning_objectives TEXT[],
    extracted_formulas JSONB, -- Array of LaTeX strings
    weight_factor FLOAT DEFAULT 1.0, -- Relative frequency/importance
    slide_reference_ids UUID[] -- Links to specific uploaded files
);

-- Exam Profiling
CREATE TABLE exam_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id),
    profile_name VARCHAR(100), -- 'Midterm Style', 'Finals 2024 Pattern'
    instruction_template TEXT, -- "Answer ALL questions. Calculator allowed."
    total_marks INTEGER,
    average_question_length_words INTEGER,
    difficulty_distribution JSONB, -- { "recall": 0.2, "application": 0.5, "synthesis": 0.3 }
    style_vector FLOAT[] -- Embedding representing tone/style
);

-- Question Bank
CREATE TABLE generated_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES exam_profiles(id),
    primary_topic_id UUID REFERENCES syllabus_topics(id),
    question_latex TEXT,
    marking_scheme_latex TEXT,
    difficulty_level VARCHAR(20), -- 'easy', 'medium', 'hard'
    max_marks INTEGER,
    verification_status VARCHAR(20) DEFAULT 'pending', -- 'validated', 'failed', 'unchecked'
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. AI Generation Prompts

### **A. Format Extraction Prompt (System)**
```text
You are an expert Educational Assessor. Your task is to analyze a past actuarial exam paper and extract its "Genetic Code".

Analyze the following document and output a JSON object containing:
1. "instruction_style": The exact phrasing of header instructions.
2. "tone": (Academic, Practical, Theoretical, Brief).
3. "question_structure": Common patterns (e.g., "(a) Define... (b) Derive... (c) Calculate...").
4. "command_verbs": List of most frequent verbs (e.g., "Show that", "Calculate", "Discuss").
5. "mark_allocation_pattern": Average marks per sub-question.

Do NOT solve the questions. Focus purely on structure and style.
```

### **B. Question Generation Prompt (User)**
```text
Role: Senior Actuarial Examiner
Task: Generate a NEW question based on the provided "Target Style" and "Syllabus Topic".

Target Style:
- Tone: Formal, rigorous.
- Structure: 3-part question (Derivation -> Calculation -> Interpretation).
- Marks: 10 Total (4, 4, 2).
- Command verbs: "Derive", "Calculate the probability", "Comment on".

Syllabus Topic:
- Continuous Whole Life Annuity
- Constant Force of Interest

Constraint:
- The question MUST be mathematically solvable.
- Do NOT use the exact same scenario as the reference example.
- Change the underlying distribution from Uniform to Exponential if applicable, or vary the interest rate visualization.

Output Format:
{
  "question": "Latex string...",
  "solution": "Step-by-step Latex...",
  "marks_breakdown": [{"step": "...", "marks": 1}, ...]
}
```

---

## 4. Logical Pipeline

### **Format Detection Logic (Python/LangChain)**
1.  **Ingest**: PDF -> Text (keeping layout spatial data).
2.  **Cluster**: Group text blocks by "Question 1", "Question 2" using Regex `^Q\d+` or `^\d+\.`.
3.  **Analyze**:
    *   *Marks*: Extract `(\d+ marks)` or `[\d]` patterns. Calculate Mean/Variance.
    *   *Length*: Count tokens per question.
    *   *Keywords*: TF-IDF on command verbs.
4.  **Profile**: Save aggregated stats to `exam_profiles`.

### **Symbolic Validation Integration (SymPy)**
1.  **Parse**: Extract formulas from the generated LaTeX question.
2.  **Define**: Create SymPy symbols (`x`, `t`, `delta`, `mu`).
3.  **Solve**:
    *   If the question asks to "Show that $A = B$", the system attempts to simplify $A - B$ to 0.
    *   If the question asks for a numerical answer, the system computes the integral/summation.
4.  **Verify**: Compare SymPy result with LLM generated solution.
    *   *Match?* -> `verification_status = 'validated'`.
    *   *Mismatch?* -> Flag for manual review or regenerate.

---

## 5. UI Workflow (Cinematic Interaction)

### **Phase 1: Syllabus Ingestion**
*   **Drag & Drop**: User drops a stack of PDFs (Slides).
*   **Visual**: A "Scanning" animation (glowing lines scanning the docs).
*   **Result**: A hierarchical Tree View of topics appears on the left.
    *   *Action*: User helps correct extraction errors (drag/drop topics).
    *   *Metadata*: Clicking a topic shows "Formulas Detected" sidebar.

### **Phase 2: Exam Profiling**
*   **Upload**: User uploads "Midterm_2023.pdf".
*   **Analysis**: System displays "Exam DNA" card:
    *   *Difficulty*: ★★★★☆ (Hard)
    *   *Focus*: 60% Derivation, 40% Calculation.
    *   *Avg Marks*: 12 per question.

### **Phase 3: Generation & Practice**
*   **Controls**: Slider for "Difficulty" (Easier / Same / Harder).
*   **Action**: Click "Generate Mock Exam" (Spark particle effect).
*   **View**:
    *   Questions appear one by one with a fade-in effect.
    *   **Timer**: Starts automatically.
    *   **Solution Reveal**: Button "Show Marking Scheme" is disabled until Timer > 50% or explicit override.
    *   **Marking Scheme**: When revealed, it slides out from the right, aligning step-by-step with the user's view of the question.

---

## 6. Detailed Marking Scheme Logic
The system generates a 'Timed Reveal' marking scheme.
*   **Input**: User sets "Review Time" (e.g., 30 mins after start).
*   **Display**:
    *   The marking scheme is hidden behind a blurred glass layer.
    *   User can "Peek" (reveals 1 step, costs 'Integrity Score').
    *   Full reveal highlights keywords that *must* be present for marks.
    *   It breaks down marks: "Method mark (M1)", "Accuracy mark (A1)".
