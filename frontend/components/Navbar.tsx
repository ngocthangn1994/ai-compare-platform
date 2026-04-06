import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-shell flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          ReliaCompare AI
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link href="/compare" className="hover:text-slate-900">
            Compare
          </Link>
          <Link href="/dashboard" className="hover:text-slate-900">
            Dashboard
          </Link>
          <Link
            href="/compare"
            className="rounded-lg bg-brand-600 px-4 py-2 text-white transition hover:bg-brand-700"
          >
            Start Comparing
          </Link>
        </nav>
      </div>
    </header>
  );
}