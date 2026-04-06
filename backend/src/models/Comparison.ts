import mongoose, { Schema } from 'mongoose';

const scoreBreakdownSchema = new Schema(
  {
    relevance: { type: Number, required: true },
    clarity: { type: Number, required: true },
    completeness: { type: Number, required: true },
    structure: { type: Number, required: true },
    reliability: { type: Number, required: true }
  },
  { _id: false }
);

const resultSchema = new Schema(
  {
    provider: { type: String, required: true },
    model: { type: String, required: true },
    modelId: { type: String, required: true },
    content: { type: String, default: '' },
    latencyMs: { type: Number, required: true },
    scoreBreakdown: { type: scoreBreakdownSchema, required: true },
    overallScore: { type: Number, required: true },
    isWinner: { type: Boolean, required: true },
    isFastest: { type: Boolean, default: false },
    error: { type: String }
  },
  { _id: false }
);

const comparisonSchema = new Schema(
  {
    prompt: { type: String, required: true },
    selectedModels: { type: [String], required: true },
    finalModelsUsed: { type: [String], required: true },
    results: { type: [resultSchema], required: true },
    winner: {
      modelId: { type: String },
      overallScore: { type: Number }
    }
  },
  { 
    timestamps: true 
  }
);

export const Comparison = mongoose.model('Comparison', comparisonSchema);