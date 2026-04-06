import { DEFAULT_MODELS, MAX_MODELS_PER_COMPARE, MODEL_CONFIGS } from '../config/models';

export function validateAndResolveModels(selectedModels: string[] | undefined): {
  finalModels: string[];
  errors: string[];
} {
  const rawModels = selectedModels ?? [];

  if (rawModels.length > MAX_MODELS_PER_COMPARE) {
    return {
      finalModels: [],
      errors: [`You can select up to ${MAX_MODELS_PER_COMPARE} models.`]
    };
  }

  const finalModels = rawModels.length === 0 ? DEFAULT_MODELS : rawModels;
  const uniqueModels = [...new Set(finalModels)];

  const supportedIds = new Set(MODEL_CONFIGS.map((model) => model.id));
  const invalidModels = uniqueModels.filter((id) => !supportedIds.has(id));

  if (invalidModels.length > 0) {
    return {
      finalModels: [],
      errors: [`Unsupported models: ${invalidModels.join(', ')}`]
    };
  }

  return { finalModels: uniqueModels, errors: [] };
}