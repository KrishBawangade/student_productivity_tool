import { getPrismaClient } from '../config/db.js';
import { Flashcard } from '../types/index.js';
import { DEFAULT_DEMO_USER_ID } from './taskRepository.js';

// Fallback in-memory flashcard store
const mockFlashcardsStore: Flashcard[] = [
  {
    id: 'fc-1',
    userId: DEFAULT_DEMO_USER_ID,
    question: 'What is the primary difference between Active Recall and Passive Review?',
    answer: 'Active recall forces retrieval of information from memory without looking at notes, strengthening neural pathways and long-term retention compared to passive re-reading.',
    topic: 'Cognitive Science',
    difficulty: 'Medium',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    mastered: false,
  },
  {
    id: 'fc-2',
    userId: DEFAULT_DEMO_USER_ID,
    question: 'How does the SuperMemo SM-2 algorithm adjust the Ease Factor (EF)?',
    answer: 'EF\' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)), where q is the user recall quality rating (0-5). Minimum EF is 1.3.',
    topic: 'Algorithm Design',
    codeSnippet: 'EF_prime = Math.max(1.3, EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));',
    difficulty: 'Hard',
    easeFactor: 2.5,
    interval: 3,
    repetitions: 2,
    dueDate: new Date().toISOString(),
    mastered: true,
  },
  {
    id: 'fc-3',
    userId: DEFAULT_DEMO_USER_ID,
    question: 'What is Backpropagation in Neural Networks?',
    answer: 'An algorithm for supervised training that calculates the gradient of the loss function with respect to each weight by the chain rule, propagating errors backward.',
    topic: 'CS401 AI',
    difficulty: 'Hard',
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    dueDate: new Date().toISOString(),
    mastered: false,
  },
];

