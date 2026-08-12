import { NextResponse } from 'next/server';
import { userDb, createSessionToken, setSessionCookie } from '@/app/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email address is required.' }, { status: 400 });
    }

    let user = userDb.findByEmail(email);
    if (!user) {
      user = userDb.createUser({
        name: email.split('@')[0],
        email: email.trim().toLowerCase(),
        provider: 'email',
      });
    }

    const token = createSessionToken(user);
    await setSessionCookie(token);

    const { passwordHash, salt, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      message: 'Magic link authenticated.',
      user: safeUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Magic link verification failed.' },
      { status: 500 }
    );
  }
}
