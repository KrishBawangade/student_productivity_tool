import { Task, Flashcard, CourseGrade, UserProfile, StudySession, QuizAttempt, NoteItem } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Student Scholar',
  rankTitle: 'Novice Scholar',
  level: 1,
  xp: 0,
  nextLevelXp: 1000,
  streak: 0,
  totalFocusMinutes: 0,
  completedTasks: 0,
  masteredCards: 0,
};

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_FLASHCARDS: Flashcard[] = [];

export const INITIAL_COURSES: CourseGrade[] = [];

export const INITIAL_SESSIONS: StudySession[] = [];

export const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [];

export const INITIAL_NOTES: NoteItem[] = [];

// Helper functions for localStorage persistence
export const loadStorageItem = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const saveStorageItem = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // quota exceeded or SSR
  }
};
