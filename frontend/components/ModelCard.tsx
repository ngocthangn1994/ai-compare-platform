import { ModelOption } from '@/types';
import { cn } from '@/lib/utils';

type ModelCardProps = {
  model: ModelOption;
  selected: boolean;
  disabled: boolean;
  onToggle: (modelId: string) => void;
};

export default function ModelCard({ model, selected, disabled, onToggle }: ModelCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onToggle(model.id)}
      className={cn(
        'rounded-xl border p-4 text-left transition',
        selected ? 'border-brand-600 bg-brand-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-900">{model.name}</p>
          <p className="text-xs text-slate-500">{model.provider}</p>
        </div>
        {model.comingSoon ? (
          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">Coming Soon</span>
        ) : (
          <span className={cn('h-4 w-4 rounded-full border', selected ? 'border-brand-600 bg-brand-600' : 'border-slate-300')} />
        )}
      </div>
    </button>
  );
}