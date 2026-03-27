import { getDb } from '@/lib/db';
import type { Drill, Style, DrillFocus } from '@/lib/types';
import AddDrillForm from '@/components/AddDrillForm';

const STYLES: (Style | 'General')[] = ['General', 'Karate', 'Boxing', 'BJJ', 'MMA', 'Muay Thai'];
const FOCUSES: DrillFocus[] = ['warm-up', 'footwork', 'defense', 'attack', 'combination', 'technique', 'conditioning', 'sparring', 'cool-down'];

const FOCUS_COLORS: Record<DrillFocus, string> = {
  'warm-up':     'bg-orange-100 text-orange-700',
  'footwork':    'bg-sky-100 text-sky-700',
  'defense':     'bg-yellow-100 text-yellow-700',
  'attack':      'bg-red-100 text-red-700',
  'combination': 'bg-purple-100 text-purple-700',
  'technique':   'bg-green-100 text-green-700',
  'conditioning':'bg-pink-100 text-pink-700',
  'sparring':    'bg-indigo-100 text-indigo-700',
  'cool-down':   'bg-teal-100 text-teal-700',
};

export default function DrillsPage({
  searchParams,
}: {
  searchParams: { style?: string; focus?: string; difficulty?: string };
}) {
  const db = getDb();

  let query = 'SELECT * FROM drills WHERE 1=1';
  const params: string[] = [];
  if (searchParams.style)      { query += ' AND (style = ? OR style = \'General\')'; params.push(searchParams.style); }
  if (searchParams.focus)      { query += ' AND focus = ?';      params.push(searchParams.focus); }
  if (searchParams.difficulty) { query += ' AND difficulty = ?'; params.push(searchParams.difficulty); }
  query += ' ORDER BY style, focus, name';

  const drills = db.prepare(query).all(...params) as Drill[];

  // Group by style
  const grouped = STYLES.reduce((acc, s) => {
    const matching = drills.filter(d => d.style === s);
    if (matching.length > 0) acc[s] = matching;
    return acc;
  }, {} as Record<string, Drill[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-midnight">Drill Library</h1>
        <span className="text-sm text-gray-400">{drills.length} drills</span>
      </div>

      {/* Filters */}
      <form method="get" className="flex flex-wrap gap-3">
        <select name="style" defaultValue={searchParams.style ?? ''} className="input w-auto text-sm">
          <option value="">All styles</option>
          {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select name="focus" defaultValue={searchParams.focus ?? ''} className="input w-auto text-sm">
          <option value="">All focus areas</option>
          {FOCUSES.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
        <select name="difficulty" defaultValue={searchParams.difficulty ?? ''} className="input w-auto text-sm">
          <option value="">All difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <button type="submit" className="btn-secondary text-sm">Filter</button>
      </form>

      {/* Add drill form */}
      <AddDrillForm />

      {/* Drill groups */}
      {Object.keys(grouped).length === 0 ? (
        <div className="card p-8 text-center text-gray-400 text-sm">
          No drills found. Adjust the filters or run <code className="bg-gray-100 px-1 rounded">npm run db:seed</code> to populate the library.
        </div>
      ) : (
        Object.entries(grouped).map(([style, styleDrills]) => (
          <section key={style}>
            <h2 className="text-base font-semibold text-midnight mb-3">{style}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {styleDrills.map(drill => (
                <div key={drill.id} className="card p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="font-medium text-sm text-gray-900">{drill.name}</div>
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${FOCUS_COLORS[drill.focus as DrillFocus] ?? 'bg-gray-100 text-gray-600'}`}>
                      {drill.focus}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{drill.instructions}</p>
                  <div className="flex gap-2 text-xs text-gray-400">
                    <span>{drill.difficulty}</span>
                    <span>·</span>
                    <span>{drill.duration} min</span>
                    {drill.equipment && <><span>·</span><span>{drill.equipment}</span></>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}
