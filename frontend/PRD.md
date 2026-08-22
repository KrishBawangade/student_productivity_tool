# 📄 Product Requirements Document (PRD)
## Project: **Nexus Academia – AI-Powered Student Productivity Dashboard**

**Document Version:** 1.0.0  
**Status:** Approved for Core Implementation  
**Date:** August 10, 2026  
**Target Audience:** Engineering, Product Management, UI/UX Design, QA, and Academic Advisors  

---

## 1. Executive Summary & Vision

### 1.1 Product Vision
**Nexus Academia** is an all-in-one, AI-native productivity and study acceleration platform designed for modern high school, undergraduate, and postgraduate students. By integrating **gamified progression mechanics (XP, Streaks, Scholar Ranks)**, **ambient focus engines (Pomodoro + Lo-Fi Soundscapes)**, **AI Active Recall Flashcard generation**, **Grade Target Forecasting**, and an **interactive AI Study Copilot**, Nexus Academia eliminates academic friction, combats cognitive burnout, and enables students to reach flow state effortlessly.

### 1.2 Core Problem Statement
1. **Tool Fragmentation:** Students currently jump between 5–7 disparate apps (Notion, Quizlet, Forest focus timers, Spotify lo-fi playlists, Excel grade spreadsheets, ChatGPT).
2. **Procrastination & Low Engagement:** Traditional study workflows lack instant feedback loops, dopamine-aligned gamification, and milestone celebrations.
3. **Passive Study Inefficiency:** Rereading notes yields low memory retention compared to Active Recall and Spaced Repetition (SRS), but manual flashcard creation is tedious and time-consuming.
4. **Academic Uncertainty:** Students struggle to quantify their current standing or calculate the exact final exam scores needed to achieve target course grades.

### 1.3 Key Value Proposition
- **Single-Pane Bento Dashboard:** Consolidates focus tools, task management, ambient sounds, grade forecasting, and AI assistance into one cohesive glassmorphic dashboard.
- **Dopamine-Driven Gamification:** Real-time XP rewards (+50 XP per high-priority task), multi-day streak multipliers, visual confetti animations, and level upgrades.
- **Zero-Friction AI Active Recall:** One-click conversion of lecture notes and textbook excerpts into structured flashcards with mastery tracking.
- **Predictive Academic Forecaster:** Real-time grade prediction and target score modeling to remove grade anxiety.

---

## 2. User Personas & Target Demographics

### Persona 1: Alex – The Undergraduate STEM Student
- **Profile:** Junior in Computer Science & Mathematics.
- **Pain Points:** Heavy workload with overlapping programming labs and theory homework; context-switching fatigue between IDE, notes, and music apps.
- **Goals:** Wants to maximize daily study efficiency, automate card creation for complex theory, and track exact exam target scores to maintain a 3.8 GPA.

### Persona 2: Maya – The High-School & Test Prep Achiever
- **Profile:** 12th Grade AP / IB / SAT candidate.
- **Pain Points:** Social media distractions; high anxiety around long study sessions; difficulty maintaining consistent daily study habits.
- **Goals:** Needs clear gamified motivation (streaks, level-ups, confetti rewards), timed focus intervals, and calming soundscapes to stay focused.

### Persona 3: Sam – The Lifelong & Distance Learner
- **Profile:** Working professional pursuing an online Master’s degree or certification.
- **Pain Points:** Fragmented 30–45 minute study windows between work and family; limited time to summarize lengthy PDF lectures.
- **Goals:** Wants instant focus setup (one-click Pomodoro + cafe ambient audio) and an AI Copilot to quickly explain complex concepts.

---

## 3. Detailed Product Feature Specifications

### Module 1: Gamified Achievement & XP System
- **XP Reward Structure:**
  - Complete High-Priority Quest: **+50 XP**
  - Complete Medium/Low Quest: **+20 to +35 XP**
  - Complete 25-Minute Focus Session: **+150 XP**
  - Master Flashcard Deck: **+75 XP**
- **Streak Tracker:** Tracks consecutive daily logins and completed focus sessions; features dynamic flame icon & multiplier indicators.
- **Particle & Confetti FX:** Triggers physics-based canvas confetti animations (`canvas-confetti`) on task completion and level progression.
- **Scholar Level Ranks:** Level formula: \( \text{XP}_{\text{required}} = 1000 \times \text{Level} \). Displays level title (e.g., *Level 14 - Academic Architect*).

### Module 2: Quest Matrix (Smart Task Management)
- **Priority Quadrants:** High (Urgent/Important), Medium (Upcoming), Low (Maintenance).
- **Course Labeling:** Tagging by course codes (e.g., `CS401 AI`, `MATH302`, `CS310`).
- **Due Date Tracking:** Relative timestamps (`Today, 11:59 PM`, `Tomorrow`, `Aug 12`).
- **Interactive Checklists:** Instant toggle checkboxes with strikethrough animation and floating XP toast feedback.

