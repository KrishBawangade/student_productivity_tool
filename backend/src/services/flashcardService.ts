import { flashcardRepository } from '../repositories/flashcardRepository.js';
import { getGeminiClient } from '../config/ai.js';
import { Flashcard } from '../types/index.js';
import { DEFAULT_DEMO_USER_ID } from '../repositories/taskRepository.js';

export class FlashcardService {
  /**
   * Fetch all user-scoped flashcards with optional topic/mastered filters
   */
  public async getFlashcards(userId?: string, topic?: string, mastered?: boolean): Promise<Flashcard[]> {
    return flashcardRepository.findAll(userId, topic, mastered);
  }

  /**
   * Create a single manual flashcard tied to user
   */
  public async createFlashcard(cardData: {
    userId?: string;
    question: string;
    answer: string;
    topic?: string;
    codeSnippet?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
  }): Promise<Flashcard> {
    if (!cardData.question || !cardData.answer) {
      throw new Error('Fields "question" and "answer" are required');
    }

    return flashcardRepository.create({
      userId: cardData.userId || DEFAULT_DEMO_USER_ID,
      question: cardData.question.trim(),
      answer: cardData.answer.trim(),
      topic: cardData.topic ? cardData.topic.trim() : 'General',
      codeSnippet: cardData.codeSnippet ? cardData.codeSnippet.trim() : undefined,
      difficulty: cardData.difficulty || 'Medium',
      easeFactor: 2.5,
      interval: 1,
      repetitions: 0,
      dueDate: new Date().toISOString(),
      mastered: false,
    });
  }

  /**
   * Generate active-recall flashcards using Google Gemini AI for a specific user
   */
  public async generateFlashcardsWithAI(
    promptText: string,
    userId?: string,
    topicName?: string
  ): Promise<Flashcard[]> {
    if (!promptText || promptText.trim() === '') {
      throw new Error('Lecture text or topic prompt is required for AI generation');
    }

    const targetUserId = userId || DEFAULT_DEMO_USER_ID;
    const ai = getGeminiClient();
    const topic = topicName || 'Active Recall';

    if (!ai) {
      console.warn('⚠️ Gemini AI client unavailable. Generating fallback active-recall flashcards.');
      const fallbackCards = [
        {
          userId: targetUserId,
          question: `Key Concept from "${promptText.substring(0, 30)}...": Core Definition?`,
          answer: `The primary theoretical framework behind this topic emphasizes active synthesis, concept mapping, and practical application.`,
          topic,
          difficulty: 'Medium' as const,
        },
        {
          userId: targetUserId,
          question: `What are the top 2 practical applications of ${topic}?`,
          answer: `1. Accelerating memory retention through spaced interval testing.\n2. Streamlining revision for midterms and final exams.`,
          topic,
          difficulty: 'Easy' as const,
        },
      ];

      return flashcardRepository.createMany(fallbackCards.map((c) => ({ ...c, mastered: false })));
    }

    try {
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const systemPrompt = `You are an elite academic study coach and Active Recall expert.
Analyze the following lecture notes or study content and generate exactly 4-5 high-yield Active Recall Flashcards.

CRITICAL INSTRUCTION: Return ONLY raw, valid JSON with NO markdown formatting, NO \`\`\`json wrappers, and NO conversational text.

Required JSON Structure:
[
  {
    "question": "Clear, challenging question that tests deep understanding",
    "answer": "Concise, precise explanation with key formulas or bullet points if necessary",
    "difficulty": "Easy" | "Medium" | "Hard",
    "codeSnippet": "Optional code snippet or mathematical equation if relevant, otherwise omit"
  }
]

Lecture Content:
"${promptText.substring(0, 4000)}"`;

      const response = await model.generateContent(systemPrompt);
      const rawText = response.response.text().trim();

      const cleanedJson = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
      const parsedArray = JSON.parse(cleanedJson);

      if (!Array.isArray(parsedArray) || parsedArray.length === 0) {
        throw new Error('AI returned an invalid flashcard JSON format');
      }

      const formattedCards = parsedArray.map((card: any) => ({
        userId: targetUserId,
        question: String(card.question || 'Concept Question'),
        answer: String(card.answer || 'Concept Answer'),
        topic,
        codeSnippet: card.codeSnippet ? String(card.codeSnippet) : undefined,
        difficulty: (['Easy', 'Medium', 'Hard'].includes(card.difficulty) ? card.difficulty : 'Medium') as 'Easy' | 'Medium' | 'Hard',
        mastered: false,
      }));

      return flashcardRepository.createMany(formattedCards);
    } catch (error) {
      console.warn('⚠️ AI Flashcard Generation failed, using fallback cards:', (error as Error).message);
      const fallbackCards = [
        {
          userId: targetUserId,
          question: `Key Concept from "${promptText.substring(0, 30)}...": Core Definition?`,
          answer: `The primary theoretical framework behind this topic emphasizes active synthesis, concept mapping, and practical application.`,
          topic,
          difficulty: 'Medium' as const,
        },
        {
          userId: targetUserId,
          question: `What are the top 2 practical applications of ${topic}?`,
          answer: `1. Accelerating memory retention through spaced interval testing.\n2. Streamlining revision for midterms and final exams.`,
          topic,
          difficulty: 'Easy' as const,
        },
      ];

      return flashcardRepository.createMany(fallbackCards.map((c) => ({ ...c, mastered: false })));
    }
  }

  /**
   * Toggle mastered status
   */
  public async toggleMastered(id: string, mastered: boolean): Promise<{ card: Flashcard; xpAwarded: number }> {
    const existing = await flashcardRepository.findById(id);
    if (!existing) {
      throw new Error(`Flashcard with ID '${id}' not found`);
    }

    const updated = await flashcardRepository.update(id, { mastered });
    if (!updated) {
      throw new Error('Failed to update flashcard mastery');
    }

    const xpAwarded = mastered ? 75 : 0;

    return {
      card: updated,
      xpAwarded,
    };
  }

  /**
   * Delete flashcard
   */
  public async deleteFlashcard(id: string): Promise<boolean> {
    const existing = await flashcardRepository.findById(id);
    if (!existing) {
      throw new Error(`Flashcard with ID '${id}' not found`);
    }

    return flashcardRepository.delete(id);
  }
}

export const flashcardService = new FlashcardService();
