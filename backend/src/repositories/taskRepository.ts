import { getPrismaClient } from '../config/db.js';
import { Task } from '../types/index.js';

export const DEFAULT_DEMO_USER_ID = 'user-demo-1';

// Fallback in-memory task store with default user context
const mockTasksStore: Task[] = [
  {
    id: 't-1',
    userId: DEFAULT_DEMO_USER_ID,
    title: 'Complete CS401 Lab Assignment 3 (Neural Nets)',
    course: 'CS401 AI',
    dueDate: 'Today, 11:59 PM',
    priority: 'high',
    xp: 50,
    completed: false,
  },
  {
    id: 't-2',
    userId: DEFAULT_DEMO_USER_ID,
    title: 'Review Chapter 4 - Spaced Repetition Algorithms',
    course: 'COGS201',
    dueDate: 'Tomorrow',
    priority: 'medium',
    xp: 35,
    completed: true,
  },
  {
    id: 't-3',
    userId: DEFAULT_DEMO_USER_ID,
    title: 'MATH302 Practice Midterm Exam Problems',
    course: 'MATH302',
    dueDate: 'Aug 24',
    priority: 'high',
    xp: 50,
    completed: false,
  },
];

export class TaskRepository {
  /**
   * Fetch user-specific tasks from PostgreSQL via Prisma or fallback store.
   */
  public async findAll(
    userId?: string,
    priorityFilter?: string,
    completedFilter?: boolean
  ): Promise<Task[]> {
    const targetUserId = userId || DEFAULT_DEMO_USER_ID;
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        const whereClause: any = { userId: targetUserId };
        if (priorityFilter) whereClause.priority = priorityFilter;
        if (completedFilter !== undefined) whereClause.completed = completedFilter;

        const dbTasks = await prisma.task.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
        });

        return dbTasks.map((t) => ({
          id: t.id,
          userId: t.userId,
          title: t.title,
          course: t.course,
          dueDate: t.dueDate,
          priority: t.priority as 'high' | 'medium' | 'low',
          xp: t.xp,
          completed: t.completed,
          createdAt: t.createdAt.toISOString(),
        }));
      } catch (error) {
        console.warn('⚠️ Postgres Task query failed, using mock store fallback:', (error as Error).message);
      }
    }

    // In-memory fallback filtering by userId
    let tasks = mockTasksStore.filter((t) => !t.userId || t.userId === targetUserId);
    if (priorityFilter) {
      tasks = tasks.filter((t) => t.priority === priorityFilter);
    }
    if (completedFilter !== undefined) {
      tasks = tasks.filter((t) => t.completed === completedFilter);
    }
    return tasks;
  }

  /**
   * Find single task by ID
   */
  public async findById(id: string): Promise<Task | null> {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        const dbTask = await prisma.task.findUnique({ where: { id } });
        if (dbTask) {
          return {
            id: dbTask.id,
            userId: dbTask.userId,
            title: dbTask.title,
            course: dbTask.course,
            dueDate: dbTask.dueDate,
            priority: dbTask.priority as 'high' | 'medium' | 'low',
            xp: dbTask.xp,
            completed: dbTask.completed,
            createdAt: dbTask.createdAt.toISOString(),
          };
        }
      } catch (error) {
        console.warn('⚠️ Postgres findById failed, falling back to mock store');
      }
    }

    return mockTasksStore.find((t) => t.id === id) || null;
  }

  /**
   * Create a new user-scoped Task
   */
  public async create(taskData: Omit<Task, 'id'> & { id?: string; userId?: string }): Promise<Task> {
    const targetUserId = taskData.userId || DEFAULT_DEMO_USER_ID;
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        // Ensure parent User record exists before creating Task
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

        const created = await prisma.task.create({
          data: {
            userId: user.id,
            title: taskData.title,
            course: taskData.course || 'General',
            dueDate: taskData.dueDate || 'Today',
            priority: taskData.priority || 'medium',
            xp: taskData.xp || 35,
            completed: taskData.completed || false,
          },
        });

        return {
          id: created.id,
          userId: created.userId,
          title: created.title,
          course: created.course,
          dueDate: created.dueDate,
          priority: created.priority as 'high' | 'medium' | 'low',
          xp: created.xp,
          completed: created.completed,
          createdAt: created.createdAt.toISOString(),
        };
      } catch (error) {
        console.warn('⚠️ Postgres create task failed, using mock store fallback:', (error as Error).message);
      }
    }

    // In-memory creation fallback
    const newTask: Task = {
      id: taskData.id || `t-${Date.now()}`,
      userId: targetUserId,
      title: taskData.title,
      course: taskData.course || 'General',
      dueDate: taskData.dueDate || 'Today',
      priority: taskData.priority || 'medium',
      xp: taskData.xp || (taskData.priority === 'high' ? 50 : 35),
      completed: taskData.completed || false,
      createdAt: new Date().toISOString(),
    };

    mockTasksStore.unshift(newTask);
    return newTask;
  }

  /**
   * Update existing task
   */
  public async update(id: string, updates: Partial<Task>): Promise<Task | null> {
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        const updated = await prisma.task.update({
          where: { id },
          data: {
            ...(updates.title && { title: updates.title }),
            ...(updates.course && { course: updates.course }),
            ...(updates.dueDate && { dueDate: updates.dueDate }),
            ...(updates.priority && { priority: updates.priority }),
            ...(updates.xp !== undefined && { xp: updates.xp }),
            ...(updates.completed !== undefined && { completed: updates.completed }),
          },
        });

        return {
          id: updated.id,
          userId: updated.userId,
          title: updated.title,
          course: updated.course,
          dueDate: updated.dueDate,
          priority: updated.priority as 'high' | 'medium' | 'low',
          xp: updated.xp,
          completed: updated.completed,
          createdAt: updated.createdAt.toISOString(),
        };
      } catch (error) {
        console.warn('⚠️ Postgres update task failed, using mock store fallback');
      }
    }

    const index = mockTasksStore.findIndex((t) => t.id === id);
    if (index === -1) return null;

    mockTasksStore[index] = { ...mockTasksStore[index], ...updates };
    return mockTasksStore[index];
  }

  /**
   * Delete task by ID
   */
  public async delete(id: string): Promise<boolean> {
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        await prisma.task.delete({ where: { id } });
        return true;
      } catch (error) {
        console.warn('⚠️ Postgres delete task failed, using mock store fallback');
      }
    }

    const index = mockTasksStore.findIndex((t) => t.id === id);
    if (index === -1) return false;

    mockTasksStore.splice(index, 1);
    return true;
  }
}

export const taskRepository = new TaskRepository();
