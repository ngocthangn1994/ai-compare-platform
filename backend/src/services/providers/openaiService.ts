import OpenAI from 'openai';
import { env } from '../../config/env';

const client = env.openaiApiKey ? new OpenAI({ apiKey: env.openaiApiKey }) : null;

type OpenAIImageInput = {
  mimeType: string;
  data: string;
};

type OpenAIQueryInput = {
  prompt: string;
  image?: OpenAIImageInput;
};

export async function queryOpenAI(
  input: string | OpenAIQueryInput,
  model: string
): Promise<string> {
  if (!client) {
    throw new Error('OpenAI API key not configured.');
  }

  const normalizedInput: OpenAIQueryInput =
    typeof input === 'string' ? { prompt: input } : input;

  const prompt = normalizedInput.prompt?.trim();

  if (!prompt) {
    throw new Error('Prompt is required for OpenAI request.');
  }

  const requestInput =
    normalizedInput.image
      ? [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: prompt,
              },
              {
                type: 'input_image',
                image_url: `data:${normalizedInput.image.mimeType};base64,${normalizedInput.image.data}`,
                detail: 'auto',
              },
            ],
          },
        ]
      : prompt;

  const response = await client.responses.create({
    model,
    input: requestInput as any,
  });

  const text = response.output_text?.trim();

  if (!text) {
    throw new Error('OpenAI returned an empty response.');
  }

  return text;
}