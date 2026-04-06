type WinnerBadgeProps = {
  show?: boolean;
};

export default function WinnerBadge({ show = true }: WinnerBadgeProps) {
  if (!show) return null;

  return (
    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
      Winner
    </span>
  );
}