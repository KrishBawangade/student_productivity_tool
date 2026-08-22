# 🎮 Sub-PRD 02: Gamification & XP Behavioral Mechanics Engine

**Module:** Gamification System  
**Version:** 1.0.0  
**Parent PRD:** Nexus Academia Master PRD  
**Owner:** Product Design & Gamification Architecture Team  

---

## 1. Overview & Behavioral Psychology Goals

The **Gamification & XP Engine** turns academic responsibilities into positive feedback loops. Utilizing principles of habit loops (Cue \(\rightarrow\) Routine \(\rightarrow\) Reward) and variable reward schedules, this engine motivates consistent daily engagement, prevents procrastination, and celebrates student effort with dynamic visual feedback.

---

## 2. XP Reward Structure & Progression Matrix

### 2.1 Base XP Earnings Table

| Action Type | Condition | XP Earmed | Visual Feedback |
|---|---|---|---|
| **High Priority Quest** | Complete tagged High-priority task | **+50 XP** | Confetti Blast + Floating Gold Badge |
| **Medium Priority Quest** | Complete tagged Medium-priority task | **+35 XP** | Floating Blue Badge |
| **Low Priority Quest** | Complete tagged Low-priority task | **+20 XP** | Gentle Pulse Animation |
| **Pomodoro Focus Session** | Complete 25-min uninterrupted focus timer | **+150 XP** | Level Progress Fill + Radial Wave |
| **Flashcard Deck Mastery** | Review 100% of due deck with >80% accuracy | **+75 XP** | Sparkle Particle Burst |
| **Daily Login & Session** | Log in and finish at least 1 focus session | **+30 XP** | Flame Streak Multiplier Increase |

### 2.2 Level Progression Formula

The total accumulated XP required to reach Level \( N \) follows an exponential curve to ensure early quick wins while maintaining late-game prestige:

\[
\text{Total XP}_{\text{Level } N} = \lfloor 500 \times N^{1.25} \rfloor
\]

#### Level Ranks & Badges:
- **Levels 1–4:** *Novice Scholar* (Bronze Shield)
- **Levels 5–9:** *Focus Apprentice* (Silver Shield)
- **Levels 10–14:** *Academic Architect* (Gold Shield)
- **Levels 15–19:** *Mind Master* (Emerald Crest)
- **Level 20+:** *Grand Luminary* (Diamond Aura)

---

## 3. Streak Mechanics & Anti-Gaming Rules

### 3.1 Streak Calculation & Reset
- **Daily Window:** Midnight (00:00) to Midnight (23:59) local time.
- **Streak Maintenance:** User must complete at least 1 Focus Session or 2 Quests per 24-hour cycle.
- **Streak Freeze item:** Users can purchase a "Streak Shield" using 500 XP to protect a 1-day missed login.

### 3.2 Anti-Gaming & Fraud Prevention Rules
1. **Pomodoro Cap:** Maximum **8 Focus Sessions (+1200 XP)** per 24-hour window eligible for XP reward. (Timer can still be used, but XP stops accruing to prevent idling).
2. **Minimum Focus Duration:** Timer must run continuously for at least 20 out of 25 minutes to trigger completion XP.
3. **Task Cooldown:** Rapid checking/unchecking of tasks throttled to 1 XP event per task ID per day.

---

## 4. Visual Particle Engine Integration (`canvas-confetti`)

When a high-value XP event occurs (Level-up or High-Priority Quest complete), the application invokes:

```typescript
confetti({
  particleCount: 60,
  spread: 70,
  origin: { y: 0.7 },
  colors: ['#4F46E5', '#0284C7', '#059669', '#F59E0B'],
  disableForReducedMotion: true
});
```
