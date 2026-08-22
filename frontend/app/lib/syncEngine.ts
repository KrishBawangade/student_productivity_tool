import { Task, Flashcard, CourseGrade, UserProfile, StudySession, QuizAttempt, NoteItem } from '../types';
import { 
  loadStorageItem, saveStorageItem,
  INITIAL_USER_PROFILE, INITIAL_TASKS, INITIAL_FLASHCARDS, INITIAL_COURSES,
  INITIAL_SESSIONS, INITIAL_QUIZ_ATTEMPTS, INITIAL_NOTES
} from './storage';

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

type SyncListener = (status: SyncStatus, message?: string) => void;

class SyncEngine {
  private status: SyncStatus = 'synced';
  private listeners: Set<SyncListener> = new Set();

  public subscribe(listener: SyncListener) {
    this.listeners.add(listener);
    listener(this.status);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private setStatus(status: SyncStatus, message?: string) {
    this.status = status;
    this.listeners.forEach((l) => l(status, message));
  }

  public getStatus(): SyncStatus {
    return this.status;
  }

  /**
   * Initial data load: Tries server API first, falls back to LocalStorage
   */
  public async loadAllData() {
    this.setStatus('syncing', 'Connecting to Nexus Cloud...');

    try {
      const [userRes, tasksRes, cardsRes, coursesRes, notesRes] = await Promise.allSettled([
        fetch('/api/user').then((res) => res.json()),
        fetch('/api/tasks').then((res) => res.json()),
        fetch('/api/flashcards').then((res) => res.json()),
        fetch('/api/courses').then((res) => res.json()),
        fetch('/api/notes').then((res) => res.json()),
      ]);

      let user = loadStorageItem('nexus_user_profile', INITIAL_USER_PROFILE);
      let tasks = loadStorageItem('nexus_tasks', INITIAL_TASKS);
      let cards = loadStorageItem('nexus_flashcards', INITIAL_FLASHCARDS);
      let courses = loadStorageItem('nexus_courses', INITIAL_COURSES);
      let notes = loadStorageItem('nexus_notes', INITIAL_NOTES);

      if (userRes.status === 'fulfilled' && userRes.value.success) user = userRes.value.user;
      if (tasksRes.status === 'fulfilled' && tasksRes.value.success) tasks = tasksRes.value.tasks;
      if (cardsRes.status === 'fulfilled' && cardsRes.value.success) cards = cardsRes.value.flashcards;
      if (coursesRes.status === 'fulfilled' && coursesRes.value.success) courses = coursesRes.value.courses;
      if (notesRes.status === 'fulfilled' && notesRes.value.success) notes = notesRes.value.notes;

      // Update LocalStorage cache
      saveStorageItem('nexus_user_profile', user);
      saveStorageItem('nexus_tasks', tasks);
      saveStorageItem('nexus_flashcards', cards);
      saveStorageItem('nexus_courses', courses);
      saveStorageItem('nexus_notes', notes);

      this.setStatus('synced', 'Synced to Cloud');

      return { user, tasks, cards, courses, notes };
    } catch {
      this.setStatus('offline', 'Offline Mode (Saved Locally)');
      return {
        user: loadStorageItem('nexus_user_profile', INITIAL_USER_PROFILE),
        tasks: loadStorageItem('nexus_tasks', INITIAL_TASKS),
        cards: loadStorageItem('nexus_flashcards', INITIAL_FLASHCARDS),
        courses: loadStorageItem('nexus_courses', INITIAL_COURSES),
        notes: loadStorageItem('nexus_notes', INITIAL_NOTES),
      };
    }
  }

  public async syncUser(user: UserProfile) {
    saveStorageItem('nexus_user_profile', user);
    try {
      await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      this.setStatus('synced', 'Synced to Cloud');
    } catch {
      this.setStatus('offline', 'Saved Locally');
    }
  }

  public async syncTask(task: Task) {
    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      this.setStatus('synced', 'Synced to Cloud');
    } catch {
      this.setStatus('offline', 'Saved Locally');
    }
  }

  public async createTask(task: Task) {
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      this.setStatus('synced', 'Synced to Cloud');
    } catch {
      this.setStatus('offline', 'Saved Locally');
    }
  }

  public async deleteTask(id: string) {
    try {
      await fetch(`/api/tasks?id=${id}`, { method: 'DELETE' });
      this.setStatus('synced', 'Synced to Cloud');
    } catch {
      this.setStatus('offline', 'Saved Locally');
    }
  }

  public async syncFlashcard(card: Flashcard) {
    try {
      await fetch('/api/flashcards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(card),
      });
      this.setStatus('synced', 'Synced to Cloud');
    } catch {
      this.setStatus('offline', 'Saved Locally');
    }
  }

  public async createFlashcards(cards: Flashcard[]) {
    try {
      await Promise.all(
        cards.map((c) =>
          fetch('/api/flashcards', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(c),
          })
        )
      );
      this.setStatus('synced', 'Synced to Cloud');
    } catch {
      this.setStatus('offline', 'Saved Locally');
    }
  }

  public async syncCourse(course: CourseGrade) {
    try {
      await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(course),
      });
      this.setStatus('synced', 'Synced to Cloud');
    } catch {
      this.setStatus('offline', 'Saved Locally');
    }
  }

  public async syncNote(note: NoteItem) {
    try {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note),
      });
      this.setStatus('synced', 'Synced to Cloud');
    } catch {
      this.setStatus('offline', 'Saved Locally');
    }
  }

  public async deleteNote(id: string) {
    try {
      await fetch(`/api/notes?id=${id}`, { method: 'DELETE' });
      this.setStatus('synced', 'Synced to Cloud');
    } catch {
      this.setStatus('offline', 'Saved Locally');
    }
  }

  public async recordAnalytics(type: 'session' | 'quiz', data: any) {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data }),
      });
      this.setStatus('synced', 'Synced to Cloud');
    } catch {
      this.setStatus('offline', 'Saved Locally');
    }
  }
}

export const syncEngine = new SyncEngine();
