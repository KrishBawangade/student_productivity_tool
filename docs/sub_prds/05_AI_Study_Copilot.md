# 🤖 Sub-PRD 05: AI Study Copilot & Contextual Assistant

**Module:** AI Study Copilot Drawer  
**Version:** 1.0.0  
**Parent PRD:** Nexus Academia Master PRD  
**Owner:** AI & LLM Interface Team  

---

## 1. Overview & Vision

The **AI Study Copilot** acts as a 24/7 intelligent tutor built right into the student's dashboard. It helps students understand difficult topics, debug code, solve complex equations, and break down dense academic papers into digestible summaries without context switching.

---

## 2. Capabilities & Prompt Engineering Modes

### 2.1 Preset Prompt Templates

1. **Feynman Explainer ("ELI5 Mode"):**
   - *System Prompt:* "Explain the following academic concept using simple analogies, real-world examples, and step-by-step intuition as if explaining to a 12-year-old."
2. **Socratic Quizmaster:**
   - *System Prompt:* "Do not give the direct answer immediately. Ask 3 guiding Socratic questions to help the student deduce the solution independently."
3. **Formula & Notation Breakdown:**
   - *System Prompt:* "Deconstruct every variable, subscript, and constant in this formula using KaTeX/LaTeX formatting and clear bullet points."

---

## 3. Streaming Response & UI Rendering Pipeline

```
[User Input Query] ──► [API Route Handler] ──► [LLM Streaming SSE Stream]
                                                      │
                                                      ▼
[Markdown Parser + Syntax Highlighter + KaTeX Renderer] ──► [UI Chat Bubble]
```

### 3.1 Supported Formatting Specs
- **LaTeX Math Expressions:** Rendered via KaTeX (inline `$e = mc^2$` and block `$$\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$`).
- **Code Highlighting:** Syntax highlighted code blocks with one-click "Copy Code" button.
- **Action Pills:** Preset quick buttons above the text bar: `Explain Concept`, `Generate Quiz`, `Summarize PDF`.

---

## 4. RAG Pipeline & Context Integration (Phase 2 Target)

1. **Document Upload:** Supports `.pdf`, `.txt`, and `.md` course notes.
2. **Vector Indexing:** Client/Server vector embeddings stored per user session.
3. **Source Citation:** Copilot answers include clickable inline citations (e.g., `[Source: Chapter 4, Slide 12]`) referencing exact notes.
