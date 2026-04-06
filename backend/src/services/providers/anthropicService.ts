import Anthropic from '@anthropic-ai/sdk';
import { env } from '../../config/env';

const client = env.anthropicApiKey ? new Anthropic({ apiKey: env.anthropicApiKey }) : null;

export async function queryAnthropic(prompt: string, model: string): Promise<string> {
  if (!client) {
    throw new Error('Anthropic API key not configured.');
  }

  const response = await client.messages.create({
    model,
    max_tokens: 800,
    messages: [{ role: 'user', content: prompt }]
  });

  const text = response.content
    .map((item) => (item.type === 'text' ? item.text : ''))
    .join('')
    .trim();

  if (!text) {
    throw new Error('Anthropic returned an empty response.');
  }

  return text;
}