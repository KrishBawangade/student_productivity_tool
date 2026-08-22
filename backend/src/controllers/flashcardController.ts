import { Request, Response, NextFunction } from 'express';
import { flashcardService } from '../services/flashcardService.js';
import { flashcardRepository } from '../repositories/flashcardRepository.js';

export class FlashcardController {
  /**
   * Helper to extract userId from headers, query parameter, or body
   */
  private extractUserId(req: Request): string | undefined {
    const headerUserId = req.headers['x-user-id'];
    if (headerUserId) return String(headerUserId);

    const queryUserId = req.query.userId;
    if (queryUserId) return String(queryUserId);

    const bodyUserId = req.body?.userId;
    if (bodyUserId) return String(bodyUserId);

    return undefined;
  }

  /**
   * GET /api/v1/flashcards
   * Fetch user-scoped flashcards
   */
  public async getFlashcards(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { topic, mastered } = req.query;
      const userId = this.extractUserId(req);

      const topicFilter = topic ? String(topic) : undefined;
      const masteredFilter = mastered !== undefined ? String(mastered) === 'true' : undefined;

      const cards = await flashcardService.getFlashcards(userId, topicFilter, masteredFilter);

      res.status(200).json({
        success: true,
        data: cards,
        count: cards.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/flashcards/:id
   * Fetch single flashcard by ID
   */
  public async getFlashcardById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const card = await flashcardRepository.findById(id);

      if (!card) {
        res.status(404).json({
          success: false,
          error: `Flashcard with ID '${id}' not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: card,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/flashcards
   * Create a single manual flashcard tied to user ID
   */
  public async createFlashcard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { question, answer, topic, difficulty, codeSnippet } = req.body;
      const userId = this.extractUserId(req);

      if (!question || !answer) {
        res.status(400).json({
          success: false,
          error: 'Fields "question" and "answer" are required',
        });
        return;
      }

      const newCard = await flashcardService.createFlashcard({
        userId,
        question: String(question),
        answer: String(answer),
        topic: topic ? String(topic) : undefined,
        difficulty: difficulty ? (String(difficulty) as 'Easy' | 'Medium' | 'Hard') : undefined,
        codeSnippet: codeSnippet ? String(codeSnippet) : undefined,
      });

      res.status(201).json({
        success: true,
        data: newCard,
        message: 'Flashcard created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/flashcards/generate
   * AI Endpoint: Generate Active-Recall Flashcards using Google Gemini AI for user
   */
  public async generateFlashcards(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { promptText, topic } = req.body;
      const userId = this.extractUserId(req);

      if (!promptText || String(promptText).trim() === '') {
        res.status(400).json({
          success: false,
          error: 'Field "promptText" is required for AI flashcard generation',
        });
        return;
      }

      const generatedCards = await flashcardService.generateFlashcardsWithAI(
        String(promptText),
        userId,
        topic ? String(topic) : undefined
      );

      res.status(201).json({
        success: true,
        data: generatedCards,
        count: generatedCards.length,
        message: `Successfully generated ${generatedCards.length} AI active recall flashcards`,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/flashcards/:id
   * Update flashcard details or mastery status
   */
  public async updateFlashcard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const { mastered, ...updates } = req.body;

      if (mastered !== undefined) {
        const result = await flashcardService.toggleMastered(id, Boolean(mastered));
        res.status(200).json({
          success: true,
          data: result.card,
          xpAwarded: result.xpAwarded,
          message: mastered ? 'Flashcard marked as Mastered (+75 XP)' : 'Flashcard reset to Review',
        });
        return;
      }

      const updatedCard = await flashcardRepository.update(id, updates);
      if (!updatedCard) {
        res.status(404).json({
          success: false,
          error: `Flashcard with ID '${id}' not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedCard,
        message: 'Flashcard updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/flashcards/:id
   * Delete flashcard by ID
   */
  public async deleteFlashcard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      await flashcardService.deleteFlashcard(id);

      res.status(200).json({
        success: true,
        message: `Flashcard '${id}' deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const flashcardController = new FlashcardController();
