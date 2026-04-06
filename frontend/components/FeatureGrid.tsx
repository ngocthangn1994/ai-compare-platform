const features = [
  {
    title: 'Side-by-Side Comparison',
    description: 'See multiple model answers next to each other with consistent formatting and direct score comparisons.'
  },
  {
    title: '10 Model Choices',
    description: 'Browse ten model options in one place. Select up to three for each run with clear Coming Soon labels.'
  },
  {
    title: 'Reliability Scoring',
    description: 'Every answer gets a practical score breakdown for relevance, clarity, completeness, structure, and reliability impression.'
  },
  {
    title: 'Team Dashboard History',
    description: 'Your previous comparisons are stored in MongoDB so you can review prompts, winners, and selected model mixes.'
  }
];

export default function FeatureGrid() {
  return (
    <section className="container-shell pb-20">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-semibold text-slate-900">Built for modern AI evaluation workflows</h2>
        <p className="mt-3 text-slate-600">From quick checks to repeatable benchmarking, everything you need in one clean interface.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <article key={feature.title} className="card">
            <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
            <p className="mt-2 text-slate-600">{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}