import { MODEL_CONFIGS } from '../config/models';
import { calculateOverallScore, generateScoreBreakdown, ScoreBreakdown } from './scoringService';
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

async function queryProvider(prompt: string, modelId: string): Promise<NormalizedResult> {
  const modelConfig = MODEL_CONFIGS.find((model) => model.id === modelId);

  if (!modelConfig) {
    throw new Error(`Model not found: ${modelId}`);
  }

  if (!modelConfig.enabled || modelConfig.providerType === 'coming-soon') {
    throw new Error(`Model not enabled: ${modelId}`);
  }

  const startedAt = Date.now();

  try {
    let content = '';

    if (modelConfig.providerType === 'openai') {
      content = await queryOpenAI(prompt, modelConfig.apiModel!);
    } else if (modelConfig.providerType === 'anthropic') {
      content = await queryAnthropic(prompt, modelConfig.apiModel!);
    } else if (modelConfig.providerType === 'xai') {
      content = await queryXai(prompt, modelConfig.apiModel!);
    }

    const latencyMs = Date.now() - startedAt;
    const scoreBreakdown = generateScoreBreakdown(prompt, content);

    return {
      provider: modelConfig.provider,
      model: modelConfig.name,
      modelId,
      content,
      latencyMs,
      scoreBreakdown,
      overallScore: calculateOverallScore(scoreBreakdown),
      isWinner: false
    };
  } catch (error) {
    const latencyMs = Date.now() - startedAt;
    const fallbackScores = {
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

export async function runComparison(prompt: string, modelIds: string[]): Promise<NormalizedResult[]> {
  const enabledModels = modelIds.filter((modelId) => {
    const modelConfig = MODEL_CONFIGS.find((model) => model.id === modelId);
    return Boolean(modelConfig?.enabled);
  });

  const tasks = enabledModels.map((modelId) => queryProvider(prompt, modelId));
  return Promise.all(tasks);
}