'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ClassPlan } from '@/lib/types';

export default function EditPlanPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [plan, setPlan] = useState<ClassPlan | null>(null);
  const [focusNotes, setFocusNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/plans/${params.id}`)
      .then(r => r.json())
      .then((p: ClassPlan) => {
        setPlan(p);
        setFocusNotes(p.focusNotes);
      });
  }, [params.id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await fetch(`/api/plans/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focusNotes }),
      });
      router.push(`/plans/${params.id}`);
      router.refresh();
    } catch {
      setError('Failed to save. Please try again.');
      setLoading(false);
    }
  }

  if (!plan) return <div className="text-sm text-gray-400 py-8">Loading...</div>;

  if (plan.status !== 'draft') {
    return (
      <div className="max-w-xl">
        <div className="card p-6 text-center">
          <p className="text-gray-600 mb-4">
            Only draft plans can be edited. This plan is <strong>{plan.status}</strong>.
          </p>
          <a href={`/plans/${params.id}`} className="btn-secondary text-sm">Back to Plan</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <a href={`/plans/${params.id}`} className="text-xs text-gray-400 hover:text-gray-600 mb-2 inline-block">
          ← Back to plan
        </a>
        <h1 className="text-2xl font-semibold text-midnight">Edit Plan</h1>
        <p className="text-sm text-gray-500 mt-1 truncate">{plan.title}</p>
      </div>

      <form onSubmit={handleSave} className="card p-6 space-y-5">
        {/* Read-only info */}
        <div className="grid grid-cols-2 gap-4">
          {[
            ['Coach', plan.coachName],
            ['Location', plan.location],
            ['Style', plan.style],
            ['Age Group', plan.ageGroup],
            ['Duration', `${plan.classDuration} min`],
            ['Quarterly Theme', plan.quarterlyTheme],
          ].map(([label, value]) => (
            <div key={label}>
              <div className="text-xs text-gray-400 font-medium mb-0.5">{label}</div>
              <div className="text-sm text-gray-700">{value}</div>
            </div>
          ))}
        </div>

        <hr className="border-gray-100" />

        {/* Editable notes */}
        <div>
          <label className="label">Coach Notes / Focus</label>
          <textarea
            className="input resize-none"
            rows={4}
            value={focusNotes}
            onChange={e => setFocusNotes(e.target.value)}
            placeholder="Update your notes or focus for this class..."
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <a href={`/plans/${params.id}`} className="btn-secondary">Cancel</a>
        </div>
      </form>

      {/* Phase summary (read-only) */}
      <div className="card overflow-hidden">
        <div className="bg-midnight px-5 py-3">
          <h2 className="text-white font-semibold text-sm">Plan Structure</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {plan.phases.map((phase, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-gray-700">{phase.name}</span>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{phase.drills.length} drill{phase.drills.length !== 1 ? 's' : ''}</span>
                <span>{phase.duration} min</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
