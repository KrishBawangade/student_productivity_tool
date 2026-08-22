import { NextResponse } from 'next/server';
import { getDbFlashcards, createDbFlashcard, updateDbFlashcard, deleteDbFlashcard } from '@/app/lib/db';

export async function GET() {
  try {
    const flashcards = await getDbFlashcards();
    return NextResponse.json({ success: true, flashcards });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCard = await createDbFlashcard(body);
    return NextResponse.json({ success: true, card: newCard }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...partial } = await request.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Flashcard ID is required' }, { status: 400 });
    }
    const updated = await updateDbFlashcard(id, partial);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Flashcard not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, card: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Flashcard ID parameter required' }, { status: 400 });
    }
    const deleted = await deleteDbFlashcard(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
