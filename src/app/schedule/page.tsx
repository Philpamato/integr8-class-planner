import Link from 'next/link';
import { getDb } from '@/lib/db';
import type { ClassPlanRow, Location } from '@/lib/types';

function getFortnightBlocks(weeksBack = 6): string[] {
  const blocks: string[] = [];
  const now = new Date();
  // Find the most recent Monday
  const day = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);

  // Go back and forward to build 14-day blocks
  for (let i = -weeksBack; i <= 4; i += 2) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i * 7);
    blocks.push(d.toISOString().split('T')[0]);
  }
  return blocks.reverse(); // most recent first
}

function formatWeek(iso: string) {
  const d = new Date(iso);
  const end = new Date(d);
  end.setDate(d.getDate() + 13);
  return `${d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

const COACHES = [
  // Add coach names here — update as your team grows
  'Giuseppe', 'Phil', 'Domenic',
];

export default function SchedulePage() {
  const db = getDb();
  const blocks = getFortnightBlocks(8);
  const locations: Location[] = ['Bentleigh', 'Cheltenham'];

  const allPlans = db.prepare(
    'SELECT id, title, coachName, location, style, ageGroup, status, weekStart, submittedAt FROM plans ORDER BY weekStart DESC'
  ).all() as ClassPlanRow[];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-midnight">Fortnightly Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">Track plan completion across both locations.</p>
        </div>
        <Link href="/plans/new" className="btn-primary">+ New Plan</Link>
      </div>

      {locations.map(location => (
        <section key={location} className="space-y-4">
          <h2 className="text-lg font-semibold text-midnight border-b border-gray-200 pb-2">{location}</h2>

          <div className="space-y-3">
            {blocks.map(blockStart => {
              const blockEnd = new Date(blockStart);
              blockEnd.setDate(blockEnd.getDate() + 13);

              // Plans with weekStart within this 2-week block
              const blockPlans = allPlans.filter(p => {
                if (p.location !== location) return false;
                const d = new Date(p.weekStart);
                return d >= new Date(blockStart) && d <= blockEnd;
              });

              const isCurrentBlock = (() => {
                const now = new Date();
                return now >= new Date(blockStart) && now <= blockEnd;
              })();

              const submitted = blockPlans.filter(p => p.status === 'submitted' || p.status === 'approved').length;
              const approved  = blockPlans.filter(p => p.status === 'approved').length;

              return (
                <div key={blockStart} className={`card overflow-hidden ${isCurrentBlock ? 'ring-2 ring-palestra' : ''}`}>
                  <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">{formatWeek(blockStart)}</span>
                      {isCurrentBlock && (
                        <span className="text-xs bg-palestra text-white px-2 py-0.5 rounded-full font-medium">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{submitted} submitted</span>
                      <span>·</span>
                      <span className={approved > 0 ? 'text-green-600 font-medium' : ''}>{approved} approved</span>
                    </div>
                  </div>

                  {blockPlans.length === 0 ? (
                    <div className="px-5 py-4 text-sm text-gray-400 flex items-center justify-between">
                      <span>No plans for this period.</span>
                      <Link
                        href={`/plans/new`}
                        className="text-xs text-palestra hover:underline"
                      >
                        + Add plan
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {blockPlans.map(plan => (
                        <Link
                          key={plan.id}
                          href={`/plans/${plan.id}`}
                          className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <div>
                            <div className="text-sm text-gray-800 font-medium">{plan.coachName}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{plan.style} · {plan.ageGroup}</div>
                          </div>
                          <span className={
                            plan.status === 'approved'  ? 'badge-approved'  :
                            plan.status === 'submitted' ? 'badge-submitted' :
                            'badge-draft'
                          }>
                            {plan.status}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
