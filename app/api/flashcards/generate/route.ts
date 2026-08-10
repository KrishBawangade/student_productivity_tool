import { NextResponse } from 'next/server';

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

    // Mock AI card generation response matching PRD schema
    const generatedCards = [
      {
        id: `gen_${Date.now()}_1`,
        question: `Core Principle of ${topic || 'Lecture Note'}: What is the primary objective?`,
        answer: sourceText 
          ? `Based on your note: "${sourceText.slice(0, 90)}..." it establishes structural balance and algorithmic efficiency.`
          : `The core principle of ${topic} focuses on optimizing memory, reducing time complexity, and ensuring systemic reliability.`,
        topic: subject || topic || 'General Study',
        codeSnippet: topic?.toLowerCase().includes('algorithm') || topic?.toLowerCase().includes('code') 
          ? `// Key logic pattern\nfunction executeProcess(data) {\n  return data.map(item => transform(item));\n}`
          : undefined,
        difficulty: 'Medium',
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
        dueDate: new Date().toISOString(),
        mastered: false,
      },
      {
        id: `gen_${Date.now()}_2`,
        question: `How does ${topic || 'this concept'} handle edge cases or failure modes?`,
        answer: `Edge cases are handled by fallback mechanisms, boundary validation, and constant factor time constraints to guarantee stability.`,
        topic: subject || topic || 'General Study',
        difficulty: 'Hard',
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
        dueDate: new Date().toISOString(),
        mastered: false,
      },
      {
        id: `gen_${Date.now()}_3`,
        question: `What real-world engineering or scientific application uses ${topic || 'this theorem'}?`,
        answer: `Used heavily in modern distributed databases, machine learning backpropagation pipelines, and high-frequency real-time processing systems.`,
        topic: subject || topic || 'General Study',
        difficulty: 'Easy',
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
        dueDate: new Date().toISOString(),
        mastered: false,
      },
    ].slice(0, cardCount);

    return NextResponse.json({
      deckId: `deck_${Date.now()}`,
      deckTitle: `${subject || 'Study Deck'}: ${topic || 'Lecture Notes'}`,
      cards: generatedCards,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to process AI generation request.' },
      { status: 500 }
    );
  }
}
