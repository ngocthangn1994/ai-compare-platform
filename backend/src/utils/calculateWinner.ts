import { NormalizedResult } from '../services/compareService';

export function findWinner(results: NormalizedResult[]): { modelId: string; overallScore: number } | null {
  if (results.length === 0) return null;

  const sorted = [...results].sort((a, b) => b.overallScore - a.overallScore);
  return {
    modelId: sorted[0].modelId,
    overallScore: sorted[0].overallScore
  };
}

export function findFastestModelId(results: NormalizedResult[]): string | null {
  if (results.length === 0) return null;

  const sorted = [...results].sort((a, b) => a.latencyMs - b.latencyMs);
  return sorted[0].modelId;
}