import OpenAI from 'openai';
import { env } from '../../config/env';

const client = env.openaiApiKey ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

export async function queryOpenAI(prompt: string, model: string): Promise<string> {
  if (!client) {
    throw new Error('OpenAI API key not configured.');
  }

  const response = await client.responses.create({
    model,
    input: prompt
  });

  const text = response.output_text?.trim();
  if (!text) {
    throw new Error('OpenAI returned an empty response.');
  }

  return text;
}