'use client';

import { useMemo, useState } from 'react';
import CompareButton from '@/components/CompareButton';
import ModelPicker from '@/components/ModelPicker';
import PromptInput from '@/components/PromptInput';
import ResultCard from '@/components/ResultCard';
import { comparePrompt } from '@/lib/api';
import { CompareResult } from '@/types';

export default function ComparePage() {
  const [prompt, setPrompt] = useState('');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [results, setResults] = useState<CompareResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => prompt.trim().length > 0 && !loading, [loading, prompt]);

  const toggleModel = (modelId: string) => {
    setError('');
    setSelectedModels((current) => {
      if (current.includes(modelId)) {
        return current.filter((id) => id !== modelId);
      }
      if (current.length >= 3) {
        return current;
      }
      return [...current, modelId];
    });
  };

  const handleCompare = async () => {
    if (!canSubmit) {
      setError('Please enter a valid prompt before comparing.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await comparePrompt({ prompt: prompt.trim(), selectedModels });
      setResults(response.results);
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : 'Unexpected error';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-shell space-y-8 py-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">Compare AI Models</h1>
        <p className="text-slate-600">Enter one prompt and compare answers with reliability scoring in seconds.</p>
      </section>

      <PromptInput value={prompt} onChange={setPrompt} />
      <ModelPicker selectedModels={selectedModels} onToggleModel={toggleModel} />

      <div className="flex items-center gap-4">
        <CompareButton onClick={handleCompare} loading={loading} />
        {selectedModels.length > 3 && <p className="text-sm text-rose-600">You can only select up to 3 models.</p>}
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div>}

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Results</h2>
        {loading && <p className="card text-sm text-slate-600">Running comparison across selected providers...</p>}
        {!loading && results.length === 0 && (
          <p className="card text-sm text-slate-600">No results yet. Submit a prompt to see side-by-side answers.</p>
        )}

        {results.length > 0 && (
          <div className="grid gap-4 lg:grid-cols-3">
            {results.map((result) => (
              <ResultCard key={result.modelId} result={result} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
