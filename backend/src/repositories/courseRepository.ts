import { getPrismaClient } from '../config/db.js';
import { CourseGrade } from '../types/index.js';

export const DEFAULT_DEMO_USER_ID = 'user-demo-1';

// Initial in-memory fallback store for courses
const mockCoursesStore: CourseGrade[] = [
  {
    id: 'c-1',
    userId: DEFAULT_DEMO_USER_ID,
    code: 'CS401',
    name: 'Artificial Intelligence & Neural Networks',
    currentGrade: 88.5,
    targetGrade: 92.0,
    examWeight: 35.0,
    color: '#6366F1',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c-2',
    userId: DEFAULT_DEMO_USER_ID,
    code: 'COGS201',
    name: 'Cognitive Psychology & Learning Science',
    currentGrade: 91.0,
    targetGrade: 95.0,
    examWeight: 30.0,
    color: '#10B981',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'c-3',
    userId: DEFAULT_DEMO_USER_ID,
    code: 'MATH302',
    name: 'Linear Algebra & Optimization',
    currentGrade: 79.0,
    targetGrade: 85.0,
    examWeight: 40.0,
    color: '#F59E0B',
    createdAt: new Date().toISOString(),
  },
];

export class CourseRepository {
  /**
   * Fetch user courses from Prisma PostgreSQL DB or fallback store
   */
  public async findAll(userId?: string): Promise<CourseGrade[]> {
    const targetUserId = userId || DEFAULT_DEMO_USER_ID;
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        const dbCourses = await prisma.courseGrade.findMany({
          where: { userId: targetUserId },
          orderBy: { createdAt: 'desc' },
        });

        return dbCourses.map((c) => ({
          id: c.id,
          userId: c.userId,
          code: c.code,
          name: c.name,
          currentGrade: c.currentGrade,
          targetGrade: c.targetGrade,
          examWeight: c.examWeight,
          color: c.color,
          createdAt: c.createdAt.toISOString(),
        }));
      } catch (error) {
        console.warn('⚠️ Postgres Course query failed, using mock store fallback:', (error as Error).message);
      }
    }

    return mockCoursesStore.filter((c) => !c.userId || c.userId === targetUserId);
  }

  /**
   * Find a single course by ID
   */
  public async findById(id: string): Promise<CourseGrade | null> {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        const dbCourse = await prisma.courseGrade.findUnique({ where: { id } });
        if (dbCourse) {
          return {
            id: dbCourse.id,
            userId: dbCourse.userId,
            code: dbCourse.code,
            name: dbCourse.name,
            currentGrade: dbCourse.currentGrade,
            targetGrade: dbCourse.targetGrade,
            examWeight: dbCourse.examWeight,
            color: dbCourse.color,
            createdAt: dbCourse.createdAt.toISOString(),
          };
        }
      } catch (error) {
        console.warn('⚠️ Postgres findById failed for course, falling back to mock store');
      }
    }

    return mockCoursesStore.find((c) => c.id === id) || null;
  }

  /**
   * Create a new Course Grade Target entry
   */
  public async create(
    courseData: Omit<CourseGrade, 'id'> & { id?: string; userId?: string }
  ): Promise<CourseGrade> {
    const targetUserId = courseData.userId || DEFAULT_DEMO_USER_ID;
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        // Ensure user exists in Postgres
        let user = await prisma.user.findUnique({ where: { id: targetUserId } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              id: targetUserId,
              email: `${targetUserId}@nexusacademia.edu`,
              name: 'Scholar Student',
              rankTitle: 'Academic Architect',
              level: 14,
              xp: 2450,
            },
          });
        }

        const created = await prisma.courseGrade.create({
          data: {
            userId: user.id,
            code: courseData.code,
            name: courseData.name,
            currentGrade: courseData.currentGrade ?? 85.0,
            targetGrade: courseData.targetGrade ?? 90.0,
            examWeight: courseData.examWeight ?? 30.0,
            color: courseData.color || '#4F46E5',
          },
        });

        return {
          id: created.id,
          userId: created.userId,
          code: created.code,
          name: created.name,
          currentGrade: created.currentGrade,
          targetGrade: created.targetGrade,
          examWeight: created.examWeight,
          color: created.color,
          createdAt: created.createdAt.toISOString(),
        };
      } catch (error) {
        console.warn('⚠️ Postgres create course failed, using mock store fallback:', (error as Error).message);
      }
    }

    // In-memory fallback
    const newCourse: CourseGrade = {
      id: courseData.id || `c-${Date.now()}`,
      userId: targetUserId,
      code: courseData.code,
      name: courseData.name,
      currentGrade: courseData.currentGrade ?? 85.0,
      targetGrade: courseData.targetGrade ?? 90.0,
      examWeight: courseData.examWeight ?? 30.0,
      color: courseData.color || '#4F46E5',
      createdAt: new Date().toISOString(),
    };

    mockCoursesStore.unshift(newCourse);
    return newCourse;
  }

  /**
   * Update existing course grade targets
   */
  public async update(id: string, updates: Partial<CourseGrade>): Promise<CourseGrade | null> {
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        const updated = await prisma.courseGrade.update({
          where: { id },
          data: {
            ...(updates.code && { code: updates.code }),
            ...(updates.name && { name: updates.name }),
            ...(updates.currentGrade !== undefined && { currentGrade: updates.currentGrade }),
            ...(updates.targetGrade !== undefined && { targetGrade: updates.targetGrade }),
            ...(updates.examWeight !== undefined && { examWeight: updates.examWeight }),
            ...(updates.color && { color: updates.color }),
          },
        });

        return {
          id: updated.id,
          userId: updated.userId,
          code: updated.code,
          name: updated.name,
          currentGrade: updated.currentGrade,
          targetGrade: updated.targetGrade,
          examWeight: updated.examWeight,
          color: updated.color,
          createdAt: updated.createdAt.toISOString(),
        };
      } catch (error) {
        console.warn('⚠️ Postgres update course failed, using mock store fallback');
      }
    }

    const index = mockCoursesStore.findIndex((c) => c.id === id);
    if (index === -1) return null;

    mockCoursesStore[index] = { ...mockCoursesStore[index], ...updates };
    return mockCoursesStore[index];
  }

  /**
   * Delete course by ID
   */
  public async delete(id: string): Promise<boolean> {
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        await prisma.courseGrade.delete({ where: { id } });
        return true;
      } catch (error) {
        console.warn('⚠️ Postgres delete course failed, using mock store fallback');
      }
    }

    const index = mockCoursesStore.findIndex((c) => c.id === id);
    if (index === -1) return false;

    mockCoursesStore.splice(index, 1);
    return true;
  }
}

export const courseRepository = new CourseRepository();
