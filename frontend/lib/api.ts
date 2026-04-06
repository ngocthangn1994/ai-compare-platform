import { CompareResponse, HistoryItem } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Unexpected API error');
  }
  return data;
}

export async function comparePrompt(payload: {
  prompt: string;
  selectedModels: string[];
}): Promise<CompareResponse> {
  const response = await fetch(`${API_BASE_URL}/api/compare`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return parseResponse<CompareResponse>(response);
}

export async function fetchHistory(): Promise<HistoryItem[]> {
  const response = await fetch(`${API_BASE_URL}/api/history`, {
    method: 'GET',
    cache: 'no-store'
  });

  return parseResponse<HistoryItem[]>(response);
}