type WinnerBadgeProps = {
  isWinner?: boolean;
  isFastest?: boolean;
};

export default function WinnerBadge({ isWinner, isFastest }: WinnerBadgeProps) {
  if (!isWinner && !isFastest) {
    return null;
  }

  return (
    <div className="flex gap-2">
      {isWinner && <span className="rounded-full bg-brand-100 px-2.5 py-1 text-xs font-semibold text-brand-700">Best Answer</span>}
      {isFastest && <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Fastest</span>}
    </div>
  );
}