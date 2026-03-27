import Link from 'next/link';
import { plansDb } from '@/lib/db';
import type { Location } from '@/lib/types';

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'approved'  ? 'badge-approved'  :
    status === 'submitted' ? 'badge-submitted' :
    'badge-draft';
  return <span className={cls}>{status}</span>;
}

export default function DashboardPage() {
  const allPlans = plansDb.all()
    .sort((a, b) => b.weekStart.localeCompare(a.weekStart) || b.createdAt.localeCompare(a.createdAt))
    .slice(0, 20);

  const locations: Location[] = ['Bentleigh', 'Cheltenham'];
  const pending   = allPlans.filter(p => p.status === 'draft').length;
  const submitted = allPlans.filter(p => p.status === 'submitted').length;
  const approved  = allPlans.filter(p => p.status === 'approved').length;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-midnight">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Integr8 Class Planner — structured planning for every session.
          </p>
        </div>
        <Link href="/plans/new" className="btn-primary">+ New Plan</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="text-2xl font-bold text-gray-800">{pending}</div>
          <div className="text-sm text-gray-500 mt-1">Drafts</div>
        </div>
        <div className="card p-5">
          <div className="text-2xl font-bold text-palestra">{submitted}</div>
          <div className="text-sm text-gray-500 mt-1">Submitted</div>
        </div>
        <div className="card p-5">
          <div className="text-2xl font-bold text-green-600">{approved}</div>
          <div className="text-sm text-gray-500 mt-1">Approved</div>
        </div>
      </div>

      {/* Recent plans by location */}
      {locations.map(location => {
        const plans = allPlans.filter(p => p.location === location).slice(0, 5);
        return (
          <section key={location}>
            <h2 className="text-lg font-semibold text-midnight mb-3">{location}</h2>
            {plans.length === 0 ? (
              <p className="text-sm text-gray-400 py-4">No plans yet.</p>
            ) : (
              <div className="card divide-y divide-gray-100">
                {plans.map(plan => (
                  <Link
                    key={plan.id}
                    href={`/plans/${plan.id}`}
                    className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <div className="text-sm font-medium text-gray-900">{plan.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {plan.coachName} · w/c {new Date(plan.weekStart).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                    <StatusBadge status={plan.status} />
                  </Link>
                ))}
              </div>
            )}
          </section>
        );
      })}

      {allPlans.length === 0 && (
        <div className="card p-10 text-center">
          <p className="text-gray-500 mb-4">No class plans yet.</p>
          <Link href="/plans/new" className="btn-primary">Create your first plan</Link>
        </div>
      )}
    </div>
  );
}
