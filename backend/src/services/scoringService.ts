export type ScoreBreakdown = {
  relevance: number;
  clarity: number;
  completeness: number;
  structure: number;
  reliability: number;
};

const clampScore = (value: number): number => Math.max(1, Math.min(10, Number(value.toFixed(1))));

const scoreByLength = (text: string, minWords: number, maxWords: number): number => {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount < minWords) return 5;
  if (wordCount > maxWords) return 7;
  return 9;
};

export function scoreRelevance(prompt: string, content: string): number {
  const promptWords = new Set(prompt.toLowerCase().split(/\W+/).filter((word) => word.length > 3));
  const contentWords = content.toLowerCase();
  let matches = 0;
  promptWords.forEach((word) => {
    if (contentWords.includes(word)) {
      matches += 1;
    }
  });
  const base = 5 + (matches / Math.max(promptWords.size, 1)) * 5;
  return clampScore(base);
}

export function scoreClarity(content: string): number {
  const sentences = content.split(/[.!?]/).filter(Boolean).length;
  const score = sentences >= 2 ? 8.8 : 7;
  return clampScore(score);
}

export function scoreCompleteness(content: string): number {
  return clampScore(scoreByLength(content, 35, 260));
}

export function scoreStructure(content: string): number {
  const hasBullets = /(^|\n)\s*[-*•]\s+/.test(content);
  const hasParagraphs = content.includes('\n\n');
  const score = hasBullets || hasParagraphs ? 8.8 : 7.2;
  return clampScore(score);
}

export function scoreReliability(content: string): number {
  const cautiousLanguage = /(depends|may|might|typically|generally|for example)/gi.test(content);
  const score = cautiousLanguage ? 8.6 : 7.4;
  return clampScore(score);
}

export function generateScoreBreakdown(prompt: string, content: string): ScoreBreakdown {
  return {
    relevance: scoreRelevance(prompt, content),
    clarity: scoreClarity(content),
    completeness: scoreCompleteness(content),
    structure: scoreStructure(content),
    reliability: scoreReliability(content)
  };
}

export function calculateOverallScore(scoreBreakdown: ScoreBreakdown): number {
  const values = Object.values(scoreBreakdown);
  const average = values.reduce((total, value) => total + value, 0) / values.length;
  return Number(average.toFixed(1));
}