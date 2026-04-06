import { MODEL_OPTIONS } from '@/data/models';
import ModelCard from './ModelCard';

type ModelPickerProps = {
  selectedModels: string[];
  onToggleModel: (modelId: string) => void;
};

export default function ModelPicker({ selectedModels, onToggleModel }: ModelPickerProps) {
  return (
    <section className="card">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Model Picker</h2>
          <p className="text-sm text-slate-600">Choose up to 3 AI models</p>
          <p className="text-sm text-slate-500">If you skip selection, we'll use the default 3 models</p>
        </div>
        <p className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          Selected: {selectedModels.length}/3
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {MODEL_OPTIONS.map((model) => {
          const selected = selectedModels.includes(model.id);
          const reachedLimit = selectedModels.length >= 3;
          const shouldDisable = model.comingSoon || (!selected && reachedLimit);

          return (
            <ModelCard
              key={model.id}
              model={model}
              selected={selected}
              disabled={Boolean(shouldDisable)}
              onToggle={onToggleModel}
            />
          );
        })}
      </div>
    </section>
  );
}