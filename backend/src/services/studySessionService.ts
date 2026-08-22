import { StudySessionRepository } from '../repositories/studySessionRepository.js';
import { UserRepository, DEFAULT_DEMO_USER_ID } from '../repositories/userRepository.js';
import { UserService } from './userService.js';
import { StudySession, UserProfile } from '../types/index.js';

export interface LogSessionResult {
  session: StudySession;
  xpEarned: number;
  user: UserProfile;
}

export interface FocusAnalytics {
  totalFocusMinutes: number;
  totalSessions: number;
  averageSessionDurationMinutes: number;
  typeBreakdown: {
    pomodoro: number;
    active_recall: number;
    quiz: number;
  };
  courseBreakdown: Array<{
    course: string;
    totalMinutes: number;
    sessionCount: number;
  }>;
}

export class StudySessionService {
  private repository: StudySessionRepository;
  private userRepository: UserRepository;
  private userService: UserService;

  constructor() {
    this.repository = new StudySessionRepository();
    this.userRepository = new UserRepository();
    this.userService = new UserService();
  }

  /**
   * Fetch study sessions with optional course and type filters.
   */
  public async getSessions(
    userId?: string,
    course?: string,
    type?: string
  ): Promise<StudySession[]> {
    return await this.repository.findAll(userId, course, type);
  }

  /**
   * Log a new study session, award focus XP, and increment user total focus minutes.
   */
  public async logSession(data: {
    userId?: string;
    course: string;
    durationMinutes: number;
    date?: string;
    type: 'pomodoro' | 'active_recall' | 'quiz';
  }): Promise<LogSessionResult> {
    if (!data.course || data.course.trim().length === 0) {
      throw new Error('Course title is required');
    }
    if (!data.durationMinutes || typeof data.durationMinutes !== 'number' || data.durationMinutes <= 0) {
      throw new Error('Duration minutes must be a positive number');
    }
    if (!data.type || !['pomodoro', 'active_recall', 'quiz'].includes(data.type)) {
      throw new Error('Valid session type is required ("pomodoro", "active_recall", or "quiz")');
    }

    const userId = data.userId || DEFAULT_DEMO_USER_ID;

    // 1. Record session entry
    const session = await this.repository.create({
      userId,
      course: data.course.trim(),
      durationMinutes: data.durationMinutes,
      date: data.date,
      type: data.type,
    });

    // 2. Calculate XP (1.5 XP per focus minute)
    const xpEarned = Math.round(data.durationMinutes * 1.5);

    // 3. Update user cumulative focus minutes and award XP
    const user = await this.userRepository.findUserById(userId);
    const updatedMinutes = user.totalFocusMinutes + data.durationMinutes;

    await this.userRepository.updateUser(userId, {
      totalFocusMinutes: updatedMinutes,
    });

    const xpResult = await this.userService.addXp(userId, xpEarned);

    return {
      session,
      xpEarned,
      user: xpResult.user,
    };
  }

  /**
   * Compute comprehensive focus analytics across courses and session types.
   */
  public async getFocusAnalytics(userId?: string): Promise<FocusAnalytics> {
    const sessions = await this.repository.findAll(userId);

    let totalFocusMinutes = 0;
    const typeBreakdown = {
      pomodoro: 0,
      active_recall: 0,
      quiz: 0,
    };

    const courseMap: Record<string, { totalMinutes: number; sessionCount: number }> = {};

    sessions.forEach((s) => {
      totalFocusMinutes += s.durationMinutes;

      if (s.type in typeBreakdown) {
        typeBreakdown[s.type as keyof typeof typeBreakdown] += s.durationMinutes;
      }

      if (!courseMap[s.course]) {
        courseMap[s.course] = { totalMinutes: 0, sessionCount: 0 };
      }
      courseMap[s.course].totalMinutes += s.durationMinutes;
      courseMap[s.course].sessionCount += 1;
    });

    const totalSessions = sessions.length;
    const averageSessionDurationMinutes =
      totalSessions > 0 ? Math.round(totalFocusMinutes / totalSessions) : 0;

    const courseBreakdown = Object.keys(courseMap).map((course) => ({
      course,
      totalMinutes: courseMap[course].totalMinutes,
      sessionCount: courseMap[course].sessionCount,
    }));

    return {
      totalFocusMinutes,
      totalSessions,
      averageSessionDurationMinutes,
      typeBreakdown,
      courseBreakdown,
    };
  }

  /**
   * Delete session by ID.
   */
  public async deleteSession(id: string): Promise<boolean> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      throw new Error('Study session not found');
    }
    return await this.repository.delete(id);
  }
}
