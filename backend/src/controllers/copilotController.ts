import { Request, Response, NextFunction } from 'express';
import { copilotService } from '../services/copilotService.js';

export class CopilotController {
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
   * POST /api/v1/copilot/chat
   * Interactive AI Study Assistant endpoint
   */
  public async chat(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { prompt, action, context } = req.body;
      const userId = this.extractUserId(req);

      if (!prompt || String(prompt).trim() === '') {
        res.status(400).json({
          success: false,
          error: 'Field "prompt" is required for AI Copilot chat',
        });
        return;
      }

      const result = await copilotService.handleChat({
        userId,
        prompt: String(prompt),
        action: action ? String(action) as any : 'custom',
        context: context ? String(context) : undefined,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/copilot/explain
   * Code snippet or formula concept explainer
   */
  public async explain(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { codeOrFormula, topic } = req.body;
      const userId = this.extractUserId(req);

      if (!codeOrFormula || String(codeOrFormula).trim() === '') {
        res.status(400).json({
          success: false,
          error: 'Field "codeOrFormula" is required for AI explanation',
        });
        return;
      }

      const result = await copilotService.handleChat({
        userId,
        prompt: `Explain this code or mathematical formula in detail:\n${String(codeOrFormula)}`,
        action: 'explain_5',
        context: topic ? `Topic: ${String(topic)}` : undefined,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const copilotController = new CopilotController();
