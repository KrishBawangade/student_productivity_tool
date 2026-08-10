# 📊 Sub-PRD 04: Grade Target Forecaster & Academic Analytics

**Module:** Academic Analytics & Grade Calculator Engine  
**Version:** 1.0.0  
**Parent PRD:** Nexus Academia Master PRD  
**Owner:** Analytics & Data Science Team  

---

## 1. Overview & Business Logic

The **Grade Target Forecaster** removes academic anxiety by giving students real-time clarity on their course standing. By inputting current grade percentages, final exam weights, and desired target letter grades, the forecaster computes exact target scores required on upcoming exams and projects.

---

## 2. Mathematical Formulations

### 2.1 Final Exam Required Score Formula

Let:
- \( G_{\text{target}} \): Desired overall final grade in the course (e.g., \(90\%\) for an A).
- \( G_{\text{current}} \): Current average grade percentage in the course to date (e.g., \(87.5\%\)).
- \( W_{\text{exam}} \): Weight of the final exam as a decimal (e.g., \(0.30\) for a \(30\%\) final exam).
- \( W_{\text{completed}} \): Total weight of coursework completed so far, where \( W_{\text{completed}} = 1 - W_{\text{exam}} \).

The required exam score \( S_{\text{required}} \) is:

\[
S_{\text{required}} = \frac{G_{\text{target}} - \left(G_{\text{current}} \times W_{\text{completed}}\right)}{W_{\text{exam}}}
\]

### 2.2 Numerical Example

If a student has an **88%** current grade, wants a **92% (A)** final grade, and the final exam is worth **30%**:

\[
S_{\text{required}} = \frac{92 - (88 \times 0.70)}{0.30} = \frac{92 - 61.6}{0.30} = \frac{30.4}{0.30} = 101.33\%
\]

---

## 3. Status Thresholds & UI Feedback Rules

| Required Score Range | Status Code | UI Pill Color | Descriptive Message |
|---|---|---|---|
| \( \le 75\% \) | `SAFE` | Green (`#059669`) | **Comfortable Target** — You are well on track! |
| \( 75.1\% - 89.9\% \) | `MODERATE` | Blue (`#0284C7`) | **Achievable** — Requires solid revision. |
| \( 90.0\% - 99.9\% \) | `HIGH` | Amber (`#D97706`) | **High Target** — Near-perfect score needed. |
| \( \ge 100.0\% \) | `IMPOSSIBLE` | Red (`#DC2626`) | **Extra Credit Required** — Mathematically unachievable without bonus points. |

---

## 4. Feature Enhancements & Interactive Scenarios

1. **What-If Slider:** An interactive slider letting students drag hypothetical exam scores (from \(0\%\) to \(100\%\)) to see the instant impact on final overall GPA.
2. **Multi-Course Target Board:** Grid summary showing target exam scores across all enrolled courses in the current semester.
