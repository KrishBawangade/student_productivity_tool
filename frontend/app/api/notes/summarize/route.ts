import { NextResponse } from 'next/server';
import { summarizeNoteWithGemini, isGeminiConfigured } from '../../../lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, course, rawText, action } = body;

    if (!rawText || typeof rawText !== 'string' || rawText.trim().length === 0) {
      return NextResponse.json(
        { error: 'Note content (rawText) cannot be empty.' },
        { status: 400 }
      );
    }

    const result = await summarizeNoteWithGemini(title, course, rawText, action || 'summarize');

    return NextResponse.json({
      ...result,
      isAiLive: isGeminiConfigured(),
    });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

