'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ClassPlan, PlanStatus } from '@/lib/types';

interface Props {
  plan: ClassPlan;
}

export default function PlanActions({ plan }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: PlanStatus) {
    setLoading(true);
    await fetch(`/api/plans/${plan.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    router.refresh();
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm('Delete this plan? This cannot be undone.')) return;
    setLoading(true);
    await fetch(`/api/plans/${plan.id}`, { method: 'DELETE' });
    router.push('/plans');
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="flex flex-wrap gap-2 flex-shrink-0">
      {plan.status === 'draft' && (
        <button
          onClick={() => updateStatus('submitted')}
          disabled={loading}
          className="btn-primary text-sm"
        >
          Submit Plan
        </button>
      )}
      {plan.status === 'submitted' && (
        <button
          onClick={() => updateStatus('approved')}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
        >
          Approve
        </button>
      )}
      {plan.status === 'approved' && (
        <button
          onClick={() => updateStatus('submitted')}
          disabled={loading}
          className="btn-secondary text-sm"
        >
          Reopen
        </button>
      )}

      <button onClick={handlePrint} className="btn-secondary text-sm">
        Print / PDF
      </button>

      {plan.status === 'draft' && (
        <button onClick={handleDelete} disabled={loading} className="btn-danger text-sm">
          Delete
        </button>
      )}
    </div>
  );
}
