import { ModelOption } from '@/types';

export const MODEL_OPTIONS: ModelOption[] = [
  { id: 'gpt-4.1', name: 'GPT-4.1', provider: 'OpenAI', enabled: true },
  { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'OpenAI', enabled: true },
  { id: 'claude-sonnet', name: 'Claude Sonnet', provider: 'Anthropic', enabled: true },
  { id: 'claude-haiku', name: 'Claude Haiku', provider: 'Anthropic', enabled: false, comingSoon: true },
  { id: 'grok', name: 'Grok', provider: 'xAI', enabled: true },
  { id: 'grok-fast', name: 'Grok Fast', provider: 'xAI', enabled: false, comingSoon: true },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', enabled: false, comingSoon: true },
  { id: 'gemini-flash', name: 'Gemini Flash', provider: 'Google', enabled: false, comingSoon: true },
  { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral', enabled: false, comingSoon: true },
  { id: 'cohere-command', name: 'Cohere Command', provider: 'Cohere', enabled: false, comingSoon: true }
];

export const DEFAULT_MODEL_IDS = ['gpt-4.1-mini', 'claude-sonnet', 'grok'];