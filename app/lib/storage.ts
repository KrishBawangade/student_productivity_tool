import { Task, Flashcard, CourseGrade, UserProfile, StudySession, QuizAttempt } from '../types';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alex Vance',
  rankTitle: 'Academic Architect',
  level: 14,
  xp: 2450,
  nextLevelXp: 3500,
  streak: 7,
  totalFocusMinutes: 420,
  completedTasks: 18,
  masteredCards: 34,
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    title: 'Implement Neural Net Backpropagation',
    course: 'CS401 AI',
    dueDate: 'Today, 11:59 PM',
    priority: 'high',
    xp: 50,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 't2',
    title: 'Linear Algebra Eigenvalues & Eigenvectors HW',
    course: 'MATH302',
    dueDate: 'Tomorrow',
    priority: 'medium',
    xp: 35,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 't3',
    title: 'Read System Architecture Chapter 4',
    course: 'CS310',
    dueDate: 'Aug 12',
    priority: 'low',
    xp: 20,
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 't4',
    title: 'Prepare Physics Lab Oscilloscope Report',
    course: 'PHYS201',
    dueDate: 'Aug 14',
    priority: 'high',
    xp: 50,
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 't5',
    title: 'Review Operating Systems Semaphore Mutex Notes',
    course: 'CS305 OS',
    dueDate: 'Aug 15',
    priority: 'medium',
    xp: 35,
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'f1',
    question: 'What is the average time complexity of QuickSort algorithm?',
    answer: 'O(n log n). Partitioning recursively divides the array around a pivot.',
    topic: 'Data Structures',
    codeSnippet: `function quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[arr.length - 1];\n  const left = arr.filter(x => x < pivot);\n  const right = arr.filter(x => x > pivot);\n  return [...quickSort(left), pivot, ...quickSort(right)];\n}`,
    difficulty: 'Medium',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    mastered: false,
  },
  {
    id: 'f2',
    question: 'Explain the difference between L1 and L2 Regularization in ML.',
    answer: 'L1 (Lasso) adds absolute values of weights to loss, shrinking weights to 0 (feature selection). L2 (Ridge) adds squared weights, penalizing large magnitudes.',
    topic: 'Machine Learning',
    difficulty: 'Hard',
    easeFactor: 2.3,
    interval: 1,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    mastered: false,
  },
  {
    id: 'f3',
    question: 'What is the CAP Theorem in Distributed Systems?',
    answer: 'A distributed data store can simultaneously provide at most TWO out of three guarantees: Consistency, Availability, and Partition Tolerance.',
    topic: 'Systems Architecture',
    difficulty: 'Easy',
    easeFactor: 2.6,
    interval: 6,
    repetitions: 2,
    dueDate: new Date().toISOString(),
    mastered: true,
  },
  {
    id: 'f4',
    question: 'What is the mathematical formulation of Bayes Theorem?',
    answer: 'P(A|B) = [P(B|A) * P(A)] / P(B). Calculates posterior probability based on prior knowledge of conditions.',
    topic: 'Probability & Stats',
    difficulty: 'Medium',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    mastered: false,
  },
];

export const INITIAL_COURSES: CourseGrade[] = [
  {
    id: 'c1',
    code: 'CS401',
    name: 'Artificial Intelligence',
    currentGrade: 88,
    targetGrade: 92,
    examWeight: 30,
    color: '#4F46E5',
  },
  {
    id: 'c2',
    code: 'MATH302',
    name: 'Linear Algebra II',
    currentGrade: 84,
    targetGrade: 90,
    examWeight: 35,
    color: '#0284C7',
  },
  {
    id: 'c3',
    code: 'CS310',
    name: 'Data Structures & Algorithms',
    currentGrade: 91,
    targetGrade: 95,
    examWeight: 25,
    color: '#059669',
  },
  {
    id: 'c4',
    code: 'PHYS201',
    name: 'General Physics & Electromagnetism',
    currentGrade: 79,
    targetGrade: 85,
    examWeight: 40,
    color: '#D97706',
  },
];

export const INITIAL_SESSIONS: StudySession[] = [
  { id: 's1', course: 'CS401', durationMinutes: 50, date: '2026-08-04', type: 'pomodoro' },
  { id: 's2', course: 'MATH302', durationMinutes: 25, date: '2026-08-05', type: 'active_recall' },
  { id: 's3', course: 'CS310', durationMinutes: 75, date: '2026-08-06', type: 'pomodoro' },
  { id: 's4', course: 'PHYS201', durationMinutes: 40, date: '2026-08-07', type: 'quiz' },
  { id: 's5', course: 'CS401', durationMinutes: 60, date: '2026-08-08', type: 'pomodoro' },
  { id: 's6', course: 'MATH302', durationMinutes: 45, date: '2026-08-09', type: 'active_recall' },
  { id: 's7', course: 'CS310', durationMinutes: 90, date: '2026-08-10', type: 'pomodoro' },
];

export const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'q1',
    title: 'Backpropagation & Neural Net Fundamentals',
    course: 'CS401',
    score: 4,
    totalQuestions: 5,
    date: '2026-08-09',
    xpEarned: 120,
  },
  {
    id: 'q2',
    title: 'Eigenvalues & Diagonalization',
    course: 'MATH302',
    score: 5,
    totalQuestions: 5,
    date: '2026-08-08',
    xpEarned: 150,
  },
];


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
