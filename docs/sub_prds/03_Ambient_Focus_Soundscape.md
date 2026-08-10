# 🎧 Sub-PRD 03: Ambient Focus Engine & Soundscape Generator

**Module:** Focus & Audio Soundscape Engine  
**Version:** 1.0.0  
**Parent PRD:** Nexus Academia Master PRD  
**Owner:** UI/UX & Web Audio Engineering Team  

---

## 1. Overview & Objectives

The **Ambient Focus Engine & Soundscape Generator** provides an immersive, distraction-free environment for deep study work. It combines a customizable Pomodoro timer with an integrated Web Audio sound generator to eliminate the need for third-party music apps or tab-switching.

---

## 2. Timer State Machine & Specs

### 2.1 State Diagram
```
  ┌──────────┐      Start       ┌───────────┐
  │   IDLE   ├─────────────────►│  RUNNING  │
  └────▲─────┘                  └─────┬─────┘
       │                              │
       │ Reset                  Pause │ Resume
       │                              ▼
  ┌────┴─────┐                  ┌───────────┐
  │COMPLETED │◄─────────────────┤  PAUSED   │
  └──────────┘  Timer Secs == 0 └───────────┘
```

### 2.2 Presets
- **Focus Work Session:** 25 min (1500 sec)
- **Short Rest Break:** 5 min (300 sec)
- **Long Rest Break:** 15 min (900 sec)
- **Custom Mode:** User slider set between 5 min to 90 min.

---

## 3. Generative Ambient Audio Engine

### 3.1 Audio Tracks & Presets

1. **Cyber Lofi Beats:** Downtempo synthetic synth pads with soft vinyl crackle (\(432\text{ Hz}\) tuned ambient frequency).
2. **Rain & Thunder:** Stereo procedural pink noise mixed with low-frequency thunder rumbles.
3. **Cozy Coffee Shop:** Subtle ambient chatter, porcelain coffee cup clinking, and soft background rain.
4. **Binaural Delta/Alpha Waves:** Selective \(10\text{ Hz}\) Alpha wave binaural beat for enhanced concentration.

### 3.2 Web Audio API Implementation
- Crossfading volume transitions (200ms fade-in / fade-out) when toggling presets to prevent audio pop/clicking.
- Audio persistent loop buffer with smooth zero-crossing seam playback.
- Volume Master Control (\(0\%\) to \(100\%\)) with LocalStorage volume persistence.

---

## 4. UI Layout & Controls

- High-contrast digital clock readout (`MM:SS`) rendered in monospaced font (`font-mono`).
- Circular SVG progress ring indicating elapsed percentage.
- Quick mode switcher tabs (`Work`, `Short Break`, `Long Break`).
- Audio Preset Selector pills with active glowing border.
