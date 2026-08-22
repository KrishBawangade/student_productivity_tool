import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService.js';
import { DEFAULT_DEMO_USER_ID } from '../repositories/userRepository.js';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * GET /api/v1/user
   * Retrieve current user profile.
   */
  public getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.query.userId as string) || DEFAULT_DEMO_USER_ID;
      const profile = await this.userService.getUserProfile(userId);

      res.status(200).json({
        success: true,
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PUT /api/v1/user
   * Update user profile settings.
   */
  public updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.query.userId as string) || (req.body.userId as string) || DEFAULT_DEMO_USER_ID;
      const { name, avatar, rankTitle } = req.body;

      const updated = await this.userService.updateUserProfile(userId, { name, avatar, rankTitle });

      res.status(200).json({
        success: true,
        data: updated,
        message: 'User profile updated successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/user/xp
   * Add XP to user and compute level-up check.
   */
  public addXp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.query.userId as string) || (req.body.userId as string) || DEFAULT_DEMO_USER_ID;
      const xpAmount = req.body.xp ?? req.body.amount;

      if (xpAmount === undefined || typeof xpAmount !== 'number') {
        res.status(400).json({
          success: false,
          error: 'XP amount is required and must be a number (e.g. { "amount": 250 })',
        });
        return;
      }

      const result = await this.userService.addXp(userId, xpAmount);

      const message = result.leveledUp
        ? `🎉 Level Up! You reached Level ${result.currentLevel} (${result.user.rankTitle})!`
        : `+${result.xpAdded} XP added successfully`;

      res.status(200).json({
        success: true,
        data: result,
        message,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /api/v1/user/streak
   * Manage user streak (increment, freeze, reset).
   */
  public manageStreak = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req.query.userId as string) || (req.body.userId as string) || DEFAULT_DEMO_USER_ID;
      const { action } = req.body;

      if (!action || !['increment', 'freeze', 'reset'].includes(action)) {
        res.status(400).json({
          success: false,
          error: 'Valid streak action is required ("increment", "freeze", or "reset")',
        });
        return;
      }

      const updatedUser = await this.userService.manageStreak(userId, action);

      res.status(200).json({
        success: true,
        data: updatedUser,
        message: `Streak action '${action}' processed successfully`,
      });
    } catch (error) {
      next(error);
    }
  };
}
