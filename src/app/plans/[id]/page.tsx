import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import type { ClassPlan, ClassPlanRow } from '@/lib/types';
import PlanActions from '@/components/PlanActions';

function rowToPlan(row: ClassPlanRow): ClassPlan {
  return { ...row, phases: JSON.parse(row.phases) };
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === 'approved'  ? 'badge-approved'  :
    status === 'submitted' ? 'badge-submitted' :
    'badge-draft';
  return <span className={cls}>{status}</span>;
}

export default function PlanPage({ params }: { params: { id: string } }) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM plans WHERE id = ?').get(params.id) as ClassPlanRow | undefined;
  if (!row) notFound();

  const plan = rowToPlan(row);

  return (
    <div className="space-y-6 max-w-3xl" id="plan-content">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/plans" className="text-xs text-gray-400 hover:text-gray-600 mb-2 inline-block">
            ← Back to plans
          </Link>
          <h1 className="text-xl font-semibold text-midnight leading-tight">{plan.title}</h1>
          <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
            <span>{plan.coachName}</span>
            <span>·</span>
            <span>{plan.location}</span>
            <span>·</span>
            <span>{plan.ageGroup}</span>
            <span>·</span>
            <span>{plan.classDuration} min</span>
            <span>·</span>
            <StatusBadge status={plan.status} />
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {plan.status === 'draft' && (
            <Link href={`/plans/${plan.id}/edit`} className="btn-secondary text-sm">
              Edit
            </Link>
          )}
          <PlanActions plan={plan} />
        </div>
      </div>

      {/* Quarterly theme banner */}
      <div className="bg-palestra/10 border border-palestra/20 rounded-lg px-4 py-3">
        <div className="text-xs font-semibold text-palestra uppercase tracking-wider mb-0.5">
          Quarterly Theme
        </div>
        <div className="text-sm font-medium text-midnight">{plan.quarterlyTheme}</div>
      </div>

      {/* Coach notes */}
      {plan.focusNotes && (
        <div className="card px-5 py-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            Coach Notes
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-line">{plan.focusNotes}</p>
        </div>
      )}

      {/* Phases */}
      <div className="space-y-4">
        {plan.phases.map((phase, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="bg-midnight px-5 py-3 flex items-center justify-between">
              <h2 className="text-white font-semibold text-sm">{phase.name}</h2>
              <span className="text-gray-400 text-xs">{phase.duration} min</span>
            </div>

            <div className="px-5 py-4 space-y-3">
              <p className="text-xs text-gray-500 italic">{phase.notes}</p>

              {phase.drills.length === 0 ? (
                <p className="text-sm text-gray-400">No drills assigned for this phase.</p>
              ) : (
                <div className="space-y-3">
                  {phase.drills.map(drill => (
                    <div key={drill.id} className="bg-gray-50 rounded-md px-4 py-3">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="text-sm font-medium text-gray-900">{drill.name}</div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <span className="text-xs bg-concrete/30 text-gray-600 px-1.5 py-0.5 rounded">
                            {drill.style}
                          </span>
                          <span className="text-xs bg-concrete/30 text-gray-600 px-1.5 py-0.5 rounded">
                            {drill.difficulty}
                          </span>
                          <span className="text-xs bg-concrete/30 text-gray-600 px-1.5 py-0.5 rounded">
                            {drill.duration} min
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{drill.instructions}</p>
                      {drill.equipment && (
                        <p className="text-xs text-gray-400 mt-1">Equipment: {drill.equipment}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Metadata */}
      <div className="text-xs text-gray-400 space-y-0.5 pt-2">
        <div>Created: {new Date(plan.createdAt).toLocaleString('en-AU')}</div>
        {plan.submittedAt && <div>Submitted: {new Date(plan.submittedAt).toLocaleString('en-AU')}</div>}
        {plan.approvedAt  && <div>Approved:  {new Date(plan.approvedAt).toLocaleString('en-AU')}</div>}
      </div>
    </div>
  );
}
