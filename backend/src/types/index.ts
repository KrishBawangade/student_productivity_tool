export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  rankTitle: string;
  level: number;
  xp: number;
  nextLevelXp: number;
  streak: number;
  streakShields: number;
  totalFocusMinutes: number;
  completedTasks: number;
  masteredCards: number;
}

export interface Task {
  id: string;
  userId?: string;
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
  userId?: string;
  question: string;
  answer: string;
  topic: string;
  codeSnippet?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  easeFactor?: number;
  interval?: number;
  repetitions?: number;
  dueDate?: string;
  mastered: boolean;
  createdAt?: string;
}

export interface CourseGrade {
  id: string;
  userId?: string;
  code: string;
  name: string;
  currentGrade: number;
  targetGrade: number;
  examWeight: number;
  color: string;
  createdAt?: string;
}

export interface StudySession {
  id: string;
  userId?: string;
  course: string;
  durationMinutes: number;
  date: string;
  type: 'pomodoro' | 'active_recall' | 'quiz';
  createdAt?: string;
}

export interface QuizAttempt {
  id: string;
  userId?: string;
  title: string;
  course: string;
  score: number;
  totalQuestions: number;
  date: string;
  xpEarned: number;
  createdAt?: string;
}

export interface NoteItem {
  id: string;
  userId?: string;
  title: string;
  course: string;
  rawText: string;
  summary: string;
  keyTakeaways: string[];
  tags: string[];
  generatedFlashcardsCount: number;
  generatedQuizCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
