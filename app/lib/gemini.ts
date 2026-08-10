import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API client
const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const isGeminiConfigured = (): boolean => {
  return !!genAI && apiKey.length > 0;
};

/**
 * 1. AI Study Copilot Query Generator
 */
export async function generateCopilotResponse(
  prompt: string,
  mode: 'general' | 'eli5' | 'socratic' | 'formula' = 'general',
  documentContext?: string
): Promise<{ text: string; codeSnippet?: string }> {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      let systemInstruction = '';
      if (mode === 'eli5') {
        systemInstruction = 'You are a friendly AI tutor. Explain the concept using simple analogies, intuitive step-by-step examples as if explaining to a 12-year-old student.';
      } else if (mode === 'socratic') {
        systemInstruction = 'You are a Socratic study assistant. Do not give the direct answer immediately. Ask 3 guiding Socratic questions to help the student deduce the solution step-by-step.';
      } else if (mode === 'formula') {
        systemInstruction = 'You are a Mathematics & Science breakdown engine. Deconstruct the formula using KaTeX LaTeX notation ($$...$$ for block, $...$ for inline) and provide code snippets where relevant.';
      } else {
        systemInstruction = 'You are Nexus Copilot, an expert academic AI study assistant. Provide concise, clear, markdown-formatted explanations with equations or code snippets where applicable.';
      }

      const fullPrompt = `${systemInstruction}\n\n${
        documentContext ? `--- ATTACHED LECTURE DOCUMENT CONTEXT ---\n${documentContext}\n--- END CONTEXT ---\n\n` : ''
      }Student Query: ${prompt}`;

      const result = await model.generateContent(fullPrompt);
      const text = result.response.text();

      // Extract code block if present
      const codeMatch = text.match(/```(?:typescript|javascript|python|cpp|java)?\n([\s\S]*?)```/);
      const codeSnippet = codeMatch ? codeMatch[1].trim() : undefined;
      const cleanText = text.replace(/```(?:typescript|javascript|python|cpp|java)?\n[\s\S]*?```/g, '').trim();

      return {
        text: cleanText || text,
        codeSnippet,
      };
    } catch (error) {
      console.warn('Gemini API call failed, falling back to smart offline mode:', error);
    }
  }

  // Smart Offline Fallback Mode
  let fallbackText = '';
  let fallbackCode = '';

  if (mode === 'eli5') {
    fallbackText = `Imagine **${prompt}** is like a post office sorting system! Instead of checking every house one-by-one, the postman uses zip codes (indexing) to route letters directly to the right street in seconds. That's how it achieves high efficiency!`;
  } else if (mode === 'socratic') {
    fallbackText = `Let's analyze **${prompt}** together! 🤔\n\n1. What happens to execution time if input size $N$ quadruples?\n2. Which boundary condition prevents infinite recursion?\n3. How would you store intermediate results to prevent redundant recalculation?`;
  } else if (mode === 'formula') {
    fallbackText = `Mathematical Formula Breakdown for **${prompt}**:\n\n$$\\text{Loss} = -\\frac{1}{N} \\sum_{i=1}^{N} \\left[ y_i \\log(\\hat{y}_i) + (1-y_i) \\log(1-\\hat{y}_i) \\right]$$\n\n• $N$: Total number of training samples.\n• $y_i$: Binary ground-truth target (0 or 1).\n• $\\hat{y}_i$: Model output predicted probability.`;
    fallbackCode = `import numpy as np\n\ndef binary_cross_entropy(y_true, y_pred):\n    epsilon = 1e-15\n    y_pred = np.clip(y_pred, epsilon, 1 - epsilon)\n    return -np.mean(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))`;
  } else {
    fallbackText = `Here is a concise breakdown of **${prompt}**${documentContext ? ' based on your attached note' : ''}:\n\n1. **Core Mechanism:** Isolates key parameters and minimizes redundant operations.\n2. **Complexity:** Time complexity operates in $O(N \\log N)$ with $O(1)$ auxiliary space.\n3. **Practical Application:** Used in distributed databases, compiler passes, and machine learning pipelines.`;
    fallbackCode = `// Implementation Pattern\nfunction processData(items) {\n  const cache = new Map();\n  return items.map(item => {\n    if (cache.has(item)) return cache.get(item);\n    const computed = item * 2.5;\n    cache.set(item, computed);\n    return computed;\n  });\n}`;
  }

  return { text: fallbackText, codeSnippet: fallbackCode || undefined };
}

/**
 * 2. AI Flashcard Deck Generator
 */
