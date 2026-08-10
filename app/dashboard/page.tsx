'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Zap, Award, Flame, Brain, CheckCircle2, TrendingUp, MessageSquare, 
  Sparkles, Volume2, ArrowLeft, LayoutGrid, ListTodo, Layers, Calculator,
  BarChart3, BookOpen, HelpCircle
} from 'lucide-react';
import Link from 'next/link';

import { Task, Flashcard, CourseGrade, UserProfile, StudySession, QuizAttempt, NoteItem } from '../types';
import { 
  INITIAL_USER_PROFILE, INITIAL_TASKS, INITIAL_FLASHCARDS, INITIAL_COURSES, 
  INITIAL_SESSIONS, INITIAL_QUIZ_ATTEMPTS, INITIAL_NOTES,
  loadStorageItem, saveStorageItem 
} from '../lib/storage';

import { PomodoroSoundscape } from '../components/PomodoroSoundscape';
import { QuestMatrix } from '../components/QuestMatrix';
import { FlashcardEngine } from '../components/FlashcardEngine';
import { GradeForecaster } from '../components/GradeForecaster';
import { AiCopilotDrawer } from '../components/AiCopilotDrawer';
import { LevelProgressModal } from '../components/LevelProgressModal';
import { StudyAnalytics } from '../components/StudyAnalytics';
import { QuizEngineModal } from '../components/QuizEngineModal';
import { CourseManagerModal } from '../components/CourseManagerModal';
import { NotesWorkspace } from '../components/NotesWorkspace';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'bento' | 'quests' | 'cards' | 'notes' | 'forecaster' | 'analytics'>('bento');
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [xpToast, setXpToast] = useState<string | null>(null);

  // Persistent User Profile state
  const [user, setUser] = useState<UserProfile>(() =>
    loadStorageItem<UserProfile>('nexus_user_profile', INITIAL_USER_PROFILE)
  );

  // Persistent Tasks state
  const [tasks, setTasks] = useState<Task[]>(() =>
    loadStorageItem<Task[]>('nexus_tasks', INITIAL_TASKS)
  );

  // Persistent Flashcards state
  const [cards, setCards] = useState<Flashcard[]>(() =>
    loadStorageItem<Flashcard[]>('nexus_flashcards', INITIAL_FLASHCARDS)
  );

  // Persistent Courses state
  const [courses, setCourses] = useState<CourseGrade[]>(() =>
    loadStorageItem<CourseGrade[]>('nexus_courses', INITIAL_COURSES)
  );

  // Persistent Study Sessions state
  const [sessions, setSessions] = useState<StudySession[]>(() =>
    loadStorageItem<StudySession[]>('nexus_study_sessions', INITIAL_SESSIONS)
  );

  // Persistent Quiz Attempts state
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() =>
    loadStorageItem<QuizAttempt[]>('nexus_quiz_attempts', INITIAL_QUIZ_ATTEMPTS)
  );

  // Persistent Smart Notes state
  const [notes, setNotes] = useState<NoteItem[]>(() =>
    loadStorageItem<NoteItem[]>('nexus_smart_notes', INITIAL_NOTES)
  );

  // Save changes to LocalStorage
  useEffect(() => {
    saveStorageItem('nexus_user_profile', user);
  }, [user]);

  useEffect(() => {
    saveStorageItem('nexus_tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    saveStorageItem('nexus_flashcards', cards);
  }, [cards]);

  useEffect(() => {
    saveStorageItem('nexus_courses', courses);
  }, [courses]);

  useEffect(() => {
    saveStorageItem('nexus_study_sessions', sessions);
  }, [sessions]);

  useEffect(() => {
    saveStorageItem('nexus_quiz_attempts', quizAttempts);
  }, [quizAttempts]);

  useEffect(() => {
    saveStorageItem('nexus_smart_notes', notes);
  }, [notes]);

  // XP Trigger helper
  const triggerXpGain = (amount: number, reason: string) => {
    setUser((prev) => {
      const newXp = prev.xp + amount;
      const nextLevelXp = Math.floor(500 * Math.pow(prev.level + 1, 1.25));
      let newLevel = prev.level;
      let newRank = prev.rankTitle;

      if (newXp >= nextLevelXp) {
        newLevel += 1;
        if (newLevel >= 20) newRank = 'Grand Luminary';
        else if (newLevel >= 15) newRank = 'Mind Master';
        else if (newLevel >= 10) newRank = 'Academic Architect';
        else if (newLevel >= 5) newRank = 'Focus Apprentice';

        // Trigger major Level-Up confetti
        try {
          confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.6 },
            colors: ['#4F46E5', '#0284C7', '#059669', '#F59E0B'],
          });
        } catch {
          // fallback
        }
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        rankTitle: newRank,
      };
    });

    setXpToast(`+${amount} XP: ${reason}`);
    setTimeout(() => setXpToast(null), 3000);

    // Minor confetti
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#4F46E5', '#0284C7', '#059669'],
      });
    } catch {
      // fallback
    }
  };

  // Task Actions
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextState = !t.completed;
          if (nextState) {
            triggerXpGain(t.xp, `Completed Quest "${t.title}"`);
          }
          return { ...t, completed: nextState };
        }
        return t;
      })
    );
  };

  const handleAddTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...taskData,
      id: `t_${Date.now()}`,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    triggerXpGain(10, 'Created New Quest');
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  // Flashcard Actions
  const handleRateCard = (cardId: string, rating: 1 | 2 | 3 | 4, xpAmount: number) => {
    setCards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          // SM-2 Algorithm update
          const q = rating;
          let newEf = c.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
          newEf = Math.max(1.3, newEf);

          let newInterval = 1;
          let newReps = c.repetitions;

          if (q < 2) {
            newReps = 0;
            newInterval = 1;
          } else {
            newReps += 1;
            if (newReps === 1) newInterval = 1;
            else if (newReps === 2) newInterval = 6;
            else newInterval = Math.ceil(c.interval * newEf);
          }

          const mastered = newReps >= 2 || q === 4;

          return {
            ...c,
            easeFactor: newEf,
            interval: newInterval,
            repetitions: newReps,
            mastered,
          };
        }
        return c;
      })
    );

    triggerXpGain(xpAmount, 'Active Recall Review Completed');
  };

  const handleAddCards = (newCards: Flashcard[]) => {
    setCards((prev) => [...prev, ...newCards]);
    triggerXpGain(75, 'AI Active Recall Deck Generated');
  };

  // Course Actions
  const handleAddCourse = (newCourse: CourseGrade) => {
    setCourses((prev) => [...prev, newCourse]);
    triggerXpGain(25, `Added Course ${newCourse.code}`);
  };

  // Quiz Complete Action
  const handleQuizComplete = (attempt: QuizAttempt) => {
    setQuizAttempts((prev) => [attempt, ...prev]);
    triggerXpGain(attempt.xpEarned, `Completed Quiz "${attempt.title}"!`);
  };

  // Smart Notes Handlers
  const handleSaveNote = (savedNote: NoteItem) => {
    setNotes((prev) => {
      const exists = prev.some((n) => n.id === savedNote.id);
      if (exists) {
        return prev.map((n) => (n.id === savedNote.id ? savedNote : n));
      }
      return [savedNote, ...prev];
    });
    triggerXpGain(20, 'Saved Lecture Note 📝');
  };

  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleGenerateFlashcardsFromNote = (noteTitle: string, newCards: Flashcard[]) => {
    setCards((prev) => [...newCards, ...prev]);
    // update note card count
    setNotes((prev) =>
      prev.map((n) =>
        n.title === noteTitle
          ? { ...n, generatedFlashcardsCount: (n.generatedFlashcardsCount || 0) + newCards.length }
          : n
      )
    );
    triggerXpGain(75, `Generated ${newCards.length} Flashcards from Note! ⚡`);
  };

  const handleLaunchQuizFromNote = (quizData: { title: string; course: string; questions: any[] }) => {
    // Open quiz modal with generated quiz
    setIsQuizModalOpen(true);
    triggerXpGain(100, `Created Practice Quiz "${quizData.title}"! 🎯`);
  };


  return (
    <div className="min-h-screen bg-[#FAFAFC] text-slate-900 font-sans selection:bg-indigo-600 selection:text-white relative">
      
      {/* XP Toast Notification */}
      {xpToast && (
        <div className="fixed top-20 right-6 z-50 animate-bounce glass-card px-4 py-2.5 rounded-2xl border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-extrabold flex items-center gap-2 shadow-2xl">
          <Award className="w-4 h-4 text-emerald-600" />
          <span className="font-mono">{xpToast}</span>
        </div>
      )}

      {/* Top Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-slate-200/80 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo & Back Link */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-bold"
              title="Return to Landing Page"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Landing</span>
            </Link>

            <div className="h-5 w-[1px] bg-slate-200" />

            <div className="flex items-center gap-2 font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-500/20">
                N
              </div>
              <span>Nexus Workspace</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/90 text-xs font-bold">
            <button
              onClick={() => setActiveTab('bento')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'bento' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Bento Workspace</span>
            </button>

            <button
              onClick={() => setActiveTab('quests')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'quests' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>Quest Matrix</span>
            </button>

            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'cards' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>AI Flashcards</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'notes' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Smart Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('forecaster')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'forecaster' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Grade Forecaster</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Analytics & Flow</span>
            </button>
          </nav>

          {/* Quick Action Launchers & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Practice Quiz Launcher */}
            <button
              onClick={() => setIsQuizModalOpen(true)}
              className="px-3 py-1.5 rounded-xl font-bold text-xs bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors flex items-center gap-1.5"
              title="Launch Practice Quiz"
            >
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">AI Quiz</span>
            </button>

            {/* Course Manager Launcher */}
            <button
              onClick={() => setIsCourseModalOpen(true)}
              className="px-3 py-1.5 rounded-xl font-bold text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1.5"
              title="Manage Courses & Syllabus"
            >
              <BookOpen className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Courses</span>
            </button>

            {/* User Level Profile Badge */}
            <button
              onClick={() => setIsLevelModalOpen(true)}
              className="flex items-center gap-2.5 glass-card px-3 py-1.5 rounded-2xl border border-slate-200 shadow-2xs bg-white/90 hover:scale-102 transition-transform cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-300 flex items-center justify-center font-extrabold text-[11px] text-indigo-700 font-mono">
                L{user.level}
              </div>

              <div className="hidden sm:block text-left">
                <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wide">Scholar Rank</div>
                <div className="text-xs font-extrabold text-slate-900 font-mono flex items-center gap-1">
                  <span>{user.xp} XP</span>
                  <span className="text-[10px] text-emerald-600 font-bold font-sans">({user.rankTitle})</span>
                </div>
              </div>

              <div className="h-6 w-[1px] bg-slate-200 hidden sm:block" />

              <div className="flex items-center gap-1 text-amber-600 font-extrabold text-xs font-mono">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{user.streak}d</span>
              </div>
            </button>

            {/* AI Copilot Drawer Launcher Button */}
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="px-3.5 py-2 rounded-2xl font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white shadow-md flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        
        {/* Mobile Tab Switcher */}
        <div className="flex lg:hidden items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('bento')}
            className={`px-3 py-1.5 rounded-xl shrink-0 ${activeTab === 'bento' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
          >
            Workspace
          </button>
          <button
            onClick={() => setActiveTab('quests')}
            className={`px-3 py-1.5 rounded-xl shrink-0 ${activeTab === 'quests' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
          >
            Quests
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`px-3 py-1.5 rounded-xl shrink-0 ${activeTab === 'cards' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
          >
            Flashcards
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-xl shrink-0 ${activeTab === 'notes' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
          >
            Smart Notes
          </button>
          <button
            onClick={() => setActiveTab('forecaster')}
            className={`px-3 py-1.5 rounded-xl shrink-0 ${activeTab === 'forecaster' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
          >
            Forecaster
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-xl shrink-0 ${activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
          >
            Analytics
          </button>
        </div>

        {/* Tab 1: Bento Workspace Grid */}
        {activeTab === 'bento' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Stat Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="glass-card p-4 rounded-2xl border border-slate-200/90 text-center">
                <span className="text-xs text-slate-500 font-bold">Total Scholar XP</span>
                <div className="text-2xl font-extrabold text-indigo-600 font-mono mt-0.5">{user.xp} XP</div>
                <span className="text-[10px] text-emerald-600 font-extrabold">Level {user.level} Unlocked</span>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-slate-200/90 text-center">
                <span className="text-xs text-slate-500 font-bold">Active Login Streak</span>
                <div className="text-2xl font-extrabold text-amber-600 font-mono mt-0.5 flex items-center justify-center gap-1">
                  <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                  <span>{user.streak} Days</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">1.5x XP Multiplier</span>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-slate-200/90 text-center">
                <span className="text-xs text-slate-500 font-bold">Active Quests</span>
                <div className="text-2xl font-extrabold text-slate-900 font-mono mt-0.5">
                  {tasks.filter((t) => !t.completed).length} Pending
                </div>
                <span className="text-[10px] text-indigo-600 font-bold">
                  {tasks.filter((t) => t.completed).length} Completed
                </span>
              </div>

              <div className="glass-card p-4 rounded-2xl border border-slate-200/90 text-center">
                <span className="text-xs text-slate-500 font-bold">Flashcard Recall</span>
                <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-0.5">
                  {cards.filter((c) => c.mastered).length}/{cards.length}
                </div>
                <span className="text-[10px] text-emerald-700 font-bold">Mastered Decks</span>
              </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Pomodoro & Soundscape Engine */}
              <div className="lg:col-span-1">
                <PomodoroSoundscape
                  onSessionComplete={(xp) => triggerXpGain(xp, 'Completed Pomodoro Focus Session! 🧠')}
                />
              </div>

              {/* Assignment Quest Matrix */}
              <div className="lg:col-span-2">
                <QuestMatrix
                  tasks={tasks}
                  onToggleTask={handleToggleTask}
                  onAddTask={handleAddTask}
                  onDeleteTask={handleDeleteTask}
                />
              </div>

              {/* Flashcard Engine */}
              <div className="lg:col-span-1">
                <FlashcardEngine
                  cards={cards}
                  onRateCard={handleRateCard}
                  onAddCards={handleAddCards}
                />
              </div>

              {/* Grade Target Forecaster */}
              <div className="lg:col-span-2">
                <GradeForecaster courses={courses} onAddCourse={handleAddCourse} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Dedicated Quest Matrix */}
        {activeTab === 'quests' && (
          <div className="animate-in fade-in duration-300">
            <QuestMatrix
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        )}

        {/* Tab 3: Dedicated Flashcard Engine */}
        {activeTab === 'cards' && (
          <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
            <FlashcardEngine
              cards={cards}
              onRateCard={handleRateCard}
              onAddCards={handleAddCards}
            />
          </div>
        )}

        {/* Tab 4: AI Smart Notes & Lecture Workspace */}
        {activeTab === 'notes' && (
          <div className="animate-in fade-in duration-300">
            <NotesWorkspace
              notes={notes}
              courses={courses}
              onSaveNote={handleSaveNote}
              onDeleteNote={handleDeleteNote}
              onGenerateFlashcards={handleGenerateFlashcardsFromNote}
              onLaunchQuizFromNote={handleLaunchQuizFromNote}
              onOpenCopilot={(prompt) => {
                setIsCopilotOpen(true);
              }}
            />
          </div>
        )}

        {/* Tab 5: Dedicated Grade Forecaster */}
        {activeTab === 'forecaster' && (
          <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
            <GradeForecaster courses={courses} onAddCourse={handleAddCourse} />
          </div>
        )}

        {/* Tab 6: Analytics & Flow Tab */}
        {activeTab === 'analytics' && (
          <div className="animate-in fade-in duration-300">
            <StudyAnalytics
              user={user}
              tasks={tasks}
              cards={cards}
              courses={courses}
              sessions={sessions}
              quizAttempts={quizAttempts}
            />
          </div>
        )}

      </main>

      {/* AI Copilot Drawer */}
      <AiCopilotDrawer isOpen={isCopilotOpen} onClose={() => setIsCopilotOpen(false)} />

      {/* Level Progress Celebration Modal */}
      <LevelProgressModal
        user={user}
        isOpen={isLevelModalOpen}
        onClose={() => setIsLevelModalOpen(false)}
      />

      {/* Interactive AI Quiz Modal */}
      <QuizEngineModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        onQuizComplete={handleQuizComplete}
      />

      {/* Course & Syllabus Manager Modal */}
      <CourseManagerModal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        courses={courses}
        onAddCourse={handleAddCourse}
      />

    </div>
  );
}
