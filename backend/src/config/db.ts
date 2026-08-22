import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

let prisma: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient | null {
  if (!env.DATABASE_URL) {
    console.warn('⚠️ DATABASE_URL not set. Operating with fallback in-memory database store.');
    return null;
  }

  if (!prisma) {
    try {
      prisma = new PrismaClient({
        datasources: {
          db: {
            url: env.DATABASE_URL,
          },
        },
      });
    } catch (err) {
      console.error('Failed to initialize Prisma Client:', err);
      prisma = null;
    }
  }

  return prisma;
}
