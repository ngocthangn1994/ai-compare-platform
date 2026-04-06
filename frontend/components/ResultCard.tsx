import { CompareResult } from '@/types';
import ScoreBadge from './ScoreBadge';
import WinnerBadge from './WinnerBadge';
import ReactMarkdown from 'react-markdown';

type ResultCardProps = {
  result: CompareResult;
};

export default function ResultCard({ result }: ResultCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-slate-900">
            {result.model}
          </h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
            {result.provider}
          </p>
        </div>

        <div className="shrink-0">
          <ScoreBadge score={result.overallScore} />
        </div>
      </div>

      {/* Badges */}
      <div className="px-5 pt-4">
        <WinnerBadge isWinner={result.isWinner} isFastest={result.isFastest} />
      </div>

      {/* Answer Content */}
      <div className="flex-1 px-5 py-4">
        {result.error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-700">
            {result.error}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
            <div className="prose prose-sm max-w-none text-slate-700 prose-headings:text-slate-900 prose-strong:text-slate-900 prose-p:leading-7 prose-li:leading-7">
              <ReactMarkdown>{formatAiText(result.content)}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-auto border-t border-slate-100 bg-slate-50/70 px-5 py-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Response Stats
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
            {result.latencyMs} ms
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <StatItem label="Relevance" value={result.scoreBreakdown.relevance} />
          <StatItem label="Clarity" value={result.scoreBreakdown.clarity} />
          <StatItem label="Completeness" value={result.scoreBreakdown.completeness} />
          <StatItem label="Structure" value={result.scoreBreakdown.structure} />
          <StatItem label="Reliability" value={result.scoreBreakdown.reliability} />
        </div>
      </div>
    </article>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white px-3 py-2 ring-1 ring-slate-200">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
}

function formatAiText(text: string) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n');
}