export class FlashcardRepository {
  /**
   * Fetch all user-scoped flashcards from Postgres or fallback store
   */
  public async findAll(
    userId?: string,
    topicFilter?: string,
    masteredFilter?: boolean
  ): Promise<Flashcard[]> {
    const targetUserId = userId || DEFAULT_DEMO_USER_ID;
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        const whereClause: any = { userId: targetUserId };
        if (topicFilter) whereClause.topic = topicFilter;
        if (masteredFilter !== undefined) whereClause.mastered = masteredFilter;

        const dbCards = await prisma.flashcard.findMany({
          where: whereClause,
          orderBy: { createdAt: 'desc' },
        });

        return dbCards.map((c) => ({
          id: c.id,
          userId: c.userId,
          question: c.question,
          answer: c.answer,
          topic: c.topic,
          codeSnippet: c.codeSnippet || undefined,
          difficulty: c.difficulty as 'Easy' | 'Medium' | 'Hard',
          easeFactor: c.easeFactor,
          interval: c.interval,
          repetitions: c.repetitions,
          dueDate: c.dueDate.toISOString(),
          mastered: c.mastered,
          createdAt: c.createdAt.toISOString(),
        }));
      } catch (error) {
        console.warn('⚠️ Postgres Flashcard query failed, using mock store fallback:', (error as Error).message);
      }
    }

    let cards = mockFlashcardsStore.filter((c) => !c.userId || c.userId === targetUserId);
    if (topicFilter) {
      cards = cards.filter((c) => c.topic.toLowerCase().includes(topicFilter.toLowerCase()));
    }
    if (masteredFilter !== undefined) {
      cards = cards.filter((c) => c.mastered === masteredFilter);
    }
    return cards;
  }

  /**
   * Find single flashcard by ID
   */
  public async findById(id: string): Promise<Flashcard | null> {
    const prisma = getPrismaClient();
    if (prisma) {
      try {
        const dbCard = await prisma.flashcard.findUnique({ where: { id } });
        if (dbCard) {
          return {
            id: dbCard.id,
            userId: dbCard.userId,
            question: dbCard.question,
            answer: dbCard.answer,
            topic: dbCard.topic,
            codeSnippet: dbCard.codeSnippet || undefined,
            difficulty: dbCard.difficulty as 'Easy' | 'Medium' | 'Hard',
            easeFactor: dbCard.easeFactor,
            interval: dbCard.interval,
            repetitions: dbCard.repetitions,
            dueDate: dbCard.dueDate.toISOString(),
            mastered: dbCard.mastered,
            createdAt: dbCard.createdAt.toISOString(),
          };
        }
      } catch (error) {
        console.warn('⚠️ Postgres findById flashcard failed, using mock store');
      }
    }

    return mockFlashcardsStore.find((c) => c.id === id) || null;
  }

  /**
   * Create a single user-scoped flashcard
   */
  public async create(cardData: Omit<Flashcard, 'id'> & { id?: string; userId?: string }): Promise<Flashcard> {
    const targetUserId = cardData.userId || DEFAULT_DEMO_USER_ID;
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        let user = await prisma.user.findUnique({ where: { id: targetUserId } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              id: targetUserId,
              email: `${targetUserId}@nexusacademia.edu`,
              name: 'Scholar Student',
              rankTitle: 'Academic Architect',
              level: 14,
              xp: 2450,
            },
          });
        }

        const created = await prisma.flashcard.create({
          data: {
            userId: user.id,
            question: cardData.question,
            answer: cardData.answer,
            topic: cardData.topic || 'General',
            codeSnippet: cardData.codeSnippet || null,
            difficulty: cardData.difficulty || 'Medium',
            easeFactor: cardData.easeFactor || 2.5,
            interval: cardData.interval || 1,
            repetitions: cardData.repetitions || 0,
            mastered: cardData.mastered || false,
          },
        });

        return {
          id: created.id,
          userId: created.userId,
          question: created.question,
          answer: created.answer,
          topic: created.topic,
          codeSnippet: created.codeSnippet || undefined,
          difficulty: created.difficulty as 'Easy' | 'Medium' | 'Hard',
          easeFactor: created.easeFactor,
          interval: created.interval,
          repetitions: created.repetitions,
          dueDate: created.dueDate.toISOString(),
          mastered: created.mastered,
          createdAt: created.createdAt.toISOString(),
        };
      } catch (error) {
        console.warn('⚠️ Postgres create flashcard failed, using mock store:', (error as Error).message);
      }
    }

    const newCard: Flashcard = {
      id: cardData.id || `fc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: targetUserId,
      question: cardData.question,
      answer: cardData.answer,
      topic: cardData.topic || 'General',
      codeSnippet: cardData.codeSnippet,
      difficulty: cardData.difficulty || 'Medium',
      easeFactor: cardData.easeFactor || 2.5,
      interval: cardData.interval || 1,
      repetitions: cardData.repetitions || 0,
      dueDate: new Date().toISOString(),
      mastered: cardData.mastered || false,
      createdAt: new Date().toISOString(),
    };

    mockFlashcardsStore.unshift(newCard);
    return newCard;
  }

  /**
   * Batch create flashcards for a specific user
   */
  public async createMany(cardsData: Array<Omit<Flashcard, 'id'> & { userId?: string }>): Promise<Flashcard[]> {
    const createdCards: Flashcard[] = [];
    for (const card of cardsData) {
      const created = await this.create(card);
      createdCards.push(created);
    }
    return createdCards;
  }

  /**
   * Update flashcard details
   */
  public async update(id: string, updates: Partial<Flashcard>): Promise<Flashcard | null> {
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        const updated = await prisma.flashcard.update({
          where: { id },
          data: {
            ...(updates.question && { question: updates.question }),
            ...(updates.answer && { answer: updates.answer }),
            ...(updates.topic && { topic: updates.topic }),
            ...(updates.codeSnippet !== undefined && { codeSnippet: updates.codeSnippet }),
            ...(updates.difficulty && { difficulty: updates.difficulty }),
            ...(updates.easeFactor !== undefined && { easeFactor: updates.easeFactor }),
            ...(updates.interval !== undefined && { interval: updates.interval }),
            ...(updates.repetitions !== undefined && { repetitions: updates.repetitions }),
            ...(updates.mastered !== undefined && { mastered: updates.mastered }),
          },
        });

        return {
          id: updated.id,
          userId: updated.userId,
          question: updated.question,
          answer: updated.answer,
          topic: updated.topic,
          codeSnippet: updated.codeSnippet || undefined,
          difficulty: updated.difficulty as 'Easy' | 'Medium' | 'Hard',
          easeFactor: updated.easeFactor,
          interval: updated.interval,
          repetitions: updated.repetitions,
          dueDate: updated.dueDate.toISOString(),
          mastered: updated.mastered,
          createdAt: updated.createdAt.toISOString(),
        };
      } catch (error) {
        console.warn('⚠️ Postgres update flashcard failed, using mock store');
      }
    }

    const index = mockFlashcardsStore.findIndex((c) => c.id === id);
    if (index === -1) return null;

    mockFlashcardsStore[index] = { ...mockFlashcardsStore[index], ...updates };
    return mockFlashcardsStore[index];
  }

  /**
   * Delete flashcard by ID
   */
  public async delete(id: string): Promise<boolean> {
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        await prisma.flashcard.delete({ where: { id } });
        return true;
      } catch (error) {
        console.warn('⚠️ Postgres delete flashcard failed, using mock store');
      }
    }

    const index = mockFlashcardsStore.findIndex((c) => c.id === id);
    if (index === -1) return false;

    mockFlashcardsStore.splice(index, 1);
    return true;
  }
}

export const flashcardRepository = new FlashcardRepository();
