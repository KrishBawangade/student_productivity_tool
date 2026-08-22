import { Task, Flashcard, CourseGrade, UserProfile, StudySession, QuizAttempt, NoteItem } from '../types';
import { 
  INITIAL_USER_PROFILE, INITIAL_TASKS, INITIAL_FLASHCARDS, INITIAL_COURSES, 
  INITIAL_SESSIONS, INITIAL_QUIZ_ATTEMPTS, INITIAL_NOTES 
} from './storage';

// In-Memory & Server Database Store singleton for Next.js App Router
class DatabaseStore {
  private static instance: DatabaseStore;
  
  public userProfile: UserProfile;
  public tasks: Task[];
  public flashcards: Flashcard[];
  public courses: CourseGrade[];
  public sessions: StudySession[];
  public quizAttempts: QuizAttempt[];
  public notes: NoteItem[];

  private constructor() {
    this.userProfile = { ...INITIAL_USER_PROFILE };
    this.tasks = [...INITIAL_TASKS];
    this.flashcards = [...INITIAL_FLASHCARDS];
    this.courses = [...INITIAL_COURSES];
    this.sessions = [...INITIAL_SESSIONS];
    this.quizAttempts = [...INITIAL_QUIZ_ATTEMPTS];
    this.notes = [...INITIAL_NOTES];
  }

  public static getInstance(): DatabaseStore {
    if (!DatabaseStore.instance) {
      DatabaseStore.instance = new DatabaseStore();
    }
    return DatabaseStore.instance;
  }
}

export const dbStore = DatabaseStore.getInstance();

export const isNeonDatabaseConfigured = (): boolean => {
  const url = process.env.DATABASE_URL || '';
  return url.length > 0 && (url.includes('neon.tech') || url.includes('postgres'));
};

// Database Helper functions
export async function getDbUser(): Promise<UserProfile> {
  return dbStore.userProfile;
}

export async function updateDbUser(partial: Partial<UserProfile>): Promise<UserProfile> {
  dbStore.userProfile = { ...dbStore.userProfile, ...partial };
  return dbStore.userProfile;
}

export async function getDbTasks(): Promise<Task[]> {
  return dbStore.tasks;
}

export async function createDbTask(task: Omit<Task, 'id'> & { id?: string }): Promise<Task> {
  const newTask: Task = {
    ...task,
    id: task.id || `task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    createdAt: task.createdAt || new Date().toISOString(),
  };
  dbStore.tasks.unshift(newTask);
  return newTask;
}

export async function updateDbTask(id: string, partial: Partial<Task>): Promise<Task | null> {
  const index = dbStore.tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;
  dbStore.tasks[index] = { ...dbStore.tasks[index], ...partial };
  return dbStore.tasks[index];
}

export async function deleteDbTask(id: string): Promise<boolean> {
  const initialLen = dbStore.tasks.length;
  dbStore.tasks = dbStore.tasks.filter((t) => t.id !== id);
  return dbStore.tasks.length < initialLen;
}

export async function getDbFlashcards(): Promise<Flashcard[]> {
  return dbStore.flashcards;
}

export async function createDbFlashcard(card: Omit<Flashcard, 'id'> & { id?: string }): Promise<Flashcard> {
  const newCard: Flashcard = {
    ...card,
    id: card.id || `card_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
  };
  dbStore.flashcards.unshift(newCard);
  return newCard;
}

export async function updateDbFlashcard(id: string, partial: Partial<Flashcard>): Promise<Flashcard | null> {
  const index = dbStore.flashcards.findIndex((f) => f.id === id);
  if (index === -1) return null;
  dbStore.flashcards[index] = { ...dbStore.flashcards[index], ...partial };
  return dbStore.flashcards[index];
}

export async function deleteDbFlashcard(id: string): Promise<boolean> {
  const initialLen = dbStore.flashcards.length;
  dbStore.flashcards = dbStore.flashcards.filter((f) => f.id !== id);
  return dbStore.flashcards.length < initialLen;
}

export async function getDbCourses(): Promise<CourseGrade[]> {
  return dbStore.courses;
}

export async function createDbCourse(course: Omit<CourseGrade, 'id'> & { id?: string }): Promise<CourseGrade> {
  const newCourse: CourseGrade = {
    ...course,
    id: course.id || `crs_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
  };
  dbStore.courses.push(newCourse);
  return newCourse;
}

export async function updateDbCourse(id: string, partial: Partial<CourseGrade>): Promise<CourseGrade | null> {
  const index = dbStore.courses.findIndex((c) => c.id === id);
  if (index === -1) return null;
  dbStore.courses[index] = { ...dbStore.courses[index], ...partial };
  return dbStore.courses[index];
}

export async function deleteDbCourse(id: string): Promise<boolean> {
  const initialLen = dbStore.courses.length;
  dbStore.courses = dbStore.courses.filter((c) => c.id !== id);
  return dbStore.courses.length < initialLen;
}

export async function getDbNotes(): Promise<NoteItem[]> {
  return dbStore.notes;
}

export async function upsertDbNote(note: NoteItem): Promise<NoteItem> {
  const index = dbStore.notes.findIndex((n) => n.id === note.id);
  if (index >= 0) {
    dbStore.notes[index] = { ...note, lastUpdated: new Date().toISOString() };
    return dbStore.notes[index];
  }
  const newNote = { ...note, createdAt: note.createdAt || new Date().toISOString(), lastUpdated: new Date().toISOString() };
  dbStore.notes.unshift(newNote);
  return newNote;
}

export async function deleteDbNote(id: string): Promise<boolean> {
  const initialLen = dbStore.notes.length;
  dbStore.notes = dbStore.notes.filter((n) => n.id !== id);
  return dbStore.notes.length < initialLen;
}

export async function getDbAnalytics() {
  return {
    sessions: dbStore.sessions,
    quizAttempts: dbStore.quizAttempts,
  };
}

export async function recordDbSession(session: Omit<StudySession, 'id'>): Promise<StudySession> {
  const newSession: StudySession = {
    ...session,
    id: `sess_${Date.now()}`,
  };
  dbStore.sessions.unshift(newSession);
  return newSession;
}

export async function recordDbQuizAttempt(attempt: Omit<QuizAttempt, 'id'>): Promise<QuizAttempt> {
  const newAttempt: QuizAttempt = {
    ...attempt,
    id: `qz_att_${Date.now()}`,
  };
  dbStore.quizAttempts.unshift(newAttempt);
  return newAttempt;
}
