export interface Task {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  xp: number;
  completed: boolean;
  createdAt?: string;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  topic: string;
  codeSnippet?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  // SM-2 Spaced Repetition Parameters
  easeFactor: number; // default 2.5
  interval: number;   // days until next review
  repetitions: number;// number of consecutive successful reviews
  dueDate: string;    // ISO date string
  mastered?: boolean;
}

export interface CourseGrade {
  id: string;
  code: string;
  name: string;
  currentGrade: number;
  targetGrade: number;
  examWeight: number; // e.g. 30 for 30%
  color: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  mode?: 'eli5' | 'socratic' | 'formula' | 'general';
  codeSnippet?: string;
  timestamp: string;
}

export interface UserProfile {
  name: string;
  rankTitle: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  totalFocusMinutes: number;
  completedTasks: number;
  masteredCards: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  title: string;
  course: string;
  score: number;
  totalQuestions: number;
  date: string;
  xpEarned: number;
}

export interface StudySession {
  id: string;
  course: string;
  durationMinutes: number;
  date: string; // ISO date string (YYYY-MM-DD)
  type: 'pomodoro' | 'active_recall' | 'quiz';
}

export interface CourseWeight {
  category: string;
  weight: number;
  earnedPercentage: number;
}

export interface DetailedCourseGrade extends CourseGrade {
  credits?: number;
  weights?: CourseWeight[];
}

export interface NoteItem {
  id: string;
  title: string;
  course: string;
  rawText: string;
  summary: string;
  keyTakeaways: string[];
  tags: string[];
  createdAt: string;
  lastUpdated: string;
  generatedFlashcardsCount?: number;
  generatedQuizCount?: number;
}

