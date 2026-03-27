/**
 * Simple JSON file store — no native compilation needed.
 * Data is persisted in /data/drills.json and /data/plans.json.
 */
import fs from 'fs';
import path from 'path';
import type { Drill, ClassPlanRow } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson<T>(file: string): T[] {
  ensureDir();
  const p = path.join(DATA_DIR, file);
  if (!fs.existsSync(p)) return [];
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return [];
  }
}

function writeJson<T>(file: string, data: T[]) {
  ensureDir();
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2), 'utf-8');
}

function nextId<T extends { id: number }>(items: T[]): number {
  return items.length === 0 ? 1 : Math.max(...items.map(i => i.id)) + 1;
}

// ─── Drills ──────────────────────────────────────────────────────────────────

export const drillsDb = {
  all(): Drill[] {
    return readJson<Drill>('drills.json');
  },

  find(id: number): Drill | undefined {
    return this.all().find(d => d.id === id);
  },

  filter(predicate: (d: Drill) => boolean): Drill[] {
    return this.all().filter(predicate);
  },

  insert(data: Omit<Drill, 'id' | 'createdAt'>): Drill {
    const drills = this.all();
    const drill: Drill = {
      ...data,
      id: nextId(drills),
      createdAt: new Date().toISOString(),
    };
    writeJson('drills.json', [...drills, drill]);
    return drill;
  },

  count(): number {
    return this.all().length;
  },
};

// ─── Plans ───────────────────────────────────────────────────────────────────

export const plansDb = {
  all(): ClassPlanRow[] {
    return readJson<ClassPlanRow>('plans.json');
  },

  find(id: number): ClassPlanRow | undefined {
    return this.all().find(p => p.id === id);
  },

  filter(predicate: (p: ClassPlanRow) => boolean): ClassPlanRow[] {
    return this.all().filter(predicate);
  },

  insert(data: Omit<ClassPlanRow, 'id'>): ClassPlanRow {
    const plans = this.all();
    const plan: ClassPlanRow = { ...data, id: nextId(plans) };
    writeJson('plans.json', [...plans, plan]);
    return plan;
  },

  update(id: number, patch: Partial<ClassPlanRow>): ClassPlanRow | undefined {
    const plans = this.all();
    const idx = plans.findIndex(p => p.id === id);
    if (idx === -1) return undefined;
    plans[idx] = { ...plans[idx], ...patch };
    writeJson('plans.json', plans);
    return plans[idx];
  },

  delete(id: number) {
    writeJson('plans.json', this.all().filter(p => p.id !== id));
  },
};
