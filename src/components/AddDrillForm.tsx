'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Style, DrillFocus, Difficulty } from '@/lib/types';

const STYLES: (Style | 'General')[] = ['General', 'Karate', 'Boxing', 'BJJ', 'MMA', 'Muay Thai'];
const FOCUSES: DrillFocus[] = ['warm-up', 'footwork', 'defense', 'attack', 'combination', 'technique', 'conditioning', 'sparring', 'cool-down'];

export default function AddDrillForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    style: 'General' as Style | 'General',
    focus: 'technique' as DrillFocus,
    difficulty: 'beginner' as Difficulty,
    duration: 5,
    instructions: '',
    equipment: '',
  });

  function set(field: string, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await fetch('/api/drills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setLoading(false);
    setOpen(false);
    setForm({ name: '', style: 'General', focus: 'technique', difficulty: 'beginner', duration: 5, instructions: '', equipment: '' });
    router.refresh();
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="btn-secondary text-sm">
        + Add Drill to Library
      </button>
    );
  }

  return (
    <div className="card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-midnight">Add New Drill</h3>
        <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="label">Drill Name</label>
            <input type="text" required className="input" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label className="label">Style</label>
            <select className="input" value={form.style} onChange={e => set('style', e.target.value)}>
              {STYLES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Focus</label>
            <select className="input" value={form.focus} onChange={e => set('focus', e.target.value)}>
              {FOCUSES.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Difficulty</label>
            <select className="input" value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="label">Duration (min)</label>
            <input type="number" min={1} max={30} className="input" value={form.duration} onChange={e => set('duration', Number(e.target.value))} />
          </div>
          <div className="col-span-2">
            <label className="label">Instructions</label>
            <textarea className="input resize-none" rows={2} value={form.instructions} onChange={e => set('instructions', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="label">Equipment (optional)</label>
            <input type="text" className="input" placeholder="e.g. Pads, gloves" value={form.equipment} onChange={e => set('equipment', e.target.value)} />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button type="submit" disabled={loading} className="btn-primary text-sm">
            {loading ? 'Saving...' : 'Save Drill'}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="btn-secondary text-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
}
