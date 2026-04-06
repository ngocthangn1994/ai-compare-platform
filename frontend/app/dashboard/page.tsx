'use client';

import { useEffect, useState } from 'react';
import HistoryCard from '@/components/HistoryCard';
import { fetchHistory } from '@/lib/api';
import { HistoryItem } from '@/types';

export default function DashboardPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const run = async () => {
      try {
        const items = await fetchHistory();
        setHistory(items);
      } catch (historyError) {
        const message = historyError instanceof Error ? historyError.message : 'Unable to load history';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void run();
  }, []);

  return (
    <div className="container-shell space-y-8 py-10">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">Comparison Dashboard</h1>
        <p className="text-slate-600">Review your previous comparisons, selected model combinations, and winning responses.</p>
      </section>

      {loading && <p className="card text-sm text-slate-600">Loading history...</p>}
      {error && <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}

      {!loading && !error && history.length === 0 && (
        <p className="card text-sm text-slate-600">No history yet. Run your first comparison from the compare page.</p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {history.map((item) => (
          <HistoryCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}