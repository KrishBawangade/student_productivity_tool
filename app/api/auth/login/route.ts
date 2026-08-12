import { NextResponse } from 'next/server';
import { userDb, createSessionToken, setSessionCookie } from '@/app/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, provider } = body;

    // Handle Social Auth Login (Google, GitHub, etc.)
    if (provider === 'google' || provider === 'github' || provider === 'microsoft') {
      const isGoogle = provider === 'google';
      const isGithub = provider === 'github';

      const userEmail = email && email.includes('@') 
        ? email.trim().toLowerCase() 
        : isGoogle 
          ? 'student.user@gmail.com' 
          : isGithub 
            ? 'student.user@github.com' 
            : 'student.user@outlook.com';

      const userName = body.name && body.name.trim() 
        ? body.name.trim() 
        : userEmail.split('@')[0].replace('.', ' ').replace(/^./, (s: string) => s.toUpperCase());

      let user = userDb.findByEmail(userEmail);

      if (!user) {
        user = userDb.createUser({
          name: userName,
          email: userEmail,
          avatar: body.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`,
          major: body.major || 'Computer Science & AI',
          school: body.school || 'University',
          provider,
        });
      }

      const token = createSessionToken(user);
      await setSessionCookie(token);

      const { passwordHash, salt, ...safeUser } = user;
      return NextResponse.json({ success: true, user: safeUser });
    }

    // Handle Password Authentication
    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Please provide a valid email address.' }, { status: 400 });
    }

    let user = userDb.findByEmail(email);

    if (user && user.passwordHash) {
      const isValid = userDb.verifyPassword(email, password || '');
      if (!isValid) {
        return NextResponse.json({ success: false, error: 'Invalid email or password.' }, { status: 401 });
      }
    } else if (!user) {
      // Create fresh user profile for real user sign-in
      user = userDb.createUser({
        name: body.name || email.split('@')[0].replace('.', ' ').replace(/^./, (s: string) => s.toUpperCase()),
        email: email.trim().toLowerCase(),
        password: password || 'defaultPass123',
        major: 'General Studies',
        school: 'University',
        provider: 'email',
      });
    }

    const token = createSessionToken(user);
    await setSessionCookie(token);

    const { passwordHash, salt, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      message: 'Sign in successful.',
      user: safeUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication failed.' },
      { status: 500 }
    );
  }
}
