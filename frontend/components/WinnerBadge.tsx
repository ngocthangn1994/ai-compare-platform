type WinnerBadgeProps = {
  isWinner?: boolean;
  isFastest?: boolean;
};

export default function WinnerBadge({
  isWinner = false,
  isFastest = false,
}: WinnerBadgeProps) {
  if (!isWinner && !isFastest) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {isWinner && (
        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
          Winner
        </span>
      )}

      {isFastest && (
        <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
          Fastest
        </span>
      )}
    </div>
  );
}