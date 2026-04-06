export type ProviderType = 'openai' | 'anthropic' | 'xai' | 'coming-soon';

export type BackendModelConfig = {
  id: string;
  name: string;
  provider: string;
  providerType: ProviderType;
  apiModel?: string;
  enabled: boolean;
  comingSoon?: boolean;
};

export const MODEL_CONFIGS: BackendModelConfig[] = [
  {
    id: 'gpt-4.1',
    name: 'GPT-4.1',
    provider: 'OpenAI',
    providerType: 'openai',
    apiModel: 'gpt-4.1',
    enabled: true,
  },
  {
    id: 'gpt-4.1-mini',
    name: 'GPT-4.1 Mini',
    provider: 'OpenAI',
    providerType: 'openai',
    apiModel: 'gpt-4.1-mini',
    enabled: true,
  },
  {
    id: 'claude-sonnet',
    name: 'Claude Sonnet',
    provider: 'Anthropic',
    providerType: 'anthropic',
    apiModel: 'claude-sonnet-4-6',
    enabled: true,
  },
  {
    id: 'claude-haiku',
    name: 'Claude Haiku',
    provider: 'Anthropic',
    providerType: 'anthropic',
    apiModel: 'claude-haiku-4-5',
    enabled: true,
  },
  {
    id: 'grok',
    name: 'Grok',
    provider: 'xAI',
    providerType: 'xai',
    apiModel: 'grok-4.20-reasoning',
    enabled: true,
  },
  {
    id: 'grok-fast',
    name: 'Grok Fast',
    provider: 'xAI',
    providerType: 'coming-soon',
    enabled: false,
    comingSoon: true,
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    providerType: 'coming-soon',
    enabled: false,
    comingSoon: true,
  },
  {
    id: 'gemini-flash',
    name: 'Gemini Flash',
    provider: 'Google',
    providerType: 'coming-soon',
    enabled: false,
    comingSoon: true,
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral',
    providerType: 'coming-soon',
    enabled: false,
    comingSoon: true,
  },
  {
    id: 'cohere-command',
    name: 'Cohere Command',
    provider: 'Cohere',
    providerType: 'coming-soon',
    enabled: false,
    comingSoon: true,
  },
];

export const DEFAULT_MODELS = ['gpt-4.1-mini', 'claude-sonnet', 'grok'];
export const MAX_MODELS_PER_COMPARE = 3;