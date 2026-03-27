import Link from 'next/link';
import { getDb } from '@/lib/db';
import type { ClassPlanRow } from '@/lib/types';

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'approved'  ? 'badge-approved'  :
    status === 'submitted' ? 'badge-submitted' :
    'badge-draft';
  return <span className={cls}>{status}</span>;
}

export default function PlansPage({
  searchParams,
}: {
  searchParams: { location?: string; status?: string; coach?: string };
}) {
  const db = getDb();

  let query = 'SELECT * FROM plans WHERE 1=1';
  const params: string[] = [];
  if (searchParams.location) { query += ' AND location = ?'; params.push(searchParams.location); }
  if (searchParams.status)   { query += ' AND status = ?';   params.push(searchParams.status); }
  if (searchParams.coach)    { query += ' AND coachName = ?'; params.push(searchParams.coach); }
  query += ' ORDER BY weekStart DESC, createdAt DESC';

  const plans = db.prepare(query).all(...params) as ClassPlanRow[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-midnight">All Plans</h1>
        <Link href="/plans/new" className="btn-primary">+ New Plan</Link>
      </div>

      {/* Filters */}
      <form method="get" className="flex flex-wrap gap-3 items-center">
        <select name="location" defaultValue={searchParams.location ?? ''} className="input w-auto text-sm">
          <option value="">All locations</option>
          <option value="Bentleigh">Bentleigh</option>
          <option value="Cheltenham">Cheltenham</option>
        </select>
        <select name="status" defaultValue={searchParams.status ?? ''} className="input w-auto text-sm">
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="submitted">Submitted</option>
          <option value="approved">Approved</option>
        </select>
        <button type="submit" className="btn-secondary text-sm">Filter</button>
        {(searchParams.location || searchParams.status || searchParams.coach) && (
          <Link href="/plans" className="text-sm text-gray-500 hover:text-gray-700">Clear</Link>
        )}
      </form>

      {/* Plans list */}
      {plans.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-gray-500 mb-4">No plans found.</p>
          <Link href="/plans/new" className="btn-primary">Create a plan</Link>
        </div>
      ) : (
        <div className="card divide-y divide-gray-100">
          {plans.map(plan => (
            <Link
              key={plan.id}
              href={`/plans/${plan.id}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{plan.title}</div>
                <div className="text-xs text-gray-500 mt-0.5 flex gap-3">
                  <span>{plan.coachName}</span>
                  <span>{plan.location}</span>
                  <span>
                    w/c {new Date(plan.weekStart).toLocaleDateString('en-AU', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4">
                <span className="text-xs text-gray-400">{plan.classDuration} min</span>
                <StatusBadge status={plan.status} />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
