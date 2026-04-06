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
    <div className="flex flex-wrap gap-2">
      {isWinner && (
        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          Winner
        </span>
      )}

      {isFastest && (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          Fastest
        </span>
      )}
    </div>
  );
}