### Module 3: Ambient Focus Engine (Pomodoro + Soundscapes)
- **Timer Modes:**
  - Work Focus Session: **25 minutes**
  - Short Break: **5 minutes**
  - Long Break: **15 minutes**
- **Generative Audio Soundscapes:**
  - *Cyber Beats:* Synthwave / Cyberpunk lofi tracks.
  - *Rain & Thunder:* Calming nature rain audio.
  - *Cozy Cafe:* Ambient background coffee shop atmosphere.
  - *Mute / Silent:* Pure silent focus timer.
- **Controls:** Play, Pause, Reset, Mode Selection, Volume Slider.

### Module 4: AI Active Recall & Flashcard Deck Generator
- **Interactive Card UI:** 3D card flip animation revealing question on front and answer/explanation on back.
- **SRS & Mastery Metadata:** Category tags, Difficulty rating (Easy, Medium, Hard), and Mastered toggle status.
- **AI Generator Pipeline:** Input lecture notes or text prompt \(\rightarrow\) Generates structured flashcard JSON payload via LLM backend.

### Module 5: Grade Target Forecaster & Academic Analytics
- **Inputs:** Current Course Grade (%), Desired Target Final Grade (%), Final Exam Weight (%).
- **Mathematical Formula:**
  \[
  \text{Required Exam Score} = \frac{\text{Target Grade} - \left(\text{Current Grade} \times (1 - \text{Exam Weight})\right)}{\text{Exam Weight}}
  \]
- **Real-Time Output:** Calculates exact target percentage required on the final exam with status alerts (*Achievable*, *Challenging*, *Requires Extra Credit*).

### Module 6: AI Study Copilot & Concept Explainer
- **Interactive Chat Assistant:** Drawer/modal interface for context-aware Q&A.
- **Preset Quick Actions:** "Explain like I'm 5", "Summarize Key Concepts", "Generate 5 Practice Questions".
- **Rich Rendering:** Support for Markdown, syntax-highlighted code snippets, and mathematical formulas (\(\LaTeX\)).

---

## 6. Technical Architecture & Tech Stack

### 4.1 Frontend Stack
- **Framework:** Next.js 16 (App Router)
- **UI Engine:** React 19, TypeScript
- **Styling:** Tailwind CSS v4, Custom CSS Glassmorphism (`backdrop-blur-md`, pastel gradient mesh)
- **Icons & Animation:** Lucide React, `canvas-confetti`

### 4.2 Backend & API Architecture (Target State)
- **API Routes:** Next.js Server Actions / Route Handlers (`/api/flashcards`, `/api/copilot`, `/api/forecast`)
- **LLM Engine:** OpenAI API (GPT-4o / GPT-4o-mini) or Google Gemini 1.5 Flash
- **State & Storage:** LocalStorage for state persistence, optional Prisma + PostgreSQL database for multi-device sync.

---

## 5. UI/UX & Visual Design System

- **Color Palette:**
  - Background: Ceramic light canvas with soft pastel gradient mesh overlay (`#F8FAFC`, `#EEF2FF`, `#E0F2FE`).
  - Primary Accents: Deep Indigo (`#4F46E5`), Sky Blue (`#0284C7`), Emerald Green (`#059669`), Amber Flame (`#D97706`).
- **Component Design:** Glassmorphism frosted panels (`backdrop-blur-md bg-white/70 border border-slate-200/80`), rounded `3xl` corners, soft ambient shadows.
- **Micro-Interactions:** Tactile button click states, hover scaling (`hover:scale-[1.02]`), fluid progress bar fills, toast notifications.

---

## 6. Release Roadmap & Milestones

| Phase | Milestone | Deliverables | Target Date |
|---|---|---|---|
| **Phase 1** | **Interactive UI MVP** | Next.js 16 Dashboard with Bento preview, Pomodoro, Soundscapes, Quest Matrix, XP engine, Flashcard Deck, Landing Page. | **Aug 2026 (Completed)** |
| **Phase 2** | **AI Backend Integration** | Connect Next.js API routes with Google Gemini for flashcard auto-generation, document context upload, and Copilot chat. | **Aug 2026 (Completed)** |
| **Phase 3** | **Persisted Storage & LMS Sync** | User authentication (Clerk/NextAuth), PostgreSQL DB sync, Canvas/Blackboard grade & calendar import. | **Q4 2026** |

---

## 7. Success Metrics & Performance KPIs

- **Daily Active Users (DAU):** Active students engaging daily (\(>45\%\) retention at Day 30).
- **Focus Volume:** Average focus session duration per active user (\(>50\text{ mins/day}\)).
- **Task Velocity:** High-priority quest completion rate (\(>85\%\)).
- **Student Satisfaction:** Net Promoter Score (NPS \(>60\)).
