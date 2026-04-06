import OpenAI from 'openai';
import { env } from '../../config/env';

const client = env.xaiApiKey
  ? new OpenAI({
      apiKey: env.xaiApiKey,
      baseURL: 'https://api.x.ai/v1'
    })
  : null;

export async function queryXai(prompt: string, model: string): Promise<string> {
  if (!client) {
    throw new Error('xAI API key not configured.');
  }

  const response = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }]
  });

  const text = response.choices[0]?.message?.content?.trim();
  if (!text) {
    throw new Error('xAI returned an empty response.');
  }

  return text;
}