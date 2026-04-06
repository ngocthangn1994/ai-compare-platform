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

  const canSubmit = useMemo(() => {
    return prompt.trim().length > 0 && !loading && selectedModels.length > 0;
  }, [loading, prompt, selectedModels]);

  const toggleModel = (modelId: string) => {
    setError('');

    setSelectedModels((current) => {
      if (current.includes(modelId)) {
        return current.filter((id) => id !== modelId);
      }

      if (current.length >= 3) {
        setError('You can select up to 3 models only.');
        return current;
      }

      return [...current, modelId];
    });
  };

  const handleCompare = async () => {
    if (!prompt.trim()) {
      setError('Please enter a valid prompt before comparing.');
      return;
    }

    if (selectedModels.length === 0) {
      setError('Please select at least 1 model.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await comparePrompt({
        prompt: prompt.trim(),
        selectedModels,
      });
      setResults(response.results);
    } catch (apiError) {
      const message = apiError instanceof Error ? apiError.message : 'Unexpected error';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container-shell py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        {/* Page Header */}
        <section className="rounded-3xl border border-slate-200 bg-white px-6 py-7 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-blue-600">
                AI Comparison Workspace
              </p>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Compare AI Models
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Enter one prompt, send it to multiple AI providers, and review the
                answers in a clean side-by-side layout with reliability scoring.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <QuickStat label="Selected" value={`${selectedModels.length}/3`} />
              <QuickStat label="Results" value={String(results.length)} />
              <QuickStat label="Status" value={loading ? 'Running' : 'Ready'} />
            </div>
          </div>
        </section>

        {/* Input Area */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-900">Prompt</h2>
            <p className="mt-1 text-sm text-slate-600">
              Write your question once and compare the response quality across models.
            </p>
          </div>

          <div className="space-y-5">
            <PromptInput value={prompt} onChange={setPrompt} />

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Model Selection</h3>
                  <p className="text-xs text-slate-500">
                    Choose up to 3 models for side-by-side comparison.
                  </p>
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                  {selectedModels.length} selected
                </span>
              </div>

              <ModelPicker selectedModels={selectedModels} onToggleModel={toggleModel} />
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-500">
                {selectedModels.length === 0
                  ? 'Select at least one model to start.'
                  : `Ready to compare across ${selectedModels.length} model${
                      selectedModels.length > 1 ? 's' : ''
                    }.`}
              </div>

              <div className="flex items-center gap-3">
                <CompareButton onClick={handleCompare} loading={loading} />
              </div>
            </div>
          </div>
        </section>

        {/* Error State */}
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        {/* Results Section */}
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Results
              </h2>
              <p className="text-sm text-slate-600">
                Review answers, compare quality, and identify the strongest response.
              </p>
            </div>

            {results.length > 0 && !loading && (
              <div className="rounded-full bg-white px-4 py-2 text-xs font-medium text-slate-600 ring-1 ring-slate-200 shadow-sm">
                {results.length} response{results.length > 1 ? 's' : ''} returned
              </div>
            )}
          </div>

          {loading && (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="space-y-3">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
                <p className="pt-2 text-sm text-slate-500">
                  Running comparison across selected providers...
                </p>
              </div>
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
              <div className="mx-auto max-w-md space-y-2">
                <h3 className="text-lg font-semibold text-slate-900">No results yet</h3>
                <p className="text-sm leading-6 text-slate-600">
                  Submit a prompt to see clean side-by-side AI answers with scoring,
                  speed, and comparison details.
                </p>
              </div>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="grid gap-6 xl:grid-cols-3">
              {results.map((result) => (
                <ResultCard key={result.modelId} result={result} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}