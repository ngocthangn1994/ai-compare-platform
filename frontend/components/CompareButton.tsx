type CompareButtonProps = {
  onClick: () => void;
  loading: boolean;
};

export default function CompareButton({ onClick, loading }: CompareButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? 'Comparing...' : 'Compare Models'}
    </button>
  );
}