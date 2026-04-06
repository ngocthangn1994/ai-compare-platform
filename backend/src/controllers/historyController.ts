import { Request, Response } from 'express';
import { Comparison } from '../models/Comparison';

export async function historyController(_req: Request, res: Response): Promise<void> {
  try {
    const history = await Comparison.find({}, { prompt: 1, selectedModels: 1, finalModelsUsed: 1, winner: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to load history.',
      error: error instanceof Error ? error.message : 'Unknown server error'
    });
  }
}