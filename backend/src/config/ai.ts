import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './env.js';

let genAI: GoogleGenerativeAI | null = null;

export function getGeminiClient(): GoogleGenerativeAI | null {
  if (!env.GEMINI_API_KEY) {
    console.warn('⚠️ GEMINI_API_KEY is missing in backend .env file. AI features will fallback to default responses.');
    return null;
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
  }

  return genAI;
}
