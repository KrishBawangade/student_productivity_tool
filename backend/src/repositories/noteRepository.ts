import { getPrismaClient } from '../config/db.js';
import { NoteItem } from '../types/index.js';
import { DEFAULT_DEMO_USER_ID } from './taskRepository.js';

function safeParseJsonArray(val: string): string[] {
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Fallback in-memory notes store
const mockNotesStore: NoteItem[] = [
  {
    id: 'note-1',
    userId: DEFAULT_DEMO_USER_ID,
    title: 'Lecture 7: Backpropagation & Neural Optimization',
    course: 'CS401 AI',
    rawText: `Backpropagation calculates the gradient of the loss function with respect to each weight using the chain rule. Stochastic Gradient Descent (SGD) with momentum accelerates gradient vectors in the right direction, reducing oscillations. Learning rate scheduling decays the step size to ensure convergence to global minima.`,
    summary: `Structured overview of neural network optimization covering backpropagation calculus, SGD momentum mechanics, and decay scheduling for loss convergence.`,
    keyTakeaways: [
      'Chain rule enables layer-by-layer gradient computation',
      'Momentum reduces SGD oscillations in steep ravines',
      'Learning rate decay prevents overshooting global minima'
    ],
    tags: ['Machine Learning', 'Neural Networks', 'Calculus', 'Optimization'],
    generatedFlashcardsCount: 5,
    generatedQuizCount: 3,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'note-2',
    userId: DEFAULT_DEMO_USER_ID,
    title: 'Cognitive Load Theory & Spaced Repetition Mechanics',
    course: 'COGS201',
    rawText: `Working memory has a limited capacity of approximately 4-7 chunks of information. Active recall forces memory retrieval, which strengthens synaptic connections. The SuperMemo SM-2 algorithm calculates repetition intervals based on user recall quality ratings (0-5) and an Ease Factor (EF).`,
    summary: `Cognitive psychology notes explaining working memory limits, active recall mechanics, and algorithmic implementation of SM-2 spaced repetition.`,
    keyTakeaways: [
      'Working memory limits dictate optimal study chunking',
      'Active retrieval strengthens synaptic plasticity',
      'SM-2 adjusts ease factors dynamically based on recall quality'
    ],
    tags: ['Cognitive Science', 'Active Recall', 'Memory', 'Study Systems'],
    generatedFlashcardsCount: 3,
    generatedQuizCount: 2,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export class NoteRepository {
  /**
   * Fetch user-scoped notes with optional course or tag filter
   */
  public async findAll(
    userId?: string,
    courseFilter?: string,
    tagFilter?: string
  ): Promise<NoteItem[]> {
    const targetUserId = userId || DEFAULT_DEMO_USER_ID;
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        const whereClause: any = { userId: targetUserId };
        if (courseFilter) whereClause.course = courseFilter;

        const dbNotes = await prisma.noteItem.findMany({
          where: whereClause,
          orderBy: { updatedAt: 'desc' },
        });

        let notes: NoteItem[] = dbNotes.map((n) => ({
          id: n.id,
          userId: n.userId,
          title: n.title,
          course: n.course,
          rawText: n.rawText,
          summary: n.summary,
          keyTakeaways: safeParseJsonArray(n.keyTakeaways),
          tags: safeParseJsonArray(n.tags),
          generatedFlashcardsCount: n.generatedFlashcardsCount,
          generatedQuizCount: n.generatedQuizCount,
          createdAt: n.createdAt.toISOString(),
          updatedAt: n.updatedAt.toISOString(),
        }));

        if (tagFilter) {
          notes = notes.filter((n) =>
            n.tags.some((t) => t.toLowerCase().includes(tagFilter.toLowerCase()))
          );
        }

        return notes;
      } catch (error) {
        console.warn('⚠️ Postgres NoteItem query failed, using mock store fallback:', (error as Error).message);
      }
    }

    let notes = mockNotesStore.filter((n) => !n.userId || n.userId === targetUserId);
    if (courseFilter) {
      notes = notes.filter((n) => n.course.toLowerCase().includes(courseFilter.toLowerCase()));
    }
    if (tagFilter) {
      notes = notes.filter((n) =>
        n.tags.some((t) => t.toLowerCase().includes(tagFilter.toLowerCase()))
      );
    }
    return notes;
  }

  /**
   * Find single note item by ID
   */
  public async findById(id: string): Promise<NoteItem | null> {
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        const n = await prisma.noteItem.findUnique({ where: { id } });
        if (n) {
          return {
            id: n.id,
            userId: n.userId,
            title: n.title,
            course: n.course,
            rawText: n.rawText,
            summary: n.summary,
            keyTakeaways: safeParseJsonArray(n.keyTakeaways),
            tags: safeParseJsonArray(n.tags),
            generatedFlashcardsCount: n.generatedFlashcardsCount,
            generatedQuizCount: n.generatedQuizCount,
            createdAt: n.createdAt.toISOString(),
            updatedAt: n.updatedAt.toISOString(),
          };
        }
      } catch (error) {
        console.warn('⚠️ Postgres findById NoteItem failed, using mock store');
      }
    }

    return mockNotesStore.find((n) => n.id === id) || null;
  }

  /**
   * Create a new note item
   */
  public async create(noteData: Omit<NoteItem, 'id'> & { id?: string; userId?: string }): Promise<NoteItem> {
    const targetUserId = noteData.userId || DEFAULT_DEMO_USER_ID;
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

        const created = await prisma.noteItem.create({
          data: {
            userId: user.id,
            title: noteData.title,
            course: noteData.course || 'General',
            rawText: noteData.rawText || '',
            summary: noteData.summary || '',
            keyTakeaways: JSON.stringify(noteData.keyTakeaways || []),
            tags: JSON.stringify(noteData.tags || []),
            generatedFlashcardsCount: noteData.generatedFlashcardsCount || 0,
            generatedQuizCount: noteData.generatedQuizCount || 0,
          },
        });

        return {
          id: created.id,
          userId: created.userId,
          title: created.title,
          course: created.course,
          rawText: created.rawText,
          summary: created.summary,
          keyTakeaways: safeParseJsonArray(created.keyTakeaways),
          tags: safeParseJsonArray(created.tags),
          generatedFlashcardsCount: created.generatedFlashcardsCount,
          generatedQuizCount: created.generatedQuizCount,
          createdAt: created.createdAt.toISOString(),
          updatedAt: created.updatedAt.toISOString(),
        };
      } catch (error) {
        console.warn('⚠️ Postgres create NoteItem failed, using mock store:', (error as Error).message);
      }
    }

    const now = new Date().toISOString();
    const newNote: NoteItem = {
      id: noteData.id || `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: targetUserId,
      title: noteData.title,
      course: noteData.course || 'General',
      rawText: noteData.rawText || '',
      summary: noteData.summary || '',
      keyTakeaways: noteData.keyTakeaways || [],
      tags: noteData.tags || [],
      generatedFlashcardsCount: noteData.generatedFlashcardsCount || 0,
      generatedQuizCount: noteData.generatedQuizCount || 0,
      createdAt: now,
      updatedAt: now,
    };

    mockNotesStore.unshift(newNote);
    return newNote;
  }

  /**
   * Update an existing note item
   */
  public async update(id: string, updates: Partial<NoteItem>): Promise<NoteItem | null> {
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        const updateData: any = {};
        if (updates.title !== undefined) updateData.title = updates.title;
        if (updates.course !== undefined) updateData.course = updates.course;
        if (updates.rawText !== undefined) updateData.rawText = updates.rawText;
        if (updates.summary !== undefined) updateData.summary = updates.summary;
        if (updates.keyTakeaways !== undefined) updateData.keyTakeaways = JSON.stringify(updates.keyTakeaways);
        if (updates.tags !== undefined) updateData.tags = JSON.stringify(updates.tags);
        if (updates.generatedFlashcardsCount !== undefined)
          updateData.generatedFlashcardsCount = updates.generatedFlashcardsCount;
        if (updates.generatedQuizCount !== undefined)
          updateData.generatedQuizCount = updates.generatedQuizCount;

        const updated = await prisma.noteItem.update({
          where: { id },
          data: updateData,
        });

        return {
          id: updated.id,
          userId: updated.userId,
          title: updated.title,
          course: updated.course,
          rawText: updated.rawText,
          summary: updated.summary,
          keyTakeaways: safeParseJsonArray(updated.keyTakeaways),
          tags: safeParseJsonArray(updated.tags),
          generatedFlashcardsCount: updated.generatedFlashcardsCount,
          generatedQuizCount: updated.generatedQuizCount,
          createdAt: updated.createdAt.toISOString(),
          updatedAt: updated.updatedAt.toISOString(),
        };
      } catch (error) {
        console.warn('⚠️ Postgres update NoteItem failed, using mock store');
      }
    }

    const index = mockNotesStore.findIndex((n) => n.id === id);
    if (index === -1) return null;

    mockNotesStore[index] = {
      ...mockNotesStore[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockNotesStore[index];
  }

  /**
   * Delete note item by ID
   */
  public async delete(id: string): Promise<boolean> {
    const prisma = getPrismaClient();

    if (prisma) {
      try {
        await prisma.noteItem.delete({ where: { id } });
        return true;
      } catch (error) {
        console.warn('⚠️ Postgres delete NoteItem failed, using mock store');
      }
    }

    const index = mockNotesStore.findIndex((n) => n.id === id);
    if (index === -1) return false;

    mockNotesStore.splice(index, 1);
    return true;
  }
}

export const noteRepository = new NoteRepository();
