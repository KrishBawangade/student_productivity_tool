import { Request, Response, NextFunction } from 'express';
import { courseService } from '../services/courseService.js';

export class CourseController {
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
   * GET /api/v1/courses
   * Fetch all user-scoped course grade target entries
   */
  public async getCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const courses = await courseService.getAllCourses(userId);

      res.status(200).json({
        success: true,
        data: courses,
        count: courses.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/courses/:id
   * Fetch a single course by ID
   */
  public async getCourseById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const course = await courseService.getCourseById(id);

      if (!course) {
        res.status(404).json({
          success: false,
          error: `Course with ID '${id}' not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: course,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/courses
   * Add a new course target entry
   */
  public async createCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code, name, currentGrade, targetGrade, examWeight, color } = req.body;
      const userId = this.extractUserId(req);

      if (!code || !name) {
        res.status(400).json({
          success: false,
          error: 'Fields "code" and "name" are required',
        });
        return;
      }

      const newCourse = await courseService.createCourse({
        userId,
        code: String(code),
        name: String(name),
        currentGrade: currentGrade !== undefined ? Number(currentGrade) : 85.0,
        targetGrade: targetGrade !== undefined ? Number(targetGrade) : 90.0,
        examWeight: examWeight !== undefined ? Number(examWeight) : 30.0,
        color: color ? String(color) : '#4F46E5',
      });

      res.status(201).json({
        success: true,
        data: newCourse,
        message: 'Course created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/courses/calculate
   * Calculate required final exam score using Target/Current/Weight formula
   */
  public async calculateGrade(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { currentGrade, targetGrade, examWeight } = req.body;

      if (currentGrade === undefined || targetGrade === undefined || examWeight === undefined) {
        res.status(400).json({
          success: false,
          error: 'Fields "currentGrade", "targetGrade", and "examWeight" are required',
        });
        return;
      }

      const numCurrent = Number(currentGrade);
      const numTarget = Number(targetGrade);
      const numWeight = Number(examWeight);

      if (isNaN(numCurrent) || isNaN(numTarget) || isNaN(numWeight)) {
        res.status(400).json({
          success: false,
          error: 'Grades and exam weight must be valid numbers',
        });
        return;
      }

      const result = courseService.calculateRequiredExamScore(numCurrent, numTarget, numWeight);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/courses/:id
   * Update course details or grade targets
   */
  public async updateCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const updates = req.body;

      const updated = await courseService.updateCourse(id, updates);

      if (!updated) {
        res.status(404).json({
          success: false,
          error: `Course with ID '${id}' not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updated,
        message: 'Course updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/courses/:id
   * Remove course by ID
   */
  public async deleteCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const success = await courseService.deleteCourse(id);

      if (!success) {
        res.status(404).json({
          success: false,
          error: `Course with ID '${id}' not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Course '${id}' deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const courseController = new CourseController();
