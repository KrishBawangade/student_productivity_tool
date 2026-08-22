import { NextResponse } from 'next/server';
import { getDbUser, updateDbUser } from '@/app/lib/db';

export async function GET() {
  try {
    const user = await getDbUser();
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updatedUser = await updateDbUser(body);
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