export async function generateFlashcardsWithGemini(
  subject: string,
  topic: string,
  sourceText?: string,
  cardCount: number = 3
) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are an AI Active Recall Flashcard Generator. Create exactly ${cardCount} active recall study flashcards about "${topic}" (Course/Subject: ${subject || 'General'}). 
${sourceText ? `Base the flashcards on this text: "${sourceText}"` : ''}

Respond STRICTLY with a valid JSON array of objects. Do not include markdown code block formatting or backticks around the JSON array.
Each object must have the following fields:
- question: (string, clear active recall question)
- answer: (string, concise memory-retaining explanation)
- topic: (string, topic name)
- difficulty: (string: "Easy", "Medium", or "Hard")
- codeSnippet: (optional string if technical/mathematical)

JSON Array:`;

      const result = await model.generateContent(prompt);
      let rawJson = result.response.text().trim();
      // Clean potential JSON markdown blocks
      rawJson = rawJson.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();

      const parsedCards = JSON.parse(rawJson);
      if (Array.isArray(parsedCards) && parsedCards.length > 0) {
        return parsedCards.map((c, i) => ({
          id: `gen_gemini_${Date.now()}_${i}`,
          question: c.question || `Active Recall ${i + 1}`,
          answer: c.answer || 'Detailed answer.',
          topic: c.topic || subject || topic || 'General Study',
          codeSnippet: c.codeSnippet || undefined,
          difficulty: (c.difficulty === 'Easy' || c.difficulty === 'Hard') ? c.difficulty : 'Medium',
          easeFactor: 2.5,
          interval: 1,
          repetitions: 0,
          dueDate: new Date().toISOString(),
          mastered: false,
        }));
      }
    } catch (error) {
      console.warn('Gemini Flashcard API call failed, falling back to smart offline mode:', error);
    }
  }

  // Smart Offline Fallback Mode
  return [
    {
      id: `gen_offline_${Date.now()}_1`,
      question: `Core Principle of ${topic || 'Lecture Note'}: What is the primary objective?`,
      answer: sourceText 
        ? `Based on your note: "${sourceText.slice(0, 90)}..." it establishes structural balance and algorithmic efficiency.`
        : `The core principle of ${topic} focuses on optimizing memory, reducing time complexity, and ensuring systemic reliability.`,
      topic: subject || topic || 'General Study',
      codeSnippet: topic?.toLowerCase().includes('algorithm') || topic?.toLowerCase().includes('code') 
        ? `// Key logic pattern\nfunction executeProcess(data) {\n  return data.map(item => transform(item));\n}`
        : undefined,
      difficulty: 'Medium' as const,
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
      dueDate: new Date().toISOString(),
      mastered: false,
    },
    {
      id: `gen_offline_${Date.now()}_2`,
      question: `How does ${topic || 'this concept'} handle edge cases or failure modes?`,
      answer: `Edge cases are handled by fallback mechanisms, boundary validation, and constant factor time constraints to guarantee stability.`,
      topic: subject || topic || 'General Study',
      difficulty: 'Hard' as const,
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
      dueDate: new Date().toISOString(),
      mastered: false,
    },
    {
      id: `gen_offline_${Date.now()}_3`,
      question: `What real-world engineering or scientific application uses ${topic || 'this theorem'}?`,
      answer: `Used heavily in modern distributed databases, machine learning backpropagation pipelines, and high-frequency real-time processing systems.`,
      topic: subject || topic || 'General Study',
      difficulty: 'Easy' as const,
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
      dueDate: new Date().toISOString(),
      mastered: false,
    },
  ].slice(0, cardCount);
}

/**
 * 3. AI Quiz Generator
 */
export async function generateQuizWithGemini(
  topic: string,
  courseCode: string = 'CS401',
  sourceText?: string,
  questionCount: number = 4
) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Generate a ${questionCount}-question multiple-choice practice quiz about "${topic}" (Course: ${courseCode}).
${sourceText ? `Base the questions on this lecture text: "${sourceText}"` : ''}

Respond STRICTLY with a valid JSON array of question objects. No markdown backticks.
Each object must have:
- id: string
- question: string
- options: array of 4 strings
- correctIndex: number (0, 1, 2, or 3)
- explanation: string (explaining why the option is correct)

