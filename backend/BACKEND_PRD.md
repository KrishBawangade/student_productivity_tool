# 📄 Backend Product Requirements Document (PRD)
## Project: **Nexus Academia – Standalone Custom Backend Engine**

**Document Version:** 1.0.0  
**Status:** Approved for Implementation  
**Date:** August 22, 2026  
**Target Audience:** Backend Engineers, System Architects, API Consumers (Next.js Frontend)

---

## 1. Executive Summary & Vision

### 1.1 Purpose
The **Nexus Academia Backend Engine** is a decoupled, high-performance Node.js/Express RESTful API service built with TypeScript. It powers the **Nexus Academia Student Productivity Dashboard** by handling business logic, database persistence via **Prisma ORM & PostgreSQL (Neon)**, **Google Gemini AI integrations** (Flashcard generation & Study Copilot), and gamified XP/streak calculations.

### 1.2 Tech Stack
- **Runtime Environment:** Node.js (v20+) with TypeScript (ES2022 / NodeNext).
- **Web Server Framework:** Express.js (v4.21+).
- **Database ORM:** Prisma ORM (v5.22+) with PostgreSQL (Neon Serverless Pooler & Direct Connection).
- **AI Engine:** `@google/generative-ai` (Google Gemini SDK).
- **CORS & Middleware:** `cors`, `dotenv`, custom centralized error handling middleware.
- **Development Tooling:** `tsx` for live-reload development, `typescript` compiler for production builds.

---

## 2. System Architecture & Layered Design

The backend strictly enforces a **4-Tier Modular Architecture** to separate HTTP handling, business logic, data access, and database/external service integration.

