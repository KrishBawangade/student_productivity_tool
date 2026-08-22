import { Request, Response, NextFunction } from 'express';
import { StudySessionService } from '../services/studySessionService.js';
import { DEFAULT_DEMO_USER_ID } from '../repositories/userRepository.js';

export class StudySessionController {
  private service: StudySessionService;

  constructor() {
    this.service = new StudySessionService();
  }

  /**
   * GET /api/v1/sessions
   * Fetch all study sessions with optional course and type filters.
   */
  public getSessions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.query.userId as string) || DEFAULT_DEMO_USER_ID;
      const course = req.query.course as string;
      const type = req.query.type as string;

      const sessions = await this.service.getSessions(userId, course, type);

      res.status(200).json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/sessions
   * Log a new study focus session.
   */
  public logSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.query.userId as string) || (req.body.userId as string) || DEFAULT_DEMO_USER_ID;
      const { course, durationMinutes, date, type } = req.body;

      const result = await this.service.logSession({
        userId,
        course,
        durationMinutes,
        date,
        type,
      });

      res.status(201).json({
        success: true,
        data: result,
        message: `🎉 Logged ${result.session.durationMinutes} min focus session (+${result.xpEarned} XP awarded)!`,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/sessions/analytics
   * Retrieve aggregate focus time and course distribution analytics.
   */
  public getAnalytics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.query.userId as string) || DEFAULT_DEMO_USER_ID;
      const analytics = await this.service.getFocusAnalytics(userId);

      res.status(200).json({
        success: true,
        data: analytics,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/v1/sessions/:id
   * Remove a study session log.
   */
  public deleteSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : (req.params.id as string);
      await this.service.deleteSession(id);

      res.status(200).json({
        success: true,
        message: 'Study session log deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
