import { NextResponse } from 'next/server';
import { getDbAnalytics, recordDbSession, recordDbQuizAttempt } from '@/app/lib/db';

export async function GET() {
  try {
    const data = await getDbAnalytics();
    return NextResponse.json({ success: true, ...data });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.type === 'session') {
      const session = await recordDbSession(body.data);
      return NextResponse.json({ success: true, session });
    }
    if (body.type === 'quiz') {
      const attempt = await recordDbQuizAttempt(body.data);
      return NextResponse.json({ success: true, attempt });
    }
    return NextResponse.json({ success: false, error: 'Invalid record type' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
