import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/taskService.js';

export class TaskController {
  /**
   * Helper to extract userId from headers, query parameter, or body
   */
  private extractUserId(req: Request): string | undefined {
    const headerUserId = req.headers['x-user-id'];
    if (headerUserId) return String(headerUserId);

    const queryUserId = req.query.userId;
    if (queryUserId) return String(queryUserId);

    const bodyUserId = req.body?.userId;
    if (bodyUserId) return String(bodyUserId);

    return undefined;
  }

  /**
   * GET /api/v1/tasks
   * Fetch all user-scoped tasks
   */
  public async getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { priority, completed } = req.query;
      const userId = this.extractUserId(req);

      const priorityFilter = priority ? String(priority) : undefined;
      const completedFilter = completed !== undefined ? String(completed) === 'true' : undefined;

      const tasks = await taskService.getTasks(userId, priorityFilter, completedFilter);

      res.status(200).json({
        success: true,
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/tasks/:id
   * Fetch single task by ID
   */
  public async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const task = await taskService.getTaskById(id);

      if (!task) {
        res.status(404).json({
          success: false,
          error: `Task with ID '${id}' not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: task,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/tasks
   * Create a new task tied to user ID
   */
  public async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, course, dueDate, priority, xp } = req.body;
      const userId = this.extractUserId(req);

      if (!title) {
        res.status(400).json({
          success: false,
          error: 'Field "title" is required',
        });
        return;
      }

      const newTask = await taskService.createTask({
        userId,
        title: String(title),
        course: course ? String(course) : undefined,
        dueDate: dueDate ? String(dueDate) : undefined,
        priority: priority ? (String(priority) as 'high' | 'medium' | 'low') : undefined,
        xp: xp !== undefined ? Number(xp) : undefined,
      });

      res.status(201).json({
        success: true,
        data: newTask,
        message: 'Task created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/tasks/:id
   * Update task details or toggle completion status
   */
  public async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const updates = req.body;

      const updatedTask = await taskService.updateTask(id, updates);

      res.status(200).json({
        success: true,
        data: updatedTask,
        message: 'Task updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/tasks/:id
   * Delete task by ID
   */
  public async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      await taskService.deleteTask(id);

      res.status(200).json({
        success: true,
        message: `Task '${id}' deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const taskController = new TaskController();
