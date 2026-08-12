import { NextResponse } from 'next/server';
import { getCurrentUserFromCookie } from '@/app/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUserFromCookie();
    if (!user) {
      return NextResponse.json({ success: false, authenticated: false, user: null }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, authenticated: false, error: error.message },
      { status: 500 }
    );
  }
}
