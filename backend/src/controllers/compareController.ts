import { Request, Response } from 'express';
import { Comparison } from '../models/Comparison';
import { runComparison } from '../services/compareService';
import { findFastestModelId, findWinner } from '../utils/calculateWinner';
import { validateAndResolveModels } from '../utils/validateModels';

export async function compareController(req: Request, res: Response): Promise<void> {
  const { prompt, selectedModels } = req.body as { prompt?: string; selectedModels?: string[] };

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 4) {
    res.status(400).json({ message: 'Prompt is required and must be at least 4 characters.' });
    return;
  }

  const { finalModels, errors } = validateAndResolveModels(selectedModels);

  if (errors.length > 0) {
    res.status(400).json({ message: errors.join(' ') });
    return;
  }

  try {
    const results = await runComparison(prompt.trim(), finalModels);

    const winner = findWinner(results.filter((result) => !result.error));
    const fastestModelId = findFastestModelId(results);

    const finalResults = results.map((result) => ({
      ...result,
      isWinner: winner?.modelId === result.modelId,
      isFastest: fastestModelId === result.modelId
    }));

    const savedComparison = await Comparison.create({
      prompt: prompt.trim(),
      selectedModels: selectedModels ?? [],
      finalModelsUsed: finalModels,
      results: finalResults,
      winner
    });

    res.status(200).json({
      prompt: savedComparison.prompt,
      selectedModels: savedComparison.selectedModels,
      finalModelsUsed: savedComparison.finalModelsUsed,
      results: savedComparison.results,
      winner: savedComparison.winner,
      createdAt: savedComparison.createdAt
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to complete comparison right now.',
      error: error instanceof Error ? error.message : 'Unknown server error'
    });
  }
}