```
                  ┌──────────────────────────────────────────────┐
                  │          Next.js Frontend Client             │
                  └──────────────────────┬───────────────────────┘
                                         │ HTTP REST (JSON)
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │             CORS & Middleware                │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                         4-TIER BACKEND ENGINE                               │
  │                                                                             │
  │  1. ROUTER & CONTROLLER LAYER (/src/routes, /src/controllers)             │
  │     • Validates HTTP inputs & path parameters.                              │
  │     • Formats standardized JSON responses: { success, data, error }.        │
  │                                                                             │
  │  2. SERVICE LAYER (/src/services)                                           │
  │     • Implements core business rules (XP awards, level calculations).        │
  │     • Orchestrates Gemini AI prompt calls & JSON parsing.                  │
  │     • Executes Spaced Repetition (SRS) algorithms.                          │
  │                                                                             │
  │  3. REPOSITORY / DATA ACCESS LAYER (/src/repositories)                       │
  │     • Interacts directly with Prisma Client / Postgres DB.                   │
  │     • Provides in-memory mock fallback when DB is disconnected.            │
  │                                                                             │
  │  4. DATABASE & EXTERNAL SERVICES LAYER (/src/config)                        │
  │     • Neon PostgreSQL Database (Prisma Client).                             │
  │     • Google Gemini Generative AI SDK.                                      │
  └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Database Schema (Prisma Specifications)

The backend uses PostgreSQL managed via Prisma ORM (`backend/prisma/schema.prisma`).

### 3.1 Core Models
1. **`User`**: Tracks user identity, level, XP, consecutive streaks, streak shields, total focus minutes, and counts.
2. **`Task`**: Represents Quest Matrix tasks (title, course, dueDate, priority: `high`|`medium`|`low`, xp: `15..50`, completed).
3. **`Flashcard`**: Active Recall card (question, answer, topic, codeSnippet, difficulty, easeFactor, interval, repetitions, dueDate, mastered).
4. **`CourseGrade`**: Grade Target Forecaster record (code, name, currentGrade, targetGrade, examWeight, color).
5. **`StudySession`**: Focus timer logs (course, durationMinutes, date, type: `pomodoro`|`active_recall`|`quiz`).
6. **`QuizAttempt`**: Quiz performance tracking (title, course, score, totalQuestions, date, xpEarned).
7. **`NoteItem`**: Lecture notes workspace (title, course, rawText, summary, keyTakeaways, tags, counts).

---

## 4. API Endpoints Specification

All API endpoints are prefixed with `/api/v1`.

### 4.1 System & Health Endpoints
- **`GET /api/v1/health`**: Returns server status, environment, and uptime timestamp.
- **`GET /api/v1`**: Index endpoint listing API version and route registry.

### 4.2 Quest Matrix (Tasks) API
- **`GET /api/v1/tasks`**: Fetch all tasks (supports query filter `?priority=high` or `?completed=false`).
- **`POST /api/v1/tasks`**: Create a new task (awards +20 to +50 XP based on priority).
- **`PUT /api/v1/tasks/:id`**: Update task state (e.g. toggle completion).
- **`DELETE /api/v1/tasks/:id`**: Delete a task.

### 4.3 Active Recall (Flashcards) & AI Generator API
- **`GET /api/v1/flashcards`**: Fetch all flashcard decks and mastery status.
- **`POST /api/v1/flashcards`**: Create a single flashcard manually.
- **`POST /api/v1/flashcards/generate`**: **AI Endpoint**. Accepts text prompt or lecture notes, calls Gemini AI, returns structured flashcards array.
- **`PUT /api/v1/flashcards/:id`**: Update card difficulty, review date (SRS), or mastered toggle.
- **`DELETE /api/v1/flashcards/:id`**: Delete flashcard.

### 4.4 AI Study Copilot API
- **`POST /api/v1/copilot/chat`**: Send prompt to Gemini AI Copilot (supports quick actions: "Explain like I'm 5", "Summarize Key Concepts", "Generate 5 Practice Questions").
- **`POST /api/v1/copilot/explain`**: Explains a specific code snippet or formula with markdown & LaTeX output.

### 4.5 Grade Target Forecaster API
- **`GET /api/v1/courses`**: Fetch all courses and grade target settings.
- **`POST /api/v1/courses`**: Add a new course.
- **`POST /api/v1/courses/calculate`**: Calculate exact final exam score required using formula:
  \[
  \text{Required Score} = \frac{\text{Target} - (\text{Current} \times (1 - \text{Weight}))}{\text{Weight}}
  \]
- **`PUT /api/v1/courses/:id`**: Update course grades.
- **`DELETE /api/v1/courses/:id`**: Delete course.

### 4.6 User Profile & Gamification API
- **`GET /api/v1/user`**: Fetch current user profile, rank title, XP, level, and streak count.
- **`PUT /api/v1/user`**: Update user settings.
- **`POST /api/v1/user/xp`**: Add XP to user and handle automatic Level Up check (\( \text{XP}_{\text{req}} = 1000 \times \text{Level} \)).

---

## 5. Standardized API Response Format

All responses strictly follow the standard JSON envelope:

```typescript
// Success Response (200 OK, 201 Created)
{
  "success": true,
  "data": { ... },
  "message": "Task created successfully"
}

// Error Response (400 Bad Request, 404 Not Found, 500 Internal Error)
{
  "success": false,
  "error": "Detailed error message string"
}
```

---

## 6. AI Prompt Pipeline (Google Gemini Integration)

### 6.1 Flashcard Generation System Prompt
The backend formats prompts sent to Gemini model `gemini-1.5-flash` or `gemini-2.0-flash` with JSON output instructions:

```text
You are an expert academic tutor. Analyze the given lecture note text and generate 5 high-quality active-recall flashcards.
Return ONLY valid JSON matching this schema:
[
  {
    "question": string,
    "answer": string,
    "topic": string,
    "difficulty": "Easy" | "Medium" | "Hard",
    "codeSnippet"?: string
  }
]
```

---

## 7. Security, CORS & Hosting Strategy

### 7.1 Security & Environment Isolation
- **CORS Config:** Restricts origins to `process.env.CORS_ORIGIN` (e.g. `http://localhost:3000` in dev, production Vercel domain in prod).
- **Environment Secrets:** Secrets (`DATABASE_URL`, `GEMINI_API_KEY`) loaded via `dotenv` and validated in `src/config/env.ts`.

### 7.2 Hosting & Deployment Plan
- **Backend Service:** Hostable on Render, Railway, Fly.io, or AWS EC2 using `npm run build` & `npm start` (or Docker).
- **Database:** Neon PostgreSQL Serverless instance with pooling.
