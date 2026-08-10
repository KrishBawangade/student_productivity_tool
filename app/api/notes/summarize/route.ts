import { NextResponse } from 'next/server';

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

    const textUpper = rawText.toUpperCase();

    // 1. Action: Summarize Note
    if (action === 'summarize') {
      const paragraphs = rawText
        .split('\n\n')
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      const summary = paragraphs.length > 1 
        ? `Executive Summary of ${title || 'Lecture Note'}: ${paragraphs[0].slice(0, 200)}... Key focus on ${paragraphs[1]?.slice(0, 150) || 'core concepts'}.`
        : `Summary: ${rawText.slice(0, 250)}...`;

      // Extract bullet points or sentence concepts
      const sentences = rawText
        .split(/(?<=[.?!])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 20);

      const keyTakeaways = sentences.slice(0, 4).map((s, idx) => {
        const cleaned = s.replace(/^[-*•\d.\s]+/, '');
        return cleaned.length > 120 ? cleaned.slice(0, 120) + '...' : cleaned;
      });

      if (keyTakeaways.length < 2) {
        keyTakeaways.push(`Core concepts covered in ${course || 'the course'} require review of key formulas & definitions.`);
        keyTakeaways.push(`Apply Active Recall flashcards to reinforce long-term memory storage.`);
      }

      // Infer dynamic tags based on keywords
      const tags: string[] = [course || 'General Study'];
      if (textUpper.includes('NEURAL') || textUpper.includes('GRADIENT') || textUpper.includes('LEARNING')) tags.push('AI & ML');
      if (textUpper.includes('MATRIX') || textUpper.includes('VECTOR') || textUpper.includes('EIGEN')) tags.push('Linear Algebra');
      if (textUpper.includes('TREE') || textUpper.includes('GRAPH') || textUpper.includes('ALGORITHM')) tags.push('Data Structures');
      if (textUpper.includes('PHYSICS') || textUpper.includes('ENERGY') || textUpper.includes('FORCE')) tags.push('Physics');

      return NextResponse.json({
        summary,
        keyTakeaways,
        tags: Array.from(new Set(tags)),
      });
    }

    // 2. Action: Convert Note to Flashcards
    if (action === 'convert_flashcards') {
      // Dynamic AI Flashcard generation from note text
      const lines = rawText.split('\n').filter((l) => l.trim().length > 15);
      const generatedCards = [];

      for (let i = 0; i < Math.min(4, lines.length); i++) {
        const line = lines[i].trim().replace(/^[-*•\d.\s]+/, '');
        let q = `What is the core principle behind: "${line.slice(0, 50)}..."?`;
        let a = line;
        
        if (line.includes(':')) {
          const parts = line.split(':');
          q = `Explain ${parts[0].trim()} as defined in ${title || 'the lecture notes'}.`;
          a = parts.slice(1).join(':').trim();
        } else if (line.includes('=')) {
          const parts = line.split('=');
          q = `What is the formula or value for ${parts[0].trim()}?`;
          a = `${parts[0].trim()} = ${parts[1].trim()}`;
        }

        generatedCards.push({
          id: `card-gen-${Date.now()}-${i}`,
          question: q,
          answer: a || line,
          topic: course || 'Active Recall',
          difficulty: i % 2 === 0 ? ('Medium' as const) : ('Hard' as const),
          easeFactor: 2.5,
          interval: 1,
          repetitions: 0,
          dueDate: new Date().toISOString(),
          mastered: false,
        });
      }

      return NextResponse.json({
        success: true,
        count: generatedCards.length,
        flashcards: generatedCards,
      });
    }

    // 3. Action: Convert Note to Quiz Questions
    if (action === 'convert_quiz') {
      const quizQuestions = [
        {
          id: `q-note-1`,
          question: `Based on the lecture notes on "${title}", what is the primary objective function or core mechanism?`,
          options: [
            `Minimizing discrepancy between predicted models and target values using exact gradient calculation`,
            `Directly converting floating point values into 8-bit integers without loss functions`,
            `Ignoring error residuals and maintaining static uniform weight distributions`,
            `Executing sequential linear scans without non-linear activations`,
          ],
          correctIndex: 0,
          explanation: `The notes highlight minimizing objective loss through gradient propagation and non-linear function updates.`,
        },
        {
          id: `q-note-2`,
          question: `Which key challenge or edge condition is explicitly addressed in ${course} notes?`,
          options: [
            `Infinite recursive call stack overflow on zero input arrays`,
            `Gradient vanishing/exploding issues, mitigated by non-linear activations or normalization`,
            `Hardware memory corruption during multi-threaded CPU context switches`,
            `Inability to calculate simple arithmetic matrix transposes`,
          ],
          correctIndex: 1,
          explanation: `Mitigating numerical instability (like gradient vanishing or tree imbalance) is a central takeaway of the lecture.`,
        },
        {
          id: `q-note-3`,
          question: `What time or space complexity bounds apply to the operations described in "${title}"?`,
          options: [
            `Exponential time O(2^n) under all circumstances`,
            `Optimal logarithmic O(log n) or polynomial O(n log n) efficiency bounds`,
            `Constant time O(1) regardless of dataset input dimension`,
            `Undefined non-deterministic execution bounds`,
          ],
          correctIndex: 1,
          explanation: `Efficient algorithmic and matrix operations strive for O(log n) or O(n log n) scaling bounds.`,
        },
        {
          id: `q-note-4`,
          question: `How does active recall from these notes improve long-term student retention?`,
          options: [
            `Rereading notes passively 10 minutes before the exam begins`,
            `Testing memory retrieval strength through 3D card flips and immediate practice quizzes`,
            `Copying text verbatim into external unindexed text files`,
            `Memorizing exact page formatting without understanding key mathematical derivations`,
          ],
          correctIndex: 1,
          explanation: `Active recall & spaced repetition force neural memory retrieval, yielding up to 3x memory retention versus passive reading.`,
        },
      ];

      return NextResponse.json({
        success: true,
        title: `Quiz: ${title}`,
        course: course || 'General Study',
        questions: quizQuestions,
      });
    }

    return NextResponse.json({ error: 'Invalid action requested.' }, { status: 400 });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
