import { MODEL_CONFIGS } from '../config/models';
import {
  calculateOverallScore,
  generateScoreBreakdown,
  ScoreBreakdown
} from './scoringService';
import { queryOpenAI } from './providers/openaiService';
import { queryAnthropic } from './providers/anthropicService';
import { queryXai } from './providers/xaiService';

export type NormalizedResult = {
  provider: string;
  model: string;
  modelId: string;
  content: string;
  latencyMs: number;
  scoreBreakdown: ScoreBreakdown;
  overallScore: number;
  isWinner: boolean;
  isFastest?: boolean;
  error?: string;
};

type ComparisonInput = {
  prompt: string;
};

async function queryProvider(input: ComparisonInput, modelId: string): Promise<NormalizedResult> {
  const modelConfig = MODEL_CONFIGS.find((model) => model.id === modelId);

  if (!modelConfig) {
    throw new Error(`Model not found: ${modelId}`);
  }

  if (!modelConfig.enabled || modelConfig.providerType === 'coming-soon') {
    throw new Error(`Model not enabled: ${modelId}`);
  }

  const startedAt = Date.now();
  const finalPrompt = input.prompt.trim();

  try {
    let content = '';

    if (modelConfig.providerType === 'openai') {
      content = await queryOpenAI(finalPrompt, modelConfig.apiModel!);
    } else if (modelConfig.providerType === 'anthropic') {
      content = await queryAnthropic(finalPrompt, modelConfig.apiModel!);
    } else if (modelConfig.providerType === 'xai') {
      content = await queryXai(finalPrompt, modelConfig.apiModel!);
    } else {
      throw new Error(`Unsupported provider type: ${modelConfig.providerType}`);
    }

    const latencyMs = Date.now() - startedAt;
    const safeContent = content?.trim() || 'No response returned.';
    const scoreBreakdown = generateScoreBreakdown(finalPrompt, safeContent);

    return {
      provider: modelConfig.provider,
      model: modelConfig.name,
      modelId,
      content: safeContent,
      latencyMs,
      scoreBreakdown,
      overallScore: calculateOverallScore(scoreBreakdown),
      isWinner: false
    };
  } catch (error) {
    const latencyMs = Date.now() - startedAt;

    const fallbackScores: ScoreBreakdown = {
      relevance: 1,
      clarity: 1,
      completeness: 1,
      structure: 1,
      reliability: 1
    };

    return {
      provider: modelConfig.provider,
      model: modelConfig.name,
      modelId,
      content: '',
      latencyMs,
      scoreBreakdown: fallbackScores,
      overallScore: 1,
      isWinner: false,
      error: error instanceof Error ? error.message : 'Provider request failed.'
    };
  }
}

export async function runComparison(
  prompt: string,
  modelIds: string[]
): Promise<NormalizedResult[]> {
  const finalPrompt = prompt.trim();

  if (!finalPrompt) {
    throw new Error('Prompt cannot be empty.');
  }

  const enabledModels = modelIds.filter((modelId) => {
    const modelConfig = MODEL_CONFIGS.find((model) => model.id === modelId);
    return Boolean(modelConfig?.enabled && modelConfig.providerType !== 'coming-soon');
  });

  if (enabledModels.length === 0) {
    throw new Error('No enabled models were selected.');
  }

  const input: ComparisonInput = {
    prompt: finalPrompt
  };

  const tasks = enabledModels.map((modelId) => queryProvider(input, modelId));
  return Promise.all(tasks);
}