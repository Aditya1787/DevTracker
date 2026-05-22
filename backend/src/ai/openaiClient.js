import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env.js';

// Initialize the Anthropic (Claude) client using the environment API key
export const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY || 'dummy_api_key_for_scaffolding'
});

export default anthropic;
