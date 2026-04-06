import { CompareResult } from '@/types';
import ScoreBadge from './ScoreBadge';
import WinnerBadge from './WinnerBadge';

type ResultCardProps = {
  result: CompareResult;
};

export default function ResultCard({ result }: ResultCardProps) {
  return (
    <article className="card flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{result.model}</h3>
          <p className="text-xs text-slate-500">{result.provider}</p>
        </div>
        <ScoreBadge score={result.overallScore} />
      </div>

      <WinnerBadge isWinner={result.isWinner} isFastest={result.isFastest} />

      {result.error ? (
        <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{result.error}</p>
      ) : (
        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{result.content}</p>
      )}

      <div className="mt-auto space-y-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
        <p>Latency: {result.latencyMs} ms</p>
        <div className="grid grid-cols-2 gap-1">
          <p>Relevance: {result.scoreBreakdown.relevance}</p>
          <p>Clarity: {result.scoreBreakdown.clarity}</p>
          <p>Completeness: {result.scoreBreakdown.completeness}</p>
          <p>Structure: {result.scoreBreakdown.structure}</p>
          <p>Reliability: {result.scoreBreakdown.reliability}</p>
        </div>
      </div>
    </article>
  );
}