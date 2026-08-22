# 📚 Sub-PRD 01: AI Active Recall & Flashcard Generator Engine

**Module:** AI Active Recall Engine  
**Version:** 1.0.0  
**Parent PRD:** Nexus Academia Master PRD  
**Owner:** AI & Cognitive Engineering Team  

---

## 1. Overview & Objectives

The **AI Active Recall & Flashcard Generator Engine** solves the primary inefficiency in modern study workflows: the manual overhead of creating study materials. By leveraging LLM-driven text extraction, Bloom’s Taxonomy concept hierarchy, and the **SuperMemo-2 (SM-2)** Spaced Repetition Algorithm, this engine transforms raw lecture notes into interactive flashcards and schedules reviews for optimal long-term retention.

---

## 2. Architecture & Data Flow

```
[Raw Input: Notes / PDF / Topic] 
       │
       ▼
[Chunking Pipeline (500-1000 tokens)]
       │
       ▼
[LLM Extraction Prompt (GPT-4o / Gemini 1.5)]
       │
       ▼
[Structured JSON Card Deck]
       │
       ▼
[Interactive 3D Flip Card UI] ◄──► [SM-2 Spaced Repetition Engine]
```

---

## 3. SuperMemo-2 (SM-2) Spaced Repetition Algorithm

For every card review, the user assesses recall quality \( q \in [1, 4] \):
- **1 (Again):** Complete blackout / incorrect response.
- **2 (Hard):** Correct answer recalled with serious difficulty.
- **3 (Good):** Correct answer recalled after a brief pause.
- **4 (Easy):** Perfect, immediate recall.

### Mathematical Formulation

1. **Ease Factor (\(EF\)) Update:**
   \[
   EF' = \max\left(1.3, \, EF + \left(0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02)\right)\right)
   \]
   *(Default initial \(EF = 2.5\))*

2. **Repetition Interval (\(I\)) Calculation:**
   - If \( q < 2 \): \( n = 0, \, I_1 = 1 \text{ day} \) (Reset card)
   - If \( n = 1 \): \( I_1 = 1 \text{ day} \)
   - If \( n = 2 \): \( I_2 = 6 \text{ days} \)
   - If \( n > 2 \): \( I_n = \lceil I_{n-1} \times EF' \rceil \)

---

## 4. Technical Specifications & API Schema

### 4.1 Generation Endpoint: `POST /api/flashcards/generate`

#### Request Payload:
```json
{
  "subject": "Computer Science",
  "courseCode": "CS401",
  "topic": "Neural Networks Backpropagation",
  "sourceText": "Backpropagation calculates the gradient of the loss function with respect to each weight using the chain rule...",
  "cardCount": 5,
  "difficulty": "Medium"
}
```

#### Response Payload:
```json
{
  "deckId": "deck_9921a",
  "deckTitle": "CS401: Neural Networks Backpropagation",
  "cards": [
    {
      "id": "card_01",
      "question": "What mathematical principle does backpropagation rely on to calculate gradients?",
      "answer": "The chain rule of calculus to compute loss gradients with respect to weights layer-by-layer.",
      "category": "Deep Learning",
      "easeFactor": 2.5,
      "interval": 1,
      "repetitions": 0,
      "dueDate": "2026-08-11T00:00:00Z"
    }
  ]
}
```

---

## 5. UI/UX Functional Requirements

1. **3D Card Flip Motion:** Card container uses CSS `transform: rotateY(180deg)` with `perspective: 1000px` for smooth tactile feedback.
2. **Mastery Progress Bar:** Displays percentage of cards in `Good` or `Easy` status.
3. **Daily Queue Widget:** Displays number of cards due for review today on the primary dashboard bento grid.
