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
