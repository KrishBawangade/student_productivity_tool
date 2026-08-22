import crypto from 'crypto';
import { cookies } from 'next/headers';
import { dbStore } from './db';

const JWT_SECRET = process.env.NEXUS_JWT_SECRET || 'nexus_academia_super_secret_auth_key_2026';
const COOKIE_NAME = 'nexus_session';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  salt?: string;
  avatar?: string;
  major?: string;
  school?: string;
  joinedAt?: string;
  provider: 'google' | 'github' | 'email' | 'guest';
}

// In-Memory user table for server API routes
class UserDatabase {
  private static instance: UserDatabase;
  private users: Map<string, UserRecord> = new Map();

  private constructor() {
    // Start with a clean, empty user database for real data testing
  }

  public static getInstance(): UserDatabase {
    if (!UserDatabase.instance) {
      UserDatabase.instance = new UserDatabase();
    }
    return UserDatabase.instance;
  }

  public hashPasswordWithSalt(password: string, salt: string): string {
    return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  }

  public findByEmail(email: string): UserRecord | undefined {
    return this.users.get(email.toLowerCase());
  }

  public createUser(userData: Omit<UserRecord, 'id'> & { password?: string }): UserRecord {
    let passwordHash: string | undefined = undefined;
    let salt: string | undefined = undefined;

    if (userData.password) {
      salt = crypto.randomBytes(16).toString('hex');
      passwordHash = this.hashPasswordWithSalt(userData.password, salt);
    }

    const newUser: UserRecord = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      name: userData.name,
      email: userData.email,
      passwordHash,
      salt,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userData.name)}`,
      major: userData.major || 'Computer Science',
      school: userData.school || 'University',
      joinedAt: new Date().toISOString().split('T')[0],
      provider: userData.provider || 'email',
    };

    this.users.set(newUser.email.toLowerCase(), newUser);
    return newUser;
  }

  public verifyPassword(email: string, passwordAttempt: string): boolean {
    const user = this.findByEmail(email);
    if (!user || !user.passwordHash || !user.salt) return false;

    const hash = this.hashPasswordWithSalt(passwordAttempt, user.salt);
    return hash === user.passwordHash;
  }
}

export const userDb = UserDatabase.getInstance();

// Token Generation & Verification using HMAC-SHA256
export function createSessionToken(user: UserRecord): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      provider: user.provider,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    })
  ).toString('base64url');

  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

export function verifySessionToken(token: string): { valid: boolean; payload?: any } {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false };

    const [header, payload, signature] = parts;
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (signature !== expectedSignature) return { valid: false };

    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));

    if (decodedPayload.exp && decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false };
    }

    return { valid: true, payload: decodedPayload };
  } catch {
    return { valid: false };
  }
}

// Cookie Helper Functions for Next.js App Router API Routes
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
}

export async function getCurrentUserFromCookie(): Promise<UserRecord | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { valid, payload } = verifySessionToken(token);
    if (!valid || !payload?.email) return null;

    const user = userDb.findByEmail(payload.email);
    if (!user) return null;

    const { passwordHash, salt, ...safeUser } = user;
    return safeUser as UserRecord;
  } catch {
    return null;
  }
}
