import { NextResponse } from 'next/server';
import { clearSessionCookie } from '@/app/lib/auth';

export async function POST() {
  try {
    await clearSessionCookie();
    return NextResponse.json({
      success: true,
      message: 'Signed out successfully.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Logout failed.' },
      { status: 500 }
    );
  }
}
