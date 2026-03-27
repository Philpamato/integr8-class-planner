import { getDb } from './db';
import type {
  Drill,
  Style,
  AgeGroup,
  QuarterlyTheme,
  PlanPhase,
  DrillFocus,
  QUARTERLY_THEMES,
} from './types';

// ─── Quarter helpers ──────────────────────────────────────────────────────────

const THEMES: QuarterlyTheme[] = [
  'Footwork & Movement',    // Q1: Jan–Mar
  'Defense & Guard',        // Q2: Apr–Jun
  'Attack & Combinations',  // Q3: Jul–Sep
  'Sparring & Application', // Q4: Oct–Dec
];

export function getCurrentQuarterlyTheme(): QuarterlyTheme {
  const month = new Date().getMonth(); // 0-indexed
  const quarter = Math.floor(month / 3);
  return THEMES[quarter];
}

export function getQuarterlyThemeForDate(date: Date): QuarterlyTheme {
  const quarter = Math.floor(date.getMonth() / 3);
  return THEMES[quarter];
}

// ─── Phase timing (minutes) by total class duration ──────────────────────────

interface PhaseConfig {
  name: string;
  focus: DrillFocus[];
  durationRatio: number; // fraction of total class time
  maxDrills: number;
  notes: string;
}

function getPhaseConfigs(duration: number, theme: QuarterlyTheme): PhaseConfig[] {
  return [
    {
      name: 'Warm-Up',
      focus: ['warm-up', 'footwork', 'conditioning'],
      durationRatio: 0.15,
      maxDrills: 2,
      notes: 'Get the body moving, raise heart rate, loosen joints.',
    },
    {
      name: 'Drilling',
      focus: themeToDrillFocus(theme),
      durationRatio: 0.25,
      maxDrills: 3,
      notes: `Quarterly focus: ${theme}. Repetition-based practice.`,
    },
    {
      name: 'Technique',
      focus: ['technique', 'attack', 'defense', 'combination'],
      durationRatio: 0.25,
      maxDrills: 2,
      notes: 'Introduce or refine a core technique for the class.',
    },
    {
      name: 'Conditioning',
      focus: ['conditioning'],
      durationRatio: 0.15,
      maxDrills: 2,
      notes: 'Build functional strength, endurance, and resilience.',
    },
    {
      name: 'Sparring / Application',
      focus: ['sparring', 'combination'],
      durationRatio: 0.12,
      maxDrills: 1,
      notes: 'Apply techniques in a controlled live setting.',
    },
    {
      name: 'Cool-Down',
      focus: ['cool-down'],
      durationRatio: 0.08,
      maxDrills: 1,
      notes: 'Reduce heart rate, stretch, and reflect on the class.',
    },
  ];
}

function themeToDrillFocus(theme: QuarterlyTheme): DrillFocus[] {
  switch (theme) {
    case 'Footwork & Movement':   return ['footwork'];
    case 'Defense & Guard':       return ['defense'];
    case 'Attack & Combinations': return ['attack', 'combination'];
    case 'Sparring & Application': return ['sparring', 'combination'];
  }
}

// ─── Drill selection ─────────────────────────────────────────────────────────

function getDrills(style: Style, focus: DrillFocus[], difficulty: string): Drill[] {
  const db = getDb();

  const placeholders = focus.map(() => '?').join(', ');
  const rows = db
    .prepare(
      `SELECT * FROM drills
       WHERE focus IN (${placeholders})
         AND (style = ? OR style = 'General')
       ORDER BY RANDOM()`
    )
    .all(...focus, style) as Drill[];

  return rows;
}

function difficultyForAgeGroup(ageGroup: AgeGroup): string {
  switch (ageGroup) {
    case 'Kids':   return 'beginner';
    case 'Teens':  return 'intermediate';
    case 'Adults': return 'intermediate';
    case 'Mixed':  return 'beginner';
  }
}

// ─── Main generator ──────────────────────────────────────────────────────────

export function generatePlan(
  style: Style,
  ageGroup: AgeGroup,
  classDuration: number,
  focusNotes: string,
  weekStart: string
): { phases: PlanPhase[]; theme: QuarterlyTheme; title: string } {
  const date = new Date(weekStart);
  const theme = getQuarterlyThemeForDate(date);
  const difficulty = difficultyForAgeGroup(ageGroup);
  const phaseConfigs = getPhaseConfigs(classDuration, theme);

  const phases: PlanPhase[] = phaseConfigs.map((config) => {
    const allDrills = getDrills(style, config.focus, difficulty);
    const selected = allDrills.slice(0, config.maxDrills);
    const duration = Math.round(classDuration * config.durationRatio);

    return {
      name: config.name,
      duration,
      drills: selected,
      notes: config.notes,
    };
  });

  // Build title
  const weekLabel = new Date(weekStart).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const title = `${style} ${ageGroup} — ${theme} (w/c ${weekLabel})`;

  return { phases, theme, title };
}
