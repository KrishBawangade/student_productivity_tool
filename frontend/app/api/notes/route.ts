import { NextResponse } from 'next/server';
import { getDbNotes, upsertDbNote, deleteDbNote } from '@/app/lib/db';

export async function GET() {
  try {
    const notes = await getDbNotes();
    return NextResponse.json({ success: true, notes });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const note = await upsertDbNote(body);
    return NextResponse.json({ success: true, note });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Note ID parameter required' }, { status: 400 });
    }
    const deleted = await deleteDbNote(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
