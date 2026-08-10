'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Play, Pause, RotateCcw, Volume2, CheckCircle2, Circle, Sparkles, 
  Flame, Award, Brain, RefreshCw, Zap, TrendingUp, Sliders, MessageSquare 
} from 'lucide-react';
import { Task, Flashcard } from '../types';

export const InteractiveDashboardPreview: React.FC = () => {
  // --- XP & Gamification State ---
  const [xp, setXp] = useState(2450);
  const [level, setLevel] = useState(14);
  const [streak, setStreak] = useState(7);
  const [xpToast, setXpToast] = useState<string | null>(null);

  const triggerXpGain = (amount: number, reason: string) => {
    setXp((prev) => prev + amount);
    setXpToast(`+${amount} XP: ${reason}`);
    setTimeout(() => setXpToast(null), 3000);

    // Fire Confetti
    try {
      confetti({
        particleCount: 45,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#4F46E5', '#0284C7', '#059669'],
      });
    } catch {
      // fallback
    }
  };

  // --- Pomodoro & Soundscape State ---
  const [timerSeconds, setTimerSeconds] = useState(1500); // 25:00
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<'work' | 'short' | 'long'>('work');
  const [activeSound, setActiveSound] = useState<'rain' | 'cyber' | 'cafe' | 'none'>('cyber');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      triggerXpGain(150, 'Completed Focus Session! 🧠');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const toggleTimer = () => setIsTimerRunning(!isTimerRunning);

  const setMode = (mode: 'work' | 'short' | 'long') => {
    setTimerMode(mode);
    setIsTimerRunning(false);
    if (mode === 'work') setTimerSeconds(1500);
    if (mode === 'short') setTimerSeconds(300);
    if (mode === 'long') setTimerSeconds(900);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // --- Quest Matrix Tasks State ---
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Implement Neural Net Backprop', course: 'CS401 AI', dueDate: 'Today, 11:59 PM', priority: 'high', xp: 50, completed: false },
    { id: '2', title: 'Linear Algebra Eigenvalues HW', course: 'MATH302', dueDate: 'Tomorrow', priority: 'medium', xp: 35, completed: false },
    { id: '3', title: 'Read System Architecture Ch. 4', course: 'CS310', dueDate: 'Aug 12', priority: 'low', xp: 20, completed: true },
  ]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextState = !t.completed;
        if (nextState) {
          triggerXpGain(t.xp, `Completed ${t.title}`);
        }
        return { ...t, completed: nextState };
      }
      return t;
    }));
  };

  // --- Flashcard Deck State ---
  const flashcards: Flashcard[] = [
    {
      id: 'f1',
      question: 'What is the average time complexity of QuickSort?',
      answer: 'O(n log n). Partitioning divides the array around a pivot.',
      topic: 'Data Structures',
      difficulty: 'Medium',
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
      dueDate: new Date().toISOString(),
    },
    {
      id: 'f2',
      question: 'Explain the difference between L1 and L2 Regularization.',
      answer: 'L1 (Lasso) shrinks weights to 0. L2 (Ridge) penalizes squared magnitude of weights.',
      topic: 'Machine Learning',
      difficulty: 'Hard',
      easeFactor: 2.3,
      interval: 1,
      repetitions: 0,
      dueDate: new Date().toISOString(),
    },
    {
      id: 'f3',
      question: 'What is the CAP Theorem in Distributed Systems?',
      answer: 'A system can provide at most two of: Consistency, Availability, and Partition Tolerance.',
      topic: 'Systems',
      difficulty: 'Easy',
      easeFactor: 2.6,
      interval: 6,
      repetitions: 2,
      dueDate: new Date().toISOString(),
    },
  ];
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const currentCard = flashcards[cardIndex];

  const handleCardRate = (xpAmount: number) => {
    triggerXpGain(xpAmount, 'Flashcard Reviewed!');
    setIsFlipped(false);
    setTimeout(() => {
      setCardIndex((prev) => (prev + 1) % flashcards.length);
    }, 200);
  };

  // --- Grade Predictor State ---
  const [targetScore, setTargetScore] = useState(92);
  const currentGrade = 86;
  const examWeight = 30;
  const scoreNeeded = Math.min(100, Math.max(0, Math.round((targetScore - currentGrade * (1 - examWeight / 100)) / (examWeight / 100))));

  // --- AI Copilot Teaser State ---
  const [aiPrompt, setAiPrompt] = useState('Summarize Dijkstra Algorithm');
  const [aiResponse, setAiResponse] = useState("Dijkstra's Algorithm finds the shortest path from a starting node to all other nodes in a weighted graph using a min-priority queue. Time Complexity: O((V + E) log V).");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiQuery = (query: string) => {
    setAiPrompt(query);
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      if (query.includes('Dijkstra')) {
        setAiResponse("Dijkstra's Algorithm finds the shortest path from a starting node to all other nodes in a weighted graph using a min-priority queue. Time Complexity: O((V + E) log V).");
      } else if (query.includes('Quiz')) {
        setAiResponse("Quiz Generated! 1. What data structure is optimal for Dijkstra? (A) Stack (B) Min-Heap (C) Queue. Answer: B.");
      } else {
        setAiResponse("Focus Tip: Work in 25-min Pomodoro sprints with Lo-Fi Binaural beats to maximize memory consolidation.");
      }
    }, 400);
  };

  return (
    <section id="interactive-preview" className="py-12 px-6 max-w-7xl mx-auto z-10 relative">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-2 font-mono">
            <Zap className="w-4 h-4" />
            <span>LIVE PRODUCT SUITE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            The Productivity <span className="text-gradient-accent">Bento Workspace</span>
          </h2>
        </div>

        {/* Live User XP Profile Bar */}
        <div className="flex items-center gap-4 glass-card px-5 py-3 rounded-2xl border border-slate-200 shadow-sm bg-white/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-300 flex items-center justify-center font-extrabold text-xs text-indigo-700 font-mono">
              L14
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Scholar Rank</div>
              <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5 font-mono">
                <span>{xp} XP</span>
                <span className="text-[10px] text-emerald-600 font-bold font-sans">Level {level}</span>
              </div>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-slate-200" />

          <div className="flex items-center gap-1.5 text-amber-600 font-extrabold text-sm font-mono">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{streak}d Streak</span>
          </div>
        </div>
      </div>

      {/* XP Toast Notification */}
      {xpToast && (
        <div className="fixed top-20 right-6 z-50 animate-bounce glass-card px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-bold flex items-center gap-2 shadow-xl">
          <Award className="w-4 h-4 text-emerald-600" />
          <span className="font-mono">{xpToast}</span>
        </div>
      )}

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* ================= CARD 1: POMODORO & SOUNDSCAPE ================= */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200/90 flex flex-col justify-between relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
              <Zap className="w-4 h-4" />
              <span>Pomodoro Focus Lab</span>
            </div>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <button onClick={() => setMode('work')} className={`px-2.5 py-1 rounded-lg transition-all ${timerMode === 'work' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Focus</button>
              <button onClick={() => setMode('short')} className={`px-2.5 py-1 rounded-lg transition-all ${timerMode === 'short' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}>Break</button>
            </div>
          </div>

          {/* Timer Display Arc */}
          <div className="my-4 flex flex-col items-center justify-center relative">
            <div className="w-40 h-40 rounded-full border-4 border-indigo-100 flex items-center justify-center relative bg-indigo-50/50 shadow-inner">
              <div className="text-center">
                <span className="text-4xl font-extrabold tracking-tight text-slate-900 font-mono">
                  {formatTime(timerSeconds)}
                </span>
                <p className="text-[11px] text-indigo-600 font-extrabold mt-1 uppercase tracking-wider font-mono">
                  {isTimerRunning ? '⚡ DEEP FOCUS ACTIVE' : 'PAUSED'}
                </p>
              </div>
            </div>

            {/* Play / Reset Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button
                onClick={toggleTimer}
                className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                {isTimerRunning ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
              </button>
              <button
                onClick={() => { setIsTimerRunning(false); setTimerSeconds(1500); }}
                className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Lo-Fi Soundscape Engine */}
          <div className="mt-4 pt-4 border-t border-slate-200/80">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="text-slate-600 font-semibold flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Ambient Lo-Fi Audio</span>
              </span>
              {activeSound !== 'none' && (
                <div className="flex items-center gap-1">
                  <span className="w-1 h-3 bg-indigo-600 animate-pulse rounded-full" />
                  <span className="w-1 h-4 bg-sky-500 animate-pulse delay-75 rounded-full" />
                  <span className="w-1 h-2 bg-emerald-500 animate-pulse delay-150 rounded-full" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setActiveSound(activeSound === 'cyber' ? 'none' : 'cyber')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border ${activeSound === 'cyber' ? 'bg-indigo-100 border-indigo-300 text-indigo-800 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'}`}
              >
                🎧 Cyber Beats
              </button>
              <button
                onClick={() => setActiveSound(activeSound === 'rain' ? 'none' : 'rain')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border ${activeSound === 'rain' ? 'bg-sky-100 border-sky-300 text-sky-800 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'}`}
              >
                🌧️ Lo-Fi Rain
              </button>
              <button
                onClick={() => setActiveSound(activeSound === 'cafe' ? 'none' : 'cafe')}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition-all border ${activeSound === 'cafe' ? 'bg-amber-100 border-amber-300 text-amber-800 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'}`}
              >
                ☕ Cafe Chill
              </button>
            </div>
          </div>
        </div>

        {/* ================= CARD 2: QUEST MATRIX ================= */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Assignment Quest Matrix</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                {tasks.filter(t => t.completed).length}/{tasks.length} Done
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium mb-4">Complete assignments to gain XP points!</p>

            {/* Task List */}
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    task.completed 
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-400 line-through' 
                      : 'bg-white border-slate-200 hover:border-indigo-400 text-slate-900 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-indigo-500 shrink-0 hover:scale-110 transition-transform" />
                    )}
                    <div>
                      <div className="text-xs font-bold">{task.title}</div>
                      <div className="text-[10px] text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                        <span className="text-indigo-600 font-bold">{task.course}</span>
                        <span>• {task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md font-mono ${task.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-indigo-100 text-indigo-800'}`}>
                    +{task.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold">⚡ Streak Multiplier: 1.5x</span>
            <span className="text-emerald-700 font-bold font-mono">+105 XP Available</span>
          </div>
        </div>

        {/* ================= CARD 3: 3D FLASHCARD DECK ================= */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200/90 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
              <Brain className="w-4 h-4" />
              <span>Interactive Flashcards</span>
            </div>
            <span className="text-xs font-semibold text-slate-500 font-mono">Card {cardIndex + 1}/{flashcards.length}</span>
          </div>

          {/* 3D Flip Card Container */}
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className="perspective-1000 my-2 cursor-pointer h-48 w-full group"
          >
            <div className={`relative w-full h-full duration-500 transform-style-3d rounded-2xl p-5 border transition-all flex flex-col justify-between shadow-sm ${
              isFlipped 
                ? 'rotate-y-180 bg-gradient-to-br from-indigo-900 to-slate-900 border-indigo-700 text-white shadow-lg' 
                : 'bg-white border-slate-200 hover:border-emerald-500'
            }`}>
              
              {/* Front Side */}
              {!isFlipped ? (
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {currentCard.topic}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-3 leading-snug">
                      {currentCard.question}
                    </h4>
                  </div>
                  <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>Click to reveal answer</span>
                  </div>
                </div>
              ) : (
                /* Back Side */
                <div className="flex flex-col justify-between h-full rotate-y-180 text-white">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 font-mono">
                      SOLUTION
                    </span>
                    <p className="text-xs text-slate-200 mt-2 leading-relaxed font-medium">
                      {currentCard.answer}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCardRate(20); }}
                      className="flex-1 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] font-bold shadow-sm font-mono"
                    >
                      Got it (+20 XP)
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCardRate(5); }}
                      className="flex-1 py-1.5 rounded-lg bg-rose-500/30 hover:bg-rose-500/40 text-rose-200 text-[11px] font-bold border border-rose-400/40"
                    >
                      Review Again
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Card Category Nav */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-200/80">
            <span>Topic: <strong className="text-slate-900">{currentCard.topic}</strong></span>
            <span className="text-amber-600 font-bold">{currentCard.difficulty}</span>
          </div>
        </div>

        {/* ================= CARD 4: GRADE PREDICTOR ================= */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200/90 md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>Interactive Subject Grade Forecaster</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-mono">
              Data Structures CS201
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-2">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">Current Grade</div>
              <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">{currentGrade}%</div>
              <div className="text-[10px] text-slate-500 mt-0.5 font-medium">Based on 7 Assignments</div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">Target Final Grade</div>
              <div className="text-2xl font-extrabold text-indigo-600 mt-1 font-mono">{targetScore}%</div>
              <div className="text-[10px] text-indigo-700 font-bold mt-0.5">Desired Grade A</div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-sky-50 p-4 rounded-2xl border border-indigo-200 text-center shadow-sm">
              <div className="text-xs text-indigo-900 font-bold">Required Final Score</div>
              <div className="text-2xl font-extrabold text-emerald-600 mt-1 font-mono">{scoreNeeded}%</div>
              <div className="text-[10px] text-emerald-700 font-bold mt-0.5">Final Exam (30% Weight)</div>
            </div>
          </div>

          {/* Interactive Target Score Slider */}
          <div className="mt-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-slate-700 font-bold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                <span>Adjust Desired Target Grade:</span>
              </span>
              <span className="text-indigo-600 font-extrabold text-sm font-mono">{targetScore}%</span>
            </div>
            <input
              type="range"
              min="75"
              max="98"
              value={targetScore}
              onChange={(e) => setTargetScore(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>

        {/* ================= CARD 5: AI STUDY ASSISTANT DEMO ================= */}
        <div className="glass-card p-6 rounded-3xl border border-slate-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                <MessageSquare className="w-4 h-4" />
                <span>AI Study Copilot</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                GPT-4o Mini
              </span>
            </div>

            {/* Quick Query Pills */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              <button 
                onClick={() => handleAiQuery('Summarize Dijkstra Algorithm')}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-800 border border-slate-200 transition-colors"
              >
                💡 Dijkstra Graph
              </button>
              <button 
                onClick={() => handleAiQuery('Generate Quiz')}
                className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-800 border border-slate-200 transition-colors"
              >
                📝 Quick Quiz
              </button>
            </div>

            {/* Response Box */}
            <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-800 text-xs min-h-[100px] flex flex-col justify-between shadow-inner">
              {isAiLoading ? (
                <div className="flex items-center gap-2 text-sky-400 py-4 font-medium">
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synthesizing response...</span>
                </div>
              ) : (
                <p className="text-slate-200 leading-relaxed font-mono text-[11px]">
                  {aiResponse}
                </p>
              )}
              <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-800 pt-2 font-mono">
                <span>Query: {aiPrompt}</span>
                <span className="text-emerald-400 font-bold">0.18s</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