JSON Array:`;

      const result = await model.generateContent(prompt);
      let rawJson = result.response.text().trim();
      rawJson = rawJson.replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();

      const parsedQuestions = JSON.parse(rawJson);
      if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
        return parsedQuestions.map((q, i) => ({
          id: `qz_gemini_${Date.now()}_${i}`,
          question: q.question || `Question ${i + 1}`,
          options: Array.isArray(q.options) && q.options.length === 4 ? q.options : ['Option A', 'Option B', 'Option C', 'Option D'],
          correctIndex: typeof q.correctIndex === 'number' ? q.correctIndex : 0,
          explanation: q.explanation || 'Detailed explanation of the correct choice.',
        }));
      }
    } catch (error) {
      console.warn('Gemini Quiz API call failed, falling back to smart offline mode:', error);
    }
  }

  // Offline Fallback
  return [
    {
      id: `qz_off_${Date.now()}_1`,
      question: `What primary mathematical concept underpins ${topic}?`,
      options: [
        'Matrix multiplication and gradient descent updates',
        'Linear single-variable interpolation without loss',
        'Unconstrained quadratic programming solvers only',
        'Deterministic finite automaton state transitions'
      ],
      correctIndex: 0,
      explanation: 'Gradient descent computes loss derivatives with respect to weights, leveraging matrix transformations for batch updates.'
    },
    {
      id: `qz_off_${Date.now()}_2`,
      question: `Which scenario represents an optimal application of ${topic}?`,
      options: [
        'High-dimensional data processing requiring adaptive learning rates',
        'Static fixed-size string array lookups',
        'Single-threaded sequential file I/O operations',
        'Basic floating point addition routines'
      ],
      correctIndex: 0,
      explanation: 'Adaptive learning rates prevent exploding or vanishing gradients during high-dimensional parameter optimization.'
    },
    {
      id: `qz_off_${Date.now()}_3`,
      question: `What happens when the regularizing parameter is set excessively high during ${topic}?`,
      options: [
        'Underfitting occurs as weights are penalized towards zero',
        'Overfitting increases rapidly with zero loss on test data',
        'The learning rate automatically scales to infinity',
        'Memory allocation crashes due to heap stack overflow'
      ],
      correctIndex: 0,
      explanation: 'Excessive regularization heavily penalizes weight magnitudes, restricting model capacity and causing underfitting.'
    },
    {
      id: `qz_off_${Date.now()}_4`,
      question: `In practical engineering, how do you verify convergence during ${topic}?`,
      options: [
        'Monitoring validation loss plateau over successive epochs',
        'Checking if total CPU core temperature stays below 60°C',
        'Verifying that all output vectors contain strictly prime numbers',
        'Counting total lines of written TypeScript code'
      ],
      correctIndex: 0,
      explanation: 'Validation loss plateauing indicates the model has reached optimal weights without further statistical improvement.'
    }
  ].slice(0, questionCount);
}

/**
 * 4. AI Note Actions (Summarize, Convert to Flashcards, Convert to Quiz)
 */
export async function summarizeNoteWithGemini(
  title: string,
  course: string,
  rawText: string,
  action: 'summarize' | 'convert_flashcards' | 'convert_quiz'
) {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      if (action === 'summarize') {
        const prompt = `Summarize the following lecture note titled "${title}" (${course}):
"${rawText}"

Respond STRICTLY with a valid JSON object:
{
  "summary": "2-3 sentence executive summary",
  "keyTakeaways": ["takeaway 1", "takeaway 2", "takeaway 3"],
  "tags": ["tag1", "tag2"]
}
JSON Object:`;
        const res = await model.generateContent(prompt);
        let text = res.response.text().trim().replace(/^```json/i, '').replace(/^```/, '').replace(/```$/, '').trim();
        return JSON.parse(text);
      }

      if (action === 'convert_flashcards') {
        const cards = await generateFlashcardsWithGemini(course, title || 'Lecture Note', rawText, 4);
        return { success: true, count: cards.length, flashcards: cards };
      }

      if (action === 'convert_quiz') {
        const questions = await generateQuizWithGemini(title || 'Lecture Note', course, rawText, 4);
        return { success: true, title: `Quiz: ${title}`, course: course || 'General Study', questions };
      }
    } catch (error) {
      console.warn('Gemini Note API call failed, falling back to smart offline mode:', error);
    }
  }

  // Fallback
  if (action === 'summarize') {
    return {
      summary: `Executive Summary of ${title || 'Lecture Note'}: Focuses on key structural principles, mathematical relationships, and computational efficiency in ${course || 'the course'}.`,
      keyTakeaways: [
        `Core mechanism optimizes state updates and minimizes objective loss.`,
        `Mitigates edge cases such as numeric instability or resource bottlenecking.`,
        `Reinforce concepts through Active Recall flashcards & practice test questions.`,
      ],
      tags: [course || 'General Study', 'Active Recall'],
    };
  }

  if (action === 'convert_flashcards') {
    const cards = await generateFlashcardsWithGemini(course, title || 'Lecture Note', rawText, 4);
    return { success: true, count: cards.length, flashcards: cards };
  }

  const questions = await generateQuizWithGemini(title || 'Lecture Note', course, rawText, 4);
  return { success: true, title: `Quiz: ${title}`, course: course || 'General Study', questions };
}
