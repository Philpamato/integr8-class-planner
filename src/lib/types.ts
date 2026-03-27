// ─── Martial Arts Styles ─────────────────────────────────────────────────────

export type Style = 'Karate' | 'Boxing' | 'BJJ' | 'MMA' | 'Muay Thai' | 'General';

export type Location = 'Bentleigh' | 'Cheltenham';

export type AgeGroup = 'Kids' | 'Teens' | 'Adults' | 'Mixed';

// ─── Quarterly Skill Focus Rotation ──────────────────────────────────────────

export type QuarterlyTheme =
  | 'Footwork & Movement'
  | 'Defense & Guard'
  | 'Attack & Combinations'
  | 'Sparring & Application';

export const QUARTERLY_THEMES: QuarterlyTheme[] = [
  'Footwork & Movement',   // Q1: Jan–Mar
  'Defense & Guard',       // Q2: Apr–Jun
  'Attack & Combinations', // Q3: Jul–Sep
  'Sparring & Application', // Q4: Oct–Dec
];

// ─── Drill Library ───────────────────────────────────────────────────────────

export type DrillFocus =
  | 'footwork'
  | 'defense'
  | 'attack'
  | 'combination'
  | 'conditioning'
  | 'technique'
  | 'warm-up'
  | 'cool-down'
  | 'sparring';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Drill {
  id: number;
  name: string;
  style: Style | 'General';
  focus: DrillFocus;
  difficulty: Difficulty;
  duration: number; // minutes
  instructions: string;
  equipment: string; // comma-separated, empty string if none
  createdAt: string;
}

// ─── Class Plan ──────────────────────────────────────────────────────────────

export type PlanStatus = 'draft' | 'submitted' | 'approved';

export interface PlanPhase {
  name: string;
  duration: number; // minutes
  drills: Drill[];
  notes: string;
}

export interface ClassPlan {
  id: number;
  title: string;
  coachName: string;
  location: Location;
  ageGroup: AgeGroup;
  style: Style;
  quarterlyTheme: QuarterlyTheme;
  classDuration: number; // minutes
  focusNotes: string; // coach input
  phases: PlanPhase[]; // stored as JSON
  status: PlanStatus;
  weekStart: string; // ISO date (start of 2-week block)
  submittedAt: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── DB Row Types (flat, for SQLite) ─────────────────────────────────────────

export interface ClassPlanRow {
  id: number;
  title: string;
  coachName: string;
  location: Location;
  ageGroup: AgeGroup;
  style: Style;
  quarterlyTheme: QuarterlyTheme;
  classDuration: number;
  focusNotes: string;
  phases: string; // JSON string
  status: PlanStatus;
  weekStart: string;
  submittedAt: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── API Payloads ─────────────────────────────────────────────────────────────

export interface CreatePlanInput {
  coachName: string;
  location: Location;
  ageGroup: AgeGroup;
  style: Style;
  classDuration: number;
  focusNotes: string;
  weekStart: string;
}

export interface UpdatePlanStatusInput {
  status: PlanStatus;
}
