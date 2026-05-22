import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env.js';

// Initialize the Google Generative AI client using the environment API key
export const genAI = new GoogleGenerativeAI(
  env.GEMINI_API_KEY || 'dummy_api_key_for_scaffolding'
);

export default genAI;
