'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CreatePlanInput, Style, Location, AgeGroup } from '@/lib/types';

const STYLES: Style[] = ['Karate', 'Boxing', 'BJJ', 'MMA', 'Muay Thai', 'General'];
const LOCATIONS: Location[] = ['Bentleigh', 'Cheltenham'];
const AGE_GROUPS: AgeGroup[] = ['Kids', 'Teens', 'Adults', 'Mixed'];
const DURATIONS = [45, 60, 75, 90];

function getMonday(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

export default function NewPlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<CreatePlanInput>({
    coachName: '',
    location: 'Bentleigh',
    ageGroup: 'Adults',
    style: 'General',
    classDuration: 60,
    focusNotes: '',
    weekStart: getMonday(new Date()),
  });

  function set(field: keyof CreatePlanInput, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to create plan');
      const plan = await res.json();
      router.push(`/plans/${plan.id}`);
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold text-midnight mb-6">New Class Plan</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        {/* Coach name */}
        <div>
          <label className="label">Coach Name</label>
          <input
            type="text"
            required
            className="input"
            placeholder="e.g. Marcus"
            value={form.coachName}
            onChange={e => set('coachName', e.target.value)}
          />
        </div>

        {/* Location */}
        <div>
          <label className="label">Location</label>
          <select
            className="input"
            value={form.location}
            onChange={e => set('location', e.target.value)}
          >
            {LOCATIONS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        {/* Style */}
        <div>
          <label className="label">Martial Arts Style</label>
          <select
            className="input"
            value={form.style}
            onChange={e => set('style', e.target.value)}
          >
            {STYLES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>

        {/* Age group */}
        <div>
          <label className="label">Age Group</label>
          <select
            className="input"
            value={form.ageGroup}
            onChange={e => set('ageGroup', e.target.value)}
          >
            {AGE_GROUPS.map(a => <option key={a}>{a}</option>)}
          </select>
        </div>

        {/* Class duration */}
        <div>
          <label className="label">Class Duration</label>
          <div className="flex gap-2">
            {DURATIONS.map(d => (
              <button
                key={d}
                type="button"
                onClick={() => set('classDuration', d)}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                  form.classDuration === d
                    ? 'bg-palestra text-white border-palestra'
                    : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {d} min
              </button>
            ))}
          </div>
        </div>

        {/* Week start */}
        <div>
          <label className="label">Week Commencing (Monday)</label>
          <input
            type="date"
            className="input"
            value={form.weekStart}
            onChange={e => set('weekStart', e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">Plans are submitted every 2 weeks.</p>
        </div>

        {/* Focus notes */}
        <div>
          <label className="label">Coach Notes / Focus for This Class</label>
          <textarea
            className="input resize-none"
            rows={3}
            placeholder="e.g. Focus on sharp counters after slips. Students need more hip rotation on the cross."
            value={form.focusNotes}
            onChange={e => set('focusNotes', e.target.value)}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading} className="btn-primary flex-1">
            {loading ? 'Generating plan...' : 'Generate Plan'}
          </button>
          <a href="/plans" className="btn-secondary">Cancel</a>
        </div>
      </form>
    </div>
  );
}
