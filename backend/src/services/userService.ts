import { UserRepository } from '../repositories/userRepository.js';
import { UserProfile } from '../types/index.js';

export interface AddXpResult {
  user: UserProfile;
  leveledUp: boolean;
  previousLevel: number;
  currentLevel: number;
  xpAdded: number;
}

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Helper to derive dynamic rank title based on level milestone.
   */
  private getRankTitleForLevel(level: number): string {
    if (level >= 20) return 'Grandmaster Polymath';
    if (level >= 15) return 'Academic Architect';
    if (level >= 10) return 'Focus Strategist';
    if (level >= 5) return 'Dedicated Scholar';
    return 'Academic Novice';
  }

  /**
   * Get user profile details.
   */
  public async getUserProfile(userId?: string): Promise<UserProfile> {
    return await this.userRepository.findUserById(userId);
  }

  /**
   * Update editable profile settings.
   */
  public async updateUserProfile(
    userId: string,
    data: { name?: string; avatar?: string; rankTitle?: string }
  ): Promise<UserProfile> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new Error('User profile not found');
    }

    return await this.userRepository.updateUser(userId, data);
  }

  /**
   * Add XP to user and compute automated Level-Up threshold & rank titles.
   */
  public async addXp(userId: string, xpAmount: number): Promise<AddXpResult> {
    if (typeof xpAmount !== 'number' || xpAmount <= 0) {
      throw new Error('XP amount must be a positive number');
    }

    const user = await this.userRepository.findUserById(userId);
    const previousLevel = user.level;
    let currentLevel = user.level;
    let currentXp = user.xp + xpAmount;
    let nextLevelXp = user.nextLevelXp;

    let leveledUp = false;

    // Check level-up threshold: XP_req = 1000 * Level
    while (currentXp >= nextLevelXp) {
      leveledUp = true;
      currentLevel += 1;
      nextLevelXp = 1000 * currentLevel;
    }

    const newRankTitle = this.getRankTitleForLevel(currentLevel);

    const updatedUser = await this.userRepository.updateUser(userId, {
      xp: currentXp,
      level: currentLevel,
      nextLevelXp: nextLevelXp,
      rankTitle: newRankTitle,
    });

    return {
      user: updatedUser,
      leveledUp,
      previousLevel,
      currentLevel,
      xpAdded: xpAmount,
    };
  }

  /**
   * Manage user streak and streak shield consumption.
   */
  public async manageStreak(
    userId: string,
    action: 'increment' | 'freeze' | 'reset'
  ): Promise<UserProfile> {
    const user = await this.userRepository.findUserById(userId);

    let updatedStreak = user.streak;
    let updatedShields = user.streakShields;

    if (action === 'increment') {
      updatedStreak += 1;
    } else if (action === 'freeze') {
      if (updatedShields <= 0) {
        throw new Error('No streak shields available to freeze streak');
      }
      updatedShields -= 1;
    } else if (action === 'reset') {
      updatedStreak = 0;
    } else {
      throw new Error('Invalid streak action. Allowed: increment, freeze, reset');
    }

    return await this.userRepository.updateUser(userId, {
      streak: updatedStreak,
      streakShields: updatedShields,
    });
  }
}
