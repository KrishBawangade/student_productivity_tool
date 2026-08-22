import { getGeminiClient } from '../config/ai.js';

export interface CopilotChatPayload {
  userId?: string;
  prompt: string;
  action?: 'explain_5' | 'summarize' | 'practice_questions' | 'custom';
  context?: string;
}

export interface CopilotChatResponse {
  reply: string;
  actionUsed: string;
  model: string;
  timestamp: string;
}

export class CopilotService {
  /**
   * Send prompt to Google Gemini AI Study Copilot
   */
  public async handleChat(payload: CopilotChatPayload): Promise<CopilotChatResponse> {
    if (!payload.prompt || payload.prompt.trim() === '') {
      throw new Error('Field "prompt" is required for AI Copilot chat');
    }

    const ai = getGeminiClient();
    const action = payload.action || 'custom';

    if (!ai) {
      console.warn('⚠️ Gemini AI client unavailable. Returning fallback study copilot response.');
      return {
        reply: this.getFallbackReply(payload.prompt, action),
        actionUsed: action,
        model: 'fallback-offline-copilot',
        timestamp: new Date().toISOString(),
      };
    }

    try {
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

      let instructionPrefix = '';
      switch (action) {
        case 'explain_5':
          instructionPrefix = 'Explain the following concept like I am a 5-year-old child using simple analogies, clear bullet points, and fun examples:\n';
          break;
        case 'summarize':
          instructionPrefix = 'Provide a structured academic summary with key takeaways, definitions, and core formulas for:\n';
          break;
        case 'practice_questions':
          instructionPrefix = 'Generate 5 high-yield exam practice questions with detailed solution answers for:\n';
          break;
        default:
          instructionPrefix = 'You are Nexus Copilot, an elite AI study assistant. Help the student with:\n';
      }

      const fullPrompt = `${instructionPrefix}\n"${payload.prompt}"\n\n${
        payload.context ? `Additional Study Context:\n${payload.context}` : ''
      }\n\nFormatting: Use clear Markdown, code blocks if code is involved, and LaTeX formatting (e.g. $E=mc^2$) for math formulas.`;

      const response = await model.generateContent(fullPrompt);
      const replyText = response.response.text();

      return {
        reply: replyText,
        actionUsed: action,
        model: 'gemini-1.5-flash',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('❌ Gemini Copilot Error:', error);
      return {
        reply: this.getFallbackReply(payload.prompt, action),
        actionUsed: action,
        model: 'fallback-error-copilot',
        timestamp: new Date().toISOString(),
      };
    }
  }

  private getFallbackReply(prompt: string, action: string): string {
    return `### 🤖 Nexus Copilot (Study Assist)

Here is the structured study breakdown for your query **"${prompt}"**:

1. **Core Concept:** Active learning and spaced repetition significantly boost long-term memory retention.
2. **Key Strategy:** Break down complex topics into 25-minute Pomodoro study blocks.
3. **Exam Tip:** Practice retrieving formulas actively without looking at reference notes.

*(Note: Connect your \`GEMINI_API_KEY\` in \`backend/.env\` to enable live LLM generative streaming responses!)*`;
  }
}

export const copilotService = new CopilotService();
