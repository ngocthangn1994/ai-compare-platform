import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="container-shell py-16 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex rounded-full bg-brand-50 px-4 py-1 text-sm font-medium text-brand-700">
          AI Comparison + Reliability Scoring Platform
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Compare top AI answers side-by-side and find the most reliable response.
        </h1>
        <p className="mt-6 text-lg text-slate-600">
          One prompt, multiple providers, transparent scoring. Pick up to 3 models from 10 options and instantly see the strongest and fastest answer.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/compare"
            className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Start Comparing
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            View Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}