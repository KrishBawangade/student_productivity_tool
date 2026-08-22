import { NextResponse } from 'next/server';
import { generateFlashcardsWithGemini, isGeminiConfigured } from '../../../lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { subject, topic, sourceText, cardCount = 3 } = body;

    if (!topic && !sourceText) {
      return NextResponse.json(
        { error: 'Please provide either a topic or lecture text input.' },
        { status: 400 }
      );
    }

    const generatedCards = await generateFlashcardsWithGemini(subject, topic, sourceText, cardCount);

    return NextResponse.json({
      deckId: `deck_${Date.now()}`,
      deckTitle: `${subject || 'Study Deck'}: ${topic || 'Lecture Notes'}`,
      cards: generatedCards,
      isAiLive: isGeminiConfigured(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process AI generation request.' },
      { status: 500 }
    );
  }
}

