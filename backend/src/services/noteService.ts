import { noteRepository } from '../repositories/noteRepository.js';
import { NoteItem } from '../types/index.js';
import { getGeminiClient } from '../config/ai.js';

export interface AISummarizePayload {
  rawText: string;
  title?: string;
  course?: string;
}

export interface AISummarizeResponse {
  summary: string;
  keyTakeaways: string[];
  tags: string[];
  model: string;
}

export class NoteService {
  /**
   * Fetch all user notes with optional filtering
   */
  public async getAllNotes(
    userId?: string,
    courseFilter?: string,
    tagFilter?: string
  ): Promise<NoteItem[]> {
    return noteRepository.findAll(userId, courseFilter, tagFilter);
  }

  /**
   * Find single note by ID
   */
  public async getNoteById(id: string): Promise<NoteItem | null> {
    return noteRepository.findById(id);
  }

  /**
   * Create a new note item
   */
  public async createNote(
    noteData: Omit<NoteItem, 'id'> & { id?: string; userId?: string }
  ): Promise<NoteItem> {
    if (!noteData.title || noteData.title.trim() === '') {
      throw new Error('Field "title" is required when creating a note');
    }
    return noteRepository.create(noteData);
  }

  /**
   * Update an existing note item
   */
  public async updateNote(id: string, updates: Partial<NoteItem>): Promise<NoteItem | null> {
    const existing = await noteRepository.findById(id);
    if (!existing) {
      return null;
    }
    return noteRepository.update(id, updates);
  }

  /**
   * Delete a note item by ID
   */
  public async deleteNote(id: string): Promise<boolean> {
    const existing = await noteRepository.findById(id);
    if (!existing) {
      return false;
    }
    return noteRepository.delete(id);
  }

  /**
   * Generate automatic summary, key takeaways, and tags using Google Gemini AI
   */
  public async summarizeNoteWithAI(payload: AISummarizePayload): Promise<AISummarizeResponse> {
    if (!payload.rawText || payload.rawText.trim() === '') {
      throw new Error('Field "rawText" is required for AI note summarization');
    }

    const ai = getGeminiClient();

    if (!ai) {
      console.warn('⚠️ Gemini AI client unavailable. Returning fallback note summary.');
      return this.getFallbackSummary(payload.rawText, payload.title);
    }

    try {
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are an academic AI assistant. Analyze the following lecture notes and generate a concise summary, top key takeaways, and relevant tags.

Lecture Note Title: ${payload.title || 'Untitled Note'}
Course Context: ${payload.course || 'General'}

Raw Lecture Notes:
"""
${payload.rawText}
"""

Return ONLY a valid JSON object matching this exact schema:
{
  "summary": "A 2-3 sentence clear, high-level summary of the main points.",
  "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3", "Takeaway 4"],
  "tags": ["Tag1", "Tag2", "Tag3"]
}
Do NOT wrap the output in markdown code blocks like \`\`\`json. Output raw JSON only.`;

      const response = await model.generateContent(prompt);
      let responseText = response.response.text().trim();

      // Clean markdown code blocks if model included them
      if (responseText.startsWith('```')) {
        responseText = responseText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
      }

      const parsed = JSON.parse(responseText);

      return {
        summary: parsed.summary || 'Summary generated from lecture notes.',
        keyTakeaways: Array.isArray(parsed.keyTakeaways) ? parsed.keyTakeaways : [],
        tags: Array.isArray(parsed.tags) ? parsed.tags : ['Lecture Notes'],
        model: 'gemini-1.5-flash',
      };
    } catch (error) {
      console.error('❌ Gemini Note Summarizer Error:', (error as Error).message);
      return this.getFallbackSummary(payload.rawText, payload.title);
    }
  }

  private getFallbackSummary(rawText: string, title?: string): AISummarizeResponse {
    const words = rawText.split(/\s+/).slice(0, 30).join(' ');
    return {
      summary: `Structured academic overview for "${title || 'Lecture Note'}": ${words}...`,
      keyTakeaways: [
        'Active recall strengthens long-term memory retrieval pathways',
        'Break down raw lecture concepts into core principles and formulas',
        'Review key definitions before test prep sessions'
      ],
      tags: ['Study Notes', 'Academic', 'Summary'],
      model: 'fallback-offline-summarizer',
    };
  }
}

export const noteService = new NoteService();
