import { Request, Response } from 'express';

export async function transcribeController(req: Request, res: Response): Promise<void> {
  try {
    const file = req.file;

    if (!file) {
      res.status(400).json({ message: 'Audio file is required.' });
      return;
    }

    res.status(200).json({
      text: 'Voice transcription is not implemented yet.',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to transcribe audio right now.',
      error: error instanceof Error ? error.message : 'Unknown server error',
    });
  }
}