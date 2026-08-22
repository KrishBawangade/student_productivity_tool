import { taskRepository } from '../repositories/taskRepository.js';
import { Task } from '../types/index.js';

export class TaskService {
  /**
   * Fetch all tasks with optional filters
   */
  public async getTasks(priority?: string, completed?: boolean): Promise<Task[]> {
    return taskRepository.findAll(priority, completed);
  }

  /**
   * Find task by ID
   */
  public async getTaskById(id: string): Promise<Task | null> {
    return taskRepository.findById(id);
  }

  /**
   * Create a new task with dynamic XP calculation
   */
  public async createTask(taskData: {
    title: string;
    course?: string;
    dueDate?: string;
    priority?: 'high' | 'medium' | 'low';
    xp?: number;
  }): Promise<Task> {
    if (!taskData.title || taskData.title.trim() === '') {
      throw new Error('Task title is required');
    }

    const priority = taskData.priority || 'medium';
    
    // XP Calculation Logic based on priority
    let xp = taskData.xp;
    if (!xp) {
      switch (priority) {
        case 'high':
          xp = 50;
          break;
        case 'medium':
          xp = 35;
          break;
        case 'low':
          xp = 20;
          break;
        default:
          xp = 35;
      }
    }

    return taskRepository.create({
      title: taskData.title.trim(),
      course: taskData.course || 'General',
      dueDate: taskData.dueDate || 'Today',
      priority,
      xp,
      completed: false,
    });
  }

  /**
   * Update task details or toggle completion status
   */
  public async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const existing = await taskRepository.findById(id);
    if (!existing) {
      throw new Error(`Task with ID '${id}' not found`);
    }

    const updated = await taskRepository.update(id, updates);
    if (!updated) {
      throw new Error('Failed to update task');
    }

    return updated;
  }

  /**
   * Toggle task completion state
   */
  public async toggleTaskCompletion(id: string, completed: boolean): Promise<{ task: Task; xpAwarded: number }> {
    const existing = await taskRepository.findById(id);
    if (!existing) {
      throw new Error(`Task with ID '${id}' not found`);
    }

    const updated = await taskRepository.update(id, { completed });
    if (!updated) {
      throw new Error('Failed to update task completion');
    }

    // Award XP if completed, 0 if un-checked
    const xpAwarded = completed ? updated.xp : 0;

    return {
      task: updated,
      xpAwarded,
    };
  }

  /**
   * Delete a task
   */
  public async deleteTask(id: string): Promise<boolean> {
    const existing = await taskRepository.findById(id);
    if (!existing) {
      throw new Error(`Task with ID '${id}' not found`);
    }

    return taskRepository.delete(id);
  }
}

export const taskService = new TaskService();
