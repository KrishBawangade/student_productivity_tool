import { NextResponse } from 'next/server';
import { generateQuizWithGemini, isGeminiConfigured } from '../../../lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic = 'General Computer Science', sourceText = '', courseCode = 'CS401', questionCount = 4 } = body;

    const questions = await generateQuizWithGemini(topic, courseCode, sourceText, questionCount);

    return NextResponse.json({
      quizId: `qz_deck_${Date.now()}`,
      title: `${courseCode}: ${topic} Practice Quiz`,
      courseCode,
      questions,
      isAiLive: isGeminiConfigured(),
    });
  } catch {
    return NextResponse.json({ error: 'Quiz generation failed.' }, { status: 500 });
  }
}

