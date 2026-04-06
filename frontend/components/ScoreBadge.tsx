import { cn } from '@/lib/utils';

type ScoreBadgeProps = {
  score: number;
};

export default function ScoreBadge({ score }: ScoreBadgeProps) {
  const color = score >= 8 ? 'text-emerald-700 bg-emerald-100' : score >= 6 ? 'text-amber-700 bg-amber-100' : 'text-rose-700 bg-rose-100';
  return <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', color)}>Score {score.toFixed(1)}</span>;
}