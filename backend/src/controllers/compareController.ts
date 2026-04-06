import { Request, Response } from 'express';
import { Comparison } from '../models/Comparison';
import { runComparison } from '../services/compareService';
import { findFastestModelId, findWinner } from '../utils/calculateWinner';
import { validateAndResolveModels } from '../utils/validateModels';

type UploadedFileMap = {
  [fieldname: string]: Express.Multer.File[];
};

export async function compareController(req: Request, res: Response): Promise<void> {
  const rawPrompt = req.body.prompt;
  const rawSelectedModels = req.body.selectedModels;
  const rawTranscript = req.body.transcript;

  const prompt = typeof rawPrompt === 'string' ? rawPrompt.trim() : '';
  const transcript = typeof rawTranscript === 'string' ? rawTranscript.trim() : '';
  const selectedModels = parseSelectedModels(rawSelectedModels);

  if (!prompt || prompt.length < 4) {
    res.status(400).json({
      message: 'Prompt is required and must be at least 4 characters.'
    });
    return;
  }

  const { finalModels, errors } = validateAndResolveModels(selectedModels);

  if (errors.length > 0) {
    res.status(400).json({ message: errors.join(' ') });
    return;
  }

  try {
    const files = req.files as UploadedFileMap | undefined;
    const imageFile = files?.image?.[0];
    const documentFile = files?.document?.[0];

    const finalPrompt = buildComparisonPrompt({
      prompt,
      transcript,
      imageFile,
      documentFile
    });

    const results = await runComparison(finalPrompt, finalModels);

    const winner = findWinner(results.filter((result) => !result.error));
    const fastestModelId = findFastestModelId(results);

    const finalResults = results.map((result) => ({
      ...result,
      isWinner: winner?.modelId === result.modelId,
      isFastest: fastestModelId === result.modelId
    }));

    const savedComparison = await Comparison.create({
      prompt,
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
      createdAt: savedComparison.createdAt,
      attachments: {
        image: imageFile
          ? {
              originalName: imageFile.originalname,
              mimeType: imageFile.mimetype,
              size: imageFile.size
            }
          : null,
        document: documentFile
          ? {
              originalName: documentFile.originalname,
              mimeType: documentFile.mimetype,
              size: documentFile.size
            }
          : null,
        transcriptIncluded: Boolean(transcript)
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Unable to complete comparison right now.',
      error: error instanceof Error ? error.message : 'Unknown server error'
    });
  }
}

function parseSelectedModels(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (!trimmed) return undefined;

    try {
      const parsed = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string');
      }
    } catch {
      return trimmed
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  return undefined;
}

function buildComparisonPrompt({
  prompt,
  transcript,
  imageFile,
  documentFile
}: {
  prompt: string;
  transcript?: string;
  imageFile?: Express.Multer.File;
  documentFile?: Express.Multer.File;
}) {
  let finalPrompt = prompt;

  if (transcript) {
    finalPrompt += `\n\nVoice transcript from user:\n${transcript}`;
  }

  if (documentFile) {
    const documentText = extractTextFromDocument(documentFile);

    if (documentText) {
      finalPrompt += `\n\nAttached document content:\n${documentText}`;
    } else {
      finalPrompt += `\n\nUser attached a document named "${documentFile.originalname}" with type "${documentFile.mimetype}". Document parsing for this file type is not implemented yet.`;
    }
  }

  if (imageFile) {
    finalPrompt += `\n\nUser attached an image named "${imageFile.originalname}" with type "${imageFile.mimetype}". Image vision analysis is not implemented yet in compareService.`;
  }

  return finalPrompt;
}

function extractTextFromDocument(file: Express.Multer.File): string {
  const textMimeTypes = ['text/plain', 'text/markdown'];

  if (!textMimeTypes.includes(file.mimetype)) {
    return '';
  }

  const text = file.buffer.toString('utf-8').trim();

  if (!text) return '';

  return text.length > 12000 ? `${text.slice(0, 12000)}...` : text;
}