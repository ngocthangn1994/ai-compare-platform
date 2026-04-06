import { HistoryItem } from '@/types';
import { formatDate, truncate } from '@/lib/utils';

type HistoryCardProps = {
  item: HistoryItem;
};

export default function HistoryCard({ item }: HistoryCardProps) {
  return (
    <article className="card">
      <p className="text-xs text-slate-500">{formatDate(item.createdAt)}</p>
      <h3 className="mt-2 text-base font-semibold text-slate-900">{truncate(item.prompt)}</h3>
      <p className="mt-2 text-sm text-slate-600">Selected: {item.selectedModels.join(', ') || 'None (default used)'}</p>
      <p className="text-sm text-slate-600">Final Models: {item.finalModelsUsed.join(', ')}</p>
      <p className="mt-2 text-sm font-medium text-brand-700">
        Winner: {item.winner ? `${item.winner.modelId} (${item.winner.overallScore.toFixed(1)})` : 'No winner'}
      </p>
    </article>
  );
}