import { getPrismaClient } from '../config/db.js';
import { StudySession } from '../types/index.js';
import { DEFAULT_DEMO_USER_ID } from './userRepository.js';

// Fallback in-memory study sessions store
const mockSessionsStore: StudySession[] = [
  {
    id: 'ss-1',
    userId: DEFAULT_DEMO_USER_ID,
    course: 'CS401 AI',
    durationMinutes: 45,
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
    type: 'pomodoro',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'ss-2',
    userId: DEFAULT_DEMO_USER_ID,
    course: 'COGS201',
    durationMinutes: 30,
    date: new Date().toISOString().split('T')[0], // Today
    type: 'active_recall',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ss-3',
    userId: DEFAULT_DEMO_USER_ID,
    course: 'MATH302',
    durationMinutes: 60,
    date: new Date().toISOString().split('T')[0], // Today
    type: 'pomodoro',
    createdAt: new Date().toISOString(),
  },
];

export class StudySessionRepository {
  /**
   * Find study sessions with optional course and type filters.
   */
  public async findAll(
    userId?: string,
    courseFilter?: string,
    typeFilter?: string
  ): Promise<StudySession[]> {
    const targetUserId = userId || DEFAULT_DEMO_USER_ID;
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        const whereClause: any = { userId: targetUserId };
        if (courseFilter) whereClause.course = courseFilter;
        if (typeFilter) whereClause.type = typeFilter;

        const dbSessions = await prisma.studySession.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
        });

        return dbSessions.map((s) => ({
          id: s.id,
          userId: s.userId,
          course: s.course,
          durationMinutes: s.durationMinutes,
          date: s.date,
          type: s.type as 'pomodoro' | 'active_recall' | 'quiz',
          createdAt: s.createdAt.toISOString(),
        }));
      } catch (error) {
        console.warn('⚠️ [StudySessionRepository] DB query failed, using mock store:', error);
      }
    }

    let filtered = mockSessionsStore.filter((s) => s.userId === targetUserId);
    if (courseFilter) {
      filtered = filtered.filter((s) => s.course.toLowerCase() === courseFilter.toLowerCase());
    }
    if (typeFilter) {
      filtered = filtered.filter((s) => s.type.toLowerCase() === typeFilter.toLowerCase());
    }
    return [...filtered];
  }

  /**
   * Find a session by ID.
   */
  public async findById(id: string): Promise<StudySession | null> {
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        const s = await prisma.studySession.findUnique({ where: { id } });
        if (s) {
          return {
            id: s.id,
            userId: s.userId,
            course: s.course,
            durationMinutes: s.durationMinutes,
            date: s.date,
            type: s.type as 'pomodoro' | 'active_recall' | 'quiz',
            createdAt: s.createdAt.toISOString(),
          };
        }
      } catch (error) {
        console.warn('⚠️ [StudySessionRepository] DB findById failed:', error);
      }
    }

    return mockSessionsStore.find((s) => s.id === id) || null;
  }

  /**
   * Create a new study session record.
   */
  public async create(data: {
    userId?: string;
    course: string;
    durationMinutes: number;
    date?: string;
    type: 'pomodoro' | 'active_recall' | 'quiz';
  }): Promise<StudySession> {
    const targetUserId = data.userId || DEFAULT_DEMO_USER_ID;
    const sessionDate = data.date || new Date().toISOString().split('T')[0];
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        const created = await prisma.studySession.create({
          data: {
            userId: targetUserId,
            course: data.course,
            durationMinutes: data.durationMinutes,
            date: sessionDate,
            type: data.type,
          },
        });

        return {
          id: created.id,
          userId: created.userId,
          course: created.course,
          durationMinutes: created.durationMinutes,
          date: created.date,
          type: created.type as 'pomodoro' | 'active_recall' | 'quiz',
          createdAt: created.createdAt.toISOString(),
        };
      } catch (error) {
        console.warn('⚠️ [StudySessionRepository] DB create failed, using mock store:', error);
      }
    }

    const newSession: StudySession = {
      id: `ss-${Date.now()}`,
      userId: targetUserId,
      course: data.course,
      durationMinutes: data.durationMinutes,
      date: sessionDate,
      type: data.type,
      createdAt: new Date().toISOString(),
    };

    mockSessionsStore.unshift(newSession);
    return newSession;
  }

  /**
   * Delete a study session.
   */
  public async delete(id: string): Promise<boolean> {
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        await prisma.studySession.delete({ where: { id } });
        return true;
      } catch (error) {
        console.warn('⚠️ [StudySessionRepository] DB delete failed:', error);
      }
    }

    const index = mockSessionsStore.findIndex((s) => s.id === id);
    if (index !== -1) {
      mockSessionsStore.splice(index, 1);
      return true;
    }
    return false;
  }
}
