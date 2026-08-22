import { NextResponse } from 'next/server';
import { generateCopilotResponse, isGeminiConfigured } from '../../lib/gemini';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, mode = 'general', documentContext } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Prompt query is required.' }, { status: 400 });
    }

    const { text, codeSnippet } = await generateCopilotResponse(prompt, mode, documentContext);

    return NextResponse.json({
      text,
      codeSnippet,
      isAiLive: isGeminiConfigured(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
  } catch {
    return NextResponse.json({ error: 'Copilot query failed.' }, { status: 500 });
  }
}

