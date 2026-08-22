import { Request, Response, NextFunction } from 'express';
import { taskService } from '../services/taskService.js';

export class TaskController {
  /**
   * GET /api/v1/tasks
   * Fetch all tasks with optional query filters
   */
  public async getTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { priority, completed } = req.query;
      
      const priorityFilter = priority ? String(priority) : undefined;
      const completedFilter = completed !== undefined ? String(completed) === 'true' : undefined;

      const tasks = await taskService.getTasks(priorityFilter, completedFilter);

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
   * Create a new task
   */
  public async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, course, dueDate, priority, xp } = req.body;

      if (!title) {
        res.status(400).json({
          success: false,
          error: 'Field "title" is required',
        });
        return;
      }

      const newTask = await taskService.createTask({
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
