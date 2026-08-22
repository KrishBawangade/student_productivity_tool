import { Request, Response, NextFunction } from 'express';
import { noteService } from '../services/noteService.js';

export class NoteController {
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
   * GET /api/v1/notes
   * Fetch all user notes (supports ?course=... or ?tag=...)
   */
  public async getNotes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const courseFilter = req.query.course ? String(req.query.course) : undefined;
      const tagFilter = req.query.tag ? String(req.query.tag) : undefined;

      const notes = await noteService.getAllNotes(userId, courseFilter, tagFilter);

      res.status(200).json({
        success: true,
        data: notes,
        count: notes.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/notes/:id
   * Fetch single note item by ID
   */
  public async getNoteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const note = await noteService.getNoteById(id);

      if (!note) {
        res.status(404).json({
          success: false,
          error: `Note item with ID "${id}" not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: note,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/notes
   * Create a new note item
   */
  public async createNote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = this.extractUserId(req);
      const noteData = { ...req.body, userId: userId || req.body?.userId };

      const created = await noteService.createNote(noteData);

      res.status(201).json({
        success: true,
        data: created,
        message: 'Note created successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: (error as Error).message,
      });
    }
  }

  /**
   * POST /api/v1/notes/summarize
   * AI Summarizer endpoint powered by Google Gemini
   */
  public async summarizeNote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { rawText, title, course } = req.body;

      if (!rawText || typeof rawText !== 'string') {
        res.status(400).json({
          success: false,
          error: 'Field "rawText" must be a non-empty string',
        });
        return;
      }

      const summaryResult = await noteService.summarizeNoteWithAI({
        rawText,
        title,
        course,
      });

      res.status(200).json({
        success: true,
        data: summaryResult,
        message: 'AI Summary generated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/notes/:id
   * Update an existing note item
   */
  public async updateNote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const updated = await noteService.updateNote(id, req.body);

      if (!updated) {
        res.status(404).json({
          success: false,
          error: `Note item with ID "${id}" not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updated,
        message: 'Note updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/notes/:id
   * Delete a note item
   */
  public async deleteNote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = String(req.params.id);
      const deleted = await noteService.deleteNote(id);

      if (!deleted) {
        res.status(404).json({
          success: false,
          error: `Note item with ID "${id}" not found`,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: `Note item "${id}" deleted successfully`,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const noteController = new NoteController();
