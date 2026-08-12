import { NextResponse } from 'next/server';
import { userDb, createSessionToken, setSessionCookie } from '@/app/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, major, school } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Full name is required.' }, { status: 400 });
    }
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'A valid email address is required.' }, { status: 400 });
    }
    if (!password || password.length < 4) {
      return NextResponse.json({ success: false, error: 'Password must be at least 4 characters long.' }, { status: 400 });
    }

    const existingUser = userDb.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'An account with this email address already exists. Please sign in.' },
        { status: 409 }
      );
    }

    const newUser = userDb.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      major: major || 'Computer Science',
      school: school || 'University',
      provider: 'email',
    });

    const token = createSessionToken(newUser);
    await setSessionCookie(token);

    const { passwordHash, salt, ...safeUser } = newUser;

    return NextResponse.json({
      success: true,
      message: 'Account registered successfully.',
      user: safeUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
