export type ScoreBreakdown = {
  relevance: number;
  clarity: number;
  completeness: number;
  structure: number;
  reliability: number;
};

export type CompareResult = {
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

export type Winner = {
  modelId: string;
  overallScore: number;
};

export type CompareResponse = {
  prompt: string;
  selectedModels: string[];
  finalModelsUsed: string[];
  results: CompareResult[];
  winner: Winner | null;
  createdAt: string;
};

export type HistoryItem = {
  _id: string;
  prompt: string;
  selectedModels: string[];
  finalModelsUsed: string[];
  winner: Winner | null;
  createdAt: string;
};

export type ModelOption = {
  id: string;
  name: string;
  provider: string;
  enabled: boolean;
  comingSoon?: boolean;
};
