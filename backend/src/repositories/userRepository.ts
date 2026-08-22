import { getPrismaClient } from '../config/db.js';
import { UserProfile } from '../types/index.js';

export const DEFAULT_DEMO_USER_ID = 'user-demo-1';

// Fallback in-memory user store
const mockUserStore: UserProfile = {
  id: DEFAULT_DEMO_USER_ID,
  name: 'Alex Rivera',
  email: 'alex.rivera@nexus.edu',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
  rankTitle: 'Academic Architect',
  level: 14,
  xp: 2450,
  nextLevelXp: 3500,
  streak: 7,
  streakShields: 1,
  totalFocusMinutes: 420,
  completedTasks: 18,
  masteredCards: 34,
};

export class UserRepository {
  /**
   * Find user profile by ID from Prisma DB or in-memory fallback.
   */
  public async findUserById(userId?: string): Promise<UserProfile> {
    const targetUserId = userId || DEFAULT_DEMO_USER_ID;
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        const user = await prisma.user.findUnique({
          where: { id: targetUserId },
        });

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar || mockUserStore.avatar,
            rankTitle: user.rankTitle,
            level: user.level,
            xp: user.xp,
            nextLevelXp: user.nextLevelXp,
            streak: user.streak,
            streakShields: user.streakShields,
            totalFocusMinutes: user.totalFocusMinutes,
            completedTasks: user.completedTasks,
            masteredCards: user.masteredCards,
          };
        }
      } catch (error) {
        console.warn('⚠️ [UserRepository] Database query failed, falling back to mock user:', error);
      }
    }

    return { ...mockUserStore };
  }

  /**
   * Update user profile fields in DB or fallback store.
   */
  public async updateUser(userId: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const targetUserId = userId || DEFAULT_DEMO_USER_ID;
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        const updateData: any = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.avatar !== undefined) updateData.avatar = data.avatar;
        if (data.rankTitle !== undefined) updateData.rankTitle = data.rankTitle;
        if (data.level !== undefined) updateData.level = data.level;
        if (data.xp !== undefined) updateData.xp = data.xp;
        if (data.nextLevelXp !== undefined) updateData.nextLevelXp = data.nextLevelXp;
        if (data.streak !== undefined) updateData.streak = data.streak;
        if (data.streakShields !== undefined) updateData.streakShields = data.streakShields;
        if (data.totalFocusMinutes !== undefined) updateData.totalFocusMinutes = data.totalFocusMinutes;
        if (data.completedTasks !== undefined) updateData.completedTasks = data.completedTasks;
        if (data.masteredCards !== undefined) updateData.masteredCards = data.masteredCards;

        const updated = await prisma.user.update({
          where: { id: targetUserId },
          data: updateData,
        });

        return {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          avatar: updated.avatar || mockUserStore.avatar,
          rankTitle: updated.rankTitle,
          level: updated.level,
          xp: updated.xp,
          nextLevelXp: updated.nextLevelXp,
          streak: updated.streak,
          streakShields: updated.streakShields,
          totalFocusMinutes: updated.totalFocusMinutes,
          completedTasks: updated.completedTasks,
          masteredCards: updated.masteredCards,
        };
      } catch (error) {
        console.warn('⚠️ [UserRepository] DB update failed, updating mock store:', error);
      }
    }

    // In-memory update
    Object.assign(mockUserStore, data);
    return { ...mockUserStore };
  }
}
