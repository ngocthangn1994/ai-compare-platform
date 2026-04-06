type PromptInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function PromptInput({ value, onChange }: PromptInputProps) {
  return (
    <div className="card">
      <label htmlFor="prompt" className="mb-2 block text-sm font-medium text-slate-700">
        Prompt
      </label>
      <textarea
        id="prompt"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ask anything, e.g. Explain recursion in simple words with an example..."
        className="min-h-32 w-full rounded-xl border border-slate-300 p-4 text-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
      />
    </div>
  